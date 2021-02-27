"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildRemovePacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Sent to remove a player from the client's current guild.
 */
class GuildRemovePacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.GUILDREMOVE;
        this.name = '';
    }
    write(writer) {
        writer.writeString(this.name);
    }
    read(reader) {
        this.name = reader.readString();
    }
}
exports.GuildRemovePacket = GuildRemovePacket;
