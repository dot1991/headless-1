import { ObjectStatusData } from '../../data/object-status-data';
import { Packet } from '../../packet';
import { PacketType } from '../../packet-type';
import { Reader } from '../../reader';
import { Writer } from '../../writer';
/**
 * Received to notify the player of a new game tick.
 */
export declare class NewTickPacket implements Packet {
    readonly type = PacketType.NEWTICK;
    /**
     * The id of the tick.
     */
    tickId: number;
    /**
     * The time between the last tick and this tick, in milliseconds.
     *
     * This is not always accurate, so it is better to calculate it manually
     * if millisecond-level accuracy is required.
     */
    tickTime: number;
    /**
     * Server realtime in ms
     */
    serverRealTimeMS: number;
    /**
     * Last server realtime in ms
     */
    serverLastTimeRTTMS: number;
    /**
     * An array of statuses for objects which are currently visible to the player.
     *
     * "visible" objects can include objects which would normally be off screen,
     * such as players, which are always at least visible on the minimap.
     */
    statuses: ObjectStatusData[];
    constructor();
    read(reader: Reader): void;
    write(writer: Writer): void;
}
