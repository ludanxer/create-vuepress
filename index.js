#!/usr/bin/env node

const yParser = require('yargs-parser');
const semver = require('semver');
const chalk = require('chalk');
const run = require('./lib/run');
const { name, version } = require('./package');
const debug = require('debug');
// const { existsSync } = require('fs');
// const { join } = require('path');

// Get cli arguments
const args = yParser(process.argv.slice(2));

// Output version with -v, --version flag
if (args.v || args.version) {
  console.log(name, version);
  // ? what is this for
  // if (existsSync(join(__dirname, '.local'))) {
  //   console.log(chalk.cyan('@local'));
  // }
  process.exit(0);
}

if (args.d || args.debug) {
  debug.enable('create-vuepress:*');
}

if (!semver.satisfies(process.version, '>= 8.0.0')) {
  console.error(chalk.red('✘ The generator will only work with Node v8.0.0 and up!'));
  process.exit(1);
}

const targetDir = args._[0] || '';
run({
  targetDir,
  args
});
