"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradeAcceptedPacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Received when the active trade is accepted.
 */
class TradeAcceptedPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.TRADEACCEPTED;
        this.clientOffer = [];
        this.partnerOffer = [];
    }
    read(reader) {
        const clientOfferLen = reader.readShort();
        this.clientOffer = new Array(clientOfferLen);
        for (let i = 0; i < clientOfferLen; i++) {
            this.clientOffer[i] = reader.readBoolean();
        }
        const partnerOfferLen = reader.readShort();
        this.partnerOffer = new Array(partnerOfferLen);
        for (let i = 0; i < partnerOfferLen; i++) {
            this.partnerOffer[i] = reader.readBoolean();
        }
    }
    write(writer) {
        writer.writeShort(this.clientOffer.length);
        for (const offer of this.clientOffer) {
            writer.writeBoolean(offer);
        }
        writer.writeShort(this.partnerOffer.length);
        for (const offer of this.partnerOffer) {
            writer.writeBoolean(offer);
        }
    }
}
exports.TradeAcceptedPacket = TradeAcceptedPacket;
