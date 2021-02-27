"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeTradePacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Sent to change the client's offer in the current active trade.
 */
class ChangeTradePacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.CHANGETRADE;
        this.offer = [];
    }
    write(writer) {
        writer.writeShort(this.offer.length);
        for (const slot of this.offer) {
            writer.writeBoolean(slot);
        }
    }
    read(reader) {
        this.offer = new Array(reader.readShort());
        for (let i = 0; i < this.offer.length; i++) {
            this.offer[i] = reader.readBoolean();
        }
    }
}
exports.ChangeTradePacket = ChangeTradePacket;
