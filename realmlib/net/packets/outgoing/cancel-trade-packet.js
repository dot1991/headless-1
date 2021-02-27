"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelTradePacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Sent to cancel the current active trade.
 */
class CancelTradePacket {
    constructor() {
        this.type = packet_type_1.PacketType.CANCELTRADE;
    }
    //#region packet-specific members
    //#endregion
    write() {
        //
    }
    read() {
        //
    }
}
exports.CancelTradePacket = CancelTradePacket;
