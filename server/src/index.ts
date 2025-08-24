import express, { Express, Request, Response} from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { PrismaClient } from './generated/prisma'
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth'
import profileRoutes from './routes/profile'


dotenv.config()

const app: Express = express()
const port = process.env.port || 3001
const prisma = new PrismaClient()

app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.get('/health', (req: Request, res: Response)=>{
    res.status(200).send('OK')
})

app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)

async function main(){
    app.listen(port, ()=>{
        console.log(`[server]: Server is running at http://localhost:${port}`)
    })
}
main()
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
