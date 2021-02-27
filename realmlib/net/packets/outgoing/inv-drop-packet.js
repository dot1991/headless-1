"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvDropPacket = void 0;
const slot_object_data_1 = require("../../data/slot-object-data");
const packet_type_1 = require("../../packet-type");
/**
 * Sent to drop an item from the client's inventory.
 */
class InvDropPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.INVDROP;
        this.slotObject = new slot_object_data_1.SlotObjectData();
    }
    write(writer) {
        this.slotObject.write(writer);
    }
    read(reader) {
        this.slotObject.read(reader);
    }
}
exports.InvDropPacket = InvDropPacket;
