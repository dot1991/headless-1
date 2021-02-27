"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClaimDailyRewardMessage = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Sent to claim rewards from the login calendar.
 */
class ClaimDailyRewardMessage {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.CLAIM_LOGIN_REWARD_MSG;
        this.claimKey = '';
        this.claimType = '';
    }
    write(writer) {
        writer.writeString(this.claimKey);
        writer.writeString(this.claimType);
    }
    read(reader) {
        this.claimKey = reader.readString();
        this.claimType = reader.readString();
    }
}
exports.ClaimDailyRewardMessage = ClaimDailyRewardMessage;
