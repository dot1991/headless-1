"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvolvedPetMessage = void 0;
const packet_type_1 = require("../../../packet-type");
/**
 * Received to give the player information about a newly evolved pet.
 */
class EvolvedPetMessage {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.EVOLVE_PET;
        this.propagate = true;
        this.petId = 0;
        this.initialSkin = 0;
        this.finalSkin = 0;
    }
    read(reader) {
        this.petId = reader.readInt32();
        this.initialSkin = reader.readInt32();
        this.finalSkin = reader.readInt32();
    }
    write(writer) {
        writer.writeInt32(this.petId);
        writer.writeInt32(this.initialSkin);
        writer.writeInt32(this.finalSkin);
    }
}
exports.EvolvedPetMessage = EvolvedPetMessage;
