/// <reference types="node" />
import { EventEmitter } from 'events';
import { PetData } from '../models/pets';
import { Runtime } from '../runtime';
import { Client } from '../core';
/**
 * An event listener for events emitted by the `PetTracker`.
 */
export declare type PetEventListener = (pet: PetData, client: Client) => void;
export declare class PetTracker {
    private runtime;
    private emitter;
    private readonly trackedPets;
    constructor(runtime: Runtime);
    /**
     * Attaches an event listener to the specified event.
     * @param event The event to attach the listener to.
     * @param listener The function to invoke when the event is fired.
     */
    on(event: 'enter' | 'leave', listener: PetEventListener): EventEmitter;
    /**
     * Returns all of the pets which are currently being tracked.
     */
    getAllPets(): PetData[];
    /**
     * Returns the list of pets visible to the `client` provided.
     * @param client The client to get pets for.
     */
    getPetsFor(client: Client): PetData[];
    private onUpdate;
    private onNewTick;
    private parsePetData;
}
