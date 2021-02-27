"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PetUpgradeRequestPacket = void 0;
const data_1 = require("../../../data");
const packet_type_1 = require("../../../packet-type");
/**
 * Sent when you are feeding and fusing pets or upgrading your pet yard
 */
class PetUpgradeRequestPacket {
    constructor() {
        this.type = packet_type_1.PacketType.PETUPGRADEREQUEST;
        this.petTransType = 0;
        this.pIdOne = 0;
        this.pIdTwo = 0;
        this.objectId = 0;
        this.slotObjects = [];
        this.paymentType = 0;
    }
    write(writer) {
        writer.writeByte(this.petTransType);
        writer.writeInt32(this.pIdOne);
        writer.writeInt32(this.pIdTwo);
        writer.writeInt32(this.objectId);
        writer.writeByte(this.paymentType);
        writer.writeShort(this.slotObjects.length);
        for (const slotObject of this.slotObjects) {
            slotObject.write(writer);
        }
    }
    read(reader) {
        this.petTransType = reader.readByte();
        this.pIdOne = reader.readInt32();
        this.pIdTwo = reader.readInt32();
        this.objectId = reader.readInt32();
        this.paymentType = reader.readByte();
        const slotObjectLen = reader.readShort();
        this.slotObjects = new Array(slotObjectLen);
        for (let i = 0; i < slotObjectLen; i++) {
            this.slotObjects[i] = new data_1.SlotObjectData();
            this.slotObjects[i].read(reader);
        }
    }
    toString(showSlots = true) {
        let str = `[PetUpgradeRequest - 16] TransType: ${this.petTransType}\nPetIdOne: ${this.pIdOne}\nPetIdTwo: ${this.pIdTwo}\n
    ObjectId: ${this.objectId}\nPaymentType ${this.paymentType}\nSlot count: ${this.slotObjects.length}`;
        if (!showSlots) {
            return str;
        }
        else {
            for (let i = 0; i < this.slotObjects.length; i++) {
                if (i == 0) {
                    str += `\n${this.slotObjects[i].toString()}\n`;
                }
                else if (i == this.slotObjects.length - 1) {
                    str += this.slotObjects[i].toString();
                }
                else {
                    str += `${this.slotObjects[i].toString()}\n`;
                }
            }
            return str;
        }
    }
}
exports.PetUpgradeRequestPacket = PetUpgradeRequestPacket;
