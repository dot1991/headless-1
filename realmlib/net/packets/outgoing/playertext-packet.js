"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerTextPacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Sent when the client sends a chat message.
 */
class PlayerTextPacket {
    constructor() {
        this.type = packet_type_1.PacketType.PLAYERTEXT;
        this.text = '';
    }
    write(writer) {
        writer.writeString(this.text);
    }
    read(reader) {
        this.text = reader.readString();
    }
}
exports.PlayerTextPacket = PlayerTextPacket;
