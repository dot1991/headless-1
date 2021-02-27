"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const libraries = [];
/**
 * Indicates that the decorated class is a Library which may contain packet hooks.
 * @param libInfo The library information.
 */
function Library(libInfo) {
    return (target) => {
        const params = Reflect.getMetadata('design:paramtypes', target) || [];
        const dependencies = params.map((type) => type.name);
        libraries.push({
            info: libInfo,
            target,
            dependencies,
        });
    };
}
exports.Library = Library;
/**
 * Returns a copy of the loaded libraries.
 */
function getLibs() {
    return [...libraries];
}
exports.getLibs = getLibs;
