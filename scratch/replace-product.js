const fs = require('fs');
const path = 'src/components/marketing/visualizations/product-simulation.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/bg-zinc-100\/60 border-b border-zinc-200\/80 dark:bg-zinc-950 dark:border-zinc-800\/80/g, 'bg-[hsl(var(--background)\/0.8)] border-b border-[hsl(var(--foreground)\/0.1)]');
content = content.replace(/bg-zinc-50\/50 dark:bg-zinc-950/g, 'bg-[hsl(var(--background)\/0.8)]');
content = content.replace(/border-zinc-200\/60 dark:border-zinc-800\/60/g, 'border-[hsl(var(--foreground)\/0.1)]');
content = content.replace(/text-purple-600 dark:text-purple-400/g, 'text-purple-500');
content = content.replace(/text-zinc-700 dark:text-zinc-300/g, 'text-[hsl(var(--foreground)\/0.8)]');
content = content.replace(/text-zinc-400 dark:text-zinc-500/g, 'text-[hsl(var(--foreground)\/0.5)]');
content = content.replace(/bg-white border border-zinc-200\/60 text-zinc-800 rounded-tl-none dark:bg-zinc-900\/60 dark:border-zinc-850 dark:text-zinc-200/g, 'bg-card border border-[hsl(var(--foreground)\/0.1)] text-foreground rounded-tl-none');
content = content.replace(/bg-purple-50 border border-purple-200 text-purple-600 animate-pulse rounded-tr-none dark:bg-purple-950\/20 dark:border-purple-500\/20 dark:text-purple-400/g, 'bg-purple-500/10 border border-purple-500/20 text-purple-500 animate-pulse rounded-tr-none');
content = content.replace(/from-purple-600 to-indigo-600 dark:from-purple-500 dark:to-indigo-500/g, 'from-purple-500 to-indigo-500');
content = content.replace(/bg-zinc-50\/30 dark:bg-zinc-900\/60/g, 'bg-[hsl(var(--foreground)\/0.03)]');
content = content.replace(/border-zinc-200\/80 dark:border-zinc-800\/80/g, 'border-[hsl(var(--foreground)\/0.1)]');
content = content.replace(/text-zinc-500 dark:text-zinc-400/g, 'text-[hsl(var(--foreground)\/0.6)]');
content = content.replace(/border border-zinc-200\/60 bg-white dark:border-zinc-800\/80 dark:bg-zinc-900\/30/g, 'border border-[hsl(var(--foreground)\/0.1)] bg-[hsl(var(--background))]');
content = content.replace(/text-zinc-800 dark:text-zinc-200/g, 'text-[hsl(var(--foreground))]');
content = content.replace(/text-zinc-450 dark:text-zinc-500/g, 'text-[hsl(var(--foreground)\/0.55)]');
content = content.replace(/text-emerald-600 bg-emerald-50 border-emerald-250 dark:bg-emerald-500\/10 dark:border-emerald-500\/20 dark:text-emerald-400/g, 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20');
content = content.replace(/text-purple-600 bg-purple-50 border-purple-250 dark:bg-purple-500\/10 dark:border-purple-500\/20 dark:text-purple-400/g, 'text-purple-500 bg-purple-500/10 border-purple-500/20');
content = content.replace(/text-blue-600 bg-blue-50 border-blue-250 dark:bg-blue-500\/10 dark:border-blue-500\/20 dark:text-blue-400/g, 'text-blue-500 bg-blue-500/10 border-blue-500/20');
content = content.replace(/text-zinc-850 dark:text-zinc-100/g, 'text-[hsl(var(--foreground))]');
content = content.replace(/text-emerald-600 dark:text-emerald-400/g, 'text-emerald-500');
content = content.replace(/bg-white overflow-hidden mb-space-6 dark:border-zinc-800\/80 dark:bg-zinc-950/g, 'bg-[hsl(var(--background))] overflow-hidden mb-space-6');
content = content.replace(/bg-zinc-200\/60 dark:bg-zinc-800\/60/g, 'bg-[hsl(var(--foreground)\/0.1)]');

fs.writeFileSync(path, content, 'utf8');
console.log('Done with product-simulation.tsx');
