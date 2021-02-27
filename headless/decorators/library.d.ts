import 'reflect-metadata';
import { LoadedLib } from '../core';
import { LibraryInfo } from './../models/plugin-info';
/**
 * Indicates that the decorated class is a Library which may contain packet hooks.
 * @param libInfo The library information.
 */
export declare function Library(libInfo: LibraryInfo): ClassDecorator;
/**
 * Returns a copy of the loaded libraries.
 */
export declare function getLibs(): Array<LoadedLib<any>>;
