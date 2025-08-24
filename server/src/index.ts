import express, { Express, Request, Response} from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { PrismaClient } from './generated/prisma'
dotenv.config()

const app: Express = express()
const port = process.env.port || 3001
const prisma = new PrismaClient()

app.use(cors())
app.use(express.json())

app.get('/health', (req: Request, res: Response)=>{
    res.status(200).send('OK')
})

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
