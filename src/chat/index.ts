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
import { uyaAltRequest} from "./uya-alts";
import { uyaTeamsRequest} from "./uya-teams";

export const commands = [
  skinRequest,
  queueRequest,
  uyaStatRequest,
  uyaClanRequest,
  uyaAltRequest,
  uyaTeamsRequest
];
