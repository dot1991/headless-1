"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const net = __importStar(require("net"));
const socks_1 = require("socks");
/**
 * Creates a connection to the specified host and port, optionally through
 * a provided proxy. Returns a promise which is resolved when the connection
 * has been established.
 * @param host The host to connect to.
 * @param port The port to connect to.
 * @param proxy An optional proxy to use when connecting.
 */
function createConnection(host, port, proxy) {
    if (proxy) {
        return socks_1.SocksClient.createConnection({
            proxy: {
                ipaddress: proxy.host,
                port: proxy.port,
                type: proxy.type,
                userId: proxy.userId,
                password: proxy.password,
            },
            command: 'connect',
            destination: {
                host,
                port,
            },
        }).then((info) => {
            return info.socket;
        });
    }
    return new Promise((resolve, reject) => {
        const socket = new net.Socket();
        const err = (err) => {
            reject(err);
        };
        socket.addListener('error', err);
        socket.connect(port, host, () => {
            socket.removeListener('error', err);
            process.nextTick(resolve, socket);
        });
    });
}
exports.createConnection = createConnection;
