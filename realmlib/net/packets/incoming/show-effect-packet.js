"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShowEffectPacket = void 0;
const data_1 = require("../../data");
const packet_type_1 = require("../../packet-type");
/**
 * Received to tell the player to display an effect such as an AOE grenade.
 */
class ShowEffectPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.SHOWEFFECT;
        this.effectType = 0;
        this.targetObjectId = 0;
        this.pos1 = new data_1.WorldPosData();
        this.pos2 = new data_1.WorldPosData();
        this.color = 0;
        this.duration = 0;
    }
    read(reader) {
        this.effectType = reader.readUnsignedByte();
        let loc2 = reader.readUnsignedByte();
        if (loc2 & 64) {
            this.targetObjectId = new data_1.CompressedInt().read(reader);
        }
        else {
            this.targetObjectId = 0;
        }
        if (loc2 & 2) {
            this.pos1.x = reader.readFloat();
        }
        else {
            this.pos1.x = 0;
        }
        if (loc2 & 4) {
            this.pos1.y = reader.readFloat();
        }
        else {
            this.pos1.y = 0;
        }
        if (loc2 & 8) {
            this.pos2.x = reader.readFloat();
        }
        else {
            this.pos2.x = 0;
        }
        if (loc2 & 16) {
            this.pos2.y = reader.readFloat();
        }
        else {
            this.pos2.y = 0;
        }
        if (loc2 & 1) {
            this.color = reader.readInt32();
        }
        else {
            this.color = 4294967295;
        }
        if (loc2 & 32) {
            this.duration = reader.readFloat();
        }
        else {
            this.duration = 1;
        }
    }
    write(writer) {
        writer.writeUnsignedByte(this.effectType);
        new data_1.CompressedInt().write(writer, this.targetObjectId);
        this.pos1.write(writer);
        this.pos2.write(writer);
        writer.writeInt32(this.color);
        writer.writeFloat(this.duration);
    }
}
exports.ShowEffectPacket = ShowEffectPacket;
