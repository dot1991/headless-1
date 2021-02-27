/// <reference types="node" />
import * as net from 'net';
import { Proxy } from '../models';
/**
 * Creates a connection to the specified host and port, optionally through
 * a provided proxy. Returns a promise which is resolved when the connection
 * has been established.
 * @param host The host to connect to.
 * @param port The port to connect to.
 * @param proxy An optional proxy to use when connecting.
 */
export declare function createConnection(host: string, port: number, proxy?: Proxy): Promise<net.Socket>;
