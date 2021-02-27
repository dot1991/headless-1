"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradeItem = void 0;
class TradeItem {
    constructor() {
        this.item = 0;
        this.slotType = 0;
        this.tradeable = false;
        this.included = false;
    }
    read(reader) {
        this.item = reader.readInt32();
        this.slotType = reader.readInt32();
        this.tradeable = reader.readBoolean();
        this.included = reader.readBoolean();
    }
    write(writer) {
        writer.writeInt32(this.item);
        writer.writeInt32(this.slotType);
        writer.writeBoolean(this.tradeable);
        writer.writeBoolean(this.included);
    }
}
exports.TradeItem = TradeItem;
