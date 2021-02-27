"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePetMessage = void 0;
const packet_type_1 = require("../../../packet-type");
/**
 * Received to notify the player that a pet has been deleted.
 */
class DeletePetMessage {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.DELETE_PET;
        this.propagate = true;
        this.petId = 0;
    }
    read(reader) {
        this.petId = reader.readInt32();
    }
    write(writer) {
        writer.writeInt32(this.petId);
    }
}
exports.DeletePetMessage = DeletePetMessage;
