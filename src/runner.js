const { exec } = require('child_process');
const fs = require('fs');

async function runCode(code, lang) {
  const tempFile = `/tmp/temp_code.${getExtension(lang)}`;
  fs.writeFileSync(tempFile, code);

  return new Promise((resolve, reject) => {
    const command = `
      docker run --rm -v ${tempFile}:${tempFile} multi-lang-env /bin/bash -c "
      set -e
      ${getPackageInstallCommand(lang)}
      ${getRunCommand(lang, tempFile)}
      "
    `;
    
    exec(command, (err, stdout, stderr) => {
      fs.unlinkSync(tempFile);
      if (err) return reject(err);
      if (stderr) return reject(new Error(stderr));
      resolve(stdout);
    });
  });
}

// Language file extensions
function getExtension(lang) {
  switch(lang.toLowerCase()) {
    case 'python': return 'py';
    case 'java': return 'java';
    case 'cpp': return 'cpp';
    case 'c': return 'c';
    case 'javascript': return 'js';
    case 'swift': return 'swift';
    default: return 'txt';
  }
}

// Language-specific run commands
function getRunCommand(lang, filePath) {
  switch(lang.toLowerCase()) {
    case 'python': return `python3 ${filePath}`;
    case 'java': return `javac ${filePath} && java ${filePath.replace('.java','')}`;
    case 'cpp': return `g++ ${filePath} -o /tmp/a.out && /tmp/a.out`;
    case 'c': return `gcc ${filePath} -o /tmp/a.out && /tmp/a.out`;
    case 'javascript': return `node ${filePath}`;
    case 'swift': return `swift ${filePath}`;
    default: return `cat ${filePath}`;
  }
}

// Language-specific package installation (if needed)
function getPackageInstallCommand(lang) {
  switch(lang.toLowerCase()) {
    case 'python': return `apt-get update && apt-get install -y python3 python3-pip >/dev/null 2>&1`;
    case 'java': return `apt-get update && apt-get install -y openjdk-17-jdk >/dev/null 2>&1`;
    case 'cpp': 
    case 'c': return `apt-get update && apt-get install -y build-essential gcc g++ >/dev/null 2>&1`;
    case 'javascript': return `apt-get update && apt-get install -y nodejs npm >/dev/null 2>&1`;
    case 'swift': return `apt-get update && apt-get install -y swift >/dev/null 2>&1`;
    default: return '';
  }
}

module.exports = { runCode };