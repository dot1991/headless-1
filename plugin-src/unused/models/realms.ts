import { WorldPosData } from '../../../headless'

/**
 * Contains information on a realm portal in the nexus
 * @param server: server of the realm portal
 * @param name: the name of the realm portal
 * @param players: the amount of players in the realm
 * @param queue: the queue to enter the realm portal
 * @param pos: the x,y coords of the portal
 * @param id the object ID of the portal
 * @param time: the time the realm data was last updated
 * @param closed: whether the realm is open or closed
 */
export interface RealmPortal {
   server: string;
   name: string;
   players: number;
   queue: number;
   position: WorldPosData;
   id: number;
   time: number;
   hostname?: string;
   closed?: boolean;
}

/**
 * The image and color to send in embeds when an event is spotted
 *
 * @param type: closed or event
 * @param color: the hex color to set the discord embed to
 * @param channel: the ID of the discord channel to send the response to
 * @param name: the name of the event (only set for type: event)
 * @param image: the image to use in the discord embed
 */
export interface EventResponse {
    type: string
    color: string
    channel?: string
    name?: string
    image?: string
 }
