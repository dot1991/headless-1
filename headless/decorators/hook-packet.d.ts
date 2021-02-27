import 'reflect-metadata';
import { HookInfo } from '../core';
/**
 * Indicates that the decorated method should be called when it's packet type is received by a client.
 */
export declare function PacketHook(): MethodDecorator;
/**
 * Returns a copy of the hooks which have been loaded.
 */
export declare function getHooks(): Array<HookInfo<any>>;
