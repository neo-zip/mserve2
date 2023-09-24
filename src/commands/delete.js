import inquirer from 'inquirer';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';

const askDirectory = async () => {
   const question = await inquirer.prompt({
      name: 'directory',
      type: 'input',
      message: 'Which directory',
      default() {
         return '.';
      }
   })

   return path.resolve(question.directory);
}

const confirm = async () => {
   const question = await inquirer.prompt({
      name: 'answer',
      type: 'confirm',
      message: 'Are you sure you want to permanently delete this server (worlds, settings, etc.)?',
   })

   return question.answer;
}

const deleteServer = (directory) => {
   fs.rmSync(directory, { recursive: true, force: true });
}

const prompt = async (directory) => {
   if (!checkForServer(directory)) {
      return;
   }

   if (await confirm()) {
      deleteServer(directory);
      console.log(chalk.green(`Deleted server at ${directory}!`))
      return;
   }

   console.log(chalk.red('Cancelled.'))
   return;
}

const checkForServer = (directory) => {
   try {
      fs.readFileSync(path.resolve(path.join(directory, 'mserve.json')), 'utf8');
      return true;
   } catch (err) {
      console.error(chalk.red('\nThere is no server in this location or this path does not exist.'));
      return false;
   }
}

const Delete = async (args) => {
   if (!args) {
      const route = await askDirectory();

      await prompt(route)
      return;
   }

   await prompt(path.resolve(args[0]));
};

export default Delete;
