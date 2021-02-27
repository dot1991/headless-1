import { AppspotRequest } from './appspot-params';
export declare const baseUrl = "https://realmofthemadgod.appspot.com/";
export declare class Appspot {
    request: AppspotRequest;
    useProxy: boolean;
    /**
     * Send these specific headers as without them you can be detected for using a 3rd party client
     */
    unityHeaders: {
        'X-Unity-Version': '';
        'User-Agent': '';
    };
    constructor(request: AppspotRequest, useProxy?: boolean);
    makeRequest(endpoint: string, args: AppspotRequest): void;
    getServerList(): void;
    getCharacterList(): void;
    getPackages(): void;
}
