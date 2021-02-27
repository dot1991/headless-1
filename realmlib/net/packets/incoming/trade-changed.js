"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradeChangedPacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Received when the active trade is changed.
 */
class TradeChangedPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.TRADECHANGED;
        this.offer = [];
    }
    read(reader) {
        const offerLen = reader.readShort();
        this.offer = new Array(offerLen);
        for (let i = 0; i < offerLen; i++) {
            this.offer[i] = reader.readBoolean();
        }
    }
    write(writer) {
        writer.writeShort(this.offer.length);
        for (const offer of this.offer) {
            writer.writeBoolean(offer);
        }
    }
}
exports.TradeChangedPacket = TradeChangedPacket;
