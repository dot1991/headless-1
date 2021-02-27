"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetDailyQuestsPacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Sent to reset the daily quests currently available.
 */
class ResetDailyQuestsPacket {
    constructor() {
        this.type = packet_type_1.PacketType.RESET_DAILY_QUESTS;
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
exports.ResetDailyQuestsPacket = ResetDailyQuestsPacket;
