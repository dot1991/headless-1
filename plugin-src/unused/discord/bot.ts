import {Client, Guild, Message, MessageEmbed, TextChannel} from 'discord.js';
import {Logger, LogLevel, PlayerData} from '../../../headless';
import {RedisClient} from '../database';

import {RealmPortal} from '../models';
import * as Config from './config.json';

import {getPortalData, parseClass, parseDiscordServer, parseNumber, parseServer, serverList} from './parsers';
import moment = require('moment');

export class DiscordBot {

    public client: Client;
    public ready: boolean = false;
    public server: Guild;
    public runningMode: string;
    public redis: RedisClient;

    constructor() {
        this.connect()
            .then((result) => {
                if (result) {
                    Logger.log('Discord', `Connected with token ${Config.Token.slice(0, 8)}...`, LogLevel.Success);
                }
            })
            .catch((error) => this.handleError(error));

        /* the client is ready to send/receive from discord */
        this.client.on('ready', async () => {
            this.redis = new RedisClient();

            await this.parseConfig(this.client)
                .then((value) => {
                    this.ready = value;
                    Logger.log('Discord', 'Connected to Discord API', LogLevel.Success);
                })
                .catch((err) => this.handleError(err));
        });

        /* error handling */
        this.client.on('error', (error) => {
            this.handleError(error);
        });
        /* debug handling */
        this.client.on('debug', (debug) => {
            this.handleDebug(debug);
        });
        /* disconnect handling */
        this.client.on('disconnect', async (error) => {
            this.ready = false;
            Logger.log('Discord', `Discord disconnected with message: ${error}`, LogLevel.Error);
            await this.connect().then((result) => {
                if (!result) {
                    setTimeout(() => {
                        this.connect();
                    }, 5000);
                }
            });
        });
        /* role updates */
        this.client.on('guildMemberUpdate', (oldMember, newMember) => {
            if (!this.ready) {
                return;
            }
            if (oldMember.user.username !== newMember.user.username) {
                // this.handleUsernameUpdate(newMember)
            }
            if (oldMember.roles.cache !== newMember.roles.cache) {
                // this.handleRoleUpdate(oldMember, newMember)
            }
        });
        /* message handling */
        this.client.on('message', async (message) => {
            if (!this.ready) {
                this.sendStartupMessage(message).then(() => {
                    if (message.channel.type == 'text') {
                        message
                            .delete()
                            .then()
                            .catch((error) => {
                                this.handleError(error);
                            });
                    }
                });
                return;
            }
            await this.messageHandler(message);
        });
    }

    /**
     * Create a discord client and connect with the token from the config file
     */
    public async connect() {
        this.client = new Client();

        await this.client
            .login(Config.Token)
            .then(() => {
                Logger.log('Discord', 'Connecting to Discord...', LogLevel.Success);
                return;
            })
            .catch((error) => {
                this.handleError(error);
            });
        return;
    }

    /**
     * Parse the config.json file
     * Set up the guild and required roles
     * Import commands
     * Import embed templates
     *
     * @param client the Discord bot client
     */
    public async parseConfig(client: Client) {
        this.server = this.client.guilds.cache.get(Config.GuildId);

        if (!this.server) {
            await this.client.guilds.fetch(Config.GuildId).then(server => {
                this.server = server;
            }).catch((error) => this.handleError(error));
        }

        if (!this.server) {
            Logger.log('Discord', `Could not find the guild ID from the config file.. exiting`, LogLevel.Error);
            process.exit();
        } else {
            Logger.log('Discord', `Found the server with name ${this.server.name} - ID: ${this.server.id}`, LogLevel.Success);
        }

        this.runningMode = Config.RunningMode;

        if (this.runningMode == 'development') {
            Logger.log('Discord', 'Running in development mode', LogLevel.Warning);

            await this.client.user.setStatus('idle').catch((e) => this.handleError(e));
            await this.client.user.setActivity('development mode', {type: 'PLAYING'}).catch((e) => this.handleError(e));
        } else if (this.runningMode == 'production') {
            Logger.log('Discord', 'Running in production mode', LogLevel.Success);

            await this.client.user
                .setStatus('online')
                .then(() => {
                    this.client.user.setActivity('the realms', {type: 'WATCHING'}).catch((e) => this.handleError(e));
                })
                .catch((e) => this.handleError(e));
        }

        return;
    }

