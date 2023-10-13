// const chalk = require('chalk');
const fs = require('fs');

fs.readFile('README.md', 'utf8', (err, data) => {
  if (err) throw err;

  console.log(data);
});

// function soma(a, b) {
//   return a + b;
// }
// console.log(soma(3, 8));

// console.log(chalk.red('Hello world!'));
