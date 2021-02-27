/**
 * Configuration settings for a proxy.
 */
export interface Proxy {
    host: string;
    port: number;
    userId?: string;
    password?: string;
    type: number;
}
