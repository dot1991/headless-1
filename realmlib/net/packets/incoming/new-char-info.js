"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewCharacterInfoPacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * > Unknown
 */
class NewCharacterInfoPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.NEW_CHARACTER_INFORMATION;
        this.charXML = "";
    }
    read(reader) {
        this.charXML = reader.readString();
    }
    write(writer) {
        writer.writeString(this.charXML);
    }
}
exports.NewCharacterInfoPacket = NewCharacterInfoPacket;
