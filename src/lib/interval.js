export const intervalBackup = (directory, storage) => {
   if (!storage.extra.includes('Interval World Backup')) {
      return null;
   }

   const interval = setInterval(() => {
      Backup([directory]);
   }, (storage.interval ?? 120) * 1000 * 60);

   return interval;
}

export const intervalClear = (directory, storage) => {
   if (!storage.extra.includes('Interval Old Backup Deletion')) {
      return null;
   }

   const interval = setInterval(() => {
      Backup([directory]);
   }, (storage.interval ?? 120) * 1000 * 60);

   return interval;
}