import { HeapItem } from './heap-item';
/**
 * A basic implementation of a min-heap
 */
export declare class Heap<T extends HeapItem<T>> {
    private items;
    private heapSize;
    private maxHeapSize;
    constructor(maxHeapSize: number);
    /**
     * The number of items in the heap.
     */
    get count(): number;
    /**
     * Adds an item to the heap.
     * @param item The item to add.
     */
    add(item: T): void;
    /**
     * Removes the first item from the heap.
     */
    removeFirst(): T;
    /**
     * Updates the item's positioning in the heap.
     * @param item The item to update.
     */
    update(item: T): void;
    /**
     * Checks whether the item exists in the heap.
     * @param item The item to check.
     */
    contains(item: T): boolean;
    private sortDown;
    private sortUp;
    private swap;
}
