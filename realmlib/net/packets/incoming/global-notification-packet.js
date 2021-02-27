"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalNotificationPacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Received when a global notification is sent out to all players.
 */
class GlobalNotificationPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.GLOBAL_NOTIFICATION;
        this.notificationType = 0;
        this.text = '';
    }
    read(reader) {
        this.notificationType = reader.readInt32();
        this.text = reader.readString();
    }
    write(writer) {
        writer.writeInt32(this.notificationType);
        writer.writeString(this.text);
    }
}
exports.GlobalNotificationPacket = GlobalNotificationPacket;
