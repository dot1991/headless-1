"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A strongly typed representation of the events which the runtime can raise.
 */
var Events;
(function (Events) {
    /**
     * The event raised when a client has connected to a server.
     */
    Events["ClientConnect"] = "client_connect";
    /**
     * The event raised when a client has disconnected from a server.
     */
    Events["ClientDisconnect"] = "client_disconnect";
    /**
     * The event raised when a client is ready to send/receive packets.
     */
    Events["ClientReady"] = "client_ready";
    /**
     * The event raised when the client has drained its move queue.
     */
    Events["ClientArrived"] = "client_arrived";
    /**
     * The event raised when the client could not connect to the game server.
     */
    Events["ClientConnectError"] = "client_connect_error";
    /**
     * The event raised when the client connection is forcibly blocked.
     */
    Events["ClientBlocked"] = "client_connect_blocked";
})(Events = exports.Events || (exports.Events = {}));
