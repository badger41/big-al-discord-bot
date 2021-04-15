import { ChatModel } from '.';
import { MessageEmbed } from 'discord.js';

interface SkinModel {
  key: string;
  name: string;
  hexCode: number;
}
interface SkinCode {
  key: string;
  name: string;
  code: string;
}

const skinCommands: string[] = ['!skinCode', '!unlockSkins', '!skins'];
const snarkyRemarks: string[] = [
  'pfft, amateur. Give me a challenge next time.',
  "look's like I'm doing all the work, as usual...",
  "here's your cheat codes... you can thank me later.",
  'aaaaaaand done!',
  "_you're welcome..._",
];
const skins = [
  { key: 'UYA', name: 'Nefarious', hexCode: 0xe1234567 },
  { key: 'UYA', name: 'Dan', hexCode: 0xe76b492c },
  { key: 'DL', name: 'Mr. Sunshine', hexCode: 0x14202239 },
  { key: 'DL', name: 'Jak', hexCode: 0x02050710 },
  { key: 'DL', name: 'Renegade', hexCode: 0x26e41939 },
  { key: 'DL', name: 'Eugene', hexCode: 0x2dafbf84 },
  { key: 'DL', name: 'Vernon', hexCode: 0xcc97b7af },
];

export function skinRequest(model: ChatModel) {
  if (!skinCommands.includes(model.command)) return;
  if (!model.args || model.args.length < 1) {
    model.rawMessage.reply(
      "you didn't specify a username! \n `!skins Agent Moose` for example."
    );
  } else {
    const username = model.args.join(' ').trim();
    const usernameCode = processUsername(username.toUpperCase());
    const codes = getSkinCodes(usernameCode);

    model.rawMessage.reply([createEmbed(username, codes)]);
    model.rawMessage.reply(`${snarkyRemarks[randomInt(snarkyRemarks.length)]}`);
  }
}

function createEmbed(username: string, skinCodes: SkinCode[]) {
  let skinEmbed = new MessageEmbed()
    .setColor('#0080FF')
    .setTitle(username)
    .setDescription('Your cheat codez')
    .addFields({ name: '\u200B', value: '\u200B' });

  skinEmbed.addFields({
    name: 'Ratchet & Clank: Up Your Arsenal',
    value: '\u200B',
  });
  for (let skinCode of skinCodes.filter((s) => s.key == 'UYA')) {
    skinEmbed.addFields({ name: skinCode.name, value: skinCode.code });
  }
  skinEmbed.addFields({ name: '\u200B', value: '\u200B' });
  skinEmbed.addFields({ name: 'Ratchet: Deadlocked ', value: '\u200B' });
  for (let skinCode of skinCodes.filter((s) => s.key == 'DL')) {
    skinEmbed.addFields({ name: skinCode.name, value: skinCode.code });
  }
  return skinEmbed;
}

function randomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function processUsername(username: string) {
  let usernameResult = 0;
  // Loop through Username and make each character its hexadecimal equivalent
  for (let index = 0, b = username.length; index < b; ++index) {
    // Convert characters to their Character Code number.
    let Char = Number(username.charCodeAt(index));

    // Multiply Char by the current index + 1.
    // We add 1 to the current index because in Deadlocked/UYA the index started at 1, where in this code it started at 0.
    let multiply = Char * (index + 1);

    // Add UsernameVariable to multiply variable, then store it back in UsernameVariable
    usernameResult += multiply;
  }
  return usernameResult;
}

function getSkinCodes(usernameResult: number) {
  let skinCodes: SkinCode[] = [];
  // Loop through all Skins
  for (let skin of skins) {
    // First multiply the Skin and UsernameVariable
    let cheat = (skin.hexCode * usernameResult)
      .toString(16) // Convert to string as a hexadecimal value
      .slice(-8) // Makes sure to only get the last eight characters of the final value.  We don't need anything more.
      .split('') // Splits the value to seperate each character
      .reverse(); // Reverse the value to match the endianness of the PS2

    // This calls the function "createCheat".
    // First argument is the Skins Name.
    // Second argument is the Final Cheat value.
    skinCodes.push(createCheat(skin, cheat));
  }
  return skinCodes;
}

function createCheat(skin: SkinModel, finalValue: string[]) {
  let codeString: string = '';
  // Map hex values to D-pad values
  const codeMap = [
    {
      codes: ['0', '1', '2', '3'],
      text: 'Up',
    },
    {
      codes: ['4', '5', '6', '7'],
      text: 'Down',
    },
    {
      codes: ['8', '9', 'a', 'b'],
      text: 'Left',
    },
    {
      codes: ['c', 'd', 'e', 'f'],
      text: 'Right',
    },
  ];

  // Loop through each of the byte in the Final Value to get d-pad value.
  for (let a of finalValue) {
    codeString += ' ' + codeMap.find((cm) => cm.codes.includes(a))?.text || '?';
  }

  return { key: skin.key, name: skin.name, code: codeString };
}
