import { Packet } from '../../realmlib/net';
import { Runtime } from '../runtime';
import { Client } from './client';
import { HookInfo, LoadedLib, ManagedLib } from './lib-info';
/**
 * A static singleton class used to load libraries and packet hooks.
 */
export declare class LibraryManager {
    readonly runtime: Runtime;
    readonly libStore: Map<string, ManagedLib<any>>;
    readonly hookStore: Map<string, Array<HookInfo<any>>>;
    readonly clientHookStore: Map<string, HookInfo<Client>>;
    private readonly loadQueue;
    constructor(runtime: Runtime);
    /**
     * Loads the client hooks.
     */
    loadClientHooks(): void;
    /**
     * Loads and stores all libraries present in the `plugins` folder.
     */
    loadPlugins(pluginFolder: string): void;
    loadLib(lib: LoadedLib<any>): boolean;
    /**
     * Invokes any packet hook methods which are registered for the given packet type.
     */
    callHooks(packet: Packet, client: Client): void;
}
