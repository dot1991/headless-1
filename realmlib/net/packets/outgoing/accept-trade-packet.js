"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcceptTradePacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Sent to accept the current active trade.
 */
class AcceptTradePacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.ACCEPTTRADE;
        this.clientOffer = [];
        this.partnerOffer = [];
    }
    write(writer) {
        writer.writeShort(this.clientOffer.length);
        for (const slot of this.clientOffer) {
            writer.writeBoolean(slot);
        }
        writer.writeShort(this.partnerOffer.length);
        for (const slot of this.partnerOffer) {
            writer.writeBoolean(slot);
        }
    }
    read(reader) {
        this.clientOffer = new Array(reader.readShort());
        for (let i = 0; i < this.clientOffer.length; i++) {
            this.clientOffer[i] = reader.readBoolean();
        }
        this.partnerOffer = new Array(reader.readShort());
        for (let i = 0; i < this.partnerOffer.length; i++) {
            this.partnerOffer[i] = reader.readBoolean();
        }
    }
}
exports.AcceptTradePacket = AcceptTradePacket;
