"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerHitPacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Sent when the player is hit.
 */
class PlayerHitPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.PLAYERHIT;
        this.bulletId = 0;
        this.objectId = 0;
    }
    write(writer) {
        writer.writeUnsignedByte(this.bulletId);
        writer.writeInt32(this.objectId);
    }
    read(reader) {
        this.bulletId = reader.readUnsignedByte();
        this.objectId = reader.readInt32();
    }
}
exports.PlayerHitPacket = PlayerHitPacket;
