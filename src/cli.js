#!/usr/bin/env	node
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
      console.log(chalk.green(`Total: ${result.total}`));
      console.log(chalk.green(`Unique: ${result.unique}`));
      if (options.validate) {
        if (result.broken > 0) {
          console.log(chalk.red(`Broken: ${result.broken}`));
        } else {
          console.log(chalk.green(`Broken: ${result.broken}`));
        }
      }
    } else {
      result.forEach((link) => {
        let output = `${chalk.blue(link.file)} ${chalk.green(link.href)} ${chalk.yellow(link.text)}`;
        if (options.validate) {
          if (link.ok === 'ok') {
            output += ` ${chalk.green(link.ok)}`;
          } else {
            output += ` ${chalk.red(link.ok)}`;
          }
          output += ` ${chalk.gray(link.status)}`;
        }
        console.log(output);
      });
    }
  })
  .catch((error) => {
    console.error(chalk.red(error.message));
  });

