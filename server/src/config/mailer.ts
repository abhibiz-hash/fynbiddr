import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, //true for 465, false for other ports
    auth: {
        user: process.env.ETHEREAL_USER,
        pass: process.env.ETHEREAL_PASS
    },
})

interface EmailOptions {
    to: string,
    subject: string,
    html: string
}

export const sendEmail = async (options: EmailOptions) => {
    try {
        const info = await transporter.sendMail({
            from: '"Fynbiddr Auctions" <noreply@fynbiddr.com>',
            ...options,
        })

        console.log('Message sent: %s', info.messageId)
        
        // Log the URL to preview the sent email
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
    } catch (error) {
        console.error('Error sending email:', error);
        throw error
    }
}