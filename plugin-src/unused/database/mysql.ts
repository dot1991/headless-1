import {Message} from 'discord.js';
import {Logger, LogLevel, PlayerData} from '../../../headless';
import {MySQL as Config} from './config.json';

import mysql from 'mysql2';

const connection = mysql.createConnection({
    host: Config.host,
    port: Config.port,
    user: Config.username,
    password: Config.password,
    database: Config.database,
});

export class MySQLClient {
    public database: mysql.Connection;

    constructor() {
        this.database = connection;
        this.database.connect((error) => this.handleConnectionError);
        this.database.on('')
    }


    /**
     * Get a certain user's discord tracking notification settings from the database
     * @param userId the discord user's ID
     */
    public async getTrackingSettings(
        userId: string
    ): Promise<TrackingSettings> {
        const data = await this.database.query({
            sql: 'SELECT * FROM tracklist_settings WHERE userid = ?',
            values: [userId],
        });
        /* return the object */
        if (data.length == 1) {
            let settings: TrackingSettings = data[0];
            return new Promise((r) => settings);
        } else {
            /* set the default settings if they have not been saved before */
            await this.storeTrackingSettings(userId);
        }
        return new Promise((r) => null);
    }

    /**
     * Set tracking settings for a discord user
     * @param userid the user's discord user ID
     * @param settings the tracking settings object
     */
    public async storeTrackingSettings(
        userId: string,
        settings?: TrackingSettings
    ): Promise<Boolean> {
        /* check if the player already has settings saved */
        const data = await this.database.query({
            sql: 'SELECT * FROM tracklist_settings WHERE userid = ?',
            values: [userId],
        });
        /* player is new to the tracker, set up their settings */
        if (data.length == 0) {
            let newSettings: TrackingSettings = {userid: userId};
            await this.database
                .query({
                    sql:
                        'INSERT INTO `tracklist_settings` (`userid`) VALUES (?)',
                    values: [newSettings.userid],
                })
                .thenReturn(new Promise((r) => true));
        } else if (data.length == 1 && settings !== undefined) {
            /* player already has settings, update any that they changed */
            let newData: TrackingSettings = {
                userid: data[0].userid,
                enabled:
                    data[0].enabled == settings.enabled
                        ? settings.enabled
                        : data[0].enabled,
                realm:
                    data[0].realm == settings.realm
                        ? settings.realm
                        : data[0].realm,
                bazaar:
                    data[0].bazaar == settings.bazaar
                        ? settings.bazaar
                        : data[0].bazaar,
                vault:
                    data[0].vault == settings.vault
                        ? settings.vault
                        : data[0].vault,
                ghall:
                    data[0].ghall == settings.ghall
                        ? settings.ghall
                        : data[0].ghall,
                tinkerer:
                    data[0].tinkerer == settings.tinkerer
                        ? settings.tinkerer
                        : data[0].tinkerer,
            };
            await this.database
                .query({
                    sql:
                        'INSERT INTO `tracklist_settings` (`userid`,`enabled`,`realm`,`bazaar`,`vault`,`ghall`,`tinkerer`) VALUES (?,?,?,?,?,?,?)',
                    values: [
                        newData.userid,
                        newData.enabled,
                        newData.realm,
                        newData.bazaar,
                        newData.vault,
                        newData.ghall,
                        newData.tinkerer,
                    ],
                })
                .thenReturn(new Promise((r) => true));
        }
        return new Promise((r) => false);
    }

    /**
     * Return a string array with the list of ingame players a user is tracking
     * @param userId the user's discord ID
     */
    public async getTracklist(userId: number): Promise<string[]> {
        const data = await this.database.query({
            sql: 'SELECT * FROM `tracklist` WHERE `trackerid` = ?',
            values: [userId],
        });
        /* the tracklist is not empty */
        if (data.length > 0) {
            let returnArray: string[] = [];
            for (let i = 0; i < data.length; i++) {
                /* check if any expired tracks need deleted */
                if (data[i].expiry_time <= data[i].creation_time) {
                    this.removeFromTracklist(userId, data[i].tracked_player);
                } else {
                    returnArray.push(data[i].tracked_player);
                }
            }
            if (returnArray.length > 0) return new Promise((r) => returnArray);
        }
        return new Promise((r) => []);
    }

    /**
     * Delete all players in a discord user's tracklist
     * @param userId the discord user's ID
     */
    public async clearTracklist(userId: number): Promise<Boolean> {
        await this.database
            .query({
                sql: 'DELETE * FROM `tracklist` WHERE `trackerid` = ?',
                values: [userId],
            })
            .then(() => {
                return new Promise((r) => true);
            })
            .catch((error) => {
                Logger.log(
                    'MySQL',
                    `Error when clearing tracklist for userId ${userId}: ${error}`,
                    LogLevel.Error
                );
            });
        return new Promise((r) => false);
    }

