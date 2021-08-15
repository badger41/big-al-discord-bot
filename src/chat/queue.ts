import Discord, { TextChannel, MessageEmbed, Message } from 'discord.js';
import { ChatModel } from '.';
import { getRoleIds } from './types/role.types';
import { getChannelIds } from './types/channel.types';
import moment, { duration } from 'moment';
import { env } from 'node:process';

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

// 
export async function checkQueueDL(client: Discord.Client) {
  for (let userTimestamps of queueTimestamps) {
    for (let roleTimestamp of userTimestamps[1].filter(x=>x.game == 'dl')) {
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

export async function clearQueueRole(client: Discord.Client) {
  // get dev/prod role ids
  let roleIds = getRoleIds();

  queueTimestamps =  new Map<string, RoleTimestamp[]>();
  for (let guild of await client.guilds.cache) {
    for (let member of guild[1].members.cache) {
      if (member[1].roles.cache.has(roleIds.Contestant)) {
        await member[1].roles.remove(roleIds.Contestant);
      }
    }
  }
}

// 
export async function dlQueueRequest(model: ChatModel) {
  if (!queueCommands.includes(model.command)) return;

  if (!model.args || model.args.length < 1) {
    model.rawMessage.reply(
      "you didn't specify a game to queue! \n Use `!queue dl`."
    );
  } else {
    let isDL = queueDLGames.includes(model.args[0].toLocaleLowerCase());
    let isUYA = queueUYAGames.includes(model.args[0].toLocaleLowerCase());
    let isValid = (isDL && process.env.DL_QUEUE_ENABLED === 'true') || (isUYA && process.env.UYA_QUEUE_ENABLED === 'true');
    if (!isValid) {
      model.rawMessage.reply(
        "you didn't specify a valid game to queue! \n Use `!queue dl`."
      );
    } else if (isDL) {
      await dlQueue(model);
    } else if (isUYA) {
      // todo
    }
  }
}

export function queueDLGamesUpdated(client: Discord.Client, games: any[]) {
  if (process.env.DL_QUEUE_ENABLED !== 'true') return;

  let newGames = games.filter(x=> !lastDLGames.includes(x.Id));
  let roleIds = getRoleIds();
  let channelIds = getChannelIds();
  
  if (newGames.length > 0) {
    alertRole(client, roleIds.Contestant, `New Deadlocked games are available at <#${channelIds['DL Online Players']}>: ${newGames.map(x=> x.GameName).join(', ')}`);
  }

  lastDLGames = games.map(x=>x.Id);
}

async function dlQueue(model: ChatModel) {
  // get dev/prod role ids
  let roleIds = getRoleIds();

  //
  let role = await model.rawMessage.guild?.roles.fetch(roleIds.Contestant);
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

async function alertRole(client: Discord.Client, roleId: string, message: string) {
  let channelIds = getChannelIds();
  let channel = await client.channels.fetch(channelIds['DL Queue Alert']) as TextChannel;
  if (channel == null) {
    console.error('no channel configured for deadlocked queue');
    return;
  }
  
  channel.send(`<@&${roleId}>, ${message}`);
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
