import { loadCareers, loadCitizenJobs } from "../DataLoader.js";
import { getRollerFromSeed } from "../rnd.js";

const _careersData = await loadCareers();
const _citizenJobs = await loadCitizenJobs();

export class ENUM_CAREERS {}

if (_careersData.careerMap) {
    for (const [key, value] of Object.entries(_careersData.careerMap)) {
        Object.defineProperty(ENUM_CAREERS, key, {
            get: () => value,
            enumerable: true,
            configurable: true
        });
    }
} else {
    for (const career of _careersData.careerList) {
        Object.defineProperty(ENUM_CAREERS, career, {
            get: () => career,
            enumerable: true,
            configurable: true
        });
    }
}

export function getCCs(career) {
    return _careersData.careerCharacteristics[career] || [];
}

export function citizenLifeJob(roller) {
    if (typeof roller === "undefined") {
        roller = getRollerFromSeed();
    }
    var roll1 = roller.d6(1), roll2 = roller.d6(1), roll3 = roller.d6(1);
    while (roll1.result > 3) { roll1 = roller.d6(1); }
    var job = _citizenJobs[roll1.result - 1][roll2.result - 1][roll3.result - 1];
    return { rolls: [roll1.result, roll2.result, roll3.result], job: job };
}

export function agentUnderCover(roller) {
    if (typeof roller === "undefined") {
        roller = getRollerFromSeed();
    }
    var roll1 = roller.d6(1), roll2 = roller.d6(1), roll3 = roller.d6(1);
    while (roll1.result > 3) { roll1 = roller.d6(1); }
    while (roll3.result > 4) { roll3 = roller.d6(1); }
    var ucjobList = [
        [ [], [], [], [], [], [] ],
        [ [], [], [], [], [], [] ],
        [ [], [], [], [], [], [] ]
    ];
    var ucJob = ucjobList[roll1.result - 1][roll2.result - 1][roll3.result - 1];
    return { rolls: [roll1.result, roll2.result, roll3.result], ucJob: ucJob };
}

export var CareerSkillTables = _careersData.careerSkillTables;
export var ServiceBranchMods = _careersData.serviceBranchMods;
export var CareerBenefitTables = _careersData.careerBenefitTables;
