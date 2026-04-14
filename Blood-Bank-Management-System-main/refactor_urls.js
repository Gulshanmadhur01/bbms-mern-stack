import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.resolve(__dirname, 'frontend/src');
const configPath = path.resolve(__dirname, 'frontend/src/utils/apiConfig.js');

const walk = (dir) => {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else {
      if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
        results.push(fullPath);
      }
    }
  });
  return results;
};

const files = walk(srcDir);
let count = 0;

files.forEach(file => {
  if (file === configPath) return; 
  
  let content = fs.readFileSync(file, 'utf8');
  
  // Fix: Handle both original localhost URLs AND my partially broken refactored URLs
  const hasLocalhost = content.includes('http://localhost:5000/api');
  const hasBrokenRefactor = content.includes('"${API_BASE_URL}') || content.includes("'${API_BASE_URL}");

  if (hasLocalhost || hasBrokenRefactor) {
    // 1. Convert to correct template literal with backticks
    // Replace: "http://localhost:5000/api/..." -> `${API_BASE_URL}/...`
    content = content.replace(/(["'])http:\/\/localhost:5000\/api(.*?)\1/g, '`${API_BASE_URL}$2`');
    
    // Replace: "${API_BASE_URL}/..." -> `${API_BASE_URL}/...` (fixing my previous mistake)
    content = content.replace(/(["'])\$\{API_BASE_URL\}(.*?)\1/g, '`${API_BASE_URL}$2`');
    
    // 2. Add import if missing
    if (!content.includes('import API_BASE_URL')) {
      let relativePath = path.relative(path.dirname(file), configPath).replace(/\\/g, '/');
      if (!relativePath.startsWith('.')) relativePath = './' + relativePath;
      const importLine = `import API_BASE_URL from "${relativePath}";\n`;
      content = importLine + content;
    }
    
    fs.writeFileSync(file, content);
    console.log(`Fixed/Refactored: ${file}`);
    count++;
  }
});

console.log(`\n✅ Successfully fixed ${count} files!`);
