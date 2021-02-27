"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtherHitPacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Sent when an object or other player has been hit by an enemy projectile.
 */
class OtherHitPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.OTHERHIT;
        this.time = 0;
        this.bulletId = 0;
        this.objectId = 0;
        this.targetId = 0;
    }
    write(writer) {
        writer.writeInt32(this.time);
        writer.writeUnsignedByte(this.bulletId);
        writer.writeInt32(this.objectId);
        writer.writeInt32(this.targetId);
    }
    read(reader) {
        this.time = reader.readInt32();
        this.bulletId = reader.readUnsignedByte();
        this.objectId = reader.readInt32();
        this.targetId = reader.readInt32();
    }
}
exports.OtherHitPacket = OtherHitPacket;
