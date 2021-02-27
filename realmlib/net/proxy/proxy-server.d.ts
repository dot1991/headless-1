/// <reference types="node" />
import { Random, Projectile } from '../data';
import { Entity, Enemy } from '../models';
import { PacketIO } from '../packetio';
import { PacketMap } from '../packet-map';
import Net = require('net');
export declare class ProxyServer {
    localServer: Net.Socket;
    remoteServer: Net.Socket;
    packetMap: PacketMap;
    packetio: PacketIO;
    defaultServer: string;
    socketConnected: boolean;
    connectionGuid: string;
    buildVersion: string;
    projectiles: Projectile[];
    random: Random;
    enemies: Map<number, Enemy>;
    players: Map<number, Entity>;
    constructor();
    startServer(): void;
    stopServer(): void;
    getDefaultServer(): void;
    logMessage(message: string): void;
}
