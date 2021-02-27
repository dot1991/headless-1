/**
 * The name given to all `AccountInUseError`s.
 */
export declare const ACCOUNT_IN_USE = "ACCOUNT_IN_USE";
/**
 * An account in use error. This is a simple subclass
 * of the `Error` class which includes a timeout property.
 */
export declare class AccountInUseError extends Error {
    timeout: number;
    get name(): string;
    constructor(timeout: number);
}
