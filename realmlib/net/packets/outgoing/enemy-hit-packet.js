"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnemyHitPacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Sent when an enemy has been hit by the player.
 */
class EnemyHitPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.ENEMYHIT;
        this.time = 0;
        this.bulletId = 0;
        this.targetId = 0;
        this.kill = false;
    }
    write(writer) {
        writer.writeInt32(this.time);
        writer.writeUnsignedByte(this.bulletId);
        writer.writeInt32(this.targetId);
        writer.writeBoolean(this.kill);
    }
    read(reader) {
        this.time = reader.readInt32();
        this.bulletId = reader.readUnsignedByte();
        this.targetId = reader.readInt32();
        this.kill = reader.readBoolean();
    }
}
exports.EnemyHitPacket = EnemyHitPacket;
