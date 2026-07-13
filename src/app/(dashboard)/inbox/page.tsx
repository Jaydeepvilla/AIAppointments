"use client";

import { Badge } from "@/components/shared/badge";
import { useState, useEffect, useRef } from "react";
import {
  getInboxThreadsAction,
  getThreadMessagesAction,
  sendStaffReplyAction,
  assignThreadAction,
  updateThreadStatusAction,
  updateContactAction,
} from "@/server/actions/omnichannel";
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
  X,
  Bot,
  Info,
  Calendar,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";
import { Label } from "@/components/shared/label";
import { PageTitle } from "@/components/shared/page-title";
import { cn } from "@/components/shared/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shared/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/shared/tabs";
import { NativeTextarea } from "@/components/shared/native";
import { ScrollArea } from "@/components/ui/scroll-area";

const MOCK_STAFF = [
  { id: "staff-1", name: "Dr. Alice" },
  { id: "staff-2", name: "Nurse Bob" },
  { id: "staff-3", name: "Receptionist Charlie" },
];

const EMOJI_CATEGORIES = [
  {
    name: "Smileys",
    icon: "😊",
    emojis: [
      "😊", "😀", "😂", "🤣", "😇", "😍", "🥰", "😎", "😜", "🤔", 
      "😴", "😭", "😡", "🤢", "🤐", "🙄", "😱", "🤩", "🥳", "🥺",
      "😏", "😮", "😬", "🥱", "😈", "🤡", "💩", "👻", "👽", "👾"
    ]
  },
  {
    name: "Gestures",
    icon: "👍",
    emojis: [
      "👍", "👎", "❤️", "🔥", "🎉", "🙌", "🙏", "👏", "👋", "👀", 
      "💪", "💡", "✨", "💯", "🎈", "💔", "🌟", "🤝", "✌️", "👌", 
      "✍️", "🖐️", "💖", "💘", "💌", "💤", "💥", "💦", "💨", "💫"
    ]
  },
  {
    name: "Animals",
    icon: "🐶",
    emojis: [
      "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", 
      "🦁", "🐮", "🐷", "🐸", "🐵", "🐔", "🐧", "🐦", "🦆", "🦅",
      "🦉", "🦇", "🐺", "🐗", "🐴", "🦄", "🐝", "🐛", "🦋", "🐌"
    ]
  },
  {
    name: "Food",
    icon: "🍕",
    emojis: [
      "🍕", "🍔", "🍟", "🌭", "🍿", "🍩", "🍰", "🧁", "🍫", "🍬", 
      "🍎", "🍌", "🍉", "🍓", "🍒", "🍑", "🍍", "🥑", "🥦", "🥕",
      "☕", "🍺", "🍷", "🥤", "🍣", "🌮", "🍦", "🍪", "🥐", "🥖"
    ]
  },
  {
    name: "Objects",
    icon: "💼",
    emojis: [
      "💼", "💻", "📱", "⌚", "📷", "🔋", "🔌", "🔒", "🔑", "📦", 
      "✏️", "✉️", "📞", "📅", "📊", "📁", "🛒", "💵", "💳", "🎁",
      "🏆", "🎨", "🎬", "🎸", "🎮", "🎯", "⚽", "🚗", "✈️", "🚀"
    ]
  }
];

