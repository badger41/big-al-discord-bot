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
  GameCreateDt?: string;
  GameStartDt?: string;
}

export interface MetaDataGameStateTeam {
  Id: number;
  Name: string;
  Score: number;
  Players?: string[];
}

export interface MetaDataGameState {
  TeamsEnabled: boolean;
  Teams: MetaDataGameStateTeam[];
}

export interface MetaDataSettings {
  Weather?: string;
  CustomGameMode?: string;
  CustomMap?: string;
  CustomRules?: string[];
  GameInfo?: string;
  GameState?: MetaDataGameState;
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
  ['Dual Vipers', '<:wepvipers:938587193281232977>'],
  ['Magma Cannon', '<:wepmagma:938587238281904168>'],
  ['Arbiter', '<:weparbiter:938587265691693088>'],
  ['Fusion Rifle', '<:wepfusion:938587301511036979>'],
  ['Mine Launcher', '<:wepmines:938587333039632434>'],
  ['B6', '<:wepb6:938587351662350366>'],
  ['Holoshield', '<:wepholoshield:938587381790040105>'],
  ['Flail', '<:wepflail:938587396499460216>'],
  ['Hoverbike', '<:vehhoverbike:938596898279940126>'],
  ['Hovership', '<:vehhovership:938596898254753833>'],
  ['Puma', '<:vehpuma:938596898321891429>'],
  ['Landstalker', '<:vehhovership:938596898317672500>'],
  ['Chargeboots', '<:gadchargeboots:939935063443927090>'],
  ['Rank 1', '<:rank1:939933314586918963>'],
  ['Rank 2', '<:rank2:939933314586927144>'],
  ['Rank 3', '<:rank3:939933314599510087>'],
  ['Rank 4', '<:rank4:939933314750496788>'],
  ['Rank 5', '<:rank5:939933314859552769>'],
  ['Rank 6', '<:rank6:939933314595291216>'],
  ['Rank 7', '<:rank7:939933314674991124>'],
  ['Rank 8', '<:rank8:939933314968588380>'],
  ['Rank 9', '<:rank9:939933314712764477>'],
  ['Rank 10', '<:rank10:939933314607898684>'],
]);
