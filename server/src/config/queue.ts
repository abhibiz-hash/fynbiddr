import { Queue } from "bullmq";
import dotenv from 'dotenv'

dotenv.config()

const redisConnection = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT || '6379', 10)
}

// Create a new queue instance that we will use to add jobs.
// We've named it 'auctions' to be specific.
export const auctionQueue = new Queue('auctions', {
  connection: redisConnection,
})