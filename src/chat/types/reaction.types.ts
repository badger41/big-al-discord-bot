const UYA_REACTIONS: { [emoji: string]: string } = {
  // Nefarious - UYA Players
  '752680088125964418': '807713673132113951',
  // Sheepinator Icon - UYA Casuals
  '876271858947870750': '909561632995282994',
};

const DL_REACTIONS: { [emoji: string]: string } = {
  // Vox - DL Players
  '752472561891409931': '807713584360587264',
  // Arbiter Icon - DL Casuals
  '873719153964486686': '883145123322527845',
};

export const ROLE_REACTIONS = {
  ...UYA_REACTIONS,
  ...DL_REACTIONS,
};
