"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImminentArenaWavePacket = void 0;
const packet_type_1 = require("../../../packet-type");
/**
 * Received when a new arena wave is about to begin.
 */
class ImminentArenaWavePacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.IMMINENT_ARENA_WAVE;
        this.propagate = true;
        this.currentRuntime = 0;
    }
    read(reader) {
        this.currentRuntime = reader.readInt32();
    }
    write(writer) {
        writer.writeInt32(this.currentRuntime);
    }
}
exports.ImminentArenaWavePacket = ImminentArenaWavePacket;
