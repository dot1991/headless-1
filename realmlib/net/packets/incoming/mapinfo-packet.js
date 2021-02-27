"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapInfoPacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Received in response to the `HelloPacket`.
 */
class MapInfoPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.MAPINFO;
        this.width = 0;
        this.height = 0;
        this.name = '';
        this.displayName = '';
        this.realmName = '';
        this.difficulty = 0;
        this.fp = 0;
        this.background = 0;
        this.allowPlayerTeleport = false;
        this.showDisplays = false;
        this.maxPlayers = 0;
        this.connectionGuid = '';
        this.clientXML = [];
        this.extraXML = [];
        this.gameOpenedTime = 0;
    }
    read(reader) {
        this.width = reader.readInt32();
        this.height = reader.readInt32();
        this.name = reader.readString();
        this.displayName = reader.readString();
        this.realmName = reader.readString();
        this.fp = reader.readUInt32();
        this.background = reader.readInt32();
        this.difficulty = reader.readInt32();
        this.allowPlayerTeleport = reader.readBoolean();
        this.showDisplays = reader.readBoolean();
        this.maxPlayers = reader.readShort();
        this.connectionGuid = reader.readString();
        this.gameOpenedTime = reader.readUInt32();
        this.clientXML = new Array(reader.readShort());
        for (let i = 0; i < this.clientXML.length; i++) {
            this.clientXML[i] = reader.readStringUTF32();
        }
        this.extraXML = new Array(reader.readShort());
        for (let i = 0; i < this.extraXML.length; i++) {
            this.extraXML[i] = reader.readStringUTF32();
        }
    }
    write(writer) {
        writer.writeInt32(this.width);
        writer.writeInt32(this.height);
        writer.writeString(this.name);
        writer.writeString(this.displayName);
        writer.writeString(this.realmName);
        writer.writeInt32(this.fp);
        writer.writeInt32(this.background);
        writer.writeInt32(this.difficulty);
        writer.writeBoolean(this.allowPlayerTeleport);
        writer.writeBoolean(this.showDisplays);
        writer.writeShort(this.maxPlayers);
        writer.writeString(this.connectionGuid);
        writer.writeShort(this.clientXML.length);
        writer.writeUInt32(this.gameOpenedTime);
        for (const xml of this.clientXML) {
            writer.writeStringUTF32(xml);
        }
        writer.writeShort(this.extraXML.length);
        for (const xml of this.extraXML) {
            writer.writeStringUTF32(xml);
        }
    }
}
exports.MapInfoPacket = MapInfoPacket;
