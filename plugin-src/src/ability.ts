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
    ClientStatPacket,
    NewTickPacket,
    UseItemPacket,
    SlotObjectData,
    PingPacket,
    PongPacket,
    Classes,
} from '../../headless';

import { PlayerTracker as Tracker } from '../../headless/stdlib/player-tracker';

interface ClientSetting<T> {
    [guid: string]: T;
}

@Library({
    name: 'ability',
    author: 'him',
    enabled: true,
})
export class Ability {
    tracker: Tracker;
    following: string;
    lastSerial: number;
    statAmount: number = 0;

    timer: NodeJS.Timeout;


    @PacketHook()
    onStat(client: Client, packet: ClientStatPacket)
    {
        this.statAmount++;
        if (this.statAmount % 100 == 0) {
            Logger.log('Stats', `${packet.name}: ${packet.value}`);
            if (packet.name.startsWith("SpecialAbility")) {
                let fame = Math.floor(packet.value / 25000) * 1000;
                Logger.log('Stats', 'Ability fame: ' + fame);
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

    private static async useAbility(client: Client, amount: number, delay: number, offset: number)
    {
        let packet = new UseItemPacket();
        let slot = new SlotObjectData();

        slot.objectId = client.playerData.objectId;
        slot.objectType = client.playerData.inventory[1];
        slot.slotId = 1;

        packet.itemUsePos = client.worldPos;
        packet.slotObject = slot;
        packet.useType = 1;
        packet.time = client.getTime();

        let loops = -1;

        while(loops < amount) {
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
    private static walkToPos(client: Client, position: WorldPosData): void {
        client.findPath({
            x: Math.floor(position.x),
            y: Math.floor(position.y),
        });
    }

    private async spamAbility(client: Client) {
        let amount = 1000;
        let delay = 0;
        let offset = 500;

        this.timer = setInterval(() => {
            if (client.playerData.class == Classes.Necromancer) {
                if (client.playerData.mp >= 40) {
                    Ability.useAbility(client, amount, delay, offset);
                }
            } else if (client.playerData.class == Classes.Wizard) {
                if (client.playerData.mp >= 20) {
                    Ability.useAbility(client, amount, delay, offset);
                }
            } else if (client.playerData.class == Classes.Priest) {
                if (client.playerData.mp >= 80) {
                    Ability.useAbility(client, amount, delay, offset);
                }
            }
        }, 1000)
    }

    private onEnter(client: Client) {
        Logger.log('Client', `Connected with ${client.playerData.name}`);

        if (!client.worldPos) {
            setTimeout(() => {
                //this.walkToPos(client, new WorldPosData(110,182));
                if (!this.timer) {
                    this.spamAbility(client);  
                }
            },250)
        }
    }

    constructor(runtime: Runtime)
    {
        this.lastSerial = 0;

        runtime.on(Events.ClientReady, (client) => {
            this.onEnter(client);
        })
    }
}
