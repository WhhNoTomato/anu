#!/usr/bin/env node
'use strict';
const chalk = require('chalk');
const semver = require('semver');
const program = require('commander');

if (semver.lt(process.version, '8.6.0')) {
    // eslint-disable-next-line
    console.log(
        chalk`nanachi only support {green.bold v8.6.0} or later (current {green.bold ${
            process.version
        }}) of Node.js`
    );
    process.exit(1);
}

program
    .name('mpreact')
    .usage('<command>')
    .version(require('../package.json').version, '-v, --version');
    

program.command('init <project-name>').description('初始化项目');

program
    .command('watch:[wx|ali|bu|quick|tt]')
    .description('监听[ 微信小程序 | 支付宝小程序 | 百度智能小程序 | 快应用 | 头条小程序]');

program
    .command('build:[wx|ali|bu|quick|tt]')
    .description('构建[ 微信小程序 | 支付宝小程序 | 百度智能小程序 | 快应用 | 头条小程序]');
    

program.parse(process.argv);
if (program.args.length === 0) program.help();

const config = require('../packages/config');
const args = program.args;
function getBuildType(args) {
    let type = args[0].split(':')[1];
    type = !type ? 'wx' : type.toLowerCase();
    return type;
}

/* eslint-disable */
if (args[0] === 'init' && typeof args[1] === 'undefined') {
    console.error('请指定项目名称');
    console.log(
        `  ${chalk.cyan(program.name())} init ${chalk.green(
            '<project-name>'
        )}\n`
    );
    console.log('例如:\n');
    console.log(
        `  ${chalk.cyan(program.name())} init ${chalk.green('mpreact-app')}`
    );
    process.exit(1);
}

let buildType = getBuildType(args);
/* eslint-disable */
if (!config[buildType]) {
    let type = args[0].split(':');
    console.log(chalk.red('请检查命令是否正确'));
    console.log(chalk.green(`1.微信小程序:        mpreact ${type[0]}`));
    console.log(chalk.green(`2.百度智能小程序:     mpreact ${type[0]}:bu`));
    console.log(chalk.green(`3.支付宝小程序:       mpreact ${type[0]}:ali`));
    console.log(chalk.green(`4.快应用:            mpreact ${type[0]}:quick`));
    console.log(chalk.green(`5.头条小程序:         mpreact ${type[0]}:tt`));

    process.exit(1);
}else{
    console.warn("mpreact "+ args[0]+" 命令已经废弃， 请改用nanachi "+ args[0])
}

process.env.ANU_ENV = buildType;


config['buildType'] = buildType;

let command = args[0];
if (/\:/.test(command)) {
    //<watch|build>:
    command = command.split(':')[0];
}

if(
    program.rawArgs[program.rawArgs.length-1] == '-c' ||
    program.rawArgs[program.rawArgs.length-1] == '--compress'
){
    config['compress'] = true;
}

switch (command) {
    case 'watch':
        require('../packages/index')('watch', buildType);
        break;
    case 'build':
        require('../packages/index')('build', buildType);
        break;
    case 'init':
        require('../packages/init')(args[1]);
        break;
    default:
        console.log(chalk.green('初始化项目: mpreact init <project-name>'));
}
