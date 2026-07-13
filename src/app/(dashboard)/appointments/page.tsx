"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { 
  getAppointmentsAction, 
  getAppointmentDetailsAction,
  updateAppointmentStatusAction,
  addAppointmentNoteAction,
  cancelAppointmentAction,
  rescheduleAppointmentAction
} from "@/server/actions/appointments";
import { getStaffListAction } from "@/server/actions/staff";
import { getAvailableSlotsAction } from "@/server/actions/availability";
import { getServicesAction } from "@/server/actions/services";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  FileText, 
  Check, 
  X, 
  AlertCircle, 
  Search, 
  Filter, 
  UserCheck, 
  Plus, 
  Trash2, 
  CalendarDays,
  CalendarRange,
  List,
  Sparkles,
  ClipboardList,
  MessageSquare,
  Loader2,
  ChevronRight,
  UserCircle2,
} from "lucide-react";
import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/shared/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/shared/select";
import { Label } from "@/components/shared/label";
import { cn } from "@/components/shared/utils";
import { PageTitle } from "@/components/shared/page-title";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingState } from "@/components/shared/loading-state";
import { DonutChartCard } from "@/components/charts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AppointmentItem {
  appointment: {
    id: string;
    status: string;
    startTime: Date;
    endTime: Date;
    customerName: string;
    customerEmail: string | null;
    customerPhone: string | null;
    pricePaid: string | null;
    staffMemberId: string | null;
    serviceId: string | null;
    leadProfileId: string | null;
  };
  service: {
    id: string;
    name: string;
    price: string;
    duration: number;
  } | null;
  staff: {
    id: string;
    name: string;
  } | null;
}

