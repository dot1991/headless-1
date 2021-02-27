"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Appspot = exports.baseUrl = void 0;
const axios = require('axios').default;
exports.baseUrl = "https://realmofthemadgod.appspot.com/";
class Appspot {
    constructor(request, useProxy = false) {
        this.useProxy = useProxy;
    }
    makeRequest(endpoint, args) {
    }
    getServerList() {
    }
    getCharacterList() {
    }
    getPackages() {
    }
}
exports.Appspot = Appspot;
