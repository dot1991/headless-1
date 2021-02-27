export interface Config {
    /**
     * The current build version of the game
     */
    buildVersion: string;
    /**
     * The client token used by the game client
     */
    clientToken: string;
    /**
     * The directory to look for plugins in, relative to the root folder
     */
    pluginPath?: string;
    /**
     * Whether to allow control via a http server
     */
    httpControl?: boolean;
    /**
     * The port to use for the http control server
     */
    httpPort?: number;
    /**
     * Whether to only connect to the tutorial and ignore the nexus
     */
    tutorialMode?: boolean;
}
