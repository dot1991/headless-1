"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatData = void 0;
const compressed_int_1 = require("./compressed-int");
const models_1 = require("../models");
class StatData {
    constructor() {
        this.statType = 0;
        this.statValue = 0;
        this.stringStatValue = '';
        this.magicByte = 0;
    }
    read(reader) {
        this.statType = reader.readUnsignedByte();
        if (this.isStringStat()) {
            this.stringStatValue = reader.readString();
        }
        else {
            this.statValue = new compressed_int_1.CompressedInt().read(reader);
        }
        this.magicByte = reader.readByte();
    }
    write(writer) {
        writer.writeByte(this.statType);
        if (this.isStringStat()) {
            writer.writeString(this.stringStatValue);
        }
        else {
            let compressed = new compressed_int_1.CompressedInt();
            compressed.write(writer, this.statValue);
        }
        writer.writeByte(this.magicByte);
    }
    toString() {
        return `[StatData] Type: ${this.statToName(this.statType)} - Value: ${this.statValue} (extra byte: ${this.magicByte})`;
    }
    /**
     * Return whether or not the current stat has a string value
     */
    isStringStat() {
        switch (this.statType) {
            case models_1.StatType.NAME_STAT:
            case models_1.StatType.GUILD_NAME_STAT:
            case models_1.StatType.PET_NAME_STAT:
            case models_1.StatType.ACCOUNT_ID_STAT:
            case models_1.StatType.OWNER_ACCOUNT_ID_STAT:
            case models_1.StatType.GRAVE_ACCOUNT_ID:
                return true;
            default:
                return false;
        }
    }
    /**
     * Return the name of a current stat or another stat based on it's value
     * @param statType The ID of the stat type (optional)
     */
    statToName(statType = null) {
        let keys = Object.keys(models_1.StatType).map(key => models_1.StatType[key]).filter(value => typeof value === 'string');
        let values = Object.values(models_1.StatType);
        let index;
        if (statType === null) {
            index = values.findIndex(value => value === this.statType);
        }
        else {
            index = values.findIndex(value => value === statType);
        }
        if (index == -1) {
            return `Unknown ${(statType === null) ? this.statType : statType}`;
        }
        else {
            return keys[index];
        }
    }
}
exports.StatData = StatData;
