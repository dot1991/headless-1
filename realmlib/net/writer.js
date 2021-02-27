"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Writer = void 0;
/**
 * A wrapper class which provides methods
 * for writing data to a buffer.
 */
class Writer {
    /**
     * Creates a new `Writer` and initialises the
     * wrapped buffer to the default size of 8.
     */
    constructor() {
        this.size = 8;
        this.index = 0;
        this.buffer = Buffer.alloc(this.size);
    }
    /**
     * Writes a packet header to the first 5 bytes of this writer's buffer.
     * @param id The id to write to the header.
     */
    writeHeader(id) {
        this.buffer.writeInt32BE(this.index, 0);
        this.buffer.writeInt8(id, 4);
    }
    /**
     * Writes a 4 byte integer to the buffer.
     * @param value The value to write.
     */
    writeInt32(value) {
        if (isNaN(value)) {
            value = 0;
        }
        this.checkCapacity(4);
        this.index = this.buffer.writeInt32BE(value, this.index);
    }
    /**
     * Writes a 4 byte unsigned integer to the buffer.
     * @param value The value to write.
     */
    writeUInt32(value) {
        if (isNaN(value)) {
            value = 0;
        }
        this.checkCapacity(4);
        this.index = this.buffer.writeUInt32BE(value, this.index);
    }
    /**
     * Writes a 2 byte integer to the buffer.
     * @param value The value to write.
     */
    writeShort(value) {
        if (isNaN(value)) {
            value = 0;
        }
        this.checkCapacity(2);
        this.index = this.buffer.writeInt16BE(value, this.index);
    }
    /**
     * Writes a 2 byte unsigned integer to the buffer.
     * @param value The value to write.
     */
    writeUnsignedShort(value) {
        if (isNaN(value)) {
            value = 0;
        }
        this.checkCapacity(2);
        this.index = this.buffer.writeUInt16BE(value, this.index);
    }
    /**
     * Writes a 1 byte integer to the buffer.
     * @param value The value to write.
     */
    writeByte(value) {
        if (isNaN(value)) {
            value = 0;
        }
        this.checkCapacity(1);
        this.index = this.buffer.writeInt8(value, this.index);
    }
    /**
     * Writes a 1 byte unsigned integer to the buffer.
     * @param value The value to write.
     */
    writeUnsignedByte(value) {
        if (isNaN(value)) {
            value = 0;
        }
        this.checkCapacity(1);
        this.index = this.buffer.writeUInt8(value, this.index);
    }
    /**
     * Writes a single byte to the buffer. Writes `1` if the value is `true` and `0` otherwise.
     * @param value The value to write.
     */
    writeBoolean(value) {
        if (typeof value !== 'boolean') {
            value = false;
        }
        const byteValue = value ? 1 : 0;
        this.writeByte(byteValue);
    }
    /**
     * Writes a 4 byte floating point value to the buffer.
     * @param value The value to write.
     */
    writeFloat(value) {
        if (isNaN(value)) {
            value = 0;
        }
        this.checkCapacity(4);
        this.index = this.buffer.writeFloatBE(value, this.index);
    }
    /**
     * Writes the length of the array as a 2 byte integer, then writes `length` bytes to the buffer.
     * @param value The value to write.
     */
    writeByteArray(value) {
        if (!Array.isArray(value)) {
            this.writeShort(0);
            return;
        }
        this.writeShort(value.length);
        this.checkCapacity(value.length);
        for (const byte of value) {
            this.buffer[this.index++] = byte;
        }
    }
    /**
     * Writes the length of the string as a 2 byte integer, then writes the string to the buffer.
     * @param value The value to write.
     */
    writeString(value) {
        if (typeof value !== 'string') {
            this.writeShort(0);
            return;
        }
        this.writeShort(value.length);
        this.checkCapacity(value.length);
        this.index += this.buffer.write(value, this.index, value.length, 'utf8');
    }
    /**
     * The same as `writeString()`, but writes 4 bytes for the length.
     * @param value The value to write.
     */
    writeStringUTF32(value) {
        if (typeof value !== 'string') {
            this.writeInt32(0);
            return;
        }
        this.writeInt32(value.length);
        this.checkCapacity(value.length);
        this.index += this.buffer.write(value, this.index, value.length, 'utf8');
    }
    /**
     * Ensures there is enough capacity in the current buffer to store `addedBytes` more bytes.
     * @param addedBytes The number of bytes which need to be added.
     */
    checkCapacity(addedBytes) {
        while (this.index + addedBytes > this.buffer.length) {
            this.buffer = Buffer.concat([this.buffer, Buffer.alloc(this.size)], this.size * 2);
            this.size *= 2;
        }
    }
}
exports.Writer = Writer;
