"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateGuildPacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Sent to create a new guild.
 */
class CreateGuildPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.CREATEGUILD;
        this.name = '';
    }
    write(writer) {
        writer.writeString(this.name);
    }
    read(reader) {
        this.name = reader.readString();
    }
}
exports.CreateGuildPacket = CreateGuildPacket;
