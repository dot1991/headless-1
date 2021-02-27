import 'reflect-metadata';
import { Packet } from './packet';
export declare const ValidPacketHooks: string[];
export declare const enum HookParamType {
    Other = 0,
    Packet = 1
}
export interface HookInfo<T> {
    target: string;
    method: string;
    packet: string;
    signature: HookParamType[];
}
/**
 * Indicates that the decorated method should be called when it's packet type is received by a client.
 */
export declare function PacketHook(): MethodDecorator;
/**
 * Returns a copy of the hooks which have been loaded.
 */
export declare function getHooks(): Array<HookInfo<any>>;
/**
 * Invokes any packet hook methods which are registered for the given packet type
 */
export declare function callHooks(packet: Packet): void;
