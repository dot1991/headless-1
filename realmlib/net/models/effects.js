"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisualEffect = exports.ConditionEffectBits = void 0;
/**
 * The bitmask value for each condition effect
 */
var ConditionEffectBits;
(function (ConditionEffectBits) {
    ConditionEffectBits[ConditionEffectBits["DEAD"] = 16] = "DEAD";
    ConditionEffectBits[ConditionEffectBits["QUIET"] = 32] = "QUIET";
    ConditionEffectBits[ConditionEffectBits["WEAK"] = 64] = "WEAK";
    ConditionEffectBits[ConditionEffectBits["SLOWED"] = 128] = "SLOWED";
    ConditionEffectBits[ConditionEffectBits["SICK"] = 16] = "SICK";
    ConditionEffectBits[ConditionEffectBits["DAZED"] = 32] = "DAZED";
    ConditionEffectBits[ConditionEffectBits["STUNNED"] = 64] = "STUNNED";
    ConditionEffectBits[ConditionEffectBits["BLIND"] = 128] = "BLIND";
    ConditionEffectBits[ConditionEffectBits["HALLUCINATING"] = 256] = "HALLUCINATING";
    ConditionEffectBits[ConditionEffectBits["DRUNK"] = 512] = "DRUNK";
    ConditionEffectBits[ConditionEffectBits["CONFUSED"] = 1024] = "CONFUSED";
    ConditionEffectBits[ConditionEffectBits["STUN_IMMUNE"] = 2048] = "STUN_IMMUNE";
    ConditionEffectBits[ConditionEffectBits["INVISIBLE"] = 4096] = "INVISIBLE";
    ConditionEffectBits[ConditionEffectBits["PARALYZED"] = 8192] = "PARALYZED";
    ConditionEffectBits[ConditionEffectBits["SPEEDY"] = 16384] = "SPEEDY";
    ConditionEffectBits[ConditionEffectBits["BLEEDING"] = 32768] = "BLEEDING";
    ConditionEffectBits[ConditionEffectBits["ARMOR_BROKEN_IMMUNE"] = 65536] = "ARMOR_BROKEN_IMMUNE";
    ConditionEffectBits[ConditionEffectBits["HEALING"] = 131072] = "HEALING";
    ConditionEffectBits[ConditionEffectBits["DAMAGING"] = 262144] = "DAMAGING";
    ConditionEffectBits[ConditionEffectBits["BERSERK"] = 524288] = "BERSERK";
    ConditionEffectBits[ConditionEffectBits["PAUSED"] = 1048576] = "PAUSED";
    ConditionEffectBits[ConditionEffectBits["STASIS"] = 2097152] = "STASIS";
    ConditionEffectBits[ConditionEffectBits["STASIS_IMMUNE"] = 4194304] = "STASIS_IMMUNE";
    ConditionEffectBits[ConditionEffectBits["INVINCIBLE"] = 8388608] = "INVINCIBLE";
    ConditionEffectBits[ConditionEffectBits["INVULNERABLE"] = 16777216] = "INVULNERABLE";
    ConditionEffectBits[ConditionEffectBits["ARMORED"] = 33554432] = "ARMORED";
    ConditionEffectBits[ConditionEffectBits["ARMOR_BROKEN"] = 67108864] = "ARMOR_BROKEN";
    ConditionEffectBits[ConditionEffectBits["HEXED"] = 134217728] = "HEXED";
    ConditionEffectBits[ConditionEffectBits["NINJA_SPEEDY"] = 268435456] = "NINJA_SPEEDY";
    ConditionEffectBits[ConditionEffectBits["UNSTABLE"] = 536870912] = "UNSTABLE";
    ConditionEffectBits[ConditionEffectBits["DARKNESS"] = 1073741824] = "DARKNESS";
})(ConditionEffectBits = exports.ConditionEffectBits || (exports.ConditionEffectBits = {}));
/**
 * The ID values of all visual/particle effects in the game
 */
var VisualEffect;
(function (VisualEffect) {
    VisualEffect[VisualEffect["UNKNOWN"] = 0] = "UNKNOWN";
    VisualEffect[VisualEffect["HEAL"] = 1] = "HEAL";
    VisualEffect[VisualEffect["TELEPORT"] = 2] = "TELEPORT";
    VisualEffect[VisualEffect["STREAM"] = 3] = "STREAM";
    VisualEffect[VisualEffect["THROW"] = 4] = "THROW";
    VisualEffect[VisualEffect["NOVA"] = 5] = "NOVA";
    VisualEffect[VisualEffect["POISON"] = 6] = "POISON";
    VisualEffect[VisualEffect["LINE"] = 7] = "LINE";
    VisualEffect[VisualEffect["BURST"] = 8] = "BURST";
    VisualEffect[VisualEffect["FLOW"] = 9] = "FLOW";
    VisualEffect[VisualEffect["RING"] = 10] = "RING";
    VisualEffect[VisualEffect["LIGHTNING"] = 11] = "LIGHTNING";
    VisualEffect[VisualEffect["COLLAPSE"] = 12] = "COLLAPSE";
    VisualEffect[VisualEffect["CONEBLAST"] = 13] = "CONEBLAST";
    VisualEffect[VisualEffect["JITTER"] = 14] = "JITTER";
    VisualEffect[VisualEffect["FLASH"] = 15] = "FLASH";
    VisualEffect[VisualEffect["THROW_PROJECTILE"] = 16] = "THROW_PROJECTILE";
    VisualEffect[VisualEffect["SHOCKER"] = 17] = "SHOCKER";
    VisualEffect[VisualEffect["SHOCKEE"] = 18] = "SHOCKEE";
    VisualEffect[VisualEffect["RISING_FURY"] = 19] = "RISING_FURY";
    VisualEffect[VisualEffect["NOVA_NO_AOE"] = 20] = "NOVA_NO_AOE";
    VisualEffect[VisualEffect["INSPIRED"] = 21] = "INSPIRED";
    VisualEffect[VisualEffect["HOLY_BEAM"] = 22] = "HOLY_BEAM";
    VisualEffect[VisualEffect["CIRCLE_TELEGRAPH"] = 23] = "CIRCLE_TELEGRAPH";
    VisualEffect[VisualEffect["CHAOS_BEAM"] = 24] = "CHAOS_BEAM";
    VisualEffect[VisualEffect["TELEPORT_MONSTER"] = 25] = "TELEPORT_MONSTER";
    VisualEffect[VisualEffect["METEOR"] = 26] = "METEOR";
    VisualEffect[VisualEffect["GILDED_BUFF"] = 27] = "GILDED_BUFF";
    VisualEffect[VisualEffect["JADE_BUFF"] = 28] = "JADE_BUFF";
    VisualEffect[VisualEffect["CHAOS_BUFF"] = 29] = "CHAOS_BUFF";
    VisualEffect[VisualEffect["THUNDER_BUFF"] = 30] = "THUNDER_BUFF";
    VisualEffect[VisualEffect["STATUS_FLASH"] = 31] = "STATUS_FLASH";
    VisualEffect[VisualEffect["FIRE_ORB_BUFF"] = 32] = "FIRE_ORB_BUFF";
})(VisualEffect = exports.VisualEffect || (exports.VisualEffect = {}));
