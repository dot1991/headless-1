"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivePetUpdateRequestPacket = void 0;
const models_1 = require("../../../models");
const packet_type_1 = require("../../../packet-type");
/**
 * Sent to make an update to the pet currently following the player
 */
class ActivePetUpdateRequestPacket {
    constructor() {
        this.type = packet_type_1.PacketType.ACTIVE_PET_UPDATE_REQUEST;
        this.commandType = 0;
        this.instanceId = 0;
    }
    write(writer) {
        writer.writeByte(this.commandType);
        writer.writeInt32(this.instanceId);
    }
    read(reader) {
        this.commandType = reader.readByte();
        this.instanceId = reader.readInt32();
    }
    typeToName(command) {
        switch (command) {
            case models_1.ActivePetUpdateType.Follow:
                return `${command} : Follow`;
            case models_1.ActivePetUpdateType.Release:
                return `${command} : Release`;
            case models_1.ActivePetUpdateType.Unfollow:
                return `${command} : Unfollow`;
            default:
                return `${command} : Unknown`;
        }
    }
    toString() {
        return `[ActivePetUpdateRequest - 24] CommandType: ${this.typeToName(this.commandType)} - InstanceId: ${this.instanceId}`;
    }
}
exports.ActivePetUpdateRequestPacket = ActivePetUpdateRequestPacket;
