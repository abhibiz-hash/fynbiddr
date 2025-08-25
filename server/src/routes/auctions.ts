import { Router, Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";
import { z } from 'zod'
import { authenticateToken } from "../middleware/authMiddleware";
import { isSeller } from "../middleware/roleMiddleware";

const router = Router()
const prisma = new PrismaClient()

// Zod schema for auction creation validation
const createAuctionSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    startingPrice: z.number().positive('Starting price must be positive'),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
}).refine(data => data.startTime < data.endTime, {
    message: 'End time must be after start time',
    path: ['endTime'],
})

//Zod schema to update auction
const updateAuctionSchema = z.object({
    title: z.string().min(1, 'title is required').optional(),
    description: z.string().min(1, 'Description is required').optional(),
    startingPrice: z.number().positive('Starting price must be positive').optional(),
}).refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
})

const createAuction = async (req: Request, res: Response) => {
    try {
        const data = createAuctionSchema.parse(req.body)
        const sellerId = req.user?.userId
        if (!sellerId) {
            return res.status(403).json({ message: 'User not found in token.' });
        }
        const auction = await prisma.auction.create({
            data: {
                ...data,
                currentPrice: data.startingPrice, // Set current price to starting price
                sellerId: sellerId,
            },
        })
        res.status(201).json(auction)

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.issues });
        }
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
const getAllAuctions = async (req: Request, res: Response) => {
    try {
        const auctions = await prisma.auction.findMany({
            include: {
                seller: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        })
        res.status(200).json(auctions)
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
    }
}
const getAuctionById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const auction = await prisma.auction.findUnique({
            where: { id },
            include: {
                seller: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        })

        if (!auction) {
            return res.status(404).json({ message: 'Auction not found' });
        }
        res.status(200).json(auction)
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
    }
}
const updateAuction = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const userId = req.user?.userId

        const auction = await prisma.auction.findUnique({ where: { id } })
        if (!auction) {
            return res.status(404).json({ message: 'Auction not found' });
        }
        if (auction.sellerId !== userId) {
            return res.status(403).json({ message: 'You can only update your own auctions' })
        }
        //validating the req body
        const data = updateAuctionSchema.parse(req.body)

        const updatedAuction = await prisma.auction.update({
            where: { id },
            data,
        })
        res.status(200).json(updateAuction)

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.issues });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
}
const deleteAuction = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const userId = req.user?.userId

        const auction = await prisma.auction.findUnique({ where: { id } })
        if (!auction) {
            return res.status(404).json({ message: 'Auction not found' })
        }
        if (auction?.sellerId !== userId) {
            return res.status(403).json({ message: 'Forbidden: You can only delete your own auctions.' })
        }
        await prisma.auction.delete({ where: { id } })
        res.status(204).send()
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
    }
}



router.post('/', authenticateToken, isSeller, createAuction)
router.get('/', getAllAuctions)
router.get('/:id', getAuctionById)
router.put('/:id', authenticateToken, isSeller, updateAuction)
router.delete('/:id', authenticateToken, isSeller, deleteAuction)


export default router