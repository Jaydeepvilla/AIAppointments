import { seedDemoDataForUser } from '../lib/demo-data/seed'

async function run() {
  const userId = process.argv[2] || 'demo_user'
  console.log(`Seeding demo data for user: ${userId}...`)
  try {
    const result = await seedDemoDataForUser(userId)
    if (result.success) {
      console.log('Seeding completed successfully!')
      process.exit(0)
    }
  } catch (error) {
    console.error('Seeding failed:', error)
    process.exit(1)
  }
}

run()
