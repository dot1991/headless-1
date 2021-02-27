import { Hashable } from './hashable';
import { HeapItem } from './heap-item';
/**
 * A pathfinder node for the A* pathfinding algorithm.
 */
export declare class Node implements HeapItem<Node>, Hashable {
    /**
     * The parent node.
     */
    parent: Node;
    /**
     * The cost of getting from the start node to this node.
     */
    gCost: number;
    /**
     * The cost of getting from this node to the end node.
     */
    hCost: number;
    /**
     * The X coordinate of this node.
     */
    x: number;
    /**
     * The Y coordinate of this node.
     */
    y: number;
    /**
     * Whether or not this node can be walked on.
     */
    walkable: boolean;
    heapIndex: number;
    /**
     * The combined `gCost` and `hCost`.
     */
    get fCost(): number;
    constructor(x: number, y: number);
    hash(): string;
    compareTo(item: Node): number;
}
