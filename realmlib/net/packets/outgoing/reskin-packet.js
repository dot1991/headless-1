"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReskinPacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Sent to activate a new skin for the current character.
 */
class ReskinPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.RESKIN;
        this.skinId = 0;
    }
    write(writer) {
        writer.writeInt32(this.skinId);
    }
    read(reader) {
        this.skinId = reader.readInt32();
    }
}
exports.ReskinPacket = ReskinPacket;
