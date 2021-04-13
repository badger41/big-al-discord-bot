import { Message, NewsChannel, TextChannel, DMChannel, User } from "discord.js";

export interface ChatModel {
  rawMessage: Message;
  sender: User;
  command: string;
  args: string[];
  channel: NewsChannel | TextChannel | DMChannel;
}
