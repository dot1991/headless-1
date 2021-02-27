"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_rsa_1 = __importDefault(require("node-rsa"));
const PUBLIC_KEY = '-----BEGIN PUBLIC KEY-----\n' +
    'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDCKFctVrhfF3m2Kes0FBL/JFeO' +
    'cmNg9eJz8k/hQy1kadD+XFUpluRqa//Uxp2s9W2qE0EoUCu59ugcf/p7lGuL99Uo' +
    'SGmQEynkBvZct+/M40L0E0rZ4BVgzLOJmIbXMp0J4PnPcb6VLZvxazGcmSfjauC7' +
    'F3yWYqUbZd/HCBtawwIDAQAB\n' +
    '-----END PUBLIC KEY-----';
/**
 * Encrypts the text with a hard-coded public key.
 * @param msg The text to encrypt.
 */
function encrypt(msg) {
    if (!msg || msg.trim() === '') {
        return '';
    }
    const key = new node_rsa_1.default(PUBLIC_KEY, 'pkcs8-public', {
        encryptionScheme: 'pkcs1',
    });
    return key.encrypt(Buffer.from(msg, 'utf8'), 'base64', 'utf8');
}
exports.encrypt = encrypt;
