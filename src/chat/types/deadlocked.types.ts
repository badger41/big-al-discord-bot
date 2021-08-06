export interface AccountStatus {
  AccountId: number;
  AccountName: string;
  WorldId?: number;
  GameId?: number;
  GameName?: string;
  ChannelId?: number;
}

export interface GameLobby {}

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
