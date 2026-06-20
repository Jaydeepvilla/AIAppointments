'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { services } from '@/lib/db/schema'
import * as demoAppointments from '@/lib/demo-data/appointments'

export async function getAppointments() {
  return demoAppointments.getAppointments()
}

export async function getAdminAppointments() {
  return demoAppointments.getAdminAppointments()
}

export async function getUpcomingAppointments() {
  return demoAppointments.getUpcomingAppointments()
}

export async function getRevenueData() {
  return demoAppointments.getRevenueData()
}

export async function createAppointment(data: {
  serviceId: number
  appointmentDate: string
  appointmentTime: string
  patientName: string
  patientEmail: string
  patientPhone: string
  notes?: string
}) {
  const result = await demoAppointments.createAppointment(data)
  revalidatePath('/dashboard')
  return result
}

export async function updateAppointmentStatus(
  appointmentId: number,
  status: string
) {
  const result = await demoAppointments.updateAppointmentStatus(appointmentId, status)
  revalidatePath('/dashboard')
  return result
}

export async function rescheduleAppointment(
  appointmentId: number,
  date: string,
  time: string
) {
  const result = await demoAppointments.rescheduleAppointment(appointmentId, date, time)
  revalidatePath('/dashboard')
  return result
}

export async function deleteAppointment(appointmentId: number) {
  const result = await demoAppointments.deleteAppointment(appointmentId)
  revalidatePath('/dashboard')
  return result
}

export async function getServices() {
  return db.select().from(services).orderBy(services.name)
}

export async function getAllServices() {
  return db.select().from(services).orderBy(services.name)
}
