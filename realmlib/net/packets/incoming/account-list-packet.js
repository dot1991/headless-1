"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountListPacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Received to provide lists of accounts ids which are
 * those of players who have been locked, ignored, etc.
 */
class AccountListPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.ACCOUNTLIST;
        this.accountListId = 0;
        this.accountIds = [];
        this.lockAction = 0;
    }
    read(reader) {
        this.accountListId = reader.readInt32();
        const accountIdsLen = reader.readShort();
        this.accountIds = new Array(accountIdsLen);
        for (let i = 0; i < accountIdsLen; i++) {
            this.accountIds[i] = reader.readString();
        }
        this.lockAction = reader.readInt32();
    }
    write(writer) {
        writer.writeInt32(this.accountListId);
        writer.writeShort(this.accountIds.length);
        for (const id of this.accountIds) {
            writer.writeString(id);
        }
        writer.writeInt32(this.lockAction);
    }
}
exports.AccountListPacket = AccountListPacket;
