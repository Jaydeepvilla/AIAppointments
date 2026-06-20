import { pgTable, text, timestamp, serial, integer, decimal, date, boolean } from 'drizzle-orm/pg-core'

// --- App tables ------------------------------------------------------------
// Add your app tables below. Always include a plain `userId` column so queries
// can be scoped per user — the security model depends on this column existing,
// not on a foreign key. Do NOT add a foreign key constraint
// (`.references(() => user.id, ...)`) unless the user explicitly asks for
// foreign keys or referential integrity; FK constraints make iterating on the
// schema harder.
//
// Example:
//
// import { serial } from "drizzle-orm/pg-core"
//
export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  durationMinutes: integer('durationMinutes').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const availability = pgTable('availability', {
  id: serial('id').primaryKey(),
  dayOfWeek: integer('dayOfWeek').notNull(),
  startTime: text('startTime').notNull(),
  endTime: text('endTime').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const appointments = pgTable('appointments', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  serviceId: integer('serviceId').notNull(),
  appointmentDate: date('appointmentDate').notNull(),
  appointmentTime: text('appointmentTime').notNull(),
  patientName: text('patientName').notNull(),
  patientEmail: text('patientEmail').notNull(),
  patientPhone: text('patientPhone').notNull(),
  status: text('status').notNull().default('pending'),
  notes: text('notes'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

// --- Demo Tables ------------------------------------------------------------

export const demoCustomers = pgTable('demo_customers', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  notes: text('notes'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const demoStaff = pgTable('demo_staff', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  name: text('name').notNull(),
  role: text('role').notNull(), // Dentist, Hygienist, Receptionist, etc.
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const demoAppointments = pgTable('demo_appointments', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  serviceId: integer('serviceId').notNull(),
  customerId: integer('customerId').notNull(),
  staffId: integer('staffId').notNull(),
  appointmentDate: date('appointmentDate').notNull(),
  appointmentTime: text('appointmentTime').notNull(),
  patientName: text('patientName').notNull(),
  patientEmail: text('patientEmail').notNull(),
  patientPhone: text('patientPhone').notNull(),
  status: text('status').notNull().default('pending'),
  notes: text('notes'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const demoWorkflows = pgTable('demo_workflows', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  name: text('name').notNull(),
  trigger: text('trigger').notNull(), // e.g. "Appointment Created", "Status Changed"
  status: text('status').notNull().default('active'), // active, inactive
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const demoNotifications = pgTable('demo_notifications', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: text('type').notNull().default('info'), // info, success, warning, error
  read: boolean('read').notNull().default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

