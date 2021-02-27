"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const services_1 = require("../services");
const valid_packets_1 = require("./valid-packets");
const hooks = [];
/**
 * Indicates that the decorated method should be called when it's packet type is received by a client.
 */
function PacketHook() {
    return (target, key) => {
        const params = Reflect.getMetadata('design:paramtypes', target, key) || [];
        const paramNames = params.map((param) => param.name);
        // find the packet parameter
        const packetParam = params.find((param) => valid_packets_1.VALID_PACKET_HOOKS.indexOf(param.name) !== -1);
        if (packetParam === undefined) {
            const desc = getDescription(target, key, paramNames);
            services_1.Logger.log('PacketHook', `${desc} will never be called, because it does not hook an incoming packet.`, services_1.LogLevel.Warning);
            return;
        }
        // work out the type signature
        const signature = params.map((param) => {
            if (param === packetParam) {
                return 1 /* Packet */;
            }
            switch (param.name) {
                case 'Client':
                    return 2 /* Client */;
                default:
                    return 0 /* Other */;
            }
        });
        // warn if there are other params
        if (signature.some((arg) => arg === 0 /* Other */)) {
            const desc = getDescription(target, key, paramNames);
            services_1.Logger.log('PacketHook', `${desc} has parameters that will always be undefined because their type is not Client or Packet.`, services_1.LogLevel.Warning);
        }
        // get the type of the packet.
        const packetInstance = new packetParam();
        const packetType = packetInstance.type;
        // sanity check.
        if (typeof packetType !== 'string') {
            throw new Error(`Cannot get packet type of the packet "${packetParam.name}"`);
        }
        hooks.push({
            target: target.constructor.name,
            method: key.toString(),
            packet: packetType,
            signature,
        });
    };
}
exports.PacketHook = PacketHook;
/**
 * Returns a copy of the hooks which have been loaded.
 */
function getHooks() {
    return [...hooks];
}
exports.getHooks = getHooks;
function getDescription(target, key, params) {
    let printedParams = params;
    if (params.length > 2) {
        printedParams = [...params.slice(0, 2), '...'];
    }
    return `${target.constructor.name}.${key.toString()}(${printedParams.join(', ')})`;
}
