import { ObjectStatusData } from '../../realmlib/net';
import { Entity } from './entity';
import { GameObject } from './object';
export declare class Enemy extends Entity {
    /**
     * The properties of this enemy as described by the Objects resource.
     */
    properties: GameObject;
    constructor(properties: GameObject, status: ObjectStatusData);
    /**
     * Calculates the amount of damage a bullet will apply to an enemy.
     * @param damage The amount of damage to apply.
     * @param armorPiercing Whether or not the damage is armor piercing.
     */
    damage(damage: number, armorPiercing?: boolean): number;
}
