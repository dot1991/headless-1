"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyInfoResponsePacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * > Unknown.
 */
class KeyInfoResponsePacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.KEY_INFO_RESPONSE;
        this.name = '';
        this.description = '';
        this.creator = '';
    }
    read(reader) {
        this.name = reader.readString();
        this.description = reader.readString();
        this.creator = reader.readString();
    }
    write(writer) {
        writer.writeString(this.name);
        writer.writeString(this.description);
        writer.writeString(this.creator);
    }
}
exports.KeyInfoResponsePacket = KeyInfoResponsePacket;
