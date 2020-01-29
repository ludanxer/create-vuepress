const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const mkdirp = require('mkdirp');
const inquirer = require('inquirer');
const clipboardy = require('clipboardy');
const debug = require('debug')('create-vuepress:run')

const sequences = ['docs', 'blog'];

const boilerplates = fs
  .readdirSync(`${__dirname}/generators`)
  .filter(f => !f.startsWith('.'))
  .sort((prev, next) => sequences.indexOf(prev) > sequences.indexOf(next) ? 1 : -1)
  .map(f => {
    return {
      name: `${f.padEnd(15)} - ${chalk.gray(require(`./generators/${f}/meta.json`).description)}`,
      value: f,
      short: f,
    };
  });

const runGenerator = async (generatorPath, { targetDir = '', cwd = process.cwd(), args = {} }) => {
  return new Promise(resolve => {
    if (targetDir) {
      mkdirp.sync(targetDir);
      cwd = path.join(cwd, targetDir);
    }

    const Generator = require(generatorPath);
    const generator = new Generator({
      targetDir,
      env: {
        cwd,
      },
      resolved: require.resolve(generatorPath),
      args,
    });

    return generator.run(() => {
      if (targetDir) {
        if(process.platform !== `linux` || process.env.DISPLAY){
          clipboardy.writeSync(`cd ${targetDir}`);
          console.log('📋 Copied to clipboard, just use Ctrl+V');
        }
      }
      console.log('✨ File Generate Done');
      resolve(true);
    });
  });
};

const run = async config => {
  debug(config);

  return inquirer
    .prompt([
      {
        name: 'type',
        message: 'Select the boilerplate type',
        type: 'list',
        choices: boilerplates
      }
    ])
    .then(answers => {
      return runGenerator(`./generators/${answers.type}`, config);
    })
    .catch(e => {
      console.error(chalk.red(`> Generate failed`), e);
      process.exit(1);
    });
};

module.exports = run;
