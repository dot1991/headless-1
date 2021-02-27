/// <reference types="node" />
import { EventEmitter } from 'events';
import { Runtime } from '../runtime';
import { Client } from './../core';
import { PlayerData } from './../models';
/**
 * An event listener for events emitted by the `PlayerTracker`.
 */
export declare type PlayerEventListener = (player: PlayerData, client: Client) => void;
export declare class PlayerTracker {
    private emitter;
    private readonly trackedPlayers;
    constructor(runtime: Runtime);
    /**
     * Attaches an event listener to the specified event.
     * @param event The event to attach the listener to.
     * @param listener The function to invoke when the event is fired.
     */
    on(event: 'enter' | 'leave', listener: PlayerEventListener): EventEmitter;
    /**
     * Returns all tracked players, or an empty array if there are no clients tracking players.
     */
    getAllPlayers(): PlayerData[];
    /**
     * Returns the list of players visible to the `client` provided.
     * @param client The client to get players for.
     */
    getPlayersFor(client: Client): PlayerData[] | null;
    private onUpdate;
    private onNewTick;
}
