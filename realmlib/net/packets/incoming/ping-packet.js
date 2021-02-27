"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PingPacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Received occasionally by the server to prompt a response from the client.
 */
class PingPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.PING;
        this.serial = 0;
    }
    read(reader) {
        this.serial = reader.readInt32();
    }
    write(writer) {
        writer.writeInt32(this.serial);
    }
}
exports.PingPacket = PingPacket;
