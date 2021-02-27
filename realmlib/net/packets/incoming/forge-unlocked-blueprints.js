"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgeUnlockedBlueprints = void 0;
const packet_type_1 = require("../../packet-type");
const data_1 = require("../../data");
/**
 * Received when the player enters the nexus
 */
class ForgeUnlockedBlueprints {
    constructor() {
        this.type = packet_type_1.PacketType.FORGE_UNLOCKED_BLUEPRINTS;
        this.unlockedBlueprints = [];
    }
    read(reader) {
        let count = reader.readByte();
        for (let i = 0; i < count; i++) {
            this.unlockedBlueprints.push(new data_1.CompressedInt().read(reader));
        }
    }
    write(writer) {
        writer.writeByte(this.unlockedBlueprints.length);
        for (let i = 0; i < this.unlockedBlueprints.length; i++) {
            new data_1.CompressedInt().write(writer, (this.unlockedBlueprints[i]));
        }
    }
    toString() {
        let str = `FORGE_UNLOCKED_BLUEPRINTS:\n`;
        if (this.unlockedBlueprints.length == 0) {
            return str + 'no unlocked blueprints';
        }
        for (let i = 0; i < this.unlockedBlueprints.length; i++) {
            str += `[${i}] ${this.unlockedBlueprints[i]}`;
        }
        return str;
    }
}
exports.ForgeUnlockedBlueprints = ForgeUnlockedBlueprints;
