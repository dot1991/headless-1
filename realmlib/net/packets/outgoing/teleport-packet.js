"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeleportPacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Sent to teleport to another player.
 */
class TeleportPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.TELEPORT;
        this.objectId = 0;
    }
    write(writer) {
        writer.writeInt32(this.objectId);
    }
    read(reader) {
        this.objectId = reader.readInt32();
    }
}
exports.TeleportPacket = TeleportPacket;
