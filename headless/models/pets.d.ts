import { WorldPosData } from '../../realmlib/net';
/**
 * Properties of a pet
 */
export interface PetData {
    /**
     * The object id of the player who owns this pet
     */
    ownerId: number;
    /**
     * The object id of this pet
     */
    objectId: number;
    /**
     * The position of this pet
     */
    worldPos: WorldPosData;
    /**
     * The HP of this pet. Note that this is unimportant, and usually `0`
     */
    hp: number;
    /**
     * The size of this pet.
     */
    size: number;
    /**
     * The condition flags for this pet. The number itself will be meaningless, as
     * the effects are represented with individual bits of the number
     */
    condition: number;
    /**
     * The skin of this pet
     */
    texture: number;
    /**
     * The instance id of this pet
     */
    instanceId: number;
    /**
     * The name of this pet
     */
    name: string;
    /**
     * The type of this pet
     */
    type: number;
    /**
     * The rarity level of this pet
     */
    rarity: number;
    /**
     * The maximum ability level that can be achieved for any of the 3 abilities
     */
    maxAbilityPower: number;
    /**
     * The family of this pet
     */
    family: number;
    /**
     * The total amount of feed power contributed to this ability
     */
    firstAbilityPoint: number;
    /**
     * The level of the first ability
     */
    firstAbilityPower: number;
    /**
     * The type of the first ability
     */
    firstAbilityType: number;
    secondAbilityPoint: number;
    secondAbilityPower: number;
    secondAbilityType: number;
    thirdAbilityPoint: number;
    thirdAbilityPower: number;
    thirdAbilityType: number;
}
/**
 * The corresponding ID value for pet ability types
 */
export declare enum PetAbilities {
    AttackClose = 402,
    AttackMid = 404,
    AttackFar = 405,
    Electric = 406,
    Heal = 407,
    MagicHeal = 408,
    Savage = 409,
    Decoy = 410,
    RisingFury = 411
}
