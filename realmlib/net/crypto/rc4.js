"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INCOMING_KEY = exports.OUTGOING_KEY = exports.RC4 = void 0;
/**
 * An inline-based implementation of the RC4 stream cipher.
 */
class RC4 {
    /**
     * Constructs a new RC4 cipher object and initializes
     * the Keystream State with the given key.
     * @param key The key to use in the Keystream.
     */
    constructor(key) {
        if (typeof key === 'string') {
            this.key = Buffer.from(key, 'hex');
        }
        else if (Buffer.isBuffer(key)) {
            this.key = key;
        }
        else {
            throw new TypeError(`Parameter "key" must be a Buffer or a string, not ${typeof key}`);
        }
        this.state = Buffer.alloc(256);
        this.i = 0;
        this.j = 0;
        this.reset();
    }
    /**
     * Performs an inline cipher on the entire contents of the `data` buffer.
     * @param data A stream of data to cipher using the Keystream.
     */
    cipher(data) {
        for (let n = 0; n < data.length; n++) {
            this.i = (this.i + 1) % 256;
            this.j = (this.j + this.state[this.i]) % 256;
            const tmp = this.state[this.i];
            this.state[this.i] = this.state[this.j];
            this.state[this.j] = tmp;
            const k = this.state[(this.state[this.i] + this.state[this.j]) % 256];
            /* tslint:disable-next-line no-bitwise */
            data[n] = data[n] ^ k;
        }
    }
    /**
     * Initializes the Keystream State.
     */
    reset() {
        this.i = 0;
        this.j = 0;
        for (let i = 0; i < 256; i++) {
            this.state[i] = i;
        }
        let j = 0;
        for (let i = 0; i < 256; i++) {
            j = (j + this.state[i] + this.key[i % this.key.length]) % 256;
            const tmp = this.state[i];
            this.state[i] = this.state[j];
            this.state[j] = tmp;
        }
    }
}
exports.RC4 = RC4;
/**
 * The RC4 Private Key used to encrypt outgoing packet.
 * This key is a Hex String, so should be converted to
 * a Buffer for use.
 * @example
 * const key = Buffer.from(OUTGOING_KEY, 'hex');
 */
exports.OUTGOING_KEY = '5a4d2016bc16dc64883194ffd9';
/**
 * The RC4 Private Key to decrypt incoming packet data.
 * This key is a Hex String, so should be converted to
 * a Buffer for use.
 * @example
 * const key = Buffer.from(INCOMING_KEY, 'hex');
 */
exports.INCOMING_KEY = 'c91d9eec420160730d825604e0';
