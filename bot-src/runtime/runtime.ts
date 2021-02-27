import {EventEmitter} from 'events';
import {createWriteStream, WriteStream} from 'fs';
import {isIP} from 'net';
import {PacketMap} from '../../realmlib/net';
import {Client, LibraryManager, ResourceManager} from '../core';
import {Account, ACCOUNT_IN_USE, AccountInUseError, Server} from '../models';
import {AccountService, censorGuid, DefaultLogger, FileLogger, Logger, LogLevel} from '../services';
import {delay} from '../util';
import {Environment} from './environment';
import {Config} from './config';

interface Arguments {
    [argName: string]: unknown;
}

interface FailedAccount {
    account: Account;
    retryCount: number;
    timeout: number;
    remove?: Boolean;
}

export class Runtime extends EventEmitter {

    readonly env: Environment;
    readonly accountService: AccountService;
    readonly resources: ResourceManager;
    readonly libraryManager: LibraryManager;

    packetMap: PacketMap;

    /**
     * Hard defaults for the config file
     */
    buildVersion: string = "1.3.2.1.0";
    clientToken: string = "8bV53M5ysJdVjU4M97fh2g7BnPXhefnc";
    tutorialMode: boolean = false;
    args: Arguments;

    private logStream: WriteStream;
    private readonly clients: Map<string, Client>;

    constructor(environment: Environment) {
        super();
        this.env = environment;

        this.accountService = new AccountService(this.env);
        this.resources = new ResourceManager(this.env);
        this.libraryManager = new LibraryManager(this);
        this.clients = new Map();
        this.packetMap = new Map();
    }

    /**
     * Starts this runtime.
     * @param args The arguments to start the runtime with.
     */
    async run(args: Arguments): Promise<void> {
        this.args = args;

        /* get the minimum log level and create the logger class */
        let minLevel = LogLevel.Info;
        if (args.debug) {
            minLevel = LogLevel.Debug;
        }
        Logger.addLogger(new DefaultLogger(minLevel));

        /* check if the logging argument was passed */
        if (args.log) {
            Logger.log('Runtime', 'Creating a log file', LogLevel.Info);
            this.createLog();
            Logger.addLogger(new FileLogger(this.logStream));
        }

        try {
            await this.resources.loadAllResources();
        } catch (error) {
            Logger.log('Runtime', 'Cannot load the /resources folder', LogLevel.Error);
            Logger.log('Runtime', error.message, LogLevel.Error);
            process.exit(1);
        }

        /* try to load a packets.json */
        const packets: PacketMap = this.env.readJSON('packets.json');
        if (!packets) {
            Logger.log('Runtime', 'Cannot load packets.json', LogLevel.Error);
            process.exit(1);
        } else {
            this.packetMap = packets;
            // the length is divided by 2 because the map is bidirectional
            const size = Object.keys(this.packetMap).length / 2;
            Logger.log('Runtime', `Mapped ${size} packet ids`, LogLevel.Info);
        }

        /* try to load the config file */
        const versions = this.env.readJSON<Config>('config.json');
        if (versions !== undefined) {
            if (versions.buildVersion) {
                this.buildVersion = versions.buildVersion;
                Logger.log('Runtime', `Using build version "${this.buildVersion}"`, LogLevel.Info);
            } else {
                Logger.log('Runtime', `Build version not found in config - using default: ${this.buildVersion}`, LogLevel.Warning);
                this.env.updateJSON<Config>({buildVersion: this.buildVersion}, 'config.json');
            }
            if (versions.clientToken) {
                this.clientToken = versions.clientToken;
            } else {
                Logger.log('Runtime', `Client token not found in config - using default: ${this.clientToken}`, LogLevel.Warning);
                this.env.updateJSON<Config>({clientToken: this.clientToken}, 'config.json');
            }
            if (versions.tutorialMode && versions.tutorialMode === true) {
                this.tutorialMode = true;
                Logger.log('Runtime', `Tutorial mode enabled - not connecting to Nexus`, LogLevel.Warning);
            }
        } else {
            Logger.log('Runtime', 'Cannot load the config.json file', LogLevel.Error);
            process.exit(1);
        }

        /* load the plugin library hooks */
        this.libraryManager.loadClientHooks();

        if (args.plugins !== false) {
            let pluginFolder = 'plugins';

            if (args.pluginPath && typeof args.pluginPath === 'string') {
                pluginFolder = args.pluginPath;
                Logger.log('Runtime', `Loading plugins from "${pluginFolder}"`, LogLevel.Debug);
            }
            this.libraryManager.loadPlugins(pluginFolder);
        } else {
            Logger.log('Runtime', 'Plugin loading disabled', LogLevel.Info);
        }

        /* read the accounts.json file */
        const accounts = this.env.readJSON<Account[]>('accounts.json');
        if (accounts) {
            const failures: FailedAccount[] = [];
            for (const account of accounts) {
                try {
                    await this.addClient(account);
                } catch (err) {
                    Logger.log('Runtime', `Error adding account "${account.alias}": ${err.message}`, LogLevel.Error);
                    const failure = {
                        account,
                        retryCount: 1,
                        timeout: 1,
                    };
                    if (err.name === ACCOUNT_IN_USE) {
                        failure.timeout = (err as AccountInUseError).timeout;
                    }
                    failures.push(failure);
                }
            }

            // try to load the failed accounts.
            for (const failure of failures) {
                // perform the work in a promise so it doesn't block.
                new Promise(async (resolve, reject) => {
                    while (failure.retryCount <= 10) {
                        Logger.log('Runtime', `Retrying "${failure.account.alias}" in ${failure.timeout} seconds. (${failure.retryCount}/10)`, LogLevel.Info,
                        );

                        // wait for the timeout then try to add the client.
                        await delay(failure.timeout * 1000);
                        try {
                            await this.addClient(failure.account);
                            resolve();
                        } catch (err) {
                            // if it failed, increase the timeout on a logarithmic scale.
                            Logger.log('Runtime', `Error adding account "${failure.account.alias}": ${err.message}`, LogLevel.Error);
                            if (err.name === ACCOUNT_IN_USE) {
                                failure.timeout = (err as AccountInUseError).timeout;
                            } else {
                                failure.timeout = Math.floor(Math.log10(1 + failure.retryCount) / 2 * 100);
                            }
                            failure.retryCount++;
                        }
                    }
                    reject();

                }).catch(() => {
                    Logger.log('Runtime', `Failed to load "${failure.account.alias}" after 10 retries. Not retrying.`, LogLevel.Error,
                    );
                });
            }

        }
    }

