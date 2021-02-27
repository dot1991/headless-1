"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradeStartPacket = void 0;
const trade_item_1 = require("../../data/trade-item");
const packet_type_1 = require("../../packet-type");
/**
 * Received when a new active trade has been initiated.
 */
class TradeStartPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.TRADESTART;
        this.clientItems = [];
        this.partnerName = '';
        this.partnerItems = [];
    }
    read(reader) {
        const clientItemsLen = reader.readShort();
        this.clientItems = new Array(clientItemsLen);
        for (let i = 0; i < clientItemsLen; i++) {
            const item = new trade_item_1.TradeItem();
            item.read(reader);
            this.clientItems[i] = item;
        }
        this.partnerName = reader.readString();
        const partnerItemsLen = reader.readShort();
        this.partnerItems = new Array(partnerItemsLen);
        for (let i = 0; i < partnerItemsLen; i++) {
            const item = new trade_item_1.TradeItem();
            item.read(reader);
            this.partnerItems[i] = item;
        }
    }
    write(writer) {
        writer.writeShort(this.clientItems.length);
        for (const item of this.clientItems) {
            item.write(writer);
        }
        writer.writeString(this.partnerName);
        writer.writeShort(this.partnerItems.length);
        for (const item of this.partnerItems) {
            item.write(writer);
        }
    }
}
exports.TradeStartPacket = TradeStartPacket;
