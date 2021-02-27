import {PortalResponse} from '../../models/general'
import {Channels} from '../config.json'

export const alphaRegex = /^[A-z]+$/g
export const numericRegex = /^[0-9]+$/g
export const alphanumericRegex = /^[A-z0-9]+$/g
export const usernameRegex = /^[A-z]{2-10}$/g

/**
 * valid default server names
 */
export let serverList: Array<string> = [
    "uswest4", "uswest3", "uswest2", "uswest", "ussouthwest", "ussouth3", "ussouth2", "ussouth",
    "usnorthwest", "usmidwest2", "usmidwest", "useast4", "useast3", "useast2", "useast",
    "euwest2", "euwest", "eusouthwest", "eusouth", "eunorth2", "eunorth", "eueast2", "eueast",
    "australia", "asiasoutheast", "asiaeast"
]

/**
 * valid default realm names
 */
export const realmNames: string[] = [
    "pirate", "deathmage", "spectre", "titan", "gorgon",
    "kraken", "satyr", "drake", "chimera", "dragon", "wyrm", "hydra", "leviathan", "minotaur",
    "mummy", "reaper", "phoenix", "giant", "unicorn", "harpy", "gargoyle", "snake", "cube", "goblin",
    "hobbit", "skeleton", "scorpion", "bat", "ghost", "slime", "lich", "orc", "imp", "spider", "demon",
    "blob", "golem", "sprite", "flayer", "ogre", "djinn", "cyclops", "beholder", "medusa"
]

/**
 * return the proper server name from the abbreviation
 * @param server the abbreviation of the server name
 */
export function parseServer(server: string): string {
    switch (server) {
        case 'usw4':
            return "uswest4";
        case 'usw3':
            return "uswest3";
        case 'usw2':
            return "uswest2";
        case 'usw':
            return "uswest";
        case 'ussw':
            return "ussouthwest";
        case 'uss3':
            return "ussouth3";
        case 'uss2':
            return "ussouth2";
        case 'uss':
            return "ussouth";
        case 'usnw':
            return "usnorthwest";
        case 'usmw2':
            return "usmidwest2";
        case 'usmw':
            return "usmidwest";
        case 'use4':
            return "useast4";
        case 'use3':
            return "useast3";
        case 'use2':
            return "useast2";
        case 'use':
            return "useast";
        case 'euw2':
            return "euwest2";
        case 'euw':
            return "euwest";
        case 'eusw':
            return "eusouthwest";
        case 'eus':
            return "eusouth";
        case 'eun2':
            return "eunorth2";
        case 'eun':
            return "eunorth";
        case 'eue2':
            return "eueast2";
        case 'eue':
            return "eueast";
        case 'aus':
            return "australia";
        case 'ase':
            return "asiasoutheast";
        case 'ae':
            return "asiaeast"
        default:
            return null;
    }
}

/**
 * return the class name from the class ID
 * @param classId the class ID
 */
export function parseClass(classId: number): string {
    switch (classId) {
        case 768:
            return 'Rogue';
        case 775:
            return 'Archer';
        case 782:
            return 'Wizard';
        case 784:
            return 'Priest';
        case 797:
            return 'Warrior';
        case 798:
            return 'Knight';
        case 799:
            return 'Paladin';
        case 800:
            return 'Assassin';
        case 801:
            return 'Necromancer';
        case 802:
            return 'Huntress';
        case 803:
            return 'Mystic';
        case 804:
            return 'Trickster';
        case 805:
            return 'Sorcerer';
        case 806:
            return 'Ninja';
        case 785:
            return 'Samurai';
        case 796:
            return 'Bard';
        default:
            return 'Unknown';
    }
}

/**
 * return the guild rank name based on the ID
 * @param rank the guild rank ID
 */
export function parseGuildRank(rank: number): string {
    switch (rank) {
        case 0:
            return 'Initiate';
        case 10:
            return 'Member';
        case 20:
            return 'Officer';
        case 30:
            return 'Leader';
        case 40:
            return 'Founder';
        default:
            return 'Unknown';
    }
}

/**
 * Take a number and add commas to increase readability
 * @param number decimal or integer
 */
