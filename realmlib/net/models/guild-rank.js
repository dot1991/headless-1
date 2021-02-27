"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseGuildRank = exports.GuildRank = void 0;
/**
 * The types of guild ranks mapped to their corresponding ID number
 */
var GuildRank;
(function (GuildRank) {
    GuildRank[GuildRank["NoRank"] = -1] = "NoRank";
    GuildRank[GuildRank["Initiate"] = 0] = "Initiate";
    GuildRank[GuildRank["Member"] = 10] = "Member";
    GuildRank[GuildRank["Officer"] = 20] = "Officer";
    GuildRank[GuildRank["Leader"] = 30] = "Leader";
    GuildRank[GuildRank["Founder"] = 40] = "Founder";
})(GuildRank = exports.GuildRank || (exports.GuildRank = {}));
/**
 * Return the readable rank name based from the rank ID
 * @param rank
 */
function parseGuildRank(rank) {
    switch (rank) {
        case GuildRank.Initiate: return "Initiate";
        case GuildRank.Member: return "Member";
        case GuildRank.Officer: return "Officer";
        case GuildRank.Leader: return "Leader";
        case GuildRank.Founder: return "Founder";
        default: return "Unknown";
    }
}
exports.parseGuildRank = parseGuildRank;
