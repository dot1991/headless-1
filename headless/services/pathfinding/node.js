"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A pathfinder node for the A* pathfinding algorithm.
 */
class Node {
    constructor(x, y) {
        /**
         * The parent node.
         */
        this.parent = null;
        /**
         * The cost of getting from the start node to this node.
         */
        this.gCost = 0;
        /**
         * The cost of getting from this node to the end node.
         */
        this.hCost = 0;
        /**
         * The X coordinate of this node.
         */
        this.x = 0;
        /**
         * The Y coordinate of this node.
         */
        this.y = 0;
        /**
         * Whether or not this node can be walked on.
         */
        this.walkable = true;
        this.heapIndex = -1;
        this.x = x;
        this.y = y;
    }
    /**
     * The combined `gCost` and `hCost`.
     */
    get fCost() {
        return this.gCost + this.hCost;
    }
    hash() {
        return this.x + '' + this.y;
    }
    compareTo(item) {
        if (this.fCost > item.fCost) {
            return -1;
        }
        if (this.fCost === item.fCost) {
            if (this.hCost > item.hCost) {
                return -1;
            }
            if (this.hCost < item.hCost) {
                return 1;
            }
            return 0;
        }
        return 1;
    }
}
exports.Node = Node;
