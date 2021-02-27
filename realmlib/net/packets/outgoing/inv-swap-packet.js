"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvSwapPacket = void 0;
const slot_object_data_1 = require("../../data/slot-object-data");
const world_pos_data_1 = require("../../data/world-pos-data");
const packet_type_1 = require("../../packet-type");
/**
 * Sent to swap the items of two slots.
 */
class InvSwapPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.INVSWAP;
        this.time = 0;
        this.position = new world_pos_data_1.WorldPosData();
        this.slotObject1 = new slot_object_data_1.SlotObjectData();
        this.slotObject2 = new slot_object_data_1.SlotObjectData();
    }
    write(writer) {
        writer.writeInt32(this.time);
        this.position.write(writer);
        this.slotObject1.write(writer);
        this.slotObject2.write(writer);
    }
    read(reader) {
        this.time = reader.readInt32();
        this.position.read(reader);
        this.slotObject1.read(reader);
        this.slotObject2.read(reader);
    }
}
exports.InvSwapPacket = InvSwapPacket;
