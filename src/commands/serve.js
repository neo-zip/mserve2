import chalk from 'chalk';
import inquirer from 'inquirer';
import path from 'path';
import fs from 'fs';
import { exec, execSync } from 'child_process';
import { createSpinner } from 'nanospinner';

const ask = async () => {
   const directory = await inquirer.prompt({
      name: 'directory',
      type: 'input',
      message: 'Which directory',
      default() {
         return '.';
      }
   })

   return path.join(path.resolve(), directory.directory);
}

const start = async (directory) => {
   let storage;

   fs.readFile(path.join(directory, 'mserve.json'), 'utf8', (err, data) => {
      if (err) {
         console.error(chalk.red('\nThere is no server in this location or there was an error starting it.'));
         return false;
      }

      storage = JSON.parse(data);

      if (!storage) {
         console.error(chalk.red('\nThere is no data in this location. (check mserve.json)'));
         return false;
      }

      console.log(`
      ${chalk.bgHex('#643bd7').bold('MSERVE')} 
      ${chalk.bold('Serving!')}
      ${chalk.green('➜')} Version: ${chalk.blueBright(storage.version)}
      ${chalk.green('➜')} Provider: ${chalk.blueBright(storage.provider)}
      ${chalk.green('➜')} Memory: ${chalk.blueBright(`${storage.ram}gb`)}
      ${chalk.green('➜')} Extra:${chalk.blueBright(storage.extra.map((e) => {
         return ' ' + e;
      }))}
      `);

      const spinner = createSpinner(chalk.gray(`Starting...`)).start()

      exec(`cd ${directory} & java -Xms${storage.ram ?? 3}G -Xmx${storage.ram ?? 3}G -jar server.jar 0 --nogui`, (err, output) => {
         if (err) {
            console.error("could not execute command: ", err)
            return
         }

         spinner.success({ text: output });
      })

      return true;
   });

   return false;
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
