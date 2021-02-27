/**
 * Contains information about a players last known location
 */
export interface PlayerLocation {
    username: string
    server: string
    location: string
    class: string
    charfame: number
    time: number
 }
 
 /**
  * The profile of a player stored in the cache
  */
 export interface PlayerProfile {
    username: string
    account_id: string
    first_spotted: number
    last_spotted: number
    times_spotted: number
    account_fame: number
    account_gold: number
    guild_name: string
    guild_rank: string
 }

 export interface RealmEyeProfile {

 }