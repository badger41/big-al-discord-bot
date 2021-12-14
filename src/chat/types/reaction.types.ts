const UYA_REACTIONS: { [emoji: string]: string } = {
  // Flux Icon - UYA Players
  '876271513102323752': '807713673132113951',
  // Sheepinator Icon - UYA Casuals
  '876271858947870750': '909561632995282994',
};

const DL_REACTIONS: { [emoji: string]: string } = {
  // Fusion Icon - DL Players
  '873719220305817660': '807713584360587264',
  // Arbiter Icon - DL Casuals
  '873719153964486686': '883145123322527845',
};

export const ROLE_REACTIONS = {
  ...UYA_REACTIONS,
  ...DL_REACTIONS,
};