    handleDebug(msg: string) {
        if (this.runningMode && this.runningMode == 'development') {
            Logger.log('Discord Debug', msg);
        }
        return;
    }

    private handleError(error: Error) {
        if (error.message == 'Cannot send messages to this user') {
            return;
        } else {
            Logger.log('Discord Error', `Discord API error message: ${error.name}\n${error.message}\n${error.stack}`, LogLevel.Error);
        }
        return;
    }

    /**
     * The main command handler
     * @param message the discord message received
     */
    private async messageHandler(message: Message) {
        if (!message.content.startsWith(Config.Prefix) && !message.author.bot) {
            return;
        }
        let authorId = message.author.id;

        if (this.runningMode == 'development' && authorId !== Config.OwnerId) {
            await this.send_command_reply(message, '**The bot is in development mode and not accepting commands**');
            return;
        }

        const author = this.client.users.cache.get(authorId);

        if (message.channel.type == 'dm') {
            let member = this.server.members.cache.get(message.author.id);

            await this.handleMessageCommand(message);

        } else if (message.channel.type == 'text') {
            let member = this.server.members.cache.get(message.author.id);

            await this.handleChannelCommand(message);
        }
    }

    /**
     * Send a simple text reply to a Discord message
     * @param message
     * @param text
     */
    public async send_command_reply(message: Message, text: string) {
        if (!message.author) {
            return;
        }
        await message.author.send(text).catch((error) => this.handleError(error));
    }

