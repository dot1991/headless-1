"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const condition_effect_1 = require("./condition-effect");
const entity_1 = require("./entity");
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
        let def = this.objectData.def;
        if (condition_effect_1.hasEffect(this.objectData.condition, condition_effect_1.ConditionEffect.ARMORED)) {
            def *= 2;
        }
        if (armorPiercing || condition_effect_1.hasEffect(this.objectData.condition, condition_effect_1.ConditionEffect.ARMORBROKEN)) {
            def = 0;
        }
        const min = damage * 3 / 20;
        return Math.max(min, damage - def);
    }
}
exports.Enemy = Enemy;
