export interface AccountStatus {
  AccountId: number;
  AccountName: string;
  WorldId?: number;
  GameId?: number;
  GameName?: string;
  ChannelId?: number;
}

export interface GameLobby {
  Id: number;
  GameId: number;
  AppId: number;
  MinPlayers: number;
  MaxPlayers: number;
  PlayerCount: number;
  PlayerListCurrent: string;
  PlayerListStart: string;
  GameLevel: number;
  PlayerSkillLevel: number;
  GameStats: string;
  GameName: string;
  RuleSet: number;
  GenericField1?: number;
  GenericField2?: number;
  GenericField3?: number;
  GenericField4?: number;
  GenericField5?: number;
  GenericField6?: number;
  GenericField7?: number;
  GenericField8?: number;
  WorldStatus: string;
  GameHostType: string;
  Metadata: string;
  GameCreateDt?: Date;
  GameStartDt?: Date;
}

export interface MetaDataSettings {
  Weather?: string;
  CustomGameMode?: string;
  CustomMap?: string;
  CustomRules?: string[];
}

export enum Level {
  'Battledome Tower' = 41,
  'Catacrom Graveyard' = 42,
  'Sarathos Swamp' = 44,
  'Dark Cathedral' = 45,
  'Temple of Shaar' = 46,
  'Valix Lighthouse' = 47,
  'Mining Facility' = 48,
  'Torval Ruins' = 50,
  'Tempus Station' = 51,
  'Maraxus Prison' = 53,
  'Ghost Station' = 54,
}

export enum GameMode {
  'Conquest' = 0,
  'Capture the Flag' = 1,
  'Deathmatch' = 2,
  'King of the Hill' = 3,
  'Juggernaut' = 4,
}

export const EmojisDEV = new Map([
  ['Dual Vipers', '<:vipers:873076969095446571>'],
  ['Magma Cannon', '<:magma:384519697384865792>'],
  ['Arbiter', '<:arbiter:873077048128729148>'],
  ['Fusion Rifle', '<:fusion:381496573382885377>'],
  ['Mine Launcher', '<:mines:873077094937165854>'],
  ['B6', '<:b6:384519810970550272>'],
  ['Holoshield', '<:holos:873077209072554004>'],
  ['Flail', '<:flail:873077173039280198>'],
  ['Hoverbike', '<:hoverbike:873077582571118602>'],
  ['Hovership', '<:hovership:873077681984512010>'],
  ['Puma', '<:puma:873077630910468117>'],
  ['Landstalker', '<:landstalker:873077730982379591>'],
  ['Chargeboots', '<:chargeboots:381544731072528384>'],
  ['Rank 1', '<:1_:873082063832616982>'],
  ['Rank 2', '<:2_:873082106723590184>'],
  ['Rank 3', '<:3_:873082134745735238>'],
  ['Rank 4', '<:4_:873082155868241940>'],
  ['Rank 5', '<:5_:873082177745719357>'],
  ['Rank 6', '<:6_:873082203322605609>'],
  ['Rank 7', '<:tex_73:873082239079038986>'],
  ['Rank 8', '<:8_:873082285329637406>'],
  ['Rank 9', '<:9_:873082308285067284>'],
  ['Rank 10', '<:10:381496178845417474>'],
]);

export const EmojisPROD = new Map([
  ['Dual Vipers', '<:wepvipers:873719007516176425>'],
  ['Magma Cannon', '<:wepmagma:873719083298873384>'],
  ['Arbiter', '<:weparbiter:873719153964486686>'],
  ['Fusion Rifle', '<:wepfusion:873719220305817660>'],
  ['Mine Launcher', '<:wepmines:873719258100674602>'],
  ['B6', '<:wepb6:873719421959553044>'],
  ['Holoshield', '<:wepholoshield:873719459779584020>'],
  ['Flail', '<:wepflail:873719511130468362>'],
  ['Hoverbike', '<:vehhoverbike:873719625668517919>'],
  ['Hovership', '<:vehhovership:873719705494495292>'],
  ['Puma', '<:vehpuma:873719664931389440>'],
  ['Landstalker', '<:vehhovership:873719705494495292>'],
  ['Chargeboots', '<:gadchargeboots:873725388847738910>'],
  ['Rank 1', '<:rank1:873718537590542377>'],
  ['Rank 2', '<:rank2:873718619354320907>'],
  ['Rank 3', '<:rank3:873718652631932959>'],
  ['Rank 4', '<:rank4:873718680326918194>'],
  ['Rank 5', '<:rank5:873718714929918025>'],
  ['Rank 6', '<:rank6:873718750996738080>'],
  ['Rank 7', '<:rank7:873718784626675713>'],
  ['Rank 8', '<:rank8:873718814989221978>'],
  ['Rank 9', '<:rank9:873718842818445354>'],
  ['Rank 10', '<:rank10:873718887668150282>'],
]);
