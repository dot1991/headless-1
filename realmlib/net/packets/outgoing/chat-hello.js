"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatHelloPacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Sent to initiate the chat stream (unnused)
 */
class ChatHelloPacket {
    constructor() {
        this.type = packet_type_1.PacketType.CHATHELLO;
        this.accountId = "";
        this.token = "";
    }
    write(writer) {
        writer.writeString(this.accountId);
        writer.writeString(this.token);
    }
    read(reader) {
        this.accountId = reader.readString();
        this.token = reader.readString();
    }
    toString() {
        return `[ChatHello - 206] AccountId: ${this.accountId} - Token: ${this.token}`;
    }
}
exports.ChatHelloPacket = ChatHelloPacket;
