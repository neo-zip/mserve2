import chalk from 'chalk';
import inquirer from 'inquirer';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';

const ask = async () => {
   const directory = await inquirer.prompt({
      name: 'directory',
      type: 'input',
      message: 'Which directory',
      default() {
         return '.';
      }
   })

   return path.join(path.resolve(), directory.directory, 'server.jar');
}

const start = async (directory) => {
   let storage;

   fs.readFile(path.join(directory, 'mserve.json'), 'utf8', (err, data) => {
      if (err) {
         console.error(chalk.red('There was an error reading the file. Maybe try again.'))
         return false;
      }

      storage = JSON.parse(data);
   });

   if (!storage) {
      console.error(chalk.red('There is no server in this location or there was an error starting it.'))
      return false;
   }

   console.log(storage)

   console.log(`
   ${chalk.bgHex('#643bd7').bold('MSERVE')} 
   ${chalk.green('➜')} Starting the server with ${storage.ram}GB ram on version ${storage.version}!
   `)
   exec(`cd ${path} & java -Xms${storage.ram ?? 3}G -Xmx${storage.ram ?? 3}G -jar server.jar 0 --nogui`);

   return true;
}

const Serve = async (args) => {

   if (!args) {
      const route = await ask();
      start(route);

      return;
   }

   start(path.join(path.resolve(), args[0]));

   return;
};

export default Serve;
