const fs = require('fs');
const path = require('path');

function cleanDeclarations(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      cleanDeclarations(filePath);
    } else if (file.endsWith('.d.ts')) {
      let content = fs.readFileSync(filePath, 'utf8');

      // Remove webpack artifacts
      content = content.replace(/__webpack_require__\.\$Refresh\$\.runtime = require\([^)]+\);/g, '');
      content = content.replace(/\/\*[\s\S]*?\*\//g, ''); // Remove block comments
      content = content.replace(/^\s*\/\/.*$/gm, ''); // Remove single line comments
      content = content.replace(/\n\s*\n\s*\n/g, '\n\n'); // Remove excessive newlines

      fs.writeFileSync(filePath, content.trim() + '\n');
    }
  });
}

// Clean the dist directory
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  cleanDeclarations(distPath);
  console.log('✅ Declaration files cleaned successfully');
} else {
  console.log('❌ Dist directory not found');
}