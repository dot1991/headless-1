import { ServerList } from '../runtime/server-list';
import { CharacterInfo } from './../models';
/**
 * Parses the server list XML into a dictionary of servers keyed by server name.
 * @param xml The XML to parse.
 */
export declare function parseServers(xml: string): ServerList;
/**
 * Parses the account info XML into a `CharacterInfo` object.
 * @param xml The XML to parse.
 */
export declare function parseAccountInfo(xml: string): CharacterInfo;
