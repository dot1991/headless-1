"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildRank = void 0;
/**
 * The values corresponding to guild ranks as they are received over the network.
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
