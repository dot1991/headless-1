import { ObjectData } from '../../realmlib/net';
import { Client } from '../core';
/**
 * An event listener for events emitted by the `ObjectTracker`.
 */
export declare type ObjectEventListener = (obj: ObjectData, client: Client) => void;
export declare class ObjectTracker {
    private emitter;
    private readonly trackedTypes;
    private readonly trackedObjects;
    constructor();
    /**
     * Attaches an event listener to the specified event.
     * @param event The event to attach the listener to.
     * @param listener The function to invoke when the event is fired.
     */
    on(event: number | 'any', listener: ObjectEventListener): this;
    /**
     * Starts tracking the specified object,
     * and optionally attaches an event listener.
     * @param objectType The object type to start track.
     * @param listener An optional event listener to attach.
     */
    startTracking(objectType: number, listener?: ObjectEventListener): this;
    /**
     * Stops tracking the specified object and
     * removes any event listeners for it.
     * @param objectType The object type to stop tracking.
     */
    stopTracking(objectType: number): this;
    private onUpdate;
    private onNewTick;
}
