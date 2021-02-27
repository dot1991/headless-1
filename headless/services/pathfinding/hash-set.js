"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A basic hash set implementation.
 */
class HashSet {
    constructor() {
        this.map = {};
    }
    /**
     * Adds an item to the hash set.
     * @param item The item to add.
     */
    add(item) {
        const hash = item.hash();
        this.map[hash] = item;
    }
    /**
     * Removes an item from the hash set.
     * @param item The item to remove.
     */
    remove(item) {
        const hash = item.hash();
        if (this.map[hash]) {
            delete this.map[hash];
        }
    }
    /**
     * Checks whether or not the item is contained in the hash set.
     * @param item The item to check.
     */
    contains(item) {
        return this.map.hasOwnProperty(item.hash());
    }
}
exports.HashSet = HashSet;
