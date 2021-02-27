"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FailureCode = void 0;
/**
 * The error codes of errors which can be received in the `FailurePacket`.
 */
var FailureCode;
(function (FailureCode) {
    /**
     * Received when the `buildVersion` sent in the `HelloPacket` is not the current one.
     */
    FailureCode[FailureCode["IncorrectVersion"] = 4] = "IncorrectVersion";
    /**
     * Received when an incorrect `key` is sent in the `HelloPacket`.
     */
    FailureCode[FailureCode["BadKey"] = 5] = "BadKey";
    /**
     * Received when the target of a `TeleportPacket` was not a valid target.
     */
    FailureCode[FailureCode["InvalidTeleportTarget"] = 6] = "InvalidTeleportTarget";
    /**
     * Received when the account that has connected does not have a verified email.
     */
    FailureCode[FailureCode["EmailVerificationNeeded"] = 7] = "EmailVerificationNeeded";
    /**
     * Received when teleporting when the client has the non-guild cooldown
     */
    FailureCode[FailureCode["TeleportRealmBlock"] = 9] = "TeleportRealmBlock";
    /**
      * Received when the client enters the wrong server
      */
    FailureCode[FailureCode["WrongServerEntered"] = 10] = "WrongServerEntered";
    /**
      * Received when the server the client enters has a queue
      */
    FailureCode[FailureCode["ServerQueueFull"] = 15] = "ServerQueueFull";
})(FailureCode = exports.FailureCode || (exports.FailureCode = {}));
