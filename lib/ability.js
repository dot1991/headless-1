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
var Ability_1;
Object.defineProperty(exports, "__esModule", { value: true });
const headless_1 = require("../../headless");
let Ability = Ability_1 = class Ability {
    constructor(runtime) {
        this.statAmount = 0;
        this.lastSerial = 0;
        runtime.on(headless_1.Events.ClientReady, (client) => {
            this.onEnter(client);
        });
    }
    onStat(client, packet) {
        this.statAmount++;
        if (this.statAmount % 100 == 0) {
            headless_1.Logger.log('Stats', `${packet.name}: ${packet.value}`);
            if (packet.name.startsWith("SpecialAbility")) {
                let fame = Math.floor(packet.value / 25000) * 1000;
                headless_1.Logger.log('Stats', 'Ability fame: ' + fame);
            }
        }
    }
    // @PacketHook()
    // onTick(client: Client, packet: NewTickPacket)
    // {
    //     // if (this.following) {
    //     //     const player = this.tracker.getAllPlayers().find((p) => p.name === this.following);
    //     //     if (!player) {
    //     //         return;
    //     //     }
    //     //     client.nextPos.push(player.worldPos);
    //     // }
    // }
    static async useAbility(client, amount, delay, offset) {
        let packet = new headless_1.UseItemPacket();
        let slot = new headless_1.SlotObjectData();
        slot.objectId = client.playerData.objectId;
        slot.objectType = client.playerData.inventory[1];
        slot.slotId = 1;
        packet.itemUsePos = client.worldPos;
        packet.slotObject = slot;
        packet.useType = 1;
        packet.time = client.getTime();
        let loops = -1;
        while (loops < amount) {
            packet.time += offset;
            //client.timeMod += 100;
            client.io.send(packet);
            loops++;
        }
    }
    /**
     * Walk to a position on a given client
     * @param client
     * @param position
     */
    static walkToPos(client, position) {
        client.findPath({
            x: Math.floor(position.x),
            y: Math.floor(position.y),
        });
    }
    async spamAbility(client) {
        let amount = 1000;
        let delay = 0;
        let offset = 500;
        this.timer = setInterval(() => {
            if (client.playerData.class == headless_1.Classes.Necromancer) {
                if (client.playerData.mp >= 40) {
                    Ability_1.useAbility(client, amount, delay, offset);
                }
            }
            else if (client.playerData.class == headless_1.Classes.Wizard) {
                if (client.playerData.mp >= 20) {
                    Ability_1.useAbility(client, amount, delay, offset);
                }
            }
            else if (client.playerData.class == headless_1.Classes.Priest) {
                if (client.playerData.mp >= 80) {
                    Ability_1.useAbility(client, amount, delay, offset);
                }
            }
        }, 1000);
    }
    onEnter(client) {
        headless_1.Logger.log('Client', `Connected with ${client.playerData.name}`);
        if (!client.worldPos) {
            setTimeout(() => {
                //this.walkToPos(client, new WorldPosData(110,182));
                if (!this.timer) {
                    this.spamAbility(client);
                }
            }, 250);
        }
    }
};
__decorate([
    headless_1.PacketHook(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [headless_1.Client, headless_1.ClientStatPacket]),
    __metadata("design:returntype", void 0)
], Ability.prototype, "onStat", null);
Ability = Ability_1 = __decorate([
    headless_1.Library({
        name: 'ability',
        author: 'him',
        enabled: true,
    }),
    __metadata("design:paramtypes", [headless_1.Runtime])
], Ability);
exports.Ability = Ability;
