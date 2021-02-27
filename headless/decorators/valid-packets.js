"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const incomingPackets = __importStar(require("../../realmlib/net/packets/incoming"));
/**
 * A list of all packet types that are valid for a packet hook.
 */
exports.VALID_PACKET_HOOKS = Object.keys(incomingPackets);
