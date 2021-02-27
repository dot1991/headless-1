import {
    Client,
    Events,
    Library,
    Logger,
    LogLevel,
    MapInfoPacket,
    NewTickPacket,
    ObjectStatusData,
    PacketHook,
    ReconnectPacket,
    Runtime,
    UpdatePacket,
    UsePortalPacket,
    WorldPosData,
} from '../../headless';

import {Objects, Positions, States} from './configs/portal-watcher.json';
import {DiscordBot} from './discord/bot';
import {RedisClient as Realms} from './database/redis'
import {Servers} from './tools/servers.json'
import {ClientSetting, RealmPortal} from './models';

@Library({
    name: 'portal-watcher',
    author: 'him#0001',
    enabled: false
})
export class PortalWatcher {
    // discord and database functions
    discord: DiscordBot;
    redis: Realms;

    // an array of all portals across every server
    PortalList: RealmPortal[];

    // settings for each client
    ClientState: ClientSetting<number>;
    ClientServer: ClientSetting<string>;
    CurrentPortal: ClientSetting<RealmPortal>;
    LastScanTime: ClientSetting<number>;

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
        // set the initial scan time
        if (!this.LastScanTime[client.guid]) {
            this.LastScanTime[client.guid] = Date.now();
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

        if (state == States.Started) {
            this.walkToPortals(client);
            this.setState(client, States.WalkingToPortals);
            return;
        } else {
            // scan every new object
            for (let i = 0; i < update.newObjects.length; i++) {
                // check if the object is a realm portal and parse the statdata
                if (update.newObjects[i].objectType == Objects.RealmPortal) {
                    let portal = PortalWatcher.parsePortalData(
                        client,
                        update.newObjects[i].status
                    );
                    // check if the portal isn't a ghost object
                    if (portal !== null) {
                        this.addServerPortal(portal);
                    }
                }
            }
            // scan for tracked portals closing
            for (let j = 0; j < update.drops.length; j++) {
                // check if the drops includes a portal we're tracking
                let index = this.PortalList.findIndex(
                    (x) => x.id == update.drops[j]
                );
                if (index !== -1) {
                    Logger.log(
                        'PortalWatcher',
                        `${this.PortalList[index].server} ${this.PortalList[index].name} closed..`,
                        LogLevel.Debug
                    );
                    this.PortalList[index].closed = true;
                    this.PortalList[index].time = Date.now();

                    // call a closed portal discord notification and update the cache
                    this.discord.callRealmClose(this.PortalList[index]).then();
                    this.redis.realms.setPortalInfo(this.PortalList[index]).then();
                }
            }
        }
        // check if the client should using its current portal
        if (state == States.UsingPortal) {
            if (!this.CurrentPortal[client.guid]) {
                this.getNextHostname(client);
                return;
            }

            let usePortal = new UsePortalPacket();
            usePortal.objectId = this.CurrentPortal[client.guid].id;

            // send the useportal packet then walk back to the portal area
            client.io.send(usePortal);
            this.walkToPortals(client);
            this.setState(client, States.WalkingToPortals);
            return;
        }
    }

    /**
     * Called on every new tick for each client
     * @param client
     * @param tick
     */
    @PacketHook()
    onNewTick(client: Client, tick: NewTickPacket): void {
        let timeSince = (Date.now() - this.LastScanTime[client.guid]) / 1000;

        // only check each newtick packet for a period of 15 seconds
        if (timeSince > 15) {
            let changes = 0;
            for (let i = 0; i < tick.statuses.length; i++) {
                // check if the object is a nexus portal
                let isPortal = tick.statuses[i].stats.findIndex((x) =>
                    x.stringStatValue.startsWith('NexusPortal.')
                );
                if (isPortal == -1) {
                    continue;
                }
                let portal = PortalWatcher.parsePortalData(client, tick.statuses[i]);

                this.addServerPortal(portal);
                changes++;
            }
            // if there are portal updates, try grab the hostname
            if (changes > 0) {
                this.getNextHostname(client);
            }
        }
        // reset the last scan time after 30 seconds
        if (timeSince > 30) {
            this.LastScanTime[client.guid] = Date.now();
        }
    }

    /**
     * Called when the client attempts to change maps (enter realms)
     * @param client
     * @param recon
     */
    @PacketHook()
    onReconnect(client: Client, recon: ReconnectPacket): void {
        let currentPortal = this.CurrentPortal[client.guid];
        let index = this.PortalList.findIndex((x) => x.id == currentPortal.id);

        if (index !== -1) {
            this.PortalList[index].hostname = recon.host;

            // only call a realm opening when we have the IP or the notification is useless
            this.discord.callRealmOpen(this.PortalList[index]);
            this.redis.realms.setPortalInfo(this.PortalList[index]).then();

            Logger.log(
                'PortalWatcher',
                `Set IP for ${currentPortal.server} ${currentPortal.name}: ${recon.host}`,
                LogLevel.Debug
            );
        }
    }

    private getNextHostname(client: Client): void {
        let portals = this.getServerPortals(client);
        let nextPortal = portals.find(
            (x) => (!x.hostname || x.hostname == '0.0.0.0') && x.players < 85
        );

        if (nextPortal !== undefined) {
            Logger.log(
                'PortalWatcher',
                `Walking to ${nextPortal.server} ${nextPortal.name}...`,
                LogLevel.Debug
            );
            this.CurrentPortal[client.guid] = nextPortal;
            this.setState(client, States.WalkingToRealm);
            PortalWatcher.walkToPos(client, nextPortal.position);
        }
    }

