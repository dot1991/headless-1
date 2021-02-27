"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelloPacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Sent to prompt the server to accept the connection of an account
 * and reply with a `MapInfoPacket`.
 */
class HelloPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.HELLO;
        this.buildVersion = '';
        this.gameId = 0;
        this.guid = '';
        this.random1 = 0;
        this.password = '';
        this.random2 = 0;
        this.secret = '';
        this.keyTime = 0;
        this.key = [];
        this.mapJSON = '';
        this.entryTag = '';
        this.gameNet = '';
        this.gameNetUserId = '';
        this.playPlatform = '';
        this.platformToken = '';
        this.userToken = '';
        this.trailer = '';
        this.previousConnectionGuid = '';
    }
    write(writer) {
        writer.writeString(this.buildVersion);
        writer.writeInt32(this.gameId);
        writer.writeString(this.guid);
        writer.writeInt32(this.random1);
        writer.writeString(this.password);
        writer.writeInt32(this.random2);
        writer.writeString(this.secret);
        writer.writeInt32(this.keyTime);
        writer.writeByteArray(this.key);
        writer.writeStringUTF32(this.mapJSON);
        writer.writeString(this.entryTag);
        writer.writeString(this.gameNet);
        writer.writeString(this.gameNetUserId);
        writer.writeString(this.playPlatform);
        writer.writeString(this.platformToken);
        writer.writeString(this.userToken);
        writer.writeString(this.trailer);
        writer.writeString(this.previousConnectionGuid);
    }
    read(reader) {
        this.buildVersion = reader.readString();
        this.gameId = reader.readInt32();
        this.guid = reader.readString();
        this.random1 = reader.readInt32();
        this.password = reader.readString();
        this.random2 = reader.readInt32();
        this.secret = reader.readString();
        this.keyTime = reader.readInt32();
        this.key = reader.readByteArray();
        this.mapJSON = reader.readStringUTF32();
        this.entryTag = reader.readString();
        this.gameNet = reader.readString();
        this.gameNetUserId = reader.readString();
        this.playPlatform = reader.readString();
        this.platformToken = reader.readString();
        this.userToken = reader.readString();
        this.trailer = reader.readString();
        this.previousConnectionGuid = reader.readString();
    }
}
exports.HelloPacket = HelloPacket;