export function parseNumber(number: number): string {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Enum for returning human readable discord server names and their channel ID
 * @param name the name of the discord server
 */
export function parseDiscordServer(name: string): { name: string, channel: string } {
    switch (name) {
        case 'dungeoneer':
            return {
                name: 'Dungeoneer',
                channel: Channels.Dungeoneer
            };
        case 'sanctuary':
            return {
                name: 'Oryx Sanctuary',
                channel: Channels.OryxSanctuary
            };
        case 'pubhalls':
            return {
                name: 'Pub Halls',
                channel: Channels.PubHalls
            };
        case 'shatters':
            return {
                name: 'Shatters',
                channel: Channels.Shatters
            };
        case 'fungal':
            return {
                name: 'Fungal Cavern',
                channel: Channels.Fungal
            };
        case 'std':
            return {
                name: 'Space Travel Dungeons',
                channel: Channels.SpaceTravel
            };
        case 'null':
            return {
                name: 'Null',
                channel: Channels.Null
            };
        case 'exalted':
            return {
                name: 'Exalted',
                channel: Channels.Exalted
            };
        case 'o3chads':
            return {
                name: 'O3 Chads',
                channel: Channels.OryxChads
            };
        case 'sbc':
            return {
                name: 'SBC',
                channel: Channels.SBC
            };
        case 'pestcontrol':
            return {
                name: 'Pest Control',
                channel: Channels.PestControl
            };
        case 'whitegarden':
            return {
                name: 'White Garden',
                channel: Channels.WhiteGarden
            };
    }
}

/**
 * convert a computer-friendly location into a human-friendly location
 */
export function parseLocation(loc: string): string {
    switch (loc) {
        case 'left':
            return 'the left bazaar'
        case 'right':
            return 'the right bazaar'
        case 'ghall':
            return 'their guild hall'
        case 'vault':
            return 'their vault'
        case 'petyard':
            return 'their pet yard'
        case 'tinkerer':
            return 'the tinkerer'
        case 'realm':
            return 'a realm'
        case 'unknown':
            return 'an unknown area'
        case 'nexus':
            return 'the nexus'
        default:
            return 'the nexus'
    }
}

/**
 * Return the discord embed and color for a certain dungeon
 *
 * @param dungeon the name of the dungeon
 */
export function getPortalData(dungeon: string): PortalResponse {
    switch (dungeon) {
        case 'Pirate Cave':
            return {
                color: "#734722",
                image: "https://static.drips.pw/rotmg/wiki/Environment/Portals/Pirate%20Cave%20Portal.png",
            }
        case 'Forest Maze':
            return {
                color: "#497000",
                image: "https://static.drips.pw/rotmg/wiki/Environment/Portals/Forest%20Maze%20Portal.png",
            }
        case 'Spider Den':
            return {
                color: "#571300",
                image: "https://static.drips.pw/rotmg/wiki/Environment/Portals/Spider%20Den%20Portal.png",
            }
        case 'Snake Pit':
            return {
                color: "#1AAF44",
                image: "https://i.imgur.com/yDsmuGa.gif",
            }
        case 'Forbidden Jungle':
            return {
                color: "#9E9E9E",
                image: "https://static.drips.pw/rotmg/wiki/Environment/Portals/Forbidden%20Jungle%20Portal.png",
            }
        case 'The Hive':
            return {
                color: "#F3BB3A",
                image: "https://static.drips.pw/rotmg/wiki/Environment/Portals/The%20Hive%20Portal.png",
            }
        case 'Magic Woods':
            return {
                color: "#895929",
                image: "https://i.imgur.com/mvUTUNo.png",
            }
        case 'Sprite World':
            return {
                color: "#959595",
                image: "https://static.drips.pw/rotmg/wiki/Environment/Portals/Glowing%20Portal.png",
            }
        case 'Candyland Hunting Grounds':
            return {
                color: "#EF6363",
                image: "https://static.drips.pw/rotmg/wiki/Environment/Portals/Candyland%20Portal.png",
            }
        case 'Cave of a Thousand Treasures':
            return {
                color: "#74381B",
                image: "https://static.drips.pw/rotmg/wiki/Environment/Portals/Treasure%20Cave%20Portal.png",
            }
        case 'Undead Lair':
            return {
                color: "#737373",
                image: "https://i.imgur.com/gQ5QqQr.gif",
            }
        case 'Abyss of Demons':
            return {
                color: "#B50915",
                image: "https://static.drips.pw/rotmg/wiki/Environment/Portals/Abyss%20of%20Demons%20Portal.png",
            }
        case 'Manor of the Immortals':
            return {
                color: "#84618E",
                image: "https://static.drips.pw/rotmg/wiki/Environment/Portals/Manor%20of%20the%20Immortals%20Portal.png",
            }
        case 'Puppet Master\'s Theatre':
            return {
                color: "#760000",
                image: "https://i.imgur.com/2JZNslO.png",
            }
        case 'Toxic Sewers':
            return {
                color: "#59695C",
                image: "https://static.drips.pw/rotmg/wiki/Environment/Portals/Toxic%20Sewers%20Portal.png",
            }
        case 'Cursed Library':
            return {
                color: "#363843",
                image: "https://i.imgur.com/0M9yA5f.gif",
            }
        case 'Haunted Cemetery':
            return {
                color: "#279366",
                image: "https://i.imgur.com/WtTKp9k.gif",
            }
        case 'The Machine':
            return {
                color: "#22B672",
                image: "https://i.imgur.com/0PyfYHr.png",
            }
        case 'Mad Lab':
            return {
                color: "#32307B",
                image: "https://i.imgur.com/Bv01fV9.gif",
            }
        case 'Parasite Chambers':
            return {
                color: "#3A3A4C",
                image: "https://i.imgur.com/hcRb6kp.gif",
            }
        case 'Beachzone':
            return {
                color: "#F4A32E",
                image: "https://static.drips.pw/rotmg/wiki/Environment/Portals/Beachzone%20Portal.png",
            }
        case 'Davy Jones\' Locker':
            return {
                color: "#2E2E5E",
                image: "https://i.imgur.com/DSPoWQP.gif",
            }
        case 'Mountain Temple':
            return {
                color: "#681E14",
                image: "https://i.imgur.com/SY0Jtnp.png",
            }
        case 'Lair of Draconis':
            return {
                color: "#EDD900",
                image: "https://static.drips.pw/rotmg/wiki/Environment/Portals/Consolation%20of%20Draconis%20Portal.png",
            }
        case 'Deadwater Docks':
            return {
                color: "#734722",
                image: "https://i.imgur.com/ipvUwng.png",
            }
        case 'Woodland Labyrinth':
            return {
                color: "#527707",
                image: "https://i.imgur.com/2SV1B4n.png",
            }
        case 'The Crawling Depths':
            return {
                color: "#511B1B",
                image: "https://i.imgur.com/5uU3jvb.png",
            }
        case 'Ocean Trench':
            return {
                color: "#7CAFD6",
                image: "https://static.drips.pw/rotmg/wiki/Environment/Portals/Ocean%20Trench%20Portal.png",
            }
        case 'Ice Cave':
            return {
                color: "#0088E9",
                image: "https://static.drips.pw/rotmg/wiki/Environment/Portals/Ice%20Cave%20Portal.png",
            }
        case 'Tomb of the Ancients':
            return {
                color: "#F7D46B",
                image: "https://static.drips.pw/rotmg/wiki/Environment/Portals/Tomb%20of%20the%20Ancients%20Portal.png",
            }
        case 'Fungal Cavern':
            return {
                color: "#7488AD",
                image: "https://i.imgur.com/CLzxdEM.png",
            }
        case 'Crystal Cavern':
            return {
                color: "#E2E5FE",
                image: "https://i.imgur.com/BHwk26f.png",
            }
        case 'The Nest':
            return {
                color: "#FF9B18",
                image: "https://i.imgur.com/WQ95Y0j.png",
            }
        case 'The Shatters':
            return {
                color: "#767676",
                image: "https://static.drips.pw/rotmg/wiki/Environment/Portals/The%20Shatters.png",
            }
        case 'Lost Halls':
            return {
                color: "#D9E2E2",
                image: "https://i.imgur.com/uhDj0M5.png",
            }
        case 'Lair of Shaitan':
            return {
                color: "#F65E00",
                image: "https://static.drips.pw/rotmg/wiki/Environment/Portals/Lair%20of%20Shaitan%20Portal.png",
            }
        case 'Puppet Master\'s Encore':
            return {
                color: "#5D0809",
                image: "https://static.drips.pw/rotmg/wiki/Environment/Portals/Puppet%20Encore%20Portal.png",
            }
        case 'Cnidarian Reef':
            return {
                color: "#FFBC7A",
                image: "https://i.imgur.com/qjd04By.png",
            }
        case 'Secluded Thicket':
            return {
                color: "#463D6A",
                image: "https://i.imgur.com/8vEAT8t.png",
            }
        case 'Heroic Undead Lair':
            return {
                color: "#FFC519",
                image: "https://i.imgur.com/SVqmTWH.gif",
            }
        case 'Heroic Abyss of Demons':
            return {
                color: "#FFC519",
                image: "https://i.imgur.com/zz6D2lz.png",
            }
        case 'Battle for the Nexus':
            return {
                color: "#EDD558",
                image: "https://static.drips.pw/rotmg/wiki/Environment/Portals/Battle%20Nexus%20Portal.png",
            }
        case 'Belladonna\'s Garden':
            return {
                color: "#1F991F",
                image: "https://i.imgur.com/VTXGPSy.png",
            }
        case 'Ice Tomb':
            return {
                color: "#C9FCF2",
                image: "https://static.drips.pw/rotmg/wiki/Environment/Portals/Ice%20Tomb%20Portal.png",
            }
        case 'Santa\'s Workshop':
            return {
                color: "#683800",
                image: "https://i.imgur.com/z7EMGP1.gif",
            }
        case 'Mad God Mayhem':
            return {
                color: "#4D4D4D",
                image: "https://i.imgur.com/jnHUonE.gif",
            }
        case 'Forax':
            return {
                color: "#2DA14C",
                image: "https://i.imgur.com/UUpIie4.gif",
            }
        case 'Katalund':
            return {
                color: "#CFA900",
                image: "https://i.imgur.com/ZznbfNe.gif",
            }
        case 'Malogia':
            return {
                color: "#963C48",
                image: "https://i.imgur.com/mDsZ0gq.gif",
            }
        case 'Untaris':
            return {
                color: "#4C68BA",
                image: "https://i.imgur.com/9mHv0hw.gif",
            }
        case 'Ancient Ruins':
            return {
                color: "#A69660",
                image: "https://i.imgur.com/d7MSK2x.png"
            }
        case 'High Tech Terror':
            return {
                color: "#1095FF",
                image: "https://i.imgur.com/h7xPlrS.gif"
            }
        default:
            return {
                color: "#734722",
                image: "https://static.drips.pw/rotmg/wiki/Environment/Portals/Pirate%20Cave%20Portal.png",
            }
    }
}