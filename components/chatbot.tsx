'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Send, X, MessageSquare, Bot, User, Calendar, Plus, Sparkles,
  HelpCircle, FileText, ChevronRight, Maximize2, Minimize2,
  Check, RefreshCw, Clock, History, Settings, Bell, Info, ShieldCheck,
  Search, Trash2, Edit3, ClipboardList, TrendingUp, AlertTriangle,
  UserCheck, CreditCard, CheckSquare, PlusSquare, ArrowRight, BookOpen, AlertCircle,
  Shield, Phone, Mail, Stethoscope, ArrowLeft, Home
} from 'lucide-react'
import { Tooth } from '@/components/tooth-icon'
import { NAVIGATION_URLS } from '@/config/navigation'

// TypeScript Interfaces for CRM Entities
interface Note {
  id: string
  author: string
  text: string
  date: string
  type: 'staff' | 'patient' | 'system'
}

interface HistoryItem {
  id: string
  type: 'appointment' | 'call' | 'insurance'
  title: string
  date: string
  status: string
}

interface Patient {
  id: string
  name: string
  phone: string
  email: string
  insurance: string
  stage: 'Greeting' | 'Need Discovery' | 'Appointment Collection' | 'Confirmation' | 'Booking Created'
  notes: Note[]
  history: HistoryItem[]
}

interface Appointment {
  id: string
  patientId: string
  patientName: string
  service: string
  date: string
  time: string
  doctor: string
  status: 'Pending' | 'Confirmed' | 'Rescheduled' | 'Completed' | 'Cancelled' | 'No-show'
  revenue: number
}

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  cardType?: 'booking' | 'insurance' | 'escalation' | 'generic'
  cardData?: any
}

interface Conversation {
  id: string
  patientId: string
  patientName: string
  status: 'Open' | 'Waiting' | 'Scheduled' | 'Completed' | 'Escalated'
  lastMessage: string
  unread: boolean
  updatedAt: string
  messages: Message[]
}

interface AIAction {
  id: string
  type: 'verified' | 'created' | 'sent' | 'checked' | 'qualified' | 'escalated' | 'system'
  title: string
  description: string
  timestamp: string
}

interface Task {
  id: string
  title: string
  patientName: string
  status: 'todo' | 'done'
}

interface Notification {
  id: string
  title: string
  description: string
  timestamp: string
  read: boolean
  type: 'booking' | 'insurance' | 'cancellation' | 'escalation'
}

