"use client";

import { useState, useEffect, useRef } from"react";
import {
 getInboxThreadsAction,
 getThreadMessagesAction,
 sendStaffReplyAction,
 assignThreadAction,
 updateThreadStatusAction,
 updateContactAction
} from"@/server/actions/omnichannel";
import {
 MessageSquare,
 Search,
 Filter,
 User,
 Send,
 AlertCircle,
 Loader2,
 Inbox,
 Sparkles,
 Paperclip,
 Smile,
} from"lucide-react";
import { Button } from"@/components/shared/button";
import { Input } from"@/components/shared/input";
import { Label } from"@/components/shared/label";
import { PageTitle } from"@/components/shared/page-title";
import { cn } from"@/components/shared/utils";
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from"@/components/shared/select";
import { Tabs, TabsList, TabsTrigger } from"@/components/shared/tabs";

const MOCK_STAFF = [
 { id:"staff-1", name:"Dr. Alice"},
 { id:"staff-2", name:"Nurse Bob"},
 { id:"staff-3", name:"Receptionist Charlie"},
];

function ChannelBadge({ type }: { type?: string }) {
 switch (type) {
 case"whatsapp":
 return <span className="badge-status badge-success text-caption px-space-1.5 py-space-0.5 rounded">WhatsApp</span>;
 case"sms":
 return <span className="badge-status badge-primary text-caption px-space-1.5 py-space-0.5 rounded">SMS</span>;
 case"email":
 return <span className="badge-status badge-info text-caption px-space-1.5 py-space-0.5 rounded">Email</span>;
 default:
 return <span className="badge-status badge-neutral text-caption px-space-1.5 py-space-0.5 rounded">Chat</span>;
 }
}

