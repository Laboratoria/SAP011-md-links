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


module.exports = {
  validateLink,
  normalizeURL,
};
