import { Reader } from '../reader';
import { Writer } from '../writer';
export declare class CompressedInt {
    read(reader: Reader): number;
    write(writer: Writer, amount: number): void;
}
