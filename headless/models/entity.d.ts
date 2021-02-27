import { ObjectStatusData, Point } from '../../realmlib/net';
import { PlayerData } from './playerdata';
/**
 * An entity which exists in the game.
 */
export declare class Entity {
    /**
     * Stat information of the entity, such as HP and defense.
     */
    objectData: PlayerData;
    /**
     * The client time of the last update that this entity received.
     */
    lastUpdate: number;
    /**
     * The position of the entity as received in a `NewTick` packet.
     */
    tickPos: Point;
    /**
     * The position of the entity at a particular game tick.
     */
    posAtTick: Point;
    /**
     * The velocity of the entity.
     */
    moveVector: Point;
    /**
     * The tick id of the last game tick received by this entity.
     */
    lastTickId: number;
    /**
     * The current position of the entity.
     */
    currentPos: Point;
    /**
     * Whether or not this entity is dead.
     */
    dead: boolean;
    private deadCounter;
    constructor(status: ObjectStatusData);
    /**
     * Updates the entity based on the tick info
     *
     * @param objectStatus The object status of this
     * @param tickTime The time of this tick
     * @param tickId The tick id of this tick
     * @param clientTime The client time of this tick
     */
    onNewTick(objectStatus: ObjectStatusData, tickTime: number, tickId: number, clientTime: number): void;
    /**
     * Updates this entities state based on the current frame.
     * @param lastTick The last tick id.
     * @param clientTime The current client time.
     */
    frameTick(lastTick: number, clientTime: number): void;
    /**
     * The square distance from some point to this entity.
     */
    squareDistanceTo<T extends Point>(point: T): number;
    /**
     * Updates this entity based on a goto packet.
     * @param x The X position to go to.
     * @param y The Y position to go to.
     * @param time The client time.
     */
    onGoto(x: number, y: number, time: number): void;
    private moveTo;
}
