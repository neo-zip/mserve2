import open from 'open';

const Docs = (args) => {
   console.log(`${chalk.green('➜')} ${chalk.bold('You can find the documentation at')} ${chalk.blueBright('https://docs.neotap.net/mserve')}`)
   
   if ( !args[0] || args[0] != 'open' ) { 
      return;
   }

   open('https://docs.neotap.net/mserve');
   

   return;
};

export default Docs;
