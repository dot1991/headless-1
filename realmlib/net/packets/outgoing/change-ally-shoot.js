"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeAllyShootPacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Sent to change the guild rank of a member in the player's guild.
 */
class ChangeAllyShootPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.CHANGE_ALLYSHOOT;
        this.name = '';
        this.guildRank = 0;
    }
    write(writer) {
        writer.writeString(this.name);
        writer.writeInt32(this.guildRank);
    }
    read(reader) {
        this.name = reader.readString();
        this.guildRank = reader.readInt32();
    }
}
exports.ChangeAllyShootPacket = ChangeAllyShootPacket;
