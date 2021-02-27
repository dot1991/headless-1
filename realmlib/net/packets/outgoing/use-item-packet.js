"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UseItemPacket = void 0;
const slot_object_data_1 = require("../../data/slot-object-data");
const world_pos_data_1 = require("../../data/world-pos-data");
const packet_type_1 = require("../../packet-type");
/**
 * Sent to use an item, such as an ability or consumable.
 */
class UseItemPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.USEITEM;
        this.time = 0;
        this.slotObject = new slot_object_data_1.SlotObjectData();
        this.itemUsePos = new world_pos_data_1.WorldPosData();
        this.useType = 0;
    }
    write(writer) {
        writer.writeInt32(this.time);
        this.slotObject.write(writer);
        this.itemUsePos.write(writer);
        writer.writeByte(this.useType);
    }
    read(reader) {
        this.time = reader.readInt32();
        this.slotObject.read(reader);
        this.itemUsePos.read(reader);
        this.useType = reader.readByte();
    }
}
exports.UseItemPacket = UseItemPacket;
