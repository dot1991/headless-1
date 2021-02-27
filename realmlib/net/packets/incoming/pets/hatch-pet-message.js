"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HatchPetMessage = void 0;
const packet_type_1 = require("../../../packet-type");
/**
 * Received to give the player information about a newly hatched pet.
 */
class HatchPetMessage {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.HATCH_PET;
        this.propagate = true;
        this.petName = '';
        this.petSkin = 0;
    }
    read(reader) {
        this.petName = reader.readString();
        this.petSkin = reader.readInt32();
    }
    write(writer) {
        writer.writeString(this.petName);
        writer.writeInt32(this.petSkin);
    }
}
exports.HatchPetMessage = HatchPetMessage;
