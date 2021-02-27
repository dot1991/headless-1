"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnemyShootPacket = void 0;
const world_pos_data_1 = require("../../data/world-pos-data");
const packet_type_1 = require("../../packet-type");
/**
 * Received when a visible enemy shoots a projectile.
 */
class EnemyShootPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.ENEMYSHOOT;
        this.bulletId = 0;
        this.ownerId = 0;
        this.bulletType = 0;
        this.startingPos = new world_pos_data_1.WorldPosData();
        this.angle = 0;
        this.damage = 0;
        this.numShots = 0;
        this.angleInc = 0;
    }
    read(reader) {
        this.bulletId = reader.readUnsignedByte();
        this.ownerId = reader.readInt32();
        this.bulletType = reader.readUnsignedByte();
        this.startingPos.read(reader);
        this.angle = reader.readFloat();
        this.damage = reader.readShort();
        if (reader.index < reader.length) {
            this.numShots = reader.readUnsignedByte();
            this.angleInc = reader.readFloat();
        }
        else {
            this.numShots = 1;
            this.angleInc = 0;
        }
    }
    write(writer) {
        writer.writeUnsignedByte(this.bulletId);
        writer.writeInt32(this.ownerId);
        writer.writeUnsignedByte(this.bulletType);
        this.startingPos.write(writer);
        writer.writeFloat(this.angle);
        writer.writeShort(this.damage);
        if (this.numShots !== 1) {
            writer.writeUnsignedByte(this.numShots);
            writer.writeFloat(this.angleInc);
        }
    }
}
exports.EnemyShootPacket = EnemyShootPacket;
