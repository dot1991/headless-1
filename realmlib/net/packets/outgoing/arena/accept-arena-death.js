"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcceptArenaDeathPacket = void 0;
const packet_type_1 = require("../../../packet-type");
/**
 * Sent to accept a death in the arena.
 */
class AcceptArenaDeathPacket {
    constructor() {
        this.type = packet_type_1.PacketType.ACCEPT_ARENA_DEATH;
        this.propagate = true;
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
exports.AcceptArenaDeathPacket = AcceptArenaDeathPacket;
