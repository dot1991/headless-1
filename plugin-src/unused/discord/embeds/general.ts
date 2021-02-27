import {
    Prefix,
    Channels,
} from './../config.json';

import {CreateEmbed, HandleError} from './embed-functions';
import {Client, EmbedOptions, Message} from 'eris';
import {Client as Bot} from '../../../../headless';

export default class GeneralEmbeds {
    /**
     * Send the tracklist embed to the #tracking-commands channel or in reply to a message
     * @param client
     * @param message
     */
    public async sendTrackingCommands(client: Client, message?: Message) {
        let commands = {
            'loc **player**': "Get the last known location of a player",
            'profile **player**': "Show a player's profile",
            'gold **player**': "Get a player's gold count",
            'guild **guild name**': 'Show all of the players in a guild',
            'track add **player**': 'Add a player to your tracklist',
            'track stop **player**': 'Stop tracking a player',
            'track pause': 'Temporarily stop getting notifications',
            'track start': 'Start getting tracking notifications again',
            'track settings': 'Show and edit your tracking notification settings',
            'track clear': 'Clear your tracklist',
            'tracklist': 'Show all players in your tracklist',
        };

        let description = GeneralEmbeds.makeCommandList(commands);

        let opts: EmbedOptions = {
            author: {name: "Player tracking commands"},
            title: `Send all commands to the bot via PM!\n\n`,
            description: description
        };

        await client.createMessage(Channels.TrackCommands, {
            embed: CreateEmbed(opts),
        });
        return;
    }

    /**
     * Send the realm command list to the #realm-commands channel
     * @param client
     */
    public async sendRealmCommands(client: Client) {
        let commands = {
            'realm': "Get the IP and portal information of a realm",
            'realms **open**': "Get a list of all open realms",
            'realms **closed**': 'Get a list of all closed realms',
            'checkip **ip**': "Check if an IP is a credential stealer"
        };

        let description = GeneralEmbeds.makeCommandList(commands);

        let opts: EmbedOptions = {
            author: {name: "Realm info commands"},
            title: `Send all commands to the bot via PM!\n\n`,
            description: description
        };

        await client.createMessage(Channels.RealmCommands, {
            embed: CreateEmbed(opts),
        });
        return;
    }

    /**
     * Send the event tracking command list to the #event-commands channel
     * @param client
     */
    public async sendEventCommands(client: Client) {
        let commands = {};

        let description = GeneralEmbeds.makeCommandList(commands);

        let opts: EmbedOptions = {
            author: {name: "Event tracking commands"},
            title: `Send all commands to the bot via PM!\n\n`,
            description: description
        };

        await client.createMessage(Channels.RealmCommands, {
            embed: CreateEmbed(opts),
        });
        return;
    }

    public async sendBotStatus(client: Client, bots: Bot[]) {

    }

    /**
     * Send this embed to a user/channel when the bot hasn't fully started
     * @param client
     * @param message
     */
    public async sendStartupMessage(client: Client, message: Message) {
        let opts: EmbedOptions = {
            title: `Error\n\n`,
            description: "The bot is still starting up.. try again in 5 minutes"
        };
        let userChannel = await client.getDMChannel(message.author.id);

        await userChannel.createMessage({embed: CreateEmbed(opts)})
            .catch((x) => HandleError(client, x, message));

        return
    }

    /**
     * Send a notification to the staff logging channel when a realm bot connects
     * @param client
     * @param bot
     */
    public async sendBotConnection(client: Client, bot: Bot) {
        let opts: EmbedOptions = {
            author: {name: "✅ Bot connected!"},
            description: `Client \`${bot.alias}\` connected to ${bot.server.name}`,
        };
        await client.createMessage(Channels.StaffLogging, {
            embed: CreateEmbed(opts),
        });
        return;
    }

    /**
     * Send a notification to the staff logging channel when a realm bot disconnects
     * @param client
     * @param bot
     */
    public async sendBotDisconnection(client: Client, bot: Bot) {
        let opts: EmbedOptions = {
            author: {name: "❌ Bot disconnected!"},
            description: `Client \`${bot.alias}\` disconnected from ${bot.server.name}`,
        };
        await client.createMessage(Channels.StaffLogging, {
            embed: CreateEmbed(opts),
        });
        return;
    }

    /**
     * Create a discord color formatted command list from an array of commands
     * @param commands
     * @private
     */
    private static makeCommandList(commands: any) {
        let keys = Object.keys(commands);
        let list = "```diff\n";

        for (let i = 0; i < keys.length; i++) {
            let command = keys[i];
            let description = commands[i];

            list += `+ ${Prefix}${command}\n`;
            list += `\t${description}\n\n`;
        }
        list += "```";
        return list;
    }
}
