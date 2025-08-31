import { Router, Request, Response } from 'express'
import { PrismaClient } from '../generated/prisma'
import { authenticateToken } from '../middleware/authMiddleware';
import { razorpay } from '../config/razorpay'


const router = Router()
const prisma = new PrismaClient()

// Controller to create a Razorpay order
const createOrder = async (req: Request, res: Response) => {
    try {
        const { auctionId } = req.body
        const userId = req.user?.userId
        if (!auctionId || !userId) {
            return res.status(400).json({ message: 'Auction ID and user ID are required.' });
        }
        // 1. Find the auction to get the final price
        const auction = await prisma.auction.findUnique({ where: { id: auctionId } })
        if (!auction) {
            return res.status(404).json({ message: 'Auction not found.' });
        }

        // Note: For now, we assume the auction is finished and the caller is the winner.
        // A real app would have logic to verify the winner.

        // 2. Prepare order options for Razorpay
        const options = {
            amount: Math.round(auction?.currentPrice * 100),
            currency: 'INR',
            receipt: `auc_${auction.id}`
        }

        // 3. Create the order with Razorpay
        const order = await razorpay.orders.create(options)

        // 4. Save a pending payment record in our database
        await prisma.payment.create({
            data: {
                auctionId: auction.id,
                userId: userId,
                amount: auction.currentPrice,
                razorpayOrderId: order.id,
                status: 'CREATED',
            }
        })

        // 5. Send the order ID and key ID back to the client
        res.json({
            orderId: order.id,
            keyId: process.env.RAZORPAY_KEY_ID,
        })

    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ message: 'Internal server error' })
    }
}

router.post('/create-order', authenticateToken, createOrder)

export default router