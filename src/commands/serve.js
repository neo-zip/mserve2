import chalk from 'chalk';
import inquirer from 'inquirer';
import path from 'path';
import fs from 'fs';
import { spawn } from 'child_process';
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

   return path.resolve(directory.directory);
}

const getStorage = (directory) => {
   const data = fs.readFileSync(path.resolve(path.join(directory, 'mserve.json')), { encoding: 'utf8' }, (err, data) => {
      if (err) {
         console.error(chalk.red('\nThere is no server in this location or there was an error starting it.'));
         return false;
      }

   });


   if (!data) {
      console.error(chalk.red('\nThere is no data in this location. (check mserve.json)'));
      return false;
   }

   return JSON.parse(data);
}

const start = async (directory) => {
   const storage = getStorage(directory);

   console.log(`
      ${chalk.bgHex('#643bd7').bold('MSERVE')} 
      ${chalk.bold(`Serving ${directory}!`)}
      ${chalk.green('➜')} Version: ${chalk.blueBright(storage.version)}
      ${chalk.green('➜')} Provider: ${chalk.blueBright(storage.provider)}
      ${chalk.green('➜')} Memory: ${chalk.blueBright(`${storage.ram}gb`)}
      ${chalk.green('➜')} Extra:${chalk.blueBright(storage.extra.map((e) => {
      return ' ' + e;
   }))}
      `);

   const spinner = createSpinner(`
      ${chalk.gray(`Starting...`)}
   `).start();
   const startTime = new Date();

   const runner = spawn(`java`, [`-Xms${storage.ram ?? 3}G`, `-Xmx${storage.ram ?? 3}G`, '-jar', 'server.jar', '0', '--nogui'], {
      cwd: directory,
      shell: true,
      stdio: 'inherit'
   });

   spinner.success({
      text: `
      ${chalk.bold('Loaded!')}
   ` });

   runner.on('close', () => {
      const elapsed = new Date() - startTime;

      const hours = Math.floor((elapsed % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);

      console.log(chalk.green(`\nServer had a clean exit! ${chalk.gray('Elapsed for')} ${chalk.blueBright(`${hours}h ${minutes}m ${seconds}s`)}`));
   })
}

const Serve = async (args) => {

   if (!args) {
      const route = await ask();
      start(route);

      return;
   }

   start(path.resolve(args[0]));

   return;
};

export default Serve;
