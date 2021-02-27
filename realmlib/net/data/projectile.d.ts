import { Point } from '../models';
import { GameObject, ProjectileInfo } from '../models/object';
/**
 * A projectile entity.
 */
export declare class Projectile {
    /**
     * The id of the entity that produced this projectile.
     */
    containerType: number;
    /**
     * The local identifier of the `containerType`s projectile list.
     * @see `ProjectileInfo.id`
     */
    bulletType: number;
    /**
     * The object id of the entity which produced this projectile.
     */
    ownerObjectId: number;
    /**
     * The identifier for this particular projectile. Similar to the object id of entities.
     */
    bulletId: number;
    /**
     * The angle at which this projectile was fired.
     */
    startAngle: number;
    /**
     * The client time at the point when this projectile was fired.
     */
    startTime: number;
    /**
     * The position which this projectile was fired at.
     */
    startPosition: Point;
    /**
     * The properties of the container used to produce this projectile.
     */
    containerProperties: GameObject;
    /**
     * The properties of this projectile.
     */
    projectileProperties: ProjectileInfo;
    /**
     * Whether or not this projectile damages players.
     */
    damagePlayers: boolean;
    /**
     * Whether or not this projectile damages enemies.
     */
    damageEnemies: boolean;
    /**
     * The damage which will be applied by this projectile if it hits an entity.
     */
    damage: number;
    /**
     * The current position of this projectile.
     */
    currentPosition: Point;
    readonly multiHit: Set<number>;
    constructor(containerType: number, containerProps: any, bulletType: number, ownerObjectId: number, bulletId: number, startAngle: number, startTime: number, startPosition: Point);
    setDamage(damage: number): void;
    update(currentTime: number): boolean;
    private getPositionAt;
}
