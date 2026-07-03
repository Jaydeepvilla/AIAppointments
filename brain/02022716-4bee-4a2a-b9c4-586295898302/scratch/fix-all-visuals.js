const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('src/components', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Spacing
    const regex = /\b([pmtblrxy]|px|py|mx|my|mt|mb|ml|mr|pt|pb|pl|pr|gap|gap-x|gap-y|top|bottom|left|right|inset|inset-x|inset-y)-(\d+(\.\d+)?)\b/g;
    content = content.replace(regex, (match, prefix, num) => {
        // Exclude specific standard tokens that might not be spaces or don't need translation if desired. But doctor complains about all of them.
        return `${prefix}-space-${num}`;
    });

    const negativeRegex = /\B-([mtblrxy]|mx|my|top|bottom|left|right|inset|inset-x|inset-y)-(\d+(\.\d+)?)\b/g;
    content = content.replace(negativeRegex, (match, prefix, num) => {
        return `-${prefix}-space-${num}`;
    });

    // Typography
    content = content.replace(/\btext-\[9px\]\b/g, 'text-caption');
    content = content.replace(/\btext-\[10px\]\b/g, 'text-caption');
    content = content.replace(/\btext-\[11px\]\b/g, 'text-caption');
    content = content.replace(/\btext-\[12px\]\b/g, 'text-caption');
    content = content.replace(/\btext-\[13px\]\b/g, 'text-body-sm');
    content = content.replace(/\btext-\[14px\]\b/g, 'text-body-sm');
    content = content.replace(/\btext-\[15px\]\b/g, 'text-body-base');
    
    // Hardcoded max/min sizes
    content = content.replace(/\bmax-h-\[500px\]\b/g, 'max-h-md');
    content = content.replace(/\bmax-h-\[550px\]\b/g, 'max-h-lg');

    // Radius
    content = content.replace(/\bradius-full\b/g, 'radius-md');

    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log('Modified', filePath);
    }
  }
});