function ChannelBadge({ type }: { type?: string }) {
  switch (type) {
    case "whatsapp":
      return <Badge variant="success">WhatsApp</Badge>;
    case "sms":
      return <Badge>SMS</Badge>;
    case "email":
      return <Badge variant="info">Email</Badge>;
    default:
      return <Badge>Chat</Badge>;
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

  // Attachment & Emoji state
  const [attachment, setAttachment] = useState<File | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeEmojiTab, setActiveEmojiTab] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"open" | "snoozed" | "closed">("open");
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
      // FIX: Query using the actual conversationId, not selectedThread.id
      fetchMessages(selectedThread.conversationId);
      
      // Populate profile details
      const profile = selectedThread.conversation?.leadProfile;
      setContactName(profile?.name || "");
      setContactEmail(profile?.email || "");
      setContactPhone(profile?.phone || "");
      setContactStatus(profile?.status || "New");
      setContactTags(profile?.tags?.join(",") || "");
      setContactNotes(profile?.notes || "");
    } else {
      setMessages([]);
    }
  }, [selectedThread]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchThreads = async () => {
    try {
      setLoading(true);
      const res = await getInboxThreadsAction();
      if (res.success && res.threads) {
        setThreads(res.threads);
      } else {
        setErrorMsg(res.error || "Failed to load conversations.");
      }
    } catch (e: any) {
      setErrorMsg(e.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      setLoadingMessages(true);
      const res = await getThreadMessagesAction(conversationId);
      if (res.success && res.messages) {
        setMessages(res.messages);
      } else {
        setErrorMsg(res.error || "Failed to load message history.");
      }
    } catch (e: any) {
      setErrorMsg(e.message || "Error loading messages.");
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSelectThread = (thread: any) => {
    setSelectedThread(thread);
    // Mark as read locally
    setThreads((prev: any[]) =>
      prev.map((t: any) => (t.id === thread.id ? { ...t, unreadCount: 0 } : t))
    );
  };

  const handleSendReply = async (e: any) => {
    e.preventDefault();
    if ((!replyText.trim() && !attachment) || !selectedThread) return;
    try {
      setSendingReply(true);
      let content = replyText.trim();
      if (attachment) {
        content = `${content} [Attachment: ${attachment.name}]`.trim();
      }

      // Optimistic Update: instantly display in message log
      const optimisticMsg = {
        id: `temp-${Date.now()}`,
        direction: "outgoing",
        content,
        createdAt: new Date(),
        metadata: { isAiGenerated: false, isInternalNote },
      };
      setMessages((prev) => [...prev, optimisticMsg]);
      setReplyText("");
      setAttachment(null);

      const res = await sendStaffReplyAction({
        threadId: selectedThread.id,
        conversationId: selectedThread.conversationId,
        channelId: selectedThread.channelId,
        recipientId:
          selectedThread.conversation?.leadProfile?.phone ||
          selectedThread.conversation?.leadProfile?.email,
        content,
      });

      if (res.success) {
        // Fetch fresh message log
        const msgRes = await getThreadMessagesAction(selectedThread.conversationId);
        if (msgRes.success && msgRes.messages) {
          setMessages(msgRes.messages);
        }
        fetchThreads();
      } else {
        setErrorMsg(res.error || "Failed to send message.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Error sending message.");
    } finally {
      setSendingReply(false);
    }
  };

  const handleAssignChange = async (staffId: string | null) => {
    if (!selectedThread) return;
    try {
      const res = await assignThreadAction(selectedThread.id, staffId);
      if (res.success) {
        setSelectedThread((prev: any) =>
          prev ? { ...prev, assignedStaffId: staffId } : null
        );
        fetchThreads();
      } else {
        setErrorMsg(res.error || "Failed to assign staff.");
      }
    } catch (e: any) {
      setErrorMsg(e.message || "Error assigning staff.");
    }
  };

  const handleStatusChange = async (status: "open" | "snoozed" | "closed") => {
    if (!selectedThread) return;
    try {
      const res = await updateThreadStatusAction(selectedThread.id, status);
      if (res.success) {
        setSelectedThread((prev: any) => (prev ? { ...prev, status } : null));
        fetchThreads();
      } else {
        setErrorMsg(res.error || "Failed to update status.");
      }
    } catch (e: any) {
      setErrorMsg(e.message || "Error updating thread status.");
    }
  };

  const handleSaveContact = async () => {
    if (!selectedThread?.conversation?.leadProfile) return;
    try {
      setIsSavingContact(true);
      const tagsArray = contactTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
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
        const updatedProfile = {
          ...selectedThread.conversation.leadProfile,
          name: contactName.trim(),
          email: contactEmail.trim().toLowerCase(),
          phone: contactPhone.trim(),
          status: contactStatus,
          tags: tagsArray,
          notes: contactNotes.trim(),
        };

        setSelectedThread((prev: any) => {
          if (!prev) return null;
          return {
            ...prev,
            conversation: {
              ...prev.conversation,
              leadProfile: updatedProfile,
            },
          };
        });

        setThreads((prev: any[]) =>
          prev.map((t: any) => {
            if (t.id === selectedThread.id) {
              return {
                ...t,
                conversation: {
                  ...t.conversation,
                  leadProfile: updatedProfile,
                },
              };
            }
            return t;
          })
        );
      } else {
        setErrorMsg(res.error || "Failed to save profile.");
      }
    } catch (e: any) {
      setErrorMsg(e.message || "Error saving contact profile.");
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
    const channelMatch =
      channelFilter === "all" || t.channel?.type === channelFilter;
    return queryMatch && statusMatch && channelMatch;
  });

  const getInitials = (name: string) => {
    if (!name) return "AC";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2 && parts[0] && parts[1]) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getAvatarGradient = (name: string) => {
    const hash = name
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
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
    <div className="space-y-space-4 animate-fade-in w-full h-full flex flex-col">
      {/* Header */}
      <PageTitle
        title="Inbox"
        badge={
          <span className="inline-flex items-center gap-space-1.5 text-caption font-semibold text-emerald-500 uppercase tracking-widest">
            <span className="h-2 w-2 radius-full bg-emerald-500 animate-pulse-soft" />
            Live
          </span>
        }
      />

      {errorMsg && (
        <div className="p-space-3 bg-state-error-bg border border-state-error-text/10 text-state-error-text radius-xl flex items-center justify-between text-caption animate-fade-in">
          <div className="flex items-center gap-space-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="font-medium">{errorMsg}</span>
          </div>
          <Button
            variant="ghost"
            size="xs"
            className="text-state-error-text hover:bg-state-error-text/10"
            onClick={() => setErrorMsg("")}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-space-4">
        {/* PANEL 1: Conversations List */}
        <div className="lg:col-span-3 flex flex-col h-full bg-card border border-border-subtle radius-xl overflow-hidden shadow-xs">
          {/* Header Search & Filter */}
          <div className="p-space-4 border-b border-border-subtle space-y-space-3 bg-bg-layer-1/30 shrink-0">
            <div className="relative">
              <Search className="absolute left-space-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="pl-space-9 h-9 text-caption bg-background focus-visible:ring-primary/20"
              />
            </div>

            {/* Tabs Filter */}
            <Tabs
              value={statusFilter}
              onValueChange={(val: any) => setStatusFilter(val)}
              variant="segmented"
              size="sm"
              className="w-full"
            >
              <TabsList className="w-full bg-bg-layer-2 border border-border-subtle p-0.5 radius-lg">
                {(["open", "snoozed", "closed"] as const).map((st) => {
                  const count = threads.filter((t) => t.status === st).length;
                  return (
                    <TabsTrigger key={st} value={st} className="flex-1 gap-space-1.5 py-space-1 uppercase tracking-wider text-caption font-semibold">
                      <span>{st}</span>
                      <span className="text-caption bg-foreground/5 dark:bg-foreground/10 px-space-1.5 py-space-0.25 radius-md font-normal">
                        {count}
                      </span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>

            {/* Channels Filter Dropdown */}
            <Select value={channelFilter} onValueChange={(val) => setChannelFilter(val)}>
              <SelectTrigger className="h-8.5 bg-background text-caption border-border-subtle hover:border-border-hover transition-all radius-md">
                <div className="flex items-center gap-space-2 font-medium text-neutral-600 dark:text-neutral-300">
                  <Filter className="h-3 w-3" />
                  <SelectValue placeholder="All Channels" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Channels</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* List Scroll Area */}
          <ScrollArea className="flex-1 p-space-2 space-y-space-1 bg-bg-layer-1/10" horizontal={false}>
                              {filteredThreads.length === 0 ? (
                                <div className="p-space-6 text-center flex flex-col items-center justify-center h-full min-h-64">
                                  <Inbox className="h-8 w-8 text-neutral-300 dark:text-neutral-800 mb-space-2 animate-float" />
                                  <span className="text-caption font-semibold text-foreground">No conversations</span>
                                  <p className="text-caption text-neutral-400 max-w-40 mx-auto mt-space-1 leading-normal">
                                    Try checking other filters or clear the search.
                                  </p>
                                </div>
                              ) : (
                                filteredThreads.map((t) => {
                                  const isSelected = selectedThread?.id === t.id;
                                  const profile = t.conversation?.leadProfile;
                                  const clientName = profile?.name || "Anonymous Client";
                                  const initials = getInitials(clientName);
                                  const gradient = getAvatarGradient(clientName);
                                  const isUnread = t.unreadCount > 0;

                                  return (
                                    <div
                                      key={t.id}
                                      onClick={() => handleSelectThread(t)}
                                      className={cn(
                                        "p-space-3 radius-lg cursor-pointer transition-all duration-150 relative border flex gap-space-3 items-start select-none",
                                        isSelected
                                          ? "bg-bg-layer-2 border-border-hover shadow-xs"
                                          : "bg-transparent border-transparent hover:bg-bg-layer-1/50 hover:border-border-subtle"
                                      )}
                                      tabIndex={0}
                                      onKeyDown={() => {}}
                                    >
                                      {isUnread && (
                                        <span className="absolute left-space-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary radius-full" />
                                      )}

                                      <div
                                        className={`h-8 w-8 radius-full bg-gradient-to-br ${gradient} text-white text-caption font-bold flex items-center justify-center shrink-0 shadow-xs`}
                                      >
                                        {initials}
                                      </div>

                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-space-2 mb-space-0.5">
                                          <span className={cn(
                                            "text-caption truncate",
                                            isUnread ? "font-bold text-foreground" : "font-medium text-foreground/80"
                                          )}>
                                            {clientName}
                                          </span>
                                          <span className="text-caption text-neutral-400 whitespace-nowrap shrink-0">
                                            {new Date(t.updatedAt).toLocaleTimeString([], {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                            })}
                                          </span>
                                        </div>

                                        <div className="flex items-center gap-space-1.5 mb-space-1">
                                          <ChannelBadge type={t.channel?.type} />
                                          {profile?.status && (
                                            <span className="badge-status badge-neutral px-space-1.5 py-space-0 scale-85 origin-left">
                                              {profile.status}
                                            </span>
                                          )}
                                        </div>
                                        <p className={cn(
                                          "text-caption truncate leading-snug",
                                          isUnread ? "font-semibold text-foreground" : "text-neutral-500"
                                        )}>
                                          {t.lastMessage?.content || "No messages yet..."}
                                        </p>
                                      </div>

                                      {isUnread && (
                                        <span className="h-4.5 min-w-4.5 px-space-1 radius-full bg-primary text-caption font-bold text-primary-foreground flex items-center justify-center shrink-0">
                                          {t.unreadCount}
                                        </span>
                                      )}
                                    </div>
                                  );
                                })
                              )}
                            </ScrollArea>
        </div>

        {/* PANEL 2: Chat Pane */}
        <div className="lg:col-span-6 flex flex-col h-full bg-card border border-border-subtle radius-xl overflow-hidden shadow-xs min-w-0">
          {selectedThread ? (
            <>
              {/* Chat Header */}
              <div className="p-space-4 border-b border-border-subtle flex flex-wrap items-center justify-between gap-space-3 bg-bg-layer-1/30 shrink-0">
                <div className="flex items-center gap-space-2.5">
                  <div
                    className={`h-9 w-9 radius-full bg-gradient-to-br ${getAvatarGradient(
                      selectedThread.conversation?.leadProfile?.name || "Anonymous Client"
                    )} text-white text-caption font-bold flex items-center justify-center shrink-0 shadow-xs`}
                  >
                    {getInitials(
                      selectedThread.conversation?.leadProfile?.name || "Anonymous Client"
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-space-1.5">
                      <h4 className="text-body-sm font-semibold text-foreground">
                        {selectedThread.conversation?.leadProfile?.name || "Anonymous Client"}
                      </h4>
                      <span className="h-1.5 w-1.5 radius-full bg-emerald-500 animate-pulse-soft" />
                    </div>
                    <p className="text-caption text-neutral-500">
                      via{" "}
                      <span className="text-primary uppercase font-bold text-caption tracking-wider">
                        {selectedThread.channel?.type}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-space-2">
                  {/* Bot Manager Dropdown */}
                  <Select
                    value={selectedThread.assignedStaffId || "bot"}
                    onValueChange={(val) => handleAssignChange(val === "bot" ? null : val)}
                  >
                    <SelectTrigger className="h-8 text-caption border-border-subtle hover:border-border-hover w-36 bg-background">
                      <div className="flex items-center gap-space-1.5 truncate">
                        <Bot className="h-3.5 w-3.5 text-neutral-400" />
                        <SelectValue placeholder="Bot Manager" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bot">AI Bot Manager</SelectItem>
                      {MOCK_STAFF.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Status Dropdown */}
                  <Select
                    value={selectedThread.status}
                    onValueChange={(val: any) => handleStatusChange(val)}
                  >
                    <SelectTrigger className="h-8 text-caption border-border-subtle hover:border-border-hover w-28 bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="snoozed">Snoozed</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Message scroll area - Scroll only appears when messages overflow container */}
              <ScrollArea className="flex-1 p-space-4 space-y-space-4 bg-bg-layer-1/5" horizontal={false}>
                                          {loadingMessages ? (
                                            <div className="h-full flex flex-col items-center justify-center text-caption text-neutral-500 gap-space-2 py-space-10">
                                              <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                              <span>Loading messages...</span>
                                            </div>
                                          ) : messages.length === 0 ? (
                                            <div className="h-full flex items-center justify-center text-caption text-neutral-500 py-space-10">
                                              No conversation history.
                                            </div>
                                          ) : (
                                            messages.map((msg) => {
                                              const isIncoming = msg.direction === "incoming";
                                              const isAi = msg.metadata?.isAiGenerated;
                                              const isInternal = msg.metadata?.isInternalNote;

                                              return (
                                                <div
                                                  key={msg.id}
                                                  className={cn("flex flex-col", isIncoming ? "items-start" : "items-end")}
                                                >
                                                  <div
                                                    className={cn(
                                                      "max-w-[75%] radius-xl px-space-4 py-space-2.5 text-caption leading-relaxed border relative shadow-xs",
                                                      isIncoming
                                                        ? "bg-bg-layer-1 border-border-subtle text-foreground rounded-tl-none"
                                                        : isInternal
                                                        ? "bg-state-warning-bg/40 border-state-warning-text/10 text-state-warning-text rounded-tr-none"
                                                        : isAi
                                                        ? "bg-primary-50 dark:bg-primary-950/20 border-primary/10 text-foreground rounded-tr-none"
                                                        : "bg-bg-layer-2 border-border-default text-foreground rounded-tr-none"
                                                    )}
                                                  >
                                                    {isAi && (
                                                      <div
                                                        className="absolute -top-space-2 -left-space-2 bg-primary text-primary-foreground p-space-1 radius-md border border-background shrink-0 flex items-center justify-center shadow-xs"
                                                        title="AI generated response"
                                                      >
                                                        <Sparkles className="h-2.5 w-2.5" />
                                                      </div>
                                                    )}
                                                    {msg.content}
                                                  </div>
                                                  <span className="text-caption text-neutral-400 mt-space-1.5 px-space-1 block">
                                                    {isIncoming
                                                      ? "Client"
                                                      : isInternal
                                                      ? "Staff Note"
                                                      : isAi
                                                      ? "AI Assistant"
                                                      : "Staff"}{" "}
                                                    ·{" "}
                                                    {new Date(msg.createdAt).toLocaleTimeString([], {
                                                      hour: "2-digit",
                                                      minute: "2-digit",
                                                    })}
                                                  </span>
                                                </div>
                                              );
                                            })
                                          )}
                                          <div ref={chatEndRef} />
                                        </ScrollArea>

              {/* Editor Box */}
              <div className="p-space-3 border-t border-border-subtle bg-background shrink-0">
                <form
                  onSubmit={handleSendReply}
                  className="border border-border-default radius-xl bg-background focus-within:border-primary/30 focus-within:ring-2 focus-within:ring-primary/5 transition-all duration-200 relative"
                >
                  <div className="flex items-center justify-between px-space-3 py-space-2 bg-bg-layer-1/20 border-b border-border-subtle radius-t-xl">
                    {/* Consistent Segmented Tabs for switching Message vs Note */}
                    <Tabs
                      value={isInternalNote ? "note" : "message"}
                      onValueChange={(val) => setIsInternalNote(val === "note")}
                      variant="segmented"
                      size="sm"
                      className="w-auto"
                    >
                      <TabsList className="bg-bg-layer-2 border border-border-subtle p-0.5 radius-md">
                        <TabsTrigger value="message" className="px-space-3 py-space-1 text-caption font-semibold">
                          Message
                        </TabsTrigger>
                        <TabsTrigger value="note" className="px-space-3 py-space-1 text-caption font-semibold">
                          Internal Note
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>

                    <div className="flex gap-space-1 text-neutral-400 items-center">
                      {/* Hidden File Input */}
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setAttachment(e.target.files[0]);
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        className="hover:text-foreground"
                        title="Attach file"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Paperclip className="h-3.5 w-3.5" />
                      </Button>

                      <div className="relative">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          className="hover:text-foreground"
                          title="Insert Emoji"
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        >
                          <Smile className="h-3.5 w-3.5" />
                        </Button>
                        {showEmojiPicker && (
                          <div className="absolute bottom-full right-space-0 mb-space-2 bg-popover border border-border-default radius-lg p-space-2.5 flex flex-col gap-space-2 shadow-md z-30 w-64 h-56 select-none animate-fade-in">
                            {/* Category Selector tabs */}
                            <div className="flex items-center justify-between pb-space-1.5 border-b border-border-subtle shrink-0">
                              {EMOJI_CATEGORIES.map((cat, idx) => (
                                <button
                                  key={cat.name}
                                  type="button"
                                  className={cn(
                                    "p-1 radius-md text-caption cursor-pointer transition-colors",
                                    activeEmojiTab === idx ? "bg-bg-layer-2 scale-105 border border-border-default" : "opacity-60 hover:opacity-100"
                                  )}
                                  onClick={() => setActiveEmojiTab(idx)}
                                  title={cat.name}
                                >
                                  {cat.icon}
                                </button>
                              ))}
                            </div>
                            
                            {/* Emojis Grid list */}
                            <ScrollArea className="flex-1 grid grid-cols-6 gap-1" horizontal={false}>
                                                                                    {EMOJI_CATEGORIES[activeEmojiTab].emojis.map((emoji) => (
                                                                                      <button
                                                                                        key={emoji}
                                                                                        type="button"
                                                                                        className="hover:bg-bg-layer-2 hover:scale-110 p-1 radius-md text-body-sm cursor-pointer text-center transition-all"
                                                                                        onClick={() => {
                                                                                          setReplyText((prev) => prev + emoji);
                                                                                          setShowEmojiPicker(false);
                                                                                        }}
                                                                                      >
                                                                                        {emoji}
                                                                                      </button>
                                                                                    ))}
                                                                                  </ScrollArea>

                            {/* Caption Footer */}
                            <div className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase font-semibold tracking-wider text-right border-t border-border-subtle pt-1 shrink-0">
                              {EMOJI_CATEGORIES[activeEmojiTab].name}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-space-3">
                    {/* Attachment preview bar */}
                    {attachment && (
                      <div className="flex items-center justify-between bg-bg-layer-1 border border-border-subtle p-space-2 radius-md mb-space-2 text-caption animate-fade-in">
                        <span className="truncate max-w-xs text-neutral-700 dark:text-neutral-300 font-medium">
                          📎 {attachment.name}
                        </span>
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => setAttachment(null)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}

                    <NativeTextarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={
                        isInternalNote
                          ? "Type internal logs visible only to staff members..."
                          : "Write a reply to the customer..."
                      }
                      className="w-full bg-transparent text-caption text-foreground placeholder:text-neutral-400 border-none outline-none focus:ring-0 focus:outline-none resize-none min-h-16 leading-normal"
                      disabled={sendingReply}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendReply(e);
                        }
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between px-space-3 py-space-2 bg-bg-layer-1/5 border-t border-border-subtle radius-b-xl">
                    <span className="text-caption text-neutral-400 font-mono">
                      Press Enter to send
                    </span>
                    <Button
                      type="submit"
                      size="sm"
                      className="px-space-4 text-caption"
                      disabled={(!replyText.trim() && !attachment) || sendingReply}
                    >
                      {sendingReply ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin mr-space-1" />
                      ) : (
                        <Send className="h-3 w-3 mr-space-1" />
                      )}
                      <span>{isInternalNote ? "Log Note" : "Send"}</span>
                    </Button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-space-10 text-center gap-space-3 animate-fade-in py-space-20">
              <div className="flex h-12 w-12 items-center justify-center radius-xl bg-primary/10 text-primary ring-1 ring-primary/20 animate-float shadow-xs">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h3 className="text-body-sm font-semibold text-foreground mt-space-2">
                Select a conversation
              </h3>
              <p className="max-w-xs text-caption text-neutral-400 leading-normal">
                Choose a client thread from the list on the left to start responding to their queries and
                qualifying leads.
              </p>
            </div>
          )}
        </div>

        {/* PANEL 3: Contact Profile */}
        <div className="lg:col-span-3 flex flex-col h-full bg-card border border-border-subtle radius-xl overflow-hidden shadow-xs">
          <div className="p-space-3 border-b border-border-subtle bg-bg-layer-1/30 shrink-0">
            <h4 className="text-caption font-semibold uppercase tracking-widest text-neutral-500">
              Contact Profile
            </h4>
          </div>

          <ScrollArea className="flex-1 p-space-3 space-y-space-3 bg-bg-layer-1/5" horizontal={false}>
                              {selectedThread?.conversation?.leadProfile ? (
                                <div className="space-y-space-3 animate-fade-in text-caption">
                                  {/* Visual Avatar Summary Card (Horizontal Layout) */}
                                  <div className="flex items-center gap-space-3 p-space-2.5 bg-background border border-border-subtle radius-lg shadow-xs">
                                    <div
                                      className={`h-9 w-9 radius-full bg-gradient-to-br ${getAvatarGradient(
                                        selectedThread.conversation?.leadProfile?.name || "Anonymous Client"
                                      )} text-white text-caption font-bold flex items-center justify-center shrink-0 shadow-xs`}
                                    >
                                      {getInitials(
                                        selectedThread.conversation?.leadProfile?.name || "Anonymous Client"
                                      )}
                                    </div>
                                    <div className="text-left min-w-0">
                                      <h4 className="text-caption font-semibold text-foreground truncate leading-tight">
                                        {selectedThread.conversation?.leadProfile?.name || "Anonymous Client"}
                                      </h4>
                                      <span className="text-caption text-neutral-400 block mt-space-0.5 leading-none">
                                        via <span className="text-primary font-semibold uppercase">{selectedThread.channel?.type}</span>
                                      </span>
                                    </div>
                                  </div>

                                  {/* Lead Summary (Horizontal Row Layout) */}
                                  <div>
                                    <h5 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-space-1.5">
                                      Lead Performance
                                    </h5>
                                    <div className="grid grid-cols-2 gap-space-2">
                                      <div className="bg-background border border-border-subtle radius-lg p-space-2 flex items-center gap-space-2 shadow-xs">
                                        <TrendingUp className="h-3.5 w-3.5 text-primary shrink-0" />
                                        <div className="min-w-0">
                                          <span className="text-[9px] text-neutral-400 uppercase tracking-wider block leading-none">
                                            Score
                                          </span>
                                          <span className="text-caption font-bold text-foreground block mt-0.5 leading-none">
                                            {selectedThread.conversation.leadProfile.leadScore}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="bg-background border border-border-subtle radius-lg p-space-2 flex items-center gap-space-2 shadow-xs">
                                        <DollarSign className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                        <div className="min-w-0">
                                          <span className="text-[9px] text-neutral-400 uppercase tracking-wider block leading-none">
                                            Est. LTV
                                          </span>
                                          <span className="text-caption font-bold text-foreground block mt-0.5 leading-none">
                                            ${selectedThread.conversation.leadProfile.lifetimeValue || 0}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Edit Form */}
                                  <div className="space-y-space-2 border-t border-border-subtle pt-space-3">
                                    <h5 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-space-1">
                                      Profile Info
                                    </h5>

                                    <div className="space-y-space-0.5">
                                      <Label
                                        htmlFor="contactName"
                                        className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider"
                                      >
                                        Client Name
                                      </Label>
                                      <Input
                                        id="contactName"
                                        type="text"
                                        value={contactName}
                                        onChange={(e) => setContactName(e.target.value)}
                                        className="h-7.5 text-caption bg-background border-border-subtle focus-visible:ring-primary/20"
                                      />
                                    </div>

                                    <div className="space-y-space-0.5">
                                      <Label
                                        htmlFor="contactEmail"
                                        className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider"
                                      >
                                        Email Address
                                      </Label>
                                      <Input
                                        id="contactEmail"
                                        type="email"
                                        value={contactEmail}
                                        onChange={(e) => setContactEmail(e.target.value)}
                                        className="h-7.5 text-caption bg-background border-border-subtle focus-visible:ring-primary/20"
                                      />
                                    </div>

                                    {/* Side-by-Side Grid for Phone and Lead Status */}
                                    <div className="grid grid-cols-2 gap-space-2">
                                      <div className="space-y-space-0.5">
                                        <Label
                                          htmlFor="contactPhone"
                                          className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider"
                                        >
                                          Phone Number
                                        </Label>
                                        <Input
                                          id="contactPhone"
                                          type="text"
                                          value={contactPhone}
                                          onChange={(e) => setContactPhone(e.target.value)}
                                          className="h-7.5 text-caption bg-background border-border-subtle focus-visible:ring-primary/20"
                                        />
                                      </div>

                                      <div className="space-y-space-0.5">
                                        <Label
                                          htmlFor="contactStatus"
                                          className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider"
                                        >
                                          Lead Status
                                        </Label>
                                        <Select value={contactStatus} onValueChange={(val) => setContactStatus(val)}>
                                          <SelectTrigger id="contactStatus" className="h-7.5 bg-background text-caption border-border-subtle hover:border-border-hover px-space-2">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {["New", "Qualified", "Hot", "Booked", "Escalated", "Closed"].map((s) => (
                                              <SelectItem key={s} value={s}>
                                                {s}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>

                                    <div className="space-y-space-0.5">
                                      <Label
                                        htmlFor="contactTags"
                                        className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider"
                                      >
                                        Tags
                                      </Label>
                                      <Input
                                        id="contactTags"
                                        value={contactTags}
                                        onChange={(e) => setContactTags(e.target.value)}
                                        placeholder="vip, dental"
                                        className="h-7.5 text-caption bg-background border-border-subtle focus-visible:ring-primary/20"
                                      />
                                    </div>

                                    <div className="space-y-space-0.5">
                                      <Label
                                        htmlFor="contactNotes"
                                        className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider"
                                      >
                                        Internal Notes
                                      </Label>
                                      <NativeTextarea
                                        id="contactNotes"
                                        rows={2}
                                        value={contactNotes}
                                        onChange={(e) => setContactNotes(e.target.value)}
                                        className="flex h-12 min-h-12 w-full radius-md border border-border-subtle bg-background px-space-2.5 py-space-1 text-caption text-foreground placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                                        placeholder="Add lead detail notes..."
                                      />
                                    </div>

                                    <Button
                                      size="sm"
                                      width="full"
                                      className="text-caption mt-space-1.5 h-8.5"
                                      onClick={handleSaveContact}
                                      disabled={isSavingContact}
                                    >
                                      {isSavingContact ? "Saving..." : "Save Profile"}
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div className="h-full flex flex-col items-center justify-center p-space-6 text-center text-caption text-neutral-400 gap-space-2 py-space-12">
                                  <div className="h-8 w-8 radius-full bg-neutral-100 dark:bg-neutral-800 border border-border-subtle flex items-center justify-center text-neutral-400">
                                    <User className="h-4 w-4" />
                                  </div>
                                  <span className="text-caption font-medium max-w-32 leading-normal">
                                    Select a thread to view contact profile details
                                  </span>
                                </div>
                              )}
                            </ScrollArea>
        </div>
      </div>
    </div>
  );
}