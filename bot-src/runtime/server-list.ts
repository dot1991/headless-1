import {Server} from '../models';

/**
 * A dictionary of servers which uses the server's name as the key.
 */
export interface ServerList {
    timestamp: number;
    servers: {
        [name: string]: Server;
    }
}
