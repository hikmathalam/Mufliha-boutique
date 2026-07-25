const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const getFiles = (dir, files_ = []) => {
  const files = fs.readdirSync(dir);
  for (const i in files) {
    const name = path.join(dir, files[i]);
    if (fs.statSync(name).isDirectory()) {
      if (!name.includes('node_modules') && !name.includes('.git')) {
        getFiles(name, files_);
      }
    } else {
      if (name.endsWith('.js')) {
        files_.push(name);
      }
    }
  }
  return files_;
};

const checkSyntax = () => {
  console.log('Scanning backend directory for JavaScript files...');
  const files = getFiles(__dirname);
  let errorCount = 0;

  files.forEach((file) => {
    try {
      execSync(`node --check "${file}"`);
      console.log(`✅ OK: ${path.relative(__dirname, file)}`);
    } catch (err) {
      console.error(`❌ Syntax Error in ${path.relative(__dirname, file)}:\n`, err.message);
      errorCount++;
    }
  });

  console.log(`\nScan complete. Total errors found: ${errorCount}`);
  process.exit(errorCount > 0 ? 1 : 0);
};

checkSyntax();
