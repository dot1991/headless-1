"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClaimDailyRewardResponse = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Received in response to a `ClaimDailyRewardMessage`.
 */
class ClaimDailyRewardResponse {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.LOGIN_REWARD_MSG;
        this.itemId = 0;
        this.quantity = 0;
        this.gold = 0;
    }
    read(reader) {
        this.itemId = reader.readInt32();
        this.quantity = reader.readInt32();
        this.gold = reader.readInt32();
    }
    write(writer) {
        writer.writeInt32(this.itemId);
        writer.writeInt32(this.quantity);
        writer.writeInt32(this.gold);
    }
}
exports.ClaimDailyRewardResponse = ClaimDailyRewardResponse;
