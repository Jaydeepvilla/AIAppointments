'use client'

import { useEffect, useState, useRef } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts'
import { Calendar, DollarSign, Users, TrendingUp, ShieldAlert, CheckCircle, RefreshCw, Bell } from 'lucide-react'
import { Tooth } from '@/components/tooth-icon'
import { useRouter } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { useTheme } from 'next-themes'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  getAdminAppointments,
  getUpcomingAppointments,
  getRevenueData,
  updateAppointmentStatus,
} from '@/app/actions/appointments'
import { getAnalytics, getDemoModeStatus, resetDemoData, getDemoNotifications, markDemoNotificationRead } from '@/app/actions/demo'

interface Appointment {
  id: number
  patientName: string
  patientEmail: string
  patientPhone: string
  appointmentDate: string
  appointmentTime: string
  status: string
  service: string
  price: string
}

export function DashboardClient() {
  const router = useRouter()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([])
  const [revenueData, setRevenueData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState('overview')

  // Demo status, analytics & notifications states
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [metrics, setMetrics] = useState<{
    totalAppointments: number
    todayAppointments: number
    upcomingAppointmentsCount: number
    completedAppointments: number
    totalRevenue: number
    bookingRate: number
    utilizationRate: number
  } | null>(null)
  const [resetting, setResetting] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)
  const notifContainerRef = useRef<HTMLDivElement>(null)

  const loadData = async () => {
    try {
      const [
        appointmentsData,
        upcomingData,
        revenueRawData,
        metricsData,
        demoStatus,
        notificationsData,
      ] = await Promise.all([
        getAdminAppointments(),
        getUpcomingAppointments(),
        getRevenueData(),
        getAnalytics(),
        getDemoModeStatus(),
        getDemoNotifications(),
      ])

      setAppointments(appointmentsData)
      setUpcomingAppointments(upcomingData)
      setMetrics(metricsData)
      setIsDemoMode(demoStatus.isDemoMode)
      setNotifications(notificationsData || [])

      // Process revenue data for charts
      const revenueByDate: { [key: string]: number } = {}
      revenueRawData.forEach((item) => {
        const date = item.date || 'Unknown'
        revenueByDate[date] = (revenueByDate[date] || 0) + parseFloat(item.total || '0')
      })

      const chartData = Object.entries(revenueByDate)
        .map(([date, total]) => ({
          date,
          revenue: total,
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

      setRevenueData(chartData)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()

    const handleClickOutside = (event: MouseEvent) => {
      if (notifContainerRef.current && !notifContainerRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleStatusChange = async (appointmentId: number, newStatus: string) => {
    try {
      await updateAppointmentStatus(appointmentId, newStatus)
      // Refetch analytics metrics after updating status so they refresh instantly
      const [appointmentsData, upcomingData, revenueRawData, metricsData] = await Promise.all([
        getAdminAppointments(),
        getUpcomingAppointments(),
        getRevenueData(),
        getAnalytics(),
      ])

      setAppointments(appointmentsData)
      setUpcomingAppointments(upcomingData)
      setMetrics(metricsData)

      const revenueByDate: { [key: string]: number } = {}
      revenueRawData.forEach((item) => {
        const date = item.date || 'Unknown'
        revenueByDate[date] = (revenueByDate[date] || 0) + parseFloat(item.total || '0')
      })

      const chartData = Object.entries(revenueByDate)
        .map(([date, total]) => ({
          date,
          revenue: total,
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

      setRevenueData(chartData)
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const handleResetDemo = async () => {
    setResetting(true)
    setResetSuccess(false)
    try {
      const result = await resetDemoData()
      if (result.success) {
        setResetSuccess(true)
        await loadData()
        setTimeout(() => setResetSuccess(false), 5000)
      }
    } catch (error) {
      console.error('Failed to reset demo database:', error)
    } finally {
      setResetting(false)
    }
  }

  const totalAppointments = appointments.length
  const completedAppointments = appointments.filter((a) => a.status === 'completed').length
  const totalRevenue = revenueData.reduce((sum, item) => sum + (item.revenue || 0), 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-lg bg-indigo-500/20 mx-auto mb-4 animate-pulse border border-indigo-500/20" />
          <p className="text-muted-foreground text-sm font-semibold">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 pb-12">
      {/* Header */}
      <nav className="glass sticky top-0 z-30 backdrop-blur-md border-b border-border bg-card/15">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shadow-inner">
              <Tooth className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-foreground">DentalAI</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary text-muted-foreground border border-border">
                {isDemoMode ? 'Demo Mode' : 'Dashboard'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Fake Notifications Bell */}
            {isDemoMode && (
              <div className="relative" ref={notifContainerRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-border bg-card/45 hover:bg-card/80 text-foreground transition-all duration-200 focus:outline-none relative cursor-pointer"
                  aria-label="Notifications"
                >
                  <Bell className="w-[18px] h-[18px]" />
                  {notifications.filter((n) => !n.read).length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-background animate-pulse" />
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2.5rem)] rounded-xl border border-border bg-card/95 backdrop-blur-md shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-border flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">Notifications</span>
                      {notifications.filter((n) => !n.read).length > 0 && (
                        <span className="text-[10px] bg-indigo-500/10 text-indigo-500 px-1.5 py-0.5 rounded-full border border-indigo-500/20 font-bold">
                          {notifications.filter((n) => !n.read).length} New
                        </span>
                      )}
                    </div>
                    <div className="max-h-64 overflow-y-auto divide-y divide-border">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center text-xs text-muted-foreground">
                          No notifications
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`px-4 py-2.5 hover:bg-secondary/40 transition duration-150 flex flex-col gap-1 cursor-pointer ${
                              !n.read ? 'bg-indigo-500/5' : ''
                            }`}
                            onClick={async () => {
                              if (!n.read) {
                                await markDemoNotificationRead(n.id)
                                setNotifications(
                                  notifications.map((item) =>
                                    item.id === n.id ? { ...item, read: true } : item
                                  )
                                )
                              }
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <span className={`text-xs font-bold ${
                                n.type === 'success' ? 'text-emerald-600 dark:text-emerald-500' :
                                n.type === 'error' ? 'text-red-650 dark:text-red-500' :
                                n.type === 'warning' ? 'text-amber-600 dark:text-amber-500' : 'text-foreground'
                              }`}>{n.title}</span>
                              {!n.read && (
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                              )}
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                              {n.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <ThemeToggle />
            <UserButton />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 p-1 mb-8 rounded-xl bg-card/45 border border-border max-w-md">
          {['overview', 'appointments', 'analytics', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`flex-1 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                selectedTab === tab
                  ? 'bg-indigo-500/10 text-indigo-650 dark:text-indigo-300 border border-indigo-500/20 shadow-sm font-bold'
                  : 'text-muted-foreground hover:text-foreground border border-transparent'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
              {/* Today's Appointments */}
              <div className="glass p-5 rounded-2xl border border-border relative overflow-hidden shadow-lg group hover:border-indigo-500/10 transition-all duration-300">
                <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/5 blur-2xl rounded-full pointer-events-none" />
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Today's Bookings</p>
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                  </div>
                </div>
                <p className="text-2xl font-extrabold text-foreground tracking-tight">{metrics?.todayAppointments ?? 0}</p>
                <div className="flex items-center gap-1.5 mt-3 text-[10px] font-semibold text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  Today
                </div>
              </div>

              {/* Upcoming Appointments */}
              <div className="glass p-5 rounded-2xl border border-border relative overflow-hidden shadow-lg group hover:border-indigo-500/10 transition-all duration-300">
                <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/5 blur-2xl rounded-full pointer-events-none" />
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Upcoming Bookings</p>
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                  </div>
                </div>
                <p className="text-2xl font-extrabold text-foreground tracking-tight">{metrics?.upcomingAppointmentsCount ?? upcomingAppointments.length}</p>
                <div className="flex items-center gap-1.5 mt-3 text-[10px] font-semibold text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Next 7 days
                </div>
              </div>

              {/* Completed Appointments */}
              <div className="glass p-5 rounded-2xl border border-border relative overflow-hidden shadow-lg group hover:border-indigo-500/10 transition-all duration-300">
                <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 blur-2xl rounded-full pointer-events-none" />
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Completed</p>
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <Users className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                  </div>
                </div>
                <p className="text-2xl font-extrabold text-foreground tracking-tight">{metrics?.completedAppointments ?? completedAppointments}</p>
                <div className="flex items-center gap-1.5 mt-3 text-[10px] font-semibold text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  All-time completed
                </div>
              </div>

              {/* Booking Rate */}
              <div className="glass p-5 rounded-2xl border border-border relative overflow-hidden shadow-lg group hover:border-indigo-500/10 transition-all duration-300">
                <div className="absolute top-0 right-0 w-20 h-20 bg-violet-500/5 blur-2xl rounded-full pointer-events-none" />
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Booking Rate</p>
                  <div className="w-7 h-7 rounded-lg bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
                    <TrendingUp className="w-3.5 h-3.5 text-violet-500 dark:text-violet-400" />
                  </div>
                </div>
                <p className="text-2xl font-extrabold text-foreground tracking-tight">{metrics?.bookingRate ?? 0}%</p>
                <div className="flex items-center gap-1.5 mt-3 text-[10px] font-semibold text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                  Active bookings
                </div>
              </div>

              {/* Utilization Rate */}
              <div className="glass p-5 rounded-2xl border border-border relative overflow-hidden shadow-lg group hover:border-indigo-500/10 transition-all duration-300">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 blur-2xl rounded-full pointer-events-none" />
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Utilization Rate</p>
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    <Users className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                  </div>
                </div>
                <p className="text-2xl font-extrabold text-foreground tracking-tight">{metrics?.utilizationRate ?? 0}%</p>
                <div className="flex items-center gap-1.5 mt-3 text-[10px] font-semibold text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Staff occupancy
                </div>
              </div>

              {/* Total Revenue */}
              <div className="glass p-5 rounded-2xl border border-border relative overflow-hidden shadow-lg group hover:border-indigo-500/10 transition-all duration-300">
                <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/5 blur-2xl rounded-full pointer-events-none" />
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Revenue</p>
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                    <DollarSign className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                  </div>
                </div>
                <p className="text-2xl font-extrabold text-foreground tracking-tight">${(metrics?.totalRevenue ?? totalRevenue).toFixed(2)}</p>
                <div className="flex items-center gap-1.5 mt-3 text-[10px] font-semibold text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  Completed revenue
                </div>
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="glass p-6 sm:p-8 rounded-2xl border border-border shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-indigo-500 to-violet-500" />
              <h2 className="text-lg font-bold tracking-tight text-foreground mb-6">Upcoming Bookings</h2>
              <div className="space-y-3.5 max-h-80 overflow-y-auto pr-1">
                {upcomingAppointments.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-60" />
                    <p className="text-sm text-muted-foreground font-semibold">No upcoming appointments</p>
                  </div>
                ) : (
                  upcomingAppointments.map((apt) => (
                    <div key={apt.id} className="flex items-center justify-between p-4 bg-card/45 border border-border rounded-xl hover:border-indigo-500/20 transition-all duration-200">
                      <div>
                        <p className="font-bold text-sm text-foreground">{apt.patientName}</p>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-secondary text-foreground/80 border border-border font-semibold text-[10px]">
                            {apt.service}
                          </span>
                          <span>{apt.appointmentDate} at {apt.appointmentTime}</span>
                        </p>
                      </div>
                      <span className="text-xs font-semibold tracking-wide bg-indigo-500/10 text-indigo-650 dark:text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/20">
                        Scheduled
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {selectedTab === 'appointments' && (
          <div className="glass p-6 sm:p-8 rounded-2xl border border-border shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-indigo-500 to-violet-500" />
            <h2 className="text-lg font-bold tracking-tight text-foreground mb-6">All Bookings</h2>
            <div className="overflow-x-auto rounded-xl border border-border bg-card/10">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border bg-card/30">
                    <th className="text-left py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Patient</th>
                    <th className="text-left py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Service</th>
                    <th className="text-left py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Date & Time</th>
                    <th className="text-left py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Price</th>
                    <th className="text-left py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                    <th className="text-right py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {appointments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-16">
                        <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-4 opacity-60" />
                        <p className="text-muted-foreground font-semibold text-sm">No appointments found</p>
                      </td>
                    </tr>
                  ) : (
                    appointments.map((apt) => {
                      const getStatusStyles = (status: string) => {
                        switch (status) {
                          case 'confirmed':
                            return 'bg-indigo-500/10 text-indigo-650 dark:text-indigo-300 border border-indigo-500/20'
                          case 'completed':
                            return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/20'
                          case 'cancelled':
                            return 'bg-red-500/10 text-red-600 dark:text-red-300 border border-red-500/20'
                          default:
                            return 'bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/20'
                        }
                      }
                      
                      return (
                        <tr key={apt.id} className="hover:bg-card/20 transition duration-200">
                          <td className="py-4 px-5">
                            <div className="font-bold text-sm text-foreground">{apt.patientName}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">{apt.patientEmail}</div>
                          </td>
                          <td className="py-4 px-5 text-sm text-foreground/80 font-semibold">
                            {apt.service}
                          </td>
                          <td className="py-4 px-5 text-sm text-foreground/80">
                            {apt.appointmentDate} &middot; <span className="font-mono text-xs">{apt.appointmentTime}</span>
                          </td>
                          <td className="py-4 px-5 text-sm text-foreground font-bold">
                            ${parseFloat(apt.price).toFixed(2)}
                          </td>
                          <td className="py-4 px-5">
                            <select
                              value={apt.status}
                              onChange={(e) => handleStatusChange(apt.id, e.target.value)}
                              className={`rounded-full px-3 py-1 text-xs font-semibold tracking-wide focus:outline-none transition duration-150 cursor-pointer ${getStatusStyles(apt.status)}`}
                              style={{ colorScheme: isDark ? 'dark' : 'light' }}
                            >
                              <option value="pending" className="bg-card text-amber-655 dark:text-amber-300">Pending</option>
                              <option value="confirmed" className="bg-card text-indigo-650 dark:text-indigo-300">Confirmed</option>
                              <option value="completed" className="bg-card text-emerald-600 dark:text-emerald-300">Completed</option>
                              <option value="cancelled" className="bg-card text-red-650 dark:text-red-300">Cancelled</option>
                            </select>
                          </td>
                          <td className="py-4 px-5 text-right">
                            <button className="text-muted-foreground hover:text-foreground text-xs font-semibold underline-offset-4 hover:underline transition duration-150">
                              Details
                            </button>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {selectedTab === 'analytics' && (
          <div className="space-y-8">
            <div className="glass p-6 sm:p-8 rounded-2xl border border-border shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-indigo-500" />
              <h2 className="text-lg font-bold tracking-tight text-foreground mb-6">Revenue Trend</h2>
              <div className="w-full" style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)'} vertical={false} />
                    <XAxis dataKey="date" stroke={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.4)'} fontSize={11} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.4)'} fontSize={11} tickLine={false} axisLine={false} dx={-10} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#121826' : '#ffffff',
                        border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                        color: isDark ? '#ffffff' : '#0f172a',
                        fontSize: '12px',
                      }}
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', color: isDark ? '#94a3b8' : '#475569' }} />
                    <Line type="monotone" name="Revenue ($)" dataKey="revenue" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass p-6 sm:p-8 rounded-2xl border border-border shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-violet-500" />
              <h2 className="text-lg font-bold tracking-tight text-foreground mb-6">Booking Status Distribution</h2>
              <div className="w-full" style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      {
                        name: 'Status',
                        pending: appointments.filter((a) => a.status === 'pending').length,
                        confirmed: appointments.filter((a) => a.status === 'confirmed').length,
                        completed: appointments.filter((a) => a.status === 'completed').length,
                        cancelled: appointments.filter((a) => a.status === 'cancelled').length,
                      },
                    ]}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)'} vertical={false} />
                    <XAxis dataKey="name" stroke={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.4)'} fontSize={11} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.4)'} fontSize={11} tickLine={false} axisLine={false} dx={-10} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#121826' : '#ffffff',
                        border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                        color: isDark ? '#ffffff' : '#0f172a',
                        fontSize: '12px',
                      }}
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', color: isDark ? '#94a3b8' : '#475569' }} />
                    <Bar name="Pending" dataKey="pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    <Bar name="Confirmed" dataKey="confirmed" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    <Bar name="Completed" dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar name="Cancelled" dataKey="cancelled" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {selectedTab === 'settings' && (
          <div className="glass p-6 sm:p-8 rounded-2xl border border-border shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-indigo-500 to-violet-500" />
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-6">Settings</h2>
            
            <div className="space-y-6">
              {/* Demo Tools Section */}
              <div className="p-6 rounded-xl bg-card border border-border shadow-inner">
                <div className="flex items-center gap-3 mb-4">
                  <ShieldAlert className="w-5 h-5 text-indigo-500" />
                  <h3 className="font-bold text-base text-foreground">Demo & Presentation Tools</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-6 max-w-2xl leading-relaxed">
                  Reset the demo database to restore it to the default presentation state. This clears all modified data and generates 100+ realistic appointments, 50+ customers, 10 staff members, notifications, and workflow history.
                </p>

                <div className="flex items-center gap-4">
                  <button
                    onClick={handleResetDemo}
                    disabled={resetting}
                    className="btn-glass px-5 py-2.5 text-sm font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {resetting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Resetting Database...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        Reset Demo Data
                      </>
                    )}
                  </button>
                  
                  {resetSuccess && (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-500 animate-in fade-in slide-in-from-left-2">
                      <CheckCircle className="w-4 h-4 animate-bounce" />
                      Database reset and re-seeded successfully!
                    </div>
                  )}
                </div>
                
                <div className="mt-6 pt-6 border-t border-border flex flex-wrap gap-x-8 gap-y-3 text-xs text-muted-foreground">
                  <div>
                    <span className="font-semibold text-foreground">Demo Mode:</span>{' '}
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isDemoMode ? 'bg-indigo-500/10 text-indigo-650 dark:text-indigo-300 border border-indigo-500/20' : 'bg-slate-500/10 text-slate-500'}`}>
                      {isDemoMode ? 'ENABLED' : 'DISABLED'}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Dataset Size:</span> 100+ appointments, 50+ customers, 10 staff, 20+ workflows, 15+ notifications
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
