/// <reference types="node" />
import { EventEmitter } from 'events';
/**
 * A static singleton class which manages a local TCP server.
 */
export declare class LocalServer {
    /**
     * Initializes the Local Server and begins listening on the specified port.
     * @param port The port to listen for connections on.
     */
    static init(port?: number): void;
    /**
     * Writes data to all connected sockets. If `message` is not a buffer,
     * it will be converted to a buffer using `utf8` encoding. If it is
     * a buffer, it will not be affected.
     * @param message The message to send.
     */
    static write(message: string | Buffer): void;
    /**
     * Attaches an event listener to the Local Server.
     * @param event The name of the event to listen for. Available events are 'message'.
     * @param listener The callback to invoke when the event is fired.
     */
    static on(event: 'message', listener: (message: string) => void): EventEmitter;
    private static emitter;
    private static socketIdCounter;
    private static sockets;
    private static server;
    private static initialized;
    private static onConnection;
    private static getNextSocketId;
}
