import { Channels } from './../config.json';
import {CreateEmbed, HandleError, GetTime} from './embed-functions';

import { Client, EmbedOptions, Message } from 'eris';
import { PlayerLocation, PlayerProfile, TrackList } from '../../models';
import { parseLocation } from "../parsers";
import * as Config  from "../config.json";

import moment from 'moment';
import { Logger, LogLevel } from "../../../../headless";


export async function sendTrackingCommandList(client: Client) {

	let commands = {
		"loc `playername`": "get a player's last location",
		"profile": "get a player's profile",
		"characters": "show all a player's seen characters",
		"track add `playername`": "add a player to your tracklist",
		"track del `playername`": "remove a player from your tracklist",
		"track clear": "clear your tracklist",
		"track toggle": "start or stop receiving tracking notifications",
		"tracklist": "show all players in your tracklist"
	}

	let message: EmbedOptions = {
	};

	await client.createMessage(Channels.RealmOpen, {
		embed: CreateEmbed(message),
	});
	return;
}

/**
 * Sent in reply to when a user requests their tracklist
 * @param client
 * @param message the message to reply to
 * @param tracklist the user's tracklist
 */
export async function sendUserTracklist(client: Client, message: Message, tracklist: TrackList) {
	let channel = await client.getDMChannel(message.author.id);

	if (!channel) {
		Logger.log('Discord', `Could not get a DM channel for user ${message.author.username} = ${message.author.id}`, LogLevel.Error);

		await channel.createMessage("❌ You are not tracking any users");
		return;
	}
	else if (!tracklist || !tracklist.tracklist) {
		Logger.log('Discord', `Tracklist not set or null for: ${tracklist} : ${tracklist.tracklist} - for user ${message.author.username} = ${message.author.id}`, LogLevel.Error);

		await channel.createMessage("❌ You are not tracking any users");
		return;
	}
	else if (tracklist.tracklist.length == 0) {
		await channel.createMessage("❌ You are not tracking any users");
		return
	} else {
		let trackCount = tracklist.tracklist.length;
		let description = '```\n'
		for (let i = 0; i < trackCount - 1; i++) {
			description += `${tracklist.tracklist[i].username}\n`
		}
		description += '```'
		let embedOptions: EmbedOptions = {
			author: { name: 'Your Tracklist' , icon_url: Config.EmbedFooterUrl},
			description: description,
			footer: { text: Config.EmbedFooterName, icon_url: Config.EmbedFooterUrl }
		};

		await channel.createMessage("", );
		return
	}
}

export async function sendLastPlayerLocation(client: Client, data: PlayerLocation, userId: string) {
	let location = parseLocation(data.location);
	let time = moment(data.time, 'x').fromNow();

	let description = `Player \`${data.username}\` was last seen entering ${location} in **${data.server}** ${time}`;
	let userChannel = await client.getDMChannel(userId);
	if (!userChannel) {
		Logger.log('Discord', `Failed to send tracking embed to user ${userId} for player ${data.username}`, LogLevel.Error);
		return;
	}
	await userChannel
	.createMessage(description)
	.catch((x) => HandleError(client, x));
}

