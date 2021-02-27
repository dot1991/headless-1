"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DamagePacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Received to tell the player about damage done to other players and enemies.
 */
class DamagePacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.DAMAGE;
        this.targetId = 0;
        this.effects = [];
        this.damageAmount = 0;
        this.kill = false;
        this.armorPierce = false;
        this.bulletId = 0;
        this.objectId = 0;
    }
    read(reader) {
        this.targetId = reader.readInt32();
        const effectsLen = reader.readUnsignedByte();
        this.effects = new Array(effectsLen);
        for (let i = 0; i < effectsLen; i++) {
            this.effects[i] = reader.readUnsignedByte();
        }
        this.damageAmount = reader.readUnsignedShort();
        this.kill = reader.readBoolean();
        this.armorPierce = reader.readBoolean();
        this.bulletId = reader.readUnsignedByte();
        this.objectId = reader.readInt32();
    }
    write(writer) {
        writer.writeInt32(this.targetId);
        writer.writeUnsignedByte(this.effects.length);
        for (const effect of this.effects) {
            writer.writeUnsignedByte(effect);
        }
        writer.writeUnsignedShort(this.damageAmount);
        writer.writeBoolean(this.kill);
        writer.writeBoolean(this.armorPierce);
        writer.writeUnsignedByte(this.bulletId);
        writer.writeInt32(this.objectId);
    }
}
exports.DamagePacket = DamagePacket;
