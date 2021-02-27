import {
    Client,
    Events,
    Library,
    Logger,
    LogLevel,
    MapInfoPacket,
    TextPacket,
    PacketHook,
    PlayerData,
    Runtime,
    UpdatePacket,
    WorldPosData,
    ObjectStatusData,
} from '../../headless';

import { Objects, States, Positions } from './configs/player-tracker.json';
import { NewDiscord as DiscordBot } from './discord/new-bot';
import { RedisClient as Tracking } from './database';
import { RealmPortal } from './models';

import { PlayerTracker as Tracker } from '../../headless/stdlib/player-tracker';
import { parseClass } from './discord/parsers';

interface ClientSetting<T> {
    [guid: string]: T;
}

const LeftBazaar = new WorldPosData(106, 182)
const RightBazaar = new WorldPosData(148, 182)

@Library({
    name: 'player-tracker',
    author: 'him',
    enabled: false,
})
export class PlayerTracker {
    tracker: Tracker;
    discord: DiscordBot;
    redis: Tracking;

    TrackedPlayers: ClientSetting<PlayerData[]>;
    PortalList: ClientSetting<RealmPortal[]>;

    ClientState: ClientSetting<number>;
    ClientServer: ClientSetting<string>;

    /**
     * Called when a client loads into a map
     * @param client
     * @param map
     */
    @PacketHook()
    onMapInfo(client: Client, map: MapInfoPacket): void {
        // set the client's server name when it first loads into the nexus
        if (!this.ClientServer[client.guid]) {
            this.ClientServer[client.guid] = client.server.name;
        }
    }

    /**
     * Called when a text packet is received by a client
     * Used to track key pops or event notifications
     *
     * @param client the client that received the packet
     * @param textPacket the data from the text packet
     */
    @PacketHook()
    onText(client: Client, textPacket: TextPacket): void {
        if (client.mapInfo.name === 'Nexus') {
            if (textPacket.text.startsWith('{"key":"server.dungeon_opened_by"')) {
                try {
                    let keypop = JSON.parse(textPacket.text);
                    //this.discord.callKey(
                    //    keypop.tokens.dungeon,
                    //    client.server.name,
                    //    keypop.tokens.name
                    //);
                } catch (e) {
                    Logger.log('TextPacket', 'Failed parsing TextPacket')
                }
            }
        }
    }

    /**
     * Called when an update packet is received by a client
     * @param client
     * @param update
     */
    @PacketHook()
    onUpdate(client: Client, update: UpdatePacket): void {
        let state = this.getState(client);

        switch (state) {
            case States.Started:
                this.setState(client, States.Waiting)
                //this.setState(client, States.WalkingToPortals);
                //this.walkToPos(
                    //client,
                    //new WorldPosData(Positions.Portals.x, Positions.Portals.y)
                //);
                break;
            case States.WalkingToPortals:
            case States.WalkingToStart:
                // scan every new object
                for (let i = 0; i < update.newObjects.length; i++) {
                    // check if the object is a realm portal and parse the statdata
                    if (update.newObjects[i].objectType == Objects.RealmPortal) {
                        let portal = this.parsePortalData(
                            client,
                            update.newObjects[i].status
                        );
                        // check if the portal isn't a ghost object
                        if (portal !== null) {
                            let index = this.PortalList[client.guid].findIndex(
                                (x) =>
                                    x.name == portal.name &&
                                    x.server == portal.server
                            );
                            if (index == -1) {
                                this.PortalList[client.guid][index] = portal;
                                Logger.log('PlayerTracker', `Found existing portal ${portal.server} ${portal.name}`, LogLevel.Debug);
                            } else {
                                this.PortalList[client.guid].push(portal);
                                Logger.log('PlayerTracker', `Found new portal ${portal.server} ${portal.name} at pos ${portal.position.x} ${portal.position.y}`, LogLevel.Debug);
                            }
                        }
                    }
                }
        }
    }

