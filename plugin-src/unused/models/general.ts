
/**
 * A setting for any client mapped by GUID
 * @param guid: the GUID of the client
 * @param T: the type of variable to store
 */
export interface ClientSetting<T> {
   [guid: string]: T;
}

/**
 * Contains information about a possible discord raid
 *
 * @param discord_server: the discord server conducting the raid
 * @param location: the location of the raid
 * @param time: the time the raid was first spotted in unix format
 * @param players: an array of staff members spotted in the raid
 */
export interface Raid {
   discord_server: string
   location: string
   time: number
   players?: string[]
}

/**
 * The image and color to send in an embed when a dungeon portal is spotted
 *
 * @param color: the hex color to set the discord embed to
 * @param image: the image of the dungeon portal to use in the embed
 */
export interface PortalResponse {
   color: string
   image: string
}
