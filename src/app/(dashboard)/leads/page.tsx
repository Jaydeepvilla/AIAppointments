"use client";

import { useState, useEffect } from"react";
import { getLeadsAction, updateLeadStatusAction } from"@/server/actions/admin";
import { 
 Users, 
 Search, 
 Sparkles, 
 Mail, 
 Phone, 
 TrendingUp, 
 Clock, 
 ArrowRight,
 ChevronRight,
 Filter,
 CheckCircle,
 FileSpreadsheet,
 AlertCircle,
 ShieldAlert,
 Loader2,
 Calendar,
} from"lucide-react";
import { Button } from"@/components/shared/button";
import { Input } from"@/components/shared/input";
import { 
 Select, 
 SelectTrigger, 
 SelectValue, 
 SelectContent, 
 SelectItem 
} from"@/components/shared/select";
import { PageTitle } from"@/components/shared/page-title";
import { StatCard } from"@/components/shared/stat-card";
import { EmptyState } from"@/components/shared/empty-state";
import { LoadingState } from"@/components/shared/loading-state";
import { cn } from"@/components/shared/utils";

interface LeadItem {
 id: string;
 name: string | null;
 email: string | null;
 phone: string | null;
 status: string;
 leadScore: number;
 summary: string | null;
 createdAt: Date;
 updatedAt: Date;
 answers: any[];
 scores: {
 score: number;
 breakdown: Record<string, number>;
 } | null;
}

