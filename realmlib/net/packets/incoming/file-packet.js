"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilePacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * A packet which contains a file.
 */
class FilePacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.FILE;
        this.fileName = '';
        this.file = '';
    }
    read(reader) {
        this.fileName = reader.readString();
        this.file = reader.readStringUTF32();
    }
    write(writer) {
        writer.writeString(this.fileName);
        writer.writeStringUTF32(this.file);
    }
}
exports.FilePacket = FilePacket;
