import {WrappedNodeRedisClient} from 'handy-redis';
import {PlayerData} from "../../../../headless";

import {parseGuildRank, parseClass} from "../../discord/parsers";
import {PlayerLocation, PlayerProfile, PlayerTracker, TrackingSettings, TrackList, TrackListItem} from "../../models";
import {Message, User} from "eris";

/**
 * Functionality to interact with realm and portal data with the cache
 */
export class TrackingFunctions {
    database: WrappedNodeRedisClient;

    constructor(client: WrappedNodeRedisClient) {
        this.database = client;
    }

    /**
     * Add an ingame player to a discord user's tracklist
     * @param message
     * @param playerName the ingame player username
     */
    async addPlayerToTracklist(message: Message, playerName: string): Promise<string> {
        let tracklist = await this.getUserTracklist(message.author.id)
        if (!tracklist) {
            let newTrack: TrackListItem = {
                username: playerName,
                created: Date.now()
            }
            let newTracklist: TrackList = {
                creator: message.author,
                tracklist: [newTrack],
                settings: TrackingFunctions.getDefaultTrackSettings(),
            }
            let key = `tracklist:${message.author.id}`
            let json = JSON.stringify(newTracklist)

            await this.addPlayerTracker(playerName, message.author.id, message.author.username)
            await this.database.set(key, json)
            return Promise.resolve(`✅  \`${playerName}\` added to your list`)
        } else {
            if (tracklist.tracklist.length >= 25) {
                return Promise.resolve(`❌  You're at the tracking limit of 25 players, remove some to add more or \`!track clear\` to clear your list`)
            }
            if (tracklist.tracklist.findIndex((x) => x.username == playerName) !== -1) {
                return Promise.resolve(`❌  ${playerName} is already in your list`)
            }
            let newTrack = {
                username: playerName,
                created: Date.now(),
            }
            tracklist.tracklist.push(newTrack)

            let key = `tracklist:${message.author.id}`
            let json = JSON.stringify(tracklist)

            await this.addPlayerTracker(playerName, message.author.id, message.author.username)
            await this.database.set(key, json);
            return Promise.resolve(`✅  ${playerName} added to your list`)
        }
    }

    /**
     * Get a discord users tracklist by their ID
     * @param userId the discord user's ID
     */
    async getUserTracklist(userId: string): Promise<TrackList> {
        let key = `tracklist:${userId}`

        const result = await this.database.get(key)
        if (result == null) return Promise.resolve(null)

        let tracklist: TrackList = JSON.parse(result as string)
        return Promise.resolve(tracklist)
    }

    /**
     * Add a discord user to the list of users tracking a player
     * @param playerName the player's username
     * @param userId the user's discord ID
     * @param username the user's discord username
     */
    async addPlayerTracker(playerName: string, userId: string, username: string): Promise<Boolean> {
        let lowerName = playerName.toLowerCase()
        let trackers = await this.getPlayerTrackers(lowerName)
        let key = `players:trackers:${lowerName}`

        if (trackers !== null) {
            let newTracker: PlayerTracker = {
                username: username,
                userid: userId,
                created: Date.now(),
            }
            trackers.push(newTracker)
            let json = JSON.stringify(trackers)

            await this.database.set(key, json)
            return Promise.resolve(true)
        } else {
            let newTracker: PlayerTracker = {
                username: username,
                userid: userId,
                created: Date.now(),
            }
            let json = JSON.stringify([newTracker])

            await this.database.set(key, json);
            return Promise.resolve(true)
        }
    }

    /**
     * Add a discord user to the list of users tracking a player
     * @param playerName the player's username
     * @param userId the user's discord ID
     */
    async removePlayerTracker(playerName: string, userId: string): Promise<Boolean> {
        let lowerName = playerName.toLowerCase()
        let trackers = await this.getPlayerTrackers(lowerName)
        let key = `players:trackers:${lowerName}`

        if (trackers !== null) {
            let index = trackers.findIndex((x) => x.userid == userId)
            if (index !== -1) {
                trackers.splice(index)

                let json = JSON.stringify(trackers)

                await this.database.set(key, json)
                return Promise.resolve(true)
            }
        }
        return Promise.resolve(false)
    }

    /**
     * Get the discord IDs of everyone tracking an ingame player
     * @param playerName the player's username
     */
    async getPlayerTrackers(playerName: string): Promise<PlayerTracker[]> {
        let lowerName = playerName.toLowerCase()
        let key = `players:trackers:${lowerName}`

        const result = await this.database.get(key);

        if (result !== null) {
            let list: PlayerTracker[] = JSON.parse(result as string)
            return Promise.resolve(list)
        }
        return Promise.resolve(null)
    }

    /**
     * The default tracklist settings
     */
    private static getDefaultTrackSettings(): TrackingSettings {
        return {
            enabled: true,
            realm: true,
            bazaar: true,
            vault: false,
        }
    }
}
