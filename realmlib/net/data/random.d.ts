/**
 * An implementation of the PRNG used by the RotMG game client.
 */
export declare class Random {
    private seed;
    constructor(seed: number);
    /**
     * Gets the next integer in the given range.
     * @param min The minimum value.
     * @param max The maximum value.
     */
    nextIntInRange(min: number, max: number): number;
    private generate;
}
