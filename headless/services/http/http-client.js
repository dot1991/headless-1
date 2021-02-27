"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const qs = __importStar(require("querystring"));
const socks_1 = require("socks");
const url = __importStar(require("url"));
const zlib = __importStar(require("zlib"));
const logger_1 = require("../logger");
const http_1 = require("./http");
const https_1 = require("./https");
/**
 * The HTTP headers to include in each request.
 */
exports.REQUEST_HEADERS = {
    'Cache-Control': 'max-age=0',
    'User-Agent': 'UnityPlayer/2019.4.9f1 (UnityWebRequest/1.0, libcurl/7.52.0-DEV)',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate',
    'Connection': 'keep-alive',
    'X-Unity-Version': '2019.4.9f1'
};
/**
 * A static helper class used to provide an interface for Promise based web requests.
 */
class HttpClient {
    /**
     * Makes a GET request to the specified path.
     * @param path The path to make the GET request to.
     * @param options The options to use while making the request.
     */
    static get(path, options = { query: {}, proxy: null }) {
        const endpoint = url.parse(path);
        if (!/https?:/.test(endpoint.protocol)) {
            return Promise.reject(new Error(`Unsupported protocol: "${endpoint.protocol}"`));
        }
        let queryString = qs.stringify(options.query);
        if (queryString) {
            queryString = `?${queryString}`;
        }
        if (options.proxy) {
            return this.getWithProxy(endpoint, options.proxy, queryString);
        }
        else {
            if (endpoint.protocol === 'http:') {
                return http_1.Http.get(endpoint.hostname, endpoint.path + queryString);
            }
            else {
                return https_1.Https.get(endpoint.hostname, endpoint.path + queryString);
            }
        }
    }
    /**
     * Unzips a gzipped HTTP response.
     * @param zipped The gzipped response to unzip.
     */
    static unzip(zipped) {
        return new Promise((resolve, reject) => {
            const unzip = zlib.createGunzip();
            zipped.pipe(unzip);
            const data = [];
            unzip.on('data', (chunk) => {
                data.push(chunk);
            });
            unzip.once('end', () => {
                unzip.removeAllListeners('data');
                unzip.removeAllListeners('error');
                const str = Buffer.concat(data).toString();
                resolve(str);
            });
            unzip.once('error', (error) => {
                unzip.removeAllListeners('data');
                unzip.removeAllListeners('end');
                reject(error);
            });
        });
    }
    /**
     * Makes a POST request to the specified path and passes the provided parameters.
     * @param path The path to make the POST request to.
     * @param params The POST parameters to include.
     */
    static post(path, params) {
        const endpoint = url.parse(path);
        if (!/https?:/.test(endpoint.protocol)) {
            return Promise.reject(new Error(`Unsupported protocol: "${endpoint.protocol}"`));
        }
        if (endpoint.protocol === 'http:') {
            return http_1.Http.post(endpoint, params);
        }
        else {
            return https_1.Https.post(endpoint, params);
        }
    }
    static getWithProxy(endpoint, proxy, query) {
        return new Promise((resolve, reject) => {
            logger_1.Logger.log('HTTPClient', 'Establishing proxy for GET request', logger_1.LogLevel.Info);
            socks_1.SocksClient.createConnection({
                destination: {
                    host: endpoint.host,
                    port: 80,
                },
                command: 'connect',
                proxy: {
                    ipaddress: proxy.host,
                    port: proxy.port,
                    type: proxy.type,
                    userId: proxy.userId,
                    password: proxy.password,
                },
            }).then((info) => {
                logger_1.Logger.log('HTTPClient', 'Established proxy!', logger_1.LogLevel.Success);
                let data = '';
                info.socket.setEncoding('utf8');
                info.socket.write(`GET ${endpoint.path}${query} HTTP/1.1\r\n`);
                info.socket.write(`Host: ${endpoint.host}\r\n`);
                // tslint:disable-next-line:max-line-length
                info.socket.write(`User-Agent: ${exports.REQUEST_HEADERS['X-Unity-Version']}\r\n`);
                info.socket.write(`X-Unity-Version: ${exports.REQUEST_HEADERS['X-Unity-Version']}\r\n`);
                info.socket.write('Connection: close\r\n\r\n');
                info.socket.on('data', (chunk) => {
                    data += chunk.toString('utf8');
                });
                info.socket.once('close', (err) => {
                    info.socket.removeAllListeners('data');
                    info.socket.removeAllListeners('error');
                    info.socket.destroy();
                    if (!err) {
                        resolve(data);
                    }
                });
                info.socket.once('error', (err) => {
                    info.socket.removeAllListeners('data');
                    info.socket.removeAllListeners('close');
                    info.socket.destroy();
                    reject(err);
                });
            }, reject);
        });
    }
}
exports.HttpClient = HttpClient;
