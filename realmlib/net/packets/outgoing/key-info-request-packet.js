"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyInfoRequestPacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * > Unknown.
 */
class KeyInfoRequestPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.KEY_INFO_REQUEST;
        this.itemType = 0;
    }
    write(writer) {
        writer.writeInt32(this.itemType);
    }
    read(reader) {
        this.itemType = reader.readInt32();
    }
}
exports.KeyInfoRequestPacket = KeyInfoRequestPacket;