    /**
     * Called when a player enters the nexus
     * 
     * @param player the player
     * @param client the client tracking the player
     */
    private async onPlayerEnter(player: PlayerData, client: Client) {
        if (!player.nameChosen) return;

        Logger.log(
            'PlayerTracker',
            `Player ${player.name} entered the nexus\n` +
                `[Server] ${player.server}\n` +
                `[Position] ${player.worldPos.x} ${player.worldPos.y}` +
                `[Class] ${parseClass(player.class)}\n` +
                `[Char fame] ${player.currentFame}\n` +
                `[Time] ${Date.now}\n`,
            LogLevel.Debug
        );
        await this.redis.players.addPlayerLocation(player, 'nexus');
        this.TrackedPlayers[client.guid].push(player);

        let trackers = await this.redis.players.getTrackers(player.name);
        if (trackers.length > 0) {
            trackers.forEach((tracker) => {
                
            })
        }

        if (!player.name.match(/^[A-z]+$/g)) {
            // call invalid name
        }
        
        if (player.currentFame > 50000) {
            // call high fame player
        }
        if (player.gold > 25000) {
            // call high gold player
        }
        if (player.guildName == "DecaGMs" && player.name !== "MrEyeball") {
            // call game manager location
        }
    }

    /**
     * Called when a player leaves the nexus
     * 
     * @param player the player
     * @param client the client tracking the player
     */
    private onPlayerLeave(player: PlayerData, client: Client): void {
        if (!player.nameChosen) return;

        let index = this.TrackedPlayers[client.guid].findIndex(
            (x) => x.name == player.name
        );
        if (index == -1) return;

        this.TrackedPlayers[client.guid].splice(index, 1);

        let location = this.calculateLocation(player.worldPos);

        Logger.log(
            'PlayerTracker',
            `Player ${player.name} LEFT the nexus\n` +
                `[Server] ${player.server}\n` +
                `[Position] ${player.worldPos.x} ${player.worldPos.y}` +
                `[Class] ${parseClass(player.class)}\n` +
                `[Char fame] ${player.currentFame}\n` +
                `[Time] ${Date.now}\n` +
                `[Location] ${location}`,
            LogLevel.Debug
        );

        this.redis.players.addPlayerLocation(player, location).then(r => {});
    }

    /**
     * Called when a tracked player's StatData updates
     * 
     * @param player the player
     * @param client the client tracking the player
     */
    private onPlayerChange(player: PlayerData, client: Client): void {
        let index = this.TrackedPlayers[client.guid].findIndex(
            (x) => x.name == player.name
        );
        if (index == -1) return;

        let oldPlayer = this.TrackedPlayers[client.guid][index];

        if (player.accountId !== oldPlayer.accountId) {
            this.TrackedPlayers[client.guid][index].accountId =
                player.accountId;

            // update accountid in db
        }
    }

    /**
     * Return the location a player left the nexus based on their coordinates
     * @param position 
     */
    private calculateLocation(position: WorldPosData): string {}

    /**
     * Find the vault, guild hall and bazaar portal positions for the current nexus
     * @param client
     * @private
     */
    private findPortalPositions(client: Client): void {}

    /**
     * Event emitted when the client connects and is ready to send/receive packets
     * @param client
     */
    private handleReady(client: Client): void {
        let state = this.getState(client);

        switch (state) {
            case States.Started:
                Logger.log(
                    'PlayerTracker',
                    `Client ${client.alias} connected`,
                    LogLevel.Debug
                );
                this.findPortalPositions(client);
                this.setState(client, States.FindingPortals);
                return;
            default:
                Logger.log(
                    'PlayerTracker',
                    `Client ${client.alias} was ready in unexpected state ${state} - resetting`,
                    LogLevel.Error
                );
                this.setState(client, States.Started);
        }
    }

