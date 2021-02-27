"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerPlayerShootPacket = void 0;
const world_pos_data_1 = require("../../data/world-pos-data");
const packet_type_1 = require("../../packet-type");
/**
 * Received when another player shoots.
 */
class ServerPlayerShootPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.SERVERPLAYERSHOOT;
        this.bulletId = 0;
        this.ownerId = 0;
        this.containerType = 0;
        this.startingPos = new world_pos_data_1.WorldPosData();
        this.angle = 0;
        this.damage = 0;
    }
    read(reader) {
        this.bulletId = reader.readUnsignedByte();
        this.ownerId = reader.readInt32();
        this.containerType = reader.readInt32();
        this.startingPos.read(reader);
        this.angle = reader.readFloat();
        this.damage = reader.readShort();
    }
    write(writer) {
        writer.writeUnsignedByte(this.bulletId);
        writer.writeInt32(this.ownerId);
        writer.writeInt32(this.containerType);
        this.startingPos.write(writer);
        writer.writeFloat(this.angle);
        writer.writeShort(this.damage);
    }
}
exports.ServerPlayerShootPacket = ServerPlayerShootPacket;
