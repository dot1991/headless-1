import {
    Client,
    Library,
    PacketHook,
    HelloPacket,
    UpdatePacket,
    MapInfoPacket,
    WorldPosData,
    ObjectData,
} from '../../../headless';

interface RealmPortal {
    server: string;
    name: string;
    players: number;
    queue: number;
    position: WorldPosData;
    id: number;
    time: number;
}

@Library({
    name: 'portal-watcher',
    author: 'him',
})
class PortalWatcher {
    @PacketHook()
    onMapInfo(client: Client, map: MapInfoPacket): void {
        setTimeout(() => {
            let clientPos = client.worldPos;

            client.findPath({ x: 127, y: 153 });
        }, 5000);

        setTimeout(() => {
            let newPosX = client.worldPos.x - 5;
            let newPosY = client.worldPos.y;

            //client.findPath({x: newPosX, y: newPosY});
        }, 15000);
    }

    @PacketHook()
    onUpdate(client: Client, update: UpdatePacket): void {
        for (let i = 0; i < update.newObjects.length; i++) {
            let object = update.newObjects[i];

            if (object.objectType == 1824) {
                console.log(
                    `Found vault portal at x: ${object.status.pos.x}, y: ${object.status.pos.y}`
                );
            }
            if (object.objectType == 1839) {
                console.log(
                    `Found guild hall portal at x: ${object.status.pos.x}, y: ${object.status.pos.y}`
                );
            }
            if (object.objectType == 1872) {
                console.log(
                    `Found bazaar portal at x: ${object.status.pos.x}, y: ${object.status.pos.y}`
                );
            }
            if (object.objectType == 1810) {
                for (let j = 0; j < object.status.stats.length; j++) {
                    if (object.status.stats[j].stringStatValue !== null) {
                        let data = this.parsePortalData(client, object);

                        console.log(
                            `Found new portal ${data.name} with players ${data.players}/85.. object ID: ${data.id}`
                        );
                    }
                }
                console.log(
                    `Found bazaar portal at x: ${object.status.pos.x}, y: ${object.status.pos.y}`
                );
            }
        }
    }

    /**
     * Take an ingame portal object and parse the data
     *
     * @param client the client who found the portal
     * @param portal the ObjectData of the portal
     */
    parsePortalData(client: Client, portal: ObjectData): RealmPortal {
        /**
         * Get the correct object ID (there are 3 per portal)
         */
        let realPortal = portal.status.stats.find(
            (x) => x.stringStatValue !== ''
        );
        if (!realPortal) return null;

        const pattern = new RegExp(
            '(\\w+)\\s\\((\\d+)(?:\\/\\d+\\)\\s\\(\\+(\\d+))?'
        );
        let portalData = realPortal.stringStatValue.match(pattern);
        let server = client.server.name;

        const newPortal: RealmPortal = {
            position: portal.status.pos,
            id: portal.status.objectId,
            name: portalData[1],
            server: server,
            players: parseInt(portalData[2]),
            queue: portalData[3] ? parseInt(portalData[3]) : 0,
            time: Date.now(),
        };
        return newPortal;
    }
}
