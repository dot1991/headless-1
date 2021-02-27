"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EscapePacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Sent to prompt the server to send a `ReconnectPacket` which
 * contains the reconnect information for the Nexus.
 */
class EscapePacket {
    constructor() {
        this.type = packet_type_1.PacketType.ESCAPE;
    }
    //#region packet-specific members
    //#endregion
    write() {
        //
    }
    read() {
        //
    }
}
exports.EscapePacket = EscapePacket;
