"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = require("../../realmlib/net");
const services_1 = require("../services");
/**
 * Processes the `data` and returns the resulting PlayerData object
 * @param data The data to process
 */
function processObject(data) {
    const playerData = processObjectStatus(data.status);
    playerData.class = data.objectType;
    return playerData;
}
exports.processObject = processObject;
/**
 * Processes the `data` and returns the result. If `currentData` is provided, it will be
 * used as a starting point for the returned `PlayerData`
 * @param data The data to process
 * @param currentData The existing `PlayerData`
 */
function processObjectStatus(data, currentData) {
    const playerData = processStatData(data.stats, currentData);
    playerData.worldPos = data.pos;
    playerData.objectId = data.objectId;
    return playerData;
}
exports.processObjectStatus = processObjectStatus;
/**
 * Process a list of stats and returns the result. If `currentData` is provided, it will be
 * used as a starting point for the returned `PlayerData`
 * @param stats The stats to process
 * @param currentData The existing `PlayerData`
 */
function processStatData(stats, currentData) {
    const playerData = currentData || {};
    if (!playerData.inventory) {
        playerData.inventory = [];
    }
    for (const stat of stats) {
        switch (stat.statType) {
            case net_1.StatType.NAME_STAT:
                playerData.name = stat.stringStatValue;
                continue;
            case net_1.StatType.LEVEL_STAT:
                playerData.level = stat.statValue;
                continue;
            case net_1.StatType.EXP_STAT:
                playerData.exp = stat.statValue;
                continue;
            case net_1.StatType.CURR_FAME_STAT:
                playerData.currentFame = stat.statValue;
                continue;
            case net_1.StatType.NUM_STARS_STAT:
                playerData.stars = stat.statValue;
                continue;
            case net_1.StatType.ACCOUNT_ID_STAT:
                playerData.accountId = stat.stringStatValue;
                continue;
            case net_1.StatType.FAME_STAT:
                playerData.accountFame = stat.statValue;
                continue;
            case net_1.StatType.CREDITS_STAT:
                playerData.gold = stat.statValue;
                continue;
            case net_1.StatType.MAX_HP_STAT:
                playerData.maxHP = stat.statValue;
                continue;
            case net_1.StatType.MAX_MP_STAT:
                playerData.maxMP = stat.statValue;
                continue;
            case net_1.StatType.HP_STAT:
                playerData.hp = stat.statValue;
                continue;
            case net_1.StatType.MP_STAT:
                playerData.mp = stat.statValue;
                continue;
            case net_1.StatType.ATTACK_STAT:
                playerData.atk = stat.statValue;
                continue;
            case net_1.StatType.ATTACK_BOOST_STAT:
                playerData.atkBoost = stat.statValue;
                continue;
            case net_1.StatType.DEFENSE_STAT:
                playerData.def = stat.statValue;
                continue;
            case net_1.StatType.DEFENSE_BOOST_STAT:
                playerData.defBoost = stat.statValue;
                continue;
            case net_1.StatType.SPEED_STAT:
                playerData.spd = stat.statValue;
                continue;
            case net_1.StatType.SPEED_BOOST_STAT:
                playerData.spdBoost = stat.statValue;
                continue;
            case net_1.StatType.DEXTERITY_STAT:
                playerData.dex = stat.statValue;
                continue;
            case net_1.StatType.DEXTERITY_BOOST_STAT:
                playerData.dexBoost = stat.statValue;
                continue;
            case net_1.StatType.VITALITY_STAT:
                playerData.vit = stat.statValue;
                continue;
            case net_1.StatType.VITALITY_BOOST_STAT:
                playerData.vitBoost = stat.statValue;
                continue;
            case net_1.StatType.CONDITION_STAT:
                playerData.condition = stat.statValue;
                continue;
            case net_1.StatType.WISDOM_STAT:
                playerData.wis = stat.statValue;
                continue;
            case net_1.StatType.WISDOM_BOOST_STAT:
                playerData.wisBoost = stat.statValue;
                continue;
            case net_1.StatType.HEALTH_POTION_STACK_STAT:
                playerData.hpPots = stat.statValue;
                continue;
            case net_1.StatType.MAGIC_POTION_STACK_STAT:
                playerData.mpPots = stat.statValue;
                continue;
            case net_1.StatType.HASBACKPACK_STAT:
                playerData.hasBackpack = stat.statValue === 1;
                continue;
            case net_1.StatType.NAME_CHOSEN_STAT:
                playerData.nameChosen = stat.statValue !== 0;
                continue;
            case net_1.StatType.GUILD_NAME_STAT:
                playerData.guildName = stat.stringStatValue;
                continue;
            case net_1.StatType.GUILD_RANK_STAT:
                playerData.guildRank = stat.statValue;
                continue;
            case net_1.StatType.SIZE_STAT:
                playerData.size = stat.statValue;
                continue;
            case net_1.StatType.NEXT_LEVEL_EXP_STAT:
                playerData.nextLevelExp = stat.statValue;
                continue;
            case net_1.StatType.TEX1_STAT:
                playerData.clothingDye = stat.statValue;
                continue;
            case net_1.StatType.TEX2_STAT:
                playerData.accessoryDye = stat.statValue;
                continue;
            case net_1.StatType.MAX_HP_BOOST_STAT:
                playerData.maxHPBoost = stat.statValue;
                continue;
            case net_1.StatType.MAX_MP_BOOST_STAT:
                playerData.maxMPBoost = stat.statValue;
                continue;
            case net_1.StatType.NEXT_CLASS_QUEST_FAME_STAT:
                playerData.nextClassQuestFame = stat.statValue;
                continue;
            case net_1.StatType.LEGENDARY_RANK_STAT:
                playerData.legendaryRank = stat.statValue;
                continue;
            case net_1.StatType.XP_BOOSTED_STAT:
                playerData.xpBoosted = stat.statValue === 1;
                continue;
            case net_1.StatType.XP_TIMER_STAT:
                playerData.xpBoostTime = stat.statValue;
                continue;
            case net_1.StatType.TEXTURE_STAT:
                playerData.texture = stat.statValue;
                continue;
            case net_1.StatType.FORTUNE_TOKEN_STAT:
                playerData.fortuneTokens = stat.statValue;
                continue;
            case net_1.StatType.PROJECTILE_SPEED_MULT:
                playerData.projSpeedMult = stat.statValue / 1000;
                continue;
            case net_1.StatType.PROJECTILE_LIFE_MULT:
                playerData.projLifeMult = stat.statValue / 1000;
                continue;
            case net_1.StatType.EXALTED_HP:
                playerData.exaltedHP = stat.statValue;
                continue;
            case net_1.StatType.EXALTED_MP:
                playerData.exaltedMP = stat.statValue;
                continue;
            case net_1.StatType.EXALTED_ATT:
                playerData.exaltedAtt = stat.statValue;
                continue;
            case net_1.StatType.EXALTED_DEF:
                playerData.exaltedDef = stat.statValue;
                continue;
            case net_1.StatType.EXALTED_SPEED:
                playerData.exaltedSpd = stat.statValue;
                continue;
            case net_1.StatType.EXALTED_DEX:
                playerData.exaltedDex = stat.statValue;
                continue;
            case net_1.StatType.EXALTED_VIT:
                playerData.exaltedVit = stat.statValue;
                continue;
            case net_1.StatType.EXALTED_WIS:
                playerData.exaltedWis = stat.statValue;
                continue;
            case net_1.StatType.POTION_ONE_TYPE:
                playerData.potionOneType = stat.statValue;
                continue;
            case net_1.StatType.POTION_TWO_TYPE:
                playerData.potionOneType = stat.statValue;
                continue;
            case net_1.StatType.POTION_THREE_TYPE:
                playerData.potionOneType = stat.statValue;
                continue;
            case net_1.StatType.POTION_BELT:
                playerData.potionBelt = (stat.statValue == 1);
                continue;
            case net_1.StatType.FORGEFIRE:
                playerData.forgefire = stat.statValue;
                continue;
            default:
                if (stat.statType >= net_1.StatType.INVENTORY_0_STAT && stat.statType <= net_1.StatType.INVENTORY_11_STAT) {
                    playerData.inventory[stat.statType - 8] = stat.statValue;
                }
                else if (stat.statType >= net_1.StatType.BACKPACK_0_STAT && stat.statType <= net_1.StatType.BACKPACK_7_STAT) {
                    playerData.inventory[stat.statType - 59] = stat.statValue;
                }
                else {
                    //services_1.Logger.log('StatData', `Unhandled StatType ${stat.statType} received, value: ${stat.statValue} (extra byte: ${stat.magicByte})`);
                }
        }
    }
    return playerData;
}
exports.processStatData = processStatData;
