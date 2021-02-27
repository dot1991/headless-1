"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PetYardUpdate = void 0;
const packet_type_1 = require("../../../packet-type");
/**
 * Received when the pet yard is updated to a new type of yard
 */
class PetYardUpdate {
    constructor() {
        this.type = packet_type_1.PacketType.PETYARDUPDATE;
        this.yardType = 0;
    }
    read(reader) {
        this.yardType = reader.readInt32();
    }
    write(writer) {
        writer.writeInt32(this.yardType);
    }
    toString() {
        return `[PetYardUpdate - 78] Yard Type: ${this.yardType}`;
    }
}
exports.PetYardUpdate = PetYardUpdate;
