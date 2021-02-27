"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivePetPacket = void 0;
const packet_type_1 = require("../../../packet-type");
/**
 * Received to notify the player of a new pet.
 */
class ActivePetPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.ACTIVEPETUPDATE;
        this.propagate = true;
        this.instanceId = 0;
    }
    read(reader) {
        this.instanceId = reader.readInt32();
    }
    write(writer) {
        writer.writeInt32(this.instanceId);
    }
}
exports.ActivePetPacket = ActivePetPacket;
