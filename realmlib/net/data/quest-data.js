"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestData = void 0;
/**
 * Information about a quest, such as a daily quest.
 */
class QuestData {
    constructor() {
        this.id = '';
        this.name = '';
        this.description = '';
        this.expiration = '';
        this.requirements = [];
        this.rewards = [];
        this.completed = false;
        this.itemOfChoice = false;
        this.repeatable = false;
        this.category = 0;
    }
    read(reader) {
        this.id = reader.readString();
        this.name = reader.readString();
        this.description = reader.readString();
        this.expiration = reader.readString();
        this.category = reader.readInt32();
        const requirementsLen = reader.readShort();
        this.requirements = new Array(requirementsLen);
        for (let i = 0; i < requirementsLen; i++) {
            this.requirements[i] = reader.readInt32();
        }
        const rewardsLen = reader.readShort();
        this.rewards = new Array(rewardsLen);
        for (let i = 0; i < rewardsLen; i++) {
            this.rewards[i] = reader.readInt32();
        }
        this.completed = reader.readBoolean();
        this.itemOfChoice = reader.readBoolean();
        this.repeatable = reader.readBoolean();
    }
    write(writer) {
        writer.writeString(this.id);
        writer.writeString(this.name);
        writer.writeString(this.description);
        writer.writeString(this.expiration);
        writer.writeInt32(this.category);
        writer.writeShort(this.requirements.length);
        for (const requirement of this.requirements) {
            writer.writeInt32(requirement);
        }
        writer.writeShort(this.rewards.length);
        for (const reward of this.rewards) {
            writer.writeInt32(reward);
        }
        writer.writeBoolean(this.completed);
        writer.writeBoolean(this.itemOfChoice);
        writer.writeBoolean(this.repeatable);
    }
    toString() {
        return `[QuestData] Name: ${this.name} - Id: ${this.id}\n
    Description: ${this.description}\n
    Expiration: ${this.expiration}\n
    Category: ${this.category}\n
    Requirements: ${this.requirements.toString()}\n
    Rewards: ${this.rewards.toString()}\n
    Completed: ${this.completed}\n
    ItemOfChoice: ${this.itemOfChoice}\n
    Repeatable: ${this.repeatable}`;
    }
}
exports.QuestData = QuestData;
