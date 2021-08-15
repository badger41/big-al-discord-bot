import Discord, { TextChannel, MessageEmbed, Message } from 'discord.js';
import fetch from 'node-fetch';
import Moment from 'moment';
import { queueDLGamesUpdated } from './queue';
import {
  AccountStatus,
  GameLobby,
  MetaDataSettings,
  Level,
  GameMode,
  EmojisDEV,
  EmojisPROD,
} from './types';
import * as dotenv from 'dotenv';
/**
 * Initialize dotenv so we can easily access custom env variables.
 */
dotenv.config();

const serverUrl = process.env.DL_SERVER_URL;
const serverPort = process.env.DL_SERVER_PORT;
const user = process.env.DL_SERVER_USER;
const pw = process.env.DL_SERVER_PASSWORD;
const channelId = process.env.DL_PLAYERS_ONLINE_CHANNEL_ID;
const environment = process.env.ENVIRONMENT;

let token: string;
let client: Discord.Client;
let existingMessage: Message;

const Emojis = environment === 'PROD' ? EmojisPROD : EmojisDEV;

const bitIndexToEquipmentName = new Map([
  [21, 'Chargeboots'],
  [7, 'Dual Vipers'],
  [8, 'Magma Cannon'],
  [9, 'Arbiter'],
  [10, 'Fusion Rifle'],
  [11, 'Mine Launcher'],
  [12, 'B6'],
  [13, 'Holoshield'],
  [18, 'Flail'],
  [0, 'Hoverbike'],
  [1, 'Hovership'],
  [2, 'Puma'],
  [3, 'Landstalker'],
]);

/**
 * This function authenticates to the DL server to grab a token.
 */
async function authenticate() {
  const authBody = {
    AccountName: user,
    Password: pw,
  };
  const result = await fetch(
    `https://${serverUrl}:${serverPort}/Account/authenticate`,
    {
      method: 'POST',
      body: JSON.stringify(authBody),
      headers: { 'Content-Type': 'application/json' },
    }
  );
  if (result.ok) {
    let response = await result.json();
    token = response['Token'];
  } else {
    throw new Error(await result.json());
  }
}

/**
 * Grab all online accounts
 */
async function getPlayersAndGames() {
  console.log('checking dl players');
  const result = await fetch(
    `https://${serverUrl}:${serverPort}/Account/getOnlineAccounts`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (result.ok) {
    return await result.json();
  } else {
    throw new Error(await result.json());
  }
}

/**
 * Grab all current games
 */
export async function getGames() {
  console.log('checking dl games');
  const result = await fetch(
    `https://${serverUrl}:${serverPort}/api/Game/list`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (result.ok) {
    return await result.json();
  } else {
    throw new Error(await result.json());
  }
}

async function processOnlinePlayers(
  players: AccountStatus[],
  games: GameLobby[]
) {
  const channelId = process.env.DL_PLAYERS_ONLINE_CHANNEL_ID;
  if (channelId) {
    const channel = client.channels.cache.get(channelId);
    if (channel?.isText) {
      let embed = createEmbed(players, games);
      if (existingMessage) existingMessage.edit(embed);
      else {
        existingMessage = await (<TextChannel>channel).send(embed);
      }
    }
  }
}

/**
 * This is the main function that starts the process.
 * @param client The active discord client instance.
 */
export async function checkOnlineDLPlayers(_client: Discord.Client) {
  client = _client;
  if (!token) await authenticate();

  let accountStatuses = await getPlayersAndGames();
  let games = await getGames();

  queueDLGamesUpdated(_client, games);
  processOnlinePlayers(accountStatuses, games);
}

function createEmbed(onlinePlayers: AccountStatus[], games: GameLobby[]) {
  let playerNames = onlinePlayers.map((p) => p.AccountName);
  let onlineEmbed = new MessageEmbed()
    .setColor('#AA0000')
    .setTitle(`Players Online - ${onlinePlayers.length}`)
    .setThumbnail('https://dl.uyaonline.com/assets/img/dreadzone.png')
    .setFooter('Last Updated')
    .setTimestamp(new Date())
    .setDescription(
      playerNames.length > 0
        ? '```' +
            playerNames
              .sort((a, b) => b.localeCompare(a))
              .reverse()
              .map((p) => `\n  ${p}  `)
              .join(' ') +
            '```'
        : ' '
    )
    .addFields({ name: '\u200B', value: 'Active Games:' });

  for (let game of games
    .filter(
      (g) => g.WorldStatus == 'WorldActive' || g.WorldStatus == 'WorldStaging'
    )
    .sort(
      (a, b) => b.GameName.localeCompare(a.GameName)
    )
  ) {
    let metadata: MetaDataSettings = JSON.parse(game.Metadata);
    let equipmentNames = getEquipmentNames(game) ?? [];
    let defaultSkillEmoji = Emojis.get('Rank 1');
    let isInGame = game.WorldStatus == 'WorldActive';
    let timeSinceStarted = isInGame && game.GameStartDt ? Moment.duration(Moment.utc().diff(Moment.utc(game.GameStartDt))) : null;
    let skillEmoji =
      Emojis.get(`Rank ${game.PlayerSkillLevel}`) ?? defaultSkillEmoji;
    let lobbyPlayers = onlinePlayers
      .filter((a) => a.GameId == game.GameId)
      .map((a) => a.AccountName);
    onlineEmbed.addFields({
      name:
        (isInGame ? '[IG] \u200B ' : '') +
        `${skillEmoji} \u200B ` +
        game.GameName +
        `  -  (${lobbyPlayers.length}/10)` +
        (timeSinceStarted && timeSinceStarted.asHours() >= 0 ? ` @${Math.floor(timeSinceStarted.asHours())}:${pad(timeSinceStarted.minutes().toString(), 2)}:${pad(timeSinceStarted.seconds().toString(), 2)}` : ''),
      value:
        equipmentNames
          .map((n) => `${Emojis.get(n)}`)
          .filter((n) => n != '')
          .join(' ') +
        '\n' +
        '```\n' +
        (metadata.CustomGameMode ?? GameMode[game.RuleSet]) +
        ' at ' +
        (metadata.CustomMap ?? Level[game.GameLevel]) +
        (metadata.GameInfo ? metadata.GameInfo : '') +
        '\n```\n' +
        '```' +
        lobbyPlayers
          .sort((a, b) => b.localeCompare(a))
          .reverse()
          .map((p) => `\n  ${p}  `)
          .join(' ') +
        '```',
    });
  }

  if (games.length < 1) {
    onlineEmbed.addFields({
      name: 'No Games',
      value: '\u200B',
    });
  }

  onlineEmbed.addFields({ name: '\u200B', value: '\u200B' });

  return onlineEmbed;
}

function getEquipmentNames(game: GameLobby) {
  let names: string[] = [];
  if (game.GenericField6 == null) return names;

  for (let key of bitIndexToEquipmentName.keys()) {
    if ((game.GenericField6 & (1 << key)) != 0) {
      let value = bitIndexToEquipmentName.get(key);
      if (value != null) {
        names.push(value);
      }
    }
  }

  return names;
}

function pad(str: string, length: number): string {
  return str.length < length ? pad("0" + str, length) : str;
}
