"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const dns_1 = require("dns");
const net_1 = require("net");
const core_1 = require("../core");
const models_1 = require("../models");
const http_1 = require("./http");
const xmlToJSON = __importStar(require("./xmltojson"));
const ACCOUNT_IN_USE_REGEX = /Account in use \((\d+) seconds? until timeout\)/;
const ERROR_REGEX = /<Error\/?>(.+)<\/?Error>/;
class AccountService {
    constructor(env) {
        this.env = env;
    }
    /**
     * Gets the list of servers available to connect to. This will
     * look in the cache first and will only make a web request if
     * the cache does not exist.
     */
    getServerList() {
        core_1.Logger.log('Accounts', 'Loading server list...', core_1.LogLevel.Debug);
        const cachedServerList = this.env.readJSON('servers.cache.json');
        if (cachedServerList) {
            core_1.Logger.log('Accounts', 'Cached server list loaded', core_1.LogLevel.Debug);
            return Promise.resolve(cachedServerList);
        }
        else {
            // if there is no cache, fetch the servers.
            // use a random guid here to avoid triggering an internal error
            const guid = crypto_1.randomBytes(6).toString('hex');
            return http_1.HttpClient.get(models_1.SERVER_ENDPOINT, {
                query: {
                    guid,
                },
            }).then((response) => {
                // check for errors.
                const maybeError = AccountService.getError(response);
                if (maybeError) {
                    throw maybeError;
                }
                else {
                    const servers = xmlToJSON.parseServers(response);
                    core_1.Logger.log('Accounts', 'Server list loaded', core_1.LogLevel.Success);
                    // update the cache
                    this.env.writeJSON(servers, 'servers.cache.json');
                    return servers;
                }
            });
        }
    }
    /**
     * Gets the character info for the account with the guid/password provided.
     * This will look in the cache first, and it will only request the info
     * from the rotmg server if the char info was not found in the cache.
     * @param guid The guid of the account to get the character info of.
     * @param password The password of the account to get the character info of.
     * @param proxy An optional proxy to use when making the request.
     */
    getCharacterInfo(guid, password, proxy) {
        // look in the cache
        core_1.Logger.log('Accounts', 'Loading character info...', core_1.LogLevel.Info);
        const cachedCharInfo = this.env.readJSON('char-info.cache.json');
        if (cachedCharInfo && cachedCharInfo.hasOwnProperty(guid)) {
            core_1.Logger.log('Accounts', 'Cached character info loaded', core_1.LogLevel.Success);
            return Promise.resolve(cachedCharInfo[guid]);
        }
        else {
            // if there is no cache, fetch the info.
            return http_1.HttpClient.get(models_1.SERVER_ENDPOINT, {
                proxy,
                query: {
                    guid, password,
                },
            }).then((response) => {
                // check for errors.
                const maybeError = AccountService.getError(response);
                if (maybeError) {
                    throw maybeError;
                }
                const charInfo = xmlToJSON.parseAccountInfo(response);
                core_1.Logger.log('Accounts', 'Character info loaded', core_1.LogLevel.Success);
                // update the cache.
                const cacheUpdate = {};
                cacheUpdate[guid] = charInfo;
                this.env.updateJSON(cacheUpdate, 'char-info.cache.json');
                return charInfo;
            });
        }
    }
    /**
     * Updates the cached character info for the account with the `guid`.
     * @param guid The guid of the account to update the cache of.
     * @param charInfo The new info to store in the cache.
     */
    updateCharInfoCache(guid, charInfo) {
        const cacheUpdate = {};
        cacheUpdate[guid] = charInfo;
        this.env.updateJSON(cacheUpdate, 'char-info.cache.json');
        core_1.Logger.log('Accounts', 'Character info cache updated!', core_1.LogLevel.Success);
    }
    /**
     * Resolves a proxy hostname to ensure its `host` field
     * is always an IP instead of possibly a hostname.
     * @param proxy The proxy to resolve the hostname of.
     */
    resolveProxyHostname(proxy) {
        if (net_1.isIP(proxy.host) === 0) {
            core_1.Logger.log('Accounts', 'Resolving proxy hostname', core_1.LogLevel.Info);
            return new Promise((resolve, reject) => {
                dns_1.lookup(proxy.host, (err, address) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    core_1.Logger.log('Accounts', 'Proxy hostname resolved', core_1.LogLevel.Success);
                    proxy.host = address;
                    resolve();
                });
            });
        }
        else {
            return Promise.resolve();
        }
    }
    static getError(response) {
        // check for acc in use.
        const accInUse = ACCOUNT_IN_USE_REGEX.exec(response);
        if (accInUse) {
            return new models_1.AccountInUseError(parseInt(accInUse[1], 10));
        }
        // check for the generic <Error>some error</Error>
        const otherError = ERROR_REGEX.exec(response);
        if (otherError) {
            const error = new Error(otherError[1]);
            error.name = 'OTHER_ERROR';
            return error;
        }
        // no errors.
        return undefined;
    }
}
exports.AccountService = AccountService;
