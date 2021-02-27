"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentType = void 0;
/**
 * Types of payment which can be used to purchase items in-game
 */
var PaymentType;
(function (PaymentType) {
    PaymentType[PaymentType["Invalid"] = -1] = "Invalid";
    PaymentType[PaymentType["Gold"] = 0] = "Gold";
    PaymentType[PaymentType["Fame"] = 1] = "Fame";
    PaymentType[PaymentType["GuildFame"] = 2] = "GuildFame";
    PaymentType[PaymentType["FortuneTokens"] = 3] = "FortuneTokens";
})(PaymentType = exports.PaymentType || (exports.PaymentType = {}));
