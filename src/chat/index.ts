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
import { uyaClanRequest } from "./uya-clans";

export const commands = [
  skinRequest,
  queueRequest,
  uyaStatRequest,
  uyaClanRequest
];

