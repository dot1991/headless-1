import { Packet } from '../../packet';
import { PacketType } from '../../packet-type';
import { Reader } from '../../reader';
import { Writer } from '../../writer';
/**
 * Received in response to the `HelloPacket`.
 */
export declare class MapInfoPacket implements Packet {
    readonly type = PacketType.MAPINFO;
    /**
     * The width of the map.
     */
    width: number;
    /**
     * The height of the map.
     */
    height: number;
    /**
     * The name of the map.
     */
    name: string;
    /**
     * > Unknown.
     */
    displayName: string;
    /**
     * The name of the realm.
     */
    realmName: string;
    /**
     * The difficulty rating of the map.
     */
    difficulty: number;
    /**
     * The seed value for the client's PRNG.
     */
    fp: number;
    /**
     * > Unkown.
     */
    background: number;
    /**
     * Whether or not players can teleport in the map.
     */
    allowPlayerTeleport: boolean;
    /**
     * > Unkown.
     */
    showDisplays: boolean;
    /**
     * The number of players allowed in this map.
     */
    maxPlayers: number;
    /**
     * The connection guid to use for the hello packet.
     */
    connectionGuid: string;
    /**
     * > Unkown.
     */
    clientXML: string[];
    /**
     * > Unkown.
     */
    extraXML: string[];
    /**
     * > Unknown.
     */
    gameOpenedTime: number;
    constructor();
    read(reader: Reader): void;
    write(writer: Writer): void;
}
