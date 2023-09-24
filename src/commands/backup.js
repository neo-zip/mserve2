import inquirer from 'inquirer';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { createSpinner } from 'nanospinner';

const askDirectory = async () => {
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

const getWorlds = (directory) => {
   const data = fs.readdirSync(directory, { withFileTypes: true }).filter(e => e.isDirectory()).map(e => e.name);

   if (!data) {
      console.log(chalk.red('\nThere is no server in this location or there was an error finding it.'));
      return null;
   }

   const worlds = [];

   data.forEach(e => {
      if (fs.readdirSync(path.join(directory, e)).includes('level.dat')) {
         worlds.push(e);
      }
   })

   if (worlds.length <= 0) {
      console.log(chalk.red('\nThere are no worlds in this server. (Make sure theres a `level.dat`!)'));
      return null;
   }

   return worlds;
}

const checkStorage = (directory) => {
   if (!fs.readdirSync(directory).includes('.backups')) {
      fs.mkdirSync(path.join(directory, '.backups'), (err) => { console.error(err); return false; });
   }
   return true;
}

const backupWorlds = (directory) => {
   const worlds = getWorlds(directory);

   if (!worlds) {
      return;
   }

   if (!checkStorage(directory)) {
      return;
   }

   const spinner = createSpinner(`${chalk.gray(`Backing-up worlds...`)}`).start();

   const timestamp = new Date().toLocaleString().replace(/\//g, "-").replace(/:/g, ".");
   const location = path.resolve(path.join(directory, '.backups', timestamp));

   fs.mkdirSync(location, (err) => { console.error(err) });

   worlds.forEach(e => {
      const route = path.join(location, e);

      fs.mkdirSync(route, (err) => { console.error(err) });

      fs.cpSync(path.join(directory, e), route, { recursive: true, force: true }, (err) => { console.error(err) });
   })

   spinner.success({ text: `${chalk.green('Backed-up worlds!')}` });
}

const Backup = async (args) => {

   if (!args) {
      const route = await askDirectory();
      backupWorlds(route);

      return;
   }

   backupWorlds(path.resolve(args[0]));

   return;
};

export default Backup;
