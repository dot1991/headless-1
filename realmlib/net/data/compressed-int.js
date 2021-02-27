"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompressedInt = void 0;
class CompressedInt {
    read(reader) {
        let uByte = reader.readUnsignedByte();
        const isNegative = (uByte & 64) !== 0;
        let shift = 6;
        let value = uByte & 63;
        while (uByte & 128) {
            uByte = reader.readUnsignedByte();
            value = value | (uByte & 127) << shift;
            shift += 7;
        }
        if (isNegative) {
            value = -value;
        }
        return value;
    }
    write(writer, amount) {
        const isNegative = amount < 0;
        let value = isNegative ? -amount : amount;
        let byte = value & 63;
        if (isNegative) {
            byte |= 64;
        }
        value >>= 6;
        const isPositive = amount > 0;
        if (isPositive) {
            byte |= 128;
        }
        writer.writeUnsignedByte(byte);
        while (isPositive) {
            byte = value & 127;
            value >>= 7;
            if (isPositive) {
                byte |= 128;
            }
            writer.writeUnsignedByte(byte);
        }
    }
}
exports.CompressedInt = CompressedInt;
