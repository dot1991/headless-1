"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllyShootPacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Received when another player shoots a projectile.
 */
class AllyShootPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.ALLYSHOOT;
        this.bulletId = 0;
        this.ownerId = 0;
        this.containerType = 0;
        this.angle = 0;
        this.bard = false;
    }
    read(reader) {
        this.bulletId = reader.readUnsignedByte();
        this.ownerId = reader.readInt32();
        this.containerType = reader.readShort();
        this.angle = reader.readFloat();
        this.bard = reader.readBoolean();
    }
    write(writer) {
        writer.writeUnsignedByte(this.bulletId);
        writer.writeInt32(this.ownerId);
        writer.writeShort(this.containerType);
        writer.writeFloat(this.angle);
        writer.writeBoolean(this.bard);
    }
}
exports.AllyShootPacket = AllyShootPacket;
