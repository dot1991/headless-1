"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoToQuestRoomPacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Sent to prompt the server to send a `ReconnectPacket` which
 * contains the reconnect information for the Quest Room.
 */
class GoToQuestRoomPacket {
    constructor() {
        this.type = packet_type_1.PacketType.QUEST_ROOM_MSG;
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
exports.GoToQuestRoomPacket = GoToQuestRoomPacket;
