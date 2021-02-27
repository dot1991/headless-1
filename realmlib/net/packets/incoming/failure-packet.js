"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FailurePacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Received when an error has occurred
 */
class FailurePacket {
    constructor() {
        this.type = packet_type_1.PacketType.FAILURE;
        this.errorId = 0;
        this.errorDescription = '';
        this.errorPlace = '';
        this.errorConnectionId = '';
    }
    read(reader) {
        this.errorId = reader.readInt32();
        this.errorDescription = reader.readString();
        this.errorPlace = reader.readString();
        this.errorConnectionId = reader.readString();
    }
    write(writer) {
        writer.writeInt32(this.errorId);
        writer.writeString(this.errorDescription);
        writer.writeString(this.errorPlace);
        writer.writeString(this.errorConnectionId);
    }
    toString() {
        return `[Failure - 0] Id: ${this.errorId} - Description: ${this.errorDescription}\n
    Place: ${this.errorPlace} - ConnectionId: ${this.errorConnectionId}`;
    }
}
exports.FailurePacket = FailurePacket;
