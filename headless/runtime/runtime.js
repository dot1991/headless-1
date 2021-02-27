"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const fs_1 = require("fs");
const net_1 = require("net");
const core_1 = require("../core");
const models_1 = require("../models");
const services_1 = require("../services");
const util_1 = require("../util");
class Runtime extends events_1.EventEmitter {
    constructor(environment) {
        super();
        /**
         * Hard defaults for the config file
         */
        this.buildVersion = "1.3.2.1.0";
        this.clientToken = "8bV53M5ysJdVjU4M97fh2g7BnPXhefnc";
        this.tutorialMode = false;
        this.env = environment;
        this.accountService = new services_1.AccountService(this.env);
        this.resources = new core_1.ResourceManager(this.env);
        this.libraryManager = new core_1.LibraryManager(this);
        this.clients = new Map();
        this.packetMap = new Map();
    }
    /**
     * Starts this runtime.
     * @param args The arguments to start the runtime with.
     */
    async run(args) {
        this.args = args;
        /* get the minimum log level and create the logger class */
        let minLevel = services_1.LogLevel.Info;
        if (args.debug) {
            minLevel = services_1.LogLevel.Debug;
        }
        services_1.Logger.addLogger(new services_1.DefaultLogger(minLevel));
        /* check if the logging argument was passed */
        if (args.log) {
            services_1.Logger.log('Runtime', 'Creating a log file', services_1.LogLevel.Info);
            this.createLog();
            services_1.Logger.addLogger(new services_1.FileLogger(this.logStream));
        }
        try {
            await this.resources.loadAllResources();
        }
        catch (error) {
            services_1.Logger.log('Runtime', 'Cannot load the /resources folder', services_1.LogLevel.Error);
            services_1.Logger.log('Runtime', error.message, services_1.LogLevel.Error);
            process.exit(1);
        }
        /* try to load a packets.json */
        const packets = this.env.readJSON('packets.json');
        if (!packets) {
            services_1.Logger.log('Runtime', 'Cannot load packets.json', services_1.LogLevel.Error);
            process.exit(1);
        }
        else {
            this.packetMap = packets;
            // the length is divided by 2 because the map is bidirectional
            const size = Object.keys(this.packetMap).length / 2;
            services_1.Logger.log('Runtime', `Mapped ${size} packet ids`, services_1.LogLevel.Info);
        }
        /* try to load the config file */
        const versions = this.env.readJSON('config.json');
        if (versions !== undefined) {
            if (versions.buildVersion) {
                this.buildVersion = versions.buildVersion;
                services_1.Logger.log('Runtime', `Using build version "${this.buildVersion}"`, services_1.LogLevel.Info);
            }
            else {
                services_1.Logger.log('Runtime', `Build version not found in config - using default: ${this.buildVersion}`, services_1.LogLevel.Warning);
                this.env.updateJSON({ buildVersion: this.buildVersion }, 'config.json');
            }
            if (versions.clientToken) {
                this.clientToken = versions.clientToken;
            }
            else {
                services_1.Logger.log('Runtime', `Client token not found in config - using default: ${this.clientToken}`, services_1.LogLevel.Warning);
                this.env.updateJSON({ clientToken: this.clientToken }, 'config.json');
            }
            if (versions.tutorialMode && versions.tutorialMode === true) {
                this.tutorialMode = true;
                services_1.Logger.log('Runtime', `Tutorial mode enabled - not connecting to Nexus`, services_1.LogLevel.Warning);
            }
        }
        else {
            services_1.Logger.log('Runtime', 'Cannot load the config.json file', services_1.LogLevel.Error);
            process.exit(1);
        }
        /* load the plugin library hooks */
        this.libraryManager.loadClientHooks();
        if (args.plugins !== false) {
            let pluginFolder = 'plugins';
            if (args.pluginPath && typeof args.pluginPath === 'string') {
                pluginFolder = args.pluginPath;
                services_1.Logger.log('Runtime', `Loading plugins from "${pluginFolder}"`, services_1.LogLevel.Debug);
            }
            this.libraryManager.loadPlugins(pluginFolder);
        }
        else {
            services_1.Logger.log('Runtime', 'Plugin loading disabled', services_1.LogLevel.Info);
        }
        /* read the accounts.json file */
        const accounts = this.env.readJSON('accounts.json');
        if (accounts) {
            const failures = [];
            for (const account of accounts) {
                try {
                    await this.addClient(account);
                }
                catch (err) {
                    services_1.Logger.log('Runtime', `Error adding account "${account.alias}": ${err.message}`, services_1.LogLevel.Error);
                    const failure = {
                        account,
                        retryCount: 1,
                        timeout: 1,
                    };
                    if (err.name === models_1.ACCOUNT_IN_USE) {
                        failure.timeout = err.timeout;
                    }
                    failures.push(failure);
                }
            }
            // try to load the failed accounts.
            for (const failure of failures) {
                // perform the work in a promise so it doesn't block.
                new Promise(async (resolve, reject) => {
                    while (failure.retryCount <= 10) {
                        services_1.Logger.log('Runtime', `Retrying "${failure.account.alias}" in ${failure.timeout} seconds. (${failure.retryCount}/10)`, services_1.LogLevel.Info);
                        // wait for the timeout then try to add the client.
                        await util_1.delay(failure.timeout * 1000);
                        try {
                            await this.addClient(failure.account);
                            resolve();
                        }
                        catch (err) {
                            // if it failed, increase the timeout on a logarithmic scale.
                            services_1.Logger.log('Runtime', `Error adding account "${failure.account.alias}": ${err.message}`, services_1.LogLevel.Error);
                            if (err.name === models_1.ACCOUNT_IN_USE) {
                                failure.timeout = err.timeout;
                            }
                            else {
                                failure.timeout = Math.floor(Math.log10(1 + failure.retryCount) / 2 * 100);
                            }
                            failure.retryCount++;
                        }
                    }
                    reject();
                }).catch(() => {
                    services_1.Logger.log('Runtime', `Failed to load "${failure.account.alias}" after 10 retries. Not retrying.`, services_1.LogLevel.Error);
                });
            }
        }
    }
    /**
     * Creates a new client which uses the provided account
     * @param account The account to login to
     */
    addClient(account) {
        if (!account.alias) {
            account.alias = services_1.censorGuid(account.guid);
        }
        // make sure it's not already part of this runtime
        if (this.clients.has(account.guid)) {
            return Promise.reject(new Error(`This account is already managed by this runtime`));
        }
        services_1.Logger.log('Runtime', `Loading ${account.alias}...`, services_1.LogLevel.Debug);
        // get the server list and char info
        return Promise.all([
            this.accountService.getServerList(),
            this.accountService.getCharacterInfo(account.guid, account.password, account.proxy),
        ]).then(([servers, charInfo]) => {
            account.charInfo = charInfo;
            // make sure the server exists
            let server;
            if (servers[account.serverPref]) {
                server = servers[account.serverPref];
            }
            else {
                if (net_1.isIP(account.serverPref) !== 0) {
                    server = {
                        address: account.serverPref,
                        name: `IP: ${account.serverPref}`,
                    };
                }
                else {
                    const keys = Object.keys(servers);
                    if (keys.length === 0) {
                        throw new Error('Server list is empty.');
                    }
                    server = servers[keys[Math.floor(Math.random() * keys.length)]];
                    services_1.Logger.log(account.alias, `Preferred server not found. Using ${server.name} instead.`, services_1.LogLevel.Warning);
                }
            }
            services_1.Logger.log('Runtime', `Loaded ${account.alias}`, services_1.LogLevel.Success);
            const client = new core_1.Client(this, server, account);
            this.clients.set(client.guid, client);
            return client;
        });
    }
    /**
     * Removes the client with the given `guid` from this runtime
     * @param guid The guid of the client to remove
     */
    removeClient(guid) {
        if (this.clients.has(guid)) {
            const alias = this.clients.get(guid).alias;
            this.clients.get(guid).destroy();
            this.clients.delete(guid);
            services_1.Logger.log('Runtime', `Removed ${alias} from the runtime`, services_1.LogLevel.Success);
        }
        else {
            services_1.Logger.log('Runtime', `Failed removing client ${services_1.censorGuid(guid)} - not in this runtime`, services_1.LogLevel.Warning);
        }
    }
    /**
     * Gets a copy of the clients in this runtime
     * Modifying this list will not affect the runtime
     */
    getClients() {
        return [...this.clients.values()];
    }
    /**
     * Creates a log file for this runtime
     */
    createLog() {
        const version = require('../../package.json').version;
        this.logStream = fs_1.createWriteStream(this.env.pathTo('output.log'));
        const watermark = [
            'INFO',
            '----',
            `date           :: ${(new Date()).toString()}`,
            `runtime version :: v${version}`,
            `nodejs version   :: ${process.version}`,
            '',
            'LOG',
            '----',
        ].join('\n');
        this.logStream.write(`${watermark}\n`);
    }
}
exports.Runtime = Runtime;