    /**
     * Event emitted when the client is pathfinding and reaches their position
     * @param client
     */
    private handleArrival(client: Client): void {
        let state = this.getState(client);

        switch (state) {
            case States.WalkingToPortals:
                Logger.log(
                    'PlayerTracker',
                    `Client ${client.alias} arrived at portals, walking back`,
                    LogLevel.Debug
                );
                this.setState(client, States.WalkingToStart);
                this.walkToPos(
                    client,
                    new WorldPosData(Positions.Portals.x, Positions.Portals.y)
                );

                return;
            case States.WalkingToStart:
                Logger.log(
                    'PlayerTracker',
                    `Client ${client.alias} is back at the start.. tracking`,
                    LogLevel.Debug
                );
                this.setState(client, States.Waiting);
                setTimeout(() => {
                    this.setState(client, States.WalkingToPortals);
                    this.walkToPos(
                        client,
                        new WorldPosData(
                            Positions.Portals.x,
                            Positions.Portals.y
                        )
                    );
                }, 60 * 3);
                return;
            default:
                Logger.log(
                    'PlayerTracker',
                    `Client ${client.alias} arrived in unknown state ${state}.. resetting`,
                    LogLevel.Debug
                );
                this.setState(client, States.Started);
                return;
        }
    }

    /**
     * Event emitted when a client disconnects - state is reset
     * @param client
     */
    private handleDisconnect(client: Client): void {
        let state = this.getState(client);

        if (state !== States.Started) {
            Logger.log(
                'PlayerTracker',
                `Client ${client.alias} disconnected in state ${state} - resetting`,
                LogLevel.Error
            );
            this.setState(client, States.Started);
        }
    }

    /**
     * Walk to a position on a given client
     * @param client
     * @param position
     */
    private walkToPos(client: Client, position: WorldPosData): void {
        client.findPath({
            x: Math.floor(position.x),
            y: Math.floor(position.y),
        });
    }

    /**
     * Take an ingame portal object and parse the data
     *
     * @param client the client who found the portal
     * @param portal the ObjectData of the portal
     */
    private parsePortalData(
        client: Client,
        portal: ObjectStatusData
    ): RealmPortal {
        /**
         * Get the correct object ID (there are 3 per portal)
         */
        let realPortal = portal.stats.find((x) => x.stringStatValue !== '');
        if (!realPortal) return null;

        const pattern = new RegExp(
            '(\\w+)\\s\\((\\d+)(?:\\/\\d+\\)\\s\\(\\+(\\d+))?'
        );
        let portalData = realPortal.stringStatValue.match(pattern);
        let server = client.server.name;

        return {
            position: portal.pos,
            id: portal.objectId,
            name: portalData[1],
            server: server,
            players: parseInt(portalData[2]),
            queue: portalData[3] ? parseInt(portalData[3]) : 0,
            time: Date.now(),
            closed: false,
        };
    }

    /**
     * Set the current state for a given client
     * @param client
     * @param state
     */
    private setState(client: Client, state: number): void {
        this.ClientState[client.guid] = state;

        Logger.log(
            'PlayerTracker',
            `Setting state ${state} for ${client.alias}`,
            LogLevel.Debug
        );
    }

    /**
     * Get the current state for a given client
     * @param client
     */
    private getState(client: Client): number {
        if (!this.ClientState[client.guid]) {
            this.ClientState[client.guid] = States.Started;
        }
        return this.ClientState[client.guid];
    }

    /**
     * Start the state machine and handle events
     * @param runtime
     * @param tracker
     */
    constructor(runtime: Runtime, tracker: Tracker) {
        this.TrackedPlayers = {};
        this.PortalList = {};
        this.ClientState = {};
        this.ClientServer = {};

        this.tracker = tracker;
        this.discord = new DiscordBot();
        this.redis = new Tracking();

        tracker.on('enter', (player, client) =>
            this.onPlayerEnter(player, client)
        );
        tracker.on('leave', (player, client) =>
            this.onPlayerLeave(player, client)
        );
        tracker.on('change', (player, client) =>
            this.onPlayerChange(player, client)
        );

        runtime.on(Events.ClientReady, (client) => this.handleReady(client));
        runtime.on(Events.ClientArrived, (client) =>
            this.handleArrival(client)
        );
        runtime.on(Events.ClientDisconnect, (client) =>
            this.handleDisconnect(client)
        );
    }
}
