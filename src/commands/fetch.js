
const FetchTest = async (commands) => {
   let res = (await fetch(`https://serverjars.com/api/fetchTypes/servers`));
   res = await res.json();

   console.log(res)

   return;
};

export default FetchTest;
