import Discord, { TextChannel, MessageEmbed, Message } from 'discord.js';
import { ChatModel } from '.';
import moment, { duration } from 'moment';

const queueCommands: string[] = ['!queue'];
const queueDLGames: string[] = ['dl','deadlocked','gladiator','rac4'];
const queueUYAGames: string[] = ['uya','rac3'];

// 
interface RoleTimestamp {
  userId: string,
  roleId: string,
  expirationTime: string,
  game: string,
  guildId: string,
  isActive: boolean
}

// 
let queueTimestamps = new Map<string, RoleTimestamp[]>();
let lastDLGames: Number[] = [];
let lastUYAGames: Number[] = [];

// 
export async function checkQueueDL(client: Discord.Client) {
  await checkQueue(client, queueDLGames[0]);
}

// 
export async function checkQueueUYA(client: Discord.Client) {
  await checkQueue(client, queueDLGames[0]);
}

export async function clearQueueRole(client: Discord.Client) {
  // get all temp queue roles
  let roleIds: string[] = [
    getDLContestantRoleId(),
    getUYAContestantRoleId()
  ];

  queueTimestamps =  new Map<string, RoleTimestamp[]>();
  for (let guild of await client.guilds.cache) {
    for (let member of guild[1].members.cache) {
      for (let roleId of roleIds) {
        if (member[1].roles.cache.has(roleId)) {
          await member[1].roles.remove(roleId);
        }
      }
    }
  }
}

// 
export async function queueRequest(model: ChatModel) {
  if (!queueCommands.includes(model.command)) return;

  if (!model.args || model.args.length < 1) {
    model.rawMessage.reply(
      `you didn't specify a game to queue! \n ${getUsageExample()}.`
    );
  } else {
    let isDL = queueDLGames.includes(model.args[0].toLocaleLowerCase());
    let isUYA = queueUYAGames.includes(model.args[0].toLocaleLowerCase());
    let isValid = (isDL && isDLQueueEnabled()) || (isUYA && isUYAQueueEnabled());
    if (!isValid) {
      model.rawMessage.reply(
        `you didn't specify a valid game to queue! \n ${getUsageExample()}.`
      );
    } else if (isDL) {
      await dlQueue(model);
    } else if (isUYA) {
      await uyaQueue(model);
    }
  }
}

export function queueDLGamesUpdated(client: Discord.Client, games: any[]) {
  if (!isDLQueueEnabled()) return;

  let newGames = games.filter(x=> !lastDLGames.includes(x.Id));
  let contestantRoleId = getDLContestantRoleId();
  let onlinePlayersChannelId = getDLOnlinePlayersChannelId();
  let alertChannelId = getDLQueueAlertChannelId();
  
  if (newGames.length > 0) {
    alertRole(client, alertChannelId, contestantRoleId, `new Deadlocked games are available at <#${onlinePlayersChannelId}>: ${newGames.map(x=> x.GameName).join(', ')}`);
  }

  lastDLGames = games.map(x=>x.Id);
}

export function queueUYAGamesUpdated(client: Discord.Client, games: any[]) {
  if (!isUYAQueueEnabled()) return;

  let newGames = games.filter(x=> !lastUYAGames.includes(x.Id));
  let contestantRoleId = getUYAContestantRoleId();
  let onlinePlayersChannelId = getUYAOnlinePlayersChannelId();
  let alertChannelId = getUYAQueueAlertChannelId();
  
  if (newGames.length > 0) {
    alertRole(client, alertChannelId, contestantRoleId, `new Up Your Arsenal games are available at <#${onlinePlayersChannelId}>: ${newGames.map(x=> getUYAGameName(x)).join(', ')}`);
  }

  lastUYAGames = games.map(x=>x.Id);
}

async function dlQueue(model: ChatModel) {
  let contestantRoleId = getDLContestantRoleId();

  //
  let role = await model.rawMessage.guild?.roles.fetch(contestantRoleId);
  if (role != null) {
    // try and add
    let result = await model.rawMessage.member?.roles.add(role);
    let duration = moment.duration(60, 'minutes');

    // update role timestamp
    updateTimestamp(model.sender.id, role.id, queueDLGames[0], model.rawMessage.guild?.id ?? '', duration);

    // reply to user
    model.rawMessage.reply(`you've been added to the Deadlocked queue for ${duration.asMinutes()} minute(s).`);
  }
}

