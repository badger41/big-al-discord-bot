export interface RoboUYAPlayer {
  account_id: number;
  dmetcp_aggtime: number;
  dmeudp_addtime: number;
  laddstatswide?: string;
  mls_world_id: number;
  stats?: string;
  status: number;
  username: string;
  clan: string;
  clan_tag: string;
  region: string;
}

export interface RoboUYAGame {
  created_date: number;
  dme_world_id: number;
  dmetcp_aggtime: number;
  dmeudp_addtime: number;
  game_host_type: number;
  game_level: number;
  game_name: string;
  generic_field_1: number;
  generic_field_2: number;
  generic_field_3: number;
  max_players: number;
  min_players: number;
  player_skill_level: number;
  players: RoboUYAPlayer[];
  rules_set: number;
  started_date: number;
  status: number;
  map: string;
  game_length: string;
  frag?: string;
  game_mode: string;
  submode: string;
  cap_limit?: string;
}

export const UYATimeLimits = new Map([
  ["no_time_limit", "None"],
  ["5_minutes", "5 minutes"],
  ["10_minutes", "10 minutes"],
  ["15_minutes", "15 minutes"],
  ["20_minutes", "20 minutes"],
  ["25_minutes", "25 minutes"],
  ["30_minutes", "30 minutes"],
  ["35_minutes", "35 minutes"]
]);


export const UYAMapNames = new Map([
  ["Bakisi_Isle", "Bakisi Isles"],
  ["Hoven_Gorge", "Hoven Gorge"],
  ["Outpost_x12", "Outpost X12"],
  ["Korgon_Outpost", "Korgon Outpost"],
  ["Metropolis", "Metropolis"],
  ["Blackwater_City", "Blackwater City"],
  ["Command_Center", "Command Center"],
  ["Aquatos_Sewers", "Aquatos Sewers"],
  ["Blackwater_Dox", "Blackwater Dox"],
  ["Marcadia_Palace", "Marcadia Palace"],
]);

export const UYAPlayerStatus = new Map([
  [2, 'Lobby'],
  [3, 'In Game']
]);

export const UYAEmojisDEV = new Map([
  ['n60storm', '<:uyawepn60:876271633592107068>'],
  ['fluxrifle', '<:uyawepflux:876271513102323752>'],
  ['blitzgun', '<:uyawepblitz:876271686830403654>'],
  ['rockets', '<:uyaweprockets:876271740500713522>'],
  ['gravitybomb', '<:uuyawepgbomb:876271787200094208>'],
  ['mineglove', '<:uyawepmines:876273662926413844> '],
  ['morphoray', '<:uyawepmorph:876271858947870750>'],
  ['lavagun', '<:uyaweplava:876271988228911105>'],
  ['chargeboots', '<:uyagadchargeboots:876272052372406342>'],
]);

export const UYAEmojisPROD = new Map([
  ['n60storm', '<:uyawepn60:938595002806837281>'],
  ['fluxrifle', '<:uyawepflux:938595002844577852>'],
  ['blitzgun', '<:uyawepblitz:938595002836197426>'],
  ['rockets', '<:uyaweprockets:938595002953658428>'],
  ['gravitybomb', '<:uyawepgbomb:938595002941055047>'],
  ['mineglove', '<:uyawepmines:938595002643255338>'],
  ['morphoray', '<:uyawepmorph:938595002882347039>'],
  ['lavagun', '<:uyaweplava:938595002676838431>'],
  ['chargeboots', '<:uyagadchargeboots:938595002949439498>'],
]);
