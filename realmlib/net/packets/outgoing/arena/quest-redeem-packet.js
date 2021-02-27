"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestRedeemPacket = void 0;
const slot_object_data_1 = require("../../../data/slot-object-data");
const packet_type_1 = require("../../../packet-type");
/**
 * > Unknown.
 */
class QuestRedeemPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.QUEST_REDEEM;
        this.propagate = true;
        this.questId = '';
        this.slots = [];
    }
    write(writer) {
        writer.writeString(this.questId);
        writer.writeShort(this.slots.length);
        for (const slot of this.slots) {
            slot.write(writer);
        }
    }
    read(reader) {
        this.questId = reader.readString();
        const slotsLen = reader.readShort();
        this.slots = new Array(slotsLen);
        for (let i = 0; i < slotsLen; i++) {
            this.slots[i] = new slot_object_data_1.SlotObjectData();
            this.slots[i].read(reader);
        }
    }
}
exports.QuestRedeemPacket = QuestRedeemPacket;
