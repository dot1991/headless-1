"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaySoundPacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Received to tell the client to play a sound.
 */
class PlaySoundPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.PLAYSOUND;
        this.ownerId = 0;
        this.soundId = 0;
    }
    read(reader) {
        this.ownerId = reader.readInt32();
        this.soundId = reader.readUnsignedByte();
    }
    write(writer) {
        writer.writeInt32(this.ownerId);
        writer.writeUnsignedByte(this.soundId);
    }
}
exports.PlaySoundPacket = PlaySoundPacket;
