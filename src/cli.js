#!/usr/bin/env  node
// const chalk = require('chalk');
// console.log(chalk.red('Hello world!'));

const { extractLinks } = require('./index');

const filePath = process.argv[2];
// console.log('Caminho do arquivo:', filePath);

extractLinks(filePath).then((links) => {
  console.log(links);
});
