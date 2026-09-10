import { CLASS_SPECIES } from "./species.js";
import { loadSpecies } from "../DataLoader.js";

const _data = await loadSpecies("aslan");

export class aslan extends CLASS_SPECIES {
    static get BaseSenses() { return _data.baseSenses; }
    static get SpeciesName() { return _data.speciesName; }
    static get NativeLanguage() { return _data.nativeLanguage; }
    static get StatProfile() { return _data.statProfile; }
    static get Height() { return _data.height; }
    static get Weight() { return _data.weight; }
    static get Notes() { return _data.notes; }
    static get Genders() { return _data.genders; }
    static get Castes() { return _data.castes; }
    static get Characteristics() { return _data.characteristics; }
    static get GenderTable() { return _data.genderTable; }
    static get CasteTable() { return _data.casteTable; }
    static get LifeStageTerms() { return _data.lifeStageTerms; }
}
