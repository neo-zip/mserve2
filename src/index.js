'use strict';

import chalk from 'chalk';
import { argv } from 'node:process';
import Init from './commands/init.js';
import Help from './commands/help.js';
import FetchTest from './commands/fetch.js';

// TODO
/**
 * docs
 * init
 * serve
 * backup
 * latest
 * util
 */

const main = () => {
   const arg = argv[2];
   const args = argv.length > 3 ? argv.slice(3) : undefined;


   if (!arg) {
      console.log(`
      ${chalk.bgHex('#643bd7').bold('MSERVE')} 
      ${chalk.green('➜')} See 'mserve help' for a list of commands. You can view the docs at 'mserve docs'.
      `);

      return;
   };

   switch (arg) {
      case 'help':
         Help(commands);
         break;
      case 'init':
         Init();
         break;
      case 'docs':
         Docs();
         break;
      default:
         console.log(`
         ${chalk.bgHex('#643bd7').bold('MSERVE')} 
         ${arrow} See 'mserve help' for a list of commands. You can view the docs at 'mserve docs'.
         `);
   }

};

main();
