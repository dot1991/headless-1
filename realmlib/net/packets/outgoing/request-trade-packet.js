"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestTradePacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Sent to request a trade with a player, as well as
 * to accept a pending trade with a player.
 */
class RequestTradePacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.REQUESTTRADE;
        this.name = '';
    }
    write(writer) {
        writer.writeString(this.name);
    }
    read(reader) {
        this.name = reader.readString();
    }
}
exports.RequestTradePacket = RequestTradePacket;
