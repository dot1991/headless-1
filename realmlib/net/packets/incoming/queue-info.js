"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueInfoPacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Received when the client connects to a server with a queue.
 */
class QueueInfoPacket {
    constructor() {
        this.type = packet_type_1.PacketType.QUEUE_INFORMATION;
        this.currentPosition = 0;
        this.maxPosition = 0;
    }
    read(reader) {
        this.currentPosition = reader.readUnsignedShort();
        this.maxPosition = reader.readUnsignedShort();
    }
    write(writer) {
        writer.writeUnsignedShort(this.currentPosition);
        writer.writeUnsignedShort(this.maxPosition);
    }
}
exports.QueueInfoPacket = QueueInfoPacket;
