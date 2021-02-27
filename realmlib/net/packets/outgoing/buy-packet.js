"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuyPacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Sent to buy an item.
 */
class BuyPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.BUY;
        this.objectId = 0;
        this.quantity = 0;
    }
    write(writer) {
        writer.writeInt32(this.objectId);
        writer.writeInt32(this.quantity);
    }
    read(reader) {
        this.objectId = reader.readInt32();
        this.quantity = reader.readInt32();
    }
}
exports.BuyPacket = BuyPacket;
