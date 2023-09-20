
const Help = (commands) => {
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
   ]

   commands.forEach((e) => {
      console.log(`${chalk.blueBright(e.i)} (${e.size.display})`)
   });

   return;
};

export default Help;
