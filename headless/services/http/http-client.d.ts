/// <reference types="node" />
import { IncomingMessage } from 'http';
import { Proxy } from '../../models';
/**
 * The HTTP headers to include in each request.
 */
export declare const REQUEST_HEADERS: {
    'Cache-Control': string;
    'User-Agent': string;
    Accept: string;
    'Accept-Encoding': string;
    Connection: string;
    'X-Unity-Version': string;
};
/**
 * A static helper class used to provide an interface for Promise based web requests.
 */
export declare class HttpClient {
    /**
     * Makes a GET request to the specified path.
     * @param path The path to make the GET request to.
     * @param options The options to use while making the request.
     */
    static get(path: string, options?: RequestOptions): Promise<string>;
    /**
     * Unzips a gzipped HTTP response.
     * @param zipped The gzipped response to unzip.
     */
    static unzip(zipped: IncomingMessage): Promise<string>;
    /**
     * Makes a POST request to the specified path and passes the provided parameters.
     * @param path The path to make the POST request to.
     * @param params The POST parameters to include.
     */
    static post(path: string, params?: {
        [id: string]: any;
    }): Promise<string>;
    private static getWithProxy;
}
export interface RequestOptions {
    query?: {
        [id: string]: any;
    };
    proxy?: Proxy;
}
