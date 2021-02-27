"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SquareHitPacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * > Unknown.
 */
class SquareHitPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.SQUAREHIT;
        this.time = 0;
        this.bulletId = 0;
        this.objectId = 0;
    }
    write(writer) {
        writer.writeInt32(this.time);
        writer.writeByte(this.bulletId);
        writer.writeInt32(this.objectId);
    }
    read(reader) {
        this.time = reader.readInt32();
        this.bulletId = reader.readByte();
        this.objectId = reader.readInt32();
    }
}
exports.SquareHitPacket = SquareHitPacket;
