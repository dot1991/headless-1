"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuyResultPacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Received in response to a `BuyPacket`.
 */
class BuyResultPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.BUYRESULT;
        this.result = 0;
        this.resultString = '';
    }
    read(reader) {
        this.result = reader.readInt32();
        this.resultString = reader.readString();
    }
    write(writer) {
        writer.writeInt32(this.result);
        writer.writeString(this.resultString);
    }
}
exports.BuyResultPacket = BuyResultPacket;
