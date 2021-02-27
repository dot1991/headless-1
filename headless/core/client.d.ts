import { PacketIO, Point, WorldPosData } from '../../realmlib/net';
import { Account, CharacterInfo, GameId, MapInfo, MapTile, PlayerData, Proxy, Server } from '../models';
import { Runtime } from '../runtime';
export declare class Client {
    playerData: PlayerData;
    objectId: number;
    worldPos: WorldPosData;
    io: PacketIO;
    mapTiles: MapTile[];
    nextPos: WorldPosData[];
    mapInfo: MapInfo;
    server: Server;
    readonly charInfo: CharacterInfo;
    alias: string;
    guid: string;
    password: string;
    readonly runtime: Runtime;
    set moveSpeed(value: number);
    get moveSpeed(): number;
    set connected(value: boolean);
    get connected(): boolean;
    get gameId(): GameId;
    get tutorialMode(): boolean;
    set tutorialMode(toggle: boolean);
    private socketConnected;
    private internalMoveMultiplier;
    private internalAutoNexusThreshold;
    private nexusServer;
    private internalServer;
    private lastTickTime;
    private lastTickId;
    private currentTickTime;
    private lastFrameTime;
    private readonly connectTime;
    private readonly buildVersion;
    private clientSocket;
    private proxy;
    private currentBulletId;
    private lastAttackTime;
    private pathfinder;
    private readonly pathfinderEnabled;
    private pathfinderTarget;
    private moveRecords;
    private frameUpdateTimer;
    private needsNewCharacter;
    private tutorialOnly;
    private connectionGuid;
    private key;
    private keyTime;
    private internalGameId;
    private reconnectCooldown;
    private ignoreReconCooldown;
    private random;
    private players;
    private safeMap;
    private tileMultiplier;
    private clientHP;
    private hpLog;
    /**
     * Creates a new instance of the client and begins the connection process
     * @param runtime The runtime managing the client
     * @param server The server to connect to
     * @param accInfo The account info to connect with
     */
    constructor(runtime: Runtime, server: Server, accInfo: Account);
    /**
     * Removes all event listeners and releases any resources held by the client.
     * This should only be used when the client is no longer needed.
     */
    destroy(processTick?: boolean): void;
    /**
     * Switches the client connect to a proxied connection. Setting this to
     * `undefined` will remove the current proxy if there is one.
     * @param proxy The proxy to use.
     */
    setProxy(proxy: Proxy): void;
    /**
     * Connects the bot to the `server`.
     * @param server The server to connect to.
     * @param gameId An optional game id to use when connecting. Defaults to the current game id.
     */
    connectToServer(server: Server, gameId?: GameId): void;
    /**
     * Connects to the Nexus.
     */
    connectToNexus(): void;
    /**
     * Connects to `gameId` on the current server
     *  @param gameId The gameId to use upon connecting.
     */
    changeGameId(gameId: GameId): void;
    /**
     * Returns how long the client has been connected for, in milliseconds.
     */
    getTime(): number;
    /**
     * Finds a path from the client's current position to the `to` point
     * and moves the client along the path.
     * @param to The point to navigate towards.
     */
    findPath(to: Point): void;
    /**
     * Returns the index of a map tile given a position and current map height
     * @param tile The current tile
     */
    getMapTileIndex(tile: WorldPosData): number;
    /**
     * Applies some damage and returns whether or not the client should
     * return to the nexus
     * @param amount The amount of damage to apply
     * @param armorPiercing Whether or not the damage should be armor piercing
     * @param time The time the damage was taken at
     */
    private applyDamage;
    private onDamage;
    private onMapInfo;
    private onDeath;
    private onNotification;
    private onUpdate;
    private onReconnectPacket;
    private onGotoPacket;
    private onFailurePacket;
    private onAoe;
    private onNewTick;
    private onPing;
    private onServerPlayerShoot;
    private onCreateSuccess;
    private onFrame;
    private onConnect;
    private sendHello;
    private onClose;
    private onError;
    /**
     * Fixes the character cache after a dead character has been loaded.
     */
    private fixCharInfoCache;
    private connect;
    walkTo(x: number, y: number): void;
    private moveTo;
    private getSpeed;
    /**
     * Sends a packet only if the client is currently connected.
     * @param packet The packet to send.
     */
    private send;
    private calcHealth;
    private checkHealth;
    private addHealth;
}
