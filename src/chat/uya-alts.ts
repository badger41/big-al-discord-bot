import { ChatModel } from '.';
import { MessageEmbed } from 'discord.js';
import { SnarkyRemarks } from './types';
import fetch from 'node-fetch';

const uyaAltCommands: string[] = ['!uyaAlt', '!uyaalt', '!uyaSearch', '!uyasearch'];

const apiUrl = process.env.UYA_SERVER_API_URL;

export async function uyaAltRequest(model: ChatModel) {
  if (!uyaAltCommands.includes(model.command)) return;

  // Username was not provided
  if (!model.args || model.args.length < 1) {
    model.rawMessage.reply(
      "you didn't specify a username! \n `!uyaAlt FourBolt` for example."
    );
    return
  }

  // Clanname provided
  const username = model.args.join(' ').trim();

  // Query endpoint
  let alts = await getAltsFromEndpoint(username);
  if (alts == "[]") {
      model.rawMessage.reply(
        "that user doesn't exist!"
      );
      return
  }

  let altEmbed = new MessageEmbed()
    .setColor('#0080FF')
    .setTitle(username);

  altEmbed.addFields({
    name: 'Associated accounts',
    value: '```' + alts.join(', ') + '```'
  });

  model.rawMessage.reply([altEmbed]);
  model.rawMessage.reply(`${SnarkyRemarks[randomInt(SnarkyRemarks.length)]}`);
}

/**
 * Get the stats from UYA endpoint
 */
async function getAltsFromEndpoint(username: string) {
  console.log(`querying uya-alts for ${username} at: ${apiUrl}/robo/alts/${username}`);
  let result = await fetch(`${apiUrl}/robo/alts/${username}`);

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
