import { Worker } from "bullmq";
import dotenv from 'dotenv'
import { PrismaClient } from "./generated/prisma";
import { sendEmail } from './config/mailer'

dotenv.config()
const prisma = new PrismaClient()

const redisConnection = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
}

// The Worker is the process that handles the jobs from the queue.
const worker = new Worker('auctions', async job => {
  console.log(`Processing job ${job.id} of type ${job.name}`)

  if (job.name === 'start-auction') {
    const { auctionId } = job.data;
    try {
      // We only update if the auction is still PENDING
      await prisma.auction.updateMany({
        where: {
          id: auctionId,
          status: 'PENDING'
        },
        data: { status: 'ACTIVE' },
      });
      console.log(`Auction ${auctionId} has been marked as ACTIVE.`);
    } catch (error) {
      console.error(`Failed to start auction ${auctionId}`, error);
    }
  }

  if (job.name === 'end-auction') {
    const { auctionId } = job.data
    try {
      // Find the winning bid (the highest one)
      const winningBid = await prisma.bid.findFirst({
        where: { auctionId },
        orderBy: { amount: 'desc' },
        include: { user: true }, // Include the bidder's user details
      });

      if (winningBid) {
        // If there's a winner, update status to SOLD
        await prisma.auction.update({
          where: { id: auctionId },
          data: { status: 'SOLD' },
        });
        console.log(`Auction ${auctionId} has been marked as SOLD.`);

        // Send a congratulatory email to the winner
        await sendEmail({
          to: winningBid.user.email,
          subject: 'Congratulations! You won an auction!',
          html: `
           <h1>You're a Winner!</h1>
           <p>Congratulations, you won the auction for <strong>${winningBid.auctionId}</strong> with a bid of <strong>$${winningBid.amount}</strong>.</p>
           <p>Please proceed to payment.</p>
         `,
        });
      } else {
        // If there are no bids, mark as FINISHED
        await prisma.auction.update({
          where: { id: auctionId },
          data: { status: 'FINISHED' },
        });
        console.log(`Auction ${auctionId} finished with no bids.`)
      }

    } catch (error) {
      console.error(`Failed to finish auction ${auctionId}`, error)
    }
  }
}, { connection: redisConnection })

console.log('Auction worker started...')

worker.on('completed', job => {
  console.log(`Job ${job.id} has completed!`);
})

worker.on('failed', (job, err) => {
  console.log(`Job ${job?.id} has failed with ${err.message}`);
})