async function uyaQueue(model: ChatModel) {
  let contestantRoleId = getUYAContestantRoleId();

  //
  let role = await model.rawMessage.guild?.roles.fetch(contestantRoleId);
  if (role != null) {
    // try and add
    let result = await model.rawMessage.member?.roles.add(role);
    let duration = moment.duration(60, 'minutes');

    // update role timestamp
    updateTimestamp(model.sender.id, role.id, queueUYAGames[0], model.rawMessage.guild?.id ?? '', duration);

    // reply to user
    model.rawMessage.reply(`you've been added to the Up Your Arsenal queue for ${duration.asMinutes()} minute(s).`);
  }
}

async function alertRole(client: Discord.Client, channelId: string, roleId: string, message: string) {
  let channel = await client.channels.fetch(channelId) as TextChannel;
  if (channel == null) {
    console.error('no channel configured for deadlocked queue');
    return;
  }
  
  channel.send(`<@&${roleId}>, ${message}`);
}

// 
async function checkQueue(client: Discord.Client, game: string) {
  for (let userTimestamps of queueTimestamps) {
    for (let roleTimestamp of userTimestamps[1].filter(x=>x.game == game)) {
      let expirationTime = moment.utc(roleTimestamp.expirationTime);
      if (moment.utc() >= expirationTime) {
        let guild = await client.guilds.fetch(roleTimestamp.guildId);
        let guildMember = await guild.members.fetch(roleTimestamp.userId);

        if (guildMember != null) {
          await guildMember.roles.remove(roleTimestamp.roleId);
          roleTimestamp.isActive = false;
        }
      }
    }
  }
}

function updateTimestamp(userId: string, roleId: string, game: string, guildId: string, duration: moment.Duration) {

  // get or add user timestamps
  let userTimestamps = queueTimestamps.get(userId);
  if (userTimestamps == null) {
    userTimestamps = [];
    queueTimestamps.set(userId, userTimestamps);
  }

  // find timestamp with role
  let roleTimestamp = userTimestamps.find(x => x.roleId == roleId);
  if (roleTimestamp == null)
  {
    // create new entry
    roleTimestamp = {
      roleId,
      userId,
      expirationTime: getExpirationTime(duration),
      game,
      guildId,
      isActive: true
    };
    userTimestamps.push(roleTimestamp);
  }
  else {
    // update timestamp
    roleTimestamp.isActive = true;
    roleTimestamp.expirationTime = getExpirationTime(duration);
  }
}

function getExpirationTime(duration: moment.Duration) {
  return moment.utc().add(duration).toISOString()
}

function getUsageExample() {
  let result = "Use ";
  if (isDLQueueEnabled())
    result += `\`!queue ${queueDLGames[0]}\` `;
  if (isUYAQueueEnabled())
    result += `\`!queue ${queueUYAGames[0]}\` `;
  return result;
}

function isDLQueueEnabled() {
  return process.env.DL_QUEUE_ENABLED === 'true';
}

function getDLOnlinePlayersChannelId() {
  return process.env.DL_PLAYERS_ONLINE_CHANNEL_ID as string;
}

function getDLQueueAlertChannelId() {
  return process.env.DL_QUEUE_ALERTS_CHANNEL_ID as string;
}

function getDLContestantRoleId() {
  return process.env.DL_QUEUE_CONTESTANT_ROLE_ID as string;
}

function isUYAQueueEnabled() {
  return process.env.UYA_QUEUE_ENABLED === 'true';
}

function getUYAOnlinePlayersChannelId() {
  return process.env.UYA_PLAYERS_ONLINE_CHANNEL_ID as string;
}

function getUYAQueueAlertChannelId() {
  return process.env.UYA_QUEUE_ALERTS_CHANNEL_ID as string;
}

function getUYAContestantRoleId() {
  return process.env.UYA_QUEUE_CONTESTANT_ROLE_ID as string;
}

function getUYAGameName(game: any) {
  let name64 = game.game_name;
  let name = Buffer.from(name64, 'base64').toString();
  return name.substring(0, 16).trim();
}
