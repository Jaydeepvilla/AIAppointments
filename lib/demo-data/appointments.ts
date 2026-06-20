import { db } from '@/lib/db'
import { appointments, demoAppointments, services } from '@/lib/db/schema'
import { eq, gte, desc, and } from 'drizzle-orm'
import { auth } from '@clerk/nextjs/server'

const isDemo = () => process.env.DEMO_MODE === 'true' || process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

async function getUserId() {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  return userId
}

export async function getAppointments() {
  const userId = await getUserId()
  if (isDemo()) {
    return db
      .select()
      .from(demoAppointments)
      .where(eq(demoAppointments.userId, userId))
      .orderBy(desc(demoAppointments.createdAt))
  }
  return db
    .select()
    .from(appointments)
    .where(eq(appointments.userId, userId))
    .orderBy(desc(appointments.createdAt))
}

export async function getAdminAppointments() {
  const userId = await getUserId()
  if (isDemo()) {
    return db
      .select({
        id: demoAppointments.id,
        patientName: demoAppointments.patientName,
        patientEmail: demoAppointments.patientEmail,
        patientPhone: demoAppointments.patientPhone,
        appointmentDate: demoAppointments.appointmentDate,
        appointmentTime: demoAppointments.appointmentTime,
        status: demoAppointments.status,
        service: services.name,
        price: services.price,
      })
      .from(demoAppointments)
      .innerJoin(services, eq(demoAppointments.serviceId, services.id))
      .where(eq(demoAppointments.userId, userId))
      .orderBy(desc(demoAppointments.appointmentDate))
  }
  return db
    .select({
      id: appointments.id,
      patientName: appointments.patientName,
      patientEmail: appointments.patientEmail,
      patientPhone: appointments.patientPhone,
      appointmentDate: appointments.appointmentDate,
      appointmentTime: appointments.appointmentTime,
      status: appointments.status,
      service: services.name,
      price: services.price,
    })
    .from(appointments)
    .innerJoin(services, eq(appointments.serviceId, services.id))
    .where(eq(appointments.userId, userId))
    .orderBy(desc(appointments.appointmentDate))
}

export async function getUpcomingAppointments() {
  const userId = await getUserId()
  const today = new Date().toISOString().split('T')[0]
  if (isDemo()) {
    return db
      .select({
        id: demoAppointments.id,
        patientName: demoAppointments.patientName,
        appointmentDate: demoAppointments.appointmentDate,
        appointmentTime: demoAppointments.appointmentTime,
        service: services.name,
      })
      .from(demoAppointments)
      .innerJoin(services, eq(demoAppointments.serviceId, services.id))
      .where(and(gte(demoAppointments.appointmentDate, today), eq(demoAppointments.userId, userId)))
      .orderBy(demoAppointments.appointmentDate)
      .limit(5)
  }
  return db
    .select({
      id: appointments.id,
      patientName: appointments.patientName,
      appointmentDate: appointments.appointmentDate,
      appointmentTime: appointments.appointmentTime,
      service: services.name,
    })
    .from(appointments)
    .innerJoin(services, eq(appointments.serviceId, services.id))
    .where(and(gte(appointments.appointmentDate, today), eq(appointments.userId, userId)))
    .orderBy(appointments.appointmentDate)
    .limit(5)
}

export async function getRevenueData() {
  const userId = await getUserId()
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0]

  if (isDemo()) {
    return db
      .select({
        date: demoAppointments.appointmentDate,
        total: services.price,
      })
      .from(demoAppointments)
      .innerJoin(services, eq(demoAppointments.serviceId, services.id))
      .where(
        and(
          eq(demoAppointments.userId, userId),
          gte(demoAppointments.appointmentDate, thirtyDaysAgo),
          eq(demoAppointments.status, 'completed')
        )
      )
  }

  return db
    .select({
      date: appointments.appointmentDate,
      total: services.price,
    })
    .from(appointments)
    .innerJoin(services, eq(appointments.serviceId, services.id))
    .where(
      and(
        eq(appointments.userId, userId),
        gte(appointments.appointmentDate, thirtyDaysAgo),
        eq(appointments.status, 'completed')
      )
    )
}

export async function createAppointment(data: {
  serviceId: number
  customerId?: number
  staffId?: number
  appointmentDate: string
  appointmentTime: string
  patientName: string
  patientEmail: string
  patientPhone: string
  notes?: string
}) {
  const userId = await getUserId()
  if (isDemo()) {
    return db.insert(demoAppointments).values({
      userId,
      serviceId: data.serviceId,
      customerId: data.customerId || 1,
      staffId: data.staffId || 1,
      appointmentDate: data.appointmentDate,
      appointmentTime: data.appointmentTime,
      patientName: data.patientName,
      patientEmail: data.patientEmail,
      patientPhone: data.patientPhone,
      notes: data.notes || '',
      status: 'pending',
    }).returning()
  }
  return db.insert(appointments).values({
    userId,
    serviceId: data.serviceId,
    appointmentDate: data.appointmentDate,
    appointmentTime: data.appointmentTime,
    patientName: data.patientName,
    patientEmail: data.patientEmail,
    patientPhone: data.patientPhone,
    notes: data.notes || '',
    status: 'pending',
  }).returning()
}

export async function updateAppointmentStatus(appointmentId: number, status: string) {
  const userId = await getUserId()
  if (isDemo()) {
    return db
      .update(demoAppointments)
      .set({ status })
      .where(and(eq(demoAppointments.id, appointmentId), eq(demoAppointments.userId, userId)))
  }
  return db
    .update(appointments)
    .set({ status })
    .where(and(eq(appointments.id, appointmentId), eq(appointments.userId, userId)))
}

export async function rescheduleAppointment(appointmentId: number, date: string, time: string) {
  const userId = await getUserId()
  if (isDemo()) {
    return db
      .update(demoAppointments)
      .set({ appointmentDate: date, appointmentTime: time })
      .where(and(eq(demoAppointments.id, appointmentId), eq(demoAppointments.userId, userId)))
  }
  return db
    .update(appointments)
    .set({ appointmentDate: date, appointmentTime: time })
    .where(and(eq(appointments.id, appointmentId), eq(appointments.userId, userId)))
}

export async function deleteAppointment(appointmentId: number) {
  const userId = await getUserId()
  if (isDemo()) {
    return db
      .delete(demoAppointments)
      .where(and(eq(demoAppointments.id, appointmentId), eq(demoAppointments.userId, userId)))
  }
  return db
    .delete(appointments)
    .where(and(eq(appointments.id, appointmentId), eq(appointments.userId, userId)))
}
