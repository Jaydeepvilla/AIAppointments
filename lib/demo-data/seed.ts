import { db } from '@/lib/db'
import {
  services,
  demoCustomers,
  demoStaff,
  demoAppointments,
  demoWorkflows,
  demoNotifications,
} from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function seedDemoDataForUser(userId: string) {
  // 1. Ensure services exist
  let existingServices = await db.select().from(services)
  if (existingServices.length === 0) {
    await db.insert(services).values([
      { name: 'Teeth Cleaning', description: 'Routine scaling, polishing, and examination.', durationMinutes: 30, price: '99.00' },
      { name: 'Dental Filling', description: 'Composite tooth-colored restoration for cavities.', durationMinutes: 45, price: '150.00' },
      { name: 'Root Canal Therapy', description: 'Endodontic treatment to save infected teeth.', durationMinutes: 90, price: '800.00' },
      { name: 'Teeth Whitening', description: 'Professional in-office bleaching treatment.', durationMinutes: 60, price: '250.00' },
      { name: 'Invisalign Consultation', description: 'Clear aligner assessment and treatment planning.', durationMinutes: 30, price: '80.00' },
      { name: 'Tooth Extraction', description: 'Simple or surgical removal of damaged teeth.', durationMinutes: 45, price: '200.00' },
    ])
    existingServices = await db.select().from(services)
  }

  // 2. Clear existing demo data for this user
  await db.delete(demoAppointments).where(eq(demoAppointments.userId, userId))
  await db.delete(demoCustomers).where(eq(demoCustomers.userId, userId))
  await db.delete(demoStaff).where(eq(demoStaff.userId, userId))
  await db.delete(demoWorkflows).where(eq(demoWorkflows.userId, userId))
  await db.delete(demoNotifications).where(eq(demoNotifications.userId, userId))

  // 3. Create 10 Staff Members
  const staffMembers = [
    { name: 'Dr. Sarah Johnson', role: 'Lead Dentist', email: 'sarah.johnson@dentalai.com', phone: '(555) 019-2831' },
    { name: 'Dr. Michael Chen', role: 'Orthodontist', email: 'michael.chen@dentalai.com', phone: '(555) 019-2832' },
    { name: 'Dr. Emma Wilson', role: 'Pediatric Dentist', email: 'emma.wilson@dentalai.com', phone: '(555) 019-2833' },
    { name: 'Dr. David Patel', role: 'Endodontist', email: 'david.patel@dentalai.com', phone: '(555) 019-2834' },
    { name: 'Lisa Anderson', role: 'Dental Hygienist', email: 'lisa.anderson@dentalai.com', phone: '(555) 019-2835' },
    { name: 'Robert Taylor', role: 'Dental Hygienist', email: 'robert.taylor@dentalai.com', phone: '(555) 019-2836' },
    { name: 'Karen White', role: 'Dental Hygienist', email: 'karen.white@dentalai.com', phone: '(555) 019-2837' },
    { name: 'Jessica Miller', role: 'Dental Hygienist', email: 'jessica.miller@dentalai.com', phone: '(555) 019-2838' },
    { name: 'Ashley Davis', role: 'Clinical Coordinator', email: 'ashley.davis@dentalai.com', phone: '(555) 019-2839' },
    { name: 'Matthew Martinez', role: 'Patient Relations', email: 'matthew.martinez@dentalai.com', phone: '(555) 019-2840' },
  ]

  const seededStaff = await db
    .insert(demoStaff)
    .values(staffMembers.map((s) => ({ ...s, userId })))
    .returning()

  // 4. Create 50 Customers
  const customerNames = [
    { first: 'James', last: 'Smith' }, { first: 'Mary', last: 'Johnson' },
    { first: 'John', last: 'Williams' }, { first: 'Patricia', last: 'Brown' },
    { first: 'Robert', last: 'Jones' }, { first: 'Jennifer', last: 'Garcia' },
    { first: 'Michael', last: 'Miller' }, { first: 'Elizabeth', last: 'Davis' },
    { first: 'William', last: 'Rodriguez' }, { first: 'Linda', last: 'Martinez' },
    { first: 'David', last: 'Hernandez' }, { first: 'Barbara', last: 'Lopez' },
    { first: 'Richard', last: 'Gonzalez' }, { first: 'Susan', last: 'Wilson' },
    { first: 'Joseph', last: 'Anderson' }, { first: 'Jessica', last: 'Thomas' },
    { first: 'Thomas', last: 'Taylor' }, { first: 'Sarah', last: 'Moore' },
    { first: 'Charles', last: 'Jackson' }, { first: 'Karen', last: 'Martin' },
    { first: 'Christopher', last: 'Lee' }, { first: 'Nancy', last: 'Perez' },
    { first: 'Daniel', last: 'Thompson' }, { first: 'Lisa', last: 'White' },
    { first: 'Matthew', last: 'Harris' }, { first: 'Betty', last: 'Sanchez' },
    { first: 'Anthony', last: 'Clark' }, { first: 'Margaret', last: 'Ramirez' },
    { first: 'Mark', last: 'Lewis' }, { first: 'Sandra', last: 'Robinson' },
    { first: 'Donald', last: 'Walker' }, { first: 'Ashley', last: 'Young' },
    { first: 'Steven', last: 'Allen' }, { first: 'Kimberly', last: 'King' },
    { first: 'Paul', last: 'Wright' }, { first: 'Emily', last: 'Scott' },
    { first: 'Andrew', last: 'Torres' }, { first: 'Donna', last: 'Nguyen' },
    { first: 'Joshua', last: 'Hill' }, { first: 'Michelle', last: 'Flores' },
    { first: 'Kenneth', last: 'Green' }, { first: 'Carol', last: 'Adams' },
    { first: 'Kevin', last: 'Nelson' }, { first: 'Amanda', last: 'Baker' },
    { first: 'Brian', last: 'Hall' }, { first: 'Melissa', last: 'Rivera' },
    { first: 'George', last: 'Campbell' }, { first: 'Deborah', last: 'Mitchell' },
    { first: 'Timothy', last: 'Carter' }, { first: 'Stephanie', last: 'Roberts' },
  ]

  const customerNotes = [
    'Sensitive gums. Prefers lukewarm water rinse.',
    'Slight anxiety, needs gentle guidance.',
    'Pre-existing crown on lower left molar.',
    'Invisalign candidate.',
    'High interest in teeth whitening.',
    'Hypertension, monitor vitals.',
    'Needs sedation for major procedures.',
    'Late worker. Prefers evening booking slots.',
    'Prefers texting for reminders.',
    'Has dental coverage via Aetna.',
    'No issues. Good dental hygiene.',
  ]

  const seededCustomers = await db
    .insert(demoCustomers)
    .values(
      customerNames.map((name, i) => ({
        userId,
        name: `${name.first} ${name.last}`,
        email: `${name.first.toLowerCase()}.${name.last.toLowerCase()}${i}@example.com`,
        phone: `(555) 01${10 + (i % 90)}-${1000 + i}`,
        notes: customerNotes[i % customerNotes.length],
      }))
    )
    .returning()

  // 5. Create 100+ Appointments (past 30 days to next 30 days)
  const times = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00']
  const statuses = ['completed', 'confirmed', 'pending', 'cancelled']
  const appointmentsToSeed = []

  // Generate 120 random appointments
  for (let i = 0; i < 120; i++) {
    // Select customer, staff, service
    const customer = seededCustomers[i % seededCustomers.length]
    const staff = seededStaff[i % seededStaff.length]
    const service = existingServices[i % existingServices.length]

    // Distribute dates: -30 days to +30 days
    const daysOffset = (i % 61) - 30 // -30 to 30
    const aptDate = new Date()
    aptDate.setDate(aptDate.getDate() + daysOffset)
    const dateStr = aptDate.toISOString().split('T')[0]

    // Select time
    const timeStr = times[i % times.length]

    // Select status based on date
    let status = 'pending'
    if (daysOffset < 0) {
      // Past appointments are mostly completed or cancelled
      status = i % 10 === 0 ? 'cancelled' : 'completed'
    } else if (daysOffset === 0) {
      // Today can be pending, confirmed, or completed
      status = i % 3 === 0 ? 'completed' : i % 3 === 1 ? 'confirmed' : 'pending'
    } else {
      // Future appointments are pending or confirmed
      status = i % 5 === 0 ? 'pending' : 'confirmed'
    }

    // Custom notes
    const notesList = [
      'First cleaning of the year.',
      'Check top-right molar sensitivity.',
      'Follow-up adjustment.',
      'Needs x-rays.',
      'Wants to discuss cosmetic bonding.',
      null,
    ]
    const note = notesList[i % notesList.length]

    appointmentsToSeed.push({
      userId,
      serviceId: service.id,
      customerId: customer.id,
      staffId: staff.id,
      appointmentDate: dateStr,
      appointmentTime: timeStr,
      patientName: customer.name,
      patientEmail: customer.email,
      patientPhone: customer.phone,
      status,
      notes: note,
    })
  }

  await db.insert(demoAppointments).values(appointmentsToSeed)

  // 6. Create Workflows
  const workflowsToSeed = [
    { name: '24h Appointment Reminder SMS', trigger: '24 Hours Before Appointment', status: 'active' },
    { name: 'Instant Confirmation Email', trigger: 'Appointment Booked', status: 'active' },
    { name: 'Post-Visit Feedback Survey', trigger: 'Appointment Completed', status: 'active' },
    { name: 'No-Show Recovery Sequence', trigger: 'Appointment Cancelled', status: 'inactive' },
    { name: '6-Month Recall Automated Call', trigger: '6 Months Since Last Visit', status: 'active' },
    { name: 'Insurance Verification Ping', trigger: '48 Hours Before Appointment', status: 'active' },
    { name: 'Patient Birthday Card Email', trigger: 'Patient Birthday', status: 'active' },
    { name: 'Reschedule Confirmation text', trigger: 'Appointment Updated', status: 'active' },
    { name: 'New Patient Intake Form Ping', trigger: 'New Patient Registration', status: 'active' },
    { name: 'Hygiene Visit Schedule Prompt', trigger: '3 Months Since Recall', status: 'inactive' },
  ]

  await db.insert(demoWorkflows).values(workflowsToSeed.map((w) => ({ ...w, userId })))

  // 7. Create Notifications
  const notificationsToSeed = [
    { title: 'New Appointment Booked', message: 'Emily Scott scheduled Teeth Cleaning on ' + new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString(), type: 'success', read: false },
    { title: 'Appointment Cancelled', message: 'Mark Lewis cancelled Root Canal Therapy on ' + new Date().toLocaleDateString(), type: 'error', read: false },
    { title: 'Workflow Executed', message: 'Sent 24h SMS Reminder to 8 patients today.', type: 'info', read: true },
    { title: 'Payment Confirmed', message: 'Received $250.00 from Susan Wilson for Teeth Whitening.', type: 'success', read: true },
    { title: 'Intake Form Completed', message: 'John Williams completed the Patient Intake form.', type: 'info', read: false },
    { title: 'Low Staff Availability', message: 'Only 1 hygienist available next Wednesday.', type: 'warning', read: false },
    { title: 'Demo Mode Activated', message: 'Using fully loaded demo database with 100+ appointments.', type: 'info', read: false },
    { title: 'Backup Completed', message: 'Automatic database backup completed successfully.', type: 'success', read: true },
    { title: 'New Review Received', message: 'Dr. Sarah Johnson received a 5-star review from Patricia Brown.', type: 'success', read: true },
    { title: 'Feedback Form Alert', message: 'Negative feedback received from Robert Jones. Please review.', type: 'warning', read: false },
  ]

  await db.insert(demoNotifications).values(notificationsToSeed.map((n) => ({ ...n, userId })))

  return { success: true }
}