export function Chatbot() {
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

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true) // Start expanded to showcase the deep CRM dashboard
  const [buttonTransform, setButtonTransform] = useState('translate(0px, 0px)')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<'All' | 'Open' | 'Waiting' | 'Scheduled' | 'Completed' | 'Escalated'>('All')
  const [activeTab, setActiveTab] = useState<'profile' | 'timeline' | 'tasks'>('profile')

  // Unified CRM Database State
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: 'pat-1',
      name: 'Jane Smith',
      phone: '(555) 019-2834',
      email: 'jane.smith@gmail.com',
      insurance: 'MetLife Dental',
      stage: 'Need Discovery',
      notes: [
        { id: 'n-1', author: 'Lisa (Front Desk)', text: 'Requested morning slots. Prefers Dr. Sarah Johnson.', date: '2026-06-20T10:30:00Z', type: 'staff' },
        { id: 'n-2', author: 'SmileAI', text: 'Checked MetLife coverage. Preventive is 100% covered.', date: '2026-06-20T14:15:00Z', type: 'system' }
      ],
      history: [
        { id: 'h-1', type: 'appointment', title: 'Routine Cleaning', date: '2026-03-12', status: 'Completed' }
      ]
    },
    {
      id: 'pat-2',
      name: 'Bob Miller',
      phone: '(555) 043-9821',
      email: 'bob.miller@outlook.com',
      insurance: 'Delta Dental Premier',
      stage: 'Booking Created',
      notes: [
        { id: 'n-3', author: 'Dr. Johnson', text: 'Needs follow-up check on upper right molar next visit.', date: '2026-06-19T11:00:00Z', type: 'staff' }
      ],
      history: [
        { id: 'h-2', type: 'appointment', title: 'Crown Prep', date: '2026-06-18', status: 'Completed' }
      ]
    }
  ])

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 'appt-1',
      patientId: 'pat-1',
      patientName: 'Jane Smith',
      service: 'Routine Cleaning & Checkup',
      date: '2026-06-22',
      time: '10:00 AM',
      doctor: 'Dr. Sarah Johnson',
      status: 'Pending',
      revenue: 150
    },
    {
      id: 'appt-2',
      patientId: 'pat-2',
      patientName: 'Bob Miller',
      service: 'Dental Crown',
      date: '2026-06-24',
      time: '02:00 PM',
      doctor: 'Dr. Sarah Johnson',
      status: 'Confirmed',
      revenue: 950
    }
  ])

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'conv-1',
      patientId: 'pat-1',
      patientName: 'Jane Smith',
      status: 'Waiting',
      lastMessage: 'Let me double check the times, tomorrow at 10 AM works.',
      unread: true,
      updatedAt: '2026-06-21T00:10:00Z',
      messages: [
        { id: 'm-1', role: 'assistant', content: 'Hi Jane! Welcome back to Smile Dental. How can we help you today?', timestamp: '2026-06-21T00:01:00Z' },
        { id: 'm-2', role: 'user', content: 'Hi, I need to book my regular checkup and cleaning. Do you have any slots next week?', timestamp: '2026-06-21T00:03:00Z' },
        { id: 'm-3', role: 'assistant', content: 'Certainly! I have found three options for a Routine Cleaning next week:\n- Monday, June 22 at 10:00 AM (Dr. Sarah Johnson)\n- Tuesday, June 23 at 2:00 PM (Dr. Sarah Johnson)\n- Thursday, June 25 at 9:00 AM (Dr. Emma Wilson)\nDo any of these work for you?', timestamp: '2026-06-21T00:05:00Z' },
        { id: 'm-4', role: 'user', content: 'Let me double check the times, tomorrow at 10 AM works.', timestamp: '2026-06-21T00:10:00Z' }
      ]
    },
    {
      id: 'conv-2',
      patientId: 'pat-2',
      patientName: 'Bob Miller',
      status: 'Scheduled',
      lastMessage: 'Thanks, I received the appointment confirmation email.',
      unread: false,
      updatedAt: '2026-06-20T14:30:00Z',
      messages: [
        { id: 'm-5', role: 'user', content: 'Need to schedule my dental crown insertion.', timestamp: '2026-06-20T14:00:00Z' },
        { id: 'm-6', role: 'assistant', content: 'No problem Bob! Let me check the schedule. We have Wednesday, June 24 at 2:00 PM available with Dr. Sarah Johnson. Shall I book that?', timestamp: '2026-06-20T14:15:00Z' },
        { id: 'm-7', role: 'user', content: 'Yes, please book it. And please verify my Delta Dental Premier coverage.', timestamp: '2026-06-20T14:25:00Z' },
        { id: 'm-8', role: 'assistant', content: 'All set! Your appointment is confirmed for Wednesday, June 24 at 2:00 PM. I have successfully verified your Delta Dental insurance: 100% preventive coverage, 80% crown coverage. You will receive an email confirmation.', timestamp: '2026-06-20T14:28:00Z' },
        { id: 'm-9', role: 'user', content: 'Thanks, I received the appointment confirmation email.', timestamp: '2026-06-20T14:30:00Z' }
      ]
    }
  ])

  const [aiActions, setAiActions] = useState<AIAction[]>([
    { id: 'act-1', type: 'checked', title: 'Availability Checked', description: 'Scanned Dr. Johnson\'s slots for Routine Cleaning', timestamp: '2026-06-21T00:05:00Z' },
    { id: 'act-2', type: 'verified', title: 'Insurance Verified', description: 'Delta Dental Premier active status confirmed for Bob Miller', timestamp: '2026-06-20T14:28:00Z' },
    { id: 'act-3', type: 'created', title: 'Appointment Created', description: 'Scheduled Bob Miller for Dental Crown on June 24', timestamp: '2026-06-20T14:28:00Z' }
  ])

  const [tasks, setTasks] = useState<Task[]>([
    { id: 't-1', title: 'Verify Delta Dental coverage breakdown', patientName: 'Bob Miller', status: 'done' }
  ])

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 'n-2', title: 'Appointment Pending', description: 'Jane Smith requested slot for June 22', timestamp: '2026-06-21T00:10:00Z', read: false, type: 'booking' }
  ])

  const [activeConversationId, setActiveConversationId] = useState<string>('conv-1')

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

  const [contactName, setContactName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactInsurance, setContactInsurance] = useState('No Insurance')

  useEffect(() => {
    if (activePatient) {
      setContactName(activePatient.name === 'Anonymous Prospect' ? '' : activePatient.name)
      setContactPhone(activePatient.phone === 'Not provided' ? '' : activePatient.phone)
      setContactEmail(activePatient.email === 'Not provided' ? '' : activePatient.email)
      setContactInsurance(activePatient.insurance === 'Unverified' || activePatient.insurance === 'No Insurance' ? 'No Insurance' : activePatient.insurance)
    }
  }, [activeConversationId, patients])

  const progressBooking = (
    nextStep: 'idle' | 'service' | 'doctor' | 'date' | 'time' | 'contact' | 'review' | 'success',
    updates: any,
    userMessageText: string,
    assistantMessageText: string,
    customCardType?: 'booking' | 'insurance' | 'escalation' | 'generic',
    customCardData?: any
  ) => {
    // 1. Add User Message
    const userMsg: Message = {
      id: `m-u-${Date.now()}`,
      role: 'user',
      content: userMessageText,
      timestamp: new Date().toISOString()
    }

    setConversations(prev => prev.map(c => {
      if (c.id === activeConversation.id) {
        return {
          ...c,
          messages: [...c.messages, userMsg],
          lastMessage: userMessageText,
          updatedAt: new Date().toISOString(),
          unread: false
        }
      }
      return c
    }))

    // 2. Set Booking State
    setBookingState(prev => ({
      ...prev,
      ...updates,
      step: nextStep
    }))

    // 3. Update Patient qualification stage based on step
    const stageMap: Record<string, Patient['stage']> = {
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
      setPatients(prev => prev.map(p => {
        if (p.id === activePatient.id) {
          return { ...p, stage: nextStage }
        }
        return p
      }))
    }

    // 4. Simulate Assistant Reply
    setIsTyping(true)
    setTimeout(() => {
      const assistantMsg: Message = {
        id: `m-a-${Date.now()}`,
        role: 'assistant',
        content: assistantMessageText,
        timestamp: new Date().toISOString(),
        cardType: customCardType,
        cardData: customCardData
      }

      setConversations(prev => prev.map(c => {
        if (c.id === activeConversation.id) {
          return {
            ...c,
            messages: [...c.messages, assistantMsg],
            lastMessage: assistantMessageText.split('\n')[0],
            updatedAt: new Date().toISOString()
          }
        }
        return c
      }))
      setIsTyping(false)

      // Add to CRM database when finalized
      if (nextStep === 'success') {
        const finalService = updates.service || bookingState.service || 'Routine Cleaning'
        const finalDoctor = updates.doctor?.name || bookingState.doctor?.name || 'Dr. Sarah Johnson'
        const finalDate = updates.date || bookingState.date || 'June 22'
        const finalTime = updates.time || bookingState.time || '10:00 AM'
        const finalRevenue = finalService.includes('Crown') ? 950 : finalService.includes('Whitening') ? 300 : finalService.includes('Emergency') ? 200 : 150

        const newAppt: Appointment = {
          id: `appt-${Date.now()}`,
          patientId: activePatient.id,
          patientName: activePatient.name === 'Anonymous Prospect' && updates.name ? updates.name : activePatient.name,
          service: finalService,
          date: finalDate,
          time: finalTime,
          doctor: finalDoctor,
          status: 'Confirmed',
          revenue: finalRevenue
        }
        setAppointments(prev => [newAppt, ...prev])

        setPatients(prev => prev.map(p => {
          if (p.id === activePatient.id) {
            return {
              ...p,
              name: activePatient.name === 'Anonymous Prospect' && updates.name ? updates.name : p.name,
              phone: activePatient.phone === 'Not provided' && updates.phone ? updates.phone : p.phone,
              email: activePatient.email === 'Not provided' && updates.email ? updates.email : p.email,
              insurance: updates.insurance || p.insurance
            }
          }
          return p
        }))

        // Log Timeline Actions
        setAiActions(prev => [
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
        setNotifications(prev => [
          {
            id: `n-${Date.now()}`,
            title: 'Appointment Scheduled',
            description: `${newAppt.patientName} booked ${newAppt.service} for ${newAppt.date} at ${newAppt.time}`,
            timestamp: new Date().toISOString(),
            read: false,
            type: 'booking'
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
          {
            label: 'Emergency Slot', icon: 'alert-circle', action: () => {
              setBookingState({ step: 'doctor', service: 'Emergency Visit' })
              const userMsg = { id: `msg-u-${Date.now()}`, role: 'user' as const, content: 'Emergency booking', timestamp: new Date().toISOString() }
              const assistMsg = { id: `msg-a-${Date.now()}`, role: 'assistant' as const, content: 'Emergency Visit chosen. Which doctor would you like to see?', timestamp: new Date().toISOString() }
              setConversations(prev => prev.map(c => c.id === activeConversation.id ? { ...c, messages: [...c.messages, userMsg, assistMsg] } : c))
            }
          },
          { label: 'Connect to Receptionist', icon: 'phone', text: 'Connect me to Lisa at the front desk' }
        ]
      case 'service':
        return [
          { label: 'Return to Home', icon: 'home', action: () => setBookingState({ step: 'idle' }) },
          { label: 'Ask a receptionist', icon: 'phone', text: 'Can I speak to someone?' }
        ]
      case 'doctor':
        return [
          {
            label: 'First Available', icon: 'award', action: () => {
              progressBooking(
                'date',
                { doctor: { name: 'First Available Dentist', specialty: 'Faster slot allocation', rating: '5.0 ★', exp: 'Any practitioner', color: 'from-emerald-400 to-emerald-600' } },
                'Selected First Available Dentist',
                'Excellent. Which day works best for your schedule?'
              )
            }
          },
          { label: 'Back to Services', icon: 'arrow-left', action: () => setBookingState({ step: 'service' }) },
          { label: 'Cancel Booking', icon: 'x', action: () => setBookingState({ step: 'idle' }) }
        ]
      case 'date':
        return [
          {
            label: 'Show Next Week', icon: 'calendar', action: () => {
              const assistMsg = { id: `msg-a-${Date.now()}`, role: 'assistant' as const, content: 'Fetching next week slots. We have slots starting Monday, June 29.', timestamp: new Date().toISOString() }
              setConversations(prev => prev.map(c => c.id === activeConversation.id ? { ...c, messages: [...c.messages, assistMsg] } : c))
            }
          },
          { label: 'Back to Doctor', icon: 'arrow-left', action: () => setBookingState(prev => ({ ...prev, step: 'doctor' })) },
          { label: 'Cancel Booking', icon: 'x', action: () => setBookingState({ step: 'idle' }) }
        ]
      case 'time':
        return [
          {
            label: 'Morning Slots Only', icon: 'clock', action: () => {
              const assistMsg = { id: `msg-a-${Date.now()}`, role: 'assistant' as const, content: 'Morning slots displayed below. Please select a morning time.', timestamp: new Date().toISOString() }
              setConversations(prev => prev.map(c => c.id === activeConversation.id ? { ...c, messages: [...c.messages, assistMsg] } : c))
            }
          },
          {
            label: 'Afternoon Slots Only', icon: 'clock', action: () => {
              const assistMsg = { id: `msg-a-${Date.now()}`, role: 'assistant' as const, content: 'Afternoon slots displayed below. Please select an afternoon time.', timestamp: new Date().toISOString() }
              setConversations(prev => prev.map(c => c.id === activeConversation.id ? { ...c, messages: [...c.messages, assistMsg] } : c))
            }
          },
          { label: 'Back to Date', icon: 'arrow-left', action: () => setBookingState(prev => ({ ...prev, step: 'date' })) }
        ]
      case 'contact':
        return [
          {
            label: 'Self-Pay (No Insurance)', icon: 'shield', action: () => {
              setContactInsurance('No Insurance')
              // Add custom trigger delay for state
              setTimeout(() => {
                const btn = document.getElementById('btn-continue')
                if (btn) btn.click()
              }, 100)
            }
          },
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
          {
            label: 'Book Family Member', icon: 'users', action: () => {
              setBookingState({ step: 'service' })
              const assistMsg = { id: `msg-a-${Date.now()}`, role: 'assistant' as const, content: 'Booking a family member. Select service:', timestamp: new Date().toISOString() }
              setConversations(prev => prev.map(c => c.id === activeConversation.id ? { ...c, messages: [...c.messages, assistMsg] } : c))
            }
          }
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
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
            <div className="grid grid-cols-5 gap-1.5">
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
                  className="p-2 bg-white hover:bg-indigo-500/10 dark:bg-slate-950/40 border border-slate-200/60 dark:border-white/5 hover:border-indigo-500/30 rounded-xl text-center space-y-1 transition duration-150 cursor-pointer"
                >
                  <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">{dt.day}</div>
                  <div className="font-extrabold text-xs text-foreground">{dt.date.split(' ')[1]}</div>
                  <span className="inline-block px-1 rounded bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase mt-1">Open</span>
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
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block text-center border-b pb-0.5">Morning</span>
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
                    className="w-full py-2 bg-white hover:bg-indigo-500/10 dark:bg-slate-950/40 border border-slate-200/60 dark:border-white/5 hover:border-indigo-500/30 rounded-xl text-center font-bold text-xs text-foreground transition cursor-pointer"
                  >
                    {tm}
                  </button>
                ))}
              </div>
              <div className="space-y-1.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block text-center border-b pb-0.5">Afternoon</span>
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
                    className="w-full py-2 bg-white hover:bg-indigo-500/10 dark:bg-slate-950/40 border border-slate-200/60 dark:border-white/5 hover:border-indigo-500/30 rounded-xl text-center font-bold text-xs text-foreground transition cursor-pointer"
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
            <div className="space-y-2.5 text-xs text-foreground">
              <div className="space-y-0.5">
                <label className="text-[9px] text-slate-400 font-bold block uppercase">Full Name</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Jane Smith"
                  className="w-full px-3 py-1.5 border border-slate-200/60 dark:border-white/10 bg-white dark:bg-slate-950/40 rounded-xl focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-0.5">
                  <label className="text-[9px] text-slate-400 font-bold block uppercase">Phone Number</label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="(555) 019-2834"
                    className="w-full px-3 py-1.5 border border-slate-200/60 dark:border-white/10 bg-white dark:bg-slate-950/40 rounded-xl focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>
                <div className="space-y-0.5">
                  <label className="text-[9px] text-slate-400 font-bold block uppercase">Email Address</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="jane@gmail.com"
                    className="w-full px-3 py-1.5 border border-slate-200/60 dark:border-white/10 bg-white dark:bg-slate-950/40 rounded-xl focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>
              </div>
              <div className="space-y-0.5">
                <label className="text-[9px] text-slate-400 font-bold block uppercase">Insurance Provider</label>
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
                id="btn-continue"
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
                className="w-full py-2.5 bg-indigo-655 hover:bg-indigo-600 disabled:opacity-40 disabled:pointer-events-none text-white text-[10px] font-bold tracking-wider uppercase rounded-xl transition cursor-pointer flex items-center justify-center gap-1 shadow-sm border border-indigo-500/20"
              >
                Continue to Review ➔
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
            <div className="bg-indigo-500/5 dark:bg-white/[0.02] border border-indigo-500/10 dark:border-white/5 rounded-xl p-3 space-y-2 text-[11px] text-foreground font-medium">
              <div className="flex justify-between border-b border-slate-200/5 dark:border-white/5 pb-1.5">
                <span className="text-slate-400 font-bold uppercase text-[9px]">Treatment</span>
                <span className="font-bold text-foreground">{bookingState.service}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/5 dark:border-white/5 pb-1.5">
                <span className="text-slate-400 font-bold uppercase text-[9px]">Dentist</span>
                <span className="font-bold text-foreground">{bookingState.doctor?.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/5 dark:border-white/5 pb-1.5">
                <span className="text-slate-400 font-bold uppercase text-[9px]">Schedule</span>
                <span className="font-bold text-indigo-650 dark:text-indigo-400">{bookingState.date} at {bookingState.time}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/5 dark:border-white/5 pb-1.5">
                <span className="text-slate-400 font-bold uppercase text-[9px]">Patient Name</span>
                <span className="font-bold text-foreground">{bookingState.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold uppercase text-[9px]">Insurance Status</span>
                <span className="font-bold text-foreground">{bookingState.insurance}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setBookingState(prev => ({ ...prev, step: 'service' }))}
                className="flex-1 py-2 bg-white hover:bg-white dark:bg-white/5 dark:hover:bg-white/10 text-foreground font-bold text-xs rounded-xl transition cursor-pointer text-center"
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
                className="flex-1.5 py-2 bg-gradient-to-r from-indigo-650 to-violet-650 hover:from-indigo-655 hover:to-violet-650 dark:from-indigo-500 dark:to-violet-500 dark:hover:from-indigo-600 dark:hover:to-violet-600 text-white font-extrabold uppercase tracking-widest text-[10px] rounded-xl shadow-[0_4px_15px_rgba(99,102,241,0.3)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.45)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer text-center flex items-center justify-center gap-1"
              >
                Confirm Booking ➔
              </button>
            </div>
          </div>
        )
      case 'success':
        return (
          <div className="p-4 bg-card dark:bg-slate-900 border border-slate-200/40 dark:border-white/5 rounded-2xl shadow-sm space-y-4.5 animate-message text-foreground">
            <div className="text-center space-y-1.5">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto shadow-inner">
                <Check className="w-5 h-5 text-emerald-500" />
              </div>
              <h5 className="font-extrabold text-xs text-foreground">Appointment Locked!</h5>
              <p className="text-[10px] text-slate-400 leading-normal">Eaglesoft Synced • Confirmation SMS sent to your phone</p>
            </div>
            <div className="space-y-2">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block text-left">Suggested Follow-Ups</span>
              <div className="grid grid-cols-1 gap-1.5 text-xs text-foreground">
                <button
                  type="button"
                  onClick={() => {
                    const assistMsg = { id: `m-a-${Date.now()}`, role: 'assistant' as const, content: 'Invitation sent! Check your calendar for the .ics calendar file.', timestamp: new Date().toISOString() }
                    setConversations(prev => prev.map(c => c.id === activeConversation.id ? { ...c, messages: [...c.messages, assistMsg] } : c))
                  }}
                  className="p-2.5 bg-white hover:bg-white dark:bg-slate-950/40 border border-slate-200/60 dark:border-white/5 rounded-xl text-left font-bold transition cursor-pointer flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-indigo-500" /> Add to Google/iCal Calendar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBookingState({ step: 'service' })
                    const assistMsg = { id: `m-a-${Date.now()}`, role: 'assistant' as const, content: 'Let\'s reschedule. Select your desired service to change slots:', timestamp: new Date().toISOString() }
                    setConversations(prev => prev.map(c => c.id === activeConversation.id ? { ...c, messages: [...c.messages, assistMsg] } : c))
                  }}
                  className="p-2.5 bg-white hover:bg-white dark:bg-slate-950/40 border border-slate-200/60 dark:border-white/5 rounded-xl text-left font-bold transition cursor-pointer flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4 text-violet-500" /> Reschedule Appointment slot
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAppointments(prev => prev.map((a, idx) => idx === 0 ? { ...a, status: 'Cancelled' } : a))
                    setBookingState({ step: 'idle' })
                    const userMsg = { id: `m-u-${Date.now()}`, role: 'user' as const, content: 'Cancel Appointment', timestamp: new Date().toISOString() }
                    const assistMsg = { id: `m-a-${Date.now()}`, role: 'assistant' as const, content: 'I have cancelled your upcoming appointment slot. Let me know if you would like to book a family member or ask a query.', timestamp: new Date().toISOString() }
                    setConversations(prev => prev.map(c => c.id === activeConversation.id ? { ...c, messages: [...c.messages, userMsg, assistMsg] } : c))
                  }}
                  className="p-2.5 bg-white hover:bg-white dark:bg-slate-950/40 border border-slate-200/60 dark:border-white/5 rounded-xl text-left font-bold text-rose-500 transition cursor-pointer flex items-center gap-2"
                >
                  <X className="w-4 h-4 text-rose-500" /> Cancel Appointment slot
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBookingState({ step: 'service' })
                    const userMsg = { id: `msg-u-${Date.now()}`, role: 'user' as const, content: 'Book Family Member', timestamp: new Date().toISOString() }
                    const assistMsg = { id: `msg-a-${Date.now()}`, role: 'assistant' as const, content: 'Perfect! Booking a family member. Select the service you require for them:', timestamp: new Date().toISOString() }
                    setConversations(prev => prev.map(c => c.id === activeConversation.id ? { ...c, messages: [...c.messages, userMsg, assistMsg] } : c))
                  }}
                  className="p-2.5 bg-white hover:bg-white dark:bg-slate-950/40 border border-slate-200/60 dark:border-white/5 rounded-xl text-left font-bold transition cursor-pointer flex items-center gap-2"
                >
                  <UserCheck className="w-4 h-4 text-emerald-500" /> Book Family Member
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setBookingState({ step: 'idle' })}
              className="w-full py-2 bg-white dark:bg-white/5 hover:bg-white text-foreground font-bold text-[10px] uppercase tracking-wider rounded-xl transition cursor-pointer text-center"
            >
              Return to Main Concierge ➔
            </button>
          </div>
        )
      default:
        return null
    }
  }

  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [newNoteText, setNewNoteText] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom of conversation
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [conversations, activeConversationId, isTyping])

  // Get active conversation object
  const activeConversation = conversations.find(c => c.id === activeConversationId) || conversations[0]
  // Get active patient object
  const activePatient = patients.find(p => p.id === activeConversation.patientId) || patients[0]

  // Dynamic Metrics derived from unified state
  const totalBookings = appointments.filter(a => a.status === 'Confirmed' || a.status === 'Pending').length
  const completedAppts = appointments.filter(a => a.status === 'Completed').length
  const cancelledAppts = appointments.filter(a => a.status === 'Cancelled').length
  const totalRevenue = appointments
    .filter(a => a.status === 'Confirmed' || a.status === 'Completed' || a.status === 'Pending')
    .reduce((sum, item) => sum + item.revenue, 0)

  // Calculate Conversion Rate: patients qualified (stage 5 or status Scheduled)
  const totalPatientsCount = patients.length
  const qualifiedPatientsCount = patients.filter(p => p.stage === 'Booking Created').length
  const conversionRate = totalPatientsCount > 0 ? Math.round((qualifiedPatientsCount / totalPatientsCount) * 100) : 0

  // Staff utilization based on booked slots (e.g. 10 available slots total in simulation)
  const maxClinicSlots = 8
  const confirmedCount = appointments.filter(a => a.status === 'Confirmed').length
  const clinicUtilization = Math.round((confirmedCount / maxClinicSlots) * 100)

  // Global search filtering logic
  const filteredConversations = conversations.filter(c => {
    const matchesFilter = activeFilter === 'All' || c.status === activeFilter
    const patientNameLower = c.patientName.toLowerCase()
    const lastMessageLower = c.lastMessage.toLowerCase()
    const searchLower = searchQuery.toLowerCase()

    // Find if any note matching search query
    const matchingPatient = patients.find(p => p.id === c.patientId)
    const hasMatchingNote = matchingPatient?.notes.some(n => n.text.toLowerCase().includes(searchLower)) || false

    const matchesSearch =
      patientNameLower.includes(searchLower) ||
      lastMessageLower.includes(searchLower) ||
      hasMatchingNote

    return matchesFilter && matchesSearch
  })

  // Add staff notes
  const handleAddNote = () => {
    if (!newNoteText.trim()) return
    const newNoteObj: Note = {
      id: `note-${Date.now()}`,
      author: 'Lisa (Front Desk)',
      text: newNoteText,
      date: new Date().toISOString(),
      type: 'staff'
    }

    setPatients(prev => prev.map(p => {
      if (p.id === activePatient.id) {
        return {
          ...p,
          notes: [newNoteObj, ...p.notes]
        }
      }
      return p
    }))
    setNewNoteText('')

    // Append a system message or action log
    const newAction: AIAction = {
      id: `act-${Date.now()}`,
      type: 'system',
      title: 'Internal Note Added',
      description: `Staff note created for ${activePatient.name}: "${newNoteObj.text.substring(0, 30)}..."`,
      timestamp: new Date().toISOString()
    }
    setAiActions(prev => [newAction, ...prev])
  }

  // Toggle tasks status
  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        return {
          ...t,
          status: t.status === 'todo' ? 'done' : 'todo'
        }
      }
      return t
    }))
  }

  // Trigger appointment status update
  const handleUpdateAppointmentStatus = (apptId: string, nextStatus: Appointment['status']) => {
    setAppointments(prev => prev.map(a => {
      if (a.id === apptId) {
        return { ...a, status: nextStatus }
      }
      return a
    }))

    // Add action history item
    const targetAppt = appointments.find(a => a.id === apptId)
    if (targetAppt) {
      const newAction: AIAction = {
        id: `act-${Date.now()}`,
        type: nextStatus === 'Confirmed' ? 'created' : 'system',
        title: `Appointment ${nextStatus}`,
        description: `${targetAppt.patientName}'s ${targetAppt.service} status updated to ${nextStatus}`,
        timestamp: new Date().toISOString()
      }
      setAiActions(prev => [newAction, ...prev])

      // Push notification
      const newNotif: Notification = {
        id: `notif-${Date.now()}`,
        title: `Appointment ${nextStatus}`,
        description: `${targetAppt.patientName} - ${targetAppt.service} is now ${nextStatus}`,
        timestamp: new Date().toISOString(),
        read: false,
        type: nextStatus === 'Cancelled' ? 'cancellation' : 'booking'
      }
      setNotifications(prev => [newNotif, ...prev])
    }
  }

  // Set Conversation priority / status directly
  const handleConversationStatusChange = (status: Conversation['status']) => {
    setConversations(prev => prev.map(c => {
      if (c.id === activeConversation.id) {
        return { ...c, status }
      }
      return c
    }))

    // Trigger AI Actions log
    const newAction: AIAction = {
      id: `act-${Date.now()}`,
      type: status === 'Escalated' ? 'escalated' : 'system',
      title: `Priority set to ${status}`,
      description: `Thread with ${activePatient.name} moved to ${status} queue.`,
      timestamp: new Date().toISOString()
    }
    setAiActions(prev => [newAction, ...prev])
  }

  // AI Conversational Intelligence Response Simulator
  const handleSendMessage = (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault()
    const messageContent = customText || inputText
    if (!messageContent.trim()) return

    if (!customText) setInputText('')

    // 1. Add User Message
    const userMsg: Message = {
      id: `m-${Date.now()}`,
      role: 'user',
      content: messageContent,
      timestamp: new Date().toISOString()
    }

    setConversations(prev => prev.map(c => {
      if (c.id === activeConversation.id) {
        return {
          ...c,
          messages: [...c.messages, userMsg],
          lastMessage: messageContent,
          updatedAt: new Date().toISOString(),
          unread: false
        }
      }
      return c
    }))

    setIsTyping(true)

    // 2. Process simulated intelligent replies based on content
    setTimeout(() => {
      let replyContent = "I've logged your message. How else can SmileAI support you?"
      let targetStage = activePatient.stage
      let triggerAppointment = false
      let triggerInsuranceCheck = false
      let triggerEscalation = false
      let customCardType: Message['cardType'] = undefined
      let customCardData: any = null

      const text = messageContent.toLowerCase()

      // Keywords matching flow
      if (text.includes('clean') || text.includes('checkup') || text.includes('whitening') || text.includes('filling') || text.includes('crown') || text.includes('implant')) {
        targetStage = 'Need Discovery'
        replyContent = `Absolutely! I can help you schedule that. We offer a full range of dental treatments. I am checking availability now.\n\nOur open slots tomorrow are:\n- 9:00 AM with Dr. Sarah Johnson\n- 11:30 AM with Dr. Emma Wilson\n- 2:00 PM with Dr. Sarah Johnson\n\nWhich slot do you prefer, and could you provide your phone number and insurance provider?`

        // Log AI action
        setAiActions(prev => [
          {
            id: `act-${Date.now()}`,
            type: 'checked',
            title: 'Checked Availability',
            description: `Scanned scheduling calendar slots for ${activePatient.name}`,
            timestamp: new Date().toISOString()
          },
          ...prev
        ])
      }
      else if (text.includes('insurance') || text.includes('metlife') || text.includes('delta') || text.includes('cigna') || text.includes('guardian') || text.includes('blue cross')) {
        targetStage = 'Confirmation'
        triggerInsuranceCheck = true
        replyContent = `Thank you! I am launching an insurance verification query. SmileAI is connected directly via API to major providers.\n\nDelta Dental & MetLife verified: Active coverage. Routine checkups and cleanings are covered at 100%. Major procedures like fillings or crowns have a $50 deductible and 80% coverage. I have updated your insurance status to Verified.`

        customCardType = 'insurance'
        customCardData = {
          provider: text.includes('metlife') ? 'MetLife' : text.includes('cigna') ? 'Cigna' : 'Delta Dental',
          status: 'Active',
          copay: '$0 preventive / $50 procedures',
          deductible: '$50.00',
          verifiedAt: 'Just now'
        }
      }
      else if (text.includes('yes') || text.includes('confirm') || text.includes('schedule') || text.includes('book') || text.includes('tomorrow') || text.includes('9:') || text.includes('11:') || text.includes('2:')) {
        targetStage = 'Booking Created'
        triggerAppointment = true
        replyContent = `Excellent! I have successfully synchronized your booking with Eaglesoft and locked your reservation.\n\nConfirmation details:\n- Patient: ${activePatient.name}\n- Treatment: Routine Cleaning & Checkup\n- Date: Tomorrow (${new Date().toLocaleDateString()})\n- Time: 10:00 AM\n- Dentist: Dr. Sarah Johnson\n\nYou will receive a reminder SMS 24 hours prior to your visit. Looking forward to seeing you!`

        customCardType = 'booking'
        customCardData = {
          service: 'Routine Cleaning & Checkup',
          date: new Date().toLocaleDateString(),
          time: '10:00 AM',
          doctor: 'Dr. Sarah Johnson',
          status: 'Confirmed'
        }
      }
      else if (text.includes('financing') || text.includes('payment') || text.includes('cost') || text.includes('billing') || text.includes('price') || text.includes('credit')) {
        targetStage = 'Need Discovery'
        triggerEscalation = true
        replyContent = `SmileAI has logged your request regarding payment options. Because our dental implants and orthodontic procedures require customized financing layouts, I am escalating this conversation to our front-desk administrator, Lisa. She will reply here shortly.`

        customCardType = 'escalation'
        customCardData = {
          reason: 'Financing consultation request',
          assignedTo: 'Lisa (Front Desk)',
          status: 'Escalated'
        }
      }

      // Create Assistant Message
      const assistantMsg: Message = {
        id: `m-${Date.now() + 1}`,
        role: 'assistant',
        content: replyContent,
        timestamp: new Date().toISOString(),
        cardType: customCardType,
        cardData: customCardData
      }

      // Update states
      setConversations(prev => prev.map(c => {
        if (c.id === activeConversation.id) {
          const nextStatus = triggerAppointment ? 'Scheduled' : triggerEscalation ? 'Escalated' : c.status
          return {
            ...c,
            messages: [...c.messages, assistantMsg],
            lastMessage: replyContent.split('\n')[0],
            status: nextStatus,
            updatedAt: new Date().toISOString()
          }
        }
        return c
      }))

      // Update patient stage
      setPatients(prev => prev.map(p => {
        if (p.id === activePatient.id) {
          return {
            ...p,
            stage: targetStage,
            insurance: customCardType === 'insurance' ? customCardData.provider : p.insurance
          }
        }
        return p
      }))

      // Trigger actual CRM actions in real-time database simulation
      if (triggerAppointment) {
        // Create actual appointment
        const newAppt: Appointment = {
          id: `appt-${Date.now()}`,
          patientId: activePatient.id,
          patientName: activePatient.name,
          service: 'Routine Cleaning & Checkup',
          date: new Date(Date.now() + 86400000).toLocaleDateString(), // Tomorrow
          time: '10:00 AM',
          doctor: 'Dr. Sarah Johnson',
          status: 'Confirmed',
          revenue: 150
        }
        setAppointments(prev => [newAppt, ...prev])

        // Log AI Activity Timeline
        setAiActions(prev => [
          {
            id: `act-${Date.now()}`,
            type: 'created',
            title: 'Appointment Synchronized',
            description: `Booked ${activePatient.name} for Cleaning in Eaglesoft`,
            timestamp: new Date().toISOString()
          },
          ...prev
        ])

        // Notification
        setNotifications(prev => [
          {
            id: `n-${Date.now()}`,
            title: 'Appointment Scheduled',
            description: `${activePatient.name} booked slot tomorrow at 10 AM`,
            timestamp: new Date().toISOString(),
            read: false,
            type: 'booking'
          },
          ...prev
        ])
      }

      if (triggerInsuranceCheck) {
        setAiActions(prev => [
          {
            id: `act-${Date.now()}`,
            type: 'verified',
            title: 'Insurance Verified',
            description: `Change Healthcare returned copay details for ${activePatient.name}`,
            timestamp: new Date().toISOString()
          },
          ...prev
        ])
      }

      if (triggerEscalation) {
        setAiActions(prev => [
          {
            id: `act-${Date.now()}`,
            type: 'escalated',
            title: 'Convo Escalated to Desk',
            description: `Financing parameters required for ${activePatient.name}`,
            timestamp: new Date().toISOString()
          },
          ...prev
        ])

        setNotifications(prev => [
          {
            id: `n-${Date.now()}`,
            title: 'Staff Assistance Needed',
            description: `${activePatient.name} requested financing advice`,
            timestamp: new Date().toISOString(),
            read: false,
            type: 'escalation'
          },
          ...prev
        ])
      }

      setIsTyping(false)
    }, 1500)
  }

  // Trigger quick suggestion chips
  const handleQuickChipAction = (chipText: string) => {
    handleSendMessage(undefined, chipText)
  }

  // Periodical simulation removed for simplicity and performance

  return (
    <>
      {/* Floating launcher Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen)
        }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          const x = e.clientX - rect.left - rect.width / 2
          const y = e.clientY - rect.top - rect.height / 2
          setButtonTransform(`translate(${x * 0.35}px, ${y * 0.35}px)`)
        }}
        onMouseLeave={() => setButtonTransform('translate(0px, 0px)')}
        style={{ transform: buttonTransform }}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-gradient-to-br from-indigo-650 via-indigo-700 to-violet-650 hover:from-indigo-600 hover:to-violet-550 border border-indigo-400/30 hover:border-indigo-400/50 shadow-[0_8px_30px_rgba(99,102,241,0.45)] hover:shadow-[0_12px_40px_rgba(99,102,241,0.65)] hover:-translate-y-0.5 transition-all duration-300 ease-out cursor-pointer group flex items-center justify-center w-14 h-14"
        aria-label="Toggle SmileAI Concierge"
      >
        <span className="absolute inset-0 rounded-full bg-indigo-500/25 animate-ping opacity-75" />

        {isOpen ? (
          <X className="w-6 h-6 text-white transition-transform duration-300 rotate-90" />
        ) : (
          <Tooth className="w-6.5 h-6.5 text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
        )}

        {notifications.filter(n => !n.read).length > 0 && !isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full border-2 border-background flex items-center justify-center text-[9px] font-black text-white shadow-md">
            {notifications.filter(n => !n.read).length}
          </span>
        )}
      </button>

      {/* Chat Window/Workspace Drawer */}
      {isOpen && (
        <div
          className={`fixed bottom-20 right-4 sm:right-6 sm:bottom-24 z-50 rounded-2xl glass-lg border border-slate-200/40 dark:border-white/5 shadow-2xl flex flex-col overflow-hidden transition-all duration-350 ease-out text-foreground
            ${isExpanded
              ? 'w-[96vw] max-w-7xl h-[86vh] animate-workspace'
              : 'w-[92vw] sm:w-96 h-[80vh] sm:h-[600px] max-h-[600px] animate-message'
            }
          `}
        >
          {/* Main Console Top Bar - Only shown in Expanded Admin mode */}
          {isExpanded && (
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-200/20 dark:border-white/5 bg-slate-900/90 text-white backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center relative shadow-inner">
                  <Tooth className="w-5.5 h-5.5 text-white" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                      SmileAI Agent Console
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-500/20">
                      Live Booking System
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">Dental Operations Concierge Simulator</p>
                </div>
              </div>

              {/* Console Control Actions */}
              <div className="flex items-center gap-3">

                {/* Notification Bell Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="w-9 h-9 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer relative"
                    title="Notifications Feed"
                  >
                    <Bell className="w-4 h-4" />
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                    )}
                  </button>

                  {/* Notifications dropdown pane */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2.5 w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 p-4 space-y-3 text-slate-200">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Live Alerts</span>
                        <button
                          onClick={() => {
                            setNotifications(prev => prev.map(n => ({ ...n, read: true })))
                          }}
                          className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold"
                        >
                          Clear unread
                        </button>
                      </div>
                      <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
                        {notifications.length === 0 ? (
                          <div className="text-center py-6 text-slate-500 text-xs">No active notifications</div>
                        ) : (
                          notifications.map(notif => (
                            <div key={notif.id} className={`p-2.5 rounded-xl border text-xs space-y-1 transition ${notif.read ? 'bg-white/40 border-slate-800' : 'bg-slate-800/60 border-indigo-500/25'}`}>
                              <div className="flex items-center justify-between font-bold text-slate-100">
                                <span>{notif.title}</span>
                                <span className="text-[9px] text-slate-500 font-normal">
                                  {mounted ? new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 leading-normal">{notif.description}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Expansion togglers */}
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="w-9 h-9 rounded-lg hover:bg-slate-800 items-center justify-center text-slate-400 hover:text-white transition cursor-pointer hidden md:flex"
                  title={isExpanded ? 'Compact Assistant Mode' : 'Full CRM Workspace Dashboard'}
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  className="w-9 h-9 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer"
                  aria-label="Close Dashboard"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Expanded 3-Column Desk Workspace */}
          {isExpanded ? (
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-background">

              {/* Column 1: Conversations Inbox & CRM Metrics (28% width) */}
              <div className="hidden md:flex w-80 border-r border-slate-200/20 dark:border-white/5 flex-col flex-shrink-0 bg-white/50 dark:bg-slate-950/40 transition-all duration-300">
                {/* Search Inbox bar */}
                <div className="p-4.5 border-b border-slate-200/20 dark:border-white/5">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground/60" />
                    <input
                      type="text"
                      placeholder="Search patient, status, note..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9.5 pr-4 py-2 text-xs rounded-xl border border-slate-200/60 dark:border-white/5 bg-card/65 dark:bg-slate-950/50 focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>

                  {/* Priority Status Filters */}
                  <div className="flex gap-1.5 overflow-x-auto pt-4 pb-1 scrollbar-none">
                    {(['All', 'Open', 'Waiting', 'Scheduled', 'Escalated', 'Completed'] as const).map(filter => {
                      const count = filter === 'All'
                        ? conversations.length
                        : conversations.filter(c => c.status === filter).length

                      return (
                        <button
                          key={filter}
                          onClick={() => setActiveFilter(filter)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wide uppercase transition flex-shrink-0 cursor-pointer
                            ${activeFilter === filter
                              ? 'bg-indigo-600 dark:bg-indigo-500/20 text-white dark:text-indigo-300 border border-indigo-500/30'
                              : 'bg-white dark:bg-white/5 text-muted-foreground hover:text-foreground'
                            }
                          `}
                        >
                          {filter} ({count})
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Patient Threads list */}
                <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2 select-none scrollbar-thin">
                  <span className="text-[10px] font-black text-muted-foreground uppercase px-2 tracking-widest block mb-2.5">
                    Active Patient Threads
                  </span>

                  {filteredConversations.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground text-xs">
                      <MessageSquare className="w-8 h-8 opacity-30 mx-auto mb-2" />
                      No conversations found matching filters.
                    </div>
                  ) : (
                    filteredConversations.map(conv => {
                      const isActive = conv.id === activeConversation.id
                      const patient = patients.find(p => p.id === conv.patientId)
                      const statusColors = {
                        Open: 'bg-blue-500 text-blue-700 dark:text-blue-300 bg-blue-500/10 border-blue-500/20',
                        Waiting: 'bg-amber-500 text-amber-700 dark:text-amber-300 bg-amber-500/10 border-amber-500/20',
                        Scheduled: 'bg-emerald-500 text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
                        Completed: 'bg-slate-500 text-slate-700 dark:text-slate-300 bg-indigo-500/10 border-slate-500/20',
                        Escalated: 'bg-rose-500 text-rose-700 dark:text-rose-300 bg-rose-500/10 border-rose-500/20'
                      }

                      return (
                        <div
                          key={conv.id}
                          onClick={() => {
                            setActiveConversationId(conv.id)
                            // Mark read
                            setConversations(prev => prev.map(c => c.id === conv.id ? { ...c, unread: false } : c))
                          }}
                          className={`p-3 rounded-xl border text-xs space-y-2 transition duration-200 cursor-pointer relative group
                            ${isActive
                              ? 'bg-indigo-50/60 dark:bg-indigo-500/10 border-indigo-500/30'
                              : 'bg-card/45 hover:bg-white dark:hover:bg-white/5 border-slate-200/40 dark:border-white/5'
                            }
                          `}
                        >
                          {conv.unread && (
                            <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-indigo-650 dark:bg-indigo-400 rounded-full" />
                          )}
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-foreground truncate max-w-[120px]">{conv.patientName}</span>
                            <span className="text-[9px] text-muted-foreground">
                              {mounted ? new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                            </span>
                          </div>

                          <p className="text-[11px] text-muted-foreground truncate leading-normal">
                            {conv.lastMessage}
                          </p>

                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[9px] font-bold text-indigo-650 dark:text-indigo-400 flex items-center gap-1">
                              <Bot className="w-3 h-3 text-indigo-400" />
                              Stage: {patient?.stage || 'Greeting'}
                            </span>
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border ${statusColors[conv.status]}`}>
                              {conv.status}
                            </span>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>

              {/* Column 2: Conversational Hub & Qualification Progress (47% width) */}
              <div className="flex-1 flex flex-col h-full bg-white/5 dark:bg-card/5">

                {/* Active thread header */}
                <div className="px-6 py-4 border-b border-slate-200/20 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 dark:bg-slate-950/30">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-foreground">{activePatient.name}</h4>
                      <span className="text-[10px] text-muted-foreground">({activePatient.insurance})</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-2">
                      <span>{activePatient.phone}</span>
                      <span>•</span>
                      <span>{activePatient.email}</span>
                    </p>
                  </div>

                  {/* Manual priority/status update dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Queue status:</span>
                    <select
                      value={activeConversation.status}
                      onChange={(e) => handleConversationStatusChange(e.target.value as Conversation['status'])}
                      className="px-2 py-1.5 bg-card dark:bg-slate-900 border border-slate-200/60 dark:border-white/10 rounded-xl text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
                    >
                      <option value="Open">Open (New)</option>
                      <option value="Waiting">Waiting (Pending AI)</option>
                      <option value="Scheduled">Scheduled (Booked)</option>
                      <option value="Escalated">Escalated (Staff)</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>





                {/* Conversation message panels */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 pr-3 scrollbar-thin">
                  {activeConversation.messages.map(msg => {
                    const isSystemAI = msg.role === 'assistant'

                    return (
                      <div key={msg.id} className={`flex gap-3 animate-message ${msg.role !== 'assistant' ? 'justify-end' : 'justify-start'}`}>
                        {isSystemAI && (
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center flex-shrink-0 shadow-inner">
                            <Tooth className="w-4 h-4 text-white" />
                          </div>
                        )}

                        <div className="max-w-[80%] flex flex-col gap-1.5">
                          <div
                            className={`px-4.5 py-3 rounded-2xl text-xs leading-relaxed ${msg.role !== 'assistant'
                              ? 'bg-gradient-to-br from-indigo-650 to-indigo-700 text-white rounded-tr-none shadow-md'
                              : 'bg-card dark:bg-slate-900 border border-slate-200/40 dark:border-white/5 text-foreground rounded-tl-none shadow-sm'
                              }`}
                          >
                            <p className="whitespace-pre-line font-medium">{msg.content}</p>

                            {/* Dynamic Card rendering in messages for realistic workflow actions */}
                            {msg.cardType === 'insurance' && msg.cardData && (
                              <div className="mt-3 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl space-y-2.5 text-[11px] font-sans text-indigo-950 dark:text-indigo-300">
                                <div className="flex items-center justify-between border-b border-indigo-500/20 pb-1.5 font-bold">
                                  <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> API ELIGIBILITY STATUS</span>
                                  <span className="text-emerald-500 dark:text-emerald-400">{msg.cardData.status}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px]">
                                  <div>Provider: <strong>{msg.cardData.provider}</strong></div>
                                  <div>Deductible: <strong>{msg.cardData.deductible}</strong></div>
                                  <div className="col-span-2">Copay Breakdown: <strong>{msg.cardData.copay}</strong></div>
                                </div>
                              </div>
                            )}

                            {msg.cardType === 'booking' && msg.cardData && (
                              <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-2 text-[11px] text-emerald-950 dark:text-emerald-300">
                                <div className="flex items-center justify-between border-b border-emerald-500/20 pb-1.5 font-bold">
                                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-emerald-400" /> EAGLESOFT SYNCED</span>
                                  <span className="text-emerald-500 dark:text-emerald-400">Confirmed</span>
                                </div>
                                <div className="grid grid-cols-2 gap-1 font-mono text-[10px]">
                                  <div>Dr: <strong>{msg.cardData.doctor}</strong></div>
                                  <div>Service: <strong>{msg.cardData.service}</strong></div>
                                  <div className="col-span-2">Time Slot: <strong>{msg.cardData.date} at {msg.cardData.time}</strong></div>
                                </div>
                              </div>
                            )}

                            {msg.cardType === 'escalation' && msg.cardData && (
                              <div className="mt-3 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl space-y-2 text-[11px] text-rose-950 dark:text-rose-300">
                                <div className="flex items-center justify-between border-b border-rose-500/20 pb-1.5 font-bold">
                                  <span className="flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5 text-rose-400 animate-pulse" /> QUEUED FOR DENTIST STACK</span>
                                  <span className="text-rose-500 dark:text-rose-450">{msg.cardData.status}</span>
                                </div>
                                <p className="text-[10px] italic">Routed query: &quot;{msg.cardData.reason}&quot;</p>
                                <div className="text-[10px] font-bold">Assigned Staff Desk: {msg.cardData.assignedTo}</div>
                              </div>
                            )}
                          </div>

                          <span className="text-[9px] text-muted-foreground px-1 self-start flex items-center gap-1">
                            {isSystemAI ? 'SmileAI Concierge' : 'Patient (User)'}
                            <span className="w-0.5 h-0.5 rounded-full bg-muted-foreground/45" />
                            {mounted ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        </div>

                        {msg.role !== 'assistant' && (
                          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center flex-shrink-0 border border-slate-500/20 dark:border-indigo-500/30">
                            <User className="w-4 h-4 text-indigo-650 dark:text-indigo-300" />
                          </div>
                        )}
                      </div>
                    )
                  })}

                  {/* Smart Welcome Screen State */}
                  {bookingState.step === 'idle' && (
                    <div className="p-5 rounded-2xl bg-card dark:bg-slate-900 border border-slate-200/40 dark:border-white/5 space-y-4.5 shadow-sm animate-message text-foreground max-w-md mx-auto">
                      <div className="text-center space-y-2 py-1">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center mx-auto shadow-md">
                          <Tooth className="w-6 h-6 text-white" />
                        </div>
                        <h5 className="font-extrabold text-sm text-foreground tracking-tight">Welcome</h5>
                        <p className="text-xs text-muted-foreground">What would you like help with today?</p>
                      </div>

                      {/* Guided Experience Actions Grid */}
                      <div className="grid grid-cols-1 gap-2">
                        <button
                          type="button"
                          onClick={() => setBookingState({ step: 'service' })}
                          className="w-full p-3 bg-white dark:bg-slate-950/40 hover:bg-indigo-500/10 border border-slate-200/60 dark:border-white/5 hover:border-indigo-500/30 rounded-xl transition duration-150 cursor-pointer flex items-center gap-3 text-left"
                        >
                          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 flex-shrink-0">
                            <Calendar className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-xs text-foreground">Book Appointment</div>
                            <p className="text-[10px] text-muted-foreground mt-0.5">Schedule a clean, checkup, or treatment</p>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 ml-auto text-slate-400" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setBookingState({ step: 'date', service: 'General Visit' })}
                          className="w-full p-3 bg-white dark:bg-slate-950/40 hover:bg-indigo-500/10 border border-slate-200/60 dark:border-white/5 hover:border-indigo-500/30 rounded-xl transition duration-150 cursor-pointer flex items-center gap-3 text-left"
                        >
                          <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-500 flex-shrink-0">
                            <Clock className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-xs text-foreground">Check Availability</div>
                            <p className="text-[10px] text-muted-foreground mt-0.5">Find available clinic times</p>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 ml-auto text-slate-400" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const userMsg: Message = { id: `m-u-${Date.now()}`, role: 'user', content: 'Insurance questions', timestamp: new Date().toISOString() }
                            const assistMsg: Message = { id: `m-a-${Date.now()}`, role: 'assistant', content: 'We accept MetLife, Cigna, Delta Dental, and other PPO plans. Please select your insurance plan from the form options below:', timestamp: new Date().toISOString() }
                            setConversations(prev => prev.map(c => c.id === activeConversation.id ? { ...c, messages: [...c.messages, userMsg, assistMsg] } : c))
                            setBookingState({ step: 'contact', insurance: 'Verifying...' })
                          }}
                          className="w-full p-3 bg-white dark:bg-slate-950/40 hover:bg-indigo-500/10 border border-slate-200/60 dark:border-white/5 hover:border-indigo-500/30 rounded-xl transition duration-150 cursor-pointer flex items-center gap-3 text-left"
                        >
                          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 flex-shrink-0">
                            <Shield className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-xs text-foreground">Insurance Questions</div>
                            <p className="text-[10px] text-muted-foreground mt-0.5">Check copays and coverage options</p>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 ml-auto text-slate-400" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const userMsg: Message = { id: `m-u-${Date.now()}`, role: 'user', content: 'Reschedule my appointment', timestamp: new Date().toISOString() }
                            const assistMsg: Message = { id: `m-a-${Date.now()}`, role: 'assistant', content: 'I can help you reschedule. Select the service you wish to reschedule:', timestamp: new Date().toISOString() }
                            setConversations(prev => prev.map(c => c.id === activeConversation.id ? { ...c, messages: [...c.messages, userMsg, assistMsg] } : c))
                          }}
                          className="w-full p-3 bg-white dark:bg-slate-950/40 hover:bg-indigo-500/10 border border-slate-200/60 dark:border-white/5 hover:border-indigo-500/30 rounded-xl transition duration-150 cursor-pointer flex items-center gap-3 text-left"
                        >
                          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 flex-shrink-0">
                            <RefreshCw className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-xs text-foreground">Reschedule Appointment</div>
                            <p className="text-[10px] text-muted-foreground mt-0.5">Move your appointment to a different slot</p>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 ml-auto text-slate-400" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            handleConversationStatusChange('Escalated')
                            const userMsg: Message = { id: `m-u-${Date.now()}`, role: 'user', content: 'Contact Clinic', timestamp: new Date().toISOString() }
                            const assistMsg: Message = { id: `m-a-${Date.now()}`, role: 'assistant', content: 'Routing you to coordinator Lisa. You can reach us directly at (555) 019-2834 or support@smileclinic.com.', timestamp: new Date().toISOString() }
                            setConversations(prev => prev.map(c => c.id === activeConversation.id ? { ...c, messages: [...c.messages, userMsg, assistMsg] } : c))
                          }}
                          className="w-full p-3 bg-white dark:bg-slate-950/40 hover:bg-indigo-500/10 border border-slate-200/60 dark:border-white/5 hover:border-indigo-500/30 rounded-xl transition duration-150 cursor-pointer flex items-center gap-3 text-left"
                        >
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 flex-shrink-0">
                            <Phone className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-xs text-foreground">Contact Clinic</div>
                            <p className="text-[10px] text-muted-foreground mt-0.5">Speak with staff or get clinic details</p>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 ml-auto text-slate-400" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Booking Wizard active step screens */}
                  {renderBookingWizard()}

                  {/* Typing Simulator */}
                  {isTyping && (
                    <div className="flex gap-3 justify-start items-center">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center flex-shrink-0 shadow-inner">
                        <Tooth className="w-4 h-4 text-white animate-spin" />
                      </div>
                      <div className="bg-card dark:bg-slate-900 border border-slate-200/40 dark:border-white/5 px-4.5 py-3 rounded-2xl rounded-tl-none shadow-sm">
                        <div className="flex gap-1.5 items-center h-4">
                          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Suggested Action Chips */}
                <div className="px-6 py-2.5 bg-white dark:bg-slate-900 border-t border-slate-200/10 dark:border-white/5 flex gap-2 overflow-x-auto scrollbar-none items-center">
                  <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mr-1.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-indigo-500" /> Options:
                  </span>
                  {getQuickChips().map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        if (chip.action) {
                          chip.action()
                        } else if (chip.text) {
                          handleSendMessage(undefined, chip.text)
                        }
                      }}
                      className="px-3 py-1.5 bg-card hover:bg-indigo-500/10 dark:bg-slate-900 border border-slate-200/60 dark:border-white/10 hover:border-indigo-500/30 rounded-full text-[10px] font-bold text-foreground tracking-wide transition duration-155 cursor-pointer flex-shrink-0 flex items-center gap-1.5"
                    >
                      {getLucideIcon(chip.icon, "w-3 h-3 text-indigo-500")}
                      <span>{chip.label}</span>
                    </button>
                  ))}
                </div>

                {/* Composer Textbox */}
                <div className="p-4 border-t border-slate-200/20 dark:border-white/5 bg-white/50 dark:bg-slate-900/50">
                  <form onSubmit={handleSendMessage} className="flex gap-2.5">
                    <div className="flex-1 bg-card dark:bg-slate-950/50 border border-slate-200/60 dark:border-white/5 rounded-2xl px-4 py-2 flex items-center focus-within:border-indigo-500/50 transition">
                      <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder={
                          bookingState.step === 'idle'
                            ? `Message ${activePatient.name} or type scheduling cues (e.g. "book tomorrow")...`
                            : `Select options above or type special requests...`
                        }
                        className="flex-1 bg-transparent border-0 p-0 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:ring-0 h-9"
                      />

                      <div className="flex items-center gap-2 border-l border-slate-500/10 pl-3 ml-2 text-muted-foreground/60">
                        <button
                          type="button"
                          onClick={() => handleQuickChipAction('I need to book a dental slot cleaning tomorrow.')}
                          className="p-1 hover:bg-indigo-500/10 hover:text-indigo-400 rounded transition cursor-pointer"
                          title="Schedule Calendar"
                        >
                          <Calendar className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickChipAction('Check my MetLife insurance coverage details')}
                          className="p-1 hover:bg-indigo-500/10 hover:text-violet-400 rounded transition cursor-pointer"
                          title="Verify Insurance API"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={!inputText.trim()}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition flex-shrink-0 border cursor-pointer
                        ${!inputText.trim()
                          ? 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-600 border-slate-200/50 dark:border-slate-800/50 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white border-indigo-500/20 shadow-[0_2px_10px_rgba(99,102,241,0.2)]'
                        }`}
                    >
                      <Send className="w-4 h-4 flex-shrink-0" />
                    </button>
                  </form>
                </div>
              </div>

            </div>
          ) : (
            /* Compact Mode Layout */
            <div className="flex-1 flex flex-col h-full bg-background relative">
              {/* Header Details */}
              <div className="px-5 py-3.5 border-b border-slate-200/20 dark:border-white/5 flex items-center justify-between bg-white dark:bg-slate-900">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow">
                    <Tooth className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-foreground tracking-tight flex items-center gap-1.5">
                      SmileAI Patient Concierge
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </h4>
                    <p className="text-[9px] text-muted-foreground mt-0.5">Typically replies instantly</p>
                  </div>
                </div>

                {/* Right side actions in compact mode */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsExpanded(true)}
                    className="w-8.5 h-8.5 rounded-lg hover:bg-indigo-500/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition cursor-pointer hidden md:flex"
                    title="Expand Workspace Dashboard"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-8.5 h-8.5 rounded-lg hover:bg-indigo-500/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition cursor-pointer"
                    aria-label="Close Chat"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>



              {/* Compact chat thread log */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 pr-2 scrollbar-thin">
                {activeConversation.messages.map(msg => {
                  const isUser = msg.role === 'user'
                  return (
                    <div key={msg.id} className={`flex gap-2.5 animate-message ${isUser ? 'justify-end' : 'justify-start'}`}>
                      {!isUser && (
                        <div className="w-7.5 h-7.5 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center flex-shrink-0 shadow-inner">
                          <Tooth className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}

                      <div className="max-w-[80%] flex flex-col gap-1">
                        <div
                          className={`px-4 py-2.5 rounded-xl text-xs leading-relaxed ${isUser
                            ? 'bg-gradient-to-br from-indigo-650 to-indigo-700 text-white rounded-tr-none'
                            : 'bg-card dark:bg-slate-900 border border-slate-200/40 dark:border-white/5 text-foreground rounded-tl-none'
                            }`}
                        >
                          <p className="whitespace-pre-line">{msg.content}</p>

                          {/* Dynamic Card rendering in messages for realistic workflow actions in compact mode */}
                          {msg.cardType === 'insurance' && msg.cardData && (
                            <div className="mt-2.5 p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl space-y-2 text-[10px] font-sans text-indigo-950 dark:text-indigo-300">
                              <div className="flex items-center justify-between border-b border-indigo-500/20 pb-1 font-bold">
                                <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-indigo-400" /> ELIGIBILITY CHECK</span>
                                <span className="text-emerald-500 dark:text-emerald-400">{msg.cardData.status}</span>
                              </div>
                              <div className="grid grid-cols-2 gap-1 font-mono text-[9px]">
                                <div>Provider: <strong>{msg.cardData.provider}</strong></div>
                                <div>Deductible: <strong>{msg.cardData.deductible}</strong></div>
                                <div className="col-span-2">Copay: <strong>{msg.cardData.copay}</strong></div>
                              </div>
                            </div>
                          )}

                          {msg.cardType === 'booking' && msg.cardData && (
                            <div className="mt-2.5 p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-1.5 text-[10px] text-emerald-950 dark:text-emerald-300">
                              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-1 font-bold">
                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-emerald-500" /> EAGLESOFT SYNCED</span>
                                <span className="text-emerald-500 dark:text-emerald-400">Confirmed</span>
                              </div>
                              <div className="grid grid-cols-2 gap-1 font-mono text-[9px]">
                                <div>Dr: <strong>{msg.cardData.doctor}</strong></div>
                                <div>Service: <strong>{msg.cardData.service}</strong></div>
                                <div className="col-span-2">Time: <strong>{msg.cardData.date} at {msg.cardData.time}</strong></div>
                              </div>
                            </div>
                          )}

                          {msg.cardType === 'escalation' && msg.cardData && (
                            <div className="mt-2.5 p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl space-y-1.5 text-[10px] text-rose-950 dark:text-rose-300">
                              <div className="flex items-center justify-between border-b border-rose-500/20 pb-1 font-bold">
                                <span className="flex items-center gap-1"><AlertCircle className="w-3 h-3 text-rose-450 animate-pulse" /> STAFF ESCALATED</span>
                                <span className="text-rose-500 dark:text-rose-450">{msg.cardData.status}</span>
                              </div>
                              <p className="text-[9px] italic">Reason: &quot;{msg.cardData.reason}&quot;</p>
                              <div className="text-[9px] font-bold">Desk Agent: {msg.cardData.assignedTo}</div>
                            </div>
                          )}
                        </div>
                        <span className="text-[8px] text-muted-foreground px-1 self-start">
                          {isUser ? 'You' : 'SmileAI'} • {mounted ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                    </div>
                  )
                })}

                {/* Welcome Screen state in Compact Mode */}
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
                          const userMsg: Message = { id: `m-u-${Date.now()}`, role: 'user', content: 'Insurance questions', timestamp: new Date().toISOString() }
                          const assistMsg: Message = { id: `m-a-${Date.now()}`, role: 'assistant', content: 'We accept MetLife, Cigna, Delta Dental, and other PPO plans. Please select your insurance plan from the form options below:', timestamp: new Date().toISOString() }
                          setConversations(prev => prev.map(c => c.id === activeConversation.id ? { ...c, messages: [...c.messages, userMsg, assistMsg] } : c))
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
                          const userMsg: Message = { id: `m-u-${Date.now()}`, role: 'user', content: 'Reschedule my appointment', timestamp: new Date().toISOString() }
                          const assistMsg: Message = { id: `m-a-${Date.now()}`, role: 'assistant', content: 'I can help you reschedule. Select the service you wish to reschedule:', timestamp: new Date().toISOString() }
                          setConversations(prev => prev.map(c => c.id === activeConversation.id ? { ...c, messages: [...c.messages, userMsg, assistMsg] } : c))
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
                          handleConversationStatusChange('Escalated')
                          const userMsg: Message = { id: `m-u-${Date.now()}`, role: 'user', content: 'Contact Clinic', timestamp: new Date().toISOString() }
                          const assistMsg: Message = { id: `m-a-${Date.now()}`, role: 'assistant', content: 'Routing you to coordinator Lisa. You can reach us directly at (555) 019-2834 or support@smileclinic.com.', timestamp: new Date().toISOString() }
                          setConversations(prev => prev.map(c => c.id === activeConversation.id ? { ...c, messages: [...c.messages, userMsg, assistMsg] } : c))
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
                  <div className="flex gap-2.5 justify-start items-center">
                    <div className="w-7.5 h-7.5 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center flex-shrink-0">
                      <Tooth className="w-3.5 h-3.5 text-white animate-spin" />
                    </div>
                    <div className="bg-card dark:bg-slate-900 border border-slate-200/40 dark:border-white/5 px-4 py-2.5 rounded-xl rounded-tl-none flex items-center">
                      <div className="flex gap-1.5 items-center">
                        <span className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Compact Suggested Action Chips */}
              <div className="px-4 py-2 bg-white dark:bg-slate-900 border-t border-slate-200/10 dark:border-white/5 flex gap-1.5 overflow-x-auto scrollbar-none items-center">
                <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mr-1 flex items-center gap-0.5 flex-shrink-0">
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
                        handleSendMessage(undefined, chip.text)
                      }
                    }}
                    className="px-2.5 py-1 bg-card hover:bg-indigo-500/10 dark:bg-slate-900 border border-slate-200/60 dark:border-white/10 hover:border-indigo-500/30 rounded-full text-[9px] font-bold text-foreground tracking-wide transition duration-155 cursor-pointer flex-shrink-0 flex items-center gap-1"
                  >
                    {getLucideIcon(chip.icon, "w-2.5 h-2.5 text-indigo-500")}
                    <span>{chip.label}</span>
                  </button>
                ))}
              </div>

              {/* Composer */}
              <div className="p-3 border-t border-slate-200/20 dark:border-white/5 bg-white/50 dark:bg-slate-900/50">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={
                      bookingState.step === 'idle'
                        ? "Type a message or request dental slot..."
                        : "Select options above or type special requests..."
                    }
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200/60 dark:border-white/5 bg-card dark:bg-slate-950/50 text-foreground placeholder-muted-foreground focus:outline-none focus:border-indigo-500 h-9"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition flex-shrink-0 border cursor-pointer
                      ${!inputText.trim()
                        ? 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-600 border-slate-200/50 dark:border-slate-800/50 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white border-indigo-500/20 shadow-[0_2px_10px_rgba(99,102,241,0.2)]'
                      }`}
                  >
                    <Send className="w-4 h-4 flex-shrink-0" />
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
