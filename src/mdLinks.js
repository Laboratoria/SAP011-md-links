const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

function normalizeURL(url) {
  if (!url.startsWith('http')) {
    return 'http://' + url;
  }
  return url;
}

function validateLink(link) {
  return new Promise((resolve) => {
    const protocol = link.href.startsWith('https') ? https : http;
    const requestOptions = {
      method: 'HEAD', 
      timeout: 5000,  
    };

    protocol
      .request(link.href, requestOptions, (res) => {
        const { statusCode } = res;

        if (statusCode >= 200 && statusCode < 400) {
          resolve({ ...link, status: statusCode, ok: 'ok' });
        } else {
          resolve({ ...link, status: statusCode, ok: 'fail' });
        }
      })
      .on('error', () => {
        resolve({ ...link, status: 'N/A', ok: 'fail' });
      })
      .end();
  });
}

function mdLinks(filePath, options) {
  return new Promise((resolve, reject) => {
    readMarkdownFile(filePath)
      .then((data) => {
        const links = [];
        const regex = /\[([^\]]+)]\((http[s]?:\/\/[^\)]+)\)/g;
        let match;
        while ((match = regex.exec(data)) !== null) {
          const text = match[1];
          const href = match[2];
          links.push({ text, href, file: filePath });
        }

        if (options && options.validate) {
          const linkPromises = links.map(validateLink);
          Promise.all(linkPromises)
            .then((validatedLinks) => {
              resolve(validatedLinks);
            });
        } else {
          resolve(links);
        }
      })
      .catch((error) => {
        reject(error);
      });
  }).then((links) => {
    if (options && options.stats) {
      const uniqueLinks = Array.from(new Set(links.map((link) => link.href)));
      const stats = {
        total: links.length,
        unique: uniqueLinks.length,
        broken: links.filter((link) => link.ok === 'fail').length,
      };
      return stats;
    }
    return links;
  });
}
function readMarkdownFile(filePath) {
  return new Promise((resolve, reject) => {
    // Verifica se o arquivo tem extensão .md
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
  mdLinks,
  readMarkdownFile,
  validateLink,
  normalizeURL,
};
