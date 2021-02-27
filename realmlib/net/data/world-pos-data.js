"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorldPosData = void 0;
class WorldPosData {
    /**
     * Creates a new point at the origin or at the provided, x, y.
     * @param x An x value for this point. Defaults to 0.
     * @param y A y value for this point. Defaults to 0.
     */
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }
    read(reader) {
        this.x = reader.readFloat();
        this.y = reader.readFloat();
    }
    write(writer) {
        writer.writeFloat(this.x);
        writer.writeFloat(this.y);
    }
    toString() {
        return `[WorldPosData] X: ${this.x} Y: ${this.y}`;
    }
    /**
     * Returns the square distance between this point and the other point.
     * @param point The other point.
     */
    squareDistanceTo(point) {
        if (!point || typeof point.x !== 'number' || typeof point.y !== 'number') {
            throw new TypeError(`Parameter "point" must be a Point, not ${typeof point}`);
        }
        const a = point.x - this.x;
        const b = point.y - this.y;
        return a ** 2 + b ** 2;
    }
    /**
     * Returns the distance between this point and the other point.
     * @param point The other point.
     */
    distanceTo(point) {
        return Math.sqrt(this.squareDistanceTo(point));
    }
    /**
     * Returns a new `Point` which has the same x and y values.
     */
    clone() {
        return new WorldPosData(this.x, this.y);
    }
}
exports.WorldPosData = WorldPosData;
