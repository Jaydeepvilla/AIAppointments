const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(file => {
        let filepath = path.join(dir, file);
        if (fs.statSync(filepath).isDirectory()) {
            walk(filepath, callback);
        } else {
            callback(filepath);
        }
    });
}

walk('src', (filepath) => {
    if (!filepath.endsWith('.tsx') && !filepath.endsWith('.ts') && !filepath.endsWith('.css')) return;
    
    let original = fs.readFileSync(filepath, 'utf8');
    let content = original;
    
    if (content.includes('dark:')) {
        // Specific replacements
        content = content.replace(/bg-white dark:bg-card/g, 'bg-card');
        content = content.replace(/bg-white dark:bg-zinc-900\/30/g, 'bg-[hsl(var(--background))]');
        content = content.replace(/bg-slate-50\/20 dark:bg-transparent/g, 'bg-[hsl(var(--foreground)\/0.05)]');
        content = content.replace(/bg-slate-50\/10 dark:bg-transparent/g, 'bg-[hsl(var(--foreground)\/0.02)]');
        content = content.replace(/bg-[#0A0E17] dark:bg-white/g, 'bg-foreground');
        content = content.replace(/text-white dark:text-black/g, 'text-background');
        content = content.replace(/bg-neutral-50\/50 dark:bg-neutral-900\/30/g, 'bg-[hsl(var(--foreground)\/0.03)]');
        content = content.replace(/bg-neutral-900 text-neutral-300 dark:bg-black\/40/g, 'bg-[hsl(var(--foreground)\/0.05)] text-[hsl(var(--foreground)\/0.8)]');
        
        // Color specific text and bg
        content = content.replace(/text-emerald-600 dark:text-emerald-400/g, 'text-emerald-500');
        content = content.replace(/text-amber-600 dark:text-amber-400/g, 'text-amber-500');
        content = content.replace(/text-rose-600 dark:text-rose-400/g, 'text-rose-500');
        content = content.replace(/text-indigo-600 dark:text-indigo-400/g, 'text-indigo-500');
        content = content.replace(/text-blue-600 dark:text-blue-400/g, 'text-blue-500');
        content = content.replace(/text-purple-600 dark:text-purple-400/g, 'text-purple-500');
        content = content.replace(/text-sky-600 dark:text-sky-400/g, 'text-sky-500');
        content = content.replace(/text-violet-600 dark:text-violet-400/g, 'text-violet-500');
        content = content.replace(/text-emerald-600 dark:text-emerald-500/g, 'text-emerald-500');

        content = content.replace(/bg-primary-50 dark:bg-primary-950\/30 text-primary-600 dark:text-primary-400/g, 'bg-primary/10 text-primary');
        content = content.replace(/bg-background\/50 dark:bg-background\/25/g, 'bg-background/80');

        // General removal of any other dark: classes
        content = content.replace(/dark:[^\s"'\`]+/g, '');

        // Cleanup multiple spaces
        content = content.replace(/ +/g, ' ');

        if (original !== content) {
            fs.writeFileSync(filepath, content, 'utf8');
            console.log('Updated:', filepath);
        }
    }
});
