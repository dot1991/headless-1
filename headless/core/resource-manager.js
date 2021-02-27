"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("./../services");
class ResourceManager {
    constructor(env) {
        this.env = env;
        this.tiles = {};
        this.objects = {};
        this.items = {};
        this.pets = {};
    }
    /**
     * Loads all available resources
     */
    loadAllResources() {
        return Promise.all([
            this.loadTileInfo(),
            this.loadObjects(),
        ]).then(() => null);
    }
    /**
     * Loads the GroundTypes file
     */
    loadTileInfo() {
        const groundTypes = this.env.readJSON('resources', 'GroundTypes.json');
        if (!groundTypes) {
            throw new Error('Could not load GroundTypes.json');
        }
        let tileArray = groundTypes.Ground;
        for (const tile of tileArray) {
            try {
                this.tiles[+tile.type] = {
                    type: +tile.type,
                    id: tile.id,
                    displayId: (!!tile.DisplayId ? tile.DisplayId : 'Unknown'),
                    sink: (!!tile.Sink),
                    push: (!!tile.Push),
                    speed: isNaN(tile.Speed) ? 1 : +tile.Speed,
                    noWalk: (!!tile.NoWalk),
                    minDamage: (tile.MinDamage ? parseInt(tile.MinDamage, 10) : undefined),
                    maxDamage: (tile.MaxDamage ? parseInt(tile.MaxDamage, 10) : undefined),
                };
            }
            catch (_a) {
                services_1.Logger.log('Resources', `Failed to load tile: ${tile.type}`, services_1.LogLevel.Debug);
            }
        }
        services_1.Logger.log('Resources', `Loaded ${tileArray.length} tiles.`, services_1.LogLevel.Info);
        tileArray = null;
    }
    /**
     * Loads the Objects file
     */
    loadObjects() {
        const objects = this.env.readJSON('resources', 'Objects.json');
        let itemCount = 0;
        let enemyCount = 0;
        let petCount = 0;
        let objectsArray = objects.Object;
        for (const current of objectsArray) {
            if (this.objects[+current.type] !== undefined) {
                continue;
            }
            try {
                this.objects[+current.type] = {
                    type: +current.type,
                    id: current.id,
                    enemy: current.Enemy === '',
                    item: current.Item === '',
                    god: current.God === '',
                    pet: current.Pet === '',
                    slotType: isNaN(current.SlotType) ? 0 : +current.SlotType,
                    bagType: isNaN(current.BagType) ? 0 : +current.BagType,
                    class: current.Class,
                    maxHitPoints: isNaN(current.MaxHitPoints) ? 0 : +current.MaxHitPoints,
                    defense: isNaN(current.Defense) ? 0 : +current.Defense,
                    xpMultiplier: isNaN(current.XpMult) ? 0 : +current.XpMult,
                    activateOnEquip: [],
                    projectiles: [],
                    projectile: null,
                    rateOfFire: isNaN(current.RateOfFire) ? 0 : +current.RateOfFire,
                    numProjectiles: isNaN(current.NumProjectiles) ? 1 : +current.NumProjectiles,
                    arcGap: isNaN(current.ArcGap) ? 11.25 : +current.ArcGap,
                    fameBonus: isNaN(current.FameBonus) ? 0 : +current.FameBonus,
                    feedPower: isNaN(current.feedPower) ? 0 : +current.feedPower,
                    fullOccupy: current.FullOccupy === '',
                    occupySquare: current.OccupySquare === '',
                    protectFromGroundDamage: current.ProtectFromGroundDamage === '',
                    mpCost: isNaN(current.MpCost) ? null : +current.MpCost,
                    mpEndCost: isNaN(current.MpEndCost) ? null : +current.MpEndCost,
                    soulbound: !!(current.Soulbound),
                    usable: !!(current.Usable),
                    activate: []
                };
                if (Array.isArray(current.Activate)) {
                    this.objects[+current.type].activate = new Array(current.Activate.length);
                    for (let j = 0; j < current.Activate.length; j++) {
                        this.objects[+current.type].activate[j] = {
                            id: +current.Activate[j].id,
                            type: +current.Activate[j]._,
                            duration: current.Activate[j].duration ? current.Activate[j].duration : null,
                            stat: current.Activate[j].stat ? current.Activate[j].stat : null,
                            effect: current.Activate[j].effect ? current.Activate[j].effect : null,
                            cooldown: current.Activate[j].cooldown ? current.Activate[j].cooldown : null,
                            target: current.Activate[j].target ? current.Activate[j].target : null,
                            center: current.Activate[j].center ? current.Activate[j].center : null,
                            numShots: current.Activate[j].numShots ? current.Activate[j].numShots : null,
                            speed: current.Activate[j].speed ? current.Activate[j].speed : null,
                            range: current.Activate[j].range ? current.Activate[j].range : null,
                            radius: current.Activate[j].radius ? current.Activate[j].radius : null,
                            totalDamage: current.Activate[j].totalDamage ? current.Activate[j].totalDamage : null,
                            impactDamage: current.Activate[j].impactDamage ? current.Activate[j].impactDamage : null,
                            throwTime: current.Activate[j].throwTime ? current.Activate[j].throwTime : null,
                            heal: current.Activate[j].heal ? current.Activate[j].heal : null,
                            healRange: current.Activate[j].healRange ? current.Activate[j].healRange : null,
                            ignoreDef: current.Activate[j].ignoreDef ? current.Activate[j].ignoreDef : null,
                            wisMin: current.Activate[j].wisMin ? current.Activate[j].wisMin : null,
                            useWisMod: !!current.Activate[j].useWisMod,
                            wisDamageBase: current.Activate[j].wisDamageBase ? current.Activate[j].wisDamageBase : null,
                            condEffect: current.Activate[j].condEffect ? current.Activate[j].condEffect : null,
                            condDuration: current.Activate[j].condDuration ? current.Activate[j].condDuration : null,
                            noStack: !!current.Activate[j].noStack,
                            slot: current.Activate[j].slot ? current.Activate[j].slot : null,
                            skin: current.Activate[j].skin ? current.Activate[j].skin : null,
                            skinType: current.Activate[j].skinType ? current.Activate[j].skinType : null,
                            isUnlock: !!current.Activate[j].isUnlock,
                            newId: current.Activate[j].newId ? current.Activate[j].newId : null,
                            onlyIn: current.Activate[j].onlyIn ? current.Activate[j].onlyIn : null,
                            onlyInArea: current.Activate[j].onlyInArea ? current.Activate[j].onlyInArea : null,
                        };
                    }
                }
                else {
                    this.objects[+current.type].activate.push({
                        id: this.objects[+current.type].activate.length + 1,
                        type: +current.Activate
                    });
                }
                // map items.
                if (this.objects[+current.type].item) {
                    // stat bonuses
                    if (Array.isArray(current.ActivateOnEquip)) {
                        for (const bonus of current.ActivateOnEquip) {
                            if (bonus._ === 'IncrementStat') {
                                this.objects[+current.type].activateOnEquip.push({
                                    statType: bonus.stat,
                                    amount: bonus.amount,
                                });
                            }
                        }
                    }
                    else if (typeof current.ActivateOnEquip === 'object') {
                        if (current.ActivateOnEquip._ === 'IncrementStat') {
                            this.objects[+current.type].activateOnEquip.push({
                                statType: current.ActivateOnEquip.stat,
                                amount: current.ActivateOnEquip.amount,
                            });
                        }
                    }
                    this.items[+current.type] = this.objects[+current.type];
                    itemCount++;
                }
                // map pets.
                if (this.objects[+current.type].pet) {
                    this.pets[+current.type] = this.objects[+current.type];
                    petCount++;
                }
            }
            catch (_a) {
                services_1.Logger.log('Resources', `Failed to load object: ${current.type}`, services_1.LogLevel.Debug);
            }
        }
        services_1.Logger.log('Resources', `Loaded ${objectsArray.length} objects`, services_1.LogLevel.Info);
        services_1.Logger.log('Resources', `Loaded ${itemCount} items`, services_1.LogLevel.Debug);
        services_1.Logger.log('Resources', `Loaded ${enemyCount} enemies`, services_1.LogLevel.Debug);
        services_1.Logger.log('Resources', `Loaded ${petCount} pets`, services_1.LogLevel.Debug);
        services_1.Logger.log('Resources', `Loaded `);
        objectsArray = null;
    }
    /**
     * Loads the forgeProperties file
     */
    loadForgeProperties() {
    }
}
exports.ResourceManager = ResourceManager;
