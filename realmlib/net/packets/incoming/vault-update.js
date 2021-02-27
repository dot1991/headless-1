"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VaultUpdatePacket = void 0;
const packet_type_1 = require("../../packet-type");
const compressed_int_1 = require("../../data/compressed-int");
/**
 * Received for information when the player enters the new vault
 */
class VaultUpdatePacket {
    constructor() {
        this.type = packet_type_1.PacketType.VAULT_UPDATE;
        this.vaultContents = [];
        this.giftContents = [];
        this.potionContents = [];
        this.vaultUpgradeCost = 0;
        this.potionUpgradeCost = 0;
        this.currentPotionMax = 0;
        this.nextPotionMax = 0;
    }
    read(reader) {
        /* read the lengths of the chests into the buffer */
        compressed_int_1.read(reader);
        compressed_int_1.read(reader);
        compressed_int_1.read(reader);
        compressed_int_1.read(reader);
        let counter = 0;
        let itemCount = compressed_int_1.read(reader);
        while (counter < itemCount) {
            this.vaultContents.push(compressed_int_1.read(reader));
            counter++;
        }
        let giftItemCount = compressed_int_1.read(reader);
        counter = 0;
        while (counter < giftItemCount) {
            this.giftContents.push(compressed_int_1.read(reader));
            counter++;
        }
        let potionCount = compressed_int_1.read(reader);
        counter = 0;
        while (counter < potionCount) {
            this.potionContents.push(compressed_int_1.read(reader));
            counter++;
        }
        this.vaultUpgradeCost = reader.readShort();
        this.potionUpgradeCost = reader.readShort();
        this.currentPotionMax = reader.readShort();
        this.nextPotionMax = reader.readShort();
    }
    write(writer) {
        writer.writeInt32(this.vaultContents.length);
        for (const item of this.vaultContents) {
            writer.writeInt32(item);
        }
        writer.writeInt32(this.giftContents.length);
        for (const item of this.giftContents) {
            writer.writeInt32(item);
        }
        writer.writeInt32(this.potionContents.length);
        for (const item of this.potionContents) {
            writer.writeInt32(item);
        }
        writer.writeShort(this.vaultUpgradeCost);
        writer.writeShort(this.potionUpgradeCost);
        writer.writeShort(this.currentPotionMax);
        writer.writeShort(this.nextPotionMax);
    }
}
exports.VaultUpdatePacket = VaultUpdatePacket;
