const fs = require('fs');
const path = require('path');

function readMarkdownFile(filePath) {
  return new Promise((resolve, reject) => {
    // Verifique se o arquivo tem extensão .md
    if (path.extname(filePath) !== '.md') {
      reject(new Error('O arquivo fornecido não é .md'));
    } else {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    }
  });
}

module.exports = {
  readMarkdownFile,
};


