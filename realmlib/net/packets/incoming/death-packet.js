"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeathPacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Received when a player dies
 */
class DeathPacket {
    constructor() {
        this.type = packet_type_1.PacketType.DEATH;
        this.accountId = '';
        this.charId = 0;
        this.killedBy = '';
        this.zombieId = 0;
        this.zombieType = 0;
        this.unknown = 0;
        this.isZombie = false;
    }
    read(reader) {
        this.accountId = reader.readString();
        this.charId = reader.readInt32();
        this.killedBy = reader.readString();
        this.zombieType = reader.readInt32();
        this.zombieId = reader.readInt32();
        this.unknown = reader.readInt32();
        this.isZombie = this.zombieId !== -1;
    }
    write(writer) {
        writer.writeString(this.accountId);
        writer.writeInt32(this.charId);
        writer.writeString(this.killedBy);
        writer.writeInt32(this.zombieType);
        writer.writeInt32(this.zombieId);
    }
    toString() {
        return `[Death - 46] AccountId: ${this.accountId} - CharId: ${this.charId}\n
    KilledBy: ${this.killedBy}\n
    IsZombie: ${this.isZombie} - ZombieType: ${this.zombieType} - ZombieId: ${this.zombieId}\n
    Unknown: ${this.unknown}`;
    }
}
exports.DeathPacket = DeathPacket;
