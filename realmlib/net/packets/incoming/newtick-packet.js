"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewTickPacket = void 0;
const object_status_data_1 = require("../../data/object-status-data");
const packet_type_1 = require("../../packet-type");
/**
 * Received to notify the player of a new game tick.
 */
class NewTickPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.NEWTICK;
        this.tickId = 0;
        this.tickTime = 0;
        this.serverRealTimeMS = 0;
        this.serverLastTimeRTTMS = 0;
        this.statuses = [];
    }
    read(reader) {
        this.tickId = reader.readInt32();
        this.tickTime = reader.readInt32();
        this.serverRealTimeMS = reader.readUInt32();
        this.serverLastTimeRTTMS = reader.readUnsignedShort();
        const statusesLen = reader.readShort();
        this.statuses = new Array(statusesLen);
        for (let i = 0; i < statusesLen; i++) {
            const osd = new object_status_data_1.ObjectStatusData();
            osd.read(reader);
            this.statuses[i] = osd;
        }
    }
    write(writer) {
        writer.writeInt32(this.tickId);
        writer.writeInt32(this.tickTime);
        writer.writeShort(this.statuses.length);
        for (const status of this.statuses) {
            status.write(writer);
        }
    }
}
exports.NewTickPacket = NewTickPacket;