export default function LeadsPage() {
 const [leads, setLeads] = useState<LeadItem[]>([]);
 const [loading, setLoading] = useState(true);
 const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
 const [searchTerm, setSearchTerm] = useState("");
 const [statusFilter, setStatusFilter] = useState("all");
 const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
 const [errorMsg, setErrorMsg] = useState("");

 const loadLeads = async () => {
 try {
 setLoading(true);
 const res = await getLeadsAction();
 if (res.success && res.data) {
 setLeads(res.data as any[]);
 if (res.data.length > 0 && !selectedLeadId) {
 setSelectedLeadId(res.data[0].id);
 }
 } else {
 setErrorMsg(res.error ||"Failed to load leads list");
 }
 } catch (e: any) {
 setErrorMsg(e.message ||"An unexpected error occurred");
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 loadLeads();
 }, []);

 const handleUpdateStatus = async (leadId: string, newStatus: string) => {
 try {
 setUpdatingStatusId(leadId);
 const res = await updateLeadStatusAction(leadId, newStatus);
 if (res.success) {
 await loadLeads();
 } else {
 setErrorMsg(res.error ||"Failed to update lead status");
 }
 } catch (e: any) {
 setErrorMsg(e.message ||"Failed to update lead status");
 } finally {
 setUpdatingStatusId(null);
 }
 };

 const getLeadStatusBadge = (status: string) => {
 switch (status) {
 case"New":
 return <span className="badge-status badge-info text-caption px-space-1.5 py-space-0.5 rounded">New</span>;
 case"Qualified":
 return <span className="badge-status badge-success text-caption px-space-1.5 py-space-0.5 rounded">Qualified</span>;
 case"Hot":
 return <span className="badge-status badge-warning text-caption px-space-1.5 py-space-0.5 rounded">Hot</span>;
 case"Booked":
 return <span className="badge-status badge-primary text-caption px-space-1.5 py-space-0.5 rounded">Booked</span>;
 case"Escalated":
 return <span className="badge-status badge-error text-caption px-space-1.5 py-space-0.5 rounded">Escalated</span>;
 case"Closed":
 return <span className="badge-status badge-neutral text-caption px-space-1.5 py-space-0.5 rounded">Closed</span>;
 default:
 return <span className="badge-status badge-neutral text-caption px-space-1.5 py-space-0.5 rounded">{status}</span>;
 }
 };

 const getInitials = (name: string) => {
 if (!name) return"LD";
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

 // Filtering logic
 const filteredLeads = leads.filter((l) => {
 const matchesSearch =
 (l.name && l.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
 (l.email && l.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
 (l.phone && l.phone.includes(searchTerm));
 
 const matchesStatus = statusFilter ==="all"|| l.status === statusFilter;
 
 return matchesSearch && matchesStatus;
 });

 const selectedLead = leads.find((l) => l.id === selectedLeadId);

 // Metrics calculations
 const totalLeads = leads.length;
 const qualifiedLeads = leads.filter((l) => ["Qualified","Hot","Booked"].includes(l.status)).length;
 const hotLeads = leads.filter((l) => l.status ==="Hot").length;
 const conversionRate = totalLeads > 0 ? Math.round((qualifiedLeads / totalLeads) * 100) : 0;

 return (
 <div className="space-y-space-4 animate-fade-in w-full h-[calc(100vh-8.5rem)] flex flex-col">
 {/* Header */}
 <PageTitle
 title="Leads"
 description="People interested in your services. Follow up to turn them into customers."
 />

 {errorMsg && (
 <div className="flex items-center gap-space-2 radius-lg bg-state-error-bg border border-state-error-text/15 px-space-4 py-space-2.5 text-caption text-state-error-text shrink-0 animate-fade-in">
 <AlertCircle className="h-4 w-4 shrink-0"/>
 <span className="flex-1 font-medium">{errorMsg}</span>
 <Button className="hover:opacity-70 transition-opacity font-semibold px-space-1 text-body-sm cursor-pointer"onClick={() => setErrorMsg("")}>×</Button>
 </div>
 )}

 {/* KPI Stats Row */}
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-space-4 shrink-0">
 <StatCard label="Total Leads"value={totalLeads} icon={Users} subtitle="Total leads captured"/>
 <StatCard label="Qualified Leads"value={qualifiedLeads} icon={CheckCircle} subtitle="Verified intent ready"/>
 <StatCard label="Hot Leads"value={hotLeads} icon={Sparkles} subtitle="High priority triage"/>
 <StatCard label="Conversion Rate"value={`${conversionRate}%`} icon={TrendingUp} subtitle="Funnel stage efficiency"/>
 </div>

 {/* Filtering Row */}
 <div className="flex flex-col sm:flex-row gap-space-3 bg-[hsl(var(--foreground)/0.015)] p-space-3 border border-[hsl(var(--foreground)/0.05)] radius-lg shrink-0">
 <div className="relative flex-1">
 <Search className="absolute left-space-3 top-space-2.5 h-4 w-4 text-muted-foreground/50"/>
 <Input
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 placeholder="Search leads by name, email, or phone..."
 className="pl-space-9 bg-background text-caption border-[hsl(var(--foreground)/0.08)] focus-visible:ring-primary/20"
 />
 </div>

 <div className="w-full sm:w-48">
 <Select value={statusFilter} onValueChange={setStatusFilter}>
 <SelectTrigger className="bg-background text-caption border-[hsl(var(--foreground)/0.08)] hover:border-[hsl(var(--primary)/0.25)] transition-all h-9 radius-md">
 <div className="flex items-center gap-space-1.5 font-medium">
 <Filter className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0"/>
 <SelectValue placeholder="Filter Stage"/>
 </div>
 </SelectTrigger>
 <SelectContent>
 <SelectItem value="all"className="text-caption">All Stages</SelectItem>
 <SelectItem value="New"className="text-caption">New</SelectItem>
 <SelectItem value="Qualified"className="text-caption">Qualified</SelectItem>
 <SelectItem value="Hot"className="text-caption">Hot</SelectItem>
 <SelectItem value="Booked"className="text-caption">Booked</SelectItem>
 <SelectItem value="Escalated"className="text-caption">Escalated</SelectItem>
 <SelectItem value="Closed"className="text-caption">Closed</SelectItem>
 </SelectContent>
 </Select>
 </div>
 </div>

 {/* Leads Directory Split Layout */}
 <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-space-4">
 
 {/* Left Side: Leads Grid List */}
 <div className="lg:col-span-7 flex flex-col h-full bg-card border border-[hsl(var(--foreground)/0.06)] radius-xl overflow-hidden soft-">
 <div className="p-space-4 border-b border-[hsl(var(--foreground)/0.06)] bg-[hsl(var(--foreground)/0.005)] shrink-0">
 <span className="text-caption font-semibold uppercase tracking-wider text-muted-foreground/60">Leads List ({filteredLeads.length})</span>
 </div>

 <div className="flex-1 overflow-y-auto p-space-2 space-y-space-1.5 bg-[hsl(var(--foreground)/0.005)] sidebar-scroll">
 {loading ? (
 <LoadingState message="Loading leads"/>
 ) : filteredLeads.length === 0 ? (
 <EmptyState
 icon={Users}
 title="No matches"
 description="No leads matched your search parameters. Try adjusting your filters."
 />
 ) : (
 filteredLeads.map((lead) => {
 const isSelected = lead.id === selectedLeadId;
 const leadName = lead.name ||"Anonymous Guest";
 const initials = getInitials(leadName);
 const gradient = getAvatarGradient(leadName);
 
 return (
 <div
 key={lead.id}
 onClick={() => setSelectedLeadId(lead.id)}
 className={cn(
 "p-space-3.5 radius-lg cursor-pointer transition-all duration-200 border flex gap-space-3 items-center relative",
 isSelected
 ?"bg-background border-[hsl(var(--primary)/0.25)] scale-[1.005]"
 :"bg-transparent border-transparent hover:bg-[hsl(var(--foreground)/0.03)] hover:border-[hsl(var(--foreground)/0.05)]"
 )} tabIndex={0} onKeyDown={() => {}}
 >
 {isSelected && (
 <span className="absolute left-0 top-1/4 bottom-1/4 w-0.75 bg-primary radius-r-full"/>
 )}

 <div className={`h-8 w-8 radius-full bg-gradient-to-br ${gradient} text-white text-caption font-semibold flex items-center justify-center shrink-0`}>
 {initials}
 </div>

 <div className="flex-1 min-w-0">
 <div className="flex items-center justify-between gap-space-2 mb-space-0.5">
 <span className="text-caption font-medium text-foreground truncate">{leadName}</span>
 {getLeadStatusBadge(lead.status)}
 </div>
 <div className="flex items-center gap-space-3 text-caption text-muted-foreground/80">
 {lead.email && <span className="flex items-center gap-space-1.5 truncate max-w-32"><Mail className="h-3 w-3 text-muted-foreground/45 shrink-0"/>{lead.email}</span>}
 {lead.phone && <span className="flex items-center gap-space-1.5 shrink-0"><Phone className="h-3 w-3 text-muted-foreground/45 shrink-0"/>{lead.phone}</span>}
 </div>
 </div>

 <div className="flex items-center gap-space-3 text-right pl-space-3 shrink-0">
 <div className="space-y-space-0.5">
 <span className="text-caption text-muted-foreground/50 font-semibold uppercase tracking-wider block">Score</span>
 <span className={cn(
 "text-caption font-bold block",
 lead.leadScore > 70 ?"text-emerald-500":"text-primary"
 )}>{lead.leadScore}/100</span>
 </div>
 <ChevronRight className="h-4 w-4 text-muted-foreground/40"/>
 </div>
 </div>
 );
 })
 )}
 </div>
 </div>

 {/* Right Side: Lead Sheet Detailed Viewer */}
 <div className="lg:col-span-5 flex flex-col h-full bg-card border border-[hsl(var(--foreground)/0.06)] radius-xl overflow-hidden soft-">
 <div className="p-space-4 border-b border-[hsl(var(--foreground)/0.06)] bg-[hsl(var(--foreground)/0.005)] shrink-0">
 <h4 className="text-caption font-semibold uppercase tracking-widest text-muted-foreground/50">Lead Profile Inspector</h4>
 </div>

 <div className="flex-1 overflow-y-auto p-space-4 space-y-space-4.5 sidebar-scroll bg-[hsl(var(--foreground)/0.002)]">
 {!selectedLead ? (
 <div className="h-full flex flex-col items-center justify-center p-space-6 text-center text-caption text-muted-foreground gap-space-2.5 py-space-16">
 <div className="h-10 w-10 radius-full bg-[hsl(var(--foreground)/0.03)] border border-[hsl(var(--foreground)/0.06)] flex items-center justify-center text-muted-foreground/30 animate-float">
 <FileSpreadsheet className="h-4.5 w-4.5"/>
 </div>
 <span className="text-caption font-medium max-w-48 leading-normal text-muted-foreground/70">Select a lead from the directory to inspect details</span>
 </div>
 ) : (
 <>
 {/* Profile header */}
 <div className="space-y-space-3">
 <div className="flex justify-between items-start gap-space-3">
 <div className="flex items-center gap-space-2.5 min-w-0">
 <div className={`h-9.5 w-9.5 radius-full bg-gradient-to-br ${getAvatarGradient(selectedLead.name ||"Anonymous Guest")} text-white text-caption font-bold flex items-center justify-center shrink-0`}>
 {getInitials(selectedLead.name ||"Anonymous Guest")}
 </div>
 <div className="min-w-0">
 <h3 className="text-body-sm font-semibold text-foreground truncate leading-normal">{selectedLead.name ||"Anonymous Guest"}</h3>
 <p className="text-caption text-muted-foreground truncate block mt-space-0.5">ID: <span className="font-mono">{selectedLead.id}</span></p>
 </div>
 </div>
 {getLeadStatusBadge(selectedLead.status)}
 </div>

 <div className="bg-background border border-[hsl(var(--foreground)/0.05)] radius-lg p-space-3 space-y-space-2 text-caption text-muted-foreground">
 <div className="flex items-center gap-space-2 text-caption"><Mail className="h-3.5 w-3.5 text-primary/70 shrink-0"/> <span className="truncate">{selectedLead.email ||"Not captured"}</span></div>
 <div className="flex items-center gap-space-2 text-caption"><Phone className="h-3.5 w-3.5 text-primary/70 shrink-0"/> {selectedLead.phone ||"Not captured"}</div>
 <div className="flex items-center gap-space-2 text-caption pt-space-2 border-t border-[hsl(var(--foreground)/0.03)] mt-space-2"><Clock className="h-3.5 w-3.5 text-primary/75 shrink-0"/> Registered: {new Date(selectedLead.createdAt).toLocaleDateString()}</div>
 </div>
 </div>

 {/* Status Update Options */}
 <div className="space-y-space-2 border-t border-[hsl(var(--foreground)/0.05)] pt-space-3.5">
 <span className="text-caption font-semibold uppercase tracking-widest text-muted-foreground/55 block">Modify Lead Status</span>
 <div className="grid grid-cols-3 gap-space-1.5">
 {["New","Qualified","Hot","Booked","Escalated","Closed"].map((stage) => (
 <Button
 key={stage}
 size="sm"
 variant={selectedLead.status === stage ?"default":"outline"}
 className="h-8 text-caption font-semibold"
 disabled={updatingStatusId !== null}
 onClick={() => handleUpdateStatus(selectedLead.id, stage)}
 >
 {updatingStatusId === selectedLead.id && selectedLead.status === stage ? (
 <Loader2 className="h-3 w-3 animate-spin"/>
 ) : stage}
 </Button>
 ))}
 </div>
 </div>

 {/* Lead Scoring breakdown */}
 {selectedLead.scores && (
 <div className="space-y-space-2 border-t border-[hsl(var(--foreground)/0.05)] pt-space-3.5">
 <span className="text-caption font-semibold uppercase tracking-widest text-muted-foreground/55 block">Score Analysis Breakdown</span>
 <div className="bg-background border border-[hsl(var(--foreground)/0.05)] radius-lg p-space-3 space-y-space-2.5">
 <div className="flex items-center justify-between text-caption">
 <span className="font-semibold text-foreground">Overall Lead Score</span>
 <span className={cn(
 "font-bold",
 selectedLead.leadScore > 70 ?"text-emerald-500":"text-primary"
 )}>{selectedLead.leadScore}/100</span>
 </div>
 
 <div className="space-y-space-2 text-caption text-muted-foreground/80 pt-space-2 border-t border-[hsl(var(--foreground)/0.03)] leading-relaxed">
 <div className="flex justify-between">
 <span>Contact Completeness:</span>
 <span className="font-medium text-foreground">+{selectedLead.scores.breakdown.contactDetails ?? 0}</span>
 </div>
 <div className="flex justify-between">
 <span>Answer Completeness:</span>
 <span className="font-medium text-foreground">+{selectedLead.scores.breakdown.answerCompleteness ?? 0}</span>
 </div>
 <div className="flex justify-between">
 <span>Urgency Level:</span>
 <span className="font-medium text-foreground">+{selectedLead.scores.breakdown.urgency ?? 0}</span>
 </div>
 <div className="flex justify-between">
 <span>High-Value Service Match:</span>
 <span className="font-medium text-foreground">+{selectedLead.scores.breakdown.highValueInterest ?? 0}</span>
 </div>
 </div>
 </div>
 </div>
 )}

 {/* Answers Captured sheet */}
 <div className="space-y-space-2 border-t border-[hsl(var(--foreground)/0.05)] pt-space-3.5">
 <span className="text-caption font-semibold uppercase tracking-widest text-muted-foreground/55 block">Captured Qualification Sheet</span>
 {selectedLead.answers.length === 0 ? (
 <p className="text-caption text-muted-foreground/60 italic leading-normal">No qualification answers captured yet.</p>
 ) : (
 <div className="space-y-space-2 max-h-56 overflow-y-auto pr-space-1">
 {selectedLead.answers.map((ans: any) => (
 <div key={ans.id} className="bg-background border border-[hsl(var(--foreground)/0.04)] radius-lg p-space-2.5 text-caption space-y-space-1">
 <span className="font-semibold text-foreground block leading-normal">{ans.questionText}</span>
 <span className="text-muted-foreground block pl-space-2 border-l border-primary/20 italic">
 {ans.answerValue}
 </span>
 </div>
 ))}
 </div>
 )}
 </div>
 </>
 )}
 </div>
 </div>

 </div>
 </div>
 );
}
