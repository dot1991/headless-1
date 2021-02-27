"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPacket = void 0;
const packet_type_1 = require("./packet-type");
const IncomingPackets = require("./packets/incoming");
const OutgoingPackets = require("./packets/outgoing");
/**
 * Creates the correct packet object for the given type.
 * @param type The type of packet to create
 * @throws {Error} if the packet cannot be created
 */
function createPacket(type) {
    if (typeof type !== 'string') {
        throw new TypeError(`Parameter "type" must be a string, not ${typeof type}`);
    }
    if (!packet_type_1.PacketType[type]) {
        throw new Error(`Parameter "type" must be a valid packet type, not "${type}"`);
    }
    switch (type) {
        case packet_type_1.PacketType.FAILURE:
            return new IncomingPackets.FailurePacket();
        case packet_type_1.PacketType.ACCEPT_ARENA_DEATH:
            return new OutgoingPackets.AcceptArenaDeathPacket();
        case packet_type_1.PacketType.LOAD:
            return new OutgoingPackets.LoadPacket();
        case packet_type_1.PacketType.QUEST_REDEEM_RESPONSE:
            return new IncomingPackets.QuestRedeemResponsePacket();
        case packet_type_1.PacketType.TRADEACCEPTED:
            return new IncomingPackets.TradeAcceptedPacket();
        case packet_type_1.PacketType.GOTOACK:
            return new OutgoingPackets.GotoAckPacket();
        case packet_type_1.PacketType.PET_CHANGE_FORM_MSG:
            return new OutgoingPackets.ReskinPetPacket();
        case packet_type_1.PacketType.GUILDREMOVE:
            return new OutgoingPackets.GuildRemovePacket();
        case packet_type_1.PacketType.TRADEDONE:
            return new IncomingPackets.TradeDonePacket();
        case packet_type_1.PacketType.HELLO:
            return new OutgoingPackets.HelloPacket();
        case packet_type_1.PacketType.MOVE:
            return new OutgoingPackets.MovePacket();
        case packet_type_1.PacketType.CHATTOKEN:
            return new IncomingPackets.ChatToken();
        case packet_type_1.PacketType.SETCONDITION:
            return new OutgoingPackets.SetConditionPacket();
        case packet_type_1.PacketType.ACTIVEPETUPDATE:
            return new IncomingPackets.ActivePetPacket();
        case packet_type_1.PacketType.PONG:
            return new OutgoingPackets.PongPacket();
        case packet_type_1.PacketType.CANCELTRADE:
            return new OutgoingPackets.CancelTradePacket();
        case packet_type_1.PacketType.OTHERHIT:
            return new OutgoingPackets.OtherHitPacket();
        case packet_type_1.PacketType.IMMINENT_ARENA_WAVE:
            return new IncomingPackets.ImminentArenaWavePacket();
        case packet_type_1.PacketType.GLOBAL_NOTIFICATION:
            return new IncomingPackets.GlobalNotificationPacket();
        case packet_type_1.PacketType.TRADECHANGED:
            return new IncomingPackets.TradeChangedPacket();
        case packet_type_1.PacketType.PETYARDUPDATE:
            return new IncomingPackets.PetYardUpdate();
        case packet_type_1.PacketType.DAMAGE:
            return new IncomingPackets.DamagePacket();
        case packet_type_1.PacketType.CREATE_SUCCESS:
            return new IncomingPackets.CreateSuccessPacket();
        case packet_type_1.PacketType.QUEST_FETCH_ASK:
            return new OutgoingPackets.QuestFetchAskPacket();
        case packet_type_1.PacketType.TELEPORT:
            return new OutgoingPackets.TeleportPacket();
        case packet_type_1.PacketType.EVOLVE_PET:
            return new IncomingPackets.EvolvedPetMessage();
        case packet_type_1.PacketType.UPDATEACK:
            return new OutgoingPackets.UpdateAckPacket();
        case packet_type_1.PacketType.UPDATE:
            return new IncomingPackets.UpdatePacket();
        case packet_type_1.PacketType.INVITEDTOGUILD:
            return new IncomingPackets.InvitedToGuildPacket();
        case packet_type_1.PacketType.USEITEM:
            return new OutgoingPackets.UseItemPacket();
        case packet_type_1.PacketType.TRADESTART:
            return new IncomingPackets.TradeStartPacket();
        case packet_type_1.PacketType.CLAIM_LOGIN_REWARD_MSG:
            return new OutgoingPackets.ClaimDailyRewardMessage();
        case packet_type_1.PacketType.SHOWEFFECT:
            return new IncomingPackets.ShowEffectPacket();
        case packet_type_1.PacketType.DEATH:
            return new IncomingPackets.DeathPacket();
        case packet_type_1.PacketType.RESKIN:
            return new OutgoingPackets.ReskinPacket();
        case packet_type_1.PacketType.PLAYERTEXT:
            return new OutgoingPackets.PlayerTextPacket();
        case packet_type_1.PacketType.DELETE_PET:
            return new IncomingPackets.DeletePetMessage();
        case packet_type_1.PacketType.QUEST_REDEEM:
            return new OutgoingPackets.QuestRedeemPacket();
        case packet_type_1.PacketType.USEPORTAL:
            return new OutgoingPackets.UsePortalPacket();
        case packet_type_1.PacketType.KEY_INFO_RESPONSE:
            return new IncomingPackets.KeyInfoResponsePacket();
        case packet_type_1.PacketType.ACCEPTTRADE:
            return new OutgoingPackets.AcceptTradePacket();
        case packet_type_1.PacketType.RECONNECT:
            return new IncomingPackets.ReconnectPacket();
        case packet_type_1.PacketType.BUYRESULT:
            return new IncomingPackets.BuyResultPacket();
        case packet_type_1.PacketType.REQUESTTRADE:
            return new OutgoingPackets.RequestTradePacket();
        case packet_type_1.PacketType.PETUPGRADEREQUEST:
            return new OutgoingPackets.PetUpgradeRequestPacket();
        case packet_type_1.PacketType.SHOOTACK:
            return new OutgoingPackets.ShootAckPacket();
        case packet_type_1.PacketType.PLAYERHIT:
            return new OutgoingPackets.PlayerHitPacket();
        case packet_type_1.PacketType.ACTIVE_PET_UPDATE_REQUEST:
            return new OutgoingPackets.ActivePetUpdateRequestPacket();
        case packet_type_1.PacketType.PLAYSOUND:
            return new IncomingPackets.PlaySoundPacket();
        case packet_type_1.PacketType.PLAYERSHOOT:
            return new OutgoingPackets.PlayerShootPacket();
        case packet_type_1.PacketType.ESCAPE:
            return new OutgoingPackets.EscapePacket();
        case packet_type_1.PacketType.GUILDRESULT:
            return new IncomingPackets.GuildResultPacket();
        case packet_type_1.PacketType.NOTIFICATION:
            return new IncomingPackets.NotificationPacket();
        case packet_type_1.PacketType.VERIFY_EMAIL:
            return new IncomingPackets.VerifyEmailPacket();
        case packet_type_1.PacketType.GOTO:
            return new IncomingPackets.GotoPacket();
        case packet_type_1.PacketType.MAPINFO:
            return new IncomingPackets.MapInfoPacket();
        case packet_type_1.PacketType.INVDROP:
            return new OutgoingPackets.InvDropPacket();
        case packet_type_1.PacketType.ARENA_DEATH:
            return new IncomingPackets.ArenaDeathPacket();
        case packet_type_1.PacketType.ALLYSHOOT:
            return new IncomingPackets.AllyShootPacket();
        case packet_type_1.PacketType.SERVERPLAYERSHOOT:
            return new IncomingPackets.ServerPlayerShootPacket();
        case packet_type_1.PacketType.PASSWORD_PROMPT:
            return new IncomingPackets.PasswordPromptPacket();
        case packet_type_1.PacketType.FILE:
            return new IncomingPackets.FilePacket();
        case packet_type_1.PacketType.KEY_INFO_REQUEST:
            return new OutgoingPackets.KeyInfoRequestPacket();
        case packet_type_1.PacketType.QUEST_ROOM_MSG:
            return new OutgoingPackets.GoToQuestRoomPacket();
        case packet_type_1.PacketType.CHECKCREDITS:
            return new OutgoingPackets.CheckCreditsPacket();
        case packet_type_1.PacketType.ENEMYHIT:
            return new OutgoingPackets.EnemyHitPacket();
        case packet_type_1.PacketType.CREATE:
            return new OutgoingPackets.CreatePacket();
        case packet_type_1.PacketType.GUILDINVITE:
            return new OutgoingPackets.GuildInvitePacket();
        case packet_type_1.PacketType.ENTER_ARENA:
            return new OutgoingPackets.EnterArenaPacket();
        case packet_type_1.PacketType.PING:
            return new IncomingPackets.PingPacket();
        case packet_type_1.PacketType.EDITACCOUNTLIST:
            return new OutgoingPackets.EditAccountListPacket();
        case packet_type_1.PacketType.AOE:
            return new IncomingPackets.AoePacket();
        case packet_type_1.PacketType.ACCOUNTLIST:
            return new IncomingPackets.AccountListPacket();
        case packet_type_1.PacketType.BUY:
            return new OutgoingPackets.BuyPacket();
        case packet_type_1.PacketType.INVSWAP:
            return new OutgoingPackets.InvSwapPacket();
        case packet_type_1.PacketType.AOEACK:
            return new OutgoingPackets.AoeAckPacket();
        case packet_type_1.PacketType.PIC:
            return new IncomingPackets.PicPacket();
        case packet_type_1.PacketType.INVRESULT:
            return new IncomingPackets.InvResultPacket();
        case packet_type_1.PacketType.LOGIN_REWARD_MSG:
            return new IncomingPackets.ClaimDailyRewardResponse();
        case packet_type_1.PacketType.CHANGETRADE:
            return new OutgoingPackets.ChangeTradePacket();
        case packet_type_1.PacketType.TEXT:
            return new IncomingPackets.TextPacket();
        case packet_type_1.PacketType.QUESTOBJID:
            return new IncomingPackets.QuestObjectIdPacket();
        case packet_type_1.PacketType.QUEST_FETCH_RESPONSE:
            return new IncomingPackets.QuestFetchResponsePacket();
        case packet_type_1.PacketType.TRADEREQUESTED:
            return new IncomingPackets.TradeRequestedPacket();
        case packet_type_1.PacketType.HATCH_PET:
            return new IncomingPackets.HatchPetMessage();
        case packet_type_1.PacketType.GROUNDDAMAGE:
            return new OutgoingPackets.GroundDamagePacket();
        case packet_type_1.PacketType.ENEMYSHOOT:
            return new IncomingPackets.EnemyShootPacket();
        case packet_type_1.PacketType.CHOOSENAME:
            return new OutgoingPackets.ChooseNamePacket();
        case packet_type_1.PacketType.CLIENTSTAT:
            return new IncomingPackets.ClientStatPacket();
        case packet_type_1.PacketType.RESKIN_UNLOCK:
            return new IncomingPackets.ReskinUnlockPacket();
        case packet_type_1.PacketType.NAMERESULT:
            return new IncomingPackets.NameResultPacket();
        case packet_type_1.PacketType.JOINGUILD:
            return new OutgoingPackets.JoinGuildPacket();
        case packet_type_1.PacketType.NEWTICK:
            return new IncomingPackets.NewTickPacket();
        case packet_type_1.PacketType.SQUAREHIT:
            return new OutgoingPackets.SquareHitPacket();
        case packet_type_1.PacketType.CHANGEGUILDRANK:
            return new OutgoingPackets.ChangeGuildRankPacket();
        case packet_type_1.PacketType.NEW_ABILITY:
            return new IncomingPackets.NewAbilityMessage();
        case packet_type_1.PacketType.CREATEGUILD:
            return new OutgoingPackets.CreateGuildPacket();
        case packet_type_1.PacketType.PET_CHANGE_SKIN_MSG:
            return new OutgoingPackets.ChangePetSkinPacket();
        case packet_type_1.PacketType.REALM_HERO_LEFT_MSG:
            return new IncomingPackets.RealmHeroesLeftPacket();
        case packet_type_1.PacketType.RESET_DAILY_QUESTS:
            return new OutgoingPackets.ResetDailyQuestsPacket();
        case packet_type_1.PacketType.NEW_CHARACTER_INFORMATION:
            return new IncomingPackets.NewCharacterInfoPacket();
        case packet_type_1.PacketType.QUEUE_INFORMATION:
            return new IncomingPackets.QueueInfoPacket();
        case packet_type_1.PacketType.QUEUE_CANCEL:
            return new OutgoingPackets.QueueCancelPacket();
        case packet_type_1.PacketType.VAULT_UPDATE:
            return new IncomingPackets.VaultUpdatePacket();
        case packet_type_1.PacketType.EXALTATION_BONUS_CHANGED:
            return new IncomingPackets.ExaltationUpdatePacket();
        case packet_type_1.PacketType.FORGE_REQUEST:
            return new OutgoingPackets.ForgeRequestPacket();
        case packet_type_1.PacketType.FORGE_RESULT:
            return new IncomingPackets.ForgeResultPacket();
        case packet_type_1.PacketType.CHANGE_ALLYSHOOT:
            return new OutgoingPackets.ChangeAllyShootPacket();
    }
    throw new Error(`Unknown packet type: ${type}`);
}
exports.createPacket = createPacket;
