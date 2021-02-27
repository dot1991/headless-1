"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShootAckPacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Sent to acknowledge an `EnemyShootPacket`.
 */
class ShootAckPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.SHOOTACK;
        this.time = 0;
    }
    write(writer) {
        writer.writeInt32(this.time);
    }
    read(reader) {
        this.time = reader.readInt32();
    }
}
exports.ShootAckPacket = ShootAckPacket;
