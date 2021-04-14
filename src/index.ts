import * as dotenv from "dotenv";
import Discord from "discord.js";
import { commands, ChatModel } from "./chat";
/**
 * Initialize dotenv so we can easily access custom env variables.
 */
dotenv.config();

/**
 * Initialize the discord client and login.
 */
const client = new Discord.Client();
client.login(process.env.BIG_AL_BOT_TOKEN);

/**
 * Take incoming messages and route them through the chat parsers.
 */
client.on("message", (msg) => {
  const message = msg.content;
  const channel = msg.channel;
  const parts = msg.content.split(/ +/);
  const command = parts[0];
  const args = parts.slice(1);
  const model: ChatModel = {
    rawMessage: msg,
    command,
    channel,
    sender: msg.author,
    args,
  };
  for (let command of commands) {
    command(model);
  }
});
