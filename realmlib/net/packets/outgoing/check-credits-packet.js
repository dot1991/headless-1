"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckCreditsPacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * > Unknown.
 */
class CheckCreditsPacket {
    constructor() {
        this.type = packet_type_1.PacketType.CHECKCREDITS;
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
exports.CheckCreditsPacket = CheckCreditsPacket;
