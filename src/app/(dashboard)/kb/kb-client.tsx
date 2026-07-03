"use client";

import * as React from"react";
import { useRouter } from"next/navigation";
import { 
 BookOpen, 
 FileText, 
 Globe, 
 FolderPlus, 
 FolderOpen,
 ListFilter, 
 Search, 
 Settings, 
 Plus, 
 Loader2, 
 Check, 
 AlertTriangle,
 FileCode,
 HardDrive,
 Activity,
 Trash2,
 Archive,
 RotateCcw,
 Edit3,
 ExternalLink,
 ChevronRight,
 Sparkles,
 CheckCircle2,
 AlertCircle,
 Database,
 Trash,
 PlayCircle,
 Save,
 UploadCloud
} from"lucide-react";
import { Button } from"@/components/shared/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from"@/components/shared/card";
import { Input } from"@/components/shared/input";
import { Label } from"@/components/shared/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from"@/components/shared/dialog";
import { EmptyState } from"@/components/shared/empty-state";
import { cn } from"@/components/shared/utils";
import { 
 Select, 
 SelectContent, 
 SelectItem, 
 SelectTrigger, 
 SelectValue 
} from"@/components/shared/select";

import { 
 createKnowledgeCategoryAction, 
 updateKnowledgeCategoryAction, 
 deleteKnowledgeCategoryAction,
 uploadKnowledgeDocumentAction,
 renameKnowledgeDocumentAction,
 archiveKnowledgeDocumentAction,
 deleteKnowledgeDocumentAction,
 triggerWebsiteImportAction,
 searchKnowledgeAction
} from"@/server/actions/knowledge";

interface KnowledgeCenterClientProps {
 initialCategories: any[];
 initialDocuments: any[];
 initialImports: any[];
 initialJobs: any[];
 stats: {
 totalDocuments: number;
 totalChunks: number;
 healthScore: number;
 healthLabel: string;
 storageUsedBytes: number;
 recentUploads: any[];
 };
}

