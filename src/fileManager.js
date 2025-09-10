const fs = require('fs');
const path = require('path');

function createFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf-8');
}

function deleteFile(filePath) {
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}

function readFile(filePath) {
  if (!fs.existsSync(filePath)) throw new Error('File does not exist');
  return fs.readFileSync(filePath, 'utf-8');
}

module.exports = { createFile, deleteFile, readFile };