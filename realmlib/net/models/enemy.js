"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Enemy = void 0;
const condition_effect_1 = require("./condition-effect");
const entity_1 = require("./entity");
/**
 * An enemy game object.
 */
class Enemy extends entity_1.Entity {
    constructor(properties, status) {
        super(status);
        this.properties = properties;
    }
    /**
     * Calculates the amount of damage a bullet will apply to an enemy.
     * @param damage The amount of damage to apply.
     * @param armorPiercing Whether or not the damage is armor piercing.
     */
    damage(damage, armorPiercing = false) {
        // tslint:disable-next-line: no-bitwise
        if (condition_effect_1.hasEffect(this.objectData.condition, condition_effect_1.ConditionEffect.INVINCIBLE | condition_effect_1.ConditionEffect.INVULNERABLE)) {
            return 0;
        }
        // work out the defense.
        let def = this.objectData.def;
        if (condition_effect_1.hasEffect(this.objectData.condition, condition_effect_1.ConditionEffect.ARMORED)) {
            def *= 2;
        }
        if (armorPiercing || condition_effect_1.hasEffect(this.objectData.condition, condition_effect_1.ConditionEffect.ARMORBROKEN)) {
            def = 0;
        }
        // work out the actual damage.
        const min = damage * 3 / 20;
        const actualDamage = Math.max(min, damage - def);
        return actualDamage;
    }
}
exports.Enemy = Enemy;
