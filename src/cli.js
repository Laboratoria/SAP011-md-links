#!/usr/bin/env node
const chalk = require('chalk');
const { mdLinks } = require('./mdLinks.js');

const filePath = process.argv[2];
const options = {
  validate: process.argv.includes('--validate'),
  stats: process.argv.includes('--stats'),
};

mdLinks(filePath, options)
  .then((result) => {
    if (options.stats) {
      console.log(chalk.yellow(`Total: ${result.total}`));
      console.log(chalk.yellow(`Unique: ${result.unique}`));
      if (options.validate) {
        if (result.broken > 0) {
          console.log(chalk.red(`Broken: ${result.broken}`));
        }
      }
    } else {
      result.forEach((link) => {
        let output = `${chalk.black(link.file)} ${chalk.underline(link.href)} ${chalk.yellow(link.text)}`;
        if (options.validate) {
          if (link.ok === 'PASS') {
            output += ` ${chalk.bgGreen(link.ok)}`;
          } else {
            output += ` ${chalk.bgRed(link.status)}`;
          }
          //output += ` ${chalk.dim(link.status)}`;
        }
        console.log(output);
      });
    }
  })
  .catch((error) => {
    console.error(chalk.red(error.message));
  });
