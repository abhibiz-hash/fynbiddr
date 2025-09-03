import { Router, Request, Response } from 'express'
import { PrismaClient } from '../generated/prisma'

const router = Router()
const prisma = new PrismaClient()

const getAllCategories = async (req: Request, res: Response) => {
    try {
        const categories = await prisma.category.findMany({
            orderBy: {
                name: 'asc',
            },
        })
        res.json(categories)
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
    }
}


router.get('/', getAllCategories)

export default router