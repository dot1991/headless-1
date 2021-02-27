/**
 * Replaces the local part and domain of an email address with asterisks
 * Used to avoid leaking information through log files
 * @param guid The guid to censor
 */
export declare function censorGuid(guid: string): string;
/**
 * Returns a string which is at least `paddingLength` characters long, which
 * contains the original `str` and spaces to fill the remaining space if there is any
 * @param str The string to pad
 * @param length The number of spaces to add
 */
export declare function pad(str: string, length: number): string;
/**
 * Returns the current time in HH:mm:ss format
 */
export declare function getTime(): string;
