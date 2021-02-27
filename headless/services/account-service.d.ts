import { CharacterInfo, Proxy } from '../models';
import { Environment, ServerList } from '../runtime';
export declare class AccountService {
    readonly env: Environment;
    constructor(env: Environment);
    /**
     * Gets the list of servers available to connect to. This will
     * look in the cache first and will only make a web request if
     * the cache does not exist.
     */
    getServerList(): Promise<ServerList>;
    /**
     * Gets the character info for the account with the guid/password provided.
     * This will look in the cache first, and it will only request the info
     * from the rotmg server if the char info was not found in the cache.
     * @param guid The guid of the account to get the character info of.
     * @param password The password of the account to get the character info of.
     * @param proxy An optional proxy to use when making the request.
     */
    getCharacterInfo(guid: string, password: string, proxy?: Proxy): Promise<CharacterInfo>;
    /**
     * Updates the cached character info for the account with the `guid`.
     * @param guid The guid of the account to update the cache of.
     * @param charInfo The new info to store in the cache.
     */
    updateCharInfoCache(guid: string, charInfo: CharacterInfo): void;
    /**
     * Resolves a proxy hostname to ensure its `host` field
     * is always an IP instead of possibly a hostname.
     * @param proxy The proxy to resolve the hostname of.
     */
    resolveProxyHostname(proxy: Proxy): Promise<void>;
    private static getError;
}
