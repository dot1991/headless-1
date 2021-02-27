"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtocolError = exports.FailureMessage = exports.FailureCode = void 0;
/**
 * The error codes of messages which can be received in the FailurePacket
 */
var FailureCode;
(function (FailureCode) {
    /**
     * Received when the game version sent in the HelloPacket is not updated
     */
    FailureCode[FailureCode["IncorrectVersion"] = 4] = "IncorrectVersion";
    /**
     * Received when an incorrect key is sent in the HelloPacket
     */
    FailureCode[FailureCode["BadKey"] = 5] = "BadKey";
    /**
     * Received when the target of a TeleportPacket was not a valid target
     */
    FailureCode[FailureCode["InvalidTeleportTarget"] = 6] = "InvalidTeleportTarget";
    /**
     * Received when the account that has connected does not have a verified email
     */
    FailureCode[FailureCode["EmailVerificationNeeded"] = 7] = "EmailVerificationNeeded";
    /**
     * Received on teleport when the client has the non-guild cooldown
     */
    FailureCode[FailureCode["TeleportRealmBlock"] = 9] = "TeleportRealmBlock";
    /**
     * Received when the client enters the wrong server
     */
    FailureCode[FailureCode["WrongServerEntered"] = 10] = "WrongServerEntered";
    /**
     * Received when the server is full or you try enter an area without a valid reconnect key
     */
    FailureCode[FailureCode["ServerFull"] = 11] = "ServerFull";
    /**
     * Received when the server the client enters has a queue
     */
    FailureCode[FailureCode["ServerQueue"] = 15] = "ServerQueue";
})(FailureCode = exports.FailureCode || (exports.FailureCode = {}));
/**
 * Common failure packet messages for when the error code is 0
 */
var FailureMessage;
(function (FailureMessage) {
    FailureMessage["CharacterDead"] = "Character is dead";
    FailureMessage["CharacterNotFound"] = "Character not found";
    FailureMessage["TemporaryBan"] = "Your IP has been temporarily banned for abuse/hacking on this server";
})(FailureMessage = exports.FailureMessage || (exports.FailureMessage = {}));
/**
 * Most possible protocol error codes and their meaning
 */
var ProtocolError;
(function (ProtocolError) {
    /**
     * Received if you send a MOVE packet not in response to a new tick
     */
    ProtocolError[ProtocolError["IncorrectMove"] = 5] = "IncorrectMove";
    /**
     * Received if you send a pong packet not in response to a ping
     */
    ProtocolError[ProtocolError["IncorrectPong"] = 9] = "IncorrectPong";
    /**
     * Received if a pong packet is sent with an invalid serial number
     */
    ProtocolError[ProtocolError["IncorrectPongSerial"] = 10] = "IncorrectPongSerial";
    /**
     * Received if you send an UPDATEACK not in response to an UPDATE
     */
    ProtocolError[ProtocolError["IncorrectUpdateAck"] = 11] = "IncorrectUpdateAck";
    /**
     * Received if you send a HELLO packet while already in-game
     */
    ProtocolError[ProtocolError["IncorrectHello"] = 15] = "IncorrectHello";
    /**
     * Received when an ACK packet is not sent (ping, goto, newtick, update)
     */
    ProtocolError[ProtocolError["IgnoredAck"] = 21] = "IgnoredAck";
    /**
     * Received when too many packets are sent in a short duration (1200+ at once)
     */
    ProtocolError[ProtocolError["TooManyPackets"] = 42] = "TooManyPackets";
    /**
     * Received if there are too many in-game entities for the server to handle
     */
    ProtocolError[ProtocolError["TooManyEntities"] = 48] = "TooManyEntities";
    /**
     * Received when sending packets too quickly after getting "action not permitted at the moment" in-game
     */
    ProtocolError[ProtocolError["RateLimit"] = 64] = "RateLimit";
})(ProtocolError = exports.ProtocolError || (exports.ProtocolError = {}));
