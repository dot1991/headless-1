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
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const net_1 = require("../../realmlib/net");
const core_1 = require("../core");
let ObjectTracker = class ObjectTracker {
    constructor() {
        this.emitter = new events_1.EventEmitter();
        this.trackedTypes = new Set();
        this.trackedObjects = {};
    }
    /**
     * Attaches an event listener to the specified event.
     * @param event The event to attach the listener to.
     * @param listener The function to invoke when the event is fired.
     */
    on(event, listener) {
        this.emitter.on(event.toString(), listener);
        return this;
    }
    /**
     * Starts tracking the specified object,
     * and optionally attaches an event listener.
     * @param objectType The object type to start track.
     * @param listener An optional event listener to attach.
     */
    startTracking(objectType, listener) {
        this.trackedTypes.add(objectType);
        if (listener) {
            this.on(objectType, listener);
        }
        return this;
    }
    /**
     * Stops tracking the specified object and
     * removes any event listeners for it.
     * @param objectType The object type to stop tracking.
     */
    stopTracking(objectType) {
        if (!this.trackedTypes.hasOwnProperty(objectType)) {
            return;
        }
        this.trackedTypes.delete(objectType);
        this.emitter.removeAllListeners(objectType.toString());
    }
    onUpdate(client, update) {
        for (const obj of update.newObjects) {
            if (this.trackedTypes.has(obj.objectType)) {
                if (!this.trackedObjects.hasOwnProperty(client.guid)) {
                    this.trackedObjects[client.guid] = [];
                }
                this.trackedObjects[client.guid].push(obj);
                this.emitter.emit(obj.objectType.toString(), obj, client);
                this.emitter.emit('any', obj, client);
            }
        }
        if (!this.trackedObjects.hasOwnProperty(client.guid)) {
            return;
        }
        for (const drop of update.drops) {
            for (let n = 0; n < this.trackedObjects[client.guid].length; n++) {
                if (this.trackedObjects[client.guid][n].status.objectId === drop) {
                    this.trackedObjects[client.guid].splice(n, 1);
                    break;
                }
            }
        }
    }
    onNewTick(client, newTick) {
        if (!this.trackedObjects.hasOwnProperty(client.guid) || this.trackedObjects[client.guid].length < 1) {
            return;
        }
        for (const status of newTick.statuses) {
            for (const obj of this.trackedObjects[client.guid]) {
                if (obj.status.objectId === status.objectId) {
                    obj.status = status;
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
], ObjectTracker.prototype, "onUpdate", null);
__decorate([
    core_1.PacketHook(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.Client, net_1.NewTickPacket]),
    __metadata("design:returntype", void 0)
], ObjectTracker.prototype, "onNewTick", null);
ObjectTracker = __decorate([
    core_1.Library({
        name: 'object tracker library'
    }),
    __metadata("design:paramtypes", [])
], ObjectTracker);
exports.ObjectTracker = ObjectTracker;