    /**
     * Add a player to a user's track list
     * @param userId the discord user ID
     * @param username the ingame player username
     * @param expiry how long the track should expire after (30m, 1d, 2w)
     */
    public async addToTracklist(
        userId: number,
        username: string,
        expiry?: string
    ): Promise<string> {
        /* check if the username is inbetween 1 and 10 chars */
        if (username.length < 1 || username.length > 10)
            return new Promise(
                (r) =>
                    'Please enter a player username between 1 and 10 characters.'
            );

        /* check if the player has 25+ people in their tracklist before adding any more */
        const tracklist = await this.getTracklist(userId);
        if (tracklist.length >= 25) {
            return new Promise(
                (r) =>
                    `You have hit the maximum amount of tracked players which is 25.\n` +
                    `You will have to remove some players before you add any more. Your current amount is ${tracklist.length}.`
            );
        }
        /* default to the track never expiring */
        if (!expiry) expiry = null;
        await this.database
            .query({
                sql:
                    'INSERT INTO `tracklist` (`trackerid`, `tracked_player`, `expire`) VALUES (?,?,?)',
                values: [userId, username, expiry],
            })
            .then(() => {
                return new Promise(
                    (r) => `Player \`${username}\` was added to your tracklist!`
                );
            })
            .catch((error) => {
                Logger.log(
                    'MySQL',
                    `Error when adding ${username} to tracklist: ${error}`,
                    LogLevel.Error
                );
            });
        return new Promise((r) => false);
    }

    /**
     * Remove a player from a discord user's tracklist
     * @param userId the discord user ID
     * @param username the ingame player username
     */
    public async removeFromTracklist(
        userId: number,
        username: string
    ): Promise<string> {
        if (username.length < 1 || username.length > 10)
            return new Promise(
                (r) =>
                    'Please enter a player username between 1 and 10 characters.'
            );

        /* check if the user was already in the players tracklist */
        const data = await this.database.query({
            sql:
                'SELECT * FROM `tracklist` WHERE `trackerid` = ? AND `tracked_player` = ?',
            values: [userId, username],
        });
        if (data.length > 0) {
            /* delete the user from the tracklist */
            const result = await this.database.query({
                sql:
                    'DELETE * FROM `tracklist` WHERE `trackerid` = ? AND `tracked_player` = ?',
                values: [userId, username],
            });
            return new Promise(
                (r) => `Player **${username}** was deleted from your tracklist.`
            );
        }
        return new Promise((r) => 'The player or user ID could not be found.');
    }

    /**
     * Return the list of people tracking an ingame player by username
     * @param username
     */
    public async getTrackers(username: string): Promise<string[]> {
        const data = await this.database.query({
            sql: 'SELECT * FROM `tracklist` WHERE `tracked_player` = ?',
            values: [username],
        });
        let trackCount = data.length;
        if (trackCount > 0) {
            let trackers: string[] = [];
            for (let i = 0; i < trackCount; i++) {
                trackers.push(data[i].trackerid);
            }
            if (trackers.length > 0) return new Promise((r) => trackers);
        }
        return new Promise((r) => []);
    }

    /**
     * Return the number of times a player has been added to a tracklist
     * @param username the username to check trackers for
     */
    public async getTrackCount(username: string): Promise<number> {
        const data = await this.database.query({
            sql: 'SELECT * FROM `tracklist` WHERE `tracked_player` = ?',
            values: [username],
        });
        return new Promise((r) => data.length);
    }

    /**
     * Log a user command sent from discord
     * @param message the Discord.Message the command was sent from
     * @param command the command
     * @param args the optional arguments
     */
    public async logCommand(message: Message, command: string, args: string[]) {
        let sql = '';
        let values = [];

        switch (command) {
            case 'loc':
            case 'location':
                sql =
                    'INSERT INTO `command_log` (`user_id`, `user_name`, `base_command`, `target_player`) VALUES (?,?,?,?,?)';
                values = [message.author.id, message.author.username, command];
                if (args[0]) values.push(args[0]);
                break;
            case 'track':
                sql =
                    'INSERT INTO `command_log` (`user_id`, `user_name`, `base_command`, `sub_command`, `target_player`) VALUES (?,?,?,?,?)';
                values = [message.author.id, message.author.username, command];
                if (args[0]) values.push(args[0]);
                if (args[1]) values.push(args[1]);
                break;
            case 'gold':
                sql =
                    'INSERT INTO `command_log` (`user_id`, `user_name`, `base_command`, `sub_command`, `target_player`) VALUES (?,?,?,?,?)';
                values = [message.author.id, message.author.username, command];
                if (args[0]) values.push(args[0]);
                break;
        }

        await this.database
            .query({
                sql: sql,
                values: values,
            })
            .then(() => {
                return;
            })
            .catch((error) => {
                Logger.log(
                    'MySQL',
                    `Error when logging ${command} command with args ${args.toString}: ${error}`,
                    LogLevel.Error
                );
            });
    }

    /**
     * Gracefully destroy the database connection
     */
    public destroy(): void {
        this.database.end();
        this.database.destroy();
        Logger.log(
            'MySQL',
            'Gracefully shut down the database..',
            LogLevel.Success
        );
        return;
    }

    /**
     * Asynchronously wait for given milliseconds
     * @param ms
     */
    async delay(ms: number) {
        return new Promise<void>((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    /**
     * Handle the event where we cannot connect to the MySQL server - retry every 5 seconds
     * @param error
     */
    private handleConnectionError(error: Error) {
        Logger.log('MySQL', `Could not connect to the MySQL server.. retrying in 5 seconds`, LogLevel.Warning);
        this.delay(5000);
        this.database.connect((error) => this.handleConnectionError);
    }
}
