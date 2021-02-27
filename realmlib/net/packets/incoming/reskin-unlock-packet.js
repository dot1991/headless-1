"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReskinUnlockPacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Received to notify the player that a new skin has been unlocked.
 */
class ReskinUnlockPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.RESKIN_UNLOCK;
        this.skinId = 0;
    }
    read(reader) {
        this.skinId = reader.readInt32();
    }
    write(writer) {
        writer.writeInt32(this.skinId);
    }
}
exports.ReskinUnlockPacket = ReskinUnlockPacket;