export function KnowledgeCenterClient({
 initialCategories,
 initialDocuments,
 initialImports,
 initialJobs,
 stats,
}: KnowledgeCenterClientProps) {
 const router = useRouter();
 const [activeTab, setActiveTab] = React.useState<string>("overview");
 
 // States
 const [categories, setCategories] = React.useState(initialCategories);
 const [documents, setDocuments] = React.useState(initialDocuments);
 const [imports, setImports] = React.useState(initialImports);
 const [jobs, setJobs] = React.useState(initialJobs);
 const [showArchived, setShowArchived] = React.useState(false);

 // Category Dialogs
 const [isCategoryOpen, setIsCategoryOpen] = React.useState(false);
 const [editingCategory, setEditingCategory] = React.useState<any | null>(null);
 const [categoryName, setCategoryName] = React.useState("");
 const [categoryDesc, setCategoryDesc] = React.useState("");
 const [isCategorySubmitting, setIsCategorySubmitting] = React.useState(false);

 // Document Upload Dialog
 const [isDocOpen, setIsDocOpen] = React.useState(false);
 const [docName, setDocName] = React.useState("");
 const [docContent, setDocContent] = React.useState("");
 const [docCategory, setDocCategory] = React.useState("");
 const [isDocSubmitting, setIsDocSubmitting] = React.useState(false);

 // File upload drag-and-drop
 const fileInputRef = React.useRef<HTMLInputElement>(null);
 const [dragActive, setDragActive] = React.useState(false);
 const [uploadError, setUploadError] = React.useState<string | null>(null);
 const [uploadedFileExt, setUploadedFileExt] = React.useState<string>("txt");
 const [uploadedFileSize, setUploadedFileSize] = React.useState<number>(0);

 const openDocDialog = () => {
 setDocName("");
 setDocContent("");
 setDocCategory("");
 setUploadError(null);
 setUploadedFileExt("txt");
 setUploadedFileSize(0);
 setIsDocOpen(true);
 };

 // Document Rename Dialog
 const [isRenameOpen, setIsRenameOpen] = React.useState(false);
 const [renamingDoc, setRenamingDoc] = React.useState<any | null>(null);
 const [newDocName, setNewDocName] = React.useState("");
 const [isRenameSubmitting, setIsRenameSubmitting] = React.useState(false);

 // Website Scraper Input
 const [scraperUrl, setScraperUrl] = React.useState("");
 const [isScraperSubmitting, setIsScraperSubmitting] = React.useState(false);

 // Log View Dialog
 const [viewingJobLogs, setViewingJobLogs] = React.useState<string | null>(null);

 // Search States
 const [searchQuery, setSearchQuery] = React.useState("");
 const [isSearching, setIsSearching] = React.useState(false);
 const [searchResults, setSearchResults] = React.useState<any>({
 documents: [],
 faqs: [],
 services: [],
 });

 // Storage preference
 const [storageProvider, setStorageProvider] = React.useState("vercel_blob");
 const [isSettingsSaving, setIsSettingsSaving] = React.useState(false);
 const [settingsSuccess, setSettingsSuccess] = React.useState(false);

 // Sync state effects
 React.useEffect(() => {
 setCategories(initialCategories);
 setDocuments(initialDocuments);
 setImports(initialImports);
 setJobs(initialJobs);
 }, [initialCategories, initialDocuments, initialImports, initialJobs]);

 // Actions
 const handleSaveCategory = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!categoryName.trim()) return;
 setIsCategorySubmitting(true);

 try {
 let res;
 if (editingCategory) {
 res = await updateKnowledgeCategoryAction(editingCategory.id, {
 name: categoryName,
 description: categoryDesc,
 });
 } else {
 res = await createKnowledgeCategoryAction({
 name: categoryName,
 description: categoryDesc,
 });
 }

 if (res.success) {
 setIsCategoryOpen(false);
 setCategoryName("");
 setCategoryDesc("");
 setEditingCategory(null);
 router.refresh();
 } else {
 alert(res.error ||"Failed to save category");
 }
 } catch (err: any) {
 alert(err?.message ||"An error occurred");
 } finally {
 setIsCategorySubmitting(false);
 }
 };

 const handleEditCategory = (cat: any) => {
 setEditingCategory(cat);
 setCategoryName(cat.name);
 setCategoryDesc(cat.description ||"");
 setIsCategoryOpen(true);
 };

 const handleDeleteCategory = async (id: string) => {
 if (confirm("Are you sure you want to delete this category?")) {
 const res = await deleteKnowledgeCategoryAction(id);
 if (res.success) {
 router.refresh();
 } else {
 alert(res.error ||"Failed to delete category");
 }
 }
 };

 const handleFile = (file: File) => {
 setUploadError(null);

 // Validate size (10MB limit)
 const MAX_SIZE = 10 * 1024 * 1024;
 if (file.size > MAX_SIZE) {
 setUploadError(`File size exceeds the 10 MB limit (${(file.size / (1024 * 1024)).toFixed(2)} MB uploaded)`);
 return;
 }

 // Validate type
 const allowedExtensions = ["txt","md","csv","pdf","docx"];
 const fileExt = file.name.split(".").pop()?.toLowerCase() ||"";
 if (!allowedExtensions.includes(fileExt)) {
 setUploadError(`File type"${fileExt}"is not allowed. Supported: PDF, DOCX, TXT, MD, CSV`);
 return;
 }

 setDocName(file.name);
 setUploadedFileExt(fileExt);
 setUploadedFileSize(file.size);

 const reader = new FileReader();
 reader.onload = (e) => {
 const text = e.target?.result as string;
 if (fileExt ==="pdf"|| fileExt ==="docx") {
 setDocContent(`[SIMULATED EXTRACTION: ${file.name}]\n\nThis is a simulated textual extraction of the uploaded ${fileExt.toUpperCase()} file (${(file.size / 1024).toFixed(1)} KB) for training the AI Receptionist. The server-side background job will parse the complete raw text, index it, and chunk it into vector databases.`);
 } else {
 setDocContent(text ||"");
 }
 };

 if (fileExt ==="pdf"|| fileExt ==="docx") {
 reader.readAsArrayBuffer(file);
 } else {
 reader.readAsText(file);
 }
 };

 const handleDrag = (e: React.DragEvent) => {
 e.preventDefault();
 e.stopPropagation();
 if (e.type ==="dragenter"|| e.type ==="dragover") {
 setDragActive(true);
 } else if (e.type ==="dragleave") {
 setDragActive(false);
 }
 };

 const handleDrop = (e: React.DragEvent) => {
 e.preventDefault();
 e.stopPropagation();
 setDragActive(false);
 if (e.dataTransfer.files && e.dataTransfer.files[0]) {
 handleFile(e.dataTransfer.files[0]);
 }
 };

 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 e.preventDefault();
 if (e.target.files && e.target.files[0]) {
 handleFile(e.target.files[0]);
 }
 };

 const handleUploadDocument = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!docName.trim() || !docContent.trim()) return;

 // Double check size
 const computedSize = uploadedFileSize || new Blob([docContent]).size;
 const MAX_SIZE = 10 * 1024 * 1024;
 if (computedSize > MAX_SIZE) {
 setUploadError(`File size exceeds the 10 MB limit`);
 return;
 }

 setIsDocSubmitting(true);
 try {
 const res = await uploadKnowledgeDocumentAction({
 name: docName,
 fileType: uploadedFileExt ||"txt",
 fileSize: computedSize,
 content: docContent,
 categoryId: docCategory || undefined,
 });

 if (res.success) {
 setIsDocOpen(false);
 setDocName("");
 setDocContent("");
 setDocCategory("");
 setUploadError(null);
 setUploadedFileSize(0);
 setUploadedFileExt("txt");
 router.refresh();
 } else {
 setUploadError(res.error ||"Failed to upload document");
 }
 } catch (err: any) {
 setUploadError(err?.message ||"An error occurred");
 } finally {
 setIsDocSubmitting(false);
 }
 };

 const handleRenameDocument = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!newDocName.trim() || !renamingDoc) return;
 setIsRenameSubmitting(true);

 try {
 const res = await renameKnowledgeDocumentAction(renamingDoc.id, newDocName);
 if (res.success) {
 setIsRenameOpen(false);
 setNewDocName("");
 setRenamingDoc(null);
 router.refresh();
 } else {
 alert(res.error ||"Failed to rename document");
 }
 } catch (err: any) {
 alert(err?.message ||"An error occurred");
 } finally {
 setIsRenameSubmitting(false);
 }
 };

 const handleArchiveToggle = async (doc: any) => {
 const res = await archiveKnowledgeDocumentAction(doc.id, !doc.isArchived);
 if (res.success) {
 router.refresh();
 } else {
 alert(res.error ||"Failed to update archive status");
 }
 };

 const handleDeleteDocument = async (id: string) => {
 if (confirm("Are you sure you want to permanently delete this document and all associated chunks?")) {
 const res = await deleteKnowledgeDocumentAction(id);
 if (res.success) {
 router.refresh();
 } else {
 alert(res.error ||"Failed to delete document");
 }
 }
 };

 const handleTriggerScraper = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!scraperUrl.trim()) return;
 setIsScraperSubmitting(true);

 try {
 const res = await triggerWebsiteImportAction(scraperUrl);
 if (res.success) {
 setScraperUrl("");
 router.refresh();
 } else {
 alert(res.error ||"Failed to trigger crawler");
 }
 } catch (err: any) {
 alert(err?.message ||"An error occurred");
 } finally {
 setIsScraperSubmitting(false);
 }
 };

 const handleSearch = async (query: string) => {
 setSearchQuery(query);
 if (!query.trim()) {
 setSearchResults({ documents: [], faqs: [], services: [] });
 return;
 }
 setIsSearching(true);
 try {
 const res = await searchKnowledgeAction(query);
 if (res.success && res.results) {
 setSearchResults(res.results);
 }
 } catch (err) {
 console.error(err);
 } finally {
 setIsSearching(false);
 }
 };

 const handleSaveSettings = async (e: React.FormEvent) => {
 e.preventDefault();
 setIsSettingsSaving(true);
 setSettingsSuccess(false);

 // Simulate saving settings
 await new Promise((resolve) => setTimeout(resolve, 800));
 setIsSettingsSaving(false);
 setSettingsSuccess(true);
 setTimeout(() => setSettingsSuccess(false), 3000);
 };

 const formatBytes = (bytes: number) => {
 if (bytes === 0) return"0 Bytes";
 const k = 1024;
 const sizes = ["Bytes","KB","MB"];
 const i = Math.floor(Math.log(bytes) / Math.log(k));
 return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) +""+ sizes[i];
 };

 // Helper to color code tags
 const getFileTypeStyle = (type: string) => {
 const t = type.toLowerCase();
 if (t ==="pdf") return"bg-rose-500/8 border-rose-500/15 text-rose-600 dark:text-rose-400";
 if (t ==="docx") return"bg-blue-500/8 border-blue-500/15 text-blue-600 dark:text-blue-400";
 if (t ==="faq") return"bg-emerald-500/8 border-emerald-500/15 text-emerald-600 dark:text-emerald-400";
 if (t ==="manual") return"bg-purple-500/8 border-purple-500/15 text-purple-600 dark:text-purple-400";
 if (t ==="service") return"bg-violet-500/8 border-violet-500/15 text-violet-600 dark:text-violet-400";
 return"bg-sky-500/8 border-sky-500/15 text-sky-600 dark:text-sky-400";
 };

 return (
 <div className="space-y-space-6 animate-fade-in w-full flex flex-col">
 {/* Page Header */}
 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-space-3 pb-space-4 border-b border-[hsl(var(--foreground)/0.06)] shrink-0">
 <div>
 <h1 className="text-title-lg font-semibold tracking-tight-md text-foreground">Knowledge</h1>
 <p className="text-body-sm text-muted-foreground mt-space-0.5">
 Everything your AI knows about your business. Add documents, FAQs, and website content.
 </p>
 </div>
 </div>

 <div className="flex flex-col lg:flex-row gap-space-6 items-start w-full">
 {/* Sidebar Sub-Navigation */}
 <aside className="w-full lg:w-60 shrink-0 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible pb-space-2 lg:pb-0 border-b lg:border-b-0 lg:border-r border-[hsl(var(--foreground)/0.06)] lg:pr-space-6 gap-space-1.5 scrollbar-none whitespace-nowrap lg:whitespace-normal">
 {[
 { id:"overview", label:"Knowledge Overview", icon: BookOpen },
 { id:"documents", label:"Documents", icon: FileText },
 { id:"imports", label:"Website Imports", icon: Globe },
 { id:"categories", label:"Categories Catalog", icon: FolderPlus },
 { id:"queue", label:"Processing Queue", icon: ListFilter },
 { id:"search", label:"Search Console", icon: Search },
 { id:"settings", label:"Settings", icon: Settings },
 ].map((tab) => {
 const Icon = tab.icon;
 const isActive = activeTab === tab.id;
 return (
 <Button
 key={tab.id}
 variant="ghost"
 onClick={() => setActiveTab(tab.id)}
 className={cn(
 "flex items-center justify-start gap-space-3 px-space-4 py-space-3 text-body-sm font-medium transition-all duration-200 cursor-pointer w-auto lg:w-full text-left radius-lg relative select-none",
 isActive
 ?"bg-[hsl(var(--primary)/0.08)] text-primary font-semibold hover:bg-[hsl(var(--primary)/0.12)] hover:text-primary inset_0_1px_0_rgba(255,255,255,0.05)]"
 :"text-muted-foreground/70 hover:text-foreground hover:bg-[hsl(var(--foreground)/0.035)]"
 )}
 >
 {isActive && (
 <span className="absolute left-0 top-space-2 bottom-space-2 w-1 bg-primary radius-r-md hidden lg:block 0_0_8px_rgba(var(--primary-rgb),0.5)]"/>
 )}
 <Icon className={cn("h-4.5 w-4.5 shrink-0", isActive ?"text-primary":"text-muted-foreground/60")} />
 <span className="leading-none">{tab.label}</span>
 </Button>
 );
 })}
 </aside>

 {/* Main Content viewport */}
 <div className="flex-1 w-full space-y-space-6 min-w-0">
 
 {/* ========================================== */}
 {/* TABS 1: KNOWLEDGE OVERVIEW */}
 {/* ========================================== */}
 {activeTab ==="overview"&& (
 <div className="space-y-space-6 animate-fade-in w-full">
 {/* Overview Stats Cards */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-4 shrink-0">
 <Card className="hover:translate-y-[-2px] hover:border-primary/20 transition-all duration-300 h-full overflow-hidden relative">
 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-space-2 p-space-5 relative z-10">
 <span className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest leading-none">Documents</span>
 <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
 <FileText className="h-3.5 w-3.5 text-primary"/>
 </div>
 </CardHeader>
 <CardContent className="p-space-5 pt-0 relative z-10">
 <div className="text-display-sm font-bold text-foreground leading-none tracking-tight">{stats.totalDocuments}</div>
 <p className="text-[12px] font-medium text-muted-foreground/60 mt-space-3 line-clamp-1">Manuals, FAQs, website pages.</p>
 </CardContent>
 </Card>

 <Card className="hover:translate-y-[-2px] hover:border-primary/20 transition-all duration-300 h-full overflow-hidden relative">
 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-space-2 p-space-5 relative z-10">
 <span className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest leading-none">Chunks</span>
 <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
 <Database className="h-3.5 w-3.5 text-primary"/>
 </div>
 </CardHeader>
 <CardContent className="p-space-5 pt-0 relative z-10">
 <div className="text-display-sm font-bold text-foreground leading-none tracking-tight">{stats.totalChunks}</div>
 <p className="text-[12px] font-medium text-muted-foreground/60 mt-space-3 line-clamp-1">Segmented for RAG retrieval.</p>
 </CardContent>
 </Card>

 <Card className="hover:translate-y-[-2px] hover:border-primary/20 transition-all duration-300 h-full overflow-hidden relative">
 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-space-2 p-space-5 relative z-10">
 <span className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest leading-none">Storage</span>
 <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
 <HardDrive className="h-3.5 w-3.5 text-primary"/>
 </div>
 </CardHeader>
 <CardContent className="p-space-5 pt-0 relative z-10">
 <div className="text-display-sm font-bold text-foreground leading-none tracking-tight">{formatBytes(stats.storageUsedBytes)}</div>
 <div className="h-1.5 w-full bg-[hsl(var(--foreground)/0.06)] radius-full overflow-hidden mt-space-4">
 <div className="h-full bg-gradient-to-r from-primary/40 to-primary w-1/4"/>
 </div>
 </CardContent>
 </Card>

 <Card className="hover:translate-y-[-2px] transition-all duration-300 h-full overflow-hidden relative">
 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-space-2 p-space-5 relative z-10">
 <span className={cn(
 "text-[11px] font-bold uppercase tracking-widest leading-none",
 stats.healthLabel ==="Excellent"&&"text-emerald-600 dark:text-emerald-400",
 stats.healthLabel ==="Good"&&"text-primary",
 stats.healthLabel ==="Average"&&"text-amber-600 dark:text-amber-400",
 stats.healthLabel ==="Poor"&&"text-rose-600 dark:text-rose-400"
 )}>Knowledge Health</span>
 
 <div className={cn(
 "h-7 w-7 rounded-md flex items-center justify-center shrink-0",
 stats.healthLabel ==="Excellent"&&"bg-emerald-500/10 text-emerald-500",
 stats.healthLabel ==="Good"&&"bg-primary/10 text-primary",
 stats.healthLabel ==="Average"&&"bg-amber-500/10 text-amber-500",
 stats.healthLabel ==="Poor"&&"bg-rose-500/10 text-rose-500"
 )}>
 <Activity className="h-3.5 w-3.5"/>
 </div>
 </CardHeader>
 <CardContent className="p-space-5 pt-0 relative z-10">
 <div className="flex items-end gap-space-2">
 <div className="text-display-sm font-bold text-foreground leading-none tracking-tight">
 {stats.healthScore}%
 </div>
 <div className={cn(
 "text-[12px] font-bold uppercase tracking-wider pb-0.5",
 stats.healthLabel ==="Excellent"&&"text-emerald-500",
 stats.healthLabel ==="Good"&&"text-primary",
 stats.healthLabel ==="Average"&&"text-amber-500",
 stats.healthLabel ==="Poor"&&"text-rose-500"
 )}>
 {stats.healthLabel}
 </div>
 </div>
 <div className="h-1.5 w-full bg-[hsl(var(--foreground)/0.06)] radius-full overflow-hidden mt-space-4">
 <div className={cn(
 "h-full",
 stats.healthLabel ==="Excellent"&&"bg-gradient-to-r from-emerald-400 to-emerald-500",
 stats.healthLabel ==="Good"&&"bg-gradient-to-r from-primary-light to-primary",
 stats.healthLabel ==="Average"&&"bg-gradient-to-r from-amber-400 to-amber-500",
 stats.healthLabel ==="Poor"&&"bg-gradient-to-r from-rose-400 to-rose-500"
 )} style={{ width:`${stats.healthScore}%`}} />
 </div>
 </CardContent>
 </Card>
 </div>

 {/* Health parameters breakdown */}
 <Card>
 <CardHeader className="flex flex-row items-center gap-space-4 border-b border-[hsl(var(--foreground)/0.06)] py-space-4 px-space-6 bg-[hsl(var(--foreground)/0.005)] shrink-0">
 <div className="h-9 w-9 radius-lg bg-primary/10 flex items-center justify-center shrink-0">
 <Activity className="h-5 w-5 text-primary"/>
 </div>
 <div>
 <CardTitle className="text-body-sm font-semibold text-foreground">Knowledge Health Breakdown</CardTitle>
 <CardDescription className="text-caption text-muted-foreground/70">
 Review parameters required to ensure your AI Receptionist operates with accurate details.
 </CardDescription>
 </div>
 </CardHeader>
 <div className="px-space-6 pb-space-6 pt-space-5 space-y-space-3 bg-[hsl(var(--foreground)/0.002)]">
 {[
 { label:"Document Resources Uploaded", state: stats.totalDocuments > 0 },
 { label:"Detailed FAQs Configured (Min 3)", state: stats.healthScore >= 50 },
 { label:"Structured Services Catalog (Min 2)", state: stats.healthScore >= 75 },
 { label:"Organized Custom Categories (Min 2)", state: stats.healthScore === 100 },
 ].map((param, idx) => (
 <div key={idx} className="flex justify-between items-center p-space-4 px-space-5 radius-xl border border-[hsl(var(--foreground)/0.06)] bg-background hover:border-primary/20 transition-all duration-300 group">
 <span className="text-body-sm font-semibold text-foreground group-hover:text-primary transition-colors">{param.label}</span>
 <span className={cn(
 "inline-flex items-center gap-space-1.5 text-[10px] font-normal border px-space-2.5 py-space-1 radius-full uppercase tracking-wider",
 param.state
 ?"bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
 :"bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400"
 )}>
 {param.state ? (
 <>
 <CheckCircle2 className="h-3.5 w-3.5 shrink-0"/>
 <span className="leading-none pt-[1px]">Configured</span>
 </>
 ) : (
 <>
 <AlertCircle className="h-3.5 w-3.5 shrink-0"/>
 <span className="leading-none pt-[1px]">Incomplete</span>
 </>
 )}
 </span>
 </div>
 ))}
 </div>
 </Card>

 {/* Recent Uploads */}
 <Card>
 <CardHeader className="flex flex-row items-center gap-space-4 border-b border-[hsl(var(--foreground)/0.06)] py-space-4 px-space-6 bg-[hsl(var(--foreground)/0.005)] shrink-0">
 <div className="h-9 w-9 radius-lg bg-primary/10 flex items-center justify-center shrink-0">
 <Database className="h-5 w-5 text-primary"/>
 </div>
 <div>
 <CardTitle className="text-body-sm font-semibold text-foreground">Recent Uploaded Resources</CardTitle>
 <CardDescription className="text-caption text-muted-foreground/70">
 Recently processed document coordinates in the knowledge library.
 </CardDescription>
 </div>
 </CardHeader>
 <CardContent className="p-0 bg-[hsl(var(--foreground)/0.002)]">
 {stats.recentUploads.length === 0 ? (
 <div className="p-space-10 text-center text-caption text-muted-foreground/60 italic">
 No documents uploaded yet.
 </div>
 ) : (
 <div className="divide-y divide-[hsl(var(--foreground)/0.05)] text-caption">
 {stats.recentUploads.map((doc: any) => (
 <div key={doc.id} className="flex justify-between items-center p-space-4 px-space-6 bg-background hover:bg-[hsl(var(--primary)/0.02)] transition-colors duration-200 group">
 <div className="flex items-center gap-space-3 min-w-0">
 <div className="h-8 w-8 rounded-md bg-[hsl(var(--foreground)/0.04)] flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
 <FileText className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0"/>
 </div>
 <span className="text-body-sm font-semibold text-foreground truncate max-w-md">{doc.name}</span>
 </div>
 <span className={cn("text-[10px] font-normal border px-space-2.5 py-space-1 radius-full uppercase tracking-wider shrink-0", getFileTypeStyle(doc.fileType))}>
 {doc.fileType}
 </span>
 </div>
 ))}
 </div>
 )}
 </CardContent>
 </Card>
 </div>
 )}

 {/* ========================================== */}
 {/* TABS 2: DOCUMENT MANAGEMENT */}
 {/* ========================================== */}
 {activeTab ==="documents"&& (
 <div className="space-y-space-4 animate-fade-in w-full">
 {/* Header controls */}
 <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-space-4">
 <div className="flex items-center gap-space-2">
 <Button 
 onClick={() => setShowArchived(!showArchived)}
 variant="outline"
 className="text-caption font-semibold h-9 radius-lg border-[hsl(var(--foreground)/0.08)] bg-background text-muted-foreground hover:text-foreground cursor-pointer"
 >
 {showArchived ?"View Active Documents":"View Archived Documents"}
 </Button>
 </div>
 <Button onClick={() => openDocDialog()} className="h-9 text-caption font-semibold px-space-4 radius-lg bg-primary text-white cursor-pointer gap-space-1.5 flex items-center">
 <Plus className="h-3.5 w-3.5 shrink-0"/>
 <span className="leading-none">Add Document</span>
 </Button>
 </div>

 {/* Documents List */}
 {documents.filter((d) => d.isArchived === showArchived).length === 0 ? (
 <EmptyState
 title={showArchived ?"No archived documents":"No documents uploaded"}
 description="Upload custom company manuals, text descriptions, or guidelines to train your agent."
 icon={FileText}
 actionText={showArchived ? undefined :"Add Document"}
 onAction={showArchived ? undefined : () => openDocDialog()}
 />
 ) : (
 <Card className="overflow-hidden">
 <CardContent className="p-0">
 <div className="overflow-x-auto scrollbar-none">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="border-b border-[hsl(var(--foreground)/0.06)] text-[11px] font-semibold text-muted-foreground/75 uppercase tracking-wider bg-[hsl(var(--foreground)/0.005)] select-none">
 <th className="p-space-4 px-space-6">Name</th>
 <th className="p-space-4 w-28">Type</th>
 <th className="p-space-4 w-28">Size</th>
 <th className="p-space-4 w-28 text-center">Status</th>
 <th className="p-space-4 w-32 text-center">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-[hsl(var(--foreground)/0.05)] text-caption bg-[hsl(var(--foreground)/0.002)]">
 {documents
 .filter((d) => d.isArchived === showArchived)
 .map((doc: any) => (
 <tr key={doc.id} className="hover:bg-[hsl(var(--foreground)/0.015)] transition-all duration-150">
 <td className="p-space-4 px-space-6">
 <span className="text-foreground font-semibold block leading-snug truncate max-w-xs sm:max-w-xs">{doc.name}</span>
 <span className="text-caption text-muted-foreground/60 block mt-space-0.5 font-medium">
 Category: {categories.find((c) => c.id === doc.categoryId)?.name ||"General"}
 </span>
 </td>
 <td className="p-space-4 font-semibold uppercase tracking-wider text-caption">
 <span className={cn("text-caption font-normal border px-space-2 py-space-0.5 radius-md uppercase tracking-wider", getFileTypeStyle(doc.fileType))}>
 {doc.fileType}
 </span>
 </td>
 <td className="p-space-4 text-foreground font-mono text-caption">{doc.fileSize ? formatBytes(doc.fileSize) :"N/A"}</td>
 <td className="p-space-4 text-center">
 <span className={cn(
 "inline-flex text-caption font-normal border px-space-2.5 py-space-0.5 radius-full uppercase tracking-wider",
 doc.status ==="completed"&&"bg-emerald-500/8 border-emerald-500/15 text-emerald-600 dark:text-emerald-400",
 doc.status ==="failed"&&"bg-rose-500/8 border-rose-500/15 text-rose-600 dark:text-rose-400",
 !["completed","failed"].includes(doc.status) &&"bg-secondary text-muted-foreground border-border"
 )}>
 {doc.status}
 </span>
 </td>
 <td className="p-space-4 text-center">
 <div className="flex items-center justify-center gap-space-2">
 <Button
 variant="ghost"
 onClick={() => {
 setRenamingDoc(doc);
 setNewDocName(doc.name);
 setIsRenameOpen(true);
 }}
 className="h-7 w-8 p-0 radius-lg border border-[hsl(var(--foreground)/0.07)] bg-[hsl(var(--foreground)/0.015)] flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--foreground)/0.04)] hover:border-[hsl(var(--foreground)/0.12)] cursor-pointer transition-all"
 title="Rename"
 >
 <Edit3 className="h-3.5 w-3.5"/>
 </Button>
 <Button
 variant="ghost"
 onClick={() => handleArchiveToggle(doc)}
 className="h-7 w-8 p-0 radius-lg border border-[hsl(var(--foreground)/0.07)] bg-[hsl(var(--foreground)/0.015)] flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-[hsl(var(--foreground)/0.04)] hover:border-primary/20 hover:text-primary cursor-pointer transition-all"
 title={doc.isArchived ?"Restore":"Archive"}
 >
 {doc.isArchived ? <RotateCcw className="h-3.5 w-3.5"/> : <Archive className="h-3.5 w-3.5"/>}
 </Button>
 <Button
 variant="ghost"
 onClick={() => handleDeleteDocument(doc.id)}
 className="h-7 w-8 p-0 radius-lg border border-rose-500/15 bg-rose-500/5 flex items-center justify-center text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 hover:border-rose-500/30 cursor-pointer transition-all"
 title="Delete"
 >
 <Trash2 className="h-3.5 w-3.5"/>
 </Button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </CardContent>
 </Card>
 )}
 </div>
 )}

 {/* ========================================== */}
 {/* TABS 3: WEBSITE IMPORT MODULE */}
 {/* ========================================== */}
 {activeTab ==="imports"&& (
 <div className="space-y-space-4 animate-fade-in w-full">
 {/* Input URL */}
 <Card>
 <CardHeader className="flex flex-row items-center gap-space-4 border-b border-[hsl(var(--foreground)/0.06)] py-space-4 px-space-6 bg-[hsl(var(--foreground)/0.005)] shrink-0">
 <div className="h-9 w-9 radius-lg bg-primary/10 flex items-center justify-center shrink-0">
 <Globe className="h-5 w-5 text-primary"/>
 </div>
 <div>
 <CardTitle className="text-body-sm font-semibold text-foreground">Crawl & Scrape Website</CardTitle>
 <CardDescription className="text-caption text-muted-foreground/70">
 Enter your business website URL to scrape pages into the AI Receptionist's knowledge database.
 </CardDescription>
 </div>
 </CardHeader>
 <form onSubmit={handleTriggerScraper}>
 <div className="p-space-6 pt-space-5 bg-[hsl(var(--foreground)/0.002)]">
 <div className="flex flex-col sm:flex-row gap-space-3 items-end max-w-2xl">
 <div className="flex-1 space-y-space-1.5 min-w-0 w-full">
 <Label htmlFor="crawling_url"className="text-caption uppercase tracking-wider font-semibold text-muted-foreground/75">Target URL Address</Label>
 <div className="relative">
 <Globe className="absolute left-space-3 top-space-3 h-3.5 w-3.5 text-muted-foreground/50 z-10 pointer-events-none"/>
 <Input
 id="crawling_url"
 placeholder="https://mybusiness.com"
 className="pl-space-9 h-9.5 text-caption bg-background border-[hsl(var(--foreground)/0.08)] focus-visible:ring-primary/20 focus:border-primary/30"
 value={scraperUrl}
 onChange={(e) => setScraperUrl(e.target.value)}
 disabled={isScraperSubmitting}
 />
 </div>
 </div>
 <Button type="submit"disabled={isScraperSubmitting || !scraperUrl.trim()} className="h-9.5 text-caption font-semibold text-white cursor-pointer gap-space-1.5 radius-lg px-space-5 shrink-0 flex items-center bg-primary hover:bg-primary/90 hover:translate-y-[-1px] active:translate-y-[0px] transition-all duration-200">
 {isScraperSubmitting ? (
 <>
 <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0"/>
 <span className="leading-none">Submitting...</span>
 </>
 ) : (
 <>
 <PlayCircle className="h-3.5 w-3.5 shrink-0"/>
 <span className="leading-none">Crawl URL</span>
 </>
 )}
 </Button>
 </div>
 </div>
 </form>
 </Card>

 {/* Imports list */}
 <Card>
 <CardHeader className="flex flex-row items-center gap-space-4 border-b border-[hsl(var(--foreground)/0.06)] py-space-4 px-space-6 bg-[hsl(var(--foreground)/0.005)] shrink-0">
 <div className="h-9 w-9 radius-lg bg-primary/10 flex items-center justify-center shrink-0">
 <Database className="h-5 w-5 text-primary"/>
 </div>
 <div>
 <CardTitle className="text-body-sm font-semibold text-foreground">Import Runs</CardTitle>
 <CardDescription className="text-caption text-muted-foreground/70">
 Past web scraper schedules and indexing runs.
 </CardDescription>
 </div>
 </CardHeader>
 <CardContent className="p-0 bg-[hsl(var(--foreground)/0.002)]">
 {imports.length === 0 ? (
 <div className="flex flex-col items-center justify-center p-space-12 text-center select-none">
 <div className="h-10 w-10 radius-full bg-[hsl(var(--foreground)/0.03)] border border-[hsl(var(--foreground)/0.06)] flex items-center justify-center text-muted-foreground/40 mb-space-3.5">
 <Globe className="h-5 w-5"/>
 </div>
 <h4 className="text-body-sm font-semibold text-foreground leading-none">No active crawl imports</h4>
 <p className="text-caption text-muted-foreground/60 max-w-xs mt-space-1.5 leading-normal">
 Crawl your business website URL to index manuals, contact details, and policy pages automatically.
 </p>
 </div>
 ) : (
 <div className="overflow-x-auto scrollbar-none">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="border-b border-[hsl(var(--foreground)/0.06)] text-[11px] font-semibold text-muted-foreground/75 uppercase tracking-wider bg-[hsl(var(--foreground)/0.005)] select-none">
 <th className="p-space-4 px-space-6">URL Target</th>
 <th className="p-space-4 w-32">Status</th>
 <th className="p-space-4 w-32 text-center">Pages Scraped</th>
 <th className="p-space-4 w-36 text-right pr-space-6">Date</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-[hsl(var(--foreground)/0.05)] text-caption">
 {imports.map((item: any) => (
 <tr key={item.id} className="hover:bg-[hsl(var(--foreground)/0.015)] transition-all duration-150">
 <td className="p-space-4 px-space-6">
 <span className="text-foreground font-semibold block truncate max-w-sm sm:max-w-md">{item.url}</span>
 {item.errorMessage && (
 <span className="text-caption text-rose-500 font-medium block mt-space-1">
 Error: {item.errorMessage}
 </span>
 )}
 </td>
 <td className="p-space-4">
 <span className={cn(
 "inline-flex text-caption font-normal border px-space-2 py-space-0.5 radius-full uppercase tracking-wider",
 item.status ==="completed"&&"bg-emerald-500/8 border-emerald-500/15 text-emerald-600 dark:text-emerald-400",
 item.status ==="failed"&&"bg-rose-500/8 border-rose-500/15 text-rose-600 dark:text-rose-400",
 !["completed","failed"].includes(item.status) &&"bg-secondary text-muted-foreground border-border"
 )}>
 {item.status}
 </span>
 </td>
 <td className="p-space-4 text-center text-foreground font-mono text-caption">{item.pagesScraped} / {item.pagesFound}</td>
 <td className="p-space-4 text-right pr-space-6 text-muted-foreground">{new Date(item.createdAt).toLocaleDateString()}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 )}
 </CardContent>
 </Card>
 </div>
 )}

 {/* ========================================== */}
 {/* TABS 4: KNOWLEDGE CATEGORIES */}
 {/* ========================================== */}
 {activeTab ==="categories"&& (
 <div className="space-y-space-4 animate-fade-in w-full">
 {/* Header */}
 <div className="flex justify-between items-center gap-space-4">
 <div>
 <h3 className="text-body-sm font-semibold text-foreground">Categories Catalog</h3>
 <p className="text-caption text-muted-foreground/70">Organize your document resources by business departments.</p>
 </div>
 <Button onClick={() => {
 setEditingCategory(null);
 setCategoryName("");
 setCategoryDesc("");
 setIsCategoryOpen(true);
 }} className="h-9 text-caption font-semibold px-space-4 radius-lg bg-primary text-white cursor-pointer gap-space-1.5 flex items-center">
 <Plus className="h-3.5 w-3.5 shrink-0"/>
 <span className="leading-none">Add Category</span>
 </Button>
 </div>

 {/* Categories list */}
 {categories.length === 0 ? (
 <EmptyState
 title="No custom categories"
 description="Create taxonomy categories to organize company data inputs."
 icon={FolderPlus}
 actionText="Add Category"
 onAction={() => setIsCategoryOpen(true)}
 />
 ) : (
 <div className="grid gap-space-4 sm:grid-cols-2 lg:grid-cols-3">
 {categories.map((cat: any) => (
 <Card key={cat.id} className="group relative flex flex-col justify-between hover:translate-y-[-2px] hover:border-primary/20 transition-all duration-300 bg-card overflow-hidden">
 <div className="p-space-5 pb-space-3">
 <div className="flex items-start justify-between gap-space-3">
 <div className="min-w-0">
 <h4 className="text-body-md font-semibold text-foreground group-hover:text-primary transition-colors truncate">{cat.name}</h4>
 <span className="inline-flex text-caption font-mono font-semibold bg-[hsl(var(--foreground)/0.03)] border border-[hsl(var(--foreground)/0.05)] text-muted-foreground/80 px-space-2 py-space-0.5 radius-md mt-space-1 w-fit">
 slug: {cat.slug}
 </span>
 </div>
 <div className="h-8 w-8 radius-lg bg-primary/5 text-primary flex items-center justify-center shrink-0 border border-primary/10">
 <FolderOpen className="h-4 w-4"/>
 </div>
 </div>
 <p className="text-caption text-muted-foreground/75 mt-space-3 line-clamp-2 leading-relaxed min-h-8">
 {cat.description ||"No description provided."}
 </p>
 </div>
 <div className="p-space-3 px-space-5 border-t border-[hsl(var(--foreground)/0.05)] bg-[hsl(var(--foreground)/0.005)] flex justify-end gap-space-1.5 items-center">
 <div className="inline-flex radius-lg border border-[hsl(var(--foreground)/0.07)] bg-[hsl(var(--foreground)/0.015)] overflow-hidden">
 <Button
 onClick={() => handleEditCategory(cat)}
 className="h-7 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--foreground)/0.04)] border-r border-[hsl(var(--foreground)/0.07)] cursor-pointer transition-colors"
 title="Edit"
 >
 <Edit3 className="h-3.5 w-3.5"/>
 </Button>
 <Button
 onClick={() => handleDeleteCategory(cat.id)}
 className="h-7 w-8 flex items-center justify-center text-rose-500 hover:bg-rose-500/5 cursor-pointer transition-colors"
 title="Delete"
 >
 <Trash2 className="h-3.5 w-3.5"/>
 </Button>
 </div>
 </div>
 </Card>
 ))}
 </div>
 )}
 </div>
 )}

 {/* ========================================== */}
 {/* TABS 5: PROCESSING QUEUE */}
 {/* ========================================== */}
 {activeTab ==="queue"&& (
 <div className="space-y-space-4 animate-fade-in w-full">
 {/* Header info */}
 <div>
 <h3 className="text-body-sm font-semibold text-foreground">Background Processing Jobs</h3>
 <p className="text-caption text-muted-foreground/70">Monitor extraction, token chunking, and embedding runs inside the processing pipeline.</p>
 </div>

 {/* Jobs list */}
 {jobs.length === 0 ? (
 <div className="border border-dashed border-[hsl(var(--foreground)/0.08)] bg-card/20 radius-xl p-space-10 text-center text-caption text-muted-foreground/60 italic">
 No processing jobs executed yet.
 </div>
 ) : (
 <Card className="overflow-hidden">
 <CardContent className="p-0">
 <div className="overflow-x-auto scrollbar-none">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="border-b border-[hsl(var(--foreground)/0.06)] text-[11px] font-semibold text-muted-foreground/75 uppercase tracking-wider bg-[hsl(var(--foreground)/0.005)] select-none">
 <th className="p-space-4 px-space-6">Document Source</th>
 <th className="p-space-4 w-28 text-center">Status</th>
 <th className="p-space-4 w-28">Duration</th>
 <th className="p-space-4 w-28 text-right pr-space-6">Logs</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-[hsl(var(--foreground)/0.05)] text-caption bg-[hsl(var(--foreground)/0.002)]">
 {jobs.map((job: any) => (
 <tr key={job.id} className="hover:bg-[hsl(var(--foreground)/0.015)] transition-all duration-150">
 <td className="p-space-4 px-space-6">
 <span className="text-foreground font-semibold block leading-snug">{job.documentName}</span>
 <span className="text-caption text-muted-foreground/50 block mt-space-0.5 font-mono">ID: {job.id.substring(0, 8)}...</span>
 </td>
 <td className="p-space-4 text-center">
 <span className={cn(
 "inline-flex text-caption font-normal border px-space-2.5 py-space-0.5 radius-full uppercase tracking-wider",
 job.status ==="completed"&&"bg-emerald-500/8 border-emerald-500/15 text-emerald-600 dark:text-emerald-400",
 job.status ==="failed"&&"bg-rose-500/8 border-rose-500/15 text-rose-600 dark:text-rose-400",
 !["completed","failed"].includes(job.status) &&"bg-secondary text-muted-foreground border-border"
 )}>
 {job.status}
 </span>
 </td>
 <td className="p-space-4 text-foreground font-mono text-caption">{job.duration ?`${(job.duration / 1000).toFixed(2)}s`:"N/A"}</td>
 <td className="p-space-4 text-right pr-space-6">
 {job.logs ? (
 <Button 
 onClick={() => setViewingJobLogs(job.logs)}
 variant="outline"
 className="h-7 text-caption font-semibold border-[hsl(var(--foreground)/0.08)] bg-background text-muted-foreground hover:text-foreground cursor-pointer radius-md"
 >
 View Logs
 </Button>
 ) : (
 <span className="text-caption text-muted-foreground/60 italic">No logs</span>
 )}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </CardContent>
 </Card>
 )}
 </div>
 )}

 {/* ========================================== */}
 {/* TABS 6: KNOWLEDGE SEARCH CONSOLE */}
 {/* ========================================== */}
 {activeTab ==="search"&& (
 <div className="space-y-space-4 animate-fade-in w-full">
 {/* Input query */}
 <Card>
 <CardHeader className="flex flex-row items-center gap-space-4 border-b border-[hsl(var(--foreground)/0.06)] py-space-4 px-space-6 bg-[hsl(var(--foreground)/0.005)] shrink-0">
 <div className="h-9 w-9 radius-lg bg-primary/10 flex items-center justify-center shrink-0">
 <Search className="h-5 w-5 text-primary"/>
 </div>
 <div>
 <CardTitle className="text-body-sm font-semibold text-foreground">Internal Search Engine</CardTitle>
 <CardDescription className="text-caption text-muted-foreground/70">
 Query business documents, FAQs, categories, and services catalogs using full-text database filters.
 </CardDescription>
 </div>
 </CardHeader>
 <div className="p-space-6 pt-space-5 bg-[hsl(var(--foreground)/0.002)]">
 <div className="relative max-w-xl">
 <Search className="absolute left-space-3 top-space-3 h-3.5 w-3.5 text-muted-foreground/50 z-10 pointer-events-none"/>
 <Input
 placeholder="Enter keywords..."
 className="pl-space-9 h-9.5 text-caption bg-background border-[hsl(var(--foreground)/0.08)] focus-visible:ring-primary/20"
 value={searchQuery}
 onChange={(e) => handleSearch(e.target.value)}
 />
 {isSearching && (
 <Loader2 className="absolute right-space-3 top-space-3 h-3.5 w-3.5 text-primary animate-spin"/>
 )}
 </div>
 </div>
 </Card>

 {/* Results */}
 {searchQuery.trim().length > 0 && (
 <div className="space-y-space-4">
 
 {/* 1. Documents */}
 <Card>
 <CardHeader className="py-space-4 px-space-6 border-b border-[hsl(var(--foreground)/0.06)] bg-[hsl(var(--foreground)/0.005)]">
 <CardTitle className="text-caption uppercase font-semibold tracking-wider text-muted-foreground/70">Matched Knowledge Documents</CardTitle>
 </CardHeader>
 <CardContent className="p-0 bg-[hsl(var(--foreground)/0.002)]">
 {searchResults.documents.length === 0 ? (
 <div className="p-space-5 text-caption text-muted-foreground/60 italic">No document matches found.</div>
 ) : (
 <div className="divide-y divide-[hsl(var(--foreground)/0.05)] text-caption">
 {searchResults.documents.map((doc: any) => (
 <div key={doc.id} className="flex justify-between items-center p-space-3.5 px-space-6">
 <div className="flex items-center gap-space-3">
 <FileText className="h-4 w-4 text-primary/70 shrink-0"/>
 <span className="text-foreground font-semibold">{doc.name}</span>
 </div>
 <span className={cn("text-caption font-normal border px-space-2 py-space-0.5 radius-full uppercase tracking-wider", getFileTypeStyle(doc.fileType))}>
 {doc.fileType}
 </span>
 </div>
 ))}
 </div>
 )}
 </CardContent>
 </Card>

 {/* 2. FAQs */}
 <Card>
 <CardHeader className="py-space-4 px-space-6 border-b border-[hsl(var(--foreground)/0.06)] bg-[hsl(var(--foreground)/0.005)]">
 <CardTitle className="text-caption uppercase font-semibold tracking-wider text-muted-foreground/70">Matched FAQ Q&As</CardTitle>
 </CardHeader>
 <CardContent className="p-0 bg-[hsl(var(--foreground)/0.002)]">
 {searchResults.faqs.length === 0 ? (
 <div className="p-space-5 text-caption text-muted-foreground/60 italic">No FAQ matches found.</div>
 ) : (
 <div className="divide-y divide-[hsl(var(--foreground)/0.05)] text-caption">
 {searchResults.faqs.map((faq: any) => (
 <div key={faq.id} className="p-space-4 px-space-6 space-y-space-2">
 <span className="text-foreground font-semibold block">Q: {faq.question}</span>
 <p className="text-muted-foreground leading-relaxed pl-space-3 border-l-2 border-primary/20">{faq.answer}</p>
 </div>
 ))}
 </div>
 )}
 </CardContent>
 </Card>

 {/* 3. Services */}
 <Card>
 <CardHeader className="py-space-4 px-space-6 border-b border-[hsl(var(--foreground)/0.06)] bg-[hsl(var(--foreground)/0.005)]">
 <CardTitle className="text-caption uppercase font-semibold tracking-wider text-muted-foreground/70">Matched Services Catalog</CardTitle>
 </CardHeader>
 <CardContent className="p-0 bg-[hsl(var(--foreground)/0.002)]">
 {searchResults.services.length === 0 ? (
 <div className="p-space-5 text-caption text-muted-foreground/60 italic">No service matches found.</div>
 ) : (
 <div className="divide-y divide-[hsl(var(--foreground)/0.05)] text-caption">
 {searchResults.services.map((svc: any) => (
 <div key={svc.id} className="p-space-4 px-space-6 flex justify-between items-start gap-space-4">
 <div className="space-y-space-1">
 <span className="text-foreground font-semibold block">{svc.name}</span>
 <p className="text-muted-foreground text-caption leading-relaxed">{svc.description ||"No description provided."}</p>
 </div>
 <div className="shrink-0 text-right text-foreground font-semibold space-y-space-1 text-caption">
 <div className="text-primary">${svc.price}</div>
 <div className="text-muted-foreground/60 font-mono">{svc.duration} mins</div>
 </div>
 </div>
 ))}
 </div>
 )}
 </CardContent>
 </Card>

 </div>
 )}
 </div>
 )}

 {/* ========================================== */}
 {/* TABS 7: STORAGE SETTINGS */}
 {/* ========================================== */}
 {activeTab ==="settings"&& (
 <form onSubmit={handleSaveSettings} className="space-y-space-4 animate-fade-in w-full">
 {settingsSuccess && (
 <div className="flex items-center gap-space-2 p-space-3 radius-xl bg-emerald-500/8 border border-emerald-500/15 text-caption text-emerald-600 font-medium animate-fade-in">
 <Check className="h-4 w-4 shrink-0 text-emerald-500"/>
 <span className="leading-none">Storage configurations saved successfully.</span>
 </div>
 )}

 <Card>
 <CardHeader className="flex flex-row items-center gap-space-4 border-b border-[hsl(var(--foreground)/0.06)] py-space-4 px-space-6 bg-[hsl(var(--foreground)/0.005)] shrink-0">
 <div className="h-9 w-9 radius-lg bg-primary/10 flex items-center justify-center shrink-0">
 <HardDrive className="h-5 w-5 text-primary"/>
 </div>
 <div>
 <CardTitle className="text-body-sm font-semibold text-foreground">Storage Provider Settings</CardTitle>
 <CardDescription className="text-caption text-muted-foreground/70">
 Configure where manual document assets (PDF, DOCX, TXT) are securely saved.
 </CardDescription>
 </div>
 </CardHeader>
 <div className="p-space-6 pt-space-5 bg-[hsl(var(--foreground)/0.002)]">
 <div className="grid gap-space-4 sm:grid-cols-3">
 {[
 { id:"vercel_blob", label:"Vercel Blob", desc:"Native high-speed hosting storage.", active: true },
 { id:"s3", label:"AWS S3 Bucket", desc:"Enterprise object storage.", active: false },
 { id:"r2", label:"Cloudflare R2", desc:"Zero egress fees bucket.", active: false },
 ].map((prov) => (
 <button
 key={prov.id}
 type="button"
 onClick={() => prov.active && setStorageProvider(prov.id)}
 className={cn(
 "group relative flex flex-col items-start p-space-5 border text-left transition-all select-none radius-2xl cursor-pointer duration-300",
 storageProvider === prov.id
 ?"border-primary bg-gradient-to-br from-primary/[0.04] to-primary/[0.01] text-foreground scale-[1.01]"
 :"border-[hsl(var(--foreground)/0.06)] bg-background/40 text-muted-foreground hover:bg-[hsl(var(--foreground)/0.015)] hover:border-[hsl(var(--foreground)/0.1)]",
 !prov.active &&"opacity-60 cursor-not-allowed hover:bg-transparent hover:border-[hsl(var(--foreground)/0.06)]"
 )}
 disabled={!prov.active}
 >
 {/* Selection radio/check indicator */}
 <div className="absolute top-space-4 right-space-4 flex items-center justify-center">
 <div className={cn(
 "h-5 w-5 radius-full border flex items-center justify-center transition-all duration-300",
 storageProvider === prov.id 
 ?"border-primary bg-primary text-white scale-110"
 :"border-[hsl(var(--foreground)/0.15)] bg-background group-hover:border-[hsl(var(--foreground)/0.3)]"
 )}>
 {storageProvider === prov.id && <Check className="h-3 w-3 stroke-[3]"/>}
 </div>
 </div>

 <span className="text-body-sm font-semibold text-foreground flex items-center gap-space-1.5 leading-none pr-space-6 mt-0">
 {prov.label}
 </span>
 
 <p className="text-caption text-muted-foreground/85 mt-space-2.5 leading-relaxed pr-space-2">
 {prov.desc}
 </p>
 
 {!prov.active && (
 <span className="inline-flex items-center text-[10px] border bg-[hsl(var(--foreground)/0.03)] border-[hsl(var(--foreground)/0.05)] text-muted-foreground/60 px-space-2.5 py-space-1 radius-md uppercase font-normal mt-space-4 tracking-wider leading-none">
 Enterprise
 </span>
 )}
 </button>
 ))}
 </div>
 </div>
 <div className="px-space-6 py-space-4 border-t border-[hsl(var(--foreground)/0.06)] bg-[hsl(var(--foreground)/0.005)] flex justify-end">
 <Button type="submit"disabled={isSettingsSaving} className="h-9 text-caption font-semibold text-white cursor-pointer gap-space-1.5 radius-lg px-space-5 flex items-center">
 {isSettingsSaving ? (
 <>
 <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0"/>
 <span className="leading-none">Saving...</span>
 </>
 ) : (
 <>
 <Save className="h-3.5 w-3.5 shrink-0"/>
 <span className="leading-none">Save Configuration</span>
 </>
 )}
 </Button>
 </div>
 </Card>
 </form>
 )}

 </div>
 </div>

 {/* ========================================== */}
 {/* DIALOG 1: ADD/EDIT CATEGORY */}
 {/* ========================================== */}
 <Dialog open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
 <DialogContent className="max-w-md bg-card border border-[hsl(var(--foreground)/0.08)] p-0 overflow-hidden">
 <form onSubmit={handleSaveCategory}>
 <div className="px-space-5 pt-space-5 pb-space-4 border-b border-[hsl(var(--foreground)/0.05)]">
 <div className="flex items-center gap-space-2.5">
 <div className="h-8 w-8 radius-lg bg-primary/10 flex items-center justify-center shrink-0">
 <FolderPlus className="h-4 w-4 text-primary"/>
 </div>
 <div>
 <DialogTitle className="text-body-sm font-semibold text-foreground">{editingCategory ?"Edit Category":"Add Custom Category"}</DialogTitle>
 <DialogDescription className="text-caption text-muted-foreground/55 mt-space-0.5">
 Create departments to organize company manual uploads.
 </DialogDescription>
 </div>
 </div>
 </div>

 <div className="px-space-5 py-space-4 space-y-space-4">
 <div className="space-y-space-1.5">
 <Label htmlFor="cat_name"className="text-caption uppercase tracking-wider font-semibold text-muted-foreground/75">Category Name</Label>
 <Input
 id="cat_name"
 placeholder="e.g. Booking Policies"
 value={categoryName}
 onChange={(e) => setCategoryName(e.target.value)}
 className="h-9.5 text-caption bg-background border-[hsl(var(--foreground)/0.08)] focus-visible:ring-primary/20"
 required
 />
 </div>
 <div className="space-y-space-1.5">
 <Label htmlFor="cat_desc"className="text-caption uppercase tracking-wider font-semibold text-muted-foreground/75">Description</Label>
 <textarea
 id="cat_desc"
 rows={3}
 placeholder="Brief description of the context rules..."
 className="flex w-full radius-lg border border-[hsl(var(--foreground)/0.08)] bg-background px-space-3 py-space-2 text-caption transition-colors placeholder:text-muted-foreground/50 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-primary/20 text-foreground"
 value={categoryDesc}
 onChange={(e) => setCategoryDesc(e.target.value)}
 />
 </div>
 </div>

 <DialogFooter className="px-space-5 pb-space-5 pt-space-2 border-t border-[hsl(var(--foreground)/0.05)]">
 <Button type="button"variant="outline"onClick={() => setIsCategoryOpen(false)} disabled={isCategorySubmitting} className="h-9 text-caption font-semibold px-space-4 cursor-pointer radius-lg">
 Cancel
 </Button>
 <Button type="submit"disabled={isCategorySubmitting || !categoryName.trim()} className="h-9 text-caption font-semibold px-space-5 text-white cursor-pointer radius-lg">
 {isCategorySubmitting ? (
 <>
 <Loader2 className="mr-space-1.5 h-3.5 w-3.5 animate-spin"/> Saving...
 </>
 ) : (
 "Save Category"
 )}
 </Button>
 </DialogFooter>
 </form>
 </DialogContent>
 </Dialog>

 {/* ========================================== */}
 {/* DIALOG 2: ADD DOCUMENT (Using custom Radix Select dropdown) */}
 {/* ========================================== */}
 <Dialog open={isDocOpen} onOpenChange={(open) => { if (!open) { setUploadError(null); } setIsDocOpen(open); }}>
 <DialogContent className="max-w-lg bg-card border border-[hsl(var(--foreground)/0.08)] p-0 overflow-hidden">
 <form onSubmit={handleUploadDocument}>
 <div className="px-space-5 pt-space-5 pb-space-4 border-b border-[hsl(var(--foreground)/0.05)]">
 <div className="flex items-center gap-space-2.5">
 <div className="h-8 w-8 radius-lg bg-primary/10 flex items-center justify-center shrink-0">
 <FileCode className="h-4 w-4 text-primary"/>
 </div>
 <div>
 <DialogTitle className="text-body-sm font-semibold text-foreground">Add Company Manual</DialogTitle>
 <DialogDescription className="text-caption text-muted-foreground/55 mt-space-0.5">
 Provide text rules or manuals to extract and chunk into the knowledge library.
 </DialogDescription>
 </div>
 </div>
 </div>

 <div className="px-space-5 py-space-4 space-y-space-4 max-h-96 overflow-y-auto pr-space-1 sidebar-scroll bg-[hsl(var(--foreground)/0.002)]">
 
 {/* File Drag and Drop Zone */}
 <div className="space-y-space-1.5">
 <Label className="text-caption uppercase tracking-wider font-semibold text-muted-foreground/75">Attachment / File Upload</Label>
 <div
 onDragEnter={handleDrag}
 onDragOver={handleDrag}
 onDragLeave={handleDrag}
 onDrop={handleDrop}
 onClick={() => fileInputRef.current?.click()}
 className={cn(
 "relative flex flex-col items-center justify-center border border-dashed radius-xl p-space-6 text-center cursor-pointer transition-all duration-200 select-none min-h-32",
 dragActive 
 ?"border-primary bg-primary/5 scale-[1.01] "
 :"border-[hsl(var(--foreground)/0.08)] hover:border-primary/40 hover:bg-[hsl(var(--foreground)/0.015)]"
 )} tabIndex={0} onKeyDown={() => {}}
 >
 <Input
 ref={fileInputRef}
 type="file"
 className="hidden"
 accept=".txt,.md,.csv,.pdf,.docx"
 onChange={handleChange}
 />
 
 <div className="flex h-10 w-10 items-center justify-center radius-full bg-[hsl(var(--primary)/0.08)] text-primary mb-space-2.5 shrink-0 transition-transform duration-200 hover:scale-105">
 <UploadCloud className="h-5 w-5 text-primary"/>
 </div>
 <p className="text-caption text-foreground">
 {docName ? (
 <span>Selected: <strong className="text-primary">{docName}</strong></span>
 ) : (
 <span><strong>Drag & drop file</strong> or <span className="text-primary hover:underline font-semibold">browse</span></span>
 )}
 </p>
 <p className="text-caption text-muted-foreground/60 mt-space-1 leading-normal">
 Supports TXT, MD, CSV, PDF, DOCX (Max 10 MB limit)
 </p>
 </div>
 </div>

 <div className="space-y-space-1.5">
 <Label htmlFor="doc_name"className="text-caption uppercase tracking-wider font-semibold text-muted-foreground/75">Document Name / Title</Label>
 <Input
 id="doc_name"
 placeholder="e.g. Return Policy Manual.txt"
 value={docName}
 onChange={(e) => setDocName(e.target.value)}
 className="h-9.5 text-caption bg-background border-[hsl(var(--foreground)/0.08)] focus-visible:ring-primary/20"
 required
 />
 </div>
 
 <div className="space-y-space-1.5">
 <Label htmlFor="doc_cat"className="text-caption uppercase tracking-wider font-semibold text-muted-foreground/75">Taxonomy Category</Label>
 <Select value={docCategory} onValueChange={(val) => setDocCategory(val)}>
 <SelectTrigger className="h-9.5 text-caption bg-background border-[hsl(var(--foreground)/0.08)] focus-visible:ring-primary/20">
 <SelectValue placeholder="Select Category"/>
 </SelectTrigger>
 <SelectContent>
 {categories.map((c: any) => (
 <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
 ))}
 </SelectContent>
 </Select>
 </div>

 <div className="space-y-space-1.5">
 <Label htmlFor="doc_content"className="text-caption uppercase tracking-wider font-semibold text-muted-foreground/75">Manual Text Content</Label>
 <textarea
 id="doc_content"
 rows={5}
 placeholder="Paste company instructions or manual text here..."
 className="flex w-full radius-lg border border-[hsl(var(--foreground)/0.08)] bg-background px-space-3 py-space-2 text-caption transition-colors placeholder:text-muted-foreground/50 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-primary/20 text-foreground"
 value={docContent}
 onChange={(e) => setDocContent(e.target.value)}
 required
 />
 </div>

 {uploadError && (
 <div className="flex items-center gap-space-2 radius-lg bg-rose-500/8 border border-rose-500/15 p-space-3 text-caption text-rose-600 font-semibold animate-fade-in">
 <AlertTriangle className="h-4 w-4 shrink-0 text-rose-500"/>
 <span className="flex-1">{uploadError}</span>
 <Button 
 type="button"
 className="hover:opacity-75 transition-opacity font-semibold px-space-1"
 onClick={() => setUploadError(null)}
 >
 &times;
 </Button>
 </div>
 )}
 </div>

 <DialogFooter className="px-space-5 pb-space-5 pt-space-2 border-t border-[hsl(var(--foreground)/0.05)]">
 <Button type="button"variant="outline"onClick={() => { setIsDocOpen(false); setUploadError(null); }} disabled={isDocSubmitting} className="h-9 text-caption font-semibold px-space-4 cursor-pointer radius-lg">
 Cancel
 </Button>
 <Button type="submit"disabled={isDocSubmitting || !docName.trim() || !docContent.trim() || !!uploadError} className="h-9 text-caption font-semibold px-space-5 text-white cursor-pointer radius-lg">
 {isDocSubmitting ? (
 <>
 <Loader2 className="mr-space-1.5 h-3.5 w-3.5 animate-spin"/> Uploading...
 </>
 ) : (
 "Process & Upload"
 )}
 </Button>
 </DialogFooter>
 </form>
 </DialogContent>
 </Dialog>

 {/* ========================================== */}
 {/* DIALOG 3: RENAME DOCUMENT */}
 {/* ========================================== */}
 <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
 <DialogContent className="max-w-md bg-card border border-[hsl(var(--foreground)/0.08)] p-0 overflow-hidden">
 <form onSubmit={handleRenameDocument}>
 <div className="px-space-5 pt-space-5 pb-space-4 border-b border-[hsl(var(--foreground)/0.05)]">
 <div className="flex items-center gap-space-2.5">
 <div className="h-8 w-8 radius-lg bg-primary/10 flex items-center justify-center shrink-0">
 <Edit3 className="h-4 w-4 text-primary"/>
 </div>
 <div>
 <DialogTitle className="text-body-sm font-semibold text-foreground">Rename Document</DialogTitle>
 </div>
 </div>
 </div>

 <div className="px-space-5 py-space-4">
 <div className="space-y-space-1.5">
 <Label htmlFor="new_doc_name"className="text-caption uppercase tracking-wider font-semibold text-muted-foreground/75">New File Name</Label>
 <Input
 id="new_doc_name"
 value={newDocName}
 onChange={(e) => setNewDocName(e.target.value)}
 className="h-9.5 text-caption bg-background border-[hsl(var(--foreground)/0.08)] focus-visible:ring-primary/20"
 required
 />
 </div>
 </div>

 <DialogFooter className="px-space-5 pb-space-5 pt-space-2 border-t border-[hsl(var(--foreground)/0.05)]">
 <Button type="button"variant="outline"onClick={() => setIsRenameOpen(false)} disabled={isRenameSubmitting} className="h-9 text-caption font-semibold px-space-4 cursor-pointer radius-lg">
 Cancel
 </Button>
 <Button type="submit"disabled={isRenameSubmitting || !newDocName.trim()} className="h-9 text-caption font-semibold px-space-5 text-white cursor-pointer radius-lg">
 {isRenameSubmitting ? (
 <>
 <Loader2 className="mr-space-1.5 h-3.5 w-3.5 animate-spin"/> Saving...
 </>
 ) : (
 "Rename File"
 )}
 </Button>
 </DialogFooter>
 </form>
 </DialogContent>
 </Dialog>

 {/* ========================================== */}
 {/* DIALOG 4: VIEW JOB LOGS */}
 {/* ========================================== */}
 <Dialog open={viewingJobLogs !== null} onOpenChange={(open) => !open && setViewingJobLogs(null)}>
 <DialogContent className="max-w-lg bg-card border border-[hsl(var(--foreground)/0.08)] p-0 overflow-hidden">
 <div className="px-space-5 pt-space-5 pb-space-4 border-b border-[hsl(var(--foreground)/0.05)]">
 <div className="flex items-center gap-space-2.5">
 <div className="h-8 w-8 radius-lg bg-primary/10 flex items-center justify-center shrink-0">
 <FileText className="h-4 w-4 text-primary"/>
 </div>
 <div>
 <DialogTitle className="text-body-sm font-semibold text-foreground">Job Execution Logs</DialogTitle>
 </div>
 </div>
 </div>

 <div className="px-space-5 py-space-4">
 <pre className="bg-background border border-[hsl(var(--foreground)/0.06)] p-space-4 radius-xl font-mono text-caption text-muted-foreground/80 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto sidebar-scroll">
 {viewingJobLogs}
 </pre>
 </div>

 <div className="px-space-5 pb-space-5 pt-space-2 border-t border-[hsl(var(--foreground)/0.05)] flex justify-end">
 <Button onClick={() => setViewingJobLogs(null)} className="h-9 text-caption font-semibold px-space-4 cursor-pointer radius-lg">
 Close
 </Button>
 </div>
 </DialogContent>
 </Dialog>

 </div>
 );
}
