"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordPromptPacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Received to prompt the player to enter their password.
 */
class PasswordPromptPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.PASSWORD_PROMPT;
        this.cleanPasswordStatus = 0;
    }
    read(reader) {
        this.cleanPasswordStatus = reader.readInt32();
    }
    write(writer) {
        writer.writeInt32(this.cleanPasswordStatus);
    }
}
exports.PasswordPromptPacket = PasswordPromptPacket;
