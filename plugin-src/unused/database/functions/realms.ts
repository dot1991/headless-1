import { WrappedNodeRedisClient } from 'handy-redis';
import { RealmPortal } from '../../models';

/**
 * Functionality to interact with realm and portal data with the cache
 */
export class RealmFunctions {
    database: WrappedNodeRedisClient;

    constructor(client: WrappedNodeRedisClient) {
        this.database = client;
    }

    /**
     * Return a list of every open/closed realm portal
     * Return an empty array if no portals have been tracked
     * @param open: whether this should only return open portals
     */
    public async getAllPortals(open: boolean = true): Promise<RealmPortal[]> {
        let result = await this.database.get(`portals`);

        if (!result) {
            let portals: RealmPortal[] = JSON.parse(result);
            let returnPortals: RealmPortal[] = [];

            if (open) {
                for (let i = 0; i < portals.length; i++) {
                    if (!portals[i].closed) returnPortals.push(portals[i]);
                }
            } else {
                for (let i = 0; i < portals.length; i++) {
                    if (portals[i].closed) returnPortals.push(portals[i]);
                }
            }
            return Promise.resolve(returnPortals);
        }
        return Promise.resolve([]);
    }

    /**
     * Set the list of all current tracked portals
     * @param portals
     */
    public async setAllPortals(portals: RealmPortal[]) {
        await this.database.set(`portals`, JSON.stringify(portals));
        return;
    }

    /**
     * Get a list of all portals that are currently closed
     */
    public async getClosedPortals(): Promise<RealmPortal[]> {
        let portals = await this.getAllPortals(false)
        if (portals.length > 0) return Promise.resolve(portals);
        return [];
    }

    public async getPortalInfo(server: string, portal: string): Promise<RealmPortal> {
        let result = await this.database.get(`portal:${server}:${portal}`);

        if (result !== null) {
            let data: RealmPortal = JSON.parse(result);

            return Promise.resolve(data);
        }
        return Promise.resolve(null);
    }

    /**
     * Update the playercount, queue and hostname for existing tracked portals
     * @param portal
     */
    public async updatePortalInfo(portal: RealmPortal) {
        let portalData = await this.getPortalInfo(portal.server, portal.name);

        if (!portalData) {
            await this.setPortalInfo(portal);
        } else {
            portalData.players = portal.players;
            portalData.queue = portal.players;
            portalData.time = portal.time;

            if (!portalData.hostname && portal.hostname) {
                portalData.hostname = portal.hostname;
            }
            await this.setPortalInfo(portalData);
        }
        return;
    }

    /**
     * Set the complete portal data for a portal
     * @param portal
     */
    public async setPortalInfo(portal: RealmPortal) {
        let json = JSON.stringify(portal);

        await this.database.set(`portal:${portal.server}:${portal.name}`, json)
    }

    /**
     * Remove all the portal's data from the cache
     * @param portal
     */
    public async removePortalInfo(portal: RealmPortal) {
        await this.database.del(`portal:${portal.server}:${portal.name}`);
    }
}
