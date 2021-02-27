import {Logger, LogLevel} from '../../../headless';

import * as Config from './config.json'
import {Guild, Message, PrivateChannel} from "eris";
import {PlayerFunctions, RealmFunctions, TrackingFunctions} from "../database/functions";
import GeneralEmbeds from "./embeds/general";
import { parseLocation } from "./parsers";

import moment from 'moment';

const Eris = require("eris");
const bot = new Eris.CommandClient(Config.Token, {}, {
    description: "realm.spy",
    owner: "him#0001",
    prefix: "!"
});

export class NewDiscord {
    server: Guild;

    tracking: TrackingFunctions;
    realms: RealmFunctions;
    players: PlayerFunctions;

    embeds: GeneralEmbeds;

    constructor() {
        this.setupCommands();
        this.setupStaffCommands();

        bot.on('ready', () => {
            Logger.log('Discord', 'Ready to use the API', LogLevel.Info);
            bot.editStatus("idle", {name:"the realms", type: 3});
        });

        bot.on('error', (error) => {
            Logger.log('Discord', `Error: ${error.message}\n${error.stack}`, LogLevel.Error);
        })

        bot.connect().then(r => {
            Logger.log('Discord', 'Connected to discord!', LogLevel.Success)
        });


        // bot.on('messageCreate', (message) => {
        //     if (message.author.bot || !message.content.startsWith(Config.Prefix)) return;

        //     let args = message.content.substr(1,message.content.length).split(' ');
        //     let command = args[0]
        //     args.splice(0,1);
        // })
    }

    private setupCommands() {
        bot.registerCommand("commands", (msg, args) => {
            this.handleCommandList(msg, args).then(r => this.logCommand('commands', msg, args)) }, {
            description: "Send the command list",
        });

        bot.registerCommand("loc", (msg, args) => {
            this.handleLocationCommand(msg, args).then(r => this.logCommand('location', msg, args)) }, {
            aliases: ['location'],
            description: "Get a players last location",
            cooldown: 5000,
            cooldownMessage: NewDiscord.getCooldownMessage,
            dmOnly: true
        });

        bot.registerCommand("profile", (msg, args) => {
            this.handleProfileCommand(msg, args).then(r => this.logCommand('profile', msg, args)) }, {
            aliases: ['player'],
            description: "Get a players last location",
            cooldown: 5000,
            cooldownMessage: NewDiscord.getCooldownMessage,
            dmOnly: true
        });

        bot.registerCommand("realm", (msg, args) => {
            this.handleRealmCommand(msg, args).then(r => this.logCommand('realm', msg, args)) }, {
            aliases: ['ip'],
            description: "Get a realm's info and IP",
            cooldown: 8000,
            cooldownMessage: NewDiscord.getCooldownMessage,
            dmOnly: true
        });

        bot.registerCommand("track", (msg, args) => {
            this.handleTrackCommand(msg, args).then(r => this.logCommand('track', msg, args)) }, {
            description: "Edit your tracklist",
            dmOnly: true
        });
    }

    private setupStaffCommands() {
        bot.registerCommand("restart", (msg, args) => {
            this.logCommand('restart', msg, args)
            NewDiscord.restart(msg);
            }, {
            description: "Restart the bot",
            hidden: true,
        });

        bot.registerCommand("sendtrackingcommands", (msg, args) => {
            this.logCommand('sendtrackingcommands', msg, args)
            NewDiscord.restart(msg);
        }, {
            description: "Send the tracking commands embed to the channel",
            hidden: true,
        });

        bot.registerCommand("sendrealmcommands", (msg, args) => {
            this.logCommand('sendrealmcommands', msg, args)
            NewDiscord.restart(msg);
        }, {
            description: "Send the tracking commands embed to the channel",
            hidden: true,
        });
    }

