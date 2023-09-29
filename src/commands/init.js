import chalk from 'chalk';
import request from 'request';
import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
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

const getJar = (type, provider, version, output) => {
   return new Promise((resolve) => {
      const file = fs.createWriteStream(output);
      resolve(request.get(`https://serverjars.com/api/fetchJar/${type}/${provider}/${version}`).pipe(file));
   });
}

const storeData = (directory, data) => {
   data = { ...data, createdAt: new Date() }

   const stored = JSON.stringify(data);

   fs.writeFile(directory, stored, (err) => { console.error(err) });
}

const checkForDirectory = async (directory) => {
   if (fs.existsSync(directory)) {
      return true;
   }

   console.log(chalk.yellow('The folder for the server does not exist.'));

   const confirm = await inquirer.prompt({
      name: 'answer',
      type: 'confirm',
      message: `Would you like to create the directory? (${directory})`,
   })

   if (!confirm.answer) {
      console.error(chalk.red('\nOkay, exited setup. Can\'t continue without a valid directory.'));
      return false;
   }

   fs.mkdirSync(directory, {}, () => {
      console.error(chalk.bold('\nThere was an error creating the folder.'));
      return false;
   });

   return true;
}

const checkForServer = (directory) => {
   if (fs.existsSync(path.join(directory, 'mserve.json'))) {
      console.error(chalk.red('There is already a server in this location.'));
      return true;
   }

   return false;
}

const completeForm = async (directory) => {
   if (!await checkForDirectory(directory)) {
      return;
   }

   if (checkForServer(directory)) {
      return;
   }

   const type = await inquirer.prompt({
      name: 'type',
      type: 'list',
      message: 'What type of server',
      choices: [
         'servers',
         'vanilla',
         'proxies',
         'modded',
         'bedrock',
      ],
   })

   const resProviders = await fetch(`https://serverjars.com/api/fetchTypes/${type.type}`);

   if (!resProviders.ok) {
      console.error(chalk.red('Sorry, there was an error fetching the providers.'))
      return;
   }

   const providersJSON = await resProviders.json();
   let providers;

   for (const key in providersJSON.response) {
      providers = providersJSON.response[key];
      break;
   }

   const provider = await inquirer.prompt({
      name: 'provider',
      type: 'list',
      message: 'Which provider',
      choices: providers,
   })

   const resVersions = await fetch(`https://serverjars.com/api/fetchAll/${type.type}/${provider.provider}/10`);
   if (!resVersions.ok) {
      console.error(chalk.red('Sorry, there was an error fetching the versions.'));
      return;
   }

   const versions = await resVersions.json();

   console.log(`${chalk.green('➜')} ${chalk.bold('Possible Versions')}  ${chalk.red('* Not All Listed - Usually 1.8 to Latest')}`);
   versions.response.forEach((e) => {
      console.log(`${chalk.blueBright(e.version)} (${e.size.display})`)
   });

   const version = await inquirer.prompt({
      name: 'version',
      type: 'input',
      message: 'Which version',
      default() {
         return versions.response[0].version ?? '1.19';
      }
   })

   const ram = await inquirer.prompt({
      name: 'ram',
      type: 'number',
      message: 'How many GB of ram',
      default() {
         return 3;
      }
   })

   console.log(`${chalk.bgYellow('Warning!')} ${chalk.bold('Backup features will require a high amount of storage space.')}`)

   const extra = await inquirer.prompt({
      name: 'extra',
      type: 'checkbox',
      message: 'Any extra features',
      choices: [
         'Interval World Backup',
         'Interval Old Backup Deletion',
         'World Backup on Stop',
         'World Backup on Start',
         'Restart on Stop',
      ]
   })

   let interval = { interval: 120 };

   if (extra.extra.includes('Interval World Backup') || extra.extra.includes('Interval Old Backup Deletion')) {
      interval = await inquirer.prompt({
         name: 'interval',
         type: 'number',
         message: 'How long should the interval be? (in minutes; e.g. 120 = 2h)',
         default() {
            return 120;
         }
      })
   }

   if (extra.extra.includes('Interval Old Backup Deletion')) {
      console.log('Interval Old Backup Deletion removes all backups OTHER THAN the 2 most recent backups automatically.');
   }

   const form = {
      directory: directory,
      type: type.type,
      provider: provider.provider,
      version: version.version,
      ram: ram.ram,
      extra: extra.extra,
      interval: interval.interval,
   }

   await initializeServer(form);
}

const initializeServer = async (form) => {
   const route = path.join(form.directory, 'server.jar');

   const spinner = createSpinner(`${chalk.gray(`Downloading ${form.version} ${form.provider} jar...`)}`).start();

   storeData(path.join(form.directory, 'mserve.json'), form);

   await getJar(form.type, form.provider, form.version, route).then(stream => {
      stream.on('finish', () => {
         spinner.success({ text: `${chalk.green('✔')} ${chalk.bold('Success: ')} ${chalk.blueBright(`Setup server at ${route}.`)}` });
      });
   });
}

const Init = async (args) => {

   if (!args) {
      const route = await askDirectory();
      await completeForm(route);

      return;
   }

   await completeForm(path.resolve(args[0]));

};

export default Init;
