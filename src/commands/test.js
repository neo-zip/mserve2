import path from 'path';

const Test = (args) => {
   console.log(
      path.resolve(args[0])
   )

   return;
};

export default Test;
