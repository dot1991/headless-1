"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAckPacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Sent to acknowledge an `UpdatePacket`.
 */
class UpdateAckPacket {
    constructor() {
        this.type = packet_type_1.PacketType.UPDATEACK;
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
exports.UpdateAckPacket = UpdateAckPacket;
