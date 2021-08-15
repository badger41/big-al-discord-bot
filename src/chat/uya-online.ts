import Discord, { TextChannel, MessageEmbed, Message } from 'discord.js';
import fetch from 'node-fetch';
import { RoboUYAGame, RoboUYAPlayer } from './types';
import * as dotenv from 'dotenv';
/**
 * Initialize dotenv so we can easily access custom env variables.
 */
dotenv.config();

let client: Discord.Client;
let existingMessage: Message;
const apiUrl = process.env.UYA_SERVER_API_URL;
const channelId = process.env.UYA_PLAYERS_ONLINE_CHANNEL_ID;

async function checkPlayersAndGames() {
  //console.log('checking uya players and games');
  const playersResult = await fetch(`${apiUrl}/robo/players`);
  const gamesResult = await fetch(`${apiUrl}/robo/games`);
  if (playersResult.ok && gamesResult.ok) {
    let players = (await playersResult.json()) as RoboUYAPlayer[];
    let games = (await gamesResult.json()) as RoboUYAGame[];
    processOnlineData(players, games);
  } else {
    if (!playersResult.ok) throw new Error(await playersResult.json());
    else if (!gamesResult.ok) throw new Error(await gamesResult.json());
  }
}

async function processOnlineData(
  players: RoboUYAPlayer[],
  games: RoboUYAGame[]
) {
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

function createEmbed(onlinePlayers: RoboUYAPlayer[], games: RoboUYAGame[]) {
  let playerNames = onlinePlayers.map((p) => p.username);
  let onlineEmbed = new MessageEmbed()
    .setColor('#FFA000')
    .setTitle(`Players Online - ${playerNames.length}`)
    //.setThumbnail('https://dl.uyaonline.com/assets/img/dreadzone.png')
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

  for (let game of games) {
    const { max_players, players, game_name, started_date } = game;
    let lobbyPlayerNames = players.map((p) => p.username);

    if (lobbyPlayerNames.length > 0) {
      let inProgress = started_date > 0 ? ' (In Progess)' : '';
      let decodedName = Buffer.from(game_name, 'base64')
        .toString('ascii')
        .slice(0, 16)
        .trim();
      let suffix = Buffer.from(game_name, 'base64')
        .toString('ascii')
        .slice(16)
        .trim();

      decodedName === "B41's" &&
        console.log(decodedName, suffix, game.generic_field_3);
      onlineEmbed.addFields({
        name:
          decodedName + `  -  (${players.length}/${max_players})${inProgress}`,
        value:
          '```' +
          lobbyPlayerNames
            .sort((a, b) => b.localeCompare(a))
            .reverse()
            .map((p) => `\n  ${p}  `)
            .join(' ') +
          '```',
      });
    }
  }

  if (Array.from(games).length < 1) {
    onlineEmbed.addFields({
      name: 'No Games',
      value: '\u200B',
    });
  }

  onlineEmbed.addFields({ name: '\u200B', value: '\u200B' });

  return onlineEmbed;
}

/**
 * This is the main function that starts the process.
 * @param client The active discord client instance.
 */
export async function checkOnlineUYAPlayers(_client: Discord.Client) {
  client = _client;
  await checkPlayersAndGames();
}
