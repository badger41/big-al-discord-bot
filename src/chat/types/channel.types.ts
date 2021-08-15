const environment = process.env.ENVIRONMENT;

enum ChannelIdsDEV {
  'DL Queue Alert' = '831326287708684298',
  'DL Online Players' = '831326287708684298'
};

enum ChannelIdsPROD {
  'DL Queue Alert' = '802649402635321385',
  'DL Online Players' = '847596172377063534'
};

export function getChannelIds() {
  // get dev/prod role ids
  return environment === 'PROD' ? ChannelIdsPROD : ChannelIdsDEV;
}