export default function AppointmentsPage() {
  const [appointmentsList, setAppointmentsList] = useState<AppointmentItem[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [servicesList, setServicesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Filters
  const [selectedStaffId, setSelectedStaffId] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentView, setCurrentView] = useState<"month" | "week" | "day" | "list">("list");
  const [activeDate, setActiveDate] = useState<Date>(new Date());

  // Detail expander state
  const [selectedAptId, setSelectedAptId] = useState<string | null>(null);
  const [activeDetails, setActiveDetails] = useState<any | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);

  // Reschedule Dialog state
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<any | null>(null);
  const [rescheduleReason, setRescheduleReason] = useState("");

  // Cancel Dialog state
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const resApts = await getAppointmentsAction();
      const resStaff = await getStaffListAction();
      const resServices = await getServicesAction();

      if (resApts.success && resApts.appointments) {
        setAppointmentsList(resApts.appointments as any[]);
        if (resApts.appointments.length > 0 && !selectedAptId) {
          setSelectedAptId(resApts.appointments[0].appointment.id);
        }
      } else {
        setErrorMsg(resApts.error || "Failed to load appointments");
      }

      if (resStaff.success && resStaff.staff) {
        setStaffList(resStaff.staff);
      }
      if (resServices.success && resServices.services) {
        setServicesList(resServices.services);
      }
    } catch (e: any) {
      setErrorMsg(e.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Load detailed context when selected appointment changes
  useEffect(() => {
    if (!selectedAptId) {
      setActiveDetails(null);
      return;
    }

    const loadDetails = async () => {
      setLoadingDetails(true);
      const res = await getAppointmentDetailsAction(selectedAptId);
      if (res.success && res.data) {
        setActiveDetails(res.data);
      } else {
        setErrorMsg(res.error || "Failed to load detailed appointment logs");
      }
      setLoadingDetails(false);
    };

    loadDetails();
  }, [selectedAptId]);

  // Load Slots when Reschedule Date changes
  useEffect(() => {
    if (!rescheduleOpen || !rescheduleDate || !activeDetails) return;

    const loadSlots = async () => {
      setLoadingSlots(true);
      const res = await getAvailableSlotsAction({
        serviceId: activeDetails.details.appointment.serviceId,
        dateStr: rescheduleDate,
        staffMemberId: activeDetails.details.appointment.staffMemberId,
      });

      if (res.success && res.slots) {
        setAvailableSlots(res.slots);
      } else {
        setAvailableSlots([]);
      }
      setLoadingSlots(false);
    };

    loadSlots();
  }, [rescheduleDate, rescheduleOpen]);

  // Apply Status Mutations
  const handleUpdateStatus = async (status: string, reason?: string) => {
    if (!selectedAptId) return;
    const res = await updateAppointmentStatusAction({ appointmentId: selectedAptId, status, reason });
    if (res.success) {
      const detailsRes = await getAppointmentDetailsAction(selectedAptId);
      if (detailsRes.success && detailsRes.data) {
        setActiveDetails(detailsRes.data);
      }
      await loadData();
    } else {
      setErrorMsg(res.error || "Failed to update appointment status");
    }
  };

  // Add notes
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAptId || !newNote.trim()) return;

    setAddingNote(true);
    const res = await addAppointmentNoteAction({ appointmentId: selectedAptId, noteText: newNote });
    if (res.success) {
      setNewNote("");
      const detailsRes = await getAppointmentDetailsAction(selectedAptId);
      if (detailsRes.success && detailsRes.data) {
        setActiveDetails(detailsRes.data);
      }
    } else {
      setErrorMsg(res.error || "Failed to save note");
    }
    setAddingNote(false);
  };

  // Reschedule Booking
  const handleReschedule = async () => {
    if (!selectedAptId || !selectedSlot) return;

    const tomorrow = new Date(rescheduleDate);
    const [sh, sm] = selectedSlot.startTime.split(":").map(Number);
    tomorrow.setHours(sh, sm, 0, 0);

    const res = await rescheduleAppointmentAction({
      appointmentId: selectedAptId,
      newStartTime: tomorrow.toISOString(),
      reason: rescheduleReason,
    });

    if (res.success) {
      setRescheduleOpen(false);
      const detailsRes = await getAppointmentDetailsAction(selectedAptId);
      if (detailsRes.success && detailsRes.data) {
        setActiveDetails(detailsRes.data);
      }
      await loadData();
    } else {
      setErrorMsg(res.error || "Failed to reschedule booking");
    }
  };

  // Cancel Booking
  const handleCancel = async () => {
    if (!selectedAptId) return;

    const res = await cancelAppointmentAction({
      appointmentId: selectedAptId,
      reason: cancelReason,
    });

    if (res.success) {
      setCancelOpen(false);
      const detailsRes = await getAppointmentDetailsAction(selectedAptId);
      if (detailsRes.success && detailsRes.data) {
        setActiveDetails(detailsRes.data);
      }
      await loadData();
    } else {
      setErrorMsg(res.error || "Failed to cancel booking");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="badge-status badge-info text-caption px-space-1.5 py-space-0.5 rounded">Pending</span>;
      case "confirmed":
        return <span className="badge-status badge-success text-caption px-space-1.5 py-space-0.5 rounded flex items-center gap-space-1"><Check className="h-3 w-3"/> Confirmed</span>;
      case "rescheduled":
        return <span className="badge-status badge-warning text-caption px-space-1.5 py-space-0.5 rounded">Rescheduled</span>;
      case "Booked":
      case "completed":
        return <span className="badge-status badge-primary text-caption px-space-1.5 py-space-0.5 rounded">Completed</span>;
      case "cancelled":
        return <span className="badge-status badge-error text-caption px-space-1.5 py-space-0.5 rounded flex items-center gap-space-1"><X className="h-3 w-3"/> Cancelled</span>;
      case "no_show":
        return <span className="badge-status badge-neutral text-caption px-space-1.5 py-space-0.5 rounded">No Show</span>;
      default:
        return <span className="badge-status badge-neutral text-caption px-space-1.5 py-space-0.5 rounded">{status}</span>;
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "AP";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2 && parts[0] && parts[1]) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getAvatarGradient = (name: string) => {
    const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const gradients = [
      "from-indigo-500 to-purple-500",
      "from-blue-500 to-cyan-500",
      "from-purple-500 to-pink-500",
      "from-emerald-500 to-teal-500",
      "from-amber-500 to-orange-500",
    ];
    return gradients[hash % gradients.length];
  };

  // Filter list
  const filteredApts = appointmentsList.filter((item) => {
    const matchesSearch = 
      item.appointment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.appointment.customerEmail && item.appointment.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.appointment.customerPhone && item.appointment.customerPhone.includes(searchTerm));

    const matchesStaff = selectedStaffId === "all" || item.appointment.staffMemberId === selectedStaffId;
    const matchesStatus = selectedStatus === "all" || item.appointment.status === selectedStatus;

    return matchesSearch && matchesStaff && matchesStatus;
  });

  return (
    <div className="space-y-space-4 animate-fade-in w-full pb-space-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-space-3 shrink-0">
        <PageTitle
          title="Appointments"
          description="All upcoming, past, and cancelled bookings. Manage your calendar from here."
          className="mb-0"
        />
         {/* View Selectors */}
         <Tabs
           value={currentView}
           onValueChange={(v) => setCurrentView(v as typeof currentView)}
           className="shrink-0"
         >
           <TabsList className="h-9">
             <TabsTrigger value="list" className="gap-1.5">
               <List className="h-3.5 w-3.5 shrink-0" />
               List View
             </TabsTrigger>
             <TabsTrigger value="day" disabled className="gap-1.5 opacity-60 cursor-not-allowed">
               <CalendarIcon className="h-3.5 w-3.5 shrink-0" />
               Day
               <span className="ml-0.5 px-1 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-600 dark:text-amber-400 rounded-sm leading-none">
                 Soon
               </span>
             </TabsTrigger>
             <TabsTrigger value="week" disabled className="gap-1.5 opacity-60 cursor-not-allowed">
               <CalendarRange className="h-3.5 w-3.5 shrink-0" />
               Week
               <span className="ml-0.5 px-1 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-600 dark:text-amber-400 rounded-sm leading-none">
                 Soon
               </span>
             </TabsTrigger>
           </TabsList>
         </Tabs>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-space-2 radius-lg bg-state-error-bg border border-state-error-text/15 px-space-4 py-space-2.5 text-caption text-state-error-text shrink-0 animate-fade-in">
          <AlertCircle className="h-4 w-4 shrink-0"/>
          <span className="flex-1 font-medium">{errorMsg}</span>
          <Button className="hover:opacity-70 transition-opacity font-semibold px-space-1 text-body-sm cursor-pointer" onClick={() => setErrorMsg("")}>×</Button>
        </div>
      )}

      {loading ? (
        <LoadingState message="Loading appointments"/>
      ) : (
        <div className="space-y-space-4">
          {/* Filter Row */}
          <div className="flex flex-col md:flex-row gap-space-3 bg-card border border-[hsl(var(--foreground)/0.06)] p-space-3 radius-xl shrink-0">
            <div className="relative flex-1">
              <Search className="absolute left-space-3 top-space-2.5 h-4 w-4 text-muted-foreground/50"/>
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search bookings by customer name, email, or phone..."
                className="pl-space-9 bg-background text-caption border-[hsl(var(--foreground)/0.08)] focus-visible:ring-primary/20"
              />
            </div>
            <div className="flex gap-space-2">
              <div className="w-40">
                <Select value={selectedStaffId} onValueChange={setSelectedStaffId}>
                  <SelectTrigger className="bg-background text-caption border-[hsl(var(--foreground)/0.08)] hover:border-[hsl(var(--primary)/0.25)] transition-all h-9 radius-md">
                    <div className="flex items-center gap-space-1.5 font-medium">
                      <User className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0"/>
                      <SelectValue placeholder="Staff Member"/>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-caption">All Staff</SelectItem>
                    {staffList.map((s) => (
                      <SelectItem key={s.id} value={s.id} className="text-caption">{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-40">
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="bg-background text-caption border-[hsl(var(--foreground)/0.08)] hover:border-[hsl(var(--primary)/0.25)] transition-all h-9 radius-md">
                    <div className="flex items-center gap-space-1.5 font-medium">
                      <Filter className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0"/>
                      <SelectValue placeholder="Status Filter"/>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-caption">All Statuses</SelectItem>
                    <SelectItem value="pending" className="text-caption">Pending</SelectItem>
                    <SelectItem value="confirmed" className="text-caption">Confirmed</SelectItem>
                    <SelectItem value="rescheduled" className="text-caption">Rescheduled</SelectItem>
                    <SelectItem value="completed" className="text-caption">Completed</SelectItem>
                    <SelectItem value="cancelled" className="text-caption">Cancelled</SelectItem>
                    <SelectItem value="no_show" className="text-caption">No Show</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Grid Layout Side by Side */}
          {filteredApts.length === 0 ? (
            <EmptyState
              title="No appointments found"
              description={searchTerm || selectedStatus !== "all" || selectedStaffId !== "all" ? "Try adjusting your filters to see more results." : "You don't have any appointments scheduled yet."}
              icon={CalendarIcon}
              actionText={(searchTerm || selectedStatus !== "all" || selectedStaffId !== "all") ? "Clear Filters" : undefined}
              onAction={() => { setSearchTerm(""); setSelectedStatus("all"); setSelectedStaffId("all"); }}
              className="h-[600px] bg-card border border-[hsl(var(--foreground)/0.06)] radius-xl soft-"
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-4 items-start">
              
              {/* Left Column: Bookings List */}
              <div className="lg:col-span-8 flex flex-col h-[700px] bg-card border border-[hsl(var(--foreground)/0.06)] radius-xl overflow-hidden">
                <div className="p-space-4 border-b border-[hsl(var(--foreground)/0.06)] bg-[hsl(var(--foreground)/0.005)] shrink-0">
                  <span className="text-caption font-semibold uppercase tracking-wider text-muted-foreground/60">Bookings List ({filteredApts.length})</span>
                </div>
                <ScrollArea className="flex-1 p-space-3 space-y-space-3 bg-[hsl(var(--foreground)/0.005)]" horizontal={false}>
                  {filteredApts.map((item) => {
                    const isSelected = item.appointment.id === selectedAptId;
                    const customerName = item.appointment.customerName;
                    const initials = getInitials(customerName);
                    const gradient = getAvatarGradient(customerName);
                    
                    const dateStr = new Date(item.appointment.startTime).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
                    const timeStr = new Date(item.appointment.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    
                    return (
                      <div 
                        key={item.appointment.id}
                        className={cn(
                          "flex flex-col border radius-lg overflow-hidden bg-background transition-all duration-200 shadow-xs",
                          isSelected 
                            ? "border-[hsl(var(--primary)/0.35)] ring-1 ring-[hsl(var(--primary)/0.1)]" 
                            : "border-[hsl(var(--foreground)/0.06)] hover:border-[hsl(var(--foreground)/0.15)]"
                        )}
                      >
                        {/* Clickable Header Row */}
                        <div
                          onClick={() => setSelectedAptId(isSelected ? null : item.appointment.id)}
                          className={cn(
                            "p-space-4 cursor-pointer transition-all duration-150 flex gap-space-3 items-center relative select-none",
                            isSelected ? "bg-[hsl(var(--primary)/0.015)] border-b border-[hsl(var(--foreground)/0.04)]" : "bg-transparent"
                          )}
                        >
                          <div className={`h-8.5 w-8.5 radius-full bg-gradient-to-br ${gradient} text-white text-caption font-semibold flex items-center justify-center shrink-0`}>
                            {initials}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-space-2 mb-space-0.5">
                              <span className="text-caption font-medium text-foreground truncate">{customerName}</span>
                              <div className="flex items-center gap-space-2 shrink-0">
                                {getStatusBadge(item.appointment.status)}
                              </div>
                            </div>
                            <div className="text-[11px] text-muted-foreground/80 flex flex-wrap gap-x-space-3 gap-y-space-0.5">
                              <span className="flex items-center gap-space-1 text-foreground/80"><Clock className="h-3 w-3 shrink-0 text-primary"/> {dateStr} · {timeStr}</span>
                              <span className="truncate max-w-32">Svc: <strong>{item.service?.name || "N/A"}</strong></span>
                              <span className="truncate max-w-24">Staff: <strong>{item.staff?.name || "N/A"}</strong></span>
                            </div>
                          </div>

                          <div className="text-right pl-space-3 shrink-0 flex items-center gap-space-3">
                            <div className="space-y-space-0.5">
                              <span className="text-[10px] text-muted-foreground/50 font-semibold uppercase tracking-wider block">Price</span>
                              <span className="text-caption font-semibold text-primary block">${item.service?.price || "0.00"}</span>
                            </div>
                            <ChevronRight className={cn("h-4 w-4 text-muted-foreground/40 transition-transform duration-200", isSelected && "rotate-90")} />
                          </div>
                        </div>

                        {/* Inline expanded details */}
                        {isSelected && (
                          <div className="p-space-4 bg-[hsl(var(--foreground)/0.005)] border-t border-[hsl(var(--foreground)/0.04)] space-y-space-4 animate-fade-in text-caption">
                            {loadingDetails ? (
                              <div className="py-space-6 flex items-center justify-center gap-space-2 text-muted-foreground/60">
                                <Loader2 className="h-4.5 w-4.5 animate-spin text-primary"/>
                                <span>Loading booking details...</span>
                              </div>
                            ) : activeDetails && activeDetails.details.appointment.id === item.appointment.id ? (
                              <>
                                {/* Contact Info */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-3">
                                  <div className="space-y-space-1.5 bg-background border border-[hsl(var(--foreground)/0.05)] radius-lg p-space-3">
                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 block">Customer Information</span>
                                    <div className="space-y-space-2 text-caption">
                                      <div className="flex items-center gap-space-2 text-caption">
                                        <Mail className="h-3.5 w-3.5 text-primary/70 shrink-0"/> 
                                        <span className="truncate">{activeDetails.details.appointment.customerEmail || "Not provided"}</span>
                                      </div>
                                      <div className="flex items-center gap-space-2 text-caption">
                                        <Phone className="h-3.5 w-3.5 text-primary/70 shrink-0"/> 
                                        <span>{activeDetails.details.appointment.customerPhone || "Not provided"}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Reschedule / Cancel status info */}
                                  <div className="space-y-space-1.5 bg-background border border-[hsl(var(--foreground)/0.05)] radius-lg p-space-3">
                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 block">Scheduling Context</span>
                                    <div className="space-y-space-1.5 text-caption">
                                      <div>Booking ID: <span className="font-mono text-muted-foreground">{activeDetails.details.appointment.id}</span></div>
                                      <div className="flex items-center gap-space-1.5">
                                        Status: <span className="font-semibold">{getStatusBadge(activeDetails.details.appointment.status)}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Status Action Buttons */}
                                <div className="space-y-space-2 border-t border-[hsl(var(--foreground)/0.05)] pt-space-3.5">
                                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/55 block">Triage Actions</span>
                                  <div className="flex flex-wrap gap-space-2">
                                    <Button 
                                      size="sm"
                                      variant="outline"
                                      className="h-8 text-caption font-semibold border-[hsl(var(--foreground)/0.06)] hover:bg-emerald-500/10 hover:text-emerald-600 hover:border-emerald-500/20"
                                      onClick={() => handleUpdateStatus("confirmed")}
                                    >
                                      Confirm
                                    </Button>
                                    <Button 
                                      size="sm"
                                      variant="outline"
                                      className="h-8 text-caption font-semibold border-[hsl(var(--foreground)/0.06)] hover:bg-blue-500/10 hover:text-blue-600 hover:border-blue-500/20"
                                      onClick={() => handleUpdateStatus("completed")}
                                    >
                                      Complete
                                    </Button>
                                    <Button 
                                      size="sm"
                                      variant="outline"
                                      className="h-8 text-caption font-semibold border-[hsl(var(--foreground)/0.06)] hover:bg-slate-500/10 hover:text-slate-600 hover:border-slate-500/20"
                                      onClick={() => handleUpdateStatus("no_show")}
                                    >
                                      No Show
                                    </Button>
                                    <Button 
                                      size="sm"
                                      variant="outline"
                                      className="h-8 text-caption font-semibold border-[hsl(var(--foreground)/0.06)]"
                                      onClick={() => {
                                        setRescheduleDate("");
                                        setRescheduleReason("");
                                        setSelectedSlot(null);
                                        setRescheduleOpen(true);
                                      }}
                                    >
                                      Reschedule
                                    </Button>
                                    <Button 
                                      size="sm"
                                      variant="outline"
                                      className="h-8 text-caption font-semibold border-[hsl(var(--foreground)/0.06)] hover:bg-rose-500/10 hover:text-rose-600 hover:border-rose-500/20 text-rose-500 border-rose-500/15"
                                      onClick={() => {
                                        setCancelReason("");
                                        setCancelOpen(true);
                                      }}
                                    >
                                      Cancel Booking
                                    </Button>
                                  </div>
                                </div>

                                {/* Unified Customer Profile context */}
                                {activeDetails.leadProfile && (
                                  <div className="space-y-space-2 border-t border-[hsl(var(--foreground)/0.05)] pt-space-3.5">
                                    <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/55 block">Unified Customer Profile</span>
                                    <div className="bg-background border border-[hsl(var(--foreground)/0.05)] radius-lg p-space-3 space-y-space-2.5">
                                      <div className="flex justify-between items-center text-caption">
                                        <span className="text-muted-foreground/80 font-medium">Qualification Status:</span>
                                        <span className="font-semibold text-primary">{activeDetails.leadProfile.status}</span>
                                      </div>

                                      {/* Answers checklist summary */}
                                      {activeDetails.leadAnswers && activeDetails.leadAnswers.length > 0 && (
                                        <div className="space-y-space-1.5 pt-space-2 border-t border-[hsl(var(--foreground)/0.03)]">
                                          <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider block font-semibold flex items-center gap-space-1">
                                            <ClipboardList className="h-3 w-3 text-muted-foreground/45 shrink-0"/> Captured Qualification
                                          </span>
                                          <div className="space-y-space-1.5 max-h-36 overflow-y-auto pr-space-1">
                                            {activeDetails.leadAnswers.map((ans: any) => (
                                              <div key={ans.id} className="text-caption bg-[hsl(var(--foreground)/0.015)] radius-lg p-space-2 border border-[hsl(var(--foreground)/0.035)] leading-normal">
                                                <span className="text-foreground font-semibold block mb-space-0.5">{ans.questionText}</span>
                                                <span className="text-muted-foreground block pl-space-2 border-l border-primary/20 italic">"{ans.answerValue}"</span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {/* Summary items */}
                                      {activeDetails.summary && (
                                        <div className="space-y-space-1 pt-space-2 border-t border-[hsl(var(--foreground)/0.03)] text-caption">
                                          <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider block font-semibold flex items-center gap-space-1">
                                            <MessageSquare className="h-3 w-3 text-muted-foreground/45 shrink-0"/> AI Summary
                                          </span>
                                          <p className="text-muted-foreground leading-relaxed italic">"{activeDetails.summary.summaryText}"</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Notes log */}
                                <div className="space-y-space-2 border-t border-[hsl(var(--foreground)/0.05)] pt-space-3.5">
                                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/55 block">Staff Booking Notes</span>
                                  <div className="space-y-space-2">
                                    {activeDetails.notes && activeDetails.notes.map((note: any) => (
                                      <div key={note.id} className="bg-background border border-[hsl(var(--foreground)/0.04)] radius-lg p-space-2.5 text-caption space-y-space-1">
                                        <div className="flex justify-between text-caption text-muted-foreground/50 font-semibold border-b border-[hsl(var(--foreground)/0.03)] pb-space-1 mb-space-1">
                                          <span className="uppercase tracking-wider">{note.author}</span>
                                          <span>{new Date(note.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                                        </div>
                                        <p className="text-foreground leading-normal text-caption">{note.noteText}</p>
                                      </div>
                                    ))}
                                    
                                    <form onSubmit={handleAddNote} className="flex gap-space-2">
                                      <Input
                                        value={newNote}
                                        onChange={(e) => setNewNote(e.target.value)}
                                        placeholder="Add a scheduling note..."
                                        className="bg-background text-caption border-[hsl(var(--foreground)/0.08)] focus-visible:ring-primary/20"
                                        disabled={addingNote}
                                      />
                                      <Button type="submit" size="sm" className="h-8.5 text-caption font-semibold px-space-3.5 shrink-0" disabled={addingNote || !newNote.trim()}>
                                        {addingNote ? <Loader2 className="h-3 w-3 animate-spin"/> : "Add"}
                                      </Button>
                                    </form>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="py-space-6 text-center text-muted-foreground/60">
                                Failed to load details.
                              </div>
                            )}
                          </div>
                        )}

                      </div>
                    );
                  })}
                </ScrollArea>
              </div>

              {/* Right Column: Booking Completion Funnel */}
              <div className="lg:col-span-4 flex flex-col h-[700px] bg-card border border-[hsl(var(--foreground)/0.06)] radius-xl overflow-hidden">
                <div className="p-space-4 border-b border-[hsl(var(--foreground)/0.06)] bg-[hsl(var(--foreground)/0.005)] shrink-0">
                  <span className="text-caption font-semibold uppercase tracking-wider text-muted-foreground/60">Booking Completion Funnel</span>
                </div>
                <ScrollArea className="flex-1 p-space-5 flex flex-col gap-space-4">
                  {/* Donut Chart */}
                  <div className="flex justify-center items-center shrink-0">
                    <DonutChartCard
                      data={[
                        { stage: "Website Visit", count: 1250 },
                        { stage: "Widget Opened", count: 850 },
                        { stage: "AI Chat Started", count: 540 },
                        { stage: "Availability Requested", count: 320 },
                        { stage: "Booking Confirmed", count: 215 }
                      ]}
                      category="count"
                      index="stage"
                      colors={["hsl(var(--primary))", "hsl(var(--primary)/0.7)", "#10b981", "#f59e0b", "#ef4444"]}
                      height={220}
                      showLegend={false}
                    />
                  </div>
                  {/* Funnel Breakdown */}
                  <div className="space-y-space-2 shrink-0">
                    {[
                      { stage: "Website Visit", count: 1250, color: "bg-[hsl(var(--primary))]", pct: 100 },
                      { stage: "Widget Opened", count: 850, color: "bg-[hsl(var(--primary)/0.7)]", pct: 68 },
                      { stage: "AI Chat Started", count: 540, color: "bg-emerald-500", pct: 43 },
                      { stage: "Availability Requested", count: 320, color: "bg-amber-500", pct: 25.6 },
                      { stage: "Booking Confirmed", count: 215, color: "bg-rose-500", pct: 17.2 },
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center text-caption font-medium py-space-2 border-b border-[hsl(var(--foreground)/0.04)] last:border-b-0">
                        <div className="flex items-center gap-space-2">
                          <span className={cn("h-2.5 w-2.5 rounded-full shrink-0", item.color)} />
                          <span className="text-foreground">{item.stage}</span>
                        </div>
                        <div className="flex items-center gap-space-3">
                          <span className="text-muted-foreground/80">{item.count.toLocaleString()}</span>
                          <span className="font-semibold text-primary">{item.pct}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

            </div>
          )}

        </div>
      )}

      {/* Reschedule Booking dialog */}
      <Dialog open={rescheduleOpen} onOpenChange={setRescheduleOpen}>
        <DialogContent className="sm:max-w-md bg-card border-[hsl(var(--foreground)/0.08)] radius-xl">
          <DialogHeader>
            <DialogTitle className="text-body-sm font-semibold text-foreground">Reschedule Appointment</DialogTitle>
            <DialogDescription className="text-caption text-muted-foreground">
              Choose a new date and conflict-free slot for rescheduling.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-space-4 py-space-3 text-caption">
            <div className="space-y-space-1">
              <Label htmlFor="reschedule-date" className="text-caption uppercase tracking-wider font-semibold text-muted-foreground/75">Select Date</Label>
              <Input
                id="reschedule-date"
                type="date"
                value={rescheduleDate}
                onChange={(e) => setRescheduleDate(e.target.value)}
                className="bg-background text-caption"
              />
            </div>

            {rescheduleDate && (
              <div className="space-y-space-2">
                <span className="text-caption uppercase tracking-wider font-semibold text-muted-foreground/75 block">Available Openings</span>
                {loadingSlots ? (
                  <div className="text-caption text-muted-foreground flex items-center gap-space-1.5"><Loader2 className="h-3.5 w-3.5 animate-spin text-primary"/> Fetching slots...</div>
                ) : availableSlots.length === 0 ? (
                  <p className="text-caption text-muted-foreground/60 italic leading-normal">No available openings found for this date. Try another date.</p>
                ) : (
                  <div className="grid grid-cols-3 gap-space-2 max-h-36 overflow-y-auto pr-space-1">
                    {availableSlots.map((slot, idx) => (
                      <Button
                        key={idx}
                        variant={selectedSlot === slot ? "default" : "outline"}
                        className="h-8 text-caption border-[hsl(var(--foreground)/0.06)]"
                        onClick={() => setSelectedSlot(slot)}
                      >
                        {slot.startTime}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-space-1">
              <Label htmlFor="reschedule-reason" className="text-caption uppercase tracking-wider font-semibold text-muted-foreground/75">Reason for Rescheduling</Label>
              <Input
                id="reschedule-reason"
                value={rescheduleReason}
                onChange={(e) => setRescheduleReason(e.target.value)}
                placeholder="e.g. Patient conflict, clinic override"
                className="bg-background text-caption"
              />
            </div>
          </div>
          <DialogFooter className="flex gap-space-2 border-t border-[hsl(var(--foreground)/0.05)] pt-space-3">
            <Button variant="outline" size="sm" onClick={() => setRescheduleOpen(false)} className="h-8.5 text-caption font-semibold">
              Cancel
            </Button>
            <Button size="sm" onClick={handleReschedule} disabled={!selectedSlot || loadingSlots} className="h-8.5 text-caption font-semibold">
              Confirm Reschedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Booking dialog */}
      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent className="sm:max-w-md bg-card border-[hsl(var(--foreground)/0.08)] radius-xl">
          <DialogHeader>
            <DialogTitle className="text-body-sm font-semibold text-foreground">Cancel Appointment</DialogTitle>
            <DialogDescription className="text-caption text-rose-500 font-medium">
              Are you sure you want to cancel this booking? This will clear queued reminders and free up the time slot.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-space-4 py-space-3 text-caption">
            <div className="space-y-space-1">
              <Label htmlFor="cancel-reason" className="text-caption uppercase tracking-wider font-semibold text-muted-foreground/75">Reason for Cancellation</Label>
              <Input
                id="cancel-reason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Patient sick, clinic override"
                className="bg-background text-caption"
              />
            </div>
          </div>
          <DialogFooter className="flex gap-space-2 border-t border-[hsl(var(--foreground)/0.05)] pt-space-3">
            <Button variant="outline" size="sm" onClick={() => setCancelOpen(false)} className="h-8.5 text-caption font-semibold">
              Back
            </Button>
            <Button variant="destructive" size="sm" onClick={handleCancel} className="h-8.5 text-caption font-semibold">
              Yes, Cancel Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
