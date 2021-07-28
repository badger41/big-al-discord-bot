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
