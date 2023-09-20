import chalk from 'chalk';
import request from 'request';
import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import { createSpinner } from 'nanospinner';

const getJar = async (type, provider, version, output) => {
   return new Promise((resolve) => {
      const file = fs.createWriteStream(output);
      resolve(request.get(`https://serverjars.com/api/fetchJar/${type}/${provider}/${version}`).pipe(file));
   });
}

const storeData = async (path, data) => {
   data = { ...data, createdAt: new Date() }

   const stored = JSON.stringify(data);

   fs.writeFile(path, stored, (err) => { console.error(err) });
}

const Init = async () => {
   const directory = await inquirer.prompt({
      name: 'directory',
      type: 'input',
      message: 'Which directory',
      default() {
         return '.';
      }
   })

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

   let providers = await fetch(`https://serverjars.com/api/fetchTypes/${type.type}`);
   providers = await providers.json();

   if (!providers) {
      console.error(chalk.red('Sorry, there was an error fetching the providers.'))
      return;
   }

   const provider = await inquirer.prompt({
      name: 'provider',
      type: 'list',
      message: 'Which provider',
      choices: providers.response.servers
   })

   let versions = await fetch(`https://serverjars.com/api/fetchAll/${type.type}/${provider.provider}/10`);
   versions = await versions.json();

   console.log(`${chalk.green('➜')} ${chalk.bold('Possible Versions')}  ${chalk.red('* Not All Listed - Usually 1.8 to Latest')}`);
   versions.response.forEach((e) => {
      console.log(`${chalk.blueBright(e.version)} (${e.size.display})`)
   });

   const version = await inquirer.prompt({
      name: 'version',
      type: 'input',
      message: 'Which version',
      default() {
         return versions.response[0].version;
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

   const extra = await inquirer.prompt({
      name: 'extra',
      type: 'checkbox',
      message: 'Any extra features',
      choices: [
         'Interval World Backup',
         'World Backup on Stop',
         'Restart on Stop',
      ]
   })

   const form = {
      directory: directory.directory,
      type: type.type,
      provider: provider.provider,
      version: version.version,
      ram: ram.ram,
      extra: extra.extra,
   }

   const route = path.join(path.resolve(), form.directory, 'server.jar');

   const spinner = createSpinner(chalk.gray(`Downloading ${form.version} ${form.provider} jar...`)).start()

   await storeData(path.join(path.resolve(), form.directory, 'mserve.json'), form)

   await getJar(form.type, form.provider, form.version, route).then(stream => {
      stream.on('finish', () => {
         spinner.success({
            text: `
         ${chalk.green('✔')} ${chalk.bold('Success: ')} ${chalk.blueBright(`Setup server at ${route}.`)}
         `});
      })
   });

};

export default Init;
