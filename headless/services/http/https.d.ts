/// <reference types="node" />
import * as url from 'url';
/**
 * A class used internally by the `HttpClient` to work with https urls.
 *
 * @see HttpClient The `HttpClient` class should be used instead of this one.
 */
export declare class Https {
    /**
     * This method is used internally by the `HttpClient` class.
     *
     * **It is not recommended to use this method directly. Use `HttpClient.get` instead.**
     */
    static get(path: string, query: string): Promise<string>;
    /**
     * This method is used internally by the `HttpClient` class.
     *
     * **It is not recommended to use this method directly. Use `HttpClient.post` instead.**
     */
    static post(endpoint: url.Url, params: {
        [id: string]: any;
    }): Promise<string>;
}
