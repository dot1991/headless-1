"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A regular expression which matches the local part and domain of an email address
 */
const EMAIL_REPLACE_REGEX = /.+?(.+?)(?:@|\+\d+).+?(.+?)\./;
/**
 * Replaces the local part and domain of an email address with asterisks
 * Used to avoid leaking information through log files
 * @param guid The guid to censor
 */
function censorGuid(guid) {
    const match = EMAIL_REPLACE_REGEX.exec(guid);
    let result = guid;
    if (match) {
        if (match[1]) {
            result = result.replace(match[1], '***');
        }
        if (match[2]) {
            result = result.replace(match[2], '***');
        }
    }
    return result;
}
exports.censorGuid = censorGuid;
/**
 * Returns a string which is at least `paddingLength` characters long, which
 * contains the original `str` and spaces to fill the remaining space if there is any
 * @param str The string to pad
 * @param length The number of spaces to add
 */
function pad(str, length) {
    if (str.length > length) {
        return str;
    }
    return (str + ' '.repeat(length - str.length));
}
exports.pad = pad;
/**
 * Returns the current time in HH:mm:ss format
 */
function getTime() {
    const now = new Date();
    return now.toTimeString().split(' ')[0];
}
exports.getTime = getTime;
