import IORedis from 'ioredis'
import Redlock from 'redlock'
import dotenv from 'dotenv'

dotenv.config()

// Create a new Redis client instance.
// This client can be shared across different parts of your application.
export const redisClient = new IORedis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  maxRetriesPerRequest: null,
})

// Instantiate Redlock
export const redlock = new Redlock(
  [redisClient],
  {
    // The amount of time in milliseconds to retry acquiring a lock
    retryCount: 10,
    retryDelay: 200, // wait 200ms between retries
  }
);