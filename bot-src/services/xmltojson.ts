import {AccessToken, CharacterInfo} from '../models';
import {ServerList} from '../runtime';

const SERVER_REGEX = /<Server><Name>(\w+)<\/Name><DNS>(\d+\.\d+\.\d+\.\d+)<\/DNS>/g;
const ACCOUNT_INFO_REGEX = /<Chars nextCharId="(\d+)" maxNumChars="(\d+)">(?:<Char id="(\d+)">)*/;

const TOKEN_REGEX = /<AccessToken>(.+)<\/AccessToken><AccessTokenTimestamp>(\d+)<\/AccessTokenTimestamp><AccessTokenExpiration>(\d+)<\/AccessTokenExpiration>/;

/**
 * Parses the access token details from the account verify endpoint
 * @param xml
 */
export function parseAccessToken(xml: string): AccessToken {
    let match = TOKEN_REGEX.exec(xml);
    if (match !== null) {
        return {
            token: match[1],
            timestamp: parseInt(match[2]),
            expiration: parseInt(match[3])
        } as AccessToken;
    }
    return null;
}

/**
 * Parses the server list XML into a dictionary of servers keyed by server name
 * @param xml The XML to parse
 */
export function parseServers(xml: string): ServerList {
    let match = SERVER_REGEX.exec(xml);

    const list = {
        timestamp: Date.now(),
        servers: {}
    } as ServerList;

    while (match != null) {
        const name = match[1];
        const ip = match[2];

        list.servers[name] = {
            name,
            address: ip,
        };
        match = SERVER_REGEX.exec(xml);
    }
    return list;
}

/**
 * Parses the account info XML into a `CharacterInfo` object
 * @param xml The XML to parse
 */
export function parseAccountInfo(xml: string): CharacterInfo {
    const acc = {
        nextCharId: 2,
        charId: 1,
        maxNumChars: 1,
    };
    const match = ACCOUNT_INFO_REGEX.exec(xml);
    if (match) {
        acc.nextCharId = +match[1];
        acc.maxNumChars = +match[2];
        if (match[3]) {
            acc.charId = +match[3];
        } else {
            acc.charId = -1;
        }
    } else {
        return null;
    }
    return acc;
}
