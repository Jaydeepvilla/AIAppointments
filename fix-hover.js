const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/components/dashboard/widgets');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('<m.div {...hoverScale}>')) {
    content = content.replace(/<m\.div \{\.\.\.hoverScale\}>/g, '<m.div whileHover={hoverScale}>');
    fs.writeFileSync(filePath, content);
    console.log(`Fixed hoverScale in ${file}`);
  }
}
