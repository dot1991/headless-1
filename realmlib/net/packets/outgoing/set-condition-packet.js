"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetConditionPacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Sent when the player inflicts a condition effect.
 */
class SetConditionPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.SETCONDITION;
        this.conditionEffect = 0;
        this.conditionDuration = 0;
    }
    write(writer) {
        writer.writeByte(this.conditionEffect);
        writer.writeFloat(this.conditionDuration);
    }
    read(reader) {
        this.conditionEffect = reader.readByte();
        this.conditionDuration = reader.readFloat();
    }
}
exports.SetConditionPacket = SetConditionPacket;
