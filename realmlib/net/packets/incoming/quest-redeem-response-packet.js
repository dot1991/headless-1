"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestRedeemResponsePacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * > Unknown.
 */
class QuestRedeemResponsePacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.QUEST_REDEEM_RESPONSE;
        this.ok = false;
        this.message = '';
    }
    read(reader) {
        this.ok = reader.readBoolean();
        this.message = reader.readString();
    }
    write(writer) {
        writer.writeBoolean(this.ok);
        writer.writeString(this.message);
    }
}
exports.QuestRedeemResponsePacket = QuestRedeemResponsePacket;
