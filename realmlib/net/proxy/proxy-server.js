"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProxyServer = void 0;
const logger_1 = require("../util/logger");
const __1 = require("..");
const packetio_1 = require("../packetio");
const Net = require("net");
const fs = require("fs");
class ProxyServer {
    constructor() {
        this.localServer = new Net.Socket();
        this.remoteServer = new Net.Socket();
        this.packetMap = JSON.parse(fs.readFileSync('../src/packets.json', { encoding: 'utf8' }));
        this.packetio = new packetio_1.PacketIO({ socket: this.server, packetMap: this.packetMap });
        this.socketConnected = false;
        /* USSouth3 */
        this.defaultServer = "204.236.175.114";
        this.buildVersion = "1.2.0.1.0";
        logger_1.Logger.log('Proxy Server', `Using build version: ${this.buildVersion}`, logger_1.LogLevel.Info);
        this.connectionGuid = "";
        this.projectiles = [];
        this.enemies = new Map();
        this.players = new Map();
        const requiredHooks = new Set(__1.getHooks().map((hook) => hook.packet));
        for (const type of requiredHooks) {
            this.packetio.on(type, (data) => {
                __1.callHooks(data);
            });
        }
        this.packetio.on('error', (err) => {
            logger_1.Logger.log('Proxy Server', `Received PacketIO error: ${err.message}`, logger_1.LogLevel.Error);
            logger_1.Logger.log('Proxy Server', err.stack, logger_1.LogLevel.Debug);
        });
        this.startServer();
    }
    startServer() {
        logger_1.Logger.log('Proxy Server', `Starting the server..`, logger_1.LogLevel.Info);
        if (this.localServer) {
            this.localServer.connect(2050, '127.0.0.1', (data) => {
                logger_1.Logger.log('Proxy Server', `Proxy server started!`, logger_1.LogLevel.Success);
            });
            this.localServer.on('error', (error) => {
                logger_1.Logger.log('Proxy Server', `Error received starting local server: ${error.message}`, logger_1.LogLevel.Success);
            });
        }
    }
    stopServer() {
    }
    getDefaultServer() {
    }
    logMessage(message) {
        console.log('[Proxy Server] ' + message);
    }
}
exports.ProxyServer = ProxyServer;
