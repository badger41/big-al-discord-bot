/**
 * Export all of the usable types
 */
export * from "./types";

/**
 * Import all of the applicable chat commands.
 */
import { skinRequest } from "./skin";
import { queueRequest } from "./queue";
import { uyaStatRequest } from "./uya-stats";

export const commands = [
  skinRequest,
  queueRequest,
  uyaStatRequest,
];
