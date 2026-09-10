import { loadSkills } from "../DataLoader.js";

const _skillsData = await loadSkills();

export class ENUM_SKILLS {}

if (_skillsData.skillMap) {
    for (const [key, value] of Object.entries(_skillsData.skillMap)) {
        Object.defineProperty(ENUM_SKILLS, key, {
            get: () => value,
            enumerable: true,
            configurable: true
        });
    }
} else {
    for (const skill of _skillsData.skills) {
        const key = skill.replace(/[^a-zA-Z0-9]/g, "");
        Object.defineProperty(ENUM_SKILLS, key, {
            get: () => skill,
            enumerable: true,
            configurable: true
        });
    }
}

export var StarshipSkills = _skillsData.categories.StarshipSkills;
export var TradeSkills = _skillsData.categories.TradeSkills;
export var ArtSkills = _skillsData.categories.ArtSkills;
export var SoldierSkills = _skillsData.categories.SoldierSkills;
export var Knowledges = _skillsData.knowledges;
