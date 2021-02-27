"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AoePacket = void 0;
const world_pos_data_1 = require("../../data/world-pos-data");
const packet_type_1 = require("../../packet-type");
/**
 * Received when an AoE grenade has hit the ground.
 */
class AoePacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.AOE;
        this.pos = new world_pos_data_1.WorldPosData();
        this.radius = 0;
        this.damage = 0;
        this.effect = 0;
        this.duration = 0;
        this.origType = 0;
        this.color = 0;
        this.armorPiercing = false;
    }
    read(reader) {
        this.pos.read(reader);
        this.radius = reader.readFloat();
        this.damage = reader.readUnsignedShort();
        this.effect = reader.readUnsignedByte();
        this.duration = reader.readFloat();
        this.origType = reader.readUnsignedShort();
        this.color = reader.readInt32();
        this.armorPiercing = reader.readBoolean();
    }
    write(writer) {
        this.pos.write(writer);
        writer.writeFloat(this.radius);
        writer.writeUnsignedShort(this.damage);
        writer.writeUnsignedByte(this.effect);
        writer.writeFloat(this.duration);
        writer.writeUnsignedShort(this.origType);
        writer.writeInt32(this.color);
        writer.writeBoolean(this.armorPiercing);
    }
}
exports.AoePacket = AoePacket;
