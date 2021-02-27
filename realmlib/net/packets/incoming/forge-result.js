"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgeResultPacket = void 0;
const packet_type_1 = require("../../packet-type");
const data_1 = require("../../data");
/**
* Received when the player uses the item forge
*/
class ForgeResultPacket {
    constructor() {
        this.type = packet_type_1.PacketType.FORGE_RESULT;
        this.success = false;
        this.results = [];
    }
    read(reader) {
        this.success = reader.readBoolean();
        let resultCount = reader.readByte();
        for (let i = 0; i < resultCount; i++) {
            let result = new data_1.SlotObjectData();
            result.read(reader);
            this.results[i] = result;
        }
    }
    write(writer) {
        writer.writeBoolean(this.success);
        for (let i = 0; this.results.length; i++) {
            this.results[i].write(writer);
        }
    }
    toString() {
        let str = `[ForgeResult - 119] Success: ${this.success}\n`;
        if (this.results.length == 0) {
            return str + `Results: No SlotObjectData`;
        }
        for (let i = 0; i < this.results.length; i++) {
            if (i == (this.results.length - 1)) {
                str += this.results[i].toString();
            }
            else {
                str += this.results[i].toString() + `\n`;
            }
        }
        return str;
    }
}
exports.ForgeResultPacket = ForgeResultPacket;
