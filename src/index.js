const fs = require('fs');

function extractLinks(filePath, options) {
  return fs.promises.readFile(filePath, 'utf8').then((data) => {
    const regex = /\[([^[\]]*?)\]\((https?:\/\/[^\s?#.].[^\s]*)\)/gm;
    const captures = [...data.matchAll(regex)];
    const links = captures.map((capture) => ({
      text: capture[1],
      url: capture[2],
      file: filePath,
    }));

    return links;
  });
}

module.exports = { extractLinks };
