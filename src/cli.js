const mdLinks = require('./mdLinks');

const filePath = process.argv[2];

mdLinks.readMarkdownFile(filePath)
  .then((markdownContent) => {
    
    console.log(markdownContent);
  })
  .catch((error) => {
    console.error(error.message);
  });






// const {soma, lerArquivo} = require('../index.js');
// const chalk = require('chalk')
// const resultado = soma(1,3);
// console.log(chalk.blue(resultado));

// lerArquivo('./folder/arquivo1.md')
// .then((conteudoDoArquivo)=> {
//     console.log (chalk.bgGray(conteudoDoArquivo))
// });