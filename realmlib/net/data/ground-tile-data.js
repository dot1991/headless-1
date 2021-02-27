"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroundTileData = void 0;
class GroundTileData {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.type = 0;
    }
    read(reader) {
        this.x = reader.readShort();
        this.y = reader.readShort();
        this.type = reader.readUnsignedShort();
    }
    write(writer) {
        writer.writeShort(this.x);
        writer.writeShort(this.y);
        writer.writeUnsignedShort(this.type);
    }
}
exports.GroundTileData = GroundTileData;
