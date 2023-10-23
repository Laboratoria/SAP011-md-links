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

function validate(link) {
  return new Promise((resolve) => {
    const protocol = link.href.startsWith('https') ? https : http;
    const requestOptions = {
      method: 'HEAD',
    };

    protocol
      .request(link.href, requestOptions, (res) => {
        const { statusCode } = res;

        if (statusCode >= 200 && statusCode < 400) {
          resolve({ ...link, status: statusCode, ok: 'PASS' });
        } else {
          resolve({ ...link, status: statusCode, ok: 'ERROR' });
        }
      })
      .on('error', () => {
        resolve({ ...link, status: 'FAIL', ok: 'FAIL' });
      })
      .end();
  });
}

function readFiles(filePath) {
  return new Promise((resolve, reject) => {
    // Verifica se o arquivo tem extensão .md
    if (path.extname(filePath) !== '.md') {
      reject(new Error('Error! File or directory not defined'));
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

function mdLinks(filePath, options) {
  return new Promise((resolve, reject) => {
    readFiles(filePath)
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
          const linkPromises = links.map(validate);
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
        broken: links.filter((link) => link.ok === 'FAIL').length,
      };
      return stats;
    }
    return links;
  });
}

module.exports = {
  mdLinks,
  readFiles,
  validate,
  normalizeURL
};
