/// <reference types="node" />
import { Socket } from 'net';
/**
 * A wrapper for a `Socket` to provide a unique identifer for the socket.
 */
export declare class SocketWrapper {
    /**
     * The unique identifier of this socket.
     */
    id: number;
    /**
     * The socket which this is wrapping.
     */
    socket: Socket;
    /**
     * Creates a new socket wrapper with the given `id` and `socket`.
     * @param id The id of the socket.
     * @param socket The socket to wrap.
     */
    constructor(id: number, socket: Socket);
    /**
     * Removes any event listeners attached to the socket and destroys it.
     */
    destroy(): void;
}
