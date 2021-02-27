"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExaltationUpdatePacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Received when the players exaltation stats update
 */
class ExaltationUpdatePacket {
    constructor() {
        this.type = packet_type_1.PacketType.EXALTATION_BONUS_CHANGED;
        this.objType = 0;
        this.attackProgress = 0;
        this.defenseProgress = 0;
        this.speedProgress = 0;
        this.dexterityProgress = 0;
        this.vitalityProgress = 0;
        this.wisdomProgress = 0;
        this.healthProgress = 0;
        this.manaProgress = 0;
    }
    read(reader) {
        this.objType = reader.readShort();
        this.dexterityProgress = reader.readByte();
        this.speedProgress = reader.readByte();
        this.vitalityProgress = reader.readByte();
        this.wisdomProgress = reader.readByte();
        this.defenseProgress = reader.readByte();
        this.attackProgress = reader.readByte();
        this.manaProgress = reader.readByte();
        this.healthProgress = reader.readByte();
    }
    write(writer) {
        writer.writeShort(this.objType);
        writer.writeByte(this.dexterityProgress);
        writer.writeByte(this.speedProgress);
        writer.writeByte(this.vitalityProgress);
        writer.writeByte(this.wisdomProgress);
        writer.writeByte(this.defenseProgress);
        writer.writeByte(this.attackProgress);
        writer.writeByte(this.manaProgress);
        writer.writeByte(this.healthProgress);
    }
    toString() {
        return `[ExaltationUpdate - 114] ObjectType: ${this.objType}` +
            `DEX: ${this.dexterityProgress}\n` +
            `SPD: ${this.speedProgress}\n` +
            `VIT: ${this.vitalityProgress}\n` +
            `WIS: ${this.wisdomProgress}\n` +
            `DEF: ${this.defenseProgress}\n` +
            `ATK: ${this.attackProgress}\n` +
            `MANA: ${this.manaProgress}\n` +
            `LIFE: ${this.healthProgress}`;
    }
}
exports.ExaltationUpdatePacket = ExaltationUpdatePacket;
