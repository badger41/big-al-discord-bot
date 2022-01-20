import { ChatModel } from '.';
import { MessageEmbed } from 'discord.js';
import { SnarkyRemarks } from './types';
import fetch from 'node-fetch';

const uyaClanCommands: string[] = ['!uyaClan', '!uyaclan'];

const apiUrl = process.env.UYA_SERVER_API_URL;

export async function uyaClanRequest(model: ChatModel) {
  if (!uyaClanCommands.includes(model.command)) return;

  // Username was not provided
  if (!model.args || model.args.length < 1) {
    model.rawMessage.reply(
      "you didn't specify a username! \n `!uyaClan FunClan` for example."
    );
    return
  }

  // Clanname provided
  const clanname = model.args.join(' ').trim();

  // Query endpoint
  let clan_info = await getClanFromEndpoint(clanname);
  if (Object.keys(clan_info).length == 0) {
      model.rawMessage.reply(
        "that clan doesn't exist!"
      );
      return
  }


  let clanEmbed = new MessageEmbed()
    .setColor('#0080FF')
    .setTitle('**' + clan_info['clan_name'] + '**');

  clanEmbed.addFields({
    name: 'Leader',
    value: '```' + clan_info['leader_account_name'] + '```'
  });
  clanEmbed.addFields({
    name: 'Tag',
    value: '```' + clan_info['clan_tag'] + '```'
  });
  clanEmbed.addFields({
    name: 'Stats',
    value: '```' + 'Kills:'.padEnd(10) +  `${clan_info['kills']}\n` + 'Deaths: '.padEnd(10) + `${clan_info['deaths']}\n` + 'Wins: '.padEnd(10) + `${clan_info['wins']}\n` + 'Losses: '.padEnd(10) + `${clan_info['losses']}` + '```'
  });
  clanEmbed.addFields({
    name: 'Members',
    value: '```' + clan_info['members'].join(', ') + '```'
  });

  model.rawMessage.reply([clanEmbed]);
  model.rawMessage.reply(`${SnarkyRemarks[randomInt(SnarkyRemarks.length)]}`);
}

/**
 * Get the stats from Nicks endpoint
 */
async function getClanFromEndpoint(clanname: string) {
  console.log(`querying uya-clans for ${clanname} at: ${apiUrl}/robo/clans/name/${clanname}`);
  let result = await fetch(`${apiUrl}/robo/clans/name/${clanname}`);

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
