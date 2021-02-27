import { SlotObjectData } from '../../data';
import { Packet } from '../../packet';
import { Reader } from '../../reader';
import { Writer } from '../../writer';
export declare class UseForgePacket implements Packet {
    readonly type: any;
    /**
     * The object id of the item to forge.
     */
    objectId: number;
    /**
     * The items to dismantle.
     */
    slotsUsed: SlotObjectData;
    constructor();
    write(writer: Writer): void;
    read(reader: Reader): void;
}
