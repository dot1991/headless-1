"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArenaDeathPacket = void 0;
const packet_type_1 = require("../../../packet-type");
/**
 * Received when the player has been killed in the arena.
 */
class ArenaDeathPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.ARENA_DEATH;
        this.propagate = true;
        this.cost = 0;
    }
    read(reader) {
        this.cost = reader.readInt32();
    }
    write(writer) {
        writer.writeInt32(this.cost);
    }
}
exports.ArenaDeathPacket = ArenaDeathPacket;
