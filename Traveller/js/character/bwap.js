import { CLASS_SPECIES, ENUM_CHARACTERISTICS } from "./species.js";

export class bwap extends CLASS_SPECIES {
    static get BaseSenses() { return ["V-16-RGB", "H-14-7573", "S-14-04", "T-20-03"]; }
    static get SpeciesName() { return "Bwap"; }
    static get StatProfile() { return "SAVIES"; }
    static get Height() { return "1.4m"; }
    static get Weight() { return "45kg"; }
    static get Notes() { return "1d6 Stealth"; }
    static get Genders() {
        return {
            "F": {
                Characteristics: [
                    { nD: 0, Mod: 0 },
                    { nD: 0, Mod: 0 },
                    { nD: 0, Mod: 0 },
                    { nD: 0, Mod: 0 },
                    { nD: 0, Mod: 0 },
                    { nD: 0, Mod: 0 }
                ]
            },
            "M": {
                Characteristics: [
                    { nD: 0, Mod: 0 },
                    { nD: 0, Mod: -3 },
                    { nD: 0, Mod: 3 },
                    { nD: 0, Mod: 0 },
                    { nD: 0, Mod: 0 },
                    { nD: 0, Mod: 0 }
                ]
            }
        };
    }
    static get Castes() {
        return {
            "N/A": {
                Characteristics: [
                    { nD: 0, Mod: 0 },
                    { nD: 0, Mod: 0 },
                    { nD: 0, Mod: 0 },
                    { nD: 0, Mod: 0 },
                    { nD: 0, Mod: 0 },
                    { nD: 0, Mod: 0 }
                ]
            }
        };
    }
    static get Characteristics() {
        return [
            { name: ENUM_CHARACTERISTICS.STR, nD: 1 },
            { name: ENUM_CHARACTERISTICS.AGI, nD: 4 },
            { name: ENUM_CHARACTERISTICS.VIG, nD: 2 },
            { name: ENUM_CHARACTERISTICS.INT, nD: 2 },
            { name: ENUM_CHARACTERISTICS.EDU, nD: 2 },
            { name: ENUM_CHARACTERISTICS.SOC, nD: 2 }
        ];
    }
    static get GenderTable() {
        // 90/10 M/F ratio; rolls of 2 or 3 produce Female (3/36 = ~8.3%), 4-12 produce Male (~91.7%)
        return [
            "F", // 2
            "F", // 3
            "M", // 4
            "M", // 5
            "M", // 6
            "M", // 7
            "M", // 8
            "M", // 9
            "M", // 10
            "M", // 11
            "M"  // 12
        ];
    }
    static get CasteTable() {
        return [
            "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A"
        ];
    }
    static get LifeStageTerms() {
        return [
            0.5, // 0 (0-2 yrs)
            1.5, // 1 (2-8 yrs)
            1.5, // 2 (8-14 yrs) -> Stage 3 (Career) starts at 14
            1.5, // 3 (14-20 yrs)
            1.5, // 4 (20-26 yrs) -> Stage 5 (Physical aging) starts at 26
            2,   // 5 (26-34 yrs)
            2,   // 6 (34-42 yrs)
            2,   // 7 (42-50 yrs)
            2,   // 8 (50-58 yrs) -> Stage 9 (Mental aging) starts at 58
            2    // 9 (58+ yrs)
        ];
    }
}
