"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectData = void 0;
const object_status_data_1 = require("./object-status-data");
class ObjectData {
    constructor() {
        this.objectType = 0;
        this.status = new object_status_data_1.ObjectStatusData();
    }
    read(reader) {
        this.objectType = reader.readUnsignedShort();
        this.status.read(reader);
    }
    write(writer) {
        writer.writeUnsignedShort(this.objectType);
        this.status.write(writer);
    }
    toString() {
        return `[ObjectData] Type: ${this.objectType} - Status:\n
    `;
    }
}
exports.ObjectData = ObjectData;
