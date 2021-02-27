"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChooseNamePacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Sent to change the client's account name.
 */
class ChooseNamePacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.CHOOSENAME;
        this.name = '';
    }
    write(writer) {
        writer.writeString(this.name);
    }
    read(reader) {
        this.name = reader.readString();
    }
}
exports.ChooseNamePacket = ChooseNamePacket;
