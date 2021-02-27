"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerShootPacket = void 0;
const world_pos_data_1 = require("../../data/world-pos-data");
const packet_type_1 = require("../../packet-type");
/**
 * Sent when the player shoots a projectile.
 */
class PlayerShootPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.PLAYERSHOOT;
        this.time = 0;
        this.bulletId = 0;
        this.containerType = 0;
        this.startingPos = new world_pos_data_1.WorldPosData();
        this.angle = 0;
        this.speedMult = 0;
        this.lifeMult = 0;
        this.isBurst = false;
    }
    write(writer) {
        writer.writeInt32(this.time);
        writer.writeByte(this.bulletId);
        writer.writeShort(this.containerType);
        this.startingPos.write(writer);
        writer.writeFloat(this.angle);
        // NB(thomas-crane): the client uses AS3's `int` function which is
        // equivalent to `Math.floor` in JS.
        writer.writeShort(Math.floor(this.speedMult * 1000));
        writer.writeShort(Math.floor(this.lifeMult * 1000));
        writer.writeBoolean(this.isBurst);
    }
    read(reader) {
        this.time = reader.readInt32();
        this.bulletId = reader.readByte();
        this.containerType = reader.readShort();
        this.startingPos.read(reader);
        this.angle = reader.readFloat();
        this.speedMult = Math.floor(reader.readShort() / 1000);
        this.lifeMult = Math.floor(reader.readShort() / 1000);
        this.isBurst = reader.readBoolean();
    }
}
exports.PlayerShootPacket = PlayerShootPacket;
