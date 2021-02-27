"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GotoPacket = void 0;
const world_pos_data_1 = require("../../data/world-pos-data");
const packet_type_1 = require("../../packet-type");
/**
 * Received when an entity has moved to a new position.
 */
class GotoPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.GOTO;
        this.objectId = 0;
        this.position = new world_pos_data_1.WorldPosData();
    }
    read(reader) {
        this.objectId = reader.readInt32();
        this.position.read(reader);
    }
    write(writer) {
        writer.writeInt32(this.objectId);
        this.position.write(writer);
    }
}
exports.GotoPacket = GotoPacket;
