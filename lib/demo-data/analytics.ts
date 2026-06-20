import { db } from '@/lib/db'
import { appointments, demoAppointments, services, demoStaff } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { auth } from '@clerk/nextjs/server'

const isDemo = () => process.env.DEMO_MODE === 'true' || process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

async function getUserId() {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  return userId
}

export async function getDashboardMetrics() {
  const userId = await getUserId()
  const todayStr = new Date().toISOString().split('T')[0]
  
  const aptTable = isDemo() ? demoAppointments : appointments

  // Fetch appointments and join services
  const allApts = await db
    .select({
      id: aptTable.id,
      status: aptTable.status,
      appointmentDate: aptTable.appointmentDate,
      price: services.price,
      durationMinutes: services.durationMinutes,
    })
    .from(aptTable)
    .innerJoin(services, eq(aptTable.serviceId, services.id))
    .where(eq(aptTable.userId, userId))

  const total = allApts.length
  
  // Calculate Today's Appointments
  const todayApts = allApts.filter(a => a.appointmentDate === todayStr).length

  // Calculate Upcoming Appointments (next 7 days)
  const upcomingApts = allApts.filter(a => {
    const date = new Date(a.appointmentDate)
    const today = new Date(todayStr)
    const diffTime = date.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays >= 0 && diffDays <= 7 && a.status !== 'cancelled'
  }).length

  // Calculate Completed Appointments
  const completed = allApts.filter(a => a.status === 'completed').length

  // Calculate Revenue
  const revenue = allApts
    .filter(a => a.status === 'completed')
    .reduce((sum, a) => sum + parseFloat(a.price || '0'), 0)

  // Booking Rate (confirmed + completed vs total)
  const activeBookings = allApts.filter(a => a.status === 'confirmed' || a.status === 'completed').length
  const bookingRate = total > 0 ? Math.round((activeBookings / total) * 100) : 0

  // Utilization Rate calculation
  let staffCount = 5
  if (isDemo()) {
    const staffList = await db.select().from(demoStaff).where(eq(demoStaff.userId, userId))
    if (staffList.length > 0) staffCount = staffList.length
  }
  const totalStaffMinutesAvailable = staffCount * 40 * 60 // 40 hours per week in minutes
  
  // Sum of appointment duration in minutes
  const activeDurations = allApts
    .filter(a => a.status === 'confirmed' || a.status === 'completed')
    .reduce((sum, a) => sum + (a.durationMinutes || 30), 0)

  // Compute utilization rate
  const weeklyAvgDuration = activeDurations / 4
  const utilizationRate = Math.min(Math.round((weeklyAvgDuration / totalStaffMinutesAvailable) * 100), 100) || 0

  return {
    totalAppointments: total,
    todayAppointments: todayApts,
    upcomingAppointmentsCount: upcomingApts,
    completedAppointments: completed,
    totalRevenue: revenue,
    bookingRate,
    utilizationRate,
  }
}
