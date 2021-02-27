"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvitedToGuildPacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Received when the player is invited to a guild.
 */
class InvitedToGuildPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.INVITEDTOGUILD;
        this.name = '';
        this.guildName = '';
    }
    read(reader) {
        this.name = reader.readString();
        this.guildName = reader.readString();
    }
    write(writer) {
        writer.writeString(this.name);
        writer.writeString(this.guildName);
    }
}
exports.InvitedToGuildPacket = InvitedToGuildPacket;
