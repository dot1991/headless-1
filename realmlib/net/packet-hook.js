"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callHooks = exports.getHooks = exports.PacketHook = exports.ValidPacketHooks = void 0;
require("reflect-metadata");
const AllPackets = require("./packets");
const logger_1 = require("./util/logger");
const hooks = [];
const hookStore = new Map();
exports.ValidPacketHooks = Object.keys(AllPackets);
/**
 * Indicates that the decorated method should be called when it's packet type is received by a client.
 */
function PacketHook() {
    return (target, key) => {
        const params = Reflect.getMetadata('design:paramtypes', target, key) || [];
        const paramNames = params.map((param) => param.name);
        // find the packet parameter
        const packetParam = params.find((param) => exports.ValidPacketHooks.indexOf(param.name) !== -1);
        if (packetParam === undefined) {
            const desc = getDescription(target, key, paramNames);
            logger_1.Logger.log('PacketHook', `${desc} will never be called, because it does not hook a valid packet`, logger_1.LogLevel.Warning);
            return;
        }
        // work out the type signature
        const signature = params.map((param) => {
            if (param === packetParam) {
                return 1 /* Packet */;
            }
            switch (param.name) {
                default:
                    return 0 /* Other */;
            }
        });
        // warn if there are other params
        if (signature.some((arg) => arg === 0 /* Other */)) {
            const desc = getDescription(target, key, paramNames);
            logger_1.Logger.log('PacketHook', `${desc} has parameters that will always be undefined because their type is not Client or Packet`, logger_1.LogLevel.Warning);
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
/**
 * Invokes any packet hook methods which are registered for the given packet type
 */
function callHooks(packet) {
    if (hookStore.has(packet.type)) {
        // get the hooks for this packet type.
        const hooks = hookStore.get(packet.type);
        for (const hook of hooks) {
            if (packet.propagate === false) {
                return;
            }
            try {
                // find the plugin instance to call the method on
                const caller = this.libStore.get(hook.target);
                if (caller && caller.instance) {
                    // create the args according to the hook's signature
                    const args = hook.signature.map((argType) => {
                        switch (argType) {
                            case 1 /* Packet */:
                                return packet;
                            default:
                                return undefined;
                        }
                    });
                    caller.instance[hook.method].apply(caller.instance, args);
                }
            }
            catch (error) {
                logger_1.Logger.log('Plugin Manager', `Error while calling ${hook.target}.${hook.method}()`, logger_1.LogLevel.Warning);
                logger_1.Logger.log('Plugin Manager', error.message, logger_1.LogLevel.Warning);
            }
        }
    }
    if (packet.propagate === false) {
        return;
    }
}
exports.callHooks = callHooks;
function getDescription(target, key, params) {
    let printedParams = params;
    if (params.length > 2) {
        printedParams = [...params.slice(0, 2), '...'];
    }
    return `${target.constructor.name}.${key.toString()}(${printedParams.join(', ')})`;
}
