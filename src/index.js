'use strict';

import chalk from 'chalk';
import { argv } from 'node:process';
import Init from './commands/init.js';
import Help from './commands/help.js';
import Docs from './commands/docs.js';
import Serve from './commands/serve.js';

// TODO
/**
 * help /
 * docs /
 * init /
 * serve 
 * backup
 * latest
 * util
 */

const main = () => {
   const arg = argv[2];
   const args = argv.length > 3 ? argv.slice(3) : undefined;

   const helpMessage = `
   ${chalk.bgHex('#643bd7').bold('MSERVE')} 
   ${chalk.green('➜')} See 'mserve help' for a list of commands.
   ${chalk.green('➜')} You can view the docs at 'mserve docs'.
   `

   if (!arg) {
      console.log(helpMessage);

      return;
   };

   switch (arg) {
      case 'help':
         Help();
         break;
      case 'init':
         Init();
         break;
      case 'docs':
         Docs(args);
         break;
      case 'serve':
         Serve(args);
         break;
      default:
         console.log(helpMessage);
   }

};

main();
