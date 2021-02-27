/// <reference types="node" />
import { EventEmitter } from 'events';
import { PacketMap } from '../../realmlib/net';
import { Client, LibraryManager, ResourceManager } from '../core';
import { Account } from '../models';
import { AccountService } from '../services';
import { Environment } from './environment';
interface Arguments {
    [argName: string]: unknown;
}
export declare class Runtime extends EventEmitter {
    readonly env: Environment;
    readonly accountService: AccountService;
    readonly resources: ResourceManager;
    readonly libraryManager: LibraryManager;
    packetMap: PacketMap;
    /**
     * Hard defaults for the config file
     */
    buildVersion: string;
    clientToken: string;
    tutorialMode: boolean;
    args: Arguments;
    private logStream;
    private readonly clients;
    constructor(environment: Environment);
    /**
     * Starts this runtime.
     * @param args The arguments to start the runtime with.
     */
    run(args: Arguments): Promise<void>;
    /**
     * Creates a new client which uses the provided account
     * @param account The account to login to
     */
    addClient(account: Account): Promise<Client>;
    /**
     * Removes the client with the given `guid` from this runtime
     * @param guid The guid of the client to remove
     */
    removeClient(guid: string): void;
    /**
     * Gets a copy of the clients in this runtime
     * Modifying this list will not affect the runtime
     */
    getClients(): Client[];
    /**
     * Creates a log file for this runtime
     */
    private createLog;
}
export {};
