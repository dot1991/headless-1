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
const events_1 = require("events");
const net_1 = require("../../realmlib/net");
const events_2 = require("../models/events");
const runtime_1 = require("../runtime");
const parsers = __importStar(require("../util/parsers"));
const core_1 = require("./../core");
const models_1 = require("./../models");
let PlayerTracker = class PlayerTracker {
    constructor(runtime) {
        this.emitter = new events_1.EventEmitter();
        this.trackedPlayers = {};
        runtime.on(events_2.Events.ClientConnect, (client) => {
            this.trackedPlayers[client.guid] = [];
        });
    }
    /**
     * Attaches an event listener to the specified event.
     * @param event The event to attach the listener to.
     * @param listener The function to invoke when the event is fired.
     */
    on(event, listener) {
        return this.emitter.on(event, listener);
    }
    /**
     * Returns all tracked players, or an empty array if there are no clients tracking players.
     */
    getAllPlayers() {
        let players = [];
        Object.keys(this.trackedPlayers).map((guid) => {
            players = players.concat(this.trackedPlayers[guid]);
        });
        return players.filter((player, index, self) => {
            return index === self.findIndex((p) => p.name === player.name);
        });
    }
    /**
     * Returns the list of players visible to the `client` provided.
     * @param client The client to get players for.
     */
    getPlayersFor(client) {
        if (!this.trackedPlayers.hasOwnProperty(client.guid)) {
            return [];
        }
        return this.trackedPlayers[client.guid];
    }
    onUpdate(client, update) {
        if (!this.trackedPlayers.hasOwnProperty(client.guid)) {
            this.trackedPlayers[client.guid] = [];
        }
        for (const obj of update.newObjects) {
            if (models_1.Classes[obj.objectType]) {
                const pd = parsers.processObject(obj);
                pd.server = client.server.name;
                this.trackedPlayers[client.guid].push(pd);
                this.emitter.emit('enter', pd, client);
            }
        }
        for (const drop of update.drops) {
            for (let n = 0; n < this.trackedPlayers[client.guid].length; n++) {
                if (this.trackedPlayers[client.guid][n].objectId === drop) {
                    const pd = this.trackedPlayers[client.guid].splice(n, 1)[0];
                    this.emitter.emit('leave', pd, client);
                    break;
                }
            }
        }
    }
    onNewTick(client, newTick) {
        if (!this.trackedPlayers.hasOwnProperty(client.guid)) {
            this.trackedPlayers[client.guid] = [];
        }
        for (const status of newTick.statuses) {
            for (let n = 0; n < this.trackedPlayers[client.guid].length; n++) {
                if (status.objectId ===
                    this.trackedPlayers[client.guid][n].objectId) {
                    this.trackedPlayers[client.guid][n] = parsers.processStatData(status.stats, this.trackedPlayers[client.guid][n]);
                    this.trackedPlayers[client.guid][n].worldPos = status.pos;
                    break;
                }
            }
        }
    }
};
__decorate([
    core_1.PacketHook(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.Client, net_1.UpdatePacket]),
    __metadata("design:returntype", void 0)
], PlayerTracker.prototype, "onUpdate", null);
__decorate([
    core_1.PacketHook(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.Client, net_1.NewTickPacket]),
    __metadata("design:returntype", void 0)
], PlayerTracker.prototype, "onNewTick", null);
PlayerTracker = __decorate([
    core_1.Library({
        name: 'player tracker library',
    }),
    __metadata("design:paramtypes", [runtime_1.Runtime])
], PlayerTracker);
exports.PlayerTracker = PlayerTracker;
