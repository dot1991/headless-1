"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsePortalPacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Sent to prompt the server to send a `ReconnectPacket` which
 * contains the reconnect information for the used portal.
 */
class UsePortalPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.USEPORTAL;
        this.objectId = 0;
    }
    write(writer) {
        writer.writeInt32(this.objectId);
    }
    read(reader) {
        this.objectId = reader.readInt32();
    }
}
exports.UsePortalPacket = UsePortalPacket;
