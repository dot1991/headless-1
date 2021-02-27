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
const decorators_1 = require("../decorators");
const services_1 = require("../services");
const PLUGIN_REGEX = /\.js$/;
/**
 * A static singleton class used to load libraries and packet hooks.
 */
class LibraryManager {
    constructor(runtime) {
        this.runtime = runtime;
        this.libStore = new Map();
        this.hookStore = new Map();
        this.clientHookStore = new Map();
        this.libStore = new Map();
        this.hookStore = new Map();
        this.clientHookStore = new Map();
        this.loadQueue = new Map();
    }
    /**
     * Loads the client hooks.
     */
    loadClientHooks() {
        // load the client hooks.
        const clientHooks = decorators_1.getHooks().filter((hook) => hook.target === 'Client');
        for (const clientHook of clientHooks) {
            this.clientHookStore.set(clientHook.packet, clientHook);
        }
    }
    /**
     * Loads and stores all libraries present in the `plugins` folder.
     */
    loadPlugins(pluginFolder) {
        services_1.Logger.log('Plugins', 'Loading plugins...', services_1.LogLevel.Info);
        let files = [];
        try {
            files = fs.readdirSync(this.runtime.env.pathTo(pluginFolder));
        }
        catch (err) {
            if (err.code === 'ENOENT') {
                services_1.Logger.log('Plugins', `The directory '${pluginFolder}' does not exist.`, services_1.LogLevel.Error);
            }
            else {
                services_1.Logger.log('Plugins', `Error while reading plugin directory.`, services_1.LogLevel.Error);
                services_1.Logger.log('Plugins', err.message, services_1.LogLevel.Error);
                services_1.Logger.log('Plugins', err.stack, services_1.LogLevel.Error);
            }
            return;
        }
        for (const file of files) {
            try {
                const relPath = path.join(this.runtime.env.pathTo(pluginFolder, file));
                if (!PLUGIN_REGEX.test(relPath)) {
                    services_1.Logger.log('Plugins', `Skipping ${relPath}`, services_1.LogLevel.Debug);
                    continue;
                }
                require(relPath);
            }
            catch (err) {
                services_1.Logger.log('Plugins', `Error while loading ${file}`, services_1.LogLevel.Error);
                services_1.Logger.log('Plugins', err.message, services_1.LogLevel.Error);
                services_1.Logger.log('Plugins', err.stack, services_1.LogLevel.Error);
            }
        }
        // load the libraries and hooks.
        // we use a map here to make dependency fetching easier later.
        const libs = decorators_1.getLibs();
        for (const lib of libs) {
            if (this.loadQueue.has(lib.target.name)) {
                services_1.Logger.log('Plugins', `A library with the name ${lib.target.name} already exists.`, services_1.LogLevel.Error);
            }
            else {
                this.loadQueue.set(lib.target.name, lib);
            }
        }
        // load each plugins
        for (const [, lib] of this.loadQueue) {
            this.loadLib(lib);
        }
    }
    loadLib(lib) {
        services_1.Logger.log('Plugins', `Loading ${lib.target.name}...`, services_1.LogLevel.Info);
        // make sure we won't override an existing plugins.
        if (this.libStore.has(lib.target.name)) {
            services_1.Logger.log('Plugins', `A library with the name ${lib.target.name} already exists.`, services_1.LogLevel.Error);
            return false;
        }
        // don't load it if it's disabled.
        if (lib.info.enabled === false) {
            services_1.Logger.log('Plugins', `Skipping disabled plugin: ${lib.info.name}`, services_1.LogLevel.Debug);
            return false;
        }
        // get all of the dependencies.
        const dependencies = [];
        for (const dep of lib.dependencies) {
            // check if the dependency is the runtime.
            if (dep === 'Runtime') {
                dependencies.push(this.runtime);
                continue;
            }
            // if the dependency is loaded, we're good to go.
            if (this.libStore.has(dep)) {
                dependencies.push(this.libStore.get(dep).instance);
            }
            else {
                // get the dependency.
                const depInfo = decorators_1.getLibs().filter((loadedLib) => loadedLib.target.name === dep)[0];
                // the dependency might not exist.
                if (!depInfo) {
                    services_1.Logger.log('Plugins', `${lib.target.name} depends on the unloaded library ${dep}.`, services_1.LogLevel.Error);
                    return false;
                }
                else {
                    // load the dependency
                    const depLoaded = this.loadLib(depInfo);
                    if (!depLoaded) {
                        // if the dependency was not loaded, we can't load this plugins.
                        // an error was already reported, so no need here.
                        return false;
                    }
                    else {
                        dependencies.push(this.libStore.get(dep).instance);
                    }
                }
            }
        }
        // we can now create an instance.
        try {
            // instantiate the plugin
            const instance = new lib.target(...dependencies);
            // save it
            this.libStore.set(lib.target.name, {
                info: lib,
                instance,
            });
        }
        catch (error) {
            services_1.Logger.log('Plugins', `Error while loading ${lib.target.name}`, services_1.LogLevel.Error);
            services_1.Logger.log('Plugins', error.message, services_1.LogLevel.Error);
            return false;
        }
        // load the hooks
        const libHooks = decorators_1.getHooks().filter((hook) => hook.target === lib.target.name);
        for (const hook of libHooks) {
            if (!this.hookStore.has(hook.packet)) {
                this.hookStore.set(hook.packet, []);
            }
            this.hookStore.get(hook.packet).push(hook);
        }
        if (lib.info.author) {
            services_1.Logger.log('Plugins', `Loaded ${lib.info.name} by ${lib.info.author}`, services_1.LogLevel.Success);
        }
        else {
            services_1.Logger.log('Plugins', `Loaded ${lib.info.name}`, services_1.LogLevel.Success);
        }
        // remove this plugins from the queue if it's in there.
        if (this.loadQueue.has(lib.target.name)) {
            this.loadQueue.delete(lib.target.name);
        }
        return true;
    }
    /**
     * Invokes any packet hook methods which are registered for the given packet type.
     */
    callHooks(packet, client) {
        if (this.hookStore.has(packet.type)) {
            // get the hooks for this packet type.
            const hooks = this.hookStore.get(packet.type);
            for (const hook of hooks) {
                if (packet.propagate === false) {
                    return;
                }
                try {
                    // find the plugin instance to call the method on.
                    const caller = this.libStore.get(hook.target);
                    if (caller && caller.instance) {
                        // create the args according to the hook's signature.
                        const args = hook.signature.map((argType) => {
                            switch (argType) {
                                case 1 /* Packet */:
                                    return packet;
                                case 2 /* Client */:
                                    return client;
                                default:
                                    return undefined;
                            }
                        });
                        caller.instance[hook.method].apply(caller.instance, args);
                    }
                }
                catch (error) {
                    services_1.Logger.log('Plugins', `Error while calling ${hook.target}.${hook.method}()`, services_1.LogLevel.Warning);
                    services_1.Logger.log('Plugins', error.message, services_1.LogLevel.Warning);
                }
            }
        }
        if (packet.propagate === false) {
            return;
        }
        if (this.clientHookStore.has(packet.type)) {
            const hook = this.clientHookStore.get(packet.type);
            // create the args according to the hook's signature.
            const args = hook.signature.map((argType) => {
                switch (argType) {
                    case 1 /* Packet */:
                        return packet;
                    case 2 /* Client */:
                        return client;
                    default:
                        return undefined;
                }
            });
            client[hook.method].apply(client, args);
        }
    }
}
exports.LibraryManager = LibraryManager;
