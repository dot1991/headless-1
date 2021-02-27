"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangePetSkinPacket = void 0;
const packet_type_1 = require("../../../packet-type");
/**
 * Sent to change skin of a pet
 */
class ChangePetSkinPacket {
    constructor() {
        this.type = packet_type_1.PacketType.PET_CHANGE_SKIN_MSG;
        this.petId = 0;
        this.skinType = 0;
        this.currency = 0;
    }
    write(writer) {
        writer.writeInt32(this.petId);
        writer.writeInt32(this.skinType);
        writer.writeInt32(this.currency);
    }
    read(reader) {
        this.petId = reader.readInt32();
        this.skinType = reader.readInt32();
        this.currency = reader.readInt32();
    }
}
exports.ChangePetSkinPacket = ChangePetSkinPacket;
