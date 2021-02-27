"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientStatPacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Received to give the player information about their stats.
 */
class ClientStatPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.CLIENTSTAT;
        this.name = '';
        this.value = 0;
    }
    read(reader) {
        this.name = reader.readString();
        this.value = reader.readInt32();
    }
    write(writer) {
        writer.writeString(this.name);
        writer.writeInt32(this.value);
    }
}
exports.ClientStatPacket = ClientStatPacket;
