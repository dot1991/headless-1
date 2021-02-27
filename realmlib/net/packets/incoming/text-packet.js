"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextPacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Received when a chat message is sent by another player or NPC.
 */
class TextPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.TEXT;
        this.name = '';
        this.objectId = 0;
        this.numStars = 0;
        this.bubbleTime = 0;
        this.recipient = '';
        this.text = '';
        this.cleanText = '';
        this.isSupporter = false;
        this.starBackground = 0;
    }
    read(reader) {
        this.name = reader.readString();
        this.objectId = reader.readInt32();
        this.numStars = reader.readInt32();
        this.bubbleTime = reader.readUnsignedByte();
        this.recipient = reader.readString();
        this.text = reader.readString();
        this.cleanText = reader.readString();
        this.isSupporter = reader.readBoolean();
        this.starBackground = reader.readInt32();
    }
    write(writer) {
        writer.writeString(this.name);
        writer.writeInt32(this.objectId);
        writer.writeInt32(this.numStars);
        writer.writeUnsignedByte(this.bubbleTime);
        writer.writeString(this.recipient);
        writer.writeString(this.text);
        writer.writeString(this.cleanText);
        writer.writeBoolean(this.isSupporter);
        writer.writeInt32(this.starBackground);
    }
}
exports.TextPacket = TextPacket;
