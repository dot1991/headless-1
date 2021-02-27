"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PicPacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * A packet which contains a bitmap image.
 */
class PicPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.PIC;
        this.width = 0;
        this.height = 0;
        this.bitmapData = [];
    }
    read(reader) {
        this.width = reader.readInt32();
        this.height = reader.readInt32();
        this.bitmapData = reader.readBytes(this.width * this.height * 4);
    }
    write(writer) {
        writer.writeInt32(this.width);
        writer.writeInt32(this.height);
        writer.writeByteArray(this.bitmapData);
    }
}
exports.PicPacket = PicPacket;
