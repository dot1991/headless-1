"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatToken = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Received when the server sends the client a chat token to use (unnused)
 */
class ChatToken {
    constructor() {
        this.type = packet_type_1.PacketType.CHATTOKEN;
        this.token = '';
        this.host = '';
        this.port = 0;
    }
    read(reader) {
        this.token = reader.readString();
        this.host = reader.readString();
        this.port = reader.readInt32();
    }
    write(writer) {
        writer.writeString(this.token);
        writer.writeString(this.host);
        writer.writeInt32(this.port);
    }
    toString() {
        return `[ChatToken - 207] Token: ${this.token} - Host: ${this.host} - Port: ${this.port}`;
    }
}
exports.ChatToken = ChatToken;
