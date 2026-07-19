const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/components/dashboard/widgets');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('"use client"')) {
    // Remove all existing "use client" directives
    content = content.replace(/"use client";\s*/g, '');
    content = content.replace(/'use client';\s*/g, '');
    content = content.replace(/"use client"\s*/g, '');
    
    // Also fix the double semicolon we saw
    content = content.replace(/;;\s*/g, ';\n');
    
    // Add it to the very top
    content = '"use client";\n\n' + content;
    
    fs.writeFileSync(filePath, content);
    console.log(`Fixed ${file}`);
  }
}
