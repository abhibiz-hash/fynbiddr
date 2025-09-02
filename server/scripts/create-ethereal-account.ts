import nodemailer from 'nodemailer'


const createTestAccount = async () => {
    try {
        const testAccount = await nodemailer.createTestAccount()
        console.log("Ethereal test account created successfully!")
        console.log("------------------------------------------")
        console.log("User: %s", testAccount.user)
        console.log("Pass: %s", testAccount.pass)
        console.log("------------------------------------------")
        console.log("You can preview messages sent with these credentials at: %s", testAccount.web)
    } catch (error) {
        console.error("Failed to create Ethereal test account:", error)
    }
}