import {createNodeRedisClient, WrappedNodeRedisClient} from 'handy-redis'
import {Logger, LogLevel} from '../../../headless';
import {User} from 'discord.js'
import {
    PlayerTracker,
    TrackingSettings,
    TrackList,
    TrackListItem
} from '../models'
import {Redis} from './config.json'

import {RealmFunctions} from './functions';
import {PlayerFunctions} from './functions';

/**
 * Start the connection to the Redis server with the values from the config
 */
const client = createNodeRedisClient({
    host: Redis.host,
    port: Redis.port,
})

export class RedisClient {
    public database: WrappedNodeRedisClient

    public players = new PlayerFunctions(client);
    public realms = new RealmFunctions(client);

    constructor() {
        this.database = client
        client.nodeRedis.once('error', (error) => this.handleError(error))
    }

    /**
     * Handles an error in case it's either an Error interface or a string
     * @param error the error to log
     */
    async handleError(error: Error | string) {
        if (typeof error === 'string') {
            Logger.log('Redis', `${error}`, LogLevel.Error)
        } else {
            Logger.log('Redis', `Redis error ${error.name}: ${error.message}\nStacktrace: ${error.stack}`)
        }
        return;
    }

    /**
     * Check if a certain discord user is rate limited to use a function
     * @param type the type of function to rate limit
     * @param userId the discord user ID
     */
    async checkRateLimit(type: string, userId: number): Promise<Boolean> {
        const result = await client.get(`ratelimit:${type}:${userId}`)
        if (result == null) return Promise.resolve(true)
        return Promise.resolve(false)
    }



    /**
     * Remove an ingame player from a discord user's tracklist
     * @param playerName the ingame player username
     * @param userId the discord user's ID
     */
    async removePlayerFromTracklist(playerName: string, userId: string): Promise<string> {
        let tracklist = await this.getUserTracklist(userId)
        if (!tracklist) {
            return Promise.resolve('You do not have any players in your tracklist to remove ❌')
        }

        let index = tracklist.tracklist.findIndex((x) => x.username == playerName)
        if (index == -1) {
            return Promise.resolve(`Player ${playerName} is not in your tracklist`)
        } else {
            tracklist.tracklist.splice(index)

            let key = `tracklist:${userId}`
            let json = JSON.stringify(tracklist)

            await this.removePlayerTracker(playerName, userId)
            this.database.set(key, json).catch((error) => this.handleError(error))
            return Promise.resolve(`Player ${playerName} has been removed from your tracklist ✅`)
        }
    }



    /**
     * Called when a discord server staff member is spotted at a location
     * @param discordServer
     * @param username
     * @param server
     * @param location
     */
    async onStaffLocation(discordServer: string, username: string, server: string, location: string): Promise<[string, string[]]> {
        let raidString = `${discordServer}:${server}:${location}`
        const result = await this.database.get(raidString)

        if (result == null) {
            await this.database.setex(raidString, 300, JSON.stringify([username]))
        } else {
            let usernames: string[] = JSON.parse(result)

            if (!usernames.includes(username)) {
                usernames.push(username)
                await this.database.setex(raidString, 200, JSON.stringify([username]))

                if (usernames.length >= 2) {
                    return Promise.resolve([raidString, usernames])
                }
            }
        }
    }

    /**
     * The default tracklist settings
     */
    getDefaultTrackSettings(): TrackingSettings {
        return {
            enabled: true,
            realm: true,
            bazaar: true,
            vault: false,
        }
    }
}
