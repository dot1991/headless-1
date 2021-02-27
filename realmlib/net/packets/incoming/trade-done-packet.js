"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradeDonePacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Received when the active trade has completed, regardless of whether
 * it was accepted or cancelled.
 */
class TradeDonePacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.TRADEDONE;
        this.code = 0;
        this.description = '';
    }
    read(reader) {
        this.code = reader.readInt32();
        this.description = reader.readString();
    }
    write(writer) {
        writer.writeInt32(this.code);
        writer.writeString(this.description);
    }
}
exports.TradeDonePacket = TradeDonePacket;
