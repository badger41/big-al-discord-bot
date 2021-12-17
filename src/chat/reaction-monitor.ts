import {
  Client,
  Message,
  MessageReaction,
  TextChannel,
  User,
} from 'discord.js';
import * as dotenv from 'dotenv';
import { ROLE_REACTIONS } from './types/reaction.types';

/**
 * Initialize dotenv so we can easily access custom env variables.
 */
dotenv.config();

const monitoredChannelId = process.env.REACTION_CHANNEL_ID;
const monitoredMessageId = process.env.REACTION_MESSAGE_ID;

export function initMessageReactionMonitor(client: Client) {
  if (monitoredChannelId != null && monitoredMessageId != null) {
    let channel = client.channels.cache?.get(monitoredChannelId) as TextChannel;

    if (channel != null) {
      channel.messages.fetch(monitoredMessageId).then((message) => {
        if (message != null) {
          syncReactions(message, channel);
          message.client.addListener('messageReactionAdd', (event, user) =>
            handleReactionAdd(event, user, channel)
          );
          message.client.addListener('messageReactionRemove', (event, user) =>
            handleReactionRemove(event, user, channel)
          );
        }
      });
    }
  }
}

/**
 * This checks all reactions on the message on startup
 * and retroactively applies roles that are missing.
 * Note: does not remove roles if the user removed their reaction while the bot was offline.
 */
function syncReactions(message: Message, channel: TextChannel) {
  message.reactions.cache.forEach((reaction) => {
    if (message.id === monitoredMessageId) {
      let emojiId = reaction.emoji?.id;
      if (emojiId) {
        let roleId = ROLE_REACTIONS[emojiId];
        if (roleId) {
          reaction.users.fetch().then((usersColl) => {
            let users = Array.from(usersColl.values());
            users.forEach((user) => {
              channel.guild.members.fetch(user.id).then((member) => {
                if (member) {
                  member.roles.add(roleId);
                }
              });
            });
          });
        } else {
          // Remove unnecessary emoji reactions
          reaction.remove();
        }
      } else {
        // Remove any other unnecessary reactions
        reaction.remove();
      }
    }
  });
}

function handleReactionAdd(
  event: MessageReaction,
  user: User,
  channel: TextChannel
) {
  if (event.message.id === monitoredMessageId) {
    let emojiId = event.emoji?.id;

    if (emojiId) {
      let roleId = ROLE_REACTIONS[emojiId];
      if (roleId) {
        let member = channel.guild.member(user);
        if (member) {
          member.roles.add(roleId);
        }
      } else {
        event.remove();
      }
    } else {
      event.remove();
    }
  }
}

function handleReactionRemove(
  event: MessageReaction,
  user: User,
  channel: TextChannel
) {
  if (event.message.id === monitoredMessageId) {
    let emojiId = event.emoji?.id;

    if (emojiId) {
      let roleId = ROLE_REACTIONS[emojiId];
      if (roleId) {
        let member = channel.guild.member(user);
        if (member) {
          member.roles.remove(roleId);
        }
      }
    }
  }
}
