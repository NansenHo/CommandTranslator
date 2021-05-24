import * as commander from 'commander';
import {translate} from './main';

const program = new commander.Command();

program
    .version('0.0.1')
    .name('ct')
    .usage('<English>')
    .arguments('<English>')
    .action(function (english) {
        console.log('english:' + english)
        translate('hello')
    });

program.parse(process.argv);