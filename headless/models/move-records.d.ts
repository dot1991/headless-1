import { MoveRecord } from '../../realmlib/net';
/**
 * This code is mostly ported from the RotMG game client. It's
 * exact functionality is unknown.
 */
export declare class MoveRecords {
    lastClearTime: number;
    records: MoveRecord[];
    constructor();
    addRecord(time: number, x: number, y: number): void;
    clear(time: number): void;
    private getId;
    private getScore;
}
