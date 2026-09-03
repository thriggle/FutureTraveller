import { human } from "./human.js";
import { aslan } from "./aslan.js";
import { bwap } from "./bwap.js";
import { ursa } from "./ursa.js";
import { vargr } from "./vargr.js";
import { zhodani } from "./zhodani.js";

export { human, aslan, bwap, ursa, vargr, zhodani };

export const SpeciesRegistry = {
    human: human,
    aslan: aslan,
    bwap: bwap,
    ursa: ursa,
    vargr: vargr,
    zhodani: zhodani
};

export const SpeciesList = [
    { id: "human", name: human.SpeciesName, species: human, profile: human.StatProfile, height: human.Height, weight: human.Weight, notes: human.Notes, language: human.NativeLanguage },
    { id: "aslan", name: aslan.SpeciesName, species: aslan, profile: aslan.StatProfile, height: aslan.Height, weight: aslan.Weight, notes: aslan.Notes, language: aslan.NativeLanguage },
    { id: "bwap", name: bwap.SpeciesName, species: bwap, profile: bwap.StatProfile, height: bwap.Height, weight: bwap.Weight, notes: bwap.Notes, language: bwap.NativeLanguage },
    { id: "ursa", name: ursa.SpeciesName, species: ursa, profile: ursa.StatProfile, height: ursa.Height, weight: ursa.Weight, notes: ursa.Notes, language: ursa.NativeLanguage },
    { id: "vargr", name: vargr.SpeciesName, species: vargr, profile: vargr.StatProfile, height: vargr.Height, weight: vargr.Weight, notes: vargr.Notes, language: vargr.NativeLanguage },
    { id: "zhodani", name: zhodani.SpeciesName, species: zhodani, profile: zhodani.StatProfile, height: zhodani.Height, weight: zhodani.Weight, notes: zhodani.Notes, language: zhodani.NativeLanguage }
];

export function getSpecies(key) {
    if (typeof key === "string") {
        var lower = key.trim().toLowerCase();
        if (SpeciesRegistry[lower]) {
            return SpeciesRegistry[lower];
        }
        for (var i = 0; i < SpeciesList.length; i++) {
            if (SpeciesList[i].name.toLowerCase() === lower) {
                return SpeciesList[i].species;
            }
        }
    }
    return human;
}
