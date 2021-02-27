import { Hashable } from './hashable';
/**
 * A basic hash set implementation.
 */
export declare class HashSet<T extends Hashable> {
    private map;
    constructor();
    /**
     * Adds an item to the hash set.
     * @param item The item to add.
     */
    add(item: T): void;
    /**
     * Removes an item from the hash set.
     * @param item The item to remove.
     */
    remove(item: T): void;
    /**
     * Checks whether or not the item is contained in the hash set.
     * @param item The item to check.
     */
    contains(item: T): boolean;
}
