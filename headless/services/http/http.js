"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("http"));
const qs = __importStar(require("querystring"));
const http_client_1 = require("./http-client");
/**
 * A class used internally by the `HttpClient` to work with http urls.
 *
 * @see HttpClient The `HttpClient` class should be used instead of this one.
 */
class Http {
    /**
     * This method is used internally by the `HttpClient` class.
     *
     * **It is not recommended to use this method directly. Use `HttpClient.get` instead.**
     */
    static get(path, query) {
        const opts = {
            hostname: path,
            path: query,
            method: 'GET',
            headers: http_client_1.REQUEST_HEADERS,
        };
        return new Promise((resolve, reject) => {
            const req = http.get(opts, (response) => {
                if (response.headers['content-encoding'] === 'gzip') {
                    http_client_1.HttpClient.unzip(response).then(resolve, reject);
                }
                else {
                    const data = [];
                    response.on('data', (chunk) => {
                        data.push(chunk);
                    });
                    response.once('end', () => {
                        response.removeAllListeners('data');
                        response.removeAllListeners('error');
                        const str = Buffer.concat(data).toString();
                        resolve(str);
                    });
                    response.once('error', (error) => {
                        response.removeAllListeners('data');
                        response.removeAllListeners('end');
                        reject(error);
                    });
                }
            });
            req.end();
        });
    }
    /**
     * This method is used internally by the `HttpClient` class.
     *
     * **It is not recommended to use this method directly. Use `HttpClient.post` instead.**
     */
    static post(endpoint, params) {
        return new Promise((resolve, reject) => {
            const postData = qs.stringify(params);
            const options = {
                host: endpoint.host,
                path: endpoint.path,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(postData),
                },
            };
            const req = http.request(options, (response) => {
                response.setEncoding('utf8');
                let data = '';
                response.on('data', (chunk) => {
                    data += chunk;
                });
                response.once('end', () => {
                    response.removeAllListeners('data');
                    response.removeAllListeners('error');
                    resolve(data);
                });
                response.once('error', (error) => {
                    response.removeAllListeners('data');
                    response.removeAllListeners('end');
                    reject(error);
                });
            });
            req.write(postData);
            req.end();
        });
    }
}
exports.Http = Http;
