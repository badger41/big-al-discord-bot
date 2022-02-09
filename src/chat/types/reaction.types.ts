const UYA_REACTIONS: { [emoji: string]: string } = {
  // Gold Bolt - UYA Players
  '940392965052989511': '936437325670539264',
  // Sheepinator Icon - UYA Casuals
  '938595002882347039': '936437402942210078',
};

const DL_REACTIONS: { [emoji: string]: string } = {
  // Dreadzone - DL Players
  '938595002928496710': '936437380016144425',
  // Arbiter Icon - DL Casuals
  '938587265691693088': '936437431106961409',
};

export const ROLE_REACTIONS = {
  ...UYA_REACTIONS,
  ...DL_REACTIONS,
};
