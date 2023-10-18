const chalk = require('chalk');
const { soma } = require('./index');

const resultado = soma(1, 2);

console.log(chalk.red(resultado));
