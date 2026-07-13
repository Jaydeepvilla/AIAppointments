const fs = require('fs');

const filepath = 'src/components/marketing/visualizations/dashboard-preview.tsx';
const content = fs.readFileSync(filepath, 'utf8');

// Broad regex that focuses on the mapping section
const pattern = /\{\/\*\s*Premium Sidebar Navigation\s*\*\/\}\s*<div className="space-y-space-1\.5">[\s\S]*?BarChart3\s*\}\s*\]\.\s*map[\s\S]*?<\/Button>\);\s*\}\)\s*<\/div>/;

const replacement = `{/* Premium Sidebar Navigation */}
  <Tabs value={activeTab} onValueChange={(val: any) => setActiveTab(val)} variant="default" orientation="vertical" className="w-full">
  <TabsList className="w-full flex flex-col gap-space-1.5 bg-transparent border-none">
  {[
               { id: "calls", label: "Voice Inbox", icon: Inbox, badge: "12" },
               { id: "chats", label: "Text Inbox", icon: MessageSquare },
               { id: "calendar", label: "Calendar Hub", icon: Calendar },
               { id: "analytics", label: "Analytics Portal", icon: BarChart3 }].
               map((item) => {
                 const isActive = activeTab === item.id;
                 const Icon = item.icon;
                 return (
                   <TabsTrigger key={item.id} value={item.id}
                   className="w-full flex items-center justify-center xl:justify-between px-space-3 xl:px-space-4 py-space-2.5 xl:py-space-3 radius-md text-caption font-normal transition-all duration-300 group relative overflow-hidden border-none"
                   >
                     
  {isActive &&
                     <>
  <div className="absolute inset-space-0 bg-gradient-to-r from-primary/20 to-transparent dark:from-primary/15" />
  <div className="absolute left-space-0 top-space-1/4 bottom-space-1/4 w-1 bg-primary radius-md 0_0_8px_rgba(99,102,241,0.6)]" />
  </>
                     }
  <div className="flex items-center gap-space-3 relative z-10">
  <Icon className={\`h-4.5 w-4.5 shrink-0 transition-transform duration-300 \${isActive ? "scale-110" : "group-hover:translate-x-space-1"}\`} />
  <span className="hidden xl:inline tracking-wide">{item.label}</span>
  </div>
  {item.badge &&
                     <span className="hidden xl:inline-block px-space-2 py-space-0.5 radius-md text-[10px] font-mono leading-none font-bold relative z-10 transition-colors bg-black/10 dark:bg-white/10 text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                     >
  {item.badge}
  </span>
                     }
  </TabsTrigger>);

               })}
  </TabsList>
  </Tabs>`;

if (pattern.test(content)) {
  const updated = content.replace(pattern, replacement);
  fs.writeFileSync(filepath, updated, 'utf8');
  console.log('✓ Success: Refactored dashboard-preview.tsx vertical tabs');
} else {
  console.log('✗ Failed to match dashboard-preview.tsx target block');
}
