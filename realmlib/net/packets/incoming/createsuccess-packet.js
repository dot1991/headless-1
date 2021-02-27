"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSuccessPacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Received in response to a `CreatePacket`.
 */
class CreateSuccessPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.CREATE_SUCCESS;
        this.objectId = 0;
        this.charId = 0;
    }
    read(reader) {
        this.objectId = reader.readInt32();
        this.charId = reader.readInt32();
    }
    write(writer) {
        writer.writeInt32(this.objectId);
        writer.writeInt32(this.charId);
    }
}
exports.CreateSuccessPacket = CreateSuccessPacket;
