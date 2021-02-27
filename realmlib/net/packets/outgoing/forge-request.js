"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgeRequestPacket = void 0;
const data_1 = require("../../data");
const packet_type_1 = require("../../packet-type");
class ForgeRequestPacket {
    constructor() {
        this.type = packet_type_1.PacketType.FORGE_REQUEST;
        this.objectId = 0;
        this.slotsUsed = new data_1.SlotObjectData();
    }
    write(writer) {
        writer.writeInt32(this.objectId);
        this.slotsUsed.write(writer);
    }
    read(reader) {
        this.objectId = reader.readInt32();
        this.slotsUsed.read(reader);
    }
}
exports.ForgeRequestPacket = ForgeRequestPacket;
