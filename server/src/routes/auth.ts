import { Router, Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";
import argon2 from 'argon2'
import jwt from "jsonwebtoken";


const router = Router()
const prisma = new PrismaClient()

const registerUser = async (req: Request, res: Response) => {
    try {
        const { email, password, firstName, lastName } = req.body
        if (!email || !password || !firstName) {
            return res.status(400).json({ message: 'Email, password and firstname are required.' })
        }

        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) {
            return res.status(409).json({ message: 'User with this email already exists.' })
        }

        const hashedPassword = await argon2.hash(password)
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
            },
        })

        res.status(200).json({
            id: user.id,
            email: user.email,
            message: 'User created successfully'
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}
const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' })
        }

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }
        const isPasswordValid = await argon2.verify(user.password, password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        const accessToken = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: '15m' } //short-lived
        )
        const refreshToken = jwt.sign(
            { userId: user.id },
            process.env.REFRESH_TOKEN_SECRET!,
            { expiresIn: '7d' },
        )

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true, // Prevents client-side JS from accessing the cookie
            secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
            sameSite: 'strict', // Helps mitigate CSRF attacks
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })

        res.status(200).json({ accessToken })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}
const refreshToken = (req: Request, res: Response)=>{
    const token = req.cookies.refreshToken
    if(!token){
        return res.status(401).json({ message: 'No refresh token provided.' })
    }
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!, (err: any, user: any) => {
        if(err){
            return res.status(403).json({ message: 'Refresh token is not valid.' })
        }

        const accessToken = jwt.sign(
            {userId:user.userId, role: user.role},
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: '15m' }
        )
        res.json({ accessToken })
    })
}
const logoutUser = (req: Request, res: Response)=>{
    res.clearCookie('refreshToken')
    res.status(200).json({ message: 'Logged out successfully.' })
}

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/refresh', refreshToken)
router.post('/logout', logoutUser)


export default router
