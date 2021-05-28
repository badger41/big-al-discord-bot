import Discord, { TextChannel, MessageEmbed, Message } from 'discord.js';
import fetch from 'node-fetch';
import { AccountStatus } from './types';
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

let token: string;
let client: Discord.Client;
let existingMessage: Message;

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
 * Grab all online accounts and the games they are in.
 */
async function checkPlayersAndGames() {
  console.log('checking players');
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
    let response = await result.json();
    processOnlinePlayers(<AccountStatus[]>response);
  } else {
    throw new Error(await result.json());
  }
}

async function processOnlinePlayers(players: AccountStatus[]) {
  const channelId = process.env.DL_PLAYERS_ONLINE_CHANNEL_ID;
  if (channelId) {
    const channel = client.channels.cache.get(channelId);
    if (channel?.isText) {
      let embed = createEmbed(players);
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

  await checkPlayersAndGames();
}

function createEmbed(onlinePlayers: AccountStatus[]) {
  // Construct a list of current lobbies based on the players
  let lobbies = new Set<string>();
  onlinePlayers.map((p) => p.GameName && lobbies.add(p.GameName));

  let playerNames = onlinePlayers.map((p) => p.AccountName);
  let onlineEmbed = new MessageEmbed()
    .setColor('#AA0000')
    .setTitle(`Players Online - ${onlinePlayers.length}`)
    .setThumbnail('https://dl.uyaonline.com/assets/img/dreadzone.png')
    .setFooter('Last Updated')
    .setTimestamp(new Date())
    .setDescription(
      '```' +
        playerNames
          .sort((a, b) => b.localeCompare(a))
          .reverse()
          .map((p) => `\n  ${p}  `)
          .join(' ') +
        '```'
    )
    .addFields({ name: '\u200B', value: 'Active Games:' });

  for (let lobby of lobbies) {
    let lobbyPlayers = onlinePlayers
      .filter((a) => a.GameName == lobby)
      .map((a) => a.AccountName);
    onlineEmbed.addFields({
      name: lobby + `  -  (${lobbyPlayers.length}/10)`,
      value:
        '```' +
        lobbyPlayers
          .sort((a, b) => b.localeCompare(a))
          .reverse()
          .map((p) => `\n  ${p}  `)
          .join(' ') +
        '```',
    });
  }

  if (Array.from(lobbies).length < 1) {
    onlineEmbed.addFields({
      name: 'No Games',
      value: '\u200B',
    });
  }

  onlineEmbed.addFields({ name: '\u200B', value: '\u200B' });

  return onlineEmbed;
}
