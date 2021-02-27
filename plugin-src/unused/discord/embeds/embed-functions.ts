import {EmbedColor, EmbedFooterUrl, EmbedFooterName, Channels} from '../config.json';

import {EmbedOptions, EmbedField, Client, Message} from 'eris';

import {RealmPortal} from "../../models";

import moment = require('moment');

/**
 * Easy embed creator that uses default values and optional pass-ins
 * @param opts
 */
export function CreateEmbed(opts?: EmbedOptions): EmbedOptions {
    let embed: EmbedOptions = {
        color: EmbedColor,
        description: '',
        footer: {
            text: EmbedFooterName,
            icon_url: EmbedFooterUrl,
        },
        timestamp: '',
    };
    if (opts) {
        if (opts.title) embed.title = opts.title;
        if (opts.description) embed.description = opts.description;
        if (opts.author) {
            if (opts.author.name) embed.author = opts.author
            embed.author.icon_url = EmbedFooterUrl
        }
        if (opts.image) embed.image = opts.image;
        if (opts.fields) {
            for (let i = 0; i < opts.fields.length; i++) {
                embed.fields.push(opts.fields[i]);
            }
        }
    }
    return embed;
}

export function CreateCommandList(commands: { [name: string]: string }) {
    let commandst = {
        "loc `playername`": "get a player's last location",
        "profile": "get a player's profile",
        "characters": "show all a player's seen characters",
        "track add `playername`": "add a player to your tracklist",
        "track del `playername`": "remove a player from your tracklist",
        "track clear": "clear your tracklist",
        "track toggle": "start or stop receiving tracking notifications",
        "tracklist": "show all players in your tracklist"
    }


}

/**
 * Handle the logging for a failed user command
 * @param client
 * @param realm
 * @param message
 * @param error
 */
export async function HandleError(
    client: Client,
    error: Error,
    message?: Message,
    realm?: RealmPortal,
) {
    if (message) {
        let errorMessage =
            `\`\`\`\nError trying to send a message to: \`${message.author.username}\`\n\n` +
            `Message: \`${message.content}\`\n` +
            `Error: \`${error.message}\n` +
            `Stack: \`${error.stack}\`\`\`\``;

        let options: EmbedOptions = {
            author: {name: 'Command handling error'},
            description: errorMessage,
        };

        await client.createMessage(Channels.StaffLogging, {
            embed: CreateEmbed(options),
        });
        return;
    } else if (realm) {
        let errorMessage =
            `\`\`\`\nError trying to send realm lookup message to \`${message.author.username}\`\n\n` +
            `Message: \`${message.content}\`\n` +
            `Realm: \`${realm.server} ${realm.name}\`\n` +
            `Error: \`${error.message}\n` +
            `Stack: \`${error.stack}\`\`\`\``;

        let options: EmbedOptions = {
            author: {name: 'Realm event error'},
            description: errorMessage,
        };

        await client.createMessage(Channels.StaffLogging, {
            embed: CreateEmbed(options),
        });
        return;
    } else {
        let errorMessage =
            `\`\`\`\nError name: \`${error.name}\`\n\n` +
            `Error: \`${error.message}\`\n` +
            `Stack: \`${error.stack}\`\`\`\``;

        let options: EmbedOptions = {
            author: {name: 'General discord error'},
            description: errorMessage,
        };

        await client.createMessage(Channels.StaffLogging, {
            embed: CreateEmbed(options),
        });
        return;
    }
}

/**
 * Take a unix time and return the time difference between now
 * @param time
 */
export function GetTime(time: number): string {
    return moment(time, 'x').fromNow();
}

/**
 * Each ingame class type mapped to their name
 */
export const ClassEnum = {
    768: 'Rogue', 775: 'Archer', 782: 'Wizard', 784: 'Priest', 797: 'Warrior', 798: 'Knight',
    799: 'Paladin', 800: 'Assassin', 801: 'Necromancer', 802: 'Huntress', 803: 'Mystic',
    804: 'Trickster', 805: 'Sorcerer', 806: 'Ninja', 785: 'Samurai', 796: 'Bard',
};

/**
 * Return the name of the class from its type
 * @param type
 */
export function ParseClass(type: number): String {
    if (!ClassEnum[type]) return 'Unknown';
    return ClassEnum[type];
}
