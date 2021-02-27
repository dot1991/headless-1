"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A wrapper for a `Socket` to provide a unique identifer for the socket.
 */
class SocketWrapper {
    /**
     * Creates a new socket wrapper with the given `id` and `socket`.
     * @param id The id of the socket.
     * @param socket The socket to wrap.
     */
    constructor(id, socket) {
        this.id = id;
        this.socket = socket;
    }
    /**
     * Removes any event listeners attached to the socket and destroys it.
     */
    destroy() {
        this.socket.removeAllListeners('close');
        this.socket.removeAllListeners('connect');
        this.socket.removeAllListeners('data');
        this.socket.removeAllListeners('error');
        this.socket.destroy();
        this.id = null;
        this.socket = null;
    }
}
exports.SocketWrapper = SocketWrapper;
