"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewAbilityMessage = void 0;
const packet_type_1 = require("../../packet-type");
/**
 * Received when a new ability has been unlocked by the player.
 */
class NewAbilityMessage {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.NEW_ABILITY;
        this.abilityType = 0;
    }
    read(reader) {
        this.abilityType = reader.readInt32();
    }
    write(writer) {
        writer.writeInt32(this.abilityType);
    }
}
exports.NewAbilityMessage = NewAbilityMessage;
