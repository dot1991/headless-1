/**
 * A list of players a discord user is tracking
 */
import {User} from "eris";
export interface TrackList {
    creator: User;
    tracklist: TrackListItem[]
    settings: TrackingSettings
 }

 /**
  * An ingame username and the time when the track expires
  */
 export interface TrackListItem {
    username: string
    created: number
 }

 /**
  * The settings for a discord user's tracking notifications
  */
 export interface TrackingSettings {
    enabled: Boolean
    realm: Boolean
    bazaar: Boolean
    vault: Boolean
 }

 /**
  * An object for a discord user who is tracking a player
  */
 export interface PlayerTracker {
    username: string
    userid: string
    created: number
 }