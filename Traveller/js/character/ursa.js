import { CLASS_SPECIES, ENUM_CHARACTERISTICS } from "./species.js";

export class ursa extends CLASS_SPECIES {
    static get BaseSenses() { return ["V-18-RGB", "H-18-9382", "S-22-04", "T-06-02"]; }
    static get SpeciesName() { return "Ursa"; }
    static get StatProfile() { return "SDEITS"; }
    static get Height() { return "2m"; }
    static get Weight() { return "350kg"; }
    static get Notes() { return "Rage"; }
    static get Genders() {
        return {
            "F": {
                Characteristics: [
                    { nD: 0, Mod: 2 },
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
                    { nD: 0, Mod: 0 },
                    { nD: 0, Mod: 0 },
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
            { name: ENUM_CHARACTERISTICS.STR, nD: 3, Mod: 2 },
            { name: ENUM_CHARACTERISTICS.DEX, nD: 2 },
            { name: ENUM_CHARACTERISTICS.END, nD: 2 },
            { name: ENUM_CHARACTERISTICS.INT, nD: 2 },
            { name: ENUM_CHARACTERISTICS.TRA, nD: 2 },
            { name: ENUM_CHARACTERISTICS.SOC, nD: 1 }
        ];
    }
    static get GenderTable() {
        return [
            "F", "M", "F", "F", "M", "M", "F", "F", "M", "F", "M"
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
            2,   // 1 (2-10 yrs)
            2,   // 2 (10-18 yrs) -> Stage 3 (Career) starts at 18
            2,   // 3 (18-26 yrs)
            2,   // 4 (26-34 yrs) -> Stage 5 (Physical aging) starts at 34
            2,   // 5 (34-42 yrs)
            2,   // 6 (42-50 yrs)
            2,   // 7 (50-58 yrs)
            2,   // 8 (58-66 yrs) -> Stage 9 (Mental aging) starts at 66
            2    // 9 (66+ yrs)
        ];
    }
}
