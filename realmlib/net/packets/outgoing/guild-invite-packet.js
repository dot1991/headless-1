"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildInvitePacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Sent to invite a player to the client's current guild.
 */
class GuildInvitePacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.GUILDINVITE;
        this.name = '';
    }
    write(writer) {
        writer.writeString(this.name);
    }
    read(reader) {
        this.name = reader.readString();
    }
}
exports.GuildInvitePacket = GuildInvitePacket;
