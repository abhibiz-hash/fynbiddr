import express, { Router, Request, Response } from 'express'
import { PrismaClient } from '../generated/prisma'
import { authenticateToken } from '../middleware/authMiddleware';
import { razorpay } from '../config/razorpay'
import crypto from 'crypto'



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

// Controller to verify a Razorpay payment
const verifyPayment = async (req: Request, res: Response) => {
    const secret = process.env.RAZORPAY_KEY_SECRET!

    // 1. Get signature from header and body from the request
    const razorpaySignature = req.headers['x-razorpay-signature']
    const body = req.body

    // 2. Create an HMAC SHA256 hash
    const shasum = crypto.createHmac('sha256', secret)
    shasum.update(JSON.stringify(body))
    const digest = shasum.digest('hex')

    // 3. Compare our generated signature with the one from Razorpay
    if (digest !== razorpaySignature) {
        console.warn('Webhook signature verification failed.')
        return res.status(400).json({ message: 'Invalid signature' })
    }

    // 4. If signature is valid, process the event
    const { order_id, id: payment_id } = req.body.payload.payment.entity
    console.log(`Webhook received for Order ID: ${order_id}, Payment ID: ${payment_id}`)

    try {
        // Use a transaction to update payment and auction status
        await prisma.$transaction(async (tx) => {
            const payment = await tx.payment.update({
                where: { razorpayOrderId: order_id },
                data: {
                    status: 'PAID',
                    razorpayPaymentId: payment_id,
                    razorpaySignature: razorpaySignature
                },
            })

            await tx.auction.update({
                where: { id: payment.auctionId },
                data: { status: 'SOLD' },
            })

        })

        console.log(`Payment for auction ${order_id} verified and marked as SOLD.`);
        res.json({ status: 'ok' })

    } catch (error) {
        console.error('Error processing webhook:', error)
        res.status(500).json({ message: 'Error updating database.' })
    }
}




router.post('/create-order', authenticateToken, createOrder)

// Webhook route for Razorpay to send payment confirmation
// We use express.json() here because we stringify the raw body for verification
router.post('/verify', express.json(), verifyPayment)

export default router