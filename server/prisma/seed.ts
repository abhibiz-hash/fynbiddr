import { PrismaClient } from '../src/generated/prisma'
const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')
  const categories = [
    'Electronics',
    'Collectibles',
    'Art & Decor',
    'Vehicles',
    'Fashion',
    'Sporting Goods'
  ]

  for (const name of categories) {
    await prisma.category.create({
      data: { name },
    })
  }
  console.log('Seeding finished.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })