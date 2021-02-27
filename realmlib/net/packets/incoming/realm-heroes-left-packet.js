"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealmHeroesLeftPacket = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Received to tell the client how many heroes are left in the current realm.
 */
class RealmHeroesLeftPacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.REALM_HERO_LEFT_MSG;
        this.realmHeroesLeft = 0;
    }
    read(reader) {
        this.realmHeroesLeft = reader.readInt32();
    }
    write(writer) {
        writer.writeInt32(this.realmHeroesLeft);
    }
}
exports.RealmHeroesLeftPacket = RealmHeroesLeftPacket;
