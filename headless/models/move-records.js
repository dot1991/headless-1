"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = require("../../realmlib/net");
/**
 * This code is mostly ported from the RotMG game client. It's
 * exact functionality is unknown.
 */
class MoveRecords {
    constructor() {
        this.lastClearTime = -1;
        this.records = [];
    }
    addRecord(time, x, y) {
        if (this.lastClearTime < 0) {
            return;
        }
        const id = this.getId(time);
        if (id < 1 || id > 10) {
            return;
        }
        if (this.records.length === 0) {
            const record = new net_1.MoveRecord();
            record.x = x;
            record.y = y;
            record.time = time;
            this.records.push(record);
            return;
        }
        const currentRecord = this.records[this.records.length - 1];
        const currentId = this.getId(currentRecord.time);
        if (id !== currentId) {
            const record = new net_1.MoveRecord();
            record.x = x;
            record.y = y;
            record.time = time;
            this.records.push(record);
            return;
        }
        const score = this.getScore(id, time);
        const currentScore = this.getScore(currentId, currentRecord.time);
        if (score < currentScore) {
            currentRecord.time = time;
            currentRecord.x = x;
            currentRecord.y = y;
            return;
        }
    }
    clear(time) {
        this.records = [];
        this.lastClearTime = time;
    }
    getId(time) {
        return Math.round((time - this.lastClearTime + 50) / 100);
    }
    getScore(id, time) {
        return Math.round(Math.abs(time - this.lastClearTime - id * 100));
    }
}
exports.MoveRecords = MoveRecords;
