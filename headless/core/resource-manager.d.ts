import { Environment } from '../runtime/environment';
import { GameObject, Tile } from './../models';
export declare class ResourceManager {
    readonly env: Environment;
    readonly tiles: {
        [id: number]: Tile;
    };
    readonly objects: {
        [id: number]: GameObject;
    };
    readonly items: {
        [id: number]: GameObject;
    };
    readonly pets: {
        [id: number]: GameObject;
    };
    constructor(env: Environment);
    /**
     * Loads all available resources
     */
    loadAllResources(): Promise<void>;
    /**
     * Loads the GroundTypes file
     */
    loadTileInfo(): void;
    /**
     * Loads the Objects file
     */
    loadObjects(): void;
    /**
     * Loads the forgeProperties file
     */
    loadForgeProperties(): void;
}
