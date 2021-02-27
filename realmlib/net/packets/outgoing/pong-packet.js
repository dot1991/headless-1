"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PongPacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Sent to acknowledge the `PingPacket.`
 */
class PongPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.PONG;
        this.serial = 0;
        this.time = 0;
    }
    write(writer) {
        writer.writeInt32(this.serial);
        writer.writeInt32(this.time);
    }
    read(reader) {
        this.serial = reader.readInt32();
        this.time = reader.readInt32();
    }
}
exports.PongPacket = PongPacket;
