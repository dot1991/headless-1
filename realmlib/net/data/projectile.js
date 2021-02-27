"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Projectile = void 0;
/**
 * A projectile entity.
 */
class Projectile {
    constructor(containerType, containerProps, bulletType, ownerObjectId, bulletId, startAngle, startTime, startPosition) {
        this.containerType = containerType;
        this.bulletType = bulletType;
        this.ownerObjectId = ownerObjectId;
        this.bulletId = bulletId;
        this.startAngle = startAngle;
        this.startTime = startTime;
        this.startPosition = startPosition;
        this.containerProperties = containerProps;
        this.projectileProperties = this.containerProperties.projectiles[bulletType];
        this.damagePlayers = this.containerProperties.enemy;
        this.damageEnemies = !this.damagePlayers;
        this.damage = 0;
        this.multiHit = new Set();
    }
    setDamage(damage) {
        this.damage = damage;
    }
    update(currentTime) {
        const elapsed = currentTime - this.startTime;
        if (elapsed > this.projectileProperties.lifetimeMS) {
            return false;
        }
        this.currentPosition = this.getPositionAt(elapsed);
        return true;
    }
    getPositionAt(time) {
        const point = {
            x: this.startPosition.x,
            y: this.startPosition.y,
        };
        let distanceTravelled = time * (this.projectileProperties.speed / 10000);
        const phase = this.bulletId % 2 === 0 ? 0 : Math.PI;
        if (this.projectileProperties.wavy) {
            const newAngle = this.startAngle + (Math.PI / 64) * Math.sin(phase + (6 * Math.PI) * time / 1000);
            point.x += distanceTravelled * Math.cos(newAngle);
            point.y += distanceTravelled * Math.sin(newAngle);
        }
        else if (this.projectileProperties.parametric) {
            const offset1 = time / this.projectileProperties.lifetimeMS * 2 * Math.PI;
            const offset2 = Math.sin(offset1) * (!!(this.bulletId % 2) ? 1 : -1);
            const offset3 = Math.sin(2 * offset1) * (this.bulletId % 4 < 2 ? 1 : -1);
            const angleX = Math.cos(this.startAngle);
            const angleY = Math.sin(this.startAngle);
            point.x += (offset2 * angleY - offset3 * angleX) * this.projectileProperties.magnitude;
            point.y += (offset2 * angleX - offset3 * angleY) * this.projectileProperties.magnitude;
        }
        else {
            if (this.projectileProperties.boomerang) {
                const halfwayPoint = this.projectileProperties.lifetimeMS * (this.projectileProperties.speed / 10000) / 2;
                if (distanceTravelled > halfwayPoint) {
                    distanceTravelled = halfwayPoint - (distanceTravelled - halfwayPoint);
                }
            }
            point.x += distanceTravelled * Math.cos(this.startAngle);
            point.y += distanceTravelled * Math.sin(this.startAngle);
            if (this.projectileProperties.amplitude !== 0) {
                const deflection = this.projectileProperties.amplitude *
                    Math.sin(phase + time / this.projectileProperties.lifetimeMS * this.projectileProperties.frequency * 2 * Math.PI);
                point.x += deflection * Math.cos(this.startAngle + Math.PI / 2);
                point.y += deflection * Math.sin(this.startAngle + Math.PI / 2);
            }
        }
        return point;
    }
}
exports.Projectile = Projectile;
