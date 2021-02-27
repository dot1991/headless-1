"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditAccountListPacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Sent to edit an account id list.
 */
class EditAccountListPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.EDITACCOUNTLIST;
        this.accountListId = 0;
        this.add = false;
        this.objectId = 0;
    }
    write(writer) {
        writer.writeInt32(this.accountListId);
        writer.writeBoolean(this.add);
        writer.writeInt32(this.objectId);
    }
    read(reader) {
        this.accountListId = reader.readInt32();
        this.add = reader.readBoolean();
        this.objectId = reader.readInt32();
    }
}
exports.EditAccountListPacket = EditAccountListPacket;
