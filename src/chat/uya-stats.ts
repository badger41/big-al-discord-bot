import { ChatModel } from '.';
import { MessageEmbed } from 'discord.js';
import { SnarkyRemarks } from './types';
import fetch from 'node-fetch';

const uyaBasicStatCommands: string[] = ['!uyaStats', '!uyastats'];
const uyaEloCommands: string[] = ['!uyaElo', '!uyaelo'];
const uyaAdvStatCommands: string[] = ['!uyaAdvStats', '!uyaadvstats'];
const uyaStatCommands: string[] = uyaBasicStatCommands.concat(uyaEloCommands).concat(uyaAdvStatCommands);



const uyaAnalyticsUrl = process.env.UYA_ANALYTICS_URL;

export async function uyaStatRequest(model: ChatModel) {
  if (!uyaStatCommands.includes(model.command)) return;

  // Username was not provided
  if (!model.args || model.args.length < 1) {
    model.rawMessage.reply(
      "you didn't specify a username! \n `!uyaStats Agent Moose` for example."
    );
    return
  }

  // Username provided
  const username = model.args.join(' ').trim();

  // Query endpoint
  let stats = await getStatsFromEndpoint(username);
  if (Object.keys(stats).length == 0) {
      model.rawMessage.reply(
        "that user doesn't exist!"
      );
      return
  }

  // Process ELO command
  if (uyaEloCommands.includes(model.command)) {
    model.rawMessage.reply([createEloEmbed(
        username,
        stats['advanced_stats']['elo']['overall'],
        stats['advanced_stats']['elo']['CTF'],
        stats['advanced_stats']['elo']['Siege'],
        stats['advanced_stats']['elo']['Deathmatch'],
    )]);
    model.rawMessage.reply(`${SnarkyRemarks[randomInt(SnarkyRemarks.length)]}`);
    return
  };

  // Process basic stats
  if (uyaBasicStatCommands.includes(model.command)) {
    model.rawMessage.reply([createStatEmbed(
        username,
        stats['stats']['overall']['games_played'],
        stats['stats']['overall']['kills'],
        stats['stats']['overall']['deaths'],
        stats['stats']['overall']['overall_base_dmg'],
        stats['stats']['overall']['nodes']
    )]);
    model.rawMessage.reply(`${SnarkyRemarks[randomInt(SnarkyRemarks.length)]}`);
    return
  };

  // Process adv stats
  if (uyaAdvStatCommands.includes(model.command)) {
    model.rawMessage.reply([createAdvStatEmbed(
        username,
        stats['advanced_stats']['per_gm']['wins/loss'],
        stats['advanced_stats']['per_gm']['kills/death'],
        stats['advanced_stats']['per_min']['avg_game_length'],
        stats['advanced_stats']['per_min']['kills/min'],
        stats['stats']['overall']['suicides']
    )]);
    model.rawMessage.reply(`${SnarkyRemarks[randomInt(SnarkyRemarks.length)]}`);
    return
  };
}

function createEloEmbed(username: string, overall_elo: number, ctf_elo: number, siege_elo: number, deathmatch_elo: number) {
  let eloEmbed = new MessageEmbed()
    .setColor('#0080FF')
    .setTitle(username)
    .setDescription('UYA ELO');

  eloEmbed.addFields({
    name: 'Overall',
    value: overall_elo
  });
  eloEmbed.addFields({
    name: 'CTF',
    value: ctf_elo
  });
  eloEmbed.addFields({
    name: 'Siege',
    value: siege_elo
  });
  eloEmbed.addFields({
    name: 'Deathmatch',
    value: deathmatch_elo
  });

  return eloEmbed;
}

function createStatEmbed(username: string,
                              games_played: number,
                              kills: number,
                              deaths: number,
                              base_dmg: number,
                              nodes: number) {
  let eloEmbed = new MessageEmbed()
    .setColor('#0080FF')
    .setTitle(username)
    .setDescription('Basic Stats');

  eloEmbed.addFields({
    name: 'Games Played',
    value: games_played
  });
  eloEmbed.addFields({
    name: 'Total Kills',
    value: kills
  });
  eloEmbed.addFields({
    name: 'Total Deaths',
    value: deaths
  });
  eloEmbed.addFields({
    name: 'Total Base Damage',
    value: base_dmg
  });
  eloEmbed.addFields({
    name: 'Total Nodes Captured',
    value: nodes
  });

  return eloEmbed;
}

function createAdvStatEmbed(username: string,
                              win_loss: number,
                              kd: number,
                              avg_game_len: number,
                              kills_per_min: number,
                              suicides: number) {
  let eloEmbed = new MessageEmbed()
    .setColor('#0080FF')
    .setTitle(username)
    .setDescription('Advanced Stats');

  eloEmbed.addFields({
    name: 'Win/Loss Ratio',
    value: win_loss
  });
  eloEmbed.addFields({
    name: 'Kill/Death Ratio',
    value: kd
  });
  eloEmbed.addFields({
    name: 'Average Game Length (minutes)',
    value: avg_game_len
  });
  eloEmbed.addFields({
    name: 'Kills per minute',
    value: kills_per_min
  });
  eloEmbed.addFields({
    name: 'Total Suicides',
    value: suicides
  });

  return eloEmbed;
}
/**
 * Get the stats from Nicks endpoint
 */
async function getStatsFromEndpoint(username: string) {
  console.log(`querying uya-stats for ${username} at: ${uyaAnalyticsUrl}/players/${username}`);
  let result = await fetch(`${uyaAnalyticsUrl}/players/${username}`);

  if (result.ok) {
    console.log("Result OK!");
    return await result.json();
  } else {
    console.log("uh oh..");
    throw new Error(await result.json());
  }
}

function randomInt(max: number) {
  return Math.floor(Math.random() * max);
}
