import { Point } from '../../../realmlib/net';
import { NodeUpdate } from './node-update';
/**
 * A pathfinder which implements the A* pathfinding algorithm.
 */
export declare class Pathfinder {
    private nodes;
    private w;
    constructor(mapWidth: number, walkableNodes?: NodeUpdate[]);
    /**
     * Finds a path from the `start` to the `end` and returns a list of points in between.
     * @param start The start point.
     * @param end The end point.
     */
    findPath(start: Point, end: Point): Promise<Point[]>;
    /**
     * Applies updates to the nodes known by this pathfinder.
     * @param updates The node updates to apply.
     */
    updateWalkableNodes(updates: NodeUpdate[]): void;
    /**
     * Releases any resources held by this pathfinder.
     */
    destroy(): void;
    private simplifyPath;
    private retracePath;
    private getIndex;
    private getPosition;
    private getNeighbors;
    private getDistance;
}
