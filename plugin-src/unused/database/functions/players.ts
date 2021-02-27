import {WrappedNodeRedisClient} from 'handy-redis';
import {PlayerData} from "../../../../headless";

import {parseGuildRank, parseClass} from "../../discord/parsers";
import {PlayerLocation, PlayerProfile} from "../../models";

/**
 * Functionality to interact with realm and portal data with the cache
 */
export class PlayerFunctions {
    database: WrappedNodeRedisClient;

    /**
     * Set the last known location of a player
     * @param player: the PlayerData
     * @param location: the location e.g vault, ghall, realm name
     */
    public async addPlayerLocation(player: PlayerData, location: string) {
        let object: PlayerLocation = {
            username: player.name,
            server: player.server,
            location: location,
            class: parseClass(player.class),
            charfame: player.currentFame,
            time: Date.now()
        }

        await this.database.set(`player:location:${player.name.toLowerCase()}`, JSON.stringify(object));
    }

    /**
     * Get the last known location of a player
     * @param player: the PlayerData
     */
    public async getPlayerLocation(player: string): Promise<PlayerLocation> {
        let result = await this.database.get(`player:location:${player.toLowerCase()}`);

        if (!result) return Promise.resolve(null);
        return Promise.resolve(JSON.parse(result));
    }

    /**
     * Update a player's profile or if it doesn't exist, create one
     * @param player
     */
    public async updatePlayerProfile(player: PlayerData) {
        let profile = await this.getPlayerProfile(player.name);

        if (!profile) {
            await this.createPlayerProfile(player);
        } else {
            profile.last_spotted = Date.now();
            profile.times_spotted += 1;
            profile.account_fame = player.accountFame;
            profile.account_gold = player.gold;
            profile.guild_name = player.guildName;
            profile.guild_rank = parseGuildRank(player.guildRank);

            await this.database.set(`player:profile:${player.name.toLowerCase()}`, JSON.stringify(profile));
        }
        return;
    }

    /**
     * Create a new profile for a player in the cache
     * @param player
     */
    public async createPlayerProfile(player: PlayerData) {
        let profile: PlayerProfile = {
            username: player.name,
            account_id: player.accountId,
            first_spotted: Date.now(),
            last_spotted: Date.now(),
            times_spotted: 1,
            account_fame: player.accountFame,
            account_gold: player.gold,
            guild_name: player.guildName,
            guild_rank: parseGuildRank(player.guildRank)
        }

        await this.database.set(`player:profile:${player.name.toLowerCase()}`, JSON.stringify(profile));
        return;
    }

    /**
     * Get a player's profile from the cache
     * @param player
     */
    public async getPlayerProfile(player: string): Promise<PlayerProfile> {
        let result = await this.database.get(`player:profile:${player.toLowerCase()}`)

        if (!result) return Promise.resolve(null);
        return Promise.resolve(JSON.parse(result));
    }

    /**
     * Set a player's account ID in their profile
     * @param player 
     */
    public async updateAccountId(player: string, id: string): Promise<any[]> {
        let profile = await this.getPlayerProfile(player.toLowerCase());

        if (!profile) {
            return Promise.resolve([false, 'Player not found']);
        } else {
            let newProfile = profile;
            newProfile.account_id = id;

            await this.database.set(`player:profile:${player.toLowerCase()}`, JSON.stringify(newProfile));
            return Promise.resolve([true, 'Account ID updated']);
        }
    }

    /**
     * Get a list of discord user IDs tracking a player
     * @param player 
     */
    public async getTrackers(player: string): Promise<string[]> {
        let result = await this.database.get(`trackers:${player.toLowerCase()}`);

        if (!result) return Promise.resolve([]);

        let trackers = result.split(':');
        return Promise.resolve(trackers);
    }

    /**
     * Set a cooldown for how long until a player with high gold can be notified of again
     * @param player
     */
    public async setGoldLimit(player: PlayerData) {
        await this.database.setex(`ratelimit:gold:${player.name.toLowerCase()}`, (60 * 60), "true");
        return;
    }

    /**
     * Check if a notification for a player with high gold has already been called recently
     * @param player
     */
    public async checkGoldLimit(player: PlayerData): Promise<boolean> {
        let result = await this.database.get(`ratelimit:gold:${player.name.toLowerCase()}`);
        return Promise.resolve(!result);
    }

    constructor(client: WrappedNodeRedisClient) {
        this.database = client;
    }
}
