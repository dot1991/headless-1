"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoveRecord = void 0;
class MoveRecord {
    constructor() {
        this.time = 0;
        this.x = 0;
        this.y = 0;
    }
    read(reader) {
        this.time = reader.readInt32();
        this.x = reader.readFloat();
        this.y = reader.readFloat();
    }
    write(writer) {
        writer.writeInt32(this.time);
        writer.writeFloat(this.x);
        writer.writeFloat(this.y);
    }
    clone() {
        const clone = new MoveRecord();
        clone.time = this.time;
        clone.x = this.x;
        clone.y = this.y;
        return clone;
    }
}
exports.MoveRecord = MoveRecord;
