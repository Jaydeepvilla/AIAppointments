'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Send, Sparkles, MessageSquare, Bot, User, CheckCircle2, Calendar,
  UserCheck, Activity, Bell, Info, AlertCircle, Shield, Phone, Mail,
  Stethoscope, ArrowLeft, Home, RefreshCw, X, ChevronRight, CreditCard,
  Check, ShieldCheck, Clock
} from 'lucide-react'
import { Tooth } from '@/components/tooth-icon'

// TS structures for the Demo component
interface DemoMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  cardType?: 'booking' | 'insurance' | 'escalation'
  cardData?: any
}

interface DemoAppointment {
  id: string
  patientName: string
  service: string
  date: string
  time: string
  doctor: string
  status: 'Pending' | 'Confirmed' | 'Rescheduled'
  revenue: number
}

interface DemoActionLog {
  id: string
  title: string
  description: string
  timestamp: string
  type: 'checked' | 'verified' | 'created' | 'escalated'
}

export function ChatbotDemo() {
  const getLucideIcon = (name?: string, className = "w-3.5 h-3.5") => {
    if (!name) return null
    switch (name) {
      case 'calendar': return <Calendar className={className} />
      case 'shield': return <Shield className={className} />
      case 'credit-card': return <CreditCard className={className} />
      case 'alert-circle': return <AlertCircle className={className} />
      case 'phone': return <Phone className={className} />
      case 'award': return <ShieldCheck className={className} />
      case 'arrow-left': return <ArrowLeft className={className} />
      case 'x': return <X className={className} />
      case 'clock': return <Clock className={className} />
      case 'home': return <Home className={className} />
      case 'users': return <UserCheck className={className} />
      case 'refresh': return <RefreshCw className={className} />
      default: return null
    }
  }

  const [messages, setMessages] = useState<DemoMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hi! I am SmileAI, your virtual dental concierge. I can help you check our services, find available slots, and book your visit in seconds. What would you like to do today?',
      timestamp: new Date().toISOString(),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [activeRightTab, setActiveRightTab] = useState<'timeline' | 'crm'>('timeline')

  // Patient Profile Details (extracted dynamically from conversational state)
  const [patientDetails, setPatientDetails] = useState({
    name: 'Anonymous Prospect',
    phone: 'Not provided',
    email: 'Not provided',
    insurance: 'Unverified',
    stage: 'Greeting'
  })

  const [bookingState, setBookingState] = useState<{
    step: 'idle' | 'service' | 'doctor' | 'date' | 'time' | 'contact' | 'review' | 'success'
    service?: string
    doctor?: { name: string; specialty: string; rating: string; exp: string; color: string }
    date?: string
    time?: string
    name?: string
    phone?: string
    email?: string
    insurance?: string
  }>({ step: 'idle' })

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const [contactName, setContactName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactInsurance, setContactInsurance] = useState('No Insurance')

  useEffect(() => {
    if (patientDetails) {
      setContactName(patientDetails.name === 'Anonymous Prospect' ? '' : patientDetails.name)
      setContactPhone(patientDetails.phone === 'Not provided' ? '' : patientDetails.phone)
      setContactEmail(patientDetails.email === 'Not provided' ? '' : patientDetails.email)
      setContactInsurance(patientDetails.insurance === 'Unverified' || patientDetails.insurance === 'No Insurance' ? 'No Insurance' : patientDetails.insurance)
    }
  }, [patientDetails])

  // Mock appointments for the CRM sidebar
  const [appointments, setAppointments] = useState<DemoAppointment[]>([])

  // AI Actions log timeline
  const [actionLogs, setActionLogs] = useState<DemoActionLog[]>([
    {
      id: 'log-1',
      title: 'Console Initialized',
      description: 'SmileAI booking agents initialized in clinical sandbox mode.',
      timestamp: new Date().toISOString(),
      type: 'checked'
    }
  ])

  // Notifications feed
  const [demoNotifications, setDemoNotifications] = useState<Array<{ id: string; text: string; date: string }>>([])

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  // Derive dynamic analytics from active simulator
  const activeBookingsCount = appointments.length
  const totalRevenue = appointments.reduce((sum, appt) => sum + appt.revenue, 0)
  const isQualified = patientDetails.stage === 'Booking Created' ? 100 : patientDetails.stage === 'Confirmation' ? 80 : patientDetails.stage === 'Appointment Collection' ? 50 : 20

  const progressBooking = (
    nextStep: 'idle' | 'service' | 'doctor' | 'date' | 'time' | 'contact' | 'review' | 'success',
    updates: any,
    userMessageText: string,
    assistantMessageText: string,
    customCardType?: 'booking' | 'insurance' | 'escalation',
    customCardData?: any
  ) => {
    // 1. Add User Message
    const userMsg: DemoMessage = {
      id: `m-u-${Date.now()}`,
      role: 'user',
      content: userMessageText,
      timestamp: new Date().toISOString()
    }
    setMessages(prev => [...prev, userMsg])

    // Add activity log
    setActionLogs(prev => [
      {
        id: `log-${Date.now()}`,
        title: 'User Message Received',
        description: `Analyzing natural language request: "${userMessageText.substring(0, 30)}..."`,
        timestamp: new Date().toISOString(),
        type: 'checked'
      },
      ...prev
    ])

    // 2. Set Booking State
    setBookingState(prev => ({
      ...prev,
      ...updates,
      step: nextStep
    }))

    // 3. Update Patient qualification stage based on step
    const stageMap: Record<string, string> = {
      service: 'Need Discovery',
      doctor: 'Need Discovery',
      date: 'Appointment Collection',
      time: 'Appointment Collection',
      contact: 'Confirmation',
      review: 'Confirmation',
      success: 'Booking Created'
    }
    const nextStage = stageMap[nextStep]
    if (nextStage) {
      setPatientDetails(prev => ({
        ...prev,
        stage: nextStage
      }))
    }

    // 4. Simulate Assistant Reply
    setIsTyping(true)
    setTimeout(() => {
      const assistantMsg: DemoMessage = {
        id: `m-a-${Date.now()}`,
        role: 'assistant',
        content: assistantMessageText,
        timestamp: new Date().toISOString(),
        cardType: customCardType,
        cardData: customCardData
      }

      setMessages(prev => [...prev, assistantMsg])
      setIsTyping(false)

      // Add to CRM database when finalized
      if (nextStep === 'success') {
        const finalService = updates.service || bookingState.service || 'Routine Cleaning'
        const finalDoctor = updates.doctor?.name || bookingState.doctor?.name || 'Dr. Sarah Johnson'
        const finalDate = updates.date || bookingState.date || 'June 22'
        const finalTime = updates.time || bookingState.time || '10:00 AM'
        const finalRevenue = finalService.includes('Crown') ? 950 : finalService.includes('Whitening') ? 300 : finalService.includes('Emergency') ? 200 : 150

        const newAppt: DemoAppointment = {
          id: `appt-${Date.now()}`,
          patientName: patientDetails.name === 'Anonymous Prospect' && updates.name ? updates.name : patientDetails.name,
          service: finalService,
          date: finalDate,
          time: finalTime,
          doctor: finalDoctor,
          status: 'Confirmed',
          revenue: finalRevenue
        }
        setAppointments(prev => [newAppt, ...prev])

        setPatientDetails(prev => ({
          ...prev,
          name: patientDetails.name === 'Anonymous Prospect' && updates.name ? updates.name : prev.name,
          phone: patientDetails.phone === 'Not provided' && updates.phone ? updates.phone : prev.phone,
          email: patientDetails.email === 'Not provided' && updates.email ? updates.email : prev.email,
          insurance: updates.insurance || prev.insurance
        }))

        // Log Timeline Actions
        setActionLogs(prev => [
          {
            id: `act-${Date.now()}`,
            type: 'created',
            title: 'Appointment Synchronized',
            description: `Booked ${newAppt.patientName} for ${newAppt.service} in Eaglesoft`,
            timestamp: new Date().toISOString()
          },
          ...prev
        ])

        // Add Notification Alert
        setDemoNotifications(prev => [
          {
            id: `notif-${Date.now()}`,
            text: `New Booking: ${newAppt.time} ${newAppt.service} Confirmed`,
            date: new Date().toLocaleTimeString()
          },
          ...prev
        ])
      }
    }, 1000)
  }

  const getQuickChips = (): Array<{ label: string; icon?: string; text?: string; action?: () => void }> => {
    switch (bookingState.step) {
      case 'idle':
        return [
          { label: 'Book Cleaning', icon: 'calendar', action: () => setBookingState({ step: 'service' }) },
          { label: 'Check MetLife Insurance', icon: 'shield', text: 'Do you accept MetLife insurance?' },
          { label: 'Implant Financing', icon: 'credit-card', text: 'What implant financing plans do you have?' },
          { label: 'Emergency Slot', icon: 'alert-circle', action: () => {
            setBookingState({ step: 'doctor', service: 'Emergency Visit' })
            const userMsg = { id: `msg-u-${Date.now()}`, role: 'user' as const, content: 'Emergency booking', timestamp: new Date().toISOString() }
            const assistMsg = { id: `msg-a-${Date.now()}`, role: 'assistant' as const, content: 'Emergency Visit chosen. Which doctor would you like to see?', timestamp: new Date().toISOString() }
            setMessages(prev => [...prev, userMsg, assistMsg])
          }},
          { label: 'Connect to Receptionist', icon: 'phone', text: 'Connect me to Lisa at the front desk' }
        ]
      case 'service':
        return [
          { label: 'Return to Home', icon: 'home', action: () => setBookingState({ step: 'idle' }) },
          { label: 'Ask a receptionist', icon: 'phone', text: 'Can I speak to someone?' }
        ]
      case 'doctor':
        return [
          { label: 'First Available', icon: 'award', action: () => {
            progressBooking(
              'date',
              { doctor: { name: 'First Available Dentist', specialty: 'Faster slot allocation', rating: '5.0 ★', exp: 'Any practitioner', color: 'from-emerald-400 to-emerald-600' } },
              'Selected First Available Dentist',
              'Excellent. Which day works best for your schedule?'
            )
          }},
          { label: 'Back to Services', icon: 'arrow-left', action: () => setBookingState({ step: 'service' }) },
          { label: 'Cancel Booking', icon: 'x', action: () => setBookingState({ step: 'idle' }) }
        ]
      case 'date':
        return [
          { label: 'Show Next Week', icon: 'calendar', action: () => {
            const assistMsg = { id: `msg-a-${Date.now()}`, role: 'assistant' as const, content: 'Fetching next week slots. We have slots starting Monday, June 29.', timestamp: new Date().toISOString() }
            setMessages(prev => [...prev, assistMsg])
          }},
          { label: 'Back to Doctor', icon: 'arrow-left', action: () => setBookingState(prev => ({ ...prev, step: 'doctor' })) },
          { label: 'Cancel Booking', icon: 'x', action: () => setBookingState({ step: 'idle' }) }
        ]
      case 'time':
        return [
          { label: 'Morning Slots Only', icon: 'clock', action: () => {
            const assistMsg = { id: `msg-a-${Date.now()}`, role: 'assistant' as const, content: 'Morning slots displayed below. Please select a morning time.', timestamp: new Date().toISOString() }
            setMessages(prev => [...prev, assistMsg])
          }},
          { label: 'Afternoon Slots Only', icon: 'clock', action: () => {
            const assistMsg = { id: `msg-a-${Date.now()}`, role: 'assistant' as const, content: 'Afternoon slots displayed below. Please select an afternoon time.', timestamp: new Date().toISOString() }
            setMessages(prev => [...prev, assistMsg])
          }},
          { label: 'Back to Date', icon: 'arrow-left', action: () => setBookingState(prev => ({ ...prev, step: 'date' })) }
        ]
      case 'contact':
        return [
          { label: 'Self-Pay (No Insurance)', icon: 'shield', action: () => {
            setContactInsurance('No Insurance')
            setTimeout(() => {
              const btn = document.getElementById('btn-demo-continue')
              if (btn) btn.click()
            }, 100)
          }},
          { label: 'Back to Times', icon: 'arrow-left', action: () => setBookingState(prev => ({ ...prev, step: 'time' })) },
          { label: 'Cancel Booking', icon: 'x', action: () => setBookingState({ step: 'idle' }) }
        ]
      case 'review':
        return [
          { label: 'Change Service', icon: 'arrow-left', action: () => setBookingState(prev => ({ ...prev, step: 'service' })) },
          { label: 'Change Date', icon: 'arrow-left', action: () => setBookingState(prev => ({ ...prev, step: 'date' })) },
          { label: 'Restart Booking', icon: 'x', action: () => setBookingState({ step: 'idle' }) }
        ]
      case 'success':
        return [
          { label: 'Go to Welcome Screen', icon: 'home', action: () => setBookingState({ step: 'idle' }) },
          { label: 'Book Family Member', icon: 'users', action: () => {
            setBookingState({ step: 'service' })
            const assistMsg = { id: `msg-a-${Date.now()}`, role: 'assistant' as const, content: 'Booking a family member. Select service:', timestamp: new Date().toISOString() }
            setMessages(prev => [...prev, assistMsg])
          }}
        ]
      default:
        return []
    }
  }

  const renderBookingWizard = () => {
    switch (bookingState.step) {
      case 'service':
        return (
          <div className="p-4 bg-card dark:bg-slate-900 border border-slate-200/40 dark:border-white/5 rounded-2xl shadow-sm space-y-3 animate-message text-foreground">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Step 1: Select Service
            </div>
            <div className="grid grid-cols-1 gap-2">
              {[
                { name: 'Routine Dental Cleaning', desc: 'Preventive cleaning, exam & polish', time: '45m', value: '$150' },
                { name: 'Dental Checkup & X-Rays', desc: 'Complete exam for new/returning patients', time: '30m', value: '$100' },
                { name: 'Implant Consultation', desc: 'Surgical implant assessment & scan', time: '30m', value: 'Free' },
                { name: 'Cosmetic Teeth Whitening', desc: 'Laser whitening treatment', time: '60m', value: '$300' },
                { name: 'Emergency Visit', desc: 'Same-day urgent toothache evaluation', time: '45m', value: '$200' }
              ].map((svc, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => progressBooking(
                    'doctor',
                    { service: svc.name },
                    `I want to book: ${svc.name}`,
                    `Excellent choice. Which doctor would you prefer to schedule with?`
                  )}
                  className="p-3 bg-white hover:bg-indigo-500/10 dark:bg-slate-950/40 border border-slate-200/60 dark:border-white/5 hover:border-indigo-500/30 rounded-xl text-left space-y-1 transition duration-150 cursor-pointer"
                >
                  <div className="flex justify-between items-center font-bold text-xs text-foreground">
                    <span>{svc.name}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-500">{svc.value}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-normal">{svc.desc}</p>
                  <div className="text-[9px] text-slate-400 font-mono">Duration: {svc.time}</div>
                </button>
              ))}
            </div>
          </div>
        )
      case 'doctor':
        return (
          <div className="p-4 bg-card dark:bg-slate-900 border border-slate-200/40 dark:border-white/5 rounded-2xl shadow-sm space-y-3 animate-message text-foreground">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Step 2: Choose Doctor
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {[
                { name: 'Dr. Sarah Johnson', specialty: 'General Dentist', rating: '4.9 ★', exp: '12 yrs exp', color: 'from-amber-400 to-amber-600' },
                { name: 'Dr. Emma Wilson', specialty: 'Orthodontist', rating: '4.8 ★', exp: '8 yrs exp', color: 'from-indigo-400 to-indigo-600' },
                { name: 'First Available Dentist', specialty: 'Fastest allocation', rating: '5.0 ★', exp: 'Any practitioner', color: 'from-emerald-400 to-emerald-600' }
              ].map((dr, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => progressBooking(
                    'date',
                    { doctor: dr },
                    `Book with: ${dr.name}`,
                    `Great. Which date works best for you?`
                  )}
                  className="p-3 bg-white hover:bg-indigo-500/10 dark:bg-slate-950/40 border border-slate-200/60 dark:border-white/5 hover:border-indigo-500/30 rounded-xl text-center space-y-2 transition duration-150 cursor-pointer flex flex-col items-center justify-between"
                >
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-tr ${dr.color} text-white flex items-center justify-center font-bold text-xs shadow-sm`}>
                    {dr.name.split(' ').pop()?.charAt(0) || 'D'}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-foreground">{dr.name}</div>
                    <p className="text-[9px] text-muted-foreground mt-0.5 leading-snug">{dr.specialty}</p>
                  </div>
                  <div className="pt-1.5 border-t border-slate-200/10 w-full flex items-center justify-between text-[9px] text-slate-400 font-medium">
                    <span>{dr.exp}</span>
                    <span className="text-amber-500 font-bold">{dr.rating}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )
      case 'date':
        return (
          <div className="p-4 bg-card dark:bg-slate-900 border border-slate-200/40 dark:border-white/5 rounded-2xl shadow-sm space-y-3 animate-message text-foreground">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Step 3: Select Date
            </div>
            <div className="grid grid-cols-5 gap-1">
              {[
                { day: 'Mon', date: 'Jun 22', full: 'Monday, June 22' },
                { day: 'Tue', date: 'Jun 23', full: 'Tuesday, June 23' },
                { day: 'Wed', date: 'Jun 24', full: 'Wednesday, June 24' },
                { day: 'Thu', date: 'Jun 25', full: 'Thursday, June 25' },
                { day: 'Fri', date: 'Jun 26', full: 'Friday, June 26' }
              ].map((dt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => progressBooking(
                    'time',
                    { date: dt.full },
                    `Date: ${dt.full}`,
                    `Excellent. Please choose an available time slot:`
                  )}
                  className="p-1 bg-white hover:bg-indigo-500/10 dark:bg-slate-950/45 border border-slate-200/60 dark:border-white/5 hover:border-indigo-500/30 rounded-xl text-center space-y-1 transition duration-150 cursor-pointer"
                >
                  <div className="text-[8px] text-slate-400 font-bold uppercase tracking-wide">{dt.day}</div>
                  <div className="font-extrabold text-[11px] text-foreground">{dt.date.split(' ')[1]}</div>
                  <span className="inline-block px-1 rounded bg-emerald-500/10 text-emerald-500 text-[7px] font-black uppercase mt-0.5">Open</span>
                </button>
              ))}
            </div>
          </div>
        )
      case 'time':
        return (
          <div className="p-4 bg-card dark:bg-slate-900 border border-slate-200/40 dark:border-white/5 rounded-2xl shadow-sm space-y-3 animate-message text-foreground">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Step 4: Choose Time ({bookingState.date})
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block text-center border-b pb-0.5">Morning</span>
                {['9:00 AM', '10:30 AM', '11:45 AM'].map((tm, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => progressBooking(
                      'contact',
                      { time: tm },
                      `Time: ${tm}`,
                      `Perfect. Please provide your contact details to complete the scheduling:`
                    )}
                    className="w-full py-1.5 bg-white hover:bg-indigo-500/10 dark:bg-slate-950/40 border border-slate-200/60 dark:border-white/5 hover:border-indigo-500/30 rounded-xl text-center font-bold text-xs text-foreground transition cursor-pointer"
                  >
                    {tm}
                  </button>
                ))}
              </div>
              <div className="space-y-1">
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block text-center border-b pb-0.5">Afternoon</span>
                {['1:30 PM', '2:45 PM', '4:00 PM'].map((tm, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => progressBooking(
                      'contact',
                      { time: tm },
                      `Time: ${tm}`,
                      `Perfect. Please provide your contact details to complete the scheduling:`
                    )}
                    className="w-full py-1.5 bg-white hover:bg-indigo-500/10 dark:bg-slate-950/40 border border-slate-200/60 dark:border-white/5 hover:border-indigo-500/30 rounded-xl text-center font-bold text-xs text-foreground transition cursor-pointer"
                  >
                    {tm}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )
      case 'contact':
        return (
          <div className="p-4 bg-card dark:bg-slate-900 border border-slate-200/40 dark:border-white/5 rounded-2xl shadow-sm space-y-3 animate-message text-foreground">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Step 5: Contact Details
            </div>
            <div className="space-y-2 text-xs text-foreground">
              <div className="space-y-0.5">
                <label className="text-[8px] text-slate-400 font-bold block uppercase">Full Name</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Jane Smith"
                  className="w-full px-3 py-1.5 border border-slate-200/60 dark:border-white/10 bg-white dark:bg-slate-950/40 rounded-xl focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>
              <div className="space-y-0.5">
                <label className="text-[8px] text-slate-400 font-bold block uppercase">Phone Number</label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="(555) 019-2834"
                  className="w-full px-3 py-1.5 border border-slate-200/60 dark:border-white/10 bg-white dark:bg-slate-950/40 rounded-xl focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>
              <div className="space-y-0.5">
                <label className="text-[8px] text-slate-400 font-bold block uppercase">Insurance Provider</label>
                <select
                  value={contactInsurance}
                  onChange={(e) => setContactInsurance(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200/60 dark:border-white/10 bg-white dark:bg-slate-950/40 rounded-xl focus:outline-none focus:border-indigo-500 font-bold text-xs font-sans"
                >
                  <option value="No Insurance">No Insurance (Self Pay)</option>
                  <option value="MetLife Dental">MetLife Dental</option>
                  <option value="Delta Dental Premier">Delta Dental Premier</option>
                  <option value="Cigna PPO">Cigna PPO</option>
                  <option value="Guardian Dental">Guardian Dental</option>
                </select>
              </div>
              <button
                id="btn-demo-continue"
                type="button"
                onClick={() => {
                  if (!contactName.trim() || !contactPhone.trim()) return
                  progressBooking(
                    'review',
                    { name: contactName, phone: contactPhone, email: contactEmail, insurance: contactInsurance },
                    `Contact: ${contactName} (${contactPhone})`,
                    `Almost done! Please review your booking details and confirm when ready:`
                  )
                }}
                disabled={!contactName.trim() || !contactPhone.trim()}
                className="w-full py-2 bg-indigo-655 hover:bg-indigo-600 disabled:opacity-40 disabled:pointer-events-none text-white text-[10px] font-bold tracking-wider uppercase rounded-xl transition cursor-pointer flex items-center justify-center gap-1 shadow-sm border border-indigo-500/20"
              >
                Continue ➔
              </button>
            </div>
          </div>
        )
      case 'review':
        return (
          <div className="p-4 bg-card dark:bg-slate-900 border border-slate-200/40 dark:border-white/5 rounded-2xl shadow-sm space-y-3 animate-message text-foreground">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Step 6: Review & Confirm
            </div>
            <div className="bg-indigo-500/5 dark:bg-white/[0.02] border border-indigo-500/10 dark:border-white/5 rounded-xl p-3 space-y-2 text-[10px] text-foreground font-medium">
              <div className="flex justify-between border-b border-slate-200/5 dark:border-white/5 pb-1">
                <span className="text-slate-400 font-bold uppercase text-[8px]">Treatment</span>
                <span className="font-bold text-foreground">{bookingState.service}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/5 dark:border-white/5 pb-1">
                <span className="text-slate-400 font-bold uppercase text-[8px]">Dentist</span>
                <span className="font-bold text-foreground">{bookingState.doctor?.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/5 dark:border-white/5 pb-1">
                <span className="text-slate-400 font-bold uppercase text-[8px]">Schedule</span>
                <span className="font-bold text-indigo-650 dark:text-indigo-400">{bookingState.date} at {bookingState.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold uppercase text-[8px]">Insurance</span>
                <span className="font-bold text-foreground">{bookingState.insurance}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setBookingState(prev => ({ ...prev, step: 'service' }))}
                className="flex-1 py-1.5 bg-white hover:bg-white dark:bg-white/5 dark:hover:bg-white/10 text-foreground font-bold text-xs rounded-xl transition cursor-pointer text-center"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={() => progressBooking(
                  'success',
                  {},
                  'Confirm Reservation',
                  'Congratulations! Your appointment is officially scheduled and synced directly into our Eaglesoft scheduling book!',
                  'booking',
                  {
                    service: bookingState.service,
                    date: bookingState.date,
                    time: bookingState.time,
                    doctor: bookingState.doctor?.name,
                    status: 'Confirmed'
                  }
                )}
                className="flex-1.5 py-1.5 bg-gradient-to-r from-indigo-650 to-violet-650 hover:from-indigo-655 hover:to-violet-650 dark:from-indigo-500 dark:to-violet-500 dark:hover:from-indigo-600 dark:hover:to-violet-600 text-white font-extrabold uppercase tracking-widest text-[10px] rounded-xl shadow-[0_4px_15px_rgba(99,102,241,0.3)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.45)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer text-center flex items-center justify-center gap-1"
              >
                Confirm ➔
              </button>
            </div>
          </div>
        )
      case 'success':
        return (
          <div className="p-4 bg-card dark:bg-slate-900 border border-slate-200/40 dark:border-white/5 rounded-2xl shadow-sm space-y-3 animate-message text-foreground">
            <div className="text-center space-y-1">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto shadow-inner">
                <Check className="w-4 h-4 text-emerald-500" />
              </div>
              <h5 className="font-extrabold text-xs text-foreground">Appointment Locked!</h5>
              <p className="text-[9px] text-slate-400">Eaglesoft Synced • Confirmation SMS sent</p>
            </div>
            <div className="space-y-1.5">
              <span className="text-[8px] font-black text-slate-455 uppercase tracking-widest block text-left">Actions</span>
              <div className="grid grid-cols-1 gap-1 text-[11px] text-foreground">
                <button
                  type="button"
                  onClick={() => {
                    const assistMsg = { id: `m-a-${Date.now()}`, role: 'assistant' as const, content: 'Invitation sent! Check your calendar for the .ics calendar file.', timestamp: new Date().toISOString() }
                    setMessages(prev => [...prev, assistMsg])
                  }}
                  className="p-2 bg-white hover:bg-white dark:bg-slate-950/40 border border-slate-200/60 dark:border-white/5 rounded-xl text-left font-bold transition cursor-pointer flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5 text-indigo-500" /> Add to Calendar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBookingState({ step: 'service' })
                    const assistMsg = { id: `m-a-${Date.now()}`, role: 'assistant' as const, content: 'Let\'s reschedule. Select your desired service to change slots:', timestamp: new Date().toISOString() }
                    setMessages(prev => [...prev, assistMsg])
                  }}
                  className="p-2 bg-white hover:bg-white dark:bg-slate-950/40 border border-slate-200/60 dark:border-white/5 rounded-xl text-left font-bold transition cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-violet-500" /> Reschedule slot
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBookingState({ step: 'idle' })
                    const userMsg = { id: `m-u-${Date.now()}`, role: 'user' as const, content: 'Cancel Appointment', timestamp: new Date().toISOString() }
                    const assistMsg = { id: `m-a-${Date.now()}`, role: 'assistant' as const, content: 'I have cancelled your upcoming appointment slot.', timestamp: new Date().toISOString() }
                    setMessages(prev => [...prev, userMsg, assistMsg])
                  }}
                  className="p-2 bg-white hover:bg-white dark:bg-slate-950/40 border border-slate-200/60 dark:border-white/5 rounded-xl text-left font-bold text-rose-500 transition cursor-pointer flex items-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5 text-rose-500" /> Cancel appointment slot
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setBookingState({ step: 'idle' })}
              className="w-full py-1.5 bg-white dark:bg-white/5 hover:bg-white text-foreground font-bold text-[9px] uppercase tracking-wider rounded-xl transition cursor-pointer text-center"
            >
              Return Home ➔
            </button>
          </div>
        )
      default:
        return null
    }
  }

  const handleSend = (textToSend: string) => {
    if (!textToSend?.trim()) return

    // 1. Add User Message
    const userMsg: DemoMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toISOString()
    }
    setMessages(prev => [...prev, userMsg])
    setIsTyping(true)

    // Add activity log
    setActionLogs(prev => [
      {
        id: `log-${Date.now()}`,
        title: 'User Message Received',
        description: `Analyzing natural language request: "${textToSend.substring(0, 30)}..."`,
        timestamp: new Date().toISOString(),
        type: 'checked'
      },
      ...prev
    ])

    // 2. Process custom reply simulator
    setTimeout(() => {
      let replyContent = "I can definitely help with that. Could you please specify which service (cleaning, whitening, extraction) you need?"
      let nextStage = patientDetails.stage
      let newLog: DemoActionLog | null = null
      let cardType: DemoMessage['cardType'] = undefined
      let cardData: any = null

      const text = textToSend.toLowerCase()

      if (text.includes('clean') || text.includes('checkup') || text.includes('whitening') || text.includes('filling') || text.includes('crown') || text.includes('implant')) {
        setBookingState({ step: 'doctor', service: 'Routine Cleaning' })
        nextStage = 'Need Discovery'
        replyContent = `Excellent, I've loaded the booking flow for teeth treatments. Which dentist would you prefer to schedule with?`
        newLog = {
          id: `log-${Date.now() + 1}`,
          title: 'Booking Flow Triggered',
          description: 'User initiated booking wizard via text.',
          timestamp: new Date().toISOString(),
          type: 'checked'
        }
      } 
      else if (text.includes('insurance') || text.includes('metlife') || text.includes('cigna') || text.includes('delta') || text.includes('guardian')) {
        nextStage = 'Confirmation'
        const providerName = text.includes('metlife') ? 'MetLife' : text.includes('cigna') ? 'Cigna' : 'Delta Dental'
        
        replyContent = `Perfect! I've run an automated eligibility check. Your ${providerName} coverage is active! Routine services are covered at 100% with a $0 copay. Shall we book that slot?`
        
        setPatientDetails(prev => ({
          ...prev,
          insurance: `${providerName} (Active)`,
        }))

        newLog = {
          id: `log-${Date.now() + 1}`,
          title: 'Insurance Verified',
          description: `API query verified benefits for ${providerName}`,
          timestamp: new Date().toISOString(),
          type: 'verified'
        }

        cardType = 'insurance'
        cardData = {
          provider: providerName,
          status: 'Active',
          copay: '$0 preventive',
          deductible: '$0.00'
        }
      } 
      else {
        replyContent = `I've logged your request. You can also proceed using the Book Visit action cards below or type more specific scheduling cues.`
      }

      // Add Assistant Message
      const assistMsg: DemoMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: replyContent,
        timestamp: new Date().toISOString(),
        cardType,
        cardData
      }

      setMessages(prev => [...prev, assistMsg])
      setIsTyping(false)

      // Update state entities
      setPatientDetails(prev => ({
        ...prev,
        stage: nextStage
      }))

      if (newLog) setActionLogs(prev => [newLog!, ...prev])
    }, 1200)
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isTyping) return
    const text = input
    setInput('')
    handleSend(text)
  }

  const handlePromptClick = (promptQuery: string) => {
    if (isTyping) return
    handleSend(promptQuery)
  }



  return (
    <div className="glass-lg border border-slate-200/40 dark:border-white/5 rounded-2xl flex flex-col md:flex-row h-[620px] shadow-2xl relative overflow-hidden group">
      
      {/* LEFT COLUMN: Patient AI Assistant (55% width) */}
      <div className="flex-1 flex flex-col h-full border-r-0 md:border-r border-slate-200/20 dark:border-white/5 relative">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-indigo-500/15 transition-all duration-750" />
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-200/20 dark:border-white/5 bg-white/40 dark:bg-slate-950/40 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center relative shadow-inner">
              <Tooth className="w-5.5 h-5.5 text-white" />
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border-2 border-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-foreground tracking-tight">SmileAI Assistant</h3>
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 border border-indigo-500/20 flex items-center gap-0.5 animate-pulse">
                  <Sparkles className="w-2.5 h-2.5" /> Interactive Demo
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">Test the patient-facing workflow here</p>
            </div>
          </div>
        </div>



        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 scrollbar-thin bg-white/5 dark:bg-slate-950/10">
          {messages.map((message) => {
            const isUser = message.role === 'user'
            return (
              <div key={message.id} className={`flex gap-3 animate-message ${isUser ? 'justify-end' : 'justify-start'}`}>
                {!isUser && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center flex-shrink-0 shadow-inner">
                    <Tooth className="w-4.5 h-4.5 text-white" />
                  </div>
                )}
                
                <div className="max-w-[80%] flex flex-col gap-1">
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                      isUser
                        ? 'bg-gradient-to-br from-indigo-650 to-indigo-700 text-white rounded-tr-none shadow-md font-medium'
                        : 'bg-card dark:bg-slate-900 border border-slate-200/40 dark:border-white/5 text-foreground rounded-tl-none shadow-sm font-medium'
                    }`}
                  >
                    <div className="whitespace-pre-line">{message.content}</div>

                    {/* Rich card elements */}
                    {message.cardType === 'insurance' && message.cardData && (
                      <div className="mt-2.5 p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl space-y-1.5 text-[10px]">
                        <div className="flex items-center justify-between border-b border-indigo-500/20 pb-1 font-bold text-indigo-650 dark:text-indigo-300">
                          <span>SHIELD VERIFIED</span>
                          <span>{message.cardData.status}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-muted-foreground font-mono">
                          <div>Provider: <strong>{message.cardData.provider}</strong></div>
                          <div>Copay: <strong>{message.cardData.copay}</strong></div>
                        </div>
                      </div>
                    )}

                    {message.cardType === 'booking' && message.cardData && (
                      <div className="mt-2.5 p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-1.5 text-[10px]">
                        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-1 font-bold text-emerald-600 dark:text-emerald-400">
                          <span>EAGLESOFT SYNCED</span>
                          <span>Confirmed</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-muted-foreground font-mono">
                          <div>Dr: <strong>{message.cardData.doctor}</strong></div>
                          <div>Slot: <strong>{message.cardData.time}</strong></div>
                        </div>
                      </div>
                    )}

                    {message.cardType === 'escalation' && message.cardData && (
                      <div className="mt-2.5 p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl space-y-1.5 text-[10px] text-rose-950 dark:text-rose-350">
                        <div className="flex items-center justify-between border-b border-rose-500/20 pb-1 font-bold">
                          <span>STAFF ESCALATED</span>
                          <span>{message.cardData.status}</span>
                        </div>
                        <p className="text-[9px] italic">Reason: &quot;{message.cardData.reason}&quot;</p>
                        <div className="text-[9px] font-bold">Desk Agent: {message.cardData.assignedTo}</div>
                      </div>
                    )}
                  </div>
                  
                  <span className="text-[8px] text-muted-foreground px-1 self-start">
                    {isUser ? 'You' : 'SmileAI'} • {mounted ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center flex-shrink-0 border border-slate-500/20 dark:border-indigo-500/30">
                    <User className="w-4 h-4 text-indigo-650 dark:text-indigo-300" />
                  </div>
                )}
              </div>
            )
          })}

          {/* Welcome Screen state in Demo Mode */}
          {bookingState.step === 'idle' && (
            <div className="p-4 rounded-xl bg-card dark:bg-slate-900 border border-slate-200/40 dark:border-white/5 space-y-4 shadow-sm animate-message text-foreground">
              <div className="text-center space-y-1 py-0.5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center mx-auto shadow-md">
                  <Tooth className="w-5 h-5 text-white" />
                </div>
                <h5 className="font-extrabold text-xs text-foreground">How can I help you today?</h5>
                <p className="text-[10px] text-slate-400">Select a workflow card to begin.</p>
              </div>

              {/* Guided Experience Actions Grid */}
              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => setBookingState({ step: 'service' })}
                  className="w-full p-2.5 bg-white dark:bg-slate-950/40 hover:bg-indigo-500/10 border border-slate-200/60 dark:border-white/5 hover:border-indigo-500/30 rounded-xl transition duration-150 cursor-pointer flex items-center gap-2.5 text-left"
                >
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 flex-shrink-0">
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-[11px] text-foreground">Book Appointment</div>
                    <p className="text-[9px] text-muted-foreground leading-tight">Schedule clean, checkup, treatment</p>
                  </div>
                  <ChevronRight className="w-3 h-3 ml-auto text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => setBookingState({ step: 'date', service: 'General Visit' })}
                  className="w-full p-2.5 bg-white dark:bg-slate-950/40 hover:bg-indigo-500/10 border border-slate-200/60 dark:border-white/5 hover:border-indigo-500/30 rounded-xl transition duration-150 cursor-pointer flex items-center gap-2.5 text-left"
                >
                  <div className="w-7 h-7 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-500 flex-shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-[11px] text-foreground">Check Availability</div>
                    <p className="text-[9px] text-muted-foreground leading-tight">Find available clinic times</p>
                  </div>
                  <ChevronRight className="w-3 h-3 ml-auto text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const userMsg: DemoMessage = { id: `m-u-${Date.now()}`, role: 'user', content: 'Insurance questions', timestamp: new Date().toISOString() }
                    const assistMsg: DemoMessage = { id: `m-a-${Date.now()}`, role: 'assistant', content: 'We accept MetLife, Cigna, Delta Dental, and other PPO plans. Please select your insurance plan from the form options below:', timestamp: new Date().toISOString() }
                    setMessages(prev => [...prev, userMsg, assistMsg])
                    setBookingState({ step: 'contact', insurance: 'Verifying...' })
                  }}
                  className="w-full p-2.5 bg-white dark:bg-slate-950/40 hover:bg-indigo-500/10 border border-slate-200/60 dark:border-white/5 hover:border-indigo-500/30 rounded-xl transition duration-150 cursor-pointer flex items-center gap-2.5 text-left"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 flex-shrink-0">
                    <Shield className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-[11px] text-foreground">Insurance Questions</div>
                    <p className="text-[9px] text-muted-foreground leading-tight">Check copays and coverage options</p>
                  </div>
                  <ChevronRight className="w-3 h-3 ml-auto text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setBookingState({ step: 'service' })
                    const userMsg: DemoMessage = { id: `m-u-${Date.now()}`, role: 'user', content: 'Reschedule my appointment', timestamp: new Date().toISOString() }
                    const assistMsg: DemoMessage = { id: `m-a-${Date.now()}`, role: 'assistant', content: 'I can help you reschedule. Select the service you wish to reschedule:', timestamp: new Date().toISOString() }
                    setMessages(prev => [...prev, userMsg, assistMsg])
                  }}
                  className="w-full p-2.5 bg-white dark:bg-slate-950/40 hover:bg-indigo-500/10 border border-slate-200/60 dark:border-white/5 hover:border-indigo-500/30 rounded-xl transition duration-150 cursor-pointer flex items-center gap-2.5 text-left"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 flex-shrink-0">
                    <RefreshCw className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-[11px] text-foreground">Reschedule Appointment</div>
                    <p className="text-[9px] text-muted-foreground leading-tight">Move your appointment to a different slot</p>
                  </div>
                  <ChevronRight className="w-3 h-3 ml-auto text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const userMsg: DemoMessage = { id: `m-u-${Date.now()}`, role: 'user', content: 'Contact Clinic', timestamp: new Date().toISOString() }
                    const assistMsg: DemoMessage = { id: `m-a-${Date.now()}`, role: 'assistant', content: 'Routing you to coordinator Lisa. You can reach us directly at (555) 019-2834 or support@smileclinic.com.', timestamp: new Date().toISOString() }
                    setMessages(prev => [...prev, userMsg, assistMsg])
                  }}
                  className="w-full p-2.5 bg-white dark:bg-slate-950/40 hover:bg-indigo-500/10 border border-slate-200/60 dark:border-white/5 hover:border-indigo-500/30 rounded-xl transition duration-150 cursor-pointer flex items-center gap-2.5 text-left"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 flex-shrink-0">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-[11px] text-foreground">Contact Clinic</div>
                    <p className="text-[9px] text-muted-foreground leading-tight">Speak with staff or get clinic details</p>
                  </div>
                  <ChevronRight className="w-3 h-3 ml-auto text-slate-400" />
                </button>
              </div>
            </div>
          )}

          {/* Booking Wizard active step screens */}
          {renderBookingWizard()}

          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center flex-shrink-0">
                <Tooth className="w-4.5 h-4.5 text-white animate-spin" />
              </div>
              <div className="bg-card dark:bg-slate-900 border border-slate-200/40 dark:border-white/5 px-4.5 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center h-9">
                <div className="flex gap-1.5 items-center">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Dynamic Suggested Action Chips in Demo Mode */}
        <div className="px-6 py-2.5 border-t border-slate-200/20 dark:border-white/5 bg-white/40 dark:bg-slate-950/30 flex gap-2 overflow-x-auto scrollbar-none items-center">
          <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mr-1.5 flex items-center gap-0.5 flex-shrink-0">
            <Sparkles className="w-2.5 h-2.5 text-indigo-500" /> Options:
          </span>
          {getQuickChips().map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                if (chip.action) {
                  chip.action()
                } else if (chip.text) {
                  handleSend(chip.text)
                }
              }}
              className="px-2.5 py-1.5 bg-card hover:bg-indigo-500/10 dark:bg-slate-900 border border-slate-200/60 dark:border-white/10 hover:border-indigo-500/30 rounded-full text-[9px] font-bold text-foreground tracking-wide transition duration-155 cursor-pointer flex-shrink-0 flex items-center gap-1.5"
            >
              {getLucideIcon(chip.icon, "w-3 h-3 text-indigo-500")}
              <span>{chip.label}</span>
            </button>
          ))}
        </div>

        {/* Input Composer */}
        <form
          onSubmit={handleFormSubmit}
          className="p-4 border-t border-slate-200/20 dark:border-white/5 bg-white/40 dark:bg-slate-950/40 flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              bookingState.step === 'idle'
                ? "Ask a question or request a booking slot..."
                : "Select options above or type special requests..."
            }
            disabled={isTyping}
            className="flex-1 px-4 py-2 text-xs rounded-xl border border-slate-200/60 dark:border-white/5 bg-card/65 dark:bg-slate-950/50 text-foreground placeholder-muted-foreground focus:outline-none focus:border-indigo-500/50 h-9.5"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className={`w-9.5 h-9.5 rounded-full flex items-center justify-center transition flex-shrink-0 border cursor-pointer
              ${(!input.trim() || isTyping)
                ? 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-600 border-slate-200/50 dark:border-slate-800/50 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white border-indigo-500/20 shadow-[0_2px_10px_rgba(99,102,241,0.2)]'
              }`}
          >
            <Send className="w-4 h-4 flex-shrink-0" />
          </button>
        </form>
      </div>

      {/* Right Column: Progressive context panel - only shown when booking is created or insurance details are available */}
      {(patientDetails.insurance !== 'Unverified' || appointments.length > 0) && (
        <div className="hidden lg:flex w-72 flex-col h-full bg-white/50 dark:bg-slate-950/40 border-l border-slate-200/20 dark:border-white/5 p-4.5 space-y-4 overflow-y-auto scrollbar-thin select-none animate-workspace">
          <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block mb-1">
            Booking Context
          </span>

          {/* Profile Card */}
          <div className="p-3 bg-card dark:bg-slate-900 border border-slate-200/60 dark:border-white/5 rounded-xl space-y-2 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-xs">
                <User className="w-3.5 h-3.5" />
              </div>
              <div className="truncate">
                <h5 className="font-extrabold text-[11px] text-foreground truncate">{patientDetails.name}</h5>
                <span className="text-[8px] px-1 rounded bg-white dark:bg-slate-800 text-muted-foreground font-bold uppercase">Patient</span>
              </div>
            </div>
            {patientDetails.phone !== 'Not provided' && (
              <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5 mt-1 border-t border-slate-150/10 pt-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> {patientDetails.phone}
              </div>
            )}
          </div>

          {/* Verified Insurance */}
          {patientDetails.insurance !== 'Unverified' && patientDetails.insurance !== 'No Insurance' && (
            <div className="p-3 bg-card dark:bg-slate-900 border border-slate-200/60 dark:border-white/5 rounded-xl space-y-1.5 shadow-sm animate-message">
              <div className="text-[9px] font-bold uppercase tracking-wider text-emerald-500 dark:text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Insurance Verified
              </div>
              <p className="text-[10px] text-muted-foreground leading-normal">{patientDetails.insurance}</p>
            </div>
          )}

          {/* Sync status */}
          {appointments.length > 0 && (
            <div className="p-3 bg-card dark:bg-slate-900 border border-slate-200/60 dark:border-white/5 rounded-xl space-y-2 shadow-sm animate-message">
              <div className="text-[9px] font-bold uppercase tracking-wider text-indigo-500 dark:border-white/5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Eaglesoft Sync
              </div>
              <div className="space-y-1.5">
                {appointments.map(appt => (
                  <div key={appt.id} className="p-2 bg-white dark:bg-slate-950/40 border border-slate-200/50 dark:border-white/5 rounded-lg text-[10px] space-y-0.5">
                    <div className="font-bold text-foreground truncate">{appt.service}</div>
                    <div className="text-indigo-650 dark:text-indigo-400 font-bold">{appt.date} at {appt.time}</div>
                    <div className="text-[8px] text-slate-400 font-mono">Dr: {appt.doctor}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ChatbotDemo
