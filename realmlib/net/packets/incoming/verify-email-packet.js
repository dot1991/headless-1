"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyEmailPacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Received to prompt the player to verify their email.
 */
class VerifyEmailPacket {
    constructor() {
        this.type = packet_type_1.PacketType.VERIFY_EMAIL;
    }
    //#region packet-specific members
    //#endregion
    read() {
        //
    }
    write() {
        //
    }
}
exports.VerifyEmailPacket = VerifyEmailPacket;
