"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReskinPetPacket = void 0;
const data_1 = require("../../../data");
const packet_type_1 = require("../../../packet-type");
/**
 * Sent to make an update to the pet currently following the player
 */
class ReskinPetPacket {
    constructor() {
        this.type = packet_type_1.PacketType.PET_CHANGE_FORM_MSG;
        this.instanceId = 0;
        this.newPetType = 0;
        this.item = new data_1.SlotObjectData();
    }
    write(writer) {
        writer.writeInt32(this.instanceId);
        writer.writeInt32(this.newPetType);
        this.item.write(writer);
    }
    read(reader) {
        this.instanceId = reader.readInt32();
        this.newPetType = reader.readInt32();
        this.item.read(reader);
    }
    toString() {
        return `[ReskinPet - 53] InstanceId: ${this.instanceId} - NewPetType: ${this.newPetType} - Slot:\n${this.item.toString()}`;
    }
}
exports.ReskinPetPacket = ReskinPetPacket;
