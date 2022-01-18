import { ChatModel } from '.';
import { MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';

const uyaBasicStatCommands: string[] = ['!uyaStats', '!uyastats'];
const uyaEloCommands: string[] = ['!uyaElo', '!uyaelo'];
const uyaStatCommands: string[] = uyaBasicStatCommands.concat(uyaEloCommands);

const snarkyRemarks: string[] = [
  'pfft, amateur. Give me a challenge next time.',
  "look's like I'm doing all the work, as usual...",
  "here's your cheat codes... you can thank me later.",
  'aaaaaaand done!',
  "_you're welcome..._",
];

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
    return
  };

  // Process basic stats
  if (uyaBasicStatCommands.includes(model.command)) {


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

function createBasicStatEmbed(username: string,
                              overall_elo: number,
                              ctf_elo: number,
                              siege_elo: number,
                              deathmatch_elo: number) {
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
