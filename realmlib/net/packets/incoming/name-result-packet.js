"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NameResultPacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Received in response to a `ChooseNamePacket`.
 */
class NameResultPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.NAMERESULT;
        this.success = false;
        this.errorText = '';
    }
    read(reader) {
        this.success = reader.readBoolean();
        this.errorText = reader.readString();
    }
    write(writer) {
        writer.writeBoolean(this.success);
        writer.writeString(this.errorText);
    }
}
exports.NameResultPacket = NameResultPacket;