    /**
     * Creates a new client which uses the provided account
     * @param account The account to login to
     */
    addClient(account: Account): Promise<Client> {
        if (!account.alias) {
            account.alias = censorGuid(account.guid);
        }

        // make sure it's not already part of this runtime
        if (this.clients.has(account.guid)) {
            return Promise.reject(new Error(`This account is already managed by this runtime`));
        }

        Logger.log('Runtime', `Loading ${account.alias}...`, LogLevel.Debug);

        // get the server list and char info
        return Promise.all([
            this.accountService.getServerList(),
            this.accountService.getCharacterInfo(account.guid, account.password, account.proxy),
        ]).then(([servers, charInfo]) => {
            account.charInfo = charInfo;

            // make sure the server exists
            let server: Server;
            if (servers[account.serverPref]) {
                server = servers[account.serverPref];
            } else {
                if (isIP(account.serverPref) !== 0) {
                    server = {
                        address: account.serverPref,
                        name: `IP: ${account.serverPref}`,
                    };
                } else {
                    const keys = Object.keys(servers);
                    if (keys.length === 0) {
                        throw new Error('Server list is empty.');
                    }
                    server = servers[keys[Math.floor(Math.random() * keys.length)]];
                    Logger.log(account.alias, `Preferred server not found. Using ${server.name} instead.`, LogLevel.Warning);
                }
            }
            Logger.log('Runtime', `Loaded ${account.alias}`, LogLevel.Success);
            const client = new Client(this, server, account);
            this.clients.set(client.guid, client);
            return client;
        });
    }

    /**
     * Removes the client with the given `guid` from this runtime
     * @param guid The guid of the client to remove
     */
    removeClient(guid: string): void {
        if (this.clients.has(guid)) {
            const alias = this.clients.get(guid).alias;
            this.clients.get(guid).destroy();
            this.clients.delete(guid);
            Logger.log('Runtime', `Removed ${alias} from the runtime`, LogLevel.Success);
        } else {
            Logger.log(
                'Runtime',
                `Failed removing client ${censorGuid(guid)} - not in this runtime`,
                LogLevel.Warning,
            );
        }
    }

    /**
     * Gets a copy of the clients in this runtime
     * Modifying this list will not affect the runtime
     */
    getClients(): Client[] {
        return [...this.clients.values()];
    }

    /**
     * Creates a log file for this runtime
     */
    private createLog(): void {
        const version = require('../../package.json').version;
        this.logStream = createWriteStream(this.env.pathTo('output.log'));
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
