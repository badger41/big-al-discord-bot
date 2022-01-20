import { ChatModel } from '.';
import { MessageEmbed } from 'discord.js';
import { SnarkyRemarks } from './types';
import fetch from 'node-fetch';


const uyaTeamsCommands: string[] = ['!uyaTeams', '!uyateams'];

const uyaAnalyticsUrl = process.env.UYA_ANALYTICS_URL;

export const teamsRemarks: string[] = [
  "Let's see here... Aha!",
  'pfft, amateur. Give me a challenge next time.',
  "look's like I'm doing all the work, as usual...",
];

export async function uyaTeamsRequest(model: ChatModel) {
  if (!uyaTeamsCommands.includes(model.command)) return;

  // Game was not provided
  if (!model.args || model.args.length < 1) {
    model.rawMessage.reply(
      "you didn't specify a game! \n `!uyaTeams 0` for example."
    );
    return
  }

  // game provided
  const game = model.args.join(' ').trim();

  // Query endpoint
  let teams = await getTeamsFromEndpoint(game);

  if (teams.error != undefined) {
      model.rawMessage.reply(
        `${teams.error}.`
      );
      return
  }

  let description = '';

  let i = 0;

  for (let [key, value] of Object.entries(teams)) {
    let v = typeof value === 'number' ? round2Places(value*100) : 0;
    description += `Team ${i == 0 ? 'A' : 'B'} (${v}% win): ` + key + '\n';
    i+= 1;
  }

  // Process teams command
  let teamsEmbed = new MessageEmbed()
    .setColor('#0080FF')
    .setTitle('Balanced Teams')
    .setDescription('```' + description + '```');

  model.rawMessage.reply(`${teamsRemarks[randomInt(teamsRemarks.length)]}`);
  model.rawMessage.reply([teamsEmbed]);
}

/**
 * Get the teams from Nicks endpoint
 */
async function getTeamsFromEndpoint(game: string) {
  console.log(`querying uya-teams for ${game} at: ${uyaAnalyticsUrl}/model/${game}`);
  let result = await fetch(`${uyaAnalyticsUrl}/model/${game}`);

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

function round2Places(num: number) {
  return (Math.round(num * 100) / 100).toFixed(2);
}
