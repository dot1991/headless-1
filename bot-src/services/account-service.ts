import {randomBytes} from 'crypto';
import {lookup as dnsLookup} from 'dns';
import {isIP} from 'net';
import {Logger, LogLevel} from '../core';
import {AccessToken, AccountInUseError, CharacterInfo, Proxy} from '../models';
import {Environment, ServerList} from '../runtime';
import {HttpClient} from './http';
import * as xmlToJSON from './xmltojson';
const md5 = require('md5');

const ACCOUNT_IN_USE_REGEX = /Account in use \((\d+) seconds? until timeout\)/;
const ERROR_REGEX = /<Error\/?>(.+)<\/?Error>/;
const SERVER_ENDPOINT = "https://www.realmofthemadgod.com";

interface CharInfoCache {
    [guid: string]: CharacterInfo;
}

interface AccessTokenCache {
    [guid: string]: AccessToken;
}

export class AccountService {
    constructor(readonly env: Environment) {
    }

    /**
     * Look for an accounts cached access token or grab one from the endpoint
     * @param guid The account email
     * @param password The account password
     * @param proxy The proxy to use (optional)
     */
    getAccessToken(guid: string, password: string, proxy?: Proxy): Promise<AccessToken> {
        const cachedInfo = this.env.readJSON<AccessTokenCache>('access-token.cache.json');
        if (cachedInfo && cachedInfo.hasOwnProperty(guid)) {
            let token = cachedInfo[guid];
            let time = Math.round(Date.now() / 1000);

            if ((token.timestamp + token.expiration - time) > 120) {
                Logger.log('Accounts', 'Cached access token loaded', LogLevel.Success);
                return Promise.resolve(token);
            }
        }
        Logger.log('Accounts', 'Generating access token..', LogLevel.Info);
        const hash = md5(`${guid}:${password}`);
        return HttpClient.post(SERVER_ENDPOINT + '/account/verify', {
            proxy,
            query: {
                guid: guid,
                password: password,
                clientToken: hash,
                game_net: 'Unity',
                play_platform: 'Unity',
                game_net_user_id: ''
            }
        }).then((response) => {
            const maybeError = AccountService.getError(response);

            if (maybeError) {
                throw maybeError;
            } else {
                const token: AccessToken = xmlToJSON.parseAccessToken(response);
                Logger.log('Accounts', 'Generated access token', LogLevel.Success);

                const tokenCache: AccessTokenCache = {};
                tokenCache[guid] = token;
                this.env.updateJSON(tokenCache, 'access-token.cache.json');
                return token;
            }
        })
    }

    /**
     * Gets the list of servers available to connect to. This will
     * look in the cache first and will only make a web request if
     * the cache does not exist
     */
    getServerList(): Promise<ServerList> {
        Logger.log('Accounts', 'Loading server list...', LogLevel.Debug);
        const cachedServerList = this.env.readJSON<ServerList>('servers.cache.json');

        if (cachedServerList) {
            Logger.log('Accounts', 'Cached server list loaded', LogLevel.Debug);
            return Promise.resolve(cachedServerList);
        } else {
            const guid = randomBytes(6).toString('hex');
            return HttpClient.get(SERVER_ENDPOINT + '/char/list', {
                query: {
                    guid,
                },
            }).then((response) => {
                const maybeError = AccountService.getError(response);

                if (maybeError) {
                    throw maybeError;
                } else {
                    const servers: ServerList = xmlToJSON.parseServers(response);
                    Logger.log('Accounts', 'Server list loaded', LogLevel.Success);

                    this.env.writeJSON(servers, 'servers.cache.json');
                    return servers;
                }
            });
        }
    }

    /**
     * Gets the character info for the account with the guid/password provided
     * This will look in the cache first, and it will only request the info
     * from the rotmg server if the char info was not found in the cache
     * @param guid The guid of the account to get the character info of
     * @param password The password of the account to get the character info of
     * @param proxy An optional proxy to use when making the request
     */
    getCharacterInfo(guid: string, password: string, proxy?: Proxy): Promise<CharacterInfo> {
        // look in the cache
        Logger.log('Accounts', 'Loading character info...', LogLevel.Info);
        const cachedCharInfo = this.env.readJSON<CharInfoCache>('char-info.cache.json');
        if (cachedCharInfo && cachedCharInfo.hasOwnProperty(guid)) {
            Logger.log('Accounts', 'Cached character info loaded', LogLevel.Success);
            return Promise.resolve(cachedCharInfo[guid]);
        } else {
            return HttpClient.get(SERVER_ENDPOINT + '/char/list', {
                proxy,
                query: {
                    guid, password,
                },
            }).then((response) => {
                const maybeError = AccountService.getError(response);

                if (maybeError) {
                    throw maybeError;
                }
                const charInfo = xmlToJSON.parseAccountInfo(response);
                Logger.log('Accounts', 'Character info loaded', LogLevel.Success);

                const cacheUpdate: CharInfoCache = {};
                cacheUpdate[guid] = charInfo;
                this.env.updateJSON(cacheUpdate, 'char-info.cache.json');
                return charInfo;
            });
        }
    }

    /**
     * Updates the cached character info for the account with the `guid`
     * @param guid The guid of the account to update the cache of
     * @param charInfo The new info to store in the cache
     */
    updateCharInfoCache(guid: string, charInfo: CharacterInfo): void {
        const cacheUpdate: CharInfoCache = {};
        cacheUpdate[guid] = charInfo;
        this.env.updateJSON(cacheUpdate, 'char-info.cache.json');
        Logger.log('Accounts', 'Character info cache updated!', LogLevel.Success);
    }

    /**
     * Resolves a proxy hostname to ensure its `host` field
     * is always an IP instead of possibly a hostname
     * @param proxy The proxy to resolve the hostname of
     */
    resolveProxyHostname(proxy: Proxy): Promise<void> {
        if (isIP(proxy.host) === 0) {
            Logger.log('Accounts', 'Resolving proxy hostname', LogLevel.Info);
            return new Promise((resolve, reject) => {
                dnsLookup(proxy.host, (err, address) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    Logger.log('Accounts', 'Proxy hostname resolved', LogLevel.Success);
                    proxy.host = address;
                    resolve();
                });
            });
        } else {
            return Promise.resolve();
        }
    }

    private static getError(response: string): Error {
        const accInUse = ACCOUNT_IN_USE_REGEX.exec(response);

        if (accInUse) {
            return new AccountInUseError(parseInt(accInUse[1], 10));
        }

        const otherError = ERROR_REGEX.exec(response);

        if (otherError) {
            const error = new Error(otherError[1]);
            error.name = 'OTHER_ERROR';
            return error;
        }

        return undefined;
    }
}
