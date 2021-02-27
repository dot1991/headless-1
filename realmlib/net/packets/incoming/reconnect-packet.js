"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReconnectPacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Received to instruct the client to connect to a new host.
 */
class ReconnectPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.RECONNECT;
        this.name = '';
        this.host = '';
        this.port = 0;
        this.gameId = 0;
        this.keyTime = 0;
        this.key = [];
        this.isFromArena = false;
    }
    read(reader) {
        this.name = reader.readString();
        this.host = reader.readString();
        this.port = reader.readInt32();
        this.gameId = reader.readInt32();
        this.keyTime = reader.readInt32();
        this.isFromArena = reader.readBoolean();
        this.key = reader.readByteArray();
    }
    write(writer) {
        writer.writeString(this.name);
        writer.writeString(this.host);
        writer.writeInt32(this.port);
        writer.writeInt32(this.gameId);
        writer.writeInt32(this.keyTime);
        writer.writeBoolean(this.isFromArena);
        writer.writeByteArray(this.key);
    }
}
exports.ReconnectPacket = ReconnectPacket;
