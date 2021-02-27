"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePacket = void 0;
const data_1 = require("../../data");
const packet_type_1 = require("../../packet-type");
/**
 * Received when an update even occurs. Some events include
 * + One or more new objects have entered the map (become visible)
 * + One or more objects have left the map (become invisible)
 * + New tiles are visible
 */
class UpdatePacket {
    //#endregion
    constructor() {
        this.type = packet_type_1.PacketType.UPDATE;
        this.tiles = [];
        this.newObjects = [];
        this.drops = [];
    }
    read(reader) {
        this.tiles = new Array(new data_1.CompressedInt().read(reader));
        for (let i = 0; i < this.tiles.length; i++) {
            const gd = new data_1.GroundTileData();
            gd.read(reader);
            this.tiles[i] = gd;
        }
        const newObjectsLen = new data_1.CompressedInt().read(reader);
        this.newObjects = new Array(newObjectsLen);
        for (let i = 0; i < newObjectsLen; i++) {
            const od = new data_1.ObjectData();
            od.read(reader);
            this.newObjects[i] = od;
        }
        const dropsLen = new data_1.CompressedInt().read(reader);
        this.drops = new Array(dropsLen);
        for (let i = 0; i < dropsLen; i++) {
            this.drops[i] = new data_1.CompressedInt().read(reader);
        }
    }
    write(writer) {
        new data_1.CompressedInt().write(writer, this.tiles.length);
        for (const tile of this.tiles) {
            tile.write(writer);
        }
        new data_1.CompressedInt().write(writer, this.tiles.length);
        for (const obj of this.newObjects) {
            obj.write(writer);
        }
        new data_1.CompressedInt().write(writer, this.tiles.length);
        for (const drop of this.drops) {
            new data_1.CompressedInt().write(writer, drop);
        }
    }
}
exports.UpdatePacket = UpdatePacket;
