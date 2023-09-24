'use strict';

import chalk from 'chalk';
import { argv } from 'node:process';
import Init from './commands/init.js';
import Help from './commands/help.js';
import Docs from './commands/docs.js';
import Serve from './commands/serve.js';
import Delete from './commands/delete.js';
import Backup from './commands/backup.js';

// TODO
/**
 * ✅ help
 * ✅ docs
 * ✅ init
 * ✅ serve: - add options
 * ✅ delete
 * ✅ backup: - add clearing backups, storage limit, & interval clearing
 * - modify 
 * - update 
 * - settings: - like language; etc
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
         Help(args);
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
      case 'backup':
         Backup(args);
         break;
      case 'delete':
         Delete(args);
         break;
      default:
         console.log(helpMessage);
   }

};

main();
