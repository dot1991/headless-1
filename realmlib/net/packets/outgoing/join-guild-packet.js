"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinGuildPacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Sent to accept a pending guild invite.
 */
class JoinGuildPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.JOINGUILD;
        this.guildName = '';
    }
    write(writer) {
        writer.writeString(this.guildName);
    }
    read(reader) {
        this.guildName = reader.readString();
    }
}
exports.JoinGuildPacket = JoinGuildPacket;
