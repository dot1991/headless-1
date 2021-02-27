"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotObjectData = void 0;
class SlotObjectData {
    constructor() {
        this.objectId = 0;
        this.slotId = 0;
        this.objectType = 0;
    }
    read(reader) {
        this.objectId = reader.readInt32();
        this.slotId = reader.readInt32();
        this.objectType = reader.readUInt32();
    }
    write(writer) {
        writer.writeInt32(this.objectId);
        writer.writeInt32(this.slotId);
        writer.writeInt32(this.objectType);
    }
    toString() {
        return `[SlotObjectData] ObjectId: ${this.objectId} - SlotId: ${this.slotId} - ObjectType: ${this.objectType}`;
    }
}
exports.SlotObjectData = SlotObjectData;
