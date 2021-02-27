"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The name given to all `AccountInUseError`s.
 */
exports.ACCOUNT_IN_USE = 'ACCOUNT_IN_USE';
/**
 * An account in use error. This is a simple subclass
 * of the `Error` class which includes a timeout property.
 */
class AccountInUseError extends Error {
    constructor(timeout) {
        super(`Account in use. ${timeout} seconds until timeout.`);
        this.timeout = timeout;
    }
    get name() {
        return exports.ACCOUNT_IN_USE;
    }
}
exports.AccountInUseError = AccountInUseError;
