"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestObjectIdPacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Received to tell the player the object id of their current quest.
 */
class QuestObjectIdPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.QUESTOBJID;
        this.objectId = 0;
    }
    read(reader) {
        this.objectId = reader.readInt32();
    }
    write(writer) {
        writer.writeInt32(this.objectId);
    }
}
exports.QuestObjectIdPacket = QuestObjectIdPacket;
