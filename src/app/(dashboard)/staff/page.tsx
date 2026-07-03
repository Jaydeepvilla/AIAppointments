"use client";

import { useState, useEffect } from "react";
import {
  getStaffListAction,
  getStaffDetailsAction,
  createStaffAction,
  updateStaffAction,
  deleteStaffAction,
  saveStaffScheduleAction,
  saveAvailabilityExceptionAction,
  deleteAvailabilityExceptionAction,
  updateStaffAssignmentsAction
} from "@/server/actions/staff";
import { getServicesAction } from "@/server/actions/services";
import {
  Users,
  Clock,
  User,
  Mail,
  Phone,
  Plus,
  Edit,
  Trash2,
  Briefcase,
  Calendar,
  CalendarX,
  Check,
  X,
  AlertCircle,
  Clock3,
  CalendarRange
} from "lucide-react";
import { Button } from "@/components/shared/button";
import { PageTitle } from "@/components/shared/page-title";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/shared/card";
import { Input } from "@/components/shared/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/shared/dialog";

interface StaffItem {
  id: string;
  name: string;
  role: string;
  email: string | null;
  phone: string | null;
  bufferTime: number;
  isActive: boolean;
  schedules: any[];
  assignments: any[];
}

export default function StaffPage() {
  const [staffList, setStaffList] = useState<StaffItem[]>([]);
  const [servicesList, setServicesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [activeDetails, setActiveDetails] = useState<any | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Create Staff dialog
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("staff");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newBuffer, setNewBuffer] = useState("0");
  const [creating, setCreating] = useState(false);

  // Holiday exception override Dialog
  const [exceptionOpen, setExceptionOpen] = useState(false);
  const [excDate, setExcDate] = useState("");
  const [excAvailable, setExcAvailable] = useState(false);
  const [excReason, setExcReason] = useState("");
  const [addingExc, setAddingExc] = useState(false);

  const loadStaff = async () => {
    setLoading(true);
    const res = await getStaffListAction();
    const resServices = await getServicesAction();

    if (res.success && res.staff) {
      setStaffList(res.staff as StaffItem[]);
      if (res.staff.length > 0 && !selectedStaffId) {
        setSelectedStaffId(res.staff[0].id);
      }
    } else {
      setErrorMsg(res.error || "Failed to load staff members");
    }

    if (resServices.success && resServices.services) {
      setServicesList(resServices.services);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadStaff();
  }, []);

  // Fetch active staff details (schedules, assignments, holiday exceptions)
  useEffect(() => {
    if (!selectedStaffId) {
      setActiveDetails(null);
      return;
    }

    const loadDetails = async () => {
      setLoadingDetails(true);
      const res = await getStaffDetailsAction(selectedStaffId);
      if (res.success) {
        setActiveDetails(res);
      } else {
        setErrorMsg(res.error || "Failed to load detailed staff configurations");
      }
      setLoadingDetails(false);
    };

    loadDetails();
  }, [selectedStaffId]);

  // Create staff
  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setCreating(true);
    const res = await createStaffAction({
      name: newName,
      role: newRole,
      email: newEmail.trim() || null,
      phone: newPhone.trim() || null,
      bufferTime: parseInt(newBuffer, 10) || 0,
    });

    if (res.success) {
      setNewName("");
      setNewEmail("");
      setNewPhone("");
      setNewBuffer("0");
      setCreateOpen(false);
      await loadStaff();
      if (res.staff) setSelectedStaffId(res.staff.id);
    } else {
      setErrorMsg(res.error || "Failed to create staff profile");
    }
    setCreating(false);
  };

  // Toggle staff active state
  const handleToggleActive = async () => {
    if (!selectedStaffId || !activeDetails) return;
    const currentActive = activeDetails.staff.isActive;
    const res = await updateStaffAction(selectedStaffId, {
      name: activeDetails.staff.name,
      role: activeDetails.staff.role,
      isActive: !currentActive,
    });

    if (res.success) {
      await loadStaff();
      // Reload details
      const detailsRes = await getStaffDetailsAction(selectedStaffId);
      if (detailsRes.success) setActiveDetails(detailsRes);
    } else {
      setErrorMsg(res.error || "Failed to toggle status");
    }
  };

  // Delete staff
  const handleDeleteStaff = async () => {
    if (!selectedStaffId) return;
    const confirm = window.confirm("Are you sure you want to delete this staff profile?");
    if (!confirm) return;

    const res = await deleteStaffAction(selectedStaffId);
    if (res.success) {
      setSelectedStaffId(null);
      await loadStaff();
    } else {
      setErrorMsg(res.error || "Failed to delete staff member");
    }
  };

  // Toggle Service assignment checklist
  const handleToggleAssignment = async (serviceId: string) => {
    if (!selectedStaffId || !activeDetails) return;

    const currentAssignments = activeDetails.assignments.map((a: any) => a.serviceId);
    let newAssignments: string[] = [];

    if (currentAssignments.includes(serviceId)) {
      newAssignments = currentAssignments.filter((id: string) => id !== serviceId);
    } else {
      newAssignments = [...currentAssignments, serviceId];
    }

    const res = await updateStaffAssignmentsAction(selectedStaffId, newAssignments);
    if (res.success) {
      // Reload details
      const detailsRes = await getStaffDetailsAction(selectedStaffId);
      if (detailsRes.success) setActiveDetails(detailsRes);
    } else {
      setErrorMsg(res.error || "Failed to update assignments");
    }
  };

  // Update schedule shifts (Monday to Friday, hours etc.)
  const handleSaveSchedule = async (dayOfWeek: number, shiftStart: string, shiftEnd: string) => {
    if (!selectedStaffId) return;

    const res = await saveStaffScheduleAction(selectedStaffId, {
      dayOfWeek,
      shifts: [{ start: shiftStart, end: shiftEnd }],
    });

    if (res.success) {
      const detailsRes = await getStaffDetailsAction(selectedStaffId);
      if (detailsRes.success) setActiveDetails(detailsRes);
    } else {
      setErrorMsg(res.error || "Failed to update shift hours");
    }
  };

  // Add Exception override holiday closures
  const handleAddException = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaffId || !excDate) return;

    setAddingExc(true);
    const res = await saveAvailabilityExceptionAction({
      staffMemberId: selectedStaffId,
      exceptionDate: excDate,
      isAvailable: excAvailable,
      reason: excReason || null,
      shifts: excAvailable ? [{ start: "09:00", end: "17:00" }] : null,
    });

    if (res.success) {
      setExcDate("");
      setExcReason("");
      setExcAvailable(false);
      setExceptionOpen(false);
      const detailsRes = await getStaffDetailsAction(selectedStaffId);
      if (detailsRes.success) setActiveDetails(detailsRes);
    } else {
      setErrorMsg(res.error || "Failed to save vacation date exception");
    }
    setAddingExc(false);
  };

  // Delete exception override
  const handleDeleteException = async (id: string) => {
    const res = await deleteAvailabilityExceptionAction(id);
    if (res.success) {
      if (selectedStaffId) {
        const detailsRes = await getStaffDetailsAction(selectedStaffId);
        if (detailsRes.success) setActiveDetails(detailsRes);
      }
    } else {
      setErrorMsg(res.error || "Failed to delete exception");
    }
  };

  const getDayName = (day: number) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[day];
  };

  return (
    <div className="space-y-space-6">
      {/* Header */}
      <PageTitle
        title="Staff Scheduler"
        description="Manage staff profiles, schedule shift hours, assign templates/services, and block out vacation dates."
        actions={
          <Button size="sm" className="h-8 text-caption gap-space-1 self-start" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" /> Add Staff Member
          </Button>
        }
      />

      {errorMsg && (
        <div className="flex items-center gap-space-2 radius-lg bg-error-500/10 border border-error-500/20 p-space-3 text-caption text-error-500">
          <AlertCircle className="h-4 w-4" />
          <span>{errorMsg}</span>
          <Button className="ml-auto " onClick={() => setErrorMsg("")}>X</Button>
        </div>
      )}

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-6 min-h-full">
        {/* Left Side: Staff Profiles List */}
        <div className="lg:col-span-4 flex flex-col border border-border/40 radius-xl bg-card/20 backdrop-blur-md overflow-hidden h-[var(--bg-blob-h)]">
          <div className="p-space-4 border-b border-border/40 bg-card/45">
            <span className="text-body-sm  tracking-tight">Active Profiles</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-border/20">
            {loading ? (
              <div className="flex h-40 items-center justify-center text-caption text-muted-foreground">
                <Clock className="h-4.5 w-4.5 animate-spin mr-space-2" /> Loading profiles...
              </div>
            ) : staffList.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center text-center p-space-6">
                <Users className="h-8 w-8 text-muted-foreground/45 mb-space-2" />
                <p className="text-caption text-muted-foreground">No staff members found.</p>
              </div>
            ) : (
              staffList.map((staff) => {
                const isSelected = staff.id === selectedStaffId;
                return (
                  <Button
                    key={staff.id}
                    onClick={() => setSelectedStaffId(staff.id)}
                    className={`w-full text-left p-space-4 transition-all flex flex-col gap-space-2 hover:bg-accent/20 ${isSelected ? "bg-accent/40 border-l-2 border-primary" : ""
                      }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-caption  text-foreground">{staff.name}</span>
                      <span className={`text-caption uppercase  tracking-wider rounded border px-space-2 py-space-0 ${staff.isActive
                        ? "bg-success-500/10 text-success-500 border-success-500/20"
                        : "bg-neutral-500/10 text-muted-foreground border-neutral-500/20"
                        }`}>{staff.isActive ? "Active" : "Inactive"}</span>
                    </div>
                    <div className="text-caption text-muted-foreground truncate">{staff.role} • {staff.email || "No email"}</div>
                  </Button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Schedules, Exception, Assignments */}
        <div className="lg:col-span-8 border border-border/40 radius-xl bg-card/20 backdrop-blur-md overflow-hidden h-[var(--bg-blob-h)] flex flex-col">
          {loadingDetails ? (
            <div className="flex-1 flex items-center justify-center text-caption text-muted-foreground">
              <Clock className="h-4.5 w-4.5 animate-spin mr-space-2" /> Loading schedules configurations...
            </div>
          ) : !activeDetails ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-space-8">
              <Clock3 className="h-10 w-10 text-muted-foreground/40 mb-space-2" />
              <p className="text-caption text-muted-foreground">Select a staff member from the list to manage shifts schedule, exception overrides, and service assignments.</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-space-6 space-y-space-6">
              {/* Profile Config Header */}
              <div className="flex justify-between items-start pb-space-4 border-b border-border/15">
                <div>
                  <h3 className="text-body-sm  text-foreground">{activeDetails.staff.name}</h3>
                  <p className="text-caption text-muted-foreground mt-space-1">{activeDetails.staff.role}</p>
                </div>
                <div className="flex items-center gap-space-2">
                  <Button size="sm" variant="outline" className="h-7 text-caption  border-border/40" onClick={handleToggleActive}>
                    {activeDetails.staff.isActive ? "Deactivate" : "Activate"}
                  </Button>
                  <Button size="sm" variant="destructive" className="h-7 text-caption " onClick={handleDeleteStaff}>
                    <Trash2 className="h-3 w-3" /> Delete
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-6">

                {/* 1. Services Offered Checklist */}
                <div className="space-y-space-3">
                  <span className="text-caption uppercase  text-muted-foreground tracking-wider block flex items-center gap-space-1">
                    <Briefcase className="h-3.5 w-3.5" /> Services Assigned
                  </span>
                  <div className="bg-background/45 border border-border/30 radius-lg p-space-4 space-y-space-2 max-h-52 overflow-y-auto">
                    {servicesList.length === 0 ? (
                      <p className="text-caption text-muted-foreground italic">No templates/services set up. Create them in Services Management first.</p>
                    ) : (
                      servicesList.map((service) => {
                        const isAssigned = activeDetails.assignments.some((a: any) => a.serviceId === service.id);
                        return (
                          <label key={service.id} className="flex items-center gap-space-2 text-caption text-muted-foreground hover:text-foreground cursor-pointer select-none">
                            <Input
                              type="checkbox"
                              checked={isAssigned}
                              onChange={() => handleToggleAssignment(service.id)}
                              className="rounded border-border bg-background focus:ring-0 text-primary h-3.5 w-3.5"
                            />
                            <span>{service.name} (${service.price})</span>
                          </label>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* 2. Holiday override exceptions */}
                <div className="space-y-space-3">
                  <div className="flex justify-between items-center">
                    <span className="text-caption uppercase  text-muted-foreground tracking-wider block flex items-center gap-space-1">
                      <CalendarRange className="h-3.5 w-3.5" /> Vacation / Exceptions overrides
                    </span>
                    <Button size="sm" variant="outline" className="h-6 text-caption px-space-2 border-border/40 " onClick={() => setExceptionOpen(true)}>
                      <Plus className="h-2.5 w-2.5 mr-space-1" /> Add
                    </Button>
                  </div>
                  <div className="bg-background/45 border border-border/30 radius-lg p-space-4 space-y-space-2 max-h-52 overflow-y-auto">
                    {activeDetails.exceptions.length === 0 ? (
                      <p className="text-caption text-muted-foreground italic">No customized holiday exceptions added.</p>
                    ) : (
                      activeDetails.exceptions.map((exc: any) => (
                        <div key={exc.id} className="flex justify-between items-center bg-background/30 border border-border/10 p-space-2 rounded text-caption">
                          <div>
                            <span className=" text-foreground block">{exc.exceptionDate}</span>
                            <span className="text-muted-foreground text-caption">
                              {exc.isAvailable ? "Custom Hours" : "Closed"} {exc.reason && `(${exc.reason})`}
                            </span>
                          </div>
                          <Button size="sm" variant="ghost" className="h-6 w-6 text-error-500 hover:text-error-500" onClick={() => handleDeleteException(exc.id)}>
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

              {/* 3. Weekly Hours shift schedules planner */}
              <div className="space-y-space-3 pt-space-4 border-t border-border/15">
                <span className="text-caption uppercase  text-muted-foreground tracking-wider block flex items-center gap-space-1">
                  <Clock className="h-3.5 w-3.5" /> Weekly Working Hours
                </span>

                <div className="bg-background/25 border border-border/30 radius-lg p-space-4 space-y-space-3">
                  {[1, 2, 3, 4, 5, 6, 0].map((dayNum) => {
                    const activeSched = activeDetails.schedules.find((s: any) => s.dayOfWeek === dayNum);
                    const shifts = activeSched?.shifts || [];
                    const shiftStart = shifts[0]?.start || "09:00";
                    const shiftEnd = shifts[0]?.end || "17:00";
                    const isWorking = shifts.length > 0;

                    return (
                      <div key={dayNum} className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-2 pb-space-2 border-b border-border/10 last:border-b-0">
                        <div className="flex items-center gap-space-3 w-32 shrink-0">
                          <Input
                            type="checkbox"
                            checked={isWorking}
                            onChange={(e) => {
                              if (e.target.checked) {
                                handleSaveSchedule(dayNum, "09:00", "17:00");
                              } else {
                                // delete schedule by saving empty shifts
                                saveStaffScheduleAction(selectedStaffId!, { dayOfWeek: dayNum, shifts: [] }).then(() => {
                                  getStaffDetailsAction(selectedStaffId!).then((res) => {
                                    if (res.success) setActiveDetails(res);
                                  });
                                });
                              }
                            }}
                            className="rounded border-border bg-background focus:ring-0 text-primary h-3.5 w-3.5"
                          />
                          <span className="text-caption  text-foreground">{getDayName(dayNum)}</span>
                        </div>

                        {isWorking ? (
                          <div className="flex items-center gap-space-2 text-caption">
                            <span className="text-muted-foreground">Shifts:</span>
                            <Input
                              type="text"
                              value={shiftStart}
                              placeholder="09:00"
                              className="h-7 w-16 text-center text-caption p-space-1"
                              onChange={(e) => handleSaveSchedule(dayNum, e.target.value, shiftEnd)}
                            />
                            <span className="text-muted-foreground">to</span>
                            <Input
                              type="text"
                              value={shiftEnd}
                              placeholder="17:00"
                              className="h-7 w-16 text-center text-caption p-space-1"
                              onChange={(e) => handleSaveSchedule(dayNum, shiftStart, e.target.value)}
                            />
                          </div>
                        ) : (
                          <span className="text-caption text-muted-foreground italic">Rest Day / Off</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Staff Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border/40">
          <DialogHeader>
            <DialogTitle className="text-body-sm ">Add Staff Member</DialogTitle>
            <DialogDescription className="text-caption text-muted-foreground">
              Create a new staff profile to assign scheduling shifts.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateStaff}>
            <div className="space-y-space-4 py-space-4 text-caption">
              <div className="space-y-space-1">
                <label htmlFor="staff-name" className="text-caption uppercase  text-muted-foreground block">Full Name</label>
                <Input
                  id="staff-name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Dr. Sarah Jenkins"
                  className="bg-background"
                  required
                />
              </div>

              <div className="space-y-space-1">
                <label htmlFor="staff-role" className="text-caption uppercase  text-muted-foreground block">Role Title</label>
                <Input
                  id="staff-role"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  placeholder="e.g. Lead Dentist, Hair Stylist"
                  className="bg-background"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-space-3">
                <div className="space-y-space-1">
                  <label htmlFor="staff-email" className="text-caption uppercase  text-muted-foreground block">Email</label>
                  <Input
                    id="staff-email"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="sarah@clinic.com"
                    className="bg-background"
                  />
                </div>
                <div className="space-y-space-1">
                  <label htmlFor="staff-phone" className="text-caption uppercase  text-muted-foreground block">Phone</label>
                  <Input
                    id="staff-phone"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+1 555-0199"
                    className="bg-background"
                  />
                </div>
              </div>

              <div className="space-y-space-1">
                <label htmlFor="staff-buffer" className="text-caption uppercase  text-muted-foreground block">Buffer Time Between Slots (Minutes)</label>
                <Input
                  id="staff-buffer"
                  type="number"
                  value={newBuffer}
                  onChange={(e) => setNewBuffer(e.target.value)}
                  placeholder="15"
                  className="bg-background"
                />
              </div>
            </div>
            <DialogFooter className="flex gap-space-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setCreateOpen(false)} disabled={creating}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={creating || !newName.trim()}>
                {creating ? "Adding profile..." : "Save Member"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Exception Overrides Dialog */}
      <Dialog open={exceptionOpen} onOpenChange={setExceptionOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border/40">
          <DialogHeader>
            <DialogTitle className="text-body-sm ">Add Vacation / Exceptions override</DialogTitle>
            <DialogDescription className="text-caption text-muted-foreground">
              Override working hours for a specific date (e.g. block closures or add unique shifts).
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddException}>
            <div className="space-y-space-4 py-space-4 text-caption">
              <div className="space-y-space-1">
                <label htmlFor="exc-date" className="text-caption uppercase  text-muted-foreground block">Target Date</label>
                <Input
                  id="exc-date"
                  type="date"
                  value={excDate}
                  onChange={(e) => setExcDate(e.target.value)}
                  className="bg-background"
                  required
                />
              </div>

              <div className="space-y-space-2 pt-space-2">
                <label className="flex items-center gap-space-2 cursor-pointer select-none text-muted-foreground hover:text-foreground">
                  <Input
                    type="checkbox"
                    checked={excAvailable}
                    onChange={(e) => setExcAvailable(e.target.checked)}
                    className="rounded border-border bg-background focus:ring-0 text-primary h-3.5 w-3.5"
                  />
                  <span>Is available for custom shifts on this date? (Uncheck for holiday/closed)</span>
                </label>
              </div>

              <div className="space-y-space-1">
                <label htmlFor="exc-reason" className="text-caption uppercase  text-muted-foreground block">Reason / Comments</label>
                <Input
                  id="exc-reason"
                  value={excReason}
                  onChange={(e) => setExcReason(e.target.value)}
                  placeholder="e.g. Family vacation, Conference closure"
                  className="bg-background"
                />
              </div>
            </div>
            <DialogFooter className="flex gap-space-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setExceptionOpen(false)} disabled={addingExc}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={addingExc || !excDate}>
                {addingExc ? "Saving exception..." : "Save Override"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
