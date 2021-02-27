"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PetUpgradeType = exports.ActivePetUpdateType = exports.PetYardType = void 0;
/**
 * The types of pet yards
 */
var PetYardType;
(function (PetYardType) {
    PetYardType[PetYardType["Common"] = 1] = "Common";
    PetYardType[PetYardType["Uncommon"] = 2] = "Uncommon";
    PetYardType[PetYardType["Rare"] = 3] = "Rare";
    PetYardType[PetYardType["Legendary"] = 4] = "Legendary";
    PetYardType[PetYardType["Divine"] = 5] = "Divine";
})(PetYardType = exports.PetYardType || (exports.PetYardType = {}));
/**
 * Command types that are used in ActivePetUpdateRequestPacket
 */
var ActivePetUpdateType;
(function (ActivePetUpdateType) {
    ActivePetUpdateType[ActivePetUpdateType["Follow"] = 1] = "Follow";
    ActivePetUpdateType[ActivePetUpdateType["Unfollow"] = 2] = "Unfollow";
    ActivePetUpdateType[ActivePetUpdateType["Release"] = 3] = "Release";
})(ActivePetUpdateType = exports.ActivePetUpdateType || (exports.ActivePetUpdateType = {}));
/**
 * Types which can be upgraded via PetUpgradeRequestPacket
 */
var PetUpgradeType;
(function (PetUpgradeType) {
    PetUpgradeType[PetUpgradeType["PetYard"] = 1] = "PetYard";
    PetUpgradeType[PetUpgradeType["FeedPet"] = 2] = "FeedPet";
    PetUpgradeType[PetUpgradeType["FusePet"] = 3] = "FusePet";
})(PetUpgradeType = exports.PetUpgradeType || (exports.PetUpgradeType = {}));
