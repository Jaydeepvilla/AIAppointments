const fs = require('fs');
const path = require('path');

const rulesDir = path.join(__dirname, 'scripts', 'doctor', 'rules');
const files = fs.readdirSync(rulesDir).filter(f => f.endsWith('.ts'));

for (const file of files) {
  const filePath = path.join(rulesDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Find instances of double commas or comma-whitespace-comma before severity
  let changed = false;
  const newContent = content.replace(/,(\s*), severity/g, (match, whitespace) => {
    changed = true;
    return `,${whitespace}severity`;
  });

  if (changed) {
    fs.writeFileSync(filePath, newContent);
    console.log(`Fixed ${file}`);
  }
}
