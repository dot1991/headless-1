"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = require("../../realmlib/net");
const parsers = __importStar(require("../util/parsers"));
/**
 * An entity which exists in the game.
 */
class Entity {
    constructor(status) {
        this.objectData = parsers.processObjectStatus(status);
        this.lastUpdate = 0;
        this.lastTickId = -1;
        this.deadCounter = 0;
        this.dead = false;
        this.currentPos = status.pos.clone();
        this.tickPos = {
            x: this.currentPos.x,
            y: this.currentPos.y,
        };
        this.posAtTick = {
            x: this.currentPos.x,
            y: this.currentPos.y,
        };
        this.moveVector = {
            x: 0,
            y: 0,
        };
    }
    /**
     * Updates the entity based on the tick info
     *
     * @param objectStatus The object status of this
     * @param tickTime The time of this tick
     * @param tickId The tick id of this tick
     * @param clientTime The client time of this tick
     */
    onNewTick(objectStatus, tickTime, tickId, clientTime) {
        for (const status of objectStatus.stats) {
            if (status.statType === net_1.StatType.HP_STAT) {
                if (this.dead && status.statValue > 1 && ++this.deadCounter >= 2) {
                    this.dead = false;
                }
                break;
            }
        }
        this.objectData = parsers.processObjectStatus(objectStatus, this.objectData);
        if (this.lastTickId < tickId) {
            this.moveTo(this.tickPos.x, this.tickPos.y);
        }
        this.lastUpdate = clientTime;
        this.tickPos.x = objectStatus.pos.x;
        this.tickPos.y = objectStatus.pos.y;
        this.posAtTick.x = this.currentPos.x;
        this.posAtTick.y = this.currentPos.y;
        this.moveVector = {
            x: (this.tickPos.x - this.posAtTick.x) / tickTime,
            y: (this.tickPos.y - this.posAtTick.y) / tickTime,
        };
        this.lastTickId = tickId;
        this.lastUpdate = clientTime;
    }
    /**
     * Updates this entities state based on the current frame.
     * @param lastTick The last tick id.
     * @param clientTime The current client time.
     */
    frameTick(lastTick, clientTime) {
        if (!(this.moveVector.x === 0 && this.moveVector.y === 0)) {
            if (this.lastTickId < lastTick) {
                this.moveVector.x = 0;
                this.moveVector.y = 0;
                this.moveTo(this.tickPos.x, this.tickPos.y);
            }
            else {
                const time = clientTime - this.lastUpdate;
                const dX = this.posAtTick.x + time * this.moveVector.x;
                const dY = this.posAtTick.y + time * this.moveVector.y;
                this.moveTo(dX, dY);
            }
        }
    }
    /**
     * The square distance from some point to this entity.
     */
    squareDistanceTo(point) {
        const a = point.x - this.currentPos.x;
        const b = point.y - this.currentPos.y;
        return a ** 2 + b ** 2;
    }
    /**
     * Updates this entity based on a goto packet.
     * @param x The X position to go to.
     * @param y The Y position to go to.
     * @param time The client time.
     */
    onGoto(x, y, time) {
        this.moveTo(x, y);
        this.tickPos.x = x;
        this.tickPos.y = y;
        this.posAtTick.x = x;
        this.posAtTick.y = y;
        this.moveVector.x = 0;
        this.moveVector.y = 0;
        this.lastUpdate = time;
    }
    moveTo(x, y) {
        this.currentPos.x = x;
        this.currentPos.y = y;
    }
}
exports.Entity = Entity;
