"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildResultPacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * > Unknown.
 */
class GuildResultPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.GUILDRESULT;
        this.success = false;
        this.lineBuilderJSON = '';
    }
    read(reader) {
        this.success = reader.readBoolean();
        this.lineBuilderJSON = reader.readString();
    }
    write(writer) {
        writer.writeBoolean(this.success);
        writer.writeString(this.lineBuilderJSON);
    }
}
exports.GuildResultPacket = GuildResultPacket;
