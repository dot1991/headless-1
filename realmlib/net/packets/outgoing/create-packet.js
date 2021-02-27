"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Sent to create a new character.
 */
class CreatePacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.CREATE;
        this.classType = 0;
        this.skinType = 0;
        this.isChallenger = false;
    }
    write(writer) {
        writer.writeShort(this.classType);
        writer.writeShort(this.skinType);
        writer.writeBoolean(this.isChallenger);
    }
    read(reader) {
        this.classType = reader.readShort();
        this.skinType = reader.readShort();
        this.isChallenger = reader.readBoolean();
    }
}
exports.CreatePacket = CreatePacket;
