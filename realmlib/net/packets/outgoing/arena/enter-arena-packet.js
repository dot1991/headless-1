"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnterArenaPacket = void 0;
const packet_type_1 = require("../../../packet-type");
/**
 * Sent to enter the arena.
 */
class EnterArenaPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.ENTER_ARENA;
        this.propagate = true;
        this.currency = 0;
    }
    write(writer) {
        writer.writeInt32(this.currency);
    }
    read(reader) {
        this.currency = reader.readInt32();
    }
}
exports.EnterArenaPacket = EnterArenaPacket;
