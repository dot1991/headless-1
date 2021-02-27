"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovePacket = void 0;
const move_record_1 = require("../../data/move-record");
const world_pos_data_1 = require("../../data/world-pos-data");
const packet_type_1 = require("../../packet-type");
/**
 * Sent to acknowledge a `NewTickPacket`, and to notify the
 * server of the client's current position and time.
 */
class MovePacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.MOVE;
        this.tickId = 0;
        this.time = 0;
        this.serverRealTimeMS = 0;
        this.newPosition = new world_pos_data_1.WorldPosData();
        this.records = [];
    }
    write(writer) {
        writer.writeInt32(this.tickId);
        writer.writeInt32(this.time);
        writer.writeUInt32(this.serverRealTimeMS);
        this.newPosition.write(writer);
        writer.writeShort(this.records.length);
        for (const record of this.records) {
            record.write(writer);
        }
    }
    read(reader) {
        this.tickId = reader.readInt32();
        this.time = reader.readInt32();
        this.newPosition.read(reader);
        this.records = new Array(reader.readShort());
        for (let i = 0; i < this.records.length; i++) {
            this.records[i] = new move_record_1.MoveRecord();
            this.records[i].read(reader);
        }
    }
}
exports.MovePacket = MovePacket;
