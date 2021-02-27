"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestFetchResponsePacket = void 0;
const quest_data_1 = require("../../data/quest-data");
const packet_type_1 = require("../../packet-type");
/**
 * Received to tell the player about new quests.
 */
class QuestFetchResponsePacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.QUEST_FETCH_RESPONSE;
        this.quests = [];
        this.nextRefreshPrice = 0;
    }
    read(reader) {
        const questsLen = reader.readShort();
        this.quests = new Array(questsLen);
        for (let i = 0; i < questsLen; i++) {
            this.quests[i] = new quest_data_1.QuestData();
            this.quests[i].read(reader);
        }
        this.nextRefreshPrice = reader.readShort();
    }
    write(writer) {
        writer.writeShort(this.quests.length);
        for (const quest of this.quests) {
            quest.write(writer);
        }
        writer.writeShort(this.nextRefreshPrice);
    }
}
exports.QuestFetchResponsePacket = QuestFetchResponsePacket;
