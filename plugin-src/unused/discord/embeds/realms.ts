import {Channels} from './../config.json';
import {CreateEmbed, HandleError, GetTime} from './embed-functions';

import {Client, EmbedField, EmbedOptions, Message} from 'eris';
import {RealmPortal} from '../../models';

export default class RealmEmbeds {
    /**
     * Send a channel notification when a new realm opens
     * @param client
     * @param realm
     */
    public async callRealmOpen(client: Client, realm: RealmPortal) {
        let fields: EmbedField[] = [
            {name: 'Players:', value: RealmEmbeds.getPlayersMessage(realm)},
            {name: 'IP:', value: RealmEmbeds.getHostnameMessage(realm)},
        ];

        let message: EmbedOptions = {
            author: {name: 'Realm opened'},
            description: `**${realm.server} ${realm.name}**\n\n`,
            fields: fields,
        };

        await client.createMessage(Channels.RealmOpen, {
            embed: CreateEmbed(message),
        });
        return;
    }

    /**
     * Send a channel notification when a realm closes ingame
     * @param client
     * @param realm
     */
    public async callRealmClose(client: Client, realm: RealmPortal) {
        let fields: EmbedField[] = [
            {name: 'Players:', value: RealmEmbeds.getPlayersMessage(realm)},
            {
                name: 'IP:',
                value: RealmEmbeds.getHostnameMessage(
                    realm,
                    'Bot did not connect to the realm'
                ),
            },
        ];

        let message: EmbedOptions = {
            author: {name: 'Realm closed!'},
            description: `**${realm.server} ${realm.name}**\n\n`,
            fields: fields,
        };

        await client
            .createMessage(Channels.RealmClose, {
                embed: CreateEmbed(message),
            })
            .catch((x) => HandleError(client, x, null, realm));
        return;
    }

    /**
     * Send a channel notification when a surge of players enter a realm in a short time
     * @param client
     * @param realm
     * @param playerCount
     */
    public async callRealmSurge(
        client: Client,
        realm: RealmPortal,
        playerCount: number
    ) {
        let fields: EmbedField[] = [
            {name: 'Players:', value: RealmEmbeds.getPlayersMessage(realm)},
            {
                name: 'IP:',
                value: RealmEmbeds.getHostnameMessage(
                    realm,
                    'Bot did not connect to the realm'
                ),
            },
        ];

        let message: EmbedOptions = {
            author: {name: 'Player surge detected!'},
            description: `${playerCount} were spotted entering \`${realm.server} ${realm.name} in 30 seconds\`\n\n`,
            fields: fields,
        };

        await client
            .createMessage(Channels.RealmSurge, {
                embed: CreateEmbed(message),
            })
            .catch((x) => HandleError(client, x, null, realm));
        return;
    }

    /**
     * The embed sent when a user sends the !realm or !ip command
     * @param client
     * @param message
     * @param realm
     */
    public async sendRealmReply(
        client: Client,
        message: Message,
        realm: RealmPortal
    ) {
        let userChannel = await client.getDMChannel(message.author.id);

        let fields: EmbedField[] = [
            {name: 'Realm:', value: `${realm.server} ${realm.name}`},
            {name: 'Players:', value: RealmEmbeds.getPlayersMessage(realm)},
            {
                name: 'IP:',
                value: RealmEmbeds.getHostnameMessage(realm),
            },
            {
                name: 'Retreived',
                value: GetTime(realm.time)
            }
        ];

        await userChannel
            .createMessage({embed: {fields: fields}})
            .catch((x) => HandleError(client, x, message, realm));
    }

    /**
     * Check if a portal has a hostname and return a useable command or error message
     * @param portal
     * @param message
     */
    private static getHostnameMessage(
        portal: RealmPortal,
        message: string = 'The bot has not connected to the realm yet'
    ): string {
        if (!portal.hostname) return message;

        return `\`/goto ${portal.hostname}\``;
    }

    /**
     * Turn a queue count number into a readable value
     * @param portal
     */
    private static getPlayersMessage(portal: RealmPortal): string {
        return portal.players == 8 && portal.queue > 0
            ? `${portal.players}/85 - no queue`
            : `${portal.players}/85 - ${portal.queue} in queue`;
    }
}
