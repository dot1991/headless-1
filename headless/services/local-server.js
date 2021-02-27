"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const net_1 = require("net");
const models_1 = require("../models");
const logger_1 = require("./logger");
const DEFAULT_PORT = 5680;
/**
 * A static singleton class which manages a local TCP server.
 */
class LocalServer {
    /**
     * Initializes the Local Server and begins listening on the specified port.
     * @param port The port to listen for connections on.
     */
    static init(port) {
        if (!port) {
            port = DEFAULT_PORT;
        }
        if (this.initialized) {
            logger_1.Logger.log('Local Server', 'Local Server has already been initialized.', logger_1.LogLevel.Warning);
            return;
        }
        this.initialized = true;
        this.sockets = [];
        this.emitter = new events_1.EventEmitter();
        logger_1.Logger.log('Local Server', 'Initializing local server.', logger_1.LogLevel.Info);
        this.server = net_1.createServer(this.onConnection.bind(this));
        this.server.on('error', (err) => {
            logger_1.Logger.log('Local Server', err.message, logger_1.LogLevel.Error);
        });
        this.server.on('close', () => {
            logger_1.Logger.log('Local Server', 'Local Server closed.', logger_1.LogLevel.Warning);
        });
        this.server.on('listening', () => {
            logger_1.Logger.log('Local Server', `Local Server is now listening on port ${port}!`, logger_1.LogLevel.Success);
        });
        this.server.listen(port);
    }
    /**
     * Writes data to all connected sockets. If `message` is not a buffer,
     * it will be converted to a buffer using `utf8` encoding. If it is
     * a buffer, it will not be affected.
     * @param message The message to send.
     */
    static write(message) {
        if (!this.sockets) {
            return;
        }
        let buffer;
        if (!Buffer.isBuffer(message)) {
            buffer = Buffer.from(message, 'utf8');
        }
        else {
            buffer = message;
        }
        buffer = Buffer.concat([Buffer.alloc(4), buffer], buffer.length + 4);
        buffer.writeInt32LE(buffer.length - 4, 0);
        for (const wrapper of this.sockets) {
            if (wrapper.socket.writable) {
                wrapper.socket.write(buffer);
            }
        }
        buffer = null;
    }
    /**
     * Attaches an event listener to the Local Server.
     * @param event The name of the event to listen for. Available events are 'message'.
     * @param listener The callback to invoke when the event is fired.
     */
    static on(event, listener) {
        if (!this.emitter) {
            this.emitter = new events_1.EventEmitter();
        }
        return this.emitter.on(event, listener);
    }
    static onConnection(socket) {
        const wrapper = new models_1.SocketWrapper(this.getNextSocketId(), socket);
        this.sockets.push(wrapper);
        logger_1.Logger.log('Local Server', 'Socket connected!', logger_1.LogLevel.Success);
        wrapper.socket.on('close', (hadError) => {
            logger_1.Logger.log('Local Server', 'Socket disconnected.', logger_1.LogLevel.Warning);
            this.sockets.splice(this.sockets.findIndex((s) => s.id === wrapper.id), 1);
            wrapper.destroy();
        });
        wrapper.socket.on('data', (data) => {
            this.emitter.emit('message', (data.toString('utf8')));
        });
        wrapper.socket.on('error', (error) => {
            logger_1.Logger.log('Local Server', `Received socket error: ${error.message}`, logger_1.LogLevel.Debug);
        });
    }
    static getNextSocketId() {
        return this.socketIdCounter++;
    }
}
exports.LocalServer = LocalServer;
LocalServer.socketIdCounter = 0;
LocalServer.initialized = false;
