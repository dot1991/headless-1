/**
 * The environment in which a client project resides
 *
 * This class is the API between the various files that the client uses (such as the packets and acc config etc)
 * and the client itself. Its goal is to provide a good abstraction for interacting with files and folders
 */
export declare class Environment {
    /**
     * The root path of this environment. Generally, this
     * will be the folder which contains the project
     */
    readonly root: string;
    constructor(root: string);
    /**
     * Creates a full path from the relative path provided
     * @param relativePath The relative path to get
     */
    pathTo(...relativePath: string[]): string;
    /**
     * Creates a new directory in the root called `temp`
     */
    mkTempDir(): void;
    /**
     * Deletes the `temp` directory
     */
    rmTempDir(): void;
    /**
     * Gets the JSON content of file and parses it
     * @param relativePath The relative path to the file
     */
    readJSON<T>(...relativePath: string[]): T;
    /**
     * Gets the XML content of file and parses it
     * @param relativePath The relative path to the file
     */
    readXML<T>(...relativePath: string[]): T;
    /**
     * Writes the JSON object into the specified file
     * @param json The object to write
     * @param relativePath The path of to the file to write to
     */
    writeJSON<T>(json: T, ...relativePath: string[]): void;
    /**
     * Updates the object stored at the given path. This essentially
     * just calls `readJSON`, then updates the object, then calls `writeJSON`
     * @param json The object to use when updating
     * @param relativePath The path of the file to update
     */
    updateJSON<T>(json: Partial<T>, ...relativePath: string[]): void;
}
