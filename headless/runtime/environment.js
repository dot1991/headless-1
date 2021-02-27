"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/**
 * The environment in which a client project resides
 *
 * This class is the API between the various files that the client uses (such as the packets and acc config etc)
 * and the client itself. Its goal is to provide a good abstraction for interacting with files and folders
 */
class Environment {
    constructor(root) {
        this.root = root;
    }
    /**
     * Creates a full path from the relative path provided
     * @param relativePath The relative path to get
     */
    pathTo(...relativePath) {
        return path.join(this.root, ...relativePath);
    }
    /**
     * Creates a new directory in the root called `temp`
     */
    mkTempDir() {
        try {
            fs.mkdirSync(this.pathTo('temp'));
        }
        catch (error) {
            // if the dir already exists, don't worry.
            if (error.code !== 'EEXIST') {
                throw error;
            }
        }
    }
    /**
     * Deletes the `temp` directory
     */
    rmTempDir() {
        function rm(dir) {
            let files;
            try {
                files = fs.readdirSync(dir);
            }
            catch (error) {
                if (error.code === 'ENOENT') {
                    // the dir doesn't exist, so don't worry.
                    return;
                }
                else {
                    throw error;
                }
            }
            for (const file of files) {
                const filePath = path.join(dir, file);
                const stat = fs.statSync(filePath);
                if (stat.isDirectory()) {
                    rm(filePath);
                }
                else {
                    fs.unlinkSync(filePath);
                }
            }
            fs.rmdirSync(dir);
        }
        rm(this.pathTo('temp'));
    }
    /**
     * Gets the JSON content of file and parses it
     * @param relativePath The relative path to the file
     */
    readJSON(...relativePath) {
        const filePath = this.pathTo(...relativePath);
        try {
            const contents = fs.readFileSync(filePath, { encoding: 'utf8' });
            if (!contents) {
                return undefined;
            }
            return JSON.parse(contents);
        }
        catch (error) {
            if (error.code === 'ENOENT') {
                return undefined;
            }
            else {
                throw error;
            }
        }
    }
    /**
     * Gets the XML content of file and parses it
     * @param relativePath The relative path to the file
     */
    readXML(...relativePath) {
        const filePath = this.pathTo(...relativePath);
        try {
            const contents = fs.readFileSync(filePath, { encoding: 'utf8' });
            if (!contents) {
                return undefined;
            }
        }
        catch (error) {
            if (error.code === 'ENOENT') {
                return undefined;
            }
            else {
                throw error;
            }
        }
    }
    /**
     * Writes the JSON object into the specified file
     * @param json The object to write
     * @param relativePath The path of to the file to write to
     */
    writeJSON(json, ...relativePath) {
        const filePath = this.pathTo(...relativePath);
        fs.writeFileSync(filePath, JSON.stringify(json, undefined, 2));
    }
    /**
     * Updates the object stored at the given path. This essentially
     * just calls `readJSON`, then updates the object, then calls `writeJSON`
     * @param json The object to use when updating
     * @param relativePath The path of the file to update
     */
    updateJSON(json, ...relativePath) {
        const existing = this.readJSON(...relativePath) || {};
        for (const prop in json) {
            if (json.hasOwnProperty(prop)) {
                existing[prop] = json[prop];
            }
        }
        this.writeJSON(existing, ...relativePath);
    }
}
exports.Environment = Environment;
