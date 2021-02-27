"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvResultPacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * > Unknown.
 */
class InvResultPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.INVRESULT;
        this.result = 0;
    }
    read(reader) {
        this.result = reader.readInt32();
    }
    write(writer) {
        writer.writeInt32(this.result);
    }
}
exports.InvResultPacket = InvResultPacket;
