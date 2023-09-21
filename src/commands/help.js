import chalk from 'chalk';

const Help = () => {
   console.log(`${chalk.green('➜')} ${chalk.bold('More info about mserve at')} ${chalk.blueBright('https://neotap.net/mserve')}`);
   console.log('Avaliable commands are:')

   const commands = [
      {
         name: 'help',
      },
      {
         name: 'docs',
      },
      {
         name: 'init',
      },
      {
         name: 'serve',
      },
      {
         name: 'backup',
      },
   ]

   commands.forEach((e) => {
      console.log(`mserve ${chalk.blueBright(e.name)}`)
   });

   return;
};

export default Help;
