"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradeRequestedPacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Received when a trade is requested.
 */
class TradeRequestedPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.TRADEREQUESTED;
        this.name = '';
    }
    read(reader) {
        this.name = reader.readString();
    }
    write(writer) {
        writer.writeString(this.name);
    }
}
exports.TradeRequestedPacket = TradeRequestedPacket;
