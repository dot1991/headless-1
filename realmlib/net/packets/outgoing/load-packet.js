"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadPacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Sent in response to a `MapInfoPacket` to load a character into the map.
 */
class LoadPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.LOAD;
        this.charId = 0;
        this.isFromArena = false;
        this.isChallenger = false;
    }
    write(writer) {
        writer.writeInt32(this.charId);
        writer.writeBoolean(this.isFromArena);
        writer.writeBoolean(this.isChallenger);
    }
    read(reader) {
        this.charId = reader.readInt32();
        this.isFromArena = reader.readBoolean();
        this.isChallenger = reader.readBoolean();
    }
}
exports.LoadPacket = LoadPacket;
