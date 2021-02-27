"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Returns a promise which resolves after `ms` milliseconds.
 * @param ms The number of milliseconds to wait.
 */
function delay(ms) {
    if (ms <= 0) {
        return Promise.resolve();
    }
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
exports.delay = delay;
