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
const models_1 = require("../models");
const runtime_1 = require("../runtime");
const core_1 = require("../core");
let PetTracker = class PetTracker {
    constructor(runtime) {
        this.runtime = runtime;
        this.emitter = new events_1.EventEmitter();
        this.trackedPets = {};
        runtime.on(models_1.Events.ClientConnect, (client) => {
            this.trackedPets[client.guid] = [];
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
     * Returns all of the pets which are currently being tracked.
     */
    getAllPets() {
        let pets = [];
        Object.keys(this.trackedPets).map((guid) => {
            pets = pets.concat(this.trackedPets[guid]);
        });
        return pets.filter((player, index, self) => {
            return index === self.findIndex((p) => p.name === player.name);
        });
    }
    /**
     * Returns the list of pets visible to the `client` provided.
     * @param client The client to get pets for.
     */
    getPetsFor(client) {
        if (!this.trackedPets.hasOwnProperty(client.guid)) {
            return [];
        }
        return this.trackedPets[client.guid];
    }
    onUpdate(client, update) {
        if (!this.trackedPets.hasOwnProperty(client.guid)) {
            this.trackedPets[client.guid] = [];
        }
        for (const obj of update.newObjects) {
            if (this.runtime.resources.pets[obj.objectType] !== undefined) {
                const pet = this.parsePetData(obj.status);
                this.trackedPets[client.guid].push(pet);
                this.emitter.emit('enter', pet, client);
            }
        }
        for (const drop of update.drops) {
            for (let n = 0; n < this.trackedPets[client.guid].length; n++) {
                if (this.trackedPets[client.guid][n].objectId === drop) {
                    const pd = this.trackedPets[client.guid].splice(n, 1)[0];
                    this.emitter.emit('leave', pd, client);
                    break;
                }
            }
        }
    }
    onNewTick(client, newTick) {
        if (!this.trackedPets.hasOwnProperty(client.guid)) {
            this.trackedPets[client.guid] = [];
        }
        for (const status of newTick.statuses) {
            for (let n = 0; n < this.trackedPets[client.guid].length; n++) {
                if (status.objectId === this.trackedPets[client.guid][n].objectId) {
                    this.trackedPets[client.guid][n] = this.parsePetData(status, this.trackedPets[client.guid][n]);
                    break;
                }
            }
        }
    }
    parsePetData(status, existing) {
        if (!existing) {
            existing = {};
        }
        existing.objectId = status.objectId;
        existing.ownerId = status.objectId - 1;
        existing.worldPos = status.pos;
        for (const stat of status.stats) {
            switch (stat.statType) {
                case net_1.StatType.HP_STAT:
                    existing.hp = stat.statValue;
                    continue;
                case net_1.StatType.SIZE_STAT:
                    existing.size = stat.statValue;
                    continue;
                case net_1.StatType.CONDITION_STAT:
                    existing.condition = stat.statValue;
                    continue;
                case net_1.StatType.TEXTURE_STAT:
                    existing.texture = stat.statValue;
                    continue;
                case net_1.StatType.PET_INSTANCEID_STAT:
                    existing.instanceId = stat.statValue;
                    continue;
                case net_1.StatType.PET_NAME_STAT:
                    existing.name = stat.stringStatValue;
                    continue;
                case net_1.StatType.PET_TYPE_STAT:
                    existing.type = stat.statValue;
                    continue;
                case net_1.StatType.PET_RARITY_STAT:
                    existing.rarity = stat.statValue;
                    continue;
                case net_1.StatType.PET_MAXABILITYPOWER_STAT:
                    existing.maxAbilityPower = stat.statValue;
                    continue;
                case net_1.StatType.PET_FAMILY_STAT:
                    existing.family = stat.statValue;
                    continue;
                case net_1.StatType.PET_FIRSTABILITY_POINT_STAT:
                    existing.firstAbilityPoint = stat.statValue;
                    continue;
                case net_1.StatType.PET_SECONDABILITY_POINT_STAT:
                    existing.secondAbilityPoint = stat.statValue;
                    continue;
                case net_1.StatType.PET_THIRDABILITY_POINT_STAT:
                    existing.thirdAbilityPoint = stat.statValue;
                    continue;
                case net_1.StatType.PET_FIRSTABILITY_POWER_STAT:
                    existing.firstAbilityPower = stat.statValue;
                    continue;
                case net_1.StatType.PET_SECONDABILITY_POWER_STAT:
                    existing.secondAbilityPower = stat.statValue;
                    continue;
                case net_1.StatType.PET_THIRDABILITY_POWER_STAT:
                    existing.thirdAbilityPower = stat.statValue;
                    continue;
                case net_1.StatType.PET_FIRSTABILITY_TYPE_STAT:
                    existing.firstAbilityType = stat.statValue;
                    continue;
                case net_1.StatType.PET_SECONDABILITY_TYPE_STAT:
                    existing.secondAbilityType = stat.statValue;
                    continue;
                case net_1.StatType.PET_THIRDABILITY_TYPE_STAT:
                    existing.thirdAbilityType = stat.statValue;
            }
        }
        return existing;
    }
};
__decorate([
    core_1.PacketHook(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.Client, net_1.UpdatePacket]),
    __metadata("design:returntype", void 0)
], PetTracker.prototype, "onUpdate", null);
__decorate([
    core_1.PacketHook(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.Client, net_1.NewTickPacket]),
    __metadata("design:returntype", void 0)
], PetTracker.prototype, "onNewTick", null);
PetTracker = __decorate([
    core_1.Library({
        name: 'pet tracker library'
    }),
    __metadata("design:paramtypes", [runtime_1.Runtime])
], PetTracker);
exports.PetTracker = PetTracker;
