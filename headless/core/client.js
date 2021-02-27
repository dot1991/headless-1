"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = require("../../realmlib/net");
const rsa = __importStar(require("../crypto/rsa"));
const decorators_1 = require("../decorators");
// tslint:disable-next-line: max-line-length
const models_1 = require("../models");
const services_1 = require("../services");
const util_1 = require("../util");
const parsers = __importStar(require("../util/parsers"));
const MIN_MOVE_SPEED = 0.004;
const MAX_MOVE_SPEED = 0.0096;
const ACC_IN_USE = /Account in use \((\d+) seconds? until timeout\)/;
const LOGGING_PACKETS = false;
class Client {
    /**
     * Creates a new instance of the client and begins the connection process
     * @param runtime The runtime managing the client
     * @param server The server to connect to
     * @param accInfo The account info to connect with
     */
    constructor(runtime, server, accInfo) {
        this.tutorialOnly = false;
        this.reconnectCooldown = 500;
        this.runtime = runtime;
        this.alias = accInfo.alias;
        this.guid = accInfo.guid;
        this.password = accInfo.password;
        this.playerData = models_1.getDefaultPlayerData();
        this.playerData.server = server.name;
        this.proxy = accInfo.proxy;
        this.pathfinderEnabled = accInfo.pathfinder || false;
        this.players = new Map();
        this.nextPos = [];
        this.ignoreReconCooldown = false;
        this.connectTime = Date.now();
        this.socketConnected = false;
        this.connectionGuid = '';
        this.internalGameId = models_1.GameId.Nexus;
        this.internalMoveMultiplier = 1;
        this.tileMultiplier = 1;
        this.internalAutoNexusThreshold = 0.2;
        this.currentBulletId = 1;
        this.lastAttackTime = 0;
        this.key = [];
        this.keyTime = -1;
        this.safeMap = true;
        this.hpLog = 0;
        this.clientHP = 0;
        this.buildVersion = this.runtime.buildVersion;
        if (accInfo.charInfo) {
            this.charInfo = accInfo.charInfo;
        }
        else {
            this.charInfo = { charId: 0, nextCharId: 1, maxNumChars: 1 };
        }
        this.needsNewCharacter = this.charInfo.charId < 1;
        this.internalServer = Object.assign({}, server);
        this.nexusServer = Object.assign({}, server);
        this.io = new net_1.PacketIO({ packetMap: this.runtime.packetMap });
        const requiredHooks = new Set(decorators_1.getHooks().map((hook) => hook.packet));
        for (const type of requiredHooks) {
            this.io.on(type, (data) => {
                this.runtime.libraryManager.callHooks(data, this);
            });
        }
        this.io.on('error', (err) => {
            services_1.Logger.log(this.alias, `Received PacketIO error: ${err.message}`, services_1.LogLevel.Error);
            services_1.Logger.log(this.alias, err.stack, services_1.LogLevel.Debug);
        });
        services_1.Logger.log(this.alias, `Starting connection to ${server.name}`, services_1.LogLevel.Debug);
        this.connect();
    }
    set moveSpeed(value) {
        this.internalMoveMultiplier = Math.max(0, Math.min(value, 1));
    }
    get moveSpeed() {
        return this.internalMoveMultiplier;
    }
    set connected(value) {
        this.socketConnected = value;
    }
    get connected() {
        return this.socketConnected;
    }
    get gameId() {
        return this.internalGameId;
    }
    get tutorialMode() {
        return this.tutorialOnly;
    }
    set tutorialMode(toggle) {
        this.tutorialOnly = toggle;
    }
    /**
     * Removes all event listeners and releases any resources held by the client.
     * This should only be used when the client is no longer needed.
     */
    destroy(processTick = true) {
        // packet io.
        if (this.io) {
            this.io.detach();
        }
        // timers.
        if (this.frameUpdateTimer) {
            clearInterval(this.frameUpdateTimer);
        }
        if (this.socketConnected) {
            this.socketConnected = false;
            this.runtime.emit(models_1.Events.ClientDisconnect, this);
        }
        // client socket
        if (this.clientSocket) {
            this.clientSocket.removeAllListeners('close');
            this.clientSocket.removeAllListeners('error');
            this.clientSocket.destroy();
        }
        // resources
        // if we're unlucky, a packet hook, or onFrame was called and preempted this method.
        // to avoid a nasty race condition, release these resources on the next tick after
        // the io has been detached and the frame timers have been stopped.
        if (processTick) {
            process.nextTick(() => {
                this.mapTiles = undefined;
                this.io = undefined;
                this.clientSocket = undefined;
            });
        }
    }
    /**
     * Switches the client connect to a proxied connection. Setting this to
     * `undefined` will remove the current proxy if there is one.
     * @param proxy The proxy to use.
     */
    setProxy(proxy) {
        if (proxy) {
            services_1.Logger.log(this.alias, 'Connecting to new proxy.');
        }
        else {
            services_1.Logger.log(this.alias, 'Connecting without proxy.');
        }
        this.proxy = proxy;
        this.connect();
    }
    /**
     * Connects the bot to the `server`.
     * @param server The server to connect to.
     * @param gameId An optional game id to use when connecting. Defaults to the current game id.
     */
    connectToServer(server, gameId = this.internalGameId) {
        services_1.Logger.log(this.alias, `Switching server to ${server.name}..`, services_1.LogLevel.Info);
        this.internalServer = Object.assign({}, server);
        this.nexusServer = Object.assign({}, server);
        this.internalGameId = gameId;
        this.connect();
    }
    /**
     * Connects to the Nexus.
     */
    connectToNexus() {
        services_1.Logger.log(this.alias, 'Connecting to the Nexus..', services_1.LogLevel.Info);
        this.internalGameId = models_1.GameId.Nexus;
        this.internalServer = Object.assign({}, this.nexusServer);
        this.connect();
    }
    /**
     * Connects to `gameId` on the current server
     *  @param gameId The gameId to use upon connecting.
     */
    changeGameId(gameId) {
        services_1.Logger.log(this.alias, `Changing gameId to ${gameId}..`, services_1.LogLevel.Info);
        this.internalGameId = gameId;
        this.connect();
    }
    /**
     * Returns how long the client has been connected for, in milliseconds.
     */
    getTime() {
        return Date.now() - this.connectTime;
    }
    /**
     * Finds a path from the client's current position to the `to` point
     * and moves the client along the path.
     * @param to The point to navigate towards.
     */
    findPath(to) {
        if (!this.pathfinderEnabled) {
            services_1.Logger.log(this.alias, 'Pathfinding is not enabled on this account - please enable it in the accounts.json', services_1.LogLevel.Warning);
            return;
        }
        to.x = Math.floor(to.x);
        to.y = Math.floor(to.y);
        const clientPos = new net_1.WorldPosData(Math.floor(this.worldPos.x), Math.floor(this.worldPos.y));
        this.pathfinder
            .findPath(clientPos, to)
            .then((path) => {
            if (path.length === 0) {
                this.pathfinderTarget = undefined;
                this.nextPos.length = 0;
                this.runtime.emit(models_1.Events.ClientArrived, this, to);
                return;
            }
            this.pathfinderTarget = to;
            this.nextPos.length = 0;
            this.nextPos.push(...path.map((p) => new net_1.WorldPosData(p.x + 0.5, p.y + 0.5)));
        })
            .catch((error) => {
            services_1.Logger.log(this.alias, `Error finding path: ${error.message}`, services_1.LogLevel.Error);
            services_1.Logger.log(this.alias, error.stack, services_1.LogLevel.Debug);
        });
    }
    /**
     * Returns the index of a map tile given a position and current map height
     * @param tile The current tile
     */
    getMapTileIndex(tile) {
        const mapheight = this.mapInfo.height;
        return tile.y * mapheight + tile.x;
    }
    /**
     * Applies some damage and returns whether or not the client should
     * return to the nexus
     * @param amount The amount of damage to apply
     * @param armorPiercing Whether or not the damage should be armor piercing
     * @param time The time the damage was taken at
     */
    applyDamage(amount, armorPiercing, time) {
        if (time === -1) {
            time = this.getTime();
        }
        // if the player is currently invincible, they take no damage.
        // tslint:disable-next-line: no-bitwise
        const invincible = models_1.ConditionEffect.INVINCIBLE |
            models_1.ConditionEffect.INVULNERABLE |
            models_1.ConditionEffect.PAUSED;
        if (models_1.hasEffect(this.playerData.condition, invincible)) {
            return false;
        }
        // work out the defense
        let def = this.playerData.def;
        if (models_1.hasEffect(this.playerData.condition, models_1.ConditionEffect.ARMORED)) {
            def *= 2;
        }
        if (armorPiercing ||
            models_1.hasEffect(this.playerData.condition, models_1.ConditionEffect.ARMORBROKEN)) {
            def = 0;
        }
        // work out the actual damage.
        const min = (amount * 3) / 20;
        const actualDamage = Math.max(min, amount - def);
        // apply it and check for autonexusing.
        this.playerData.hp -= actualDamage;
        this.clientHP -= actualDamage;
        services_1.Logger.log(this.alias, `Took ${actualDamage.toFixed(0)} damage. At ${this.clientHP.toFixed(0)} health.`);
        return this.checkHealth(time);
    }
    onDamage(damage) {
        // ignore the damage if it isn't to/from ourself
        if (damage.objectId !== this.objectId || damage.targetId !== this.objectId) {
            return;
        }
        if (damage.objectId >= 0 && damage.bulletId > 0) {
        }
    }
    onMapInfo(mapInfoPacket) {
        this.connectionGuid = mapInfoPacket.connectionGuid;
        this.safeMap = mapInfoPacket.name === 'Nexus';
        if (this.needsNewCharacter) {
            // create the character.
            const createPacket = new net_1.CreatePacket();
            createPacket.classType = models_1.Classes.Wizard;
            createPacket.skinType = 0;
            services_1.Logger.log(this.alias, 'Creating new character', services_1.LogLevel.Info);
            this.send(createPacket);
            this.needsNewCharacter = false;
            // update the char info cache.
            this.charInfo.charId = this.charInfo.nextCharId;
            this.charInfo.nextCharId += 1;
            this.runtime.accountService.updateCharInfoCache(this.guid, this.charInfo);
        }
        else {
            const loadPacket = new net_1.LoadPacket();
            loadPacket.charId = this.charInfo.charId;
            loadPacket.isFromArena = false;
            services_1.Logger.log(this.alias, `Connecting to ${mapInfoPacket.name}`, services_1.LogLevel.Info);
            this.send(loadPacket);
        }
        this.random = new services_1.Random(mapInfoPacket.fp);
        this.mapTiles = [];
        this.mapInfo = {
            width: mapInfoPacket.width,
            height: mapInfoPacket.height,
            name: mapInfoPacket.name,
        };
        if (this.pathfinderEnabled) {
            this.pathfinder = new services_1.Pathfinder(mapInfoPacket.width);
        }
    }
    onDeath(deathPacket) {
        // check if it was our client that died
        if (deathPacket.accountId !== this.playerData.accountId) {
            return;
        }
        services_1.Logger.log(this.alias, `The character ${deathPacket.charId} has died`, services_1.LogLevel.Warning);
        // update the char info.
        this.charInfo.charId = this.charInfo.nextCharId;
        this.charInfo.nextCharId++;
        this.needsNewCharacter = true;
        // update the char info cache.
        this.runtime.accountService.updateCharInfoCache(this.guid, this.charInfo);
        services_1.Logger.log(this.alias, 'Connecting to the nexus..', services_1.LogLevel.Info);
        // reconnect to the nexus.
        this.connectToNexus();
    }
    onNotification(notification) {
        if (notification.objectId !== this.objectId) {
            return;
        }
        try {
            const json = JSON.parse(notification.message);
            if (json.key === 'server.plus_symbol' &&
                notification.color === 0x00ff00) {
                const healAmount = parseInt(json.tokens.amount, 10);
                this.addHealth(healAmount);
            }
        }
        catch (_a) {
            services_1.Logger.log(this.alias, `Received non-json notification: "${notification.message}"`, services_1.LogLevel.Debug);
        }
    }
    onUpdate(updatePacket) {
        this.send(new net_1.UpdateAckPacket());
        const pathfinderUpdates = [];
        for (const obj of updatePacket.newObjects) {
            if (obj.status.objectId === this.objectId) {
                for (const stat of obj.status.stats) {
                    if (stat.statType === net_1.StatType.HP_STAT) {
                        this.clientHP = stat.statValue;
                        break;
                    }
                }
                this.worldPos = obj.status.pos;
                this.playerData = parsers.processObject(obj);
                this.playerData.server = this.internalServer.name;
                continue;
            }
            if (models_1.Classes[obj.objectType]) {
                const player = new models_1.Entity(obj.status);
                this.players.set(obj.status.objectId, player);
                continue;
            }
            if (this.runtime.resources.objects[obj.objectType]) {
                const gameObject = this.runtime.resources.objects[obj.objectType];
                if (gameObject.fullOccupy || gameObject.occupySquare) {
                    const index = Math.floor(obj.status.pos.y) * this.mapInfo.width +
                        Math.floor(obj.status.pos.x);
                    if (!this.mapTiles[index]) {
                        this.mapTiles[index] = new net_1.GroundTileData();
                    }
                    this.mapTiles[index].occupied = true;
                    this.mapTiles[index].occupiedBy = obj.status.objectId;
                }
                if (gameObject.protectFromGroundDamage) {
                    const index = Math.floor(obj.status.pos.y) * this.mapInfo.width +
                        Math.floor(obj.status.pos.x);
                    if (!this.mapTiles[index]) {
                        this.mapTiles[index] = new net_1.GroundTileData();
                    }
                    this.mapTiles[index].protectFromGroundDamage = true;
                }
                if (this.pathfinderEnabled) {
                    if (gameObject.fullOccupy || gameObject.occupySquare) {
                        const x = obj.status.pos.x;
                        const y = obj.status.pos.y;
                        pathfinderUpdates.push({
                            x: Math.floor(x),
                            y: Math.floor(y),
                            walkable: false,
                        });
                    }
                }
            }
        }
        for (const tile of updatePacket.tiles) {
            const index = tile.y * this.mapInfo.width + tile.x;
            if (!this.mapTiles[index]) {
                this.mapTiles[index] = Object.assign(Object.assign({}, tile), { read: tile.read, write: tile.write, occupied: false, occupiedBy: undefined, lastDamage: 0, protectFromGroundDamage: false, sink: false });
            }
            else {
                this.mapTiles[index].x = tile.x;
                this.mapTiles[index].y = tile.y;
            }
            if (this.pathfinderEnabled) {
                if (this.runtime.resources.tiles[tile.type].noWalk) {
                    pathfinderUpdates.push({
                        x: Math.floor(tile.x),
                        y: Math.floor(tile.y),
                        walkable: false,
                    });
                }
            }
        }
        for (const drop of updatePacket.drops) {
            if (this.players.has(drop)) {
                this.players.delete(drop);
            }
        }
        if (pathfinderUpdates.length > 0 && this.pathfinderEnabled) {
            this.pathfinder.updateWalkableNodes(pathfinderUpdates);
            if (this.pathfinderTarget) {
                this.findPath(this.pathfinderTarget);
            }
        }
    }
    onReconnectPacket(reconnectPacket) {
        // if there is a new host, then switch to it
        if (reconnectPacket.host !== '') {
            this.internalServer.address = reconnectPacket.host;
        }
        // same story with the name
        if (reconnectPacket.name !== '') {
            this.internalServer.name = reconnectPacket.name;
        }
        this.internalGameId = reconnectPacket.gameId;
        this.key = reconnectPacket.key;
        this.keyTime = reconnectPacket.keyTime;
        this.connect();
    }
    onGotoPacket(gotoPacket) {
        const ack = new net_1.GotoAckPacket();
        ack.time = this.lastFrameTime;
        this.send(ack);
        if (gotoPacket.objectId === this.objectId) {
            this.worldPos = gotoPacket.position.clone();
        }
        if (this.players.has(gotoPacket.objectId)) {
            this.players
                .get(gotoPacket.objectId)
                .onGoto(gotoPacket.position.x, gotoPacket.position.y, this.lastFrameTime);
        }
    }
    onFailurePacket(failurePacket) {
        switch (failurePacket.errorId) {
            case net_1.FailureCode.IncorrectVersion:
                services_1.Logger.log(this.alias, 'Your version is out of date - change the buildVersion in config.json', services_1.LogLevel.Error);
                process.exit(0);
                break;
            case net_1.FailureCode.InvalidTeleportTarget:
                services_1.Logger.log(this.alias, 'Invalid teleport target', services_1.LogLevel.Warning);
                break;
            case net_1.FailureCode.EmailVerificationNeeded:
                services_1.Logger.log(this.alias, 'Failed to connect: account requires email verification', services_1.LogLevel.Error);
                break;
            case net_1.FailureCode.BadKey:
                services_1.Logger.log(this.alias, 'Failed to connect: invalid reconnect key used', services_1.LogLevel.Error);
                this.key = [];
                this.internalGameId = models_1.GameId.Nexus;
                this.keyTime = -1;
                break;
            case net_1.FailureCode.ServerFull:
            case net_1.FailureCode.ServerQueue:
                services_1.Logger.log(this.alias, `Server has a queue`, services_1.LogLevel.Warning);
                this.reconnectCooldown = 5000;
                break;
            default:
                switch (failurePacket.errorDescription) {
                    case 'Character is dead':
                        this.fixCharInfoCache();
                        break;
                    case 'Character not found':
                        services_1.Logger.log(this.alias, 'No active characters. Creating new character.', services_1.LogLevel.Info);
                        this.needsNewCharacter = true;
                        break;
                    case 'Your IP has been temporarily banned for abuse/hacking on this server [6] [FUB]':
                        services_1.Logger.log(this.alias, `Client ${this.alias} is IP banned from this server - reconnecting in 5 minutes`, services_1.LogLevel.Warning);
                        this.reconnectCooldown = 1000 * 60 * 5;
                        break;
                    case '{"key":"server.realm_full"}':
                        // ignore these messages for now
                        break;
                    default:
                        services_1.Logger.log(this.alias, `Received failure ${failurePacket.errorId}: "${failurePacket.errorDescription}"`, services_1.LogLevel.Error);
                        if (ACC_IN_USE.test(failurePacket.errorDescription)) {
                            const timeout = ACC_IN_USE.exec(failurePacket.errorDescription)[1];
                            if (!isNaN(timeout)) {
                                this.reconnectCooldown =
                                    parseInt(timeout, 10) * 1000;
                            }
                        }
                        break;
                }
                break;
        }
    }
    onAoe(aoePacket) {
        const aoeAck = new net_1.AoeAckPacket();
        aoeAck.time = this.lastFrameTime;
        aoeAck.position = this.worldPos.clone();
        let nexused = false;
        if (aoePacket.pos.squareDistanceTo(this.worldPos) <
            aoePacket.radius ** 2) {
            // apply the aoe damage if in range.
            nexused = this.applyDamage(aoePacket.damage, aoePacket.armorPiercing, this.getTime());
        }
        // only reply if the client didn't nexus.
        if (!nexused) {
            this.send(aoeAck);
        }
    }
    onNewTick(newTickPacket) {
        this.lastTickTime = this.currentTickTime;
        this.lastTickId = newTickPacket.tickId;
        this.currentTickTime = this.getTime();
        const movePacket = new net_1.MovePacket();
        movePacket.tickId = newTickPacket.tickId;
        movePacket.time = this.lastFrameTime;
        movePacket.serverRealTimeMS = newTickPacket.serverRealTimeMS;
        movePacket.newPosition = this.worldPos;
        movePacket.records = [];
        const lastClear = this.moveRecords.lastClearTime;
        if (lastClear >= 0 && movePacket.time - lastClear > 125) {
            const len = Math.min(10, this.moveRecords.records.length);
            for (let i = 0; i < len; i++) {
                if (this.moveRecords.records[i].time >= movePacket.time - 25) {
                    break;
                }
                movePacket.records.push(this.moveRecords.records[i].clone());
            }
        }
        this.moveRecords.clear(movePacket.time);
        this.send(movePacket);
        const x = Math.floor(this.worldPos.x);
        const y = Math.floor(this.worldPos.y);
        if (this.mapTiles[y * this.mapInfo.width + x] &&
            this.runtime.resources.tiles[this.mapTiles[y * this.mapInfo.width + x].type]) {
            this.tileMultiplier = this.runtime.resources.tiles[this.mapTiles[y * this.mapInfo.width + x].type].speed;
        }
        const elapsedMS = this.currentTickTime - this.lastTickTime;
        for (const status of newTickPacket.statuses) {
            if (status.objectId === this.objectId) {
                this.playerData = parsers.processStatData(status.stats, this.playerData);
                this.playerData.objectId = this.objectId;
                this.playerData.worldPos = this.worldPos;
                this.playerData.server = this.internalServer.name;
                continue;
            }
            if (this.players.has(status.objectId)) {
                this.players
                    .get(status.objectId)
                    .onNewTick(status, elapsedMS, newTickPacket.tickId, this.lastFrameTime);
            }
        }
    }
    onPing(pingPacket) {
        const pongPacket = new net_1.PongPacket();
        pongPacket.serial = pingPacket.serial;
        pongPacket.time = this.getTime();
        this.send(pongPacket);
    }
    onServerPlayerShoot(serverPlayerShoot) {
        if (serverPlayerShoot.ownerId === this.objectId) {
            const ack = new net_1.ShootAckPacket();
            ack.time = this.lastFrameTime;
            this.send(ack);
        }
    }
    // @PacketHook()
    // private onText(textPacket: TextPacket): void {
    //     Logger.log('Packet', `TextPacket received:\nName: ${textPacket.name}\nObjectId: ${textPacket.objectId}`)
    //     console.log(`NumStars: ${textPacket.numStars}`);
    //     console.log(`BubbleTime: ${textPacket.bubbleTime}`);
    //     console.log(`Recipient: ${textPacket.recipient}`);
    //     console.log(`Text: ${textPacket.text}`);
    //     console.log(`IsSupporter: ${textPacket.isSupporter}`);
    //     console.log(`StarBackground: ${textPacket.starBackground}`);
    // }
    onCreateSuccess(createSuccessPacket) {
        services_1.Logger.log(this.alias, 'Connected!', services_1.LogLevel.Success);
        this.objectId = createSuccessPacket.objectId;
        this.charInfo.charId = createSuccessPacket.charId;
        this.charInfo.nextCharId = this.charInfo.charId + 1;
        this.lastFrameTime = this.getTime();
        this.runtime.emit(models_1.Events.ClientReady, this);
        this.frameUpdateTimer = setInterval(this.onFrame.bind(this), 1000 / 30);
    }
    onFrame() {
        const time = this.getTime();
        const delta = time - this.lastFrameTime;
        this.calcHealth(delta);
        if (this.checkHealth(time)) {
            return;
        }
        if (this.worldPos) {
            if (this.nextPos.length > 0) {
                /**
                 * We don't want to move further than we are allowed to, so if the
                 * timer was late (which is likely) we should use 1000/30 ms instead
                 * of the real time elapsed. Math.floor(1000/30) happens to be 33ms.
                 */
                const diff = Math.min(33, time - this.lastFrameTime);
                this.moveTo(this.nextPos[0], diff);
            }
            this.moveRecords.addRecord(time, this.worldPos.x, this.worldPos.y);
        }
        if (this.players.size > 0) {
            for (const player of this.players.values()) {
                player.frameTick(this.lastTickId, time);
            }
        }
        this.lastFrameTime = time;
    }
    onConnect() {
        services_1.Logger.log(this.alias, `Connected to ${this.internalServer.name}!`, services_1.LogLevel.Debug);
        this.socketConnected = true;
        this.runtime.emit(models_1.Events.ClientConnect, this);
        this.lastTickTime = 0;
        this.currentTickTime = 0;
        this.lastTickId = -1;
        this.currentBulletId = 1;
        this.players.clear();
        this.moveRecords = new models_1.MoveRecords();
        this.worldPos = new net_1.WorldPosData(130, 120);
        this.sendHello();
    }
    sendHello() {
        const packet = new net_1.HelloPacket();
        packet.buildVersion = this.buildVersion;
        packet.gameId = this.internalGameId;
        packet.guid = rsa.encrypt(this.guid);
        packet.password = rsa.encrypt(this.password);
        packet.keyTime = this.keyTime;
        packet.key = this.key;
        packet.gameNet = 'rotmg';
        packet.playPlatform = 'rotmg';
        packet.trailer = this.runtime.clientToken;
        packet.previousConnectionGuid = this.connectionGuid;
        this.send(packet);
    }
    onClose() {
        services_1.Logger.log(this.alias, `Connection to ${this.nexusServer.name} was closed`, services_1.LogLevel.Warning);
        this.socketConnected = false;
        this.runtime.emit(models_1.Events.ClientDisconnect, this);
        this.nextPos.length = 0;
        this.pathfinderTarget = undefined;
        this.io.detach();
        this.clientSocket = undefined;
        if (this.pathfinder) {
            this.pathfinder.destroy();
        }
        if (this.frameUpdateTimer) {
            clearInterval(this.frameUpdateTimer);
            this.frameUpdateTimer = undefined;
        }
        if (this.reconnectCooldown <= 0) {
            this.reconnectCooldown = 500;
        }
        else {
            this.reconnectCooldown += 500;
        }
    }
    onError(error) {
        services_1.Logger.log(this.alias, `Received socket error: ${error.message}`, services_1.LogLevel.Error);
        services_1.Logger.log(this.alias, error.stack, services_1.LogLevel.Debug);
    }
    /**
     * Fixes the character cache after a dead character has been loaded.
     */
    fixCharInfoCache() {
        services_1.Logger.log(this.alias, `Tried to load a dead character. Fixing character info cache...`, services_1.LogLevel.Debug);
        this.charInfo.charId = this.charInfo.nextCharId;
        this.charInfo.nextCharId++;
        this.needsNewCharacter = true;
        this.runtime.accountService.updateCharInfoCache(this.guid, this.charInfo);
    }
    async connect() {
        if (this.clientSocket) {
            this.clientSocket.destroy();
            return;
        }
        if (this.frameUpdateTimer) {
            clearInterval(this.frameUpdateTimer);
            this.frameUpdateTimer = undefined;
        }
        if (this.reconnectCooldown > 0) {
            services_1.Logger.log(this.alias, `Connecting in ${this.reconnectCooldown / 1000} milliseconds`, services_1.LogLevel.Debug);
            await util_1.delay(this.reconnectCooldown);
        }
        try {
            if (this.proxy) {
                services_1.Logger.log(this.alias, 'Establishing proxy', services_1.LogLevel.Debug);
            }
            this.clientSocket = await util_1.createConnection(this.internalServer.address, 2050, this.proxy);
            this.io.attach(this.clientSocket);
            // add the event listeners.
            this.clientSocket.on('close', this.onClose.bind(this));
            this.clientSocket.on('error', this.onError.bind(this));
            this.onConnect();
        }
        catch (err) {
            if (err.message == "Socket closed" ||
                err.message.startsWith("connect ECONNREFUSED") ||
                err.message.startsWith("getaddrinfo ENOTFOUND") ||
                err.message.endsWith("(undefined)")) {
                this.reconnectCooldown = 30000;
            }
            services_1.Logger.log(this.alias, `Error while connecting: ${err.message}`, services_1.LogLevel.Error);
            services_1.Logger.log(this.alias, err.stack, services_1.LogLevel.Debug);
            this.runtime.emit(models_1.Events.ClientConnectError, this, err);
            setTimeout(() => {
                this.connect();
            }, 20000);
        }
    }
    walkTo(x, y) {
        // tslint:disable-next-line: no-bitwise
        if (models_1.hasEffect(this.playerData.condition, models_1.ConditionEffect.PARALYZED || models_1.ConditionEffect.PAUSED)) {
            if (!models_1.hasEffect(this.playerData.condition, models_1.ConditionEffect.PARALYZED_IMMUNE)) {
                return;
            }
        }
        if (models_1.hasEffect(this.playerData.condition, models_1.ConditionEffect.PETRIFIED)) {
            if (!models_1.hasEffect(this.playerData.condition, models_1.ConditionEffect.PETRIFIED_IMMUNE)) {
                return;
            }
        }
        const xTile = this.mapTiles[Math.floor(this.worldPos.y) * this.mapInfo.width + Math.floor(x)];
        if (xTile && !xTile.occupied) {
            this.worldPos.x = x;
        }
        const yTile = this.mapTiles[Math.floor(y) * this.mapInfo.width + Math.floor(this.worldPos.x)];
        if (yTile && !yTile.occupied) {
            this.worldPos.y = y;
        }
    }
    moveTo(target, timeElapsed) {
        if (!target) {
            return;
        }
        const step = this.getSpeed(timeElapsed);
        if (this.worldPos.squareDistanceTo(target) > step ** 2) {
            const angle = Math.atan2(target.y - this.worldPos.y, target.x - this.worldPos.x);
            this.walkTo(this.worldPos.x + Math.cos(angle) * step, this.worldPos.y + Math.sin(angle) * step);
        }
        else {
            this.walkTo(target.x, target.y);
            const lastPos = this.nextPos.shift();
            if (this.nextPos.length === 0) {
                this.runtime.emit(models_1.Events.ClientArrived, this, lastPos);
                if (this.pathfinderTarget) {
                    this.pathfinderTarget = undefined;
                }
            }
        }
    }
    getSpeed(timeElapsed) {
        if (models_1.hasEffect(this.playerData.condition, models_1.ConditionEffect.SLOWED) && !models_1.hasEffect(this.playerData.condition, models_1.ConditionEffect.SLOWED_IMMUNE)) {
            return MIN_MOVE_SPEED * this.tileMultiplier;
        }
        let speed = MIN_MOVE_SPEED + (this.playerData.spd / 75) * (MAX_MOVE_SPEED - MIN_MOVE_SPEED);
        if (models_1.hasEffect(this.playerData.condition, models_1.ConditionEffect.SPEEDY | models_1.ConditionEffect.NINJA_SPEEDY)) {
            speed *= 1.5;
        }
        return (speed * this.tileMultiplier * timeElapsed * this.internalMoveMultiplier);
    }
    /**
     * Sends a packet only if the client is currently connected.
     * @param packet The packet to send.
     */
    send(packet) {
        if (!this.clientSocket.destroyed && this.io) {
            if (LOGGING_PACKETS) {
                services_1.Logger.log('Packet', 'Sending packet ID ' + packet.type);
                console.log(Object.values(packet).toString());
            }
            this.io.send(packet);
        }
        else {
            services_1.Logger.log(this.alias, `Not connected. Cannot send ${packet.type}.`, services_1.LogLevel.Debug);
        }
    }
    calcHealth(delta) {
        const interval = delta * 0.001;
        const bleeding = models_1.hasEffect(this.playerData.condition, models_1.ConditionEffect.BLEEDING);
        if (!models_1.hasEffect(this.playerData.condition, models_1.ConditionEffect.SICK) && !bleeding) {
            const vitPerSecond = 1 + 0.12 * this.playerData.vit;
            this.hpLog += vitPerSecond * interval;
            if (models_1.hasEffect(this.playerData.condition, models_1.ConditionEffect.HEALING)) {
                this.hpLog += 20 * interval;
            }
        }
        else if (bleeding) {
            this.hpLog -= 20 * interval;
        }
        const hpToAdd = Math.trunc(this.hpLog);
        const leftovers = this.hpLog - hpToAdd;
        this.hpLog = leftovers;
        this.clientHP += hpToAdd;
        if (this.clientHP > this.playerData.maxHP) {
            this.clientHP = this.playerData.maxHP;
        }
    }
    checkHealth(time = -1) {
        if (!this.safeMap) {
            if (this.internalAutoNexusThreshold === 0) {
                return false;
            }
            const threshold = this.playerData.maxHP * this.internalAutoNexusThreshold;
            const minHp = Math.min(this.clientHP, this.playerData.hp);
            if (minHp < threshold) {
                const autoNexusPercent = (minHp / this.playerData.maxHP) * 100;
                services_1.Logger.log(this.alias, `Auto nexused at ${autoNexusPercent.toFixed(1)}%`, services_1.LogLevel.Warning);
                this.connectToNexus();
                return true;
            }
        }
        return false;
    }
    addHealth(amount) {
        this.clientHP += amount;
        if (this.clientHP >= this.playerData.maxHP) {
            this.clientHP = this.playerData.maxHP;
        }
    }
}
__decorate([
    decorators_1.PacketHook(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [net_1.DamagePacket]),
    __metadata("design:returntype", void 0)
], Client.prototype, "onDamage", null);
__decorate([
    decorators_1.PacketHook(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [net_1.MapInfoPacket]),
    __metadata("design:returntype", void 0)
], Client.prototype, "onMapInfo", null);
__decorate([
    decorators_1.PacketHook(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [net_1.DeathPacket]),
    __metadata("design:returntype", void 0)
], Client.prototype, "onDeath", null);
__decorate([
    decorators_1.PacketHook(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [net_1.NotificationPacket]),
    __metadata("design:returntype", void 0)
], Client.prototype, "onNotification", null);
__decorate([
    decorators_1.PacketHook(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [net_1.UpdatePacket]),
    __metadata("design:returntype", void 0)
], Client.prototype, "onUpdate", null);
__decorate([
    decorators_1.PacketHook(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [net_1.ReconnectPacket]),
    __metadata("design:returntype", void 0)
], Client.prototype, "onReconnectPacket", null);
__decorate([
    decorators_1.PacketHook(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [net_1.GotoPacket]),
    __metadata("design:returntype", void 0)
], Client.prototype, "onGotoPacket", null);
__decorate([
    decorators_1.PacketHook(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [net_1.FailurePacket]),
    __metadata("design:returntype", void 0)
], Client.prototype, "onFailurePacket", null);
__decorate([
    decorators_1.PacketHook(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [net_1.AoePacket]),
    __metadata("design:returntype", void 0)
], Client.prototype, "onAoe", null);
__decorate([
    decorators_1.PacketHook(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [net_1.NewTickPacket]),
    __metadata("design:returntype", void 0)
], Client.prototype, "onNewTick", null);
__decorate([
    decorators_1.PacketHook(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [net_1.PingPacket]),
    __metadata("design:returntype", void 0)
], Client.prototype, "onPing", null);
__decorate([
    decorators_1.PacketHook(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [net_1.ServerPlayerShootPacket]),
    __metadata("design:returntype", void 0)
], Client.prototype, "onServerPlayerShoot", null);
__decorate([
    decorators_1.PacketHook(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [net_1.CreateSuccessPacket]),
    __metadata("design:returntype", void 0)
], Client.prototype, "onCreateSuccess", null);
exports.Client = Client;
