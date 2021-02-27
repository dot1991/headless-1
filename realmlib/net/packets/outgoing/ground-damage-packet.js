"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroundDamagePacket = void 0;
const world_pos_data_1 = require("../../data/world-pos-data");
const packet_type_1 = require("../../packet-type");
/**
 * Sent when the client takes damage from a ground source, such as lava.
 */
class GroundDamagePacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.GROUNDDAMAGE;
        this.time = 0;
        this.position = new world_pos_data_1.WorldPosData();
    }
    write(writer) {
        writer.writeInt32(this.time);
        this.position.write(writer);
    }
    read(reader) {
        this.time = reader.readInt32();
        this.position.read(reader);
    }
}
exports.GroundDamagePacket = GroundDamagePacket;
