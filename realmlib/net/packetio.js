"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacketIO = exports.PROXY_OUTGOING = exports.PROXY_INCOMING = exports.DEFAULT_RC4 = void 0;
const events_1 = require("events");
const net_1 = require("net");
const reader_1 = require("./reader");
const writer_1 = require("./writer");
const create_packet_1 = require("./create-packet");
const crypto_1 = require("./crypto");
/**
 * An RC4 configuration which is suitable for
 * PacketIO instances being used as a client
 */
exports.DEFAULT_RC4 = {
    incomingKey: crypto_1.INCOMING_KEY,
    outgoingKey: crypto_1.OUTGOING_KEY,
};
/**
 * An incoming data configuration for when the
 * PacketIO class is used for a proxy
 */
exports.PROXY_INCOMING = {
    incomingKey: crypto_1.INCOMING_KEY,
    outgoingKey: crypto_1.INCOMING_KEY
};
/**
 * An outgoing data configuration for when the
 * PacketIO class is used for a proxy
 */
exports.PROXY_OUTGOING = {
    incomingKey: crypto_1.OUTGOING_KEY,
    outgoingKey: crypto_1.OUTGOING_KEY
};
/**
 * A utility class which implements the RotMG messaging protocol on top of a `Socket`.
 */
class PacketIO extends events_1.EventEmitter {
    /**
     * Creates a new `PacketIO` instance
     * @param opts The options to use for this instance
     */
    constructor(opts = { rc4: exports.DEFAULT_RC4, packetMap: {} }) {
        super();
        if (!opts.rc4) {
            opts.rc4 = exports.DEFAULT_RC4;
        }
        this.writer = new writer_1.Writer();
        this.reader = new reader_1.Reader();
        this.outgoingQueue = [];
        this.sendRC4 = new crypto_1.RC4(opts.rc4.outgoingKey);
        this.receiveRC4 = new crypto_1.RC4(opts.rc4.incomingKey);
        this.packetMap = opts.packetMap || {};
        this.eventHandlers = new Map([
            ['data', this.onData.bind(this)],
            ['connect', this.resetState.bind(this)]
        ]);
        if (opts.socket) {
            this.attach(opts.socket);
        }
    }
    /**
     * The last packet which was received
     */
    get lastIncomingPacket() {
        return this.lastIncoming;
    }
    /**
     * The last packet which was sent
     */
    get lastOutgoingPacket() {
        return this.lastOutgoing;
    }
    /**
     * Attaches this Packet IO to the `socket`.
     * @param socket The socket to attach to.
     */
    attach(socket) {
        if (!(socket instanceof net_1.Socket)) {
            throw new TypeError(`Parameter "socket" should be a Socket, not ${typeof socket}`);
        }
        if (this.socket) {
            this.detach();
        }
        // we should reset the state here in
        // case the socket is already connected.
        this.resetState();
        this.socket = socket;
        for (const [event, listener] of this.eventHandlers) {
            this.socket.on(event, listener);
        }
    }
    /**
     * Detaches this Packet IO from its `Socket`.
     */
    detach() {
        if (this.socket) {
            for (const [event, listener] of this.eventHandlers) {
                this.socket.removeListener(event, listener);
            }
            this.socket = undefined;
        }
    }
    /**
     * Sends a packet.
     * @param packet The packet to send.
     */
    send(packet) {
        if (!this.socket || this.socket.destroyed) {
            this.emit('error', new Error('Not attached to a socket.'));
            return;
        }
        const type = this.packetMap[packet.type];
        if (type === undefined) {
            this.emit('error', new Error(`Mapper is missing an id for the packet type ${packet.type}`));
            return;
        }
        if (this.outgoingQueue.length === 0) {
            this.outgoingQueue.push(packet);
            this.drainQueue();
        }
        else {
            this.outgoingQueue.push(packet);
        }
    }
    /**
     * Takes packets from the outgoing queue and writes
     * them to the socket.
     */
    async drainQueue() {
        const packet = this.outgoingQueue.shift();
        this.lastOutgoing = packet;
        this.writer.index = 5;
        const type = this.packetMap[packet === null || packet === void 0 ? void 0 : packet.type];
        packet.write(this.writer);
        this.writer.writeHeader(type);
        this.sendRC4.cipher(this.writer.buffer.slice(5, this.writer.index));
        if (this.socket && !this.socket.write(this.writer.buffer.slice(0, this.writer.index))) {
            this.socket.once('drain', () => {
                if (this.outgoingQueue.length > 0) {
                    this.drainQueue();
                }
            });
        }
        else {
            process.nextTick(() => {
                if (this.outgoingQueue.length > 0) {
                    this.drainQueue();
                }
            });
        }
    }
    /**
     * Emits a packet from this PacketIO instance. This will only
     * emit the packet to the clients subscribed to this particular PacketIO.
     * @param packet The packet to emit.
     */
    emitPacket(packet) {
        if (packet && typeof packet.type === 'string') {
            this.lastIncoming = packet;
            this.emit(packet.type, packet);
        }
        else {
            throw new TypeError(`Parameter "packet" must be a Packet, not ${typeof packet}`);
        }
    }
    /**
     * Resets the reader buffer and the RC4 instances.
     */
    resetState() {
        this.resetBuffer();
        this.sendRC4.reset();
        this.receiveRC4.reset();
    }
    /**
     * Adds the data received from the socket to the reader buffer.
     * @param data The data received.
     */
    onData(data) {
        let dataIdx = 0;
        while (dataIdx < data.length) {
            const copied = data.copy(this.reader.buffer, this.reader.index, dataIdx, dataIdx + this.reader.remaining);
            dataIdx += copied;
            this.reader.index += copied;
            if (this.reader.remaining === 0) {
                if (this.reader.length === 4) {
                    const newSize = this.reader.buffer.readInt32BE(0);
                    this.reader.resizeBuffer(newSize);
                }
                else {
                    const packet = this.constructPacket();
                    this.resetBuffer();
                    if (packet) {
                        this.emitPacket(packet);
                    }
                }
            }
        }
    }
    /**
     * Attempts to create a packet from the data contained
     * in the reader buffer. No packet will be created if
     * there is no event listener for the packet type.
     */
    constructPacket() {
        this.receiveRC4.cipher(this.reader.buffer.slice(5, this.reader.length));
        try {
            const id = this.reader.buffer.readInt8(4);
            const type = this.packetMap[id];
            this.reader.index = 5;
            if (!type) {
                // this.emit('error', new Error(
                //   `Unmapped packet id ${id} received from server, buffer size: ${this.reader.length}\n\n` +
                //   `${this.reader.readBytes(this.reader.length).toString()}`
                //   ));
                return undefined;
            }
            if (this.listenerCount(type) !== 0) {
                const packet = create_packet_1.createPacket(type);
                packet.read(this.reader);
                return packet;
            }
        }
        catch (error) {
            this.emit('error', error);
        }
    }
    /**
     * Resets the incoming packet buffer so that it
     * is ready to receive the next packet header.
     */
    resetBuffer() {
        this.reader.resizeBuffer(4);
        this.reader.index = 0;
    }
}
exports.PacketIO = PacketIO;
