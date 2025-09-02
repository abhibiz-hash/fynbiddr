import { Router, Request, Response } from "express"
import { PrismaClient } from "../generated/prisma"
import z from "zod"
import { authenticateToken } from "../middleware/authMiddleware"

const router = Router()
const prisma = new PrismaClient()

const updateUserSchema = z.object({
    firstName: z.string().min(1, 'First name is required').optional(),
    lastName: z.string().optional()
})

const getUserProfile = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                createdAt: true,
                auctions: {
                    select: {
                        id: true,
                        title: true,
                        currentPrice: true,
                        endTime: true
                    }
                }
            }
        })

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.json(user)
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
    }
}

const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' })
    }

    const data = updateUserSchema.parse(req.body)

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, email: true, firstName: true, lastName: true, role: true },
    })

    res.json(updatedUser)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.issues })
    }
    res.status(500).json({ message: 'Internal server error' })
  }
}



router.get('/:id', getUserProfile)
router.put("/me", authenticateToken, updateUserProfile)



export default router