    /**
     * Send a simple text message reply to another message
     * @param message the message to reply to
     * @param content the text message to send
     */
    public async sendReply(message: Message, content: string) {
        await bot.createMessage(bot.getDMChannel(message.author.id), content).then(() => {
            this.logCommand('tracking', message);
        });
        return Promise.resolve();
    }

    /**
     * Log a message to the console then exit the node process to restart with PM2
     * @param message
     * @private
     */
    private static restart(message: Message) {
        Logger.log('Discord', `⚠ User **${message.author.username}** issued restart command.. restarting`, LogLevel.Error);
        process.exit(0);
    }

    /**
     * Handle when a Discord user sends a player location command
     * @param message
     * @param args
     * @private
     */
    private async handleLocationCommand(message: Message, args: string[]) {
        if (!args || args.length == 0) {
            await this.sendReply(message, "❌ Enter a user to get their last location: `!loc username`");
            return;
        }
        if (!NewDiscord.checkUsername(args[0])) {
            await this.sendReply(message, "❌ Enter a valid RotMG username");
            return;
        }
        let location = await this.players.getPlayerLocation(args[0].toLowerCase());
        if (!location) {
            await this.sendReply(message, "❌ Player has not been seen by the tracker yet");
            return;
        } else {
            let readable = parseLocation(location.location);
            let time = moment(location.time, 'x').fromNow();

            await this.sendReply(message, `Player \`${location.username}\` was last seen entering ${readable} in ${location.server} on ${location.class} ${time}`);
            return;
        }
    }

    /**
     * Handle when a Discord user sends a profile command
     * @param message
     * @param args
     * @private
     */
    private async handleProfileCommand(message: Message, args: string[]) {
        if (!args || args.length == 0) {
            await this.sendReply(message, "❌ Enter a user to get their profile: `!profile username`");
            return;
        }
        if (!NewDiscord.checkUsername(args[0])) {
            await this.sendReply(message, "❌ Enter a valid RotMG username");
            return;
        }
        let profile = this.players.getPlayerProfile(args[0].toLowerCase());
        if (!profile) {
            await this.sendReply(message, "❌ Player has not been seen by the tracker yet");
            return;
        } else {
            await this.embeds
        }
        return Promise.resolve(Message);
    }

    /**
     * Handle the !track command
     * @param message
     * @param args
     * @private
     */
    private async handleTrackCommand(message: Message, args: string[]) {
        if (!args || args.length < 1) {
            await this.sendReply(message, "❌ Enter a track command type: `add, remove, clear, toggle, list`");
            return;
        }
        switch (args[0]) {
            case "add":
                // add to tracklist
                break;
            case "remove":
                // remove from tracklist
                break;
            case "clear":
                // clear whole tracklist
                break;
            case "toggle":
                // toggle
                break;
            case "list":
                // get tracklist
        }
        return Promise.resolve();
    }

    /**
     * Handle when a user sends the !realm command
     * @param message
     * @param args
     * @private
     */
    private async handleRealmCommand(message: Message, args: string[]) {

    }

    /**
     * Handles the commands command and sends a message back to the author
     * @param message
     * @param args
     * @private
     */
    private async handleCommandList(message: Message, args: string[]) {

        return Promise.resolve(Message);
    }

    private async sendTrackingCommands() {

    }

    private async sendRealmCommands() {

    }

    private logCommand(type: string, message: Message, args?: string[]) {

    }

    /**
     * The message to send to a user when a command is on cooldown
     * @private
     */
    private static getCooldownMessage(): string {
        return "⚠ Command on cooldown, try in a few seconds"
    }

    /**
     * Check if a string matches a valid rotmg username
     * @param message
     * @private
     */
    private static checkUsername(message: string): boolean {
        let regex = new RegExp(/^[A-z]{1,10}/);
        return regex.test(message);
    }

    /**
     * Check if a string is alphanumeric from start to finish
     * @param message
     * @private
     */
    private static checkAlpha(message: string): boolean {
        let regex = new RegExp(/^[A-z0-9]+$/);
        return regex.test(message);
    }
}
