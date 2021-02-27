import { Packet } from '../../packet';
import { PacketType } from '../../packet-type';
import { Reader } from '../../reader';
import { Writer } from '../../writer';
/**
 * Sent to prompt the server to accept the connection of an account
 * and reply with a `MapInfoPacket`.
 */
export declare class HelloPacket implements Packet {
    readonly type = PacketType.HELLO;
    /**
     * The current build version of RotMG.
     */
    buildVersion: string;
    /**
     * The id of the map to connect to.
     */
    gameId: number;
    /**
     * The email of the account being used.
     */
    guid: string;
    /**
     * A random 32 bit integer value.
     */
    random1: number;
    /**
     * The password of the account being used.
     */
    password: string;
    /**
     * A random 32 bit integer value.
     */
    random2: number;
    /**
     * The client secret of the account being used.
     */
    secret: string;
    /**
     * The key time of the `key` being used.
     */
    keyTime: number;
    /**
     * The key of the map to connect to.
     */
    key: number[];
    /**
     * > Unknown.
     */
    mapJSON: string;
    /**
     * > Unknown.
     */
    entryTag: string;
    /**
     * > Unknown.
     */
    gameNet: string;
    /**
     * > Unknown.
     */
    gameNetUserId: string;
    /**
     * > Unknown.
     */
    playPlatform: string;
    /**
     * > Unknown.
     */
    platformToken: string;
    /**
     * > Unknown.
     */
    userToken: string;
    /**
     * A random string which is appended to the end of the hello packet.
     */
    trailer: string;
    /**
     * The connection guid of the last map info packet.
     */
    previousConnectionGuid: string;
    constructor();
    write(writer: Writer): void;
    read(reader: Reader): void;
}
