/**
 * Export all of the usable types
 */
export * from "./types";

/**
 * Import all of the applicable chat commands.
 */
import { skinRequest } from "./skin";
import { dlQueueRequest } from "./queue";

export const commands = [skinRequest,dlQueueRequest];
