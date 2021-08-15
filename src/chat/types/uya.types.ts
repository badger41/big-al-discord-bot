export interface RoboUYAPlayer {
  account_id: number;
  dmetcp_aggtime: number;
  dmeudp_addtime: number;
  laddstatswide?: string;
  mls_world_id: number;
  stats?: string;
  status: number;
  username: string;
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
}

export enum UYALevel {
  'Bakisi Isles' = 40,
  'Hoven Gorge' = 41,
}

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
  ['n60storm', '<:uyawepn60:876266758544187452>'],
  ['fluxrifle', '<:uyawepflux:876266637723058197>'],
  ['blitzgun', '<:uyawepblitz:876266829360820224>'],
  ['rockets', '<:uyaweprockets:876266938056183818>'],
  ['gravitybomb', '<:uyawepgbomb:876267162011066390>'],
  ['mineglove', '<:uyawepmines:876267260568825918>'],
  ['morphoray', '<:uyawepmorph:876267367766843402>'],
  ['lavagun', '<:uyaweplava:876267450499477526>'],
  ['chargeboots', '<:uyagadchargeboots:876268191410683985>'],
]);
