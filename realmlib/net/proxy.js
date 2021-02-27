"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import { PacketType } from './packet-type';
//import { Packet } from './packet';
//import { Reader } from './reader'
//import { Writer } from './writer';
const packetio_1 = require("./packetio");
const Net = require("net");
const fs = require("fs");
//import * as IncomingPackets from './packets/incoming';
//import * as OutgoingPackets from './packets/outgoing';
//USSouth3
const defaultServer = "204.236.175.114";
const server = Net.createServer(onClientConnection);
const logName = "[Proxy]";
const packetFile = fs.readFileSync('../src/packets.json', { encoding: 'utf8' });
const packets = JSON.parse(packetFile);
const inputIo = new packetio_1.PacketIO({ packetMap: packets });
const outputIo = new packetio_1.PacketIO({ packetMap: packets });
server.listen(2050, '127.0.0.1', () => {
    console.log(`${logName} Started Server`);
});
server.on('error', (error) => {
    console.log(`${logName} Error when starting server: ${error}`);
});
server.on('close', () => {
    console.log(`${logName} Server closed connection`);
});
function onClientConnection(sock) {
    const client = new Net.Socket();
    client.connect(2050, defaultServer, () => {
        console.log(`${logName} Connected to RotMG server`);
    });
    console.log(`${logName} Client ${sock.remoteAddress} connected`);
    inputIo.attach(sock);
    outputIo.attach(client);
    console.log(`${logName} Attached packet io`);
    inputIo.on('connect', () => {
        console.log(`${logName} Client packet i/o created`);
    });
    inputIo.on('data', (data) => {
        outputIo.send(data);
        console.log(`${logName} Sent ${data} to server`);
    });
    inputIo.on('error', (error) => {
        console.log(`${logName} Received client PacketIO error: ${error}`);
    });
    outputIo.on('error', (error) => {
        console.log(`${logName} Received server PacketIO error: ${error}`);
    });
    inputIo.on('connect', () => {
        console.log(`${logName} Server packet i/o created`);
    });
    sock.on('close', () => {
        console.log(`${logName} Client ${sock.remoteAddress} disconnected`);
    });
    sock.on('error', (error) => {
        console.log(`${logName} had connection error: ${error}`);
    });
}