    /**
     * Get an array of all portals in the client's server
     * Remove any portals that have been closed for over 3 minutes
     * @param client
     * @param open return only open portals
     */
    private getServerPortals(client: Client, open: boolean = true): RealmPortal[] {
        let serverName = !this.ClientServer[client.guid]
            ? client.server.name
            : this.ClientServer[client.guid];
        let portals = [];

        for (let i = 0; i < this.PortalList.length; i++) {
            let portal = this.PortalList[i];
            let time = (Date.now() - portal.time) / 1000;

            if (portal.closed && time > 180) {
                this.PortalList.splice(i, 1);
                Logger.log(
                    'PortalWatcher',
                    `Removed ${portal.server} ${portal.name} - closed for over 3 minutes`,
                    LogLevel.Debug
                );
            }

            if (portal.server == serverName) {
                if (open && !portal.closed) {
                    portals.push(this.PortalList[i]);
                } else {
                    portals.push(this.PortalList[i]);
                }
            }
        }
        return portals;
    }

    /**
     * Start tracking a discovered realm portal
     * @param portal
     */
    private addServerPortal(portal: RealmPortal): void {
        let index = this.PortalList.findIndex((x) => x.id == portal.id);

        if (index == -1) {
            Logger.log(
                'PortalWatcher',
                `Found new portal ${portal.server} ${portal.name} with ${portal.players}/85 players - queue: ${portal.queue}`,
                LogLevel.Debug
            );
            this.PortalList.push(portal);

            //this.redis.setPortalInfo(portal);
        } else {
            Logger.log(
                'PortalWatcher',
                `Updating ${portal.server} ${portal.name}.. ${portal.players}/85 players - queue: ${portal.queue}`,
                LogLevel.Debug
            );
            if ((Date.now() - this.PortalList[index].time) / 1000 >= 30) {
                let playerDiff = -(
                    this.PortalList[index].players - portal.players
                );
                if (playerDiff > 15) {
                    Logger.log(
                        'PortalWatcher',
                        `Player count in ${portal.server} ${portal.name} went up by ${playerDiff} in 30 seconds`,
                        LogLevel.Warning
                    );
                    this.PortalList[index].players = portal.players;
                    this.discord.callRealmSurge(
                        this.PortalList[index],
                        playerDiff
                    );
                }

                this.PortalList[index].time = portal.time;
                this.redis.realms.setPortalInfo(this.PortalList[index]).then();
            }
            this.PortalList[index].players = portal.players;
            this.PortalList[index].queue = portal.queue;
        }
    }

    /**
     * Start a client pathfinding to the portal area
     * @param client
     */
    private walkToPortals(client: Client): void {
        function waitOnMap() {
            setTimeout(() => {
                if (!client.worldPos) {
                    waitOnMap();
                } else {
                    client.findPath({
                        x: Positions.Portals.x,
                        y: Positions.Portals.y,
                    });
                }
            }, 1000);
        }

        waitOnMap();
    }

    /**
     * Walk to a position on a given client
     * @param client
     * @param position
     */
    private static walkToPos(client: Client, position: WorldPosData): void {
        client.findPath({
            x: Math.floor(position.x),
            y: Math.floor(position.y),
        });
    }

    /**
     * Event emitted when the client connects and is ready to send/receive packets
     * @param client
     */
    private handleReady(client: Client): void {
        let state = this.getState(client);

        switch (state) {
            case States.Started:
                this.walkToPortals(client);
                return;
            default:
                Logger.log(
                    'PortalWatcher',
                    `Client ${client.alias} was ready in unexpected state ${state} - resetting`
                );
                this.setState(client, States.Started);
                this.handleFailure(client);
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
                Logger.log('PortalWatcher',`Client ${client.alias} arrived at portals!`, LogLevel.Debug);
                this.setState(client, States.Waiting);
                this.getNextHostname(client);
                return;
            case States.WalkingToRealm:
                Logger.log('PortalWatcher',`Client ${client.alias} is on a realm portal!`,LogLevel.Debug);
                this.setState(client, States.UsingPortal);
                return;
            default:
                Logger.log('PortalWatcher',`Client ${client.alias} arrived in unknown state ${state}.. resetting`,LogLevel.Debug);
                this.setState(client, States.Started);
                this.handleFailure(client);
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
            Logger.log('PortalWatcher',`Client ${client.alias} disconnected in state ${state} - resetting`);

            this.setState(client, States.Started);
        }
    }

    /**
     * Attempt to reset a client if it fails while still connected
     * @param client
     */
    private handleFailure(client: Client): void {
        let state = this.getState(client);

        switch (state) {
        }
    }

    /**
     * Take an ingame portal object and parse the data
     * @param client the client who found the portal
     * @param portal the ObjectData of the portal
     */
    private static parsePortalData(client: Client, portal: ObjectStatusData): RealmPortal {
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
            'PortalWatcher',
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
     */
    constructor(runtime: Runtime) {
        this.PortalList = [];

        this.ClientState = {};
        this.ClientServer = {};
        this.LastScanTime = {};
        this.CurrentPortal = {};

        this.discord = new DiscordBot();
        this.redis = new Realms();

        runtime.on(Events.ClientReady, (client) => this.handleReady(client));
        runtime.on(Events.ClientArrived, (client) => this.handleArrival(client));
        runtime.on(Events.ClientDisconnect, (client) => this.handleDisconnect(client));
    }
}
