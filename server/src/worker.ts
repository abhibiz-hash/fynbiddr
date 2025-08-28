import { Worker } from "bullmq";
import dotenv from 'dotenv'
import { PrismaClient } from "./generated/prisma";


dotenv.config()
const prisma = new PrismaClient()

const redisConnection = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
}

// The Worker is the process that handles the jobs from the queue.
const worker = new Worker('auctions', async job => {
  console.log(`Processing job ${job.id} of type ${job.name}`)

  if (job.name === 'end-auction') {
    const { auctionId } = job.data
    try {
      await prisma.auction.update({
        where: { id: auctionId },
        data: { status: 'FINISHED' },
      })
      console.log(`Auction ${auctionId} has been marked as FINISHED.`)
    } catch (error) {
      console.error(`Failed to finish auction ${auctionId}`, error)
    }
  }
}, { connection: redisConnection })

console.log('Auction worker started...')

worker.on('completed', job => {
  console.log(`Job ${job.id} has completed!`);
})

worker.on('failed', (job, err) => {
  console.log(`Job ${job?.id} has failed with ${err.message}`);
})