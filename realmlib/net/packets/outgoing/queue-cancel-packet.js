"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueCancelPacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Sent when the clients position in the queue should be cancelled
 */
class QueueCancelPacket {
    constructor() {
        this.type = packet_type_1.PacketType.QUEUE_CANCEL;
        this.bufferMax = 0;
        this.bufferSize = 0;
        this.byteString = '';
        this.bytes = [];
    }
    read(reader) {
        this.bufferMax = reader.buffer.byteLength;
        console.log(`[QueueCancel] Buffer max: ${this.bufferMax}`);
        this.bufferSize = reader.buffer.length;
        console.log(`[QueueCancel] Buffer size: ${this.bufferSize}`);
        this.byteString = reader.buffer.toString();
        console.log(`[QueueCancel] To string: ${this.byteString}`);
        console.log(`[QueueCancel] Bytes:`);
        let position = 0;
        let byteString = '';
        while (position < this.bufferSize) {
            let byte = reader.readByte();
            byteString += byte;
            this.bytes.push(byte);
            position++;
        }
        console.log(byteString);
    }
    write(writer) {
        console.log(writer.buffer.length); // this is just debug filler
    }
}
exports.QueueCancelPacket = QueueCancelPacket;
