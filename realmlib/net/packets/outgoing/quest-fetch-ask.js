"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestFetchAskPacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Sent to request the latest quests.
 */
class QuestFetchAskPacket {
    constructor() {
        this.type = packet_type_1.PacketType.QUEST_FETCH_ASK;
    }
    write() {
        //
    }
    read() {
        //
    }
}
exports.QuestFetchAskPacket = QuestFetchAskPacket;