export default function UnifiedInboxPage() {
 const [threads, setThreads] = useState<any[]>([]);
 const [selectedThread, setSelectedThread] = useState<any | null>(null);
 const [messages, setMessages] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);
 const [loadingMessages, setLoadingMessages] = useState(false);
 const [replyText, setReplyText] = useState("");
 const [sendingReply, setSendingReply] = useState(false);
 const [isInternalNote, setIsInternalNote] = useState(false);
 const [errorMsg, setErrorMsg] = useState("");

 // Filters
 const [searchQuery, setSearchQuery] = useState("");
 const [statusFilter, setStatusFilter] = useState<"open"|"snoozed"|"closed">("open");
 const [channelFilter, setChannelFilter] = useState("all");

 // Edit lead profile details
 const [contactName, setContactName] = useState("");
 const [contactEmail, setContactEmail] = useState("");
 const [contactPhone, setContactPhone] = useState("");
 const [contactStatus, setContactStatus] = useState("");
 const [contactTags, setContactTags] = useState("");
 const [contactNotes, setContactNotes] = useState("");
 const [isSavingContact, setIsSavingContact] = useState(false);

 const chatEndRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
 fetchThreads();
 }, []);

 useEffect(() => {
 if (selectedThread) {
 fetchMessages(selectedThread.id);
 // Populate profile details
 const profile = selectedThread.conversation?.leadProfile;
 setContactName(profile?.name ||"");
 setContactEmail(profile?.email ||"");
 setContactPhone(profile?.phone ||"");
 setContactStatus(profile?.status ||"New");
 setContactTags(profile?.tags?.join(",") ||"");
 setContactNotes(profile?.notes ||"");
 } else {
 setMessages([]);
 }
 }, [selectedThread]);

 useEffect(() => {
 scrollToBottom();
 }, [messages]);

 const scrollToBottom = () => {
 chatEndRef.current?.scrollIntoView({ behavior:"smooth"});
 };

 const fetchThreads = async () => {
 try {
 setLoading(true);
 const res = await getInboxThreadsAction();
 if (res.success && res.threads) {
 setThreads(res.threads);
 } else {
 setErrorMsg(res.error ||"Failed to load conversations.");
 }
 } catch (e: any) {
 setErrorMsg(e.message ||"An unexpected error occurred.");
 } finally {
 setLoading(false);
 }
 };

 const fetchMessages = async (threadId: string) => {
 try {
 setLoadingMessages(true);
 const res = await getThreadMessagesAction(threadId);
 if (res.success && res.messages) {
 setMessages(res.messages);
 } else {
 setErrorMsg(res.error ||"Failed to load message history.");
 }
 } catch (e: any) {
 setErrorMsg(e.message ||"Error loading messages.");
 } finally {
 setLoadingMessages(false);
 }
 };

 const handleSelectThread = (thread: any) => {
 setSelectedThread(thread);
 // Mark as read locally
 setThreads((prev: any[]) => prev.map((t: any) => t.id === thread.id ? { ...t, unreadCount: 0 } : t));
 };

 const handleSendReply = async (e: any) => {
 e.preventDefault();
 if (!replyText.trim() || !selectedThread) return;
 try {
 setSendingReply(true);
 const content = replyText.trim();
 const res = await sendStaffReplyAction({
 threadId: selectedThread.id,
 conversationId: selectedThread.conversationId,
 channelId: selectedThread.channelId,
 recipientId: selectedThread.conversation?.leadProfile?.phone || selectedThread.conversation?.leadProfile?.email,
 content
 });

 if (res.success) {
 // Fetch new messages list
 const msgRes = await getThreadMessagesAction(selectedThread.conversationId);
 if (msgRes.success && msgRes.messages) {
 setMessages(msgRes.messages);
 }
 setReplyText("");
 fetchThreads();
 } else {
 setErrorMsg(res.error ||"Failed to send message.");
 }
 } catch (err: any) {
 setErrorMsg(err.message ||"Error sending message.");
 } finally {
 setSendingReply(false);
 }
 };

 const handleAssignChange = async (staffId: string | null) => {
 if (!selectedThread) return;
 try {
 const res = await assignThreadAction(selectedThread.id, staffId);
 if (res.success) {
 setSelectedThread((prev: any) => prev ? { ...prev, assignedStaffId: staffId } : null);
 fetchThreads();
 } else {
 setErrorMsg(res.error ||"Failed to assign staff.");
 }
 } catch (e: any) {
 setErrorMsg(e.message ||"Error assigning staff.");
 }
 };

 const handleStatusChange = async (status:"open"|"snoozed"|"closed") => {
 if (!selectedThread) return;
 try {
 const res = await updateThreadStatusAction(selectedThread.id, status);
 if (res.success) {
 setSelectedThread((prev: any) => prev ? { ...prev, status } : null);
 fetchThreads();
 } else {
 setErrorMsg(res.error ||"Failed to update status.");
 }
 } catch (e: any) {
 setErrorMsg(e.message ||"Error updating thread status.");
 }
 };

 const handleSaveContact = async () => {
 if (!selectedThread?.conversation?.leadProfile) return;
 try {
 setIsSavingContact(true);
 const tagsArray = contactTags.split(",").map(t => t.trim()).filter(Boolean);
 const res = await updateContactAction({
 id: selectedThread.conversation.leadProfile.id,
 name: contactName.trim(),
 email: contactEmail.trim().toLowerCase(),
 phone: contactPhone.trim(),
 status: contactStatus,
 tags: tagsArray,
 notes: contactNotes.trim(),
 });

 if (res.success) {
 // Update local state
 const updatedProfile = {
 ...selectedThread.conversation.leadProfile,
 name: contactName.trim(),
 email: contactEmail.trim().toLowerCase(),
 phone: contactPhone.trim(),
 status: contactStatus,
 tags: tagsArray,
 notes: contactNotes.trim()
 };

 setSelectedThread((prev: any) => {
 if (!prev) return null;
 return {
 ...prev,
 conversation: {
 ...prev.conversation,
 leadProfile: updatedProfile
 }
 };
 });

 setThreads((prev: any[]) => prev.map((t: any) => {
 if (t.id === selectedThread.id) {
 return {
 ...t,
 conversation: {
 ...t.conversation,
 leadProfile: updatedProfile
 }
 };
 }
 return t;
 }));
 } else {
 setErrorMsg(res.error ||"Failed to save profile.");
 }
 } catch (e: any) {
 setErrorMsg(e.message ||"Error saving contact profile.");
 } finally {
 setIsSavingContact(false);
 }
 };

 const filteredThreads = threads.filter((t) => {
 const profile = t.conversation?.leadProfile;
 const queryMatch =
 !searchQuery.trim() ||
 profile?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
 t.lastMessage?.content?.toLowerCase().includes(searchQuery.toLowerCase());
 const statusMatch = t.status === statusFilter;
 const channelMatch = channelFilter ==="all"|| t.channel?.type === channelFilter;
 return queryMatch && statusMatch && channelMatch;
 });

 // Helper to get initials for avatars
 const getInitials = (name: string) => {
 if (!name) return"AC";
 const parts = name.trim().split(/\s+/);
 if (parts.length >= 2 && parts[0] && parts[1]) {
 return (parts[0][0] + parts[1][0]).toUpperCase();
 }
 return name.slice(0, 2).toUpperCase();
 };

 // Helper to get gradient background based on contact name
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

 return (
 <div className="space-y-space-4 animate-fade-in w-full h-[calc(100vh-8.5rem)] flex flex-col">
 {/* Header */}
 <PageTitle
 title="Inbox"
 badge={
 <span className="inline-flex items-center gap-space-1.5 text-caption font-semibold text-emerald-500 uppercase tracking-widest">
 <span className="h-2 w-2 radius-full bg-emerald-500 animate-pulse-soft"/>
 Live
 </span>
 }
 />

 {errorMsg && (
 <div className="flex items-center gap-space-2 radius-lg bg-state-error-bg border border-state-error-text/15 px-space-4 py-space-2.5 text-caption text-state-error-text shrink-0 animate-fade-in">
 <AlertCircle className="h-4 w-4 shrink-0"/>
 <span className="flex-1 font-medium">{errorMsg}</span>
 <Button className="hover:opacity-70 transition-opacity font-semibold px-space-1 text-body-sm cursor-pointer"onClick={() => setErrorMsg("")}>×</Button>
 </div>
 )}

 {/* Main Grid Container with floating cards */}
 <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-space-4">

 {/* Card 1: Thread list (Left Panel) */}
 <div className="lg:col-span-3 flex flex-col h-full bg-card border border-[hsl(var(--foreground)/0.06)] radius-xl overflow-hidden soft-">
 {/* Header area - Spacious breathing space */}
 <div className="p-space-4 border-b border-[hsl(var(--foreground)/0.06)] space-y-space-4 bg-[hsl(var(--foreground)/0.005)] shrink-0">
 <div className="relative">
 <Search className="absolute left-space-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/45"/>
 <Input
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 placeholder="Search conversations..."
 className="pl-space-10 h-9 text-caption bg-[hsl(var(--foreground)/0.015)] border-[hsl(var(--foreground)/0.06)] hover:bg-[hsl(var(--foreground)/0.025)] focus-visible:bg-background transition-colors focus-visible:ring-primary/20"
 />
 </div>

 {/* Segmented Tab Control */}
 <Tabs value={statusFilter} onValueChange={(val: any) => setStatusFilter(val)} className="w-full">
 <TabsList className="w-full">
 {(["open","snoozed","closed"] as const).map((st) => {
 const count = threads.filter(t => t.status === st).length;
 return (
 <TabsTrigger
 key={st}
 value={st}
 className="flex-1 gap-space-1.5"
 >
 <span>{st}</span>
 <span className={cn(
 "text-[10px] px-space-1.5 py-space-0.25 radius-full font-normal",
 statusFilter === st
 ?"bg-white/20 text-white"
 :"bg-[hsl(var(--foreground)/0.06)] text-muted-foreground/75"
 )}>
 {count}
 </span>
 </TabsTrigger>
 );
 })}
 </TabsList>
 </Tabs>

 {/* Shadcn Select Dropdown */}
 <Select value={channelFilter} onValueChange={(val) => setChannelFilter(val)}>
 <SelectTrigger className="h-8.5 bg-background text-caption border-[hsl(var(--foreground)/0.08)] hover:border-[hsl(var(--primary)/0.25)] transition-all radius-md">
 <div className="flex items-center gap-space-2 font-medium">
 <Filter className="h-3 w-3 text-muted-foreground/50"/>
 <SelectValue placeholder="All Channels"/>
 </div>
 </SelectTrigger>
 <SelectContent>
 <SelectItem value="all"className="text-caption">All Channels</SelectItem>
 <SelectItem value="whatsapp"className="text-caption">WhatsApp</SelectItem>
 <SelectItem value="sms"className="text-caption">SMS</SelectItem>
 <SelectItem value="email"className="text-caption">Email</SelectItem>
 <SelectItem value="instagram"className="text-caption">Instagram</SelectItem>
 <SelectItem value="facebook"className="text-caption">Facebook</SelectItem>
 </SelectContent>
 </Select>
 </div>

 {/* List area */}
 <div className="flex-1 overflow-y-auto p-space-2 space-y-space-1.5 bg-[hsl(var(--foreground)/0.005)] sidebar-scroll">
 {filteredThreads.length === 0 ? (
 <div className="p-space-6 text-center flex flex-col items-center justify-center h-full min-h-64">
 <Inbox className="h-9 w-9 text-muted-foreground/20 mb-space-2 animate-float"/>
 <span className="text-caption font-semibold text-foreground">No conversations</span>
 <p className="text-caption text-muted-foreground/60 max-w-40 mx-auto mt-space-1 leading-normal">
 Try checking other filters or clear the search.
 </p>
 </div>
 ) : (
 filteredThreads.map((t) => {
 const isSelected = selectedThread?.id === t.id;
 const profile = t.conversation?.leadProfile;
 const clientName = profile?.name ||"Anonymous Client";
 const initials = getInitials(clientName);
 const gradient = getAvatarGradient(clientName);

 return (
 <div
 key={t.id}
 onClick={() => handleSelectThread(t)}
 className={cn(
 "p-space-3 radius-lg cursor-pointer transition-all duration-200 relative border flex gap-space-2.5 items-start",
 isSelected
 ?"bg-background border-[hsl(var(--primary)/0.25)] scale-[1.01]"
 :"bg-transparent border-transparent hover:bg-[hsl(var(--foreground)/0.03)] hover:border-[hsl(var(--foreground)/0.05)]"
 )} tabIndex={0} onKeyDown={() => {}}
 >
 {isSelected && (
 <span className="absolute left-0 top-1/4 bottom-1/4 w-0.75 bg-primary radius-r-full"/>
 )}

 <div className={`h-7.5 w-7.5 radius-full bg-gradient-to-br ${gradient} text-white text-caption font-semibold flex items-center justify-center shrink-0`}>
 {initials}
 </div>

 <div className="flex-1 min-w-0">
 <div className="flex items-center justify-between gap-space-2 mb-space-0.5">
 <span className="text-caption font-medium text-foreground truncate">{clientName}</span>
 <span className="text-caption text-muted-foreground/60 whitespace-nowrap shrink-0">
 {new Date(t.updatedAt).toLocaleTimeString([], { hour:"2-digit", minute:"2-digit"})}
 </span>
 </div>

 <div className="flex items-center gap-space-1.5 mb-space-1">
 <ChannelBadge type={t.channel?.type} />
 {profile?.status && (
 <span className="badge-status badge-neutral px-space-1.5 py-0 scale-85 origin-left">
 {profile.status}
 </span>
 )}
 </div>
 <p className="text-caption text-muted-foreground/85 truncate leading-snug">
 {t.lastMessage?.content ||"No messages yet..."}
 </p>
 </div>

 {t.unreadCount > 0 && (
 <span className="absolute right-space-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 bg-primary radius-full text-caption font-semibold text-primary-foreground flex items-center justify-center animate-pulse-soft">
 {t.unreadCount}
 </span>
 )}
 </div>
 );
 })
 )}
 </div>
 </div>

 {/* Card 2: Chat Pane (Center Panel) */}
 <div className="lg:col-span-6 flex flex-col h-full bg-card border border-[hsl(var(--foreground)/0.06)] radius-xl overflow-hidden soft- min-w-0">
 {selectedThread ? (
 <>
 {/* Header area */}
 <div className="p-space-4 border-b border-[hsl(var(--foreground)/0.06)] flex flex-wrap items-center justify-between gap-space-3 bg-[hsl(var(--foreground)/0.005)] shrink-0">
 <div className="flex items-center gap-space-2.5">
 <div className={`h-8 w-8 radius-full bg-gradient-to-br ${getAvatarGradient(selectedThread.conversation?.leadProfile?.name ||"Anonymous Client")} text-white text-caption font-bold flex items-center justify-center shrink-0`}>
 {getInitials(selectedThread.conversation?.leadProfile?.name ||"Anonymous Client")}
 </div>
 <div>
 <div className="flex items-center gap-space-1">
 <h4 className="text-caption font-semibold text-foreground">
 {selectedThread.conversation?.leadProfile?.name ||"Anonymous Client"}
 </h4>
 <span className="h-1.5 w-1.5 radius-full bg-emerald-500 animate-pulse-soft"/>
 </div>
 <p className="text-caption text-muted-foreground">
 via <span className="text-primary uppercase font-semibold text-caption tracking-wider">{selectedThread.channel?.type}</span>
 </p>
 </div>
 </div>

 <div className="flex items-center gap-space-2">
 {/* Staff Select */}
 <div className="relative flex items-center radius-md border border-[hsl(var(--foreground)/0.08)] bg-background px-space-2.5 py-space-0.5 hover:border-[hsl(var(--primary)/0.25)] transition-all">
 <select
 value={selectedThread.assignedStaffId ||""}
 onChange={(e) => handleAssignChange(e.target.value || null)}
 className="bg-transparent text-caption text-foreground focus:ring-0 focus:outline-none border-none outline-none cursor-pointer pr-space-4.5 py-space-0.5 appearance-none font-medium"
 >
 <option value="">Bot Manager</option>
 {MOCK_STAFF.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
 </select>
 <div className="absolute right-space-2 pointer-events-none text-muted-foreground/40">
 <svg className="w-2.5 h-2.5 fill-none stroke-current stroke-2"viewBox="0 0 24 24">
 <path d="M6 9l6 6 6-6"/>
 </svg>
 </div>
 </div>

 {/* Status Select */}
 <div className="relative flex items-center radius-md border border-[hsl(var(--foreground)/0.08)] bg-background px-space-2.5 py-space-0.5 hover:border-[hsl(var(--primary)/0.25)] transition-all">
 <select
 value={selectedThread.status}
 onChange={(e) => handleStatusChange(e.target.value as any)}
 className="bg-transparent text-caption text-foreground focus:ring-0 focus:outline-none border-none outline-none cursor-pointer pr-space-4.5 py-space-0.5 appearance-none font-medium"
 >
 <option value="open">Open</option>
 <option value="snoozed">Snoozed</option>
 <option value="closed">Closed</option>
 </select>
 <div className="absolute right-space-2 pointer-events-none text-muted-foreground/40">
 <svg className="w-2.5 h-2.5 fill-none stroke-current stroke-2"viewBox="0 0 24 24">
 <path d="M6 9l6 6 6-6"/>
 </svg>
 </div>
 </div>
 </div>
 </div>

 {/* Message scroll area */}
 <div className="flex-1 overflow-y-auto p-space-4 space-y-space-3.5 bg-slate-50/20 dark:bg-transparent sidebar-scroll">
 {loadingMessages ? (
 <div className="h-full flex flex-col items-center justify-center text-caption text-muted-foreground gap-space-2 py-space-10">
 <Loader2 className="h-5 w-5 animate-spin text-primary"/>
 <span>Loading messages...</span>
 </div>
 ) : messages.length === 0 ? (
 <div className="h-full flex items-center justify-center text-caption text-muted-foreground py-space-10">
 No conversation history.
 </div>
 ) : (
 messages.map((msg) => {
 const isIncoming = msg.direction ==="incoming";
 const isAi = msg.metadata?.isAiGenerated;
 return (
 <div key={msg.id} className={cn("flex flex-col", isIncoming ?"items-start":"items-end")}>
 <div className={cn(
 "max-w-3/4 radius-lg px-space-3.5 py-space-2 text-caption leading-relaxed border relative",
 isIncoming
 ?"bg-[hsl(var(--foreground)/0.04)] border-[hsl(var(--foreground)/0.05)] text-foreground rounded-tl-none"
 : isAi
 ?"bg-[hsl(var(--primary)/0.04)] border-[hsl(var(--primary)/0.15)] text-foreground rounded-tr-none"
 :"bg-[hsl(var(--foreground)/0.08)] border border-[hsl(var(--foreground)/0.10)] text-foreground rounded-tr-none"
 )}>
 {isAi && (
 <div className="absolute -top-space-1.5 -left-space-1.5 bg-primary text-primary-foreground p-space-0.5 radius-md border border-background shrink-0 flex items-center justify-center"title="AI generated response">
 <Sparkles className="h-2 w-2"/>
 </div>
 )}
 {msg.content}
 </div>
 <span className="text-caption text-muted-foreground/50 mt-space-1 px-space-1 select-none">
 {isIncoming ?"Client": isAi ?"AI Assistant":"Staff"} · {new Date(msg.createdAt).toLocaleTimeString([], { hour:"2-digit", minute:"2-digit"})}
 </span>
 </div>
 );
 })
 )}
 <div ref={chatEndRef} />
 </div>

 {/* Editor Box */}
 <div className="p-space-3 border-t border-[hsl(var(--foreground)/0.06)] bg-background shrink-0">
 <form onSubmit={handleSendReply} className="border border-[hsl(var(--foreground)/0.08)] radius-lg bg-background overflow-hidden focus-within:border-[hsl(var(--primary)/0.30)] focus-within:ring-2 focus-within:ring-[hsl(var(--primary)/0.08)] transition-all duration-200">
 <div className="flex items-center justify-between px-space-2.5 py-space-1.5 bg-[hsl(var(--foreground)/0.015)] border-b border-[hsl(var(--foreground)/0.05)]">
 <div className="flex gap-space-1">
 <Button type="button"
 onClick={() => setIsInternalNote(false)}
 className={cn(
 "h-5.5 px-space-2.5 radius-md text-caption font-normal uppercase tracking-wider transition-all duration-200 cursor-pointer",
 !isInternalNote
 ?"bg-background text-primary border border-[hsl(var(--foreground)/0.04)]"
 :"text-muted-foreground hover:text-foreground"
 )}>
 Message
 </Button>
 <Button type="button"
 onClick={() => setIsInternalNote(true)}
 className={cn(
 "h-5.5 px-space-2.5 radius-md text-caption font-normal uppercase tracking-wider transition-all duration-200 cursor-pointer",
 isInternalNote
 ?"bg-[hsl(var(--state-warning-text)/0.10)] text-state-warning-text border border-[hsl(var(--state-warning-text)/0.15)]"
 :"text-muted-foreground hover:text-foreground"
 )}>
 Internal Note
 </Button>
 </div>

 <div className="flex gap-space-1 text-muted-foreground/45 items-center">
 <Button type="button"variant="ghost"className="p-space-1 hover:text-foreground radius-sm transition-colors cursor-pointer"title="Attach file">
 <Paperclip className="h-3 w-3"/>
 </Button>
 <Button type="button"variant="ghost"className="p-space-1 hover:text-foreground radius-sm transition-colors cursor-pointer"title="Insert Emoji">
 <Smile className="h-3 w-3"/>
 </Button>
 </div>
 </div>

 <div className="p-space-2.5">
 <textarea
 value={replyText}
 onChange={(e) => setReplyText(e.target.value)}
 placeholder={isInternalNote ?"Type internal logs visible only to staff members...":"Write a reply to the customer..."}
 className="w-full bg-transparent text-caption text-foreground placeholder:text-muted-foreground/45 border-none outline-none focus:ring-0 focus:outline-none resize-none min-h-16 leading-normal"
 disabled={sendingReply}
 onKeyDown={(e) => {
 if (e.key ==="Enter"&& !e.shiftKey) {
 e.preventDefault();
 handleSendReply(e);
 }
 }}
 />
 </div>

 <div className="flex items-center justify-between px-space-2.5 py-space-1.5 bg-[hsl(var(--foreground)/0.005)] border-t border-[hsl(var(--foreground)/0.03)]">
 <span className="text-caption text-muted-foreground/40 font-mono">Press Enter to send</span>
 <Button type="submit"size="sm"className="h-7 px-space-3 hover:scale-[1.01] font-semibold text-caption"disabled={!replyText.trim() || sendingReply}>
 {sendingReply ? (
 <Loader2 className="h-3.5 w-3.5 animate-spin mr-space-1"/>
 ) : (
 <Send className="h-3 w-3 mr-space-1"/>
 )}
 <span>{isInternalNote ?"Log Note":"Send"}</span>
 </Button>
 </div>
 </form>
 </div>
 </>
 ) : (
 <div className="flex-1 flex flex-col items-center justify-center p-space-10 text-center gap-space-3 animate-fade-in py-space-20">
 <div className="flex h-12 w-12 items-center justify-center radius-xl bg-[hsl(var(--primary)/0.08)] text-primary ring-1 ring-[hsl(var(--primary)/0.12)] animate-float">
 <MessageSquare className="h-5 w-5"/>
 </div>
 <h3 className="text-body-sm font-semibold text-foreground mt-space-2">Select a conversation</h3>
 <p className="max-w-xs text-caption text-muted-foreground/80 leading-normal">
 Choose a client thread from the list on the left to start responding to their queries and qualifying leads.
 </p>
 </div>
 )}
 </div>

 {/* Card 3: Contact Profile (Right Panel) */}
 <div className="lg:col-span-3 flex flex-col h-full bg-card border border-[hsl(var(--foreground)/0.06)] radius-xl overflow-hidden soft-">
 {/* Header area - spacious padding */}
 <div className="p-space-4 border-b border-[hsl(var(--foreground)/0.06)] bg-[hsl(var(--foreground)/0.005)] shrink-0">
 <h4 className="text-caption font-semibold uppercase tracking-widest text-muted-foreground/50">Contact Profile</h4>
 </div>

 {/* Form / details scroll area */}
 <div className="flex-1 overflow-y-auto p-space-4 space-y-space-4 sidebar-scroll bg-[hsl(var(--foreground)/0.002)]">
 {selectedThread?.conversation?.leadProfile ? (
 <div className="space-y-space-4 animate-fade-in text-caption">
 {/* Lead Summary */}
 <div>
 <h5 className="text-caption font-semibold uppercase tracking-widest text-muted-foreground/55 mb-space-2">Lead Performance</h5>
 <div className="grid grid-cols-2 gap-space-2.5">
 <div className="stat-card radius-lg p-space-3 text-center flex flex-col justify-center bg-background border border-[hsl(var(--foreground)/0.05)]">
 <span className="text-caption font-semibold text-muted-foreground uppercase tracking-wider block">Lead Score</span>
 <span className="text-body-md font-semibold text-primary block mt-space-0.5">
 {selectedThread.conversation.leadProfile.leadScore}
 </span>
 </div>
 <div className="stat-card radius-lg p-space-3 text-center flex flex-col justify-center bg-background border border-[hsl(var(--foreground)/0.05)]">
 <span className="text-caption font-semibold text-muted-foreground uppercase tracking-wider block">Est. LTV</span>
 <span className="text-body-md font-semibold text-emerald-500 block mt-space-0.5">
 ${selectedThread.conversation.leadProfile.lifetimeValue || 0}
 </span>
 </div>
 </div>
 </div>

 {/* Edit Form */}
 <div className="space-y-space-2.5 border-t border-[hsl(var(--foreground)/0.05)] pt-space-3.5">
 <h5 className="text-caption font-semibold uppercase tracking-widest text-muted-foreground/55 mb-space-0.5">Profile Info</h5>

 {[
 { id:"contactName", label:"Client Name", value: contactName, setter: setContactName, type:"text"},
 { id:"contactEmail", label:"Email Address", value: contactEmail, setter: setContactEmail, type:"email"},
 { id:"contactPhone", label:"Phone Number", value: contactPhone, setter: setContactPhone, type:"text"},
 ].map(({ id, label, value, setter, type }) => (
 <div key={id} className="space-y-space-1">
 <Label htmlFor={id} className="text-caption font-semibold text-muted-foreground/75 uppercase tracking-wider">{label}</Label>
 <Input id={id} type={type} value={value} onChange={(e) => setter(e.target.value)} className="h-8 text-caption bg-background border-[hsl(var(--foreground)/0.08)] focus-visible:ring-primary/20"/>
 </div>
 ))}

 <div className="space-y-space-1">
 <Label htmlFor="contactStatus"className="text-caption font-semibold text-muted-foreground/75 uppercase tracking-wider">Lead Status</Label>
 <div className="relative flex items-center radius-md border border-[hsl(var(--foreground)/0.08)] bg-background px-space-2.5 py-space-0.5 hover:border-[hsl(var(--primary)/0.25)] transition-all">
 <select
 id="contactStatus"
 value={contactStatus}
 onChange={(e) => setContactStatus(e.target.value)}
 className="flex-1 bg-transparent text-caption text-foreground focus:ring-0 focus:outline-none border-none outline-none cursor-pointer pr-space-5 py-space-0.5 appearance-none font-medium"
 >
 {["New","Qualified","Hot","Booked","Escalated","Closed"].map(s => <option key={s} value={s}>{s}</option>)}
 </select>
 <div className="absolute right-space-2.5 pointer-events-none text-muted-foreground/40">
 <svg className="w-2.5 h-2.5 fill-none stroke-current stroke-2"viewBox="0 0 24 24">
 <path d="M6 9l6 6 6-6"/>
 </svg>
 </div>
 </div>
 </div>

 <div className="space-y-space-1">
 <Label htmlFor="contactTags"className="text-caption font-semibold text-muted-foreground/75 uppercase tracking-wider">Tags</Label>
 <Input id="contactTags"value={contactTags} onChange={(e) => setContactTags(e.target.value)} placeholder="vip, dental"className="h-8 text-caption bg-background border-[hsl(var(--foreground)/0.08)] focus-visible:ring-primary/20"/>
 </div>

 <div className="space-y-space-1">
 <Label htmlFor="contactNotes"className="text-caption font-semibold text-muted-foreground/75 uppercase tracking-wider">Internal Notes</Label>
 <textarea
 id="contactNotes"rows={2} value={contactNotes}
 onChange={(e) => setContactNotes(e.target.value)}
 className="flex min-h-20 w-full radius-md border border-[hsl(var(--foreground)/0.08)] bg-background px-space-2.5 py-space-1.5 text-caption text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/0.20)] focus:border-[hsl(var(--primary)/0.40)] transition-all resize-none"
 placeholder="Add lead detail notes..."
 />
 </div>

 <Button size="sm"className="w-full text-caption h-8 hover:scale-[1.01] mt-space-2 font-semibold"onClick={handleSaveContact} disabled={isSavingContact}>
 {isSavingContact ?"Saving...":"Save Profile"}
 </Button>
 </div>
 </div>
 ) : (
 <div className="h-full flex flex-col items-center justify-center p-space-6 text-center text-caption text-muted-foreground gap-space-2.5 py-space-12">
 <div className="h-10 w-10 radius-full bg-[hsl(var(--foreground)/0.03)] border border-[hsl(var(--foreground)/0.06)] flex items-center justify-center text-muted-foreground/30">
 <User className="h-4.5 w-4.5"/>
 </div>
 <span className="text-caption font-medium max-w-36 leading-normal text-muted-foreground/70">Select a thread to view contact profile details</span>
 </div>
 )}
 </div>
 </div>

 </div>
 </div>
 );
}
