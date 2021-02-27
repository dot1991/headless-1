"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AoeAckPacket = void 0;
const world_pos_data_1 = require("../../data/world-pos-data");
const packet_type_1 = require("../../packet-type");
/**
 * Sent to acknowledge an `AoePacket`.
 */
class AoeAckPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.AOEACK;
        this.time = 0;
        this.position = new world_pos_data_1.WorldPosData();
    }
    write(writer) {
        writer.writeInt32(this.time);
        this.position.write(writer);
    }
    read(reader) {
        this.time = reader.readInt32();
        this.position = new world_pos_data_1.WorldPosData();
        this.position.read(reader);
    }
}
exports.AoeAckPacket = AoeAckPacket;
