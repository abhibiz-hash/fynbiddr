import express, { Express, Request, Response } from 'express'
import http from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
import cors from 'cors'
import { PrismaClient } from './generated/prisma'
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth'
import profileRoutes from './routes/profile'
import auctionRoutes from './routes/auctions'
import jwt from 'jsonwebtoken'
import { redlock } from './config/redis'


dotenv.config()


const app: Express = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Allow our React client
    methods: ["GET", "POST"]
  }
})

const port = process.env.PORT || 3001
const prisma = new PrismaClient()

app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.get('/health', (req: Request, res: Response) => {
  res.status(200).send('OK')
})

app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/auctions', auctionRoutes)


io.on('connection', (socket) => {
  console.log('a user connected:', socket.id)

  // Authenticate the user for this socket connection
  socket.on('authenticate', (token: string) => {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as { userId: string, role: string }
      // Attach user info to the socket instance
      socket.data.user = decoded
      console.log(`User ${socket.id} authenticated as ${socket.data.user.userId}`)

    } catch (error) {
      console.log(`User ${socket.id} authentication failed.`)
      socket.disconnect()
    }
  })
  // Listen for a client to join an auction room
  socket.on('join_auction', (auctionId: string) => {
    socket.join(auctionId)
    console.log(`User ${socket.id} joined auction room ${auctionId}`)
  })

  //Listen for new bids
  socket.on('place_bid', async ({ auctionId, amount }) => {
    // 1. Check if user is authenticated
    if (!socket.data.user) {
      return socket.emit('bid_error', { message: 'You must be logged in to bid.' })
    }
    // Define the resource to lock. One lock per auction.
    const lockResource = `auctions:${auctionId}`
    try {
      const { userId } = socket.data.user

      // Acquire a lock for this auction for a max of 10 seconds
      await redlock.using([lockResource], 10000, async (signal) => {
        console.log(`Lock acquired for resource: ${lockResource}`)

        // 2. Use a transaction to ensure data integrity
        const updatedAuction = await prisma.$transaction(async (tx) => {
          const auction = await tx.auction.findUnique({ where: { id: auctionId } })

          // 3. Validation checks
          if (!auction) throw new Error('Auction not found.')
          if (auction.endTime <= new Date()) throw new Error('Auction has ended.')
          if (amount <= auction.currentPrice) throw new Error('Bid must be higher than the current price.')
          if (auction.sellerId === userId) throw new Error('You cannot bid on your own auction.')

          // Check if the lock is still valid before committing
          if (signal.aborted) {
            throw new Error('Lock expired before transaction could complete.');
          }
          // 4. Create the new bid record
          await tx.bid.create({
            data: {
              amount,
              auctionId,
              userId,
            },
          })

          // 5. Update the auction's current price
          return tx.auction.update({
            where: { id: auctionId },
            data: { currentPrice: amount },
          })
        })

        // 6. Broadcast the new bid to everyone in the auction room
        io.to(auctionId).emit('new_bid', {
          amount: updatedAuction.currentPrice,
          userId: userId,
          // In a real app, we might fetch and send the user's name
        })
      }) // The lock is automatically released here

    } catch (error: any) {
      // 7. Send an error message back to the bidder
      socket.emit('bid_error', { message: error.message || 'An error occurred while placing your bid.' })
    }
  })

  // Listen for a client to leave an auction room
  socket.on('leave_auction', (auctionId: string) => {
    socket.leave(auctionId)
    console.log(`User ${socket.id} left auction room ${auctionId}`)
  })

  socket.on('disconnect', () => {
    console.log('a user disconnected:', socket.id)
  })
})


async function main() {
  server.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`)
  })
}
main()
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