    /**
     *
     * @param message
     * @private
     */
    private async handleMessageCommand(message: Message) {
        const args = message.content.slice(Config.Prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();

        switch (command) {
            case 'loc':
                await this.handleLocCommand(message, args);
                return
            case 'track':
                await this.handleTrackCommand(message, args);
                return
            case 'gold':
                await this.handleGoldCommand(message, args);
                return
            case 'realm':
            case 'ip':
                await this.handleRealmCommand(message, args);
                return
            case 'sendtrackingcommands':
                await this.sendCommandsMessage();
                return
            case 'sendportalcommands':
                //
                return;
        }
    }

    private async handleChannelCommand(message: Message) {
        const args = message.content.slice(Config.Prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();

        switch (command) {
            case 'ping':
                break;
            case 'restart':
                break;
        }
        return Promise.resolve(true);
    }

    /**
     *  Handle the command !track
     *
     * @param message the discord message sent by a user
     * @param args the arguments from the discord message
     */
    private async handleTrackCommand(message: Message, args: string[]) {
        let alphaRegex = /^[A-z]+$/g;

        if (args[1] && !args[1].match(alphaRegex)) {
            await this.send_command_reply(message, 'Your command was not sent, please enter a username with only alpha-numeric characters (A-z)');
            return;
        }

        if (args[0] == 'add') {
            if (args.length >= 1) {
                const result = await this.redis.addPlayerToTracklist(args[1], message.author);
                await this.send_command_reply(message, result);
            }
            return;
        } else if (args[0] == 'remove') {
            if (args.length >= 1) {
                const result = await this.redis.removePlayerFromTracklist(args[1], message.author.id);
                await this.send_command_reply(message, result);
            }
            return;
        } else if (args[0] == 'toggle') {
            message.author.send('Command will be back tomorrow');
            return;
        } else if (args[0] == 'clear') {
            message.author.send('Command will be back tomorrow!');
            return;
        } else if (args[0] == 'list') {
            const result = await this.redis.getUserTracklist(message.author.id);

            if (result !== null) {
                this.embeds.sendUserTracklist(message, result);
                return;
            } else {
                message.author.send('You are currently not tracking anyone');
                return;
            }
        } else {
            await this.send_command_reply(
                message,
                'Please enter a track command type: \n```!track add player\n!track remove player\n!track toggle\n!track clear\n!track list```',
            );
            return;
        }
    }

    /**
     *  Handle the command !loc
     *
     * @param message the discord message sent by a user
     * @param args the arguments from the discord message
     */
    private async handleLocCommand(message: Message, args: string[]) {
        if (args[0] && DiscordBot.matchUsername(args[0])) {
            const result = await this.redis.getPlayerLocation(args[0]);

            if (result !== null) {
                this.embeds.sendPlayerLocation(message.author.id, result);
            } else {
                message.author.send(`Player ${args[0]} has not been seen by the tracker yet`);
            }
        } else {
            await this.send_command_reply(message, 'Your command was not sent, please enter only alpha-numeric characters (a-Z)');
        }
    }

    /**
     *  Handle the command !realm
     *
     * @param message the discord message sent by a user
     * @param args the parsed arguments from the discord message
     */
    private async handleRealmCommand(message: Message, args: string[]) {
        if (!args[0] || !args[1]) {
            await this.send_command_reply(message, 'Enter a server and realm to get information i.e: ```!realm eunorth medusa\n!realm eun2 spider\n!realm ase giant```');
            return;
        }
        let server = args[0].toLowerCase();
        let realm = args[1].toLowerCase();

        if (!serverList.includes(server)) {
            let newServer = parseServer(server);
            if (newServer == null) {
                await this.send_command_reply(message, '❌ That realm could not be found');
                return;
            } else {
                server = newServer;
            }
        }
        let realmInfo = await this.redis.getPortalInfo(server, realm);

        if (realmInfo == null) {
            message.author.send('❌ That realm could not be found');
            return;
        }
        let ip = (!realmInfo.hostname) ? 'Bot has not connected to the realm yet!' : realmInfo.hostname;
        let time = moment(realmInfo.time, 'x').fromNow();

        const embed = new MessageEmbed()
            .setColor(Config.EmbedColor)
            .setDescription('\n')
            .setTimestamp()
            .setFooter('realm.spy', Config.EmbedFooterUrl)
            .addField('Realm:', `${realmInfo.server} ${realmInfo.name}`)
            .addField('Players:', realmInfo.players)
            .addField('Queue:', realmInfo.queue)
            .addField('IP:', `${ip}\n\n`)
            .addField('Retreived:', time);

        message.author.send({embed});
    }

    /**
     *  Handle the command !gold
     *
     * @param message the discord message sent by a user
     */
    private async handleGoldCommand(message: Message, args: string[]) {
        await this.send_command_reply(message, '❌ Tracking commands are disabled for now');
        return;
        let alphaRegex = /^[A-z]+$/g;

        if (!args[0]) {
            this.send_command_reply(message, 'Please enter a player to query their gold: **``!gold playername``**');
            return;
        }
        if (!args[0].match(alphaRegex)) {
            this.send_command_reply(message, 'Your command was not sent, please enter only alpha-numeric characters (a-Z)');
            return;
        }
        const result = await this.redis.getPlayerGold(args[0]);
        if (result !== null) {
            await message.author.send(`Player ${args[0]} has **${result}** gold`).catch((error) => this.handleError(error));
        } else {
            await message.author.send(`Player ${args[0]} has not been seen by the tracker yet`).catch((error) => this.handleError(error));
        }
        return Promise.resolve(true);
    }

    /**
     *  Send a message to a user when a command is received but the bot is not ready
     * @param message the message sent by the user
     */
    private async sendStartupMessage(message: Message) {
        if (message.channel.type == 'dm') {
            this.send_command_reply(message, 'The bot is currently starting up or connecting to the database.. please try again in a few moments');
            return;
        }
        if (message.channel.type == 'text') {
            this.send_command_reply(message, 'the bot is currently starting up or connecting to the database.. please try again in a few moments');
            return;
        }
        return;
    }

    /**
     *  Send a user a message when a tracked player is seen
     * @param username the username of the player found
     * @param tracker the discord user ID of the person tracking
     */
    // public callPlayer(player: PlayerData, tracker: string): void {
    //     let user = this.client.users.cache.get(tracker);
    //     if (!user) return;

    //     let tracking = this.redis.trackingEnabled(user.id, (enabled) => {
    //         if (!enabled) return;
    //         let nameLower = player.name.toLowerCase();

    //         this.redis.getLocation(nameLower, async function (location) {
    //             await user.send(location).catch((error) => {
    //                 this.handleError(error);
    //             });
    //         });
    //     });
    // }

    /**
     *  Send a channel message when a player with 25k+ fame enters a nexus
     * @param player PlayerData
     */
    private callBaller(player: PlayerData): void {
        let channel = this.client.channels.cache.get(Config.Channels.HighFamePlayers);
        let parsedFame = parseNumber(player.currentFame);
        let className = parseClass(player.class);

        const embed = new MessageEmbed()
            .setColor(Config.EmbedFooterUrl)
            .setDescription(
                `Big baller [**${player.name}**](https://realmeye.com/player/${player.name}) entered **${player.server}** nexus with **${parsedFame}** fame on ${className}`,
            )
            .setTimestamp()
            .setFooter(Config.EmbedFooterName, Config.EmbedFooterUrl)

        ;(channel as TextChannel).send('', {embed}).catch((error) => {
            Logger.log('Discord', `Error sending high fame player notification: ${error}`, LogLevel.Warning);
        });
    }

    /**
     * Sends a channel message when a dungeon key is popped in the nexus
     *
     * @param name the name of the dungeon
     * @param server the server the key was popped in
     * @param username the key poppers username
     */
    public async callKey(name: string, server: string, username: string) {
        let channel = this.client.channels.cache.get(Config.Channels.KeyPops);
        let portalData = getPortalData(name);

        let embed = new MessageEmbed()
            .setColor(portalData.color)
            .setThumbnail(portalData.image)
            .setDescription(`**${name}** opened in **${server}** nexus by ${username}\nOpen for 30 seconds`)
            .setTimestamp()
            .setFooter(Config.EmbedFooterName, Config.EmbedFooterUrl);

        if (channel) {
            const message = await (channel as TextChannel).send({embed}).catch((error) => {
                Logger.log('Discord', `Error sending key pop notification: ${error}`, LogLevel.Warning);
            }).then((r) => {
                let openTime = 25;
                const timer = setInterval(() => {
                    // @ts-ignore
                    embed.setDescription(`**${name}** opened in **${server}** nexus by ${username}\nOpen for ${openTime} seconds`)
                    (r as Message).edit(embed);
                    openTime = openTime - 5;
                    if (openTime == 0) {
                        // @ts-ignore
                        embed.setDescription(`**${name}** opened in **${server}** nexus by ${username}\n**CLOSED**`)
                        (r as Message).edit(embed);
                        clearInterval(timer);
                        return;
                    }
                }, 5000);
            });
        }
    }

    /**
     * Called when a game manager enters the nexus
     *
     * @param player PlayerData
     */
    public callGameManager(player: PlayerData): void {
        let channel = this.client.channels.cache.get(Config.Channels.GameManagers);
        let gold = parseNumber(player.gold);
        let className = parseClass(player.class);

        const embed = new MessageEmbed()
            .setColor(Config.EmbedColor)
            .setDescription(
                `Game manager [**${player.name}**](https://realmeye.com/player/${player.name}) entered **${player.server}** nexus on ${className}\n\nAccount gold: \`${gold}\``,
            )
            .setTimestamp()
            .setFooter(Config.EmbedFooterName, Config.EmbedFooterUrl);

        if (channel) {
            (channel as TextChannel).send('', {embed}).catch((error) => {
                Logger.log('Discord', `Error sending game manager notification: ${error}`, LogLevel.Warning);
            });
        }
    }

    public callRealmOpen(realm: RealmPortal): void {
        let channel = this.client.channels.cache.get(Config.Channels.RealmOpen);

        let ip = (!realm.hostname) ? 'Bot has not connected to the realm yet' : realm.hostname;

        const embed = new MessageEmbed()
            .setColor(Config.EmbedColor)
            .setAuthor('Realm opened', Config.EmbedFooterUrl)
            .setTimestamp()
            .setFooter(Config.EmbedFooterName, Config.EmbedFooterUrl)
            .addField('Realm:', `${realm.server} ${realm.name}`)
            .addField('Players:', `${realm.players}/85`, true)
            .addField('Queue:', realm.queue, true)
            .addField('IP:', `/goto ${ip}`);

        if (channel) {
            (channel as TextChannel).send('', {embed}).catch((error) => {
                Logger.log('Discord', `Error sending game manager notification: ${error}`, LogLevel.Warning);
            });
        }
    }

    public async callRealmClose(realm: RealmPortal) {
        let channel = this.client.channels.cache.get(Config.Channels.RealmClose);

        let ip = (!realm.hostname) ? 'Bot did not connect to the realm' : realm.hostname;
        let time = moment(realm.time, 'x').fromNow();

        let embed = new MessageEmbed()
            .setColor(Config.EmbedColor)
            .setAuthor('Realm close', Config.EmbedFooterUrl)
            .setTimestamp()
            .setFooter(Config.EmbedFooterName, Config.EmbedFooterUrl)
            .addField('Realm:', `${realm.server} ${realm.name}`)
            .addField('Players:', `${realm.players}/85`, true)
            .addField('Queue:', realm.queue, true)
            .addField('IP:', `/goto ${ip}\n\n`)
            .addField('Retrieved:', time);

        if (channel) {
            (channel as TextChannel).send({embed}).catch((error) => {
                Logger.log('Discord', `Error sending game manager notification: ${error}`, LogLevel.Warning);
            })
        }
        return;
    }

    /**
     * Send a message to the realm surges channel when a high amount of players are spotted
     * @param realm
     * @param players
     */
    public callRealmSurge(realm: RealmPortal, players: number): void {
        let channel = this.client.channels.cache.get(Config.Channels.RealmSurge);

        let ip = (!realm.hostname) ? 'Bot has not connected to the realm yet' : realm.hostname;

        const embed = new MessageEmbed()
            .setColor(Config.EmbedColor)
            .setAuthor('Realm surge', Config.EmbedFooterUrl)
            .setDescription(`${players} players were spotted entering \`${realm.server} ${realm.name}\` in 30 seconds\n\n`)
            .setTimestamp()
            .setFooter(Config.EmbedFooterName, Config.EmbedFooterUrl)
            .addField('Players:', `${realm.players}/85`)
            .addField('Queue:', realm.queue)
            .addField('IP:', `/goto ${ip}`);

        if (channel) {
            (channel as TextChannel).send({embed}).catch((error) => {
                Logger.log('Discord', `Error sending game manager notification: ${error}`, LogLevel.Warning);
            });
        }
    }

    /**
     * Sends a message when a possible discord raid is spotted in a location
     *
     * @param server the discord server running the raid
     * @param usernames array of staff member usernames spotted
     * @param location the location of the raid
     */
    public callDiscordRun(server: string, usernames: string[], location: string): void {
        let discordData = parseDiscordServer(server);
        let staffAmount = usernames.length;
        let description = `${staffAmount} ${discordData.name} staff members were spotted in the same location: \`${location}\`\n\n\`\`\``;

        for (let x = 0; x < staffAmount; x++) {
            description = description + usernames[x] + '\n';
        }
        description = description + '```';

        const embed = new MessageEmbed()
            .setColor(Config.EmbedColor)
            .setTitle('Raid detected')
            .setDescription(description)
            .setTimestamp()
            .setFooter(Config.EmbedFooterName, Config.EmbedFooterUrl);

        let serverChannel = this.client.channels.cache.get(discordData.channel);

        if (serverChannel) {
            (serverChannel as TextChannel).send('', {embed}).catch((error) => {
                Logger.log('Discord', `Error sending Discord raid notification: ${error}`, LogLevel.Warning);
            });
        }
    }

    /**
     * Sends a message when a staff member is spotted entering a location
     *
     * @param discordServer the discord server of the raid
     * @param username the staff members username
     * @param server the ingame server
     * @param location the location of the staff member
     */
    public callStaffLocation(discordServer: string, username: string, server: string, location: string): void {
        let discordData = parseDiscordServer(discordServer);
        let message = '';
        switch (location) {
            case 'left':
                message = `**${username}** entered \`left bazaar\` in **${server}**`;
                break;
            case 'right':
                message = `**${username}** entered \`right bazaar\` in **${server}**`;
                break;
            case 'realm':
                message = `**${username}** entered a realm in **${server}**`;
                break;
            default:
                return;
        }

        /**
         * Check staff members seen in the same location and call a possible raid with all usernames
         */
        const result = this.redis.onStaffLocation(discordServer, username, server, location);

        if (result !== null) {
            let message = `${result[1].length} staff members spotted in same location\`\`\``;

            message += result[0] + '\n';
            result[1].forEach((element) => {
                message += `${element}\n`;
            });
            message = message + `\`\`\`**\`\`\`${server} ${location}\`\`\`**`;

            let embed = new MessageEmbed()
                .setColor(Config.EmbedColor)
                .setTitle('Possible raid')
                .setDescription(message)
                .setTimestamp()
                .setFooter(Config.EmbedFooterName, Config.EmbedFooterUrl);

            let serverChannel = this.client.channels.cache.get(discordData.channel);
            if (serverChannel) {
                (serverChannel as TextChannel).send(embed).catch((error) => {
                    Logger.log('Discord', `Error sending Discord raid notification: ${error}`, LogLevel.Warning);
                });
            }

            embed.setTitle(`Possible ${discordData.name} raid`);
            embed.setColor(Config.EmbedColorAlt);

            let allChannel = this.client.channels.cache.get(Config.Channels.AllRaids);
            if (allChannel) {
                (allChannel as TextChannel).send(embed).catch((error) => {
                    Logger.log('Discord', `Error sending Discord raid notification: ${error}`, LogLevel.Warning);
                });
            }
        }

        const embed = new MessageEmbed().setColor('#000000').setDescription(message).setTimestamp();

        let serverChannel = this.client.channels.cache.get(discordData.channel);
        if (serverChannel) {
            (serverChannel as TextChannel).send(embed).catch((error) => {
                Logger.log('Discord', `Error sending Discord raid notification: ${error}`, LogLevel.Warning);
            });
        }
    }

    /**
     *  Sends a message with the list of accepted commands
     *
     * @param message (optional) the discord message to reply to
     * @param reply whether the message should be sent directly to a user
     */
    private async sendCommandsMessage(message?: Message, reply: boolean = true) {
        const embed = new MessageEmbed()
            .setColor(Config.EmbedColor)
            .setAuthor('Main command list', Config.EmbedFooterUrl)
            .setDescription(
                '\n\n**SEND ALL COMMANDS TO THE BOT BY DM**\n' +
                '```diff\n' +
                '+ !commands\n' +
                '\tshow this message\n\n' +
                '+ !track add playername\n' +
                '\tadd a player to your tracklist\n\n' +
                '+ !track remove playername\n' +
                '\tremove a player from your tracklist\n\n' +
                '+ !track clear\n' +
                '\tclear your tracklist\n\n' +
                '+ !track toggle\n' +
                '\tstop or start all tracking messages\n\n' +
                '+ !track list\n' +
                '\tshows a list of players you\'re tracking\n\n' +
                '+ !loc playername\n' +
                '+ !location playername\n' +
                '\tget the last known location of a player\n\n```',
            )
            .setTimestamp()
            .setFooter(Config.EmbedFooterName, Config.EmbedFooterUrl);

        // send the message to #bot-commands
        if (!reply) {
            let channel = this.client.channels.cache.get(Config.Channels.BotCommands);

            if (channel) {
                (channel as TextChannel).send({embed}).catch((error) => {
                    Logger.log('Discord', `Error sending the commands message: ${error}`, LogLevel.Warning);
                });
            }
            return;
            // send the message directly to a user
        } else if (message) {
            message.author.send({embed}).catch((error) => {
                Logger.log('Discord', `Error sending commands message reply: ${error}`, LogLevel.Warning);
            })
        }
    }

    private formatCommands(commands:)

    /**
     * Test a string against a valid RotMG username
     * @param match the string to match
     */
    private static matchUsername(match: string): Boolean {
        let alphaRegex = /^[A-z]{1-10}$/g
        let regexp = new RegExp(alphaRegex)
        return regexp.test(match)
    }
}
