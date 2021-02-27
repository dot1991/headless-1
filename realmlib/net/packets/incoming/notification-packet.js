"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationPacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Received when a notification is received by the player.
 */
class NotificationPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.NOTIFICATION;
        this.objectId = 0;
        this.message = '';
        this.color = 0;
    }
    read(reader) {
        this.objectId = reader.readInt32();
        this.message = reader.readString();
        this.color = reader.readInt32();
    }
    write(writer) {
        writer.writeInt32(this.objectId);
        writer.writeString(this.message);
        writer.writeInt32(this.color);
    }
}
exports.NotificationPacket = NotificationPacket;
