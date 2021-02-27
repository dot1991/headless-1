"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectStatusData = void 0;
const compressed_int_1 = require("./compressed-int");
const world_pos_data_1 = require("./world-pos-data");
const stat_data_1 = require("./stat-data");
class ObjectStatusData {
    constructor() {
        this.objectId = 0;
        this.pos = new world_pos_data_1.WorldPosData();
        this.stats = [];
    }
    read(reader) {
        this.objectId = new compressed_int_1.CompressedInt().read(reader);
        this.pos.read(reader);
        const statLen = new compressed_int_1.CompressedInt().read(reader);
        this.stats = new Array(statLen);
        for (let i = 0; i < statLen; i++) {
            const sd = new stat_data_1.StatData();
            sd.read(reader);
            this.stats[i] = sd;
        }
    }
    write(writer) {
        new compressed_int_1.CompressedInt().write(writer, this.objectId);
        this.pos.write(writer);
        new compressed_int_1.CompressedInt().write(writer, this.stats.length);
        writer.writeShort(this.stats.length);
        for (const stat of this.stats) {
            stat.write(writer);
        }
    }
    toString(showStats = false) {
        let str = `[ObjectStatusData] ObjectId: ${this.objectId} - Position: x${this.pos.x}, y${this.pos.y} - Stat amount: ${this.stats.length}`;
        if (!showStats) {
            return str;
        }
        else {
            for (let i = 0; i < this.stats.length; i++) {
                if (i == 0) {
                    str += `\n${this.stats[i].toString()}\n`;
                }
                else if (i == this.stats.length - 1) {
                    str += this.stats[i].toString();
                }
                else {
                    str += `${this.stats[i].toString()}\n`;
                }
            }
            return str;
        }
    }
}
exports.ObjectStatusData = ObjectStatusData;
