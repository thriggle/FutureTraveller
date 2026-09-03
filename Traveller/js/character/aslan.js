import { CLASS_SPECIES, ENUM_CHARACTERISTICS } from "./species.js";

export class aslan extends CLASS_SPECIES {
    static get BaseSenses() { return ["V-16-RGB", "H-18-8474", "S-18-03", "T-12-03"]; }
    static get SpeciesName() { return "Aslan"; }
    static get StatProfile() { return "SDSIES"; }
    static get Height() { return "2m"; }
    static get Weight() { return "100kg"; }
    static get Notes() { return ""; }
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
                    { nD: 0, Mod: 2 },
                    { nD: 0, Mod: -2 },
                    { nD: 0, Mod: 2 },
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
            { name: ENUM_CHARACTERISTICS.STR, nD: 2 },
            { name: ENUM_CHARACTERISTICS.DEX, nD: 2 },
            { name: ENUM_CHARACTERISTICS.STA, nD: 2 },
            { name: ENUM_CHARACTERISTICS.INT, nD: 2 },
            { name: ENUM_CHARACTERISTICS.EDU, nD: 2 },
            { name: ENUM_CHARACTERISTICS.SOC, nD: 2 }
        ];
    }
    static get GenderTable() {
        return [
            "F", // 2
            "M", // 3
            "F", // 4
            "F", // 5
            "M", // 6
            "M", // 7
            "F", // 8
            "F", // 9
            "M", // 10
            "F", // 11
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
            4.5, // 3 (14-32 yrs)
            4.5, // 4 (32-50 yrs) -> Stage 5 (Physical aging) starts at 50
            1,   // 5 (50-54 yrs)
            1,   // 6 (54-58 yrs)
            1,   // 7 (58-62 yrs)
            1,   // 8 (62-66 yrs) -> Stage 9 (Mental aging) starts at 66
            1    // 9 (66+ yrs)
        ];
    }
}
