const environment = process.env.ENVIRONMENT;

enum QueueRolesDEV {
  'Contestant' = '876515332968288286',
}

enum QueueRolesPROD {
  'Contestant' = '876542835959152701',
}

export function getRoleIds() {
  // get dev/prod role ids
  return environment === 'PROD' ? QueueRolesPROD : QueueRolesDEV;
}
