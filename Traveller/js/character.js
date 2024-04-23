import { getRollerFromSeed } from "./rnd.js";
import { human } from "./character/human.js";
import { ENUM_CHARACTERISTICS } from "./character/species.js";
import {CLASS_SPECIES} from "./character/species.js";
import { SoldierSkills, StarshipSkills, ENUM_SKILLS, ENUM_SKILLS as MasterSkills, Knowledges as KnowledgeSpecialties, ArtSkills, TradeSkills } from "./character/skills.js";
import { getDialog, dialogCallback, pickOption, pickSkill } from "./character/dialog.js";
import { ENUM_CAREERS, getCCs, citizenLifeJob, CareerSkillTables, CareerBenefitTables, ServiceBranchMods} from "./character/careers.js";

export function createCharacter(roller, species){
    if(typeof roller === "undefined"){
        roller = getRollerFromSeed();
    }
    
    if(typeof species === "undefined"){
        species = human;
    }
    var agingCrises = 0;
    var name = "J. Doe";
    var majors = [], minors = [], history = [];
    var nativeLanguage = "Anglic";
    var languageReceipts = 0; var edu_waivers = 0; var awards = [];
    var sanity = 0;
    var musteredOut = false;
   var defaultSkills = [
        MasterSkills.Actor, MasterSkills.Artist, MasterSkills.Athlete, 
        MasterSkills.Author, MasterSkills.Comms, MasterSkills.Computer, 
        MasterSkills.Driver, MasterSkills.Fighter, MasterSkills.Mechanic, 
        MasterSkills.Steward, MasterSkills.VaccSuit];
    var skills = {};
    for(var i = 0, len = defaultSkills.length; i < len; i++){
        skills[defaultSkills[i]] = {"Skill":0,"Knowledge":{}};
    }
    var gunner = MasterSkills.Gunner;
    skills[gunner] = {"Skill":-1,"Knowledge":{"Turrets":0}}; // Turrets (but not Gunner) is also a default skill
    var lang = {}; lang[nativeLanguage] = 0;
    skills[MasterSkills.Language] = {"Skill":-1,"Knowledge":lang};
    var genderRoll = roller.d6(2), casteRoll = roller.d6(2);
    var genderKey = species.GenderTable[genderRoll.result-2];
    var gender = species.Genders[genderKey];
    var casteKey = species.CasteTable[casteRoll.result-2];
    var caste = species.Castes[casteKey];
    var age = 0, isForcedGrowthClone = false;
    var careers = [], CCs = [];
    var fame = 0, credits = 0, fameFluxApplied = false, finalFameRoll = false;
    var merchantShipShareReceiptLevel = 1, shipShares = 0;
    var job = {skill:undefined,knowledge:undefined}, hobby = {skill:undefined,knowledge:undefined}, lastCitLifeReceipt = undefined;
    var statRollResults = rollStats();
    var characteristics = statRollResults.characteristics, genetics = statRollResults.genetics;
    var fameMusterOutBonus = false;
    var fameFlux = 0;
    var resignationDeclined = false;
    function resetVariables(){
        careers = [], CCs = []; edu_waivers = 0; 
        fame = 0, credits = 0; languageReceipts = 0;
        job = {skill:undefined,knowledge:undefined}, hobby = {skill:undefined,knowledge:undefined}, lastCitLifeReceipt = undefined;
        merchantShipShareReceiptLevel = 1, shipShares = 0;
        age = 0; musteredOut = false; agingCrises = 0;
        fameFluxApplied = false, finalFameRoll = false;
        fameMusterOutBonus = false, fameFlux = 0;
        resignationDeclined = false;
    }
    function addToReserves(service){
        var reserve = service + " Reserves";
        if(awards.indexOf(reserve) === -1){awards.push(reserve);}
    }
    function rollStats(){
        var statRolls = [
            roller.d6(species.Characteristics[0].nD + gender.Characteristics[0].nD + caste.Characteristics[0].nD),
            roller.d6(species.Characteristics[1].nD + gender.Characteristics[1].nD + caste.Characteristics[1].nD),
            roller.d6(species.Characteristics[2].nD + gender.Characteristics[2].nD + caste.Characteristics[2].nD),
            roller.d6(species.Characteristics[3].nD + gender.Characteristics[3].nD + caste.Characteristics[3].nD),
            roller.d6(species.Characteristics[4].nD + gender.Characteristics[4].nD + caste.Characteristics[4].nD),
            roller.d6(species.Characteristics[5].nD + gender.Characteristics[5].nD + caste.Characteristics[5].nD),
            roller.d6(2) // sanity
        ];
        var characteristics = [
            {name:species.Characteristics[0].name,value:statRolls[0].result + gender.Characteristics[0].Mod + caste.Characteristics[0].Mod},
            {name:species.Characteristics[1].name,value:statRolls[1].result + gender.Characteristics[1].Mod + caste.Characteristics[1].Mod},
            {name:species.Characteristics[2].name,value:statRolls[2].result + gender.Characteristics[2].Mod + caste.Characteristics[2].Mod},
            {name:species.Characteristics[3].name,value:statRolls[3].result + gender.Characteristics[3].Mod + caste.Characteristics[3].Mod},
            {name:species.Characteristics[4].name,value:statRolls[4].result + gender.Characteristics[4].Mod + caste.Characteristics[4].Mod},
            {name:species.Characteristics[5].name,value:statRolls[5].result + gender.Characteristics[5].Mod + caste.Characteristics[5].Mod},
        ], genetics = [
            statRolls[0].rolls[0],
            statRolls[1].rolls[0],
            statRolls[2].rolls[0],
            statRolls[3].rolls[0],
        ];
        sanity = undefined; //statRolls[6].result;
        if(species.Characteristics[4].name == ENUM_CHARACTERISTICS.INS){ genetics.push(statRolls[4].rolls[0]);}
        skills[MasterSkills.Language].Knowledge[nativeLanguage] = 0;
        resetVariables();
        return {statRolls, characteristics, genetics}
    }
    function getShipShares(){
        return shipShares;
    }
    function fameFluxEvent(updateFunc){
        if(!fameFluxApplied){
            fameFluxApplied = true;
            var fluxResult = roller.flux();
            record("Fame Flux Event: [" + fluxResult.rolls.join("-") + "] = " +fluxResult.result);
            var change = fluxResult.result;
            var fameWasLessThanNineteen = fame < 19;
            fameFlux += change;
            if(change < 0){ 
                record("Fame decreased by " + change+".");
                updateFunc();
            }else if(change === 0){
                record("Fame is unchanged.");
                updateFunc();
            }else{
                record("Fame increased by " + change+".");
                updateFunc();
                if(fameWasLessThanNineteen && calculateFame() >= 19 && musteredOut){
                    claimFameMusterOutBonus(updateFunc,true,function(){
                        record("Ready to begin adventuring!");
                        updateFunc();
                    });
                }
            }
        }else{
            record("Fame Flux Event already occurred.");
            updateFunc();
        }
    }
    function calculateFame(){
        var totalFame = 0;
        var highestSourceOfFame = 0;
        for(var i = 0, len = careers.length; i < len; i++){
            var career = careers[i];
            var careerFame = 0;
            switch(career.career){
                case ENUM_CAREERS.Scout:
                    for(var j = 0, jlen = career.awards.length; j < jlen; j++){
                        var award = career.awards[j];
                        switch(award){
                            case "Fame +2": careerFame += 2; break;
                            case "Discovery": careerFame += 4; break;
                        }
                    }
                    break;
                case ENUM_CAREERS.Craftsman:
                    for(var j = 0, jlen = career.awards.length; j < jlen; j++){
                        var award = career.awards[j];
                        if(award.indexOf("Perfect Masterpiece") >= 0){
                            careerFame += 5;
                        }else if(award.indexOf("Masterpiece") >= 0){
                            careerFame += 3;
                        }
                    }
                break;
                case ENUM_CAREERS.Citizen:
                    break;
                case ENUM_CAREERS.Soldier:
                case ENUM_CAREERS.Spacer:
                case ENUM_CAREERS.Marine:
                    var base = career.rank.officer;
                    careerFame += base;
                    if(base > 0){
                    for(var j = 0, jlen = career.awards.length; j < jlen; j++){
                        var award = career.awards[j];
                        switch(award){
                            case "Wound Badge": careerFame += 1; break;
                            case "MCUF": careerFame += 1; break;
                            case "MCG": careerFame += 2; break;
                            case "SEH": careerFame += 3; break;
                            case "*SEH*": careerFame += 4; break;
                        }
                    }
                    }
                    break;
                case ENUM_CAREERS.Merchant:
                    var base = career.rank.officer;
                    careerFame += base;
                    if(shipShares >= 2 && musteredOut){
                        if(typeof career.shipfame == "undefined"){
                            career.shipfame = roller.d6(1).result;
                            record("Became owner of a ship (up to "+(shipShares * 50)+" tons). Ship Fame = ["+career.shipfame+"]");
                        }
                        careerFame += career.shipfame;
                    }
                    break;
            }
            if(careerFame > highestSourceOfFame){
                highestSourceOfFame = careerFame;
            }
            career.fame = careerFame;
            if(totalFame < 20 && totalFame + careerFame <= 20){
                totalFame += careerFame;
            }else{
                totalFame = 20;
            }
        }
        if(highestSourceOfFame > 20){ totalFame = highestSourceOfFame; }
        if(highestSourceOfFame == 0 && musteredOut){
            if(!finalFameRoll){
                finalFameRoll = true;
                fameFlux = roller.d6(1).result;
                record("Absent any other source of fame, Fame = ["+fameFlux+"]");
            }
        }
        return Math.min(36,totalFame + fameFlux);
    }
    function initStats(stats, geneticValues){
       characteristics = [
            {name:species.Characteristics[0].name,value:stats[0]},
            {name:species.Characteristics[1].name,value:stats[1]},
            {name:species.Characteristics[2].name,value:stats[2]},
            {name:species.Characteristics[3].name,value:stats[3]},
            {name:species.Characteristics[4].name,value:stats[4]},
            {name:species.Characteristics[5].name,value:stats[5]}
        ];
        sanity = undefined;// roller.d6(2).result;
        genetics = geneticValues.slice(0,4);
        skills[MasterSkills.Language].Knowledge[nativeLanguage] = 0;
        if(species.Characteristics[4].name === ENUM_CHARACTERISTICS.INS){ genetics.push(geneticValues[4]);}
        record("Initial UPP: "+ characteristics[0].value + "," +  characteristics[1].value + "," + characteristics[2].value + "," + 
            characteristics[3].value + "," + characteristics[4].value + "," + characteristics[5].value
        );
        resetVariables();
    }
    function getCharacteristics(){
        return characteristics;
    }
    function record(message){
        history.push("Age " + age+ ": " + message);
    }
    function rollStatsFromGenes(genes){
        var gene_statRolls = [];
        genetics = [];
        for(var i = 0, len = genes.length; i < len; i++){
            if(typeof genes[i] === "undefined" || genes[i] === "Random"){
                gene_statRolls.push(roller.d6(species.Characteristics[i].nD + gender.Characteristics[i].nD + caste.Characteristics[i].nD));
                
            }else{
                genes[i] = +(genes[i]);
                var temp = roller.d6(species.Characteristics[i].nD + gender.Characteristics[i].nD + caste.Characteristics[i].nD - 1);
                temp.result += genes[i]; temp.rolls = [genes[i]].concat(temp.rolls);
                gene_statRolls.push(temp);
            }
            if( i < 4 || species.Characteristics[i] === ENUM_CHARACTERISTICS.INS){
                genetics.push(gene_statRolls[i].rolls[0])
            }
        }
        for(;i<6; i++){
            gene_statRolls.push(roller.d6(species.Characteristics[i].nD + gender.Characteristics[i].nD + caste.Characteristics[i].nD))
            if( i < 4 || species.Characteristics[i] === ENUM_CHARACTERISTICS.INS){
                genetics.push(gene_statRolls[i].rolls[0])
            }
        }
        var gene_characteristics = [
            {name:species.Characteristics[0].name,value:gene_statRolls[0].result + gender.Characteristics[0].Mod + caste.Characteristics[0].Mod},
            {name:species.Characteristics[1].name,value:gene_statRolls[1].result + gender.Characteristics[1].Mod + caste.Characteristics[1].Mod},
            {name:species.Characteristics[2].name,value:gene_statRolls[2].result + gender.Characteristics[2].Mod + caste.Characteristics[2].Mod},
            {name:species.Characteristics[3].name,value:gene_statRolls[3].result + gender.Characteristics[3].Mod + caste.Characteristics[3].Mod},
            {name:species.Characteristics[4].name,value:gene_statRolls[4].result + gender.Characteristics[4].Mod + caste.Characteristics[4].Mod},
            {name:species.Characteristics[5].name,value:gene_statRolls[5].result + gender.Characteristics[5].Mod + caste.Characteristics[5].Mod},
        ];
        for(var i = 0, len = gene_characteristics.length; i < len; i++){
            characteristics[i].value = gene_characteristics[i].value
            characteristics[i].name = gene_characteristics[i].name
        }
        sanity = undefined; //roller.d6(2).result;
        skills[MasterSkills.Language].Knowledge[nativeLanguage] = 0;
        record("Initial UPP: "+ characteristics[0].value + "," +  characteristics[1].value + "," + characteristics[2].value + "," + 
            characteristics[3].value + "," + characteristics[4].value + "," + characteristics[5].value
        );
        resetVariables();
    }
    function addMajor(skill,knowledge){
        var hasAlready = false;
        for(var i = 0, len = majors.length; i < len; i++){
            if(majors[i].skill === skill){
                if(typeof knowledge == "undefined"){
                    if(typeof majors[i].knowledge == "undefined"){ hasAlready = true }
                }else{
                    if(typeof majors[i].knowledge !== "undefined" && majors[i].knowledge === knowledge){
                        hasAlready = true;
                    }
                }
            }
        }
        if(!hasAlready){
            majors.push({skill:skill,knowledge:knowledge});
           record("Acquired " + skill + (typeof knowledge == "undefined" ? "" : " ("+ knowledge+")") + " as a Major.")
        }
    }
    function addMinor(skill,knowledge){
        var hasAlready = false;
        for(var i = 0, len = minors.length; i < len; i++){
            if(minors[i].skill === skill){
                if(typeof knowledge == "undefined"){
                    if(typeof minors[i].knowledge == "undefined"){ hasAlready = true }
                }else{
                    if(typeof minors[i].knowledge !== "undefined" && minors[i].knowledge === knowledge){
                        hasAlready = true;
                    }
                }
            }
        }
        if(!hasAlready){
            minors.push({skill:skill,knowledge:knowledge});
           record("Acquired " + skill + (typeof knowledge == "undefined" ? "" : " ("+ knowledge+")") + " as a Minor.")
        }
    }
    function gainSkill(skill){
        if(typeof skills[skill] != "undefined"){
            if(skills[skill].Skill >= 0){
                if(skills[skill].Skill == 15){
                }else{
                    skills[skill].Skill += 1;
                }
            }else{
                skills[skill].Skill = 1;
            }
        }else{
            skills[skill] = {Skill:1,Knowledge:{}}
        }
    }
    function gainKnowledge(skill,knowledge){
        if(typeof skills[skill] != "undefined"){
            if(skills[skill].Knowledge[knowledge] >= 0 ){
                skills[skill].Knowledge[knowledge] += 1;
            }else{
                skills[skill].Knowledge[knowledge] = 1;
            }
        }else{
            skills[skill] = {Skill:0,Knowledge:{}}
            skills[skill].Knowledge[knowledge] = 1;
        }
    }
    function gainSkillOrKnowledge(skill,knowledge,isEducation,premark){
        var remarks = (typeof premark == "undefined" ? "" : (premark + " "));
        if(typeof skill !== "undefined" && skill == ENUM_SKILLS.Language){
            remarks += gainLanguage(knowledge, isEducation);
        }else{
            if(typeof knowledge == "undefined" || knowledge == "undefined"){ // if no knowledge specified, just increase skill
                if(typeof skills[skill] != "undefined"){
                    if(skills[skill].Skill >= 0){
                        if(skills[skill].Skill < 15){
                            skills[skill].Skill += 1;
                            remarks += "Gained " + skill + "-" + skills[skill].Skill + ". ";
                        }else{
                            remarks += skill+" was not increased as it is already at maximum level.";
                        }
                    }else{
                        skills[skill].Skill = 1;
                        remarks += "Gained " + skill + "-" + skills[skill].Skill + ". ";
                    }
                }else{
                    skills[skill] = {Skill:1,Knowledge:{}};
                    remarks += "Gained " + skill + "-" + skills[skill].Skill + ". ";
                }
            }else{
                if(typeof skills[skill] == "undefined"){ // if we don't have this skill at all, gain the knowledge
                    var k = {}; k[knowledge] = 1;
                    skills[skill] = {Skill:-1,Knowledge:k};
                    remarks += "Gained " + skill + "("+knowledge + ")-" + skills[skill].Knowledge[knowledge] + ". ";
                }else if(isEducation || skill === ENUM_SKILLS.Science || skill === "World" || skill == "Career"){ // if this is during education, only increase K
                    if(skills[skill].Knowledge[knowledge]){  // if we already have the knowledge
                        if(skills[skill].Knowledge[knowledge] < 6){ // and we haven't reached the cap
                            skills[skill].Knowledge[knowledge] += 1; // increase it by 1
                            remarks += "Gained " + skill + "("+knowledge + ")-" + skills[skill].Knowledge[knowledge] + ". ";
                        }else if( skill === ENUM_SKILLS.Science){ // if we have reached the cap and it's a science, gain a specialty instead
                            var spec_counter = 0;
                            var specialty_name = knowledge;
                            while(skills[skill].Knowledge[specialty_name] && skills[skill].Knowledge[specialty_name] === 6){
                                spec_counter += 1;
                                specialty_name = knowledge + " Specialty " + spec_counter;
                            }
                            if(skills[skill].Knowledge[specialty_name]){
                                skills[skill].Knowledge[specialty_name] += 1;
                                remarks += "Gained " + skill + "("+specialty_name + ")-" + skills[skill].Knowledge[specialty_name] + ". ";
                            }else{
                                skills[skill].Knowledge[specialty_name] = 1;
                                remarks += "Gained " + skill + "("+specialty_name + ")-" + skills[skill].Knowledge[specialty_name] + ". ";
                            }
                        }else{
                            remarks += knowledge+" was not increased as it is already at maximum level.";
                        }
                    }else{
                        skills[skill].Knowledge[knowledge] = 1; // if we don't have the knowledge, gain a rank
                        remarks += "Gained " + skill + "("+knowledge + ")-" + skills[skill].Knowledge[knowledge] + ". ";
                    }
                }else{ // we have the base skill, check the knowledge count to see if we can increase S or only K
                    var kcount = 0;
                    var ks = skills[skill].Knowledge;
                    for(var key in ks){
                        var level = skills[skill].Knowledge[key];
                        kcount += level;
                    }
                    
                    // increase knowledge
                    if(typeof skills[skill].Knowledge[knowledge] == "undefined"){
                        skills[skill].Knowledge[knowledge] = 1;
                        remarks += "Gained " + skill + "("+knowledge + ")-" + skills[skill].Knowledge[knowledge] + ". ";
                    }else if(skills[skill].Knowledge[knowledge] < 6){
                        skills[skill].Knowledge[knowledge] += 1;
                        remarks += "Gained " + skill + "("+knowledge + ")-" + skills[skill].Knowledge[knowledge] + ". ";
                    }else{
                        if(kcount >= 2 && skills[skill].Skill < 15){
                            // increase skill
                            if(skills[skill].Skill <= 0){ 
                                skills[skill].Skill = 1;
                                remarks += "Gained " + skill + "-" + skills[skill].Skill + ". ";
                            }else{
                                skills[skill].Skill += 1;
                                remarks += "Gained " + skill + "-" + skills[skill].Skill + ". ";
                            }
                        }else{
                            remarks += knowledge+" was not increased as it is already at maximum level.";
                        }
                    }
                }
            }
        }
       record(remarks);
        return remarks;
    }
    function gainSkillsFromHomeworldTradeCodes(codes, callback, index, notes){
        var codeArray = typeof codes == "string" ? codes.split(" ") : codes;
        if(codes == "" && typeof index == "undefined"){ notes = "No skills received from homeworld.";record(notes);}
        if(typeof index === "undefined"){ index = 0;}
        if(typeof notes === "undefined"){ notes = "";}
        if(index === codeArray.length || codeArray.length === 0 || (codeArray.length == 1 && codeArray[0] == "")){
            return function(){
                callback(notes);
            };
        }else{
            var promptfunc = () => {};
            var code = codeArray[index];
            var skill = "";
            var note = code + " trade code on homeworld provides ";
            switch(code){
                case "Ag": promptfunc = gainSkillWithPromptForKnowledge; skill = ENUM_SKILLS.Animals; note += skill; break;
                case "As": promptfunc = gainSkillWithPromptForKnowledge; skill = ENUM_SKILLS.ZeroG; note += skill; break;
                case "Co": promptfunc = gainSkillWithPromptForKnowledge; skill = ENUM_SKILLS.HostileEnviron; note += skill; break;
                case "Cp": promptfunc = gainSkillWithPromptForKnowledge; skill = ENUM_SKILLS.Admin; note += skill; break;
                case "Cs": promptfunc = gainSkillWithPromptForKnowledge; skill = ENUM_SKILLS.Bureaucrat; note += skill; break;
                case "Cx": promptfunc = gainSkillWithPromptForKnowledge; skill = ENUM_SKILLS.Language; note += skill; break;
                case "Da": promptfunc = gainSkillWithPromptForKnowledge; skill = ENUM_SKILLS.Fighter; note += skill; break;
                case "De": promptfunc = gainSkillWithPromptForKnowledge; skill = ENUM_SKILLS.Survival; note += skill; break;
                case "Ds": promptfunc = gainSkillWithPromptForKnowledge; skill = [ENUM_SKILLS.VaccSuit,ENUM_SKILLS.ZeroG]; note+=skill.join(", "); break;
                case "Fa": promptfunc = gainSkillWithPromptForKnowledge; skill = ENUM_SKILLS.Animals; note += skill; break;
                case "Fl": promptfunc = gainSkillWithPromptForKnowledge; skill = ENUM_SKILLS.HostileEnviron; note += skill; break;
                case "Fr": promptfunc = gainSkillWithPromptForKnowledge; skill = ENUM_SKILLS.HostileEnviron; note += skill; break;
                case "Ga": promptfunc = gainSkillWithPromptForKnowledge; skill = ENUM_SKILLS.Trader; note += skill; break;
                case "He": promptfunc = gainSkillWithPromptForKnowledge; skill = ENUM_SKILLS.HostileEnviron; note += skill; break;
                case "Hi": promptfunc = gainSkillWithPromptForKnowledge; skill = ENUM_SKILLS.Streetwise; note += skill; break;
                case "Ho": promptfunc = gainSkillWithPromptForKnowledge; skill = ENUM_SKILLS.HostileEnviron; note += skill; break;
                case "Ic": promptfunc = gainSkillWithPromptForKnowledge; skill = ENUM_SKILLS.VaccSuit; note += skill; break;
                case "In": promptfunc = gainSkillWithPromptForCategory; skill = "TRADE"; note += "a skilled trade"; break;
                case "Lo": promptfunc = gainSkillWithPromptForKnowledge; skill = ENUM_SKILLS.Flyer; note += skill; break;
                case "Na": promptfunc = gainSkillWithPromptForKnowledge; skill = ENUM_SKILLS.Survey; note += skill; break;
                case "Ni": promptfunc = gainSkillWithPromptForKnowledge; skill = ENUM_SKILLS.Driver; note += skill; break;
                case "Oc": promptfunc = gainSkillWithPromptForKnowledge; skill = ENUM_SKILLS.HighG; note += skill; break;
                case "Pa": promptfunc = gainSkillWithPromptForKnowledge; skill = ENUM_SKILLS.Trader; note += skill; break;
                case "Pi": promptfunc = gainSkillWithPromptForKnowledge; skill = ENUM_SKILLS.JOT; note += skill; break;
                case "Po": promptfunc = gainSkillWithPromptForKnowledge; skill = ENUM_SKILLS.Steward; note += skill; break;
                case "Pr": promptfunc = gainSkillWithPromptForKnowledge; skill = ENUM_SKILLS.Craftsman; note += skill; break;
                case "Ri": promptfunc = gainSkillWithPromptForCategory; skill = "ART"; note += "an art skill";break;
                case "Tr": promptfunc = gainSkillWithPromptForKnowledge; skill = ENUM_SKILLS.Survival; note += skill; break;
                case "Tu": promptfunc = gainSkillWithPromptForKnowledge; skill = ENUM_SKILLS.Survival; note += skill; break;
                case "Tu": promptfunc = gainSkillWithPromptForKnowledge; skill = ENUM_SKILLS.Driver; note += skill; break;
                case "Va": promptfunc = gainSkillWithPromptForKnowledge; skill = ENUM_SKILLS.VaccSuit; note += skill; break;
                case "Wa": promptfunc = gainSkillWithPromptForKnowledge; skill = ENUM_SKILLS.Seafarer; note += skill; break;
                default: note += "no skills"; promptfunc = (n,s,next,ns)=>{ record(n); next(); }; break; 
            }
            note += ".";
            notes += note + "<br/>";
            var nextMethod = gainSkillsFromHomeworldTradeCodes(codeArray, callback, index + 1, notes);
            return function(){
                var text = promptfunc(note, skill, nextMethod, notes);
                notes += text;
            }
        }
    }
    function gainSkillWithPromptForCategory(prompt,skillCategory,callback){
        switch(skillCategory.toUpperCase()){
            case "ART": 
            pickOption(ArtSkills,prompt + " Choose an Art skill.",function(x){proceed(x);},true);
            break;
            case "TRADE": 
            pickOption(TradeSkills,prompt + " Choose a skilled Trade.",function(x){proceed(x);},true);
            break;
            case "SHIP":
                case "STARSHIP": 
                pickOption(StarshipSkills,prompt + " Choose a Starship Skill.",function(x){proceed(x);},true);
                break;
                case "SOLDIER": 
                pickOption(SoldierSkills,prompt + " Choose a Soldier Skill.",function(x){proceed(x);},true);
            break;
        }
        function proceed(chosenSkill){
            gainSkillWithPromptForKnowledge(prompt,chosenSkill,callback);
        }
    }
    function canGainBaseSkill(skill){
        var canIncrease = false;
        if(typeof skills[skill] == "undefined" || skill === ENUM_SKILLS.Language){
            canIncrease = false;
        }else{
            var kcount = 0;
            var ks = skills[skill].Knowledge;
            for(var key in ks){
                var level = skills[skill].Knowledge[key];
                kcount += level;
            }
            if(kcount >= 2 && skills[skill].Skill < 15){
                canIncrease = true;
            }
        }
        return canIncrease
    }
    function gainSkillWithPromptForKnowledge(prompt,skill,callback,isEducation){
        if(typeof isEducation == "undefined"){ isEducation = false;}
        if(typeof skill !== "string" && skill.length == 2){
                gainSkillWithPromptForKnowledge(prompt,skill[0],function(x){
                    gainSkillWithPromptForKnowledge(prompt,skill[1],callback);
                });
            
        }else{
            if(KnowledgeSpecialties[skill]){
                var specialties = KnowledgeSpecialties[skill].slice();
                if(canGainBaseSkill(skill)){
                    specialties = ["<!>Increase " + skill + " skill"].concat(specialties);
                    
                }else if(skill == ENUM_SKILLS.Language){
                    if(specialties.indexOf(nativeLanguage) >= 0){
                        specialties.splice(specialties.indexOf(nativeLanguage),1);
                    }
                }
                pickOption(specialties,prompt + " Choose a specialized "+skill+" knowledge.",function(x){ proceed(x); },true)
            }else{proceed(undefined);}
            function proceed(chosenKnowledge){
                var remarks = gainSkillOrKnowledge(skill,chosenKnowledge,isEducation, prompt);
                callback(prompt + " " + remarks);
            }
        }
        
    }
    function gainLanguage(language,isEducation){
        var remarks = "";
        if(isEducation){
            if(skills[ENUM_SKILLS.Language].Knowledge[language]){
                var currentLevel = skills[ENUM_SKILLS.Language].Knowledge[language];
                if(language === getNativeLanguage()){
                    currentLevel = getNativeLanguageLevel();
                }
                if(currentLevel < 14){
                    skills[ENUM_SKILLS.Language].Knowledge[language] += 2;
                    remarks = "Gained Language(" + language + ")-" + skills[ENUM_SKILLS.Language].Knowledge[language];
                }else if(currentLevel == 14){
                    skills[ENUM_SKILLS.Language].Knowledge[language] += 1;
                    remarks = "Gained Language(" + language + ")-" + skills[ENUM_SKILLS.Language].Knowledge[language];
                }else if(currentLevel >= 15){
                    remarks = "Language(" + language + ") cannot be increased further."
                }
            }else{
                skills[ENUM_SKILLS.Language].Knowledge[language] = 2;
                remarks = "Gained Language(" + language + ")-" + skills[ENUM_SKILLS.Language].Knowledge[language];
            }
        }else{
            if(language === nativeLanguage){
                remarks += "Cannot increase native language except through education.";
            }else{
                var nativeLanguageLevel = getNativeLanguageLevel();
                
                if(skills[ENUM_SKILLS.Language].Knowledge[language] && skills[ENUM_SKILLS.Language].Knowledge[language] < nativeLanguageLevel){
                    languageReceipts += 1;
                    skills[ENUM_SKILLS.Language].Knowledge[language] +=1;
                    remarks = "Gained Language(" + language + ")-" + skills[ENUM_SKILLS.Language].Knowledge[language];
                }else if(skills[ENUM_SKILLS.Language].Knowledge[language] && skills[ENUM_SKILLS.Language].Knowledge[language]>= nativeLanguageLevel){
                    remarks = "Language("+language+") cannot be increased further.";
                }else{
                    languageReceipts += 1;
                    skills[ENUM_SKILLS.Language].Knowledge[language] = nativeLanguageLevel-languageReceipts;
                    remarks = "Gained Language(" + language + ")-" + skills[ENUM_SKILLS.Language].Knowledge[language];
                }
            }
        }
        //record(remarks);
        return remarks;
    }
    function getNativeLanguageLevel(){
        var nativeLanguageSkill = characteristics[3].value;
        if(species.Characteristics[4].name == ENUM_CHARACTERISTICS.EDU && characteristics[4].value > characteristics[3].value){
            nativeLanguageSkill = characteristics[4].value;
        }
        nativeLanguageSkill += skills[MasterSkills.Language].Knowledge[nativeLanguage];
        nativeLanguageSkill = Math.min(nativeLanguageSkill,15);
        return nativeLanguageSkill;
    }
    function ED5(){
        var remarks = "";
        if(characteristics[4].name != ENUM_CHARACTERISTICS.EDU){
            remarks += "Character is ineligible for the ED5 program due to having " + characteristics[4].name + " instead of " + ENUM_CHARACTERISTICS.EDU+". ";
        }else if(characteristics[4].value >= 5){
            remarks += "Character is ineligible for the ED5 program due to having Education 5+.";
        }else{
            remarks += "ED5 Program to raise Edu from " + characteristics[4].value + " ";
            var result = checkCharacteristic(ENUM_CHARACTERISTICS.INT,2,0);
            if(result.success){ 
                characteristics[4].value = 5; 
                remarks += "to 5 succeeded! ";
            }else{
               remarks += "failed. ";
            }
            remarks += result.remarks;
        }
        record(remarks);
        
        return remarks;
    }
    function promptEducationWaiver(note){
        if(typeof note === "undefined"){ note = "";}else{ note += " "}
        var remarks = "";
        var success = false;
        if(characteristics[5].value - edu_waivers >= 2){
            var useWaiver = confirm(note + "Do you want to try to use an education waiver? (Current waiver value="+(characteristics[5].value - edu_waivers)+")");
            if(useWaiver){
                var result = check(characteristics[5].value - edu_waivers,2,0,"Education Waiver vs " + (characteristics[5].value - edu_waivers))
                edu_waivers += 1;
                success = result.success;
                remarks += result.remarks;
               record(note + remarks);
            }else{
                success = false;
                remarks = " Declined to try using an education waiver. ";
               record(note + remarks);
            }
        }else{
            success = false;
            remarks = " No education waivers available. ";
        }
        
        return {success:success,remarks:note + " " + remarks};
    }
    function TradeSchool(MajorSkill,MajorKnowledge){
        var newLine = "_";
        var remarks = "Trade School: " + newLine;
        if(characteristics[4].name != ENUM_CHARACTERISTICS.INS){
            var tryTradeSchool = true;
            if(characteristics[4].value < 5 || characteristics[4].name === ENUM_CHARACTERISTICS.TRA){
                tryTradeSchool = false;
                var waiverResult = promptEducationWaiver("Insufficient EDU to attend Trade School.");
                //history.push(waiverResult.remarks);
                remarks += waiverResult.remarks + newLine;
                tryTradeSchool = waiverResult.success;
            }
            if(tryTradeSchool){
                remarks += "Trade School Application: ";
                var applyResult = checkCharacteristic(ENUM_CHARACTERISTICS.INT,2,0,"Trade School Application 2D vs Intellect ("+characteristics[3].value+")");
                remarks +=  applyResult.remarks + newLine;
                record(applyResult.remarks);
                if(! applyResult.success){ 
                    var applyWaiverResult = promptEducationWaiver("Failed Trade School application.");
                    remarks += applyWaiverResult.remarks + newLine;
                    applyResult.success = applyWaiverResult.success;
                }
                if(applyResult.success){
                    var intScore = characteristics[3].value;
                    var eduScore = characteristics[4].value; if(characteristics[4].name == ENUM_CHARACTERISTICS.TRA){ eduScore = eduScore/2;}
                    var passResult = checkCharacteristic(intScore > eduScore ? ENUM_CHARACTERISTICS.INT : ENUM_CHARACTERISTICS.EDU,2,0);
                    remarks += "Trade School Pass/Fail: " + passResult.remarks + newLine;
                    record("Trade School Pass/Fail: " + passResult.remarks);
                    if(passResult.success){
                        gainSkillOrKnowledge(MajorSkill,MajorKnowledge,true,"Attended trade school.");
                        remarks += gainSkillOrKnowledge(MajorSkill,MajorKnowledge,true,"Attended trade school.") + newLine;
                        addMajor(MajorSkill,MajorKnowledge);
                        var honorsResult = checkCharacteristic(intScore > eduScore ? ENUM_CHARACTERISTICS.INT : ENUM_CHARACTERISTICS.EDU,2,0);
                        record("Honors program? " + honorsResult.remarks);
                        if(honorsResult.success){
                            remarks += gainSkillOrKnowledge(MajorSkill,MajorKnowledge,true,"Graduated with Honors.") + newLine;
                        }else{
                            record("Failed to achieve Honors.");
                        }
                    }
                    remarks += advanceAge(1);
                }else{
                    remarks += advanceAge(1);
                }
            }
        }else{
            remarks = "Character is ineligible for Trade School due to having " + characteristics[4].name + " instead of " + ENUM_CHARACTERISTICS.EDU+". ";
            record(remarks);
        }
        return remarks;
    }
    function TrainingCourse(MajorSkill,MajorKnowledge){
        var newLine = "_";
        var remarks = "Training Course: " + newLine;
        var Int_nD = species.Characteristics[3].nD;
        var nD = species.Characteristics[4].nD;
        if(characteristics[4].name != ENUM_CHARACTERISTICS.INS){
            var tryTradeSchool = true;
            if((characteristics[4].value < 5 && characteristics[4].name === ENUM_CHARACTERISTICS.TRA) || 
                (characteristics[4].value/2 < 5 && characteristics[4].name === ENUM_CHARACTERISTICS.EDU)){
                tryTradeSchool = false;
                var waiverResult = promptEducationWaiver("Insufficient TRA to attend Training Course.");
                //history.push(waiverResult.remarks);
                remarks += waiverResult.remarks + newLine;
                tryTradeSchool = waiverResult.success;
            }
            if(tryTradeSchool){
                remarks += "Training Course Application: ";
                var applyResult = checkCharacteristic(ENUM_CHARACTERISTICS.INT,Int_nD,0);
                remarks +=  applyResult.remarks + newLine;
                if(! applyResult.success){ 
                    var applyWaiverResult = promptEducationWaiver("Failed Training Course application.");
                    remarks += applyWaiverResult.remarks + newLine;
                    applyResult.success = applyWaiverResult.success;
                }
                if(applyResult.success){
                    var passResult = checkCharacteristic(ENUM_CHARACTERISTICS.TRA,nD,0);
                    remarks += "Training Course Pass/Fail: " + passResult.remarks + newLine;
                    record("Training Course Pass/Fail: " + passResult.remarks);
                    if(passResult.success){
                        gainSkillOrKnowledge(MajorSkill,MajorKnowledge,true,"Attended Training Course.");
                        remarks += gainSkillOrKnowledge(MajorSkill,MajorKnowledge,true,"Attended Training Course.") + newLine;
                        addMajor(MajorSkill,MajorKnowledge);
                        
                        var honorsResult = checkCharacteristic(ENUM_CHARACTERISTICS.TRA,nD,0);
                        remarks += "Honors program? " + honorsResult.remarks + newLine;
                        record("Honors program? " + honorsResult.remarks);
                        if(honorsResult.success){
                            remarks += gainSkillOrKnowledge(MajorSkill,MajorKnowledge,true,"Graduated with Honors.") + newLine;
                        }else{
                            record("Failed to achieve Honors.");
                        }
                    }
                    remarks += advanceAge(1);
                }else{
                    remarks += advanceAge(1);
                }
            }
        }else{
            remarks = "Character is ineligible for Training Course due to having " + characteristics[4].name + " instead of " + ENUM_CHARACTERISTICS.TRA+". ";
            record(remarks);
        }
        return remarks;
    }
    function Apprenticeship(skill,knowledge){
        var newLine = "_";
        var remarks = "";
        if(age > species.getFirstYearOfStage(3)){
            remarks += "Character ineligible for apprenticeship due to having passed the age of apprenticeship ("+species.getFirstYearOfStage(3)+").";
            record(remarks);
        }else{
            var result = checkCharacteristic(ENUM_CHARACTERISTICS.TRA,2,0);
            remarks = "Apprenticeship: " + result.remarks;
            record(remarks);
            if(result.success){
                gainSkillOrKnowledge(skill,knowledge,true,"Apprenticeship.");
                gainSkillOrKnowledge(skill,knowledge,true,"Apprenticeship.");
                gainSkillOrKnowledge(skill,knowledge,true,"Apprenticeship.");
                remarks += gainSkillOrKnowledge(skill,knowledge,true,"Apprenticeship.");
            }
        }
        return remarks;
    }
    function College(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge, log){
        var result = "College:_"+BAProgram(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge, 5, 8, true, log, false, "College");    
        return result;
    }
    function University(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge, log){
        var result = "University:_" +BAProgram(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge, 7, 9, true, log, false, "University");
        return result;
    }
    function MilitaryAcademy(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge, log){
        return ServiceAcademy(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge, "Army", log);
    }
    function NavalAcademy(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge, log){
        return ServiceAcademy(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge, "Navy", log);
    }
    function ServiceAcademy(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge, branch, log){
        return branch + " Academy:_" + BAProgram(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge, 6, 8, false, log, branch, "Academy");
    }
    function BAProgram(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge, MinStartEdu, MinEndEdu, offerOTC, log, commissionOnSuccess, programName){
        var newLine = "_";
        var remarks = "", notFlunked = false;
        if(characteristics[4].name != ENUM_CHARACTERISTICS.INS){
            var tryBAProgram = true;
            if(characteristics[4].value < MinStartEdu || characteristics[4].name === ENUM_CHARACTERISTICS.TRA){
                tryBAProgram = false;
                var waiverResult = promptEducationWaiver("Insufficient EDU to attend "+programName+" program.");
                remarks += waiverResult.remarks + newLine;
                tryBAProgram = waiverResult.success;
            }
            if(tryBAProgram){
                remarks += "BA Program Application: ";
                var intScore = characteristics[3].value;
                var eduScore = characteristics[4].value; if(characteristics[4].name == ENUM_CHARACTERISTICS.TRA){ eduScore = eduScore/2;}
                var applyResult = checkCharacteristic(intScore > eduScore ? ENUM_CHARACTERISTICS.INT : ENUM_CHARACTERISTICS.EDU,2,0);
                record(programName + " Application: " + applyResult.remarks);
                remarks +=  applyResult.remarks + newLine;
                if(! applyResult.success){ 
                    var applyWaiverResult = promptEducationWaiver("Failed program application.");
                    remarks += applyWaiverResult.remarks + newLine;
                    applyResult.success = applyWaiverResult.success;
                }
                if(applyResult.success){
                   record("Admitted to " + programName + " BA program.");
                    var armyCommission = false, navyCommission = false;

                    notFlunked = true;
                    var secondGain = false;
                    for(var i = 1; i <= 4 && notFlunked; i++){
                        var passResult = checkCharacteristic(intScore > eduScore ? ENUM_CHARACTERISTICS.INT : ENUM_CHARACTERISTICS.EDU,2,0);
                        remarks += "Year " + i +" Pass/Fail: " + passResult.remarks + newLine;
                       record(programName + " Year " + i +" Pass/Fail: " + passResult.remarks);
                        if(passResult.success){                          
                            if(secondGain){
                                addMinor(MinorSkill,MinorKnowledge);
                                remarks += gainSkillOrKnowledge(MinorSkill,MinorKnowledge,true,"(Minor)") + newLine;
                            }
                            secondGain = !secondGain;
                            addMajor(MajorSkill,MajorKnowledge);
                            remarks += gainSkillOrKnowledge(MajorSkill,MajorKnowledge,true,"(Major)") + newLine;
                        }else{
                            var passWaiverResult = promptEducationWaiver("Failed to pass year " + i+".");
                            remarks += passWaiverResult.remarks + newLine;
                            if(passWaiverResult.success){
                                notFlunked = true;
                            }else{ 
                                notFlunked = false;
                            }
                        }
                        remarks += advanceAge(1) + newLine;
                    }
                    if(notFlunked){
                        
                        addMajor(MajorSkill,MajorKnowledge);
                        addMinor(MinorSkill,MinorKnowledge);
                        
                        var honorsResult = checkCharacteristic(intScore > eduScore ? ENUM_CHARACTERISTICS.INT : ENUM_CHARACTERISTICS.EDU,2,0);
                        remarks += "Honors program? " + honorsResult.remarks + newLine;
                        if(honorsResult.success){
                            remarks += gainSkillOrKnowledge(MajorSkill,MajorKnowledge,true,"Graduated with Honors.") + newLine;
                        }else{
                            var honorsWaiverResult = promptEducationWaiver("Failed to achieve Honors BA.");
                            remarks += honorsWaiverResult.remarks + newLine;
                            honorsResult.success = honorsWaiverResult.success;
                        }
                        if(honorsResult.success){
                            remarks += "Attained Honors BA" + newLine; awards.push("Honors BA");
                        }else{
                            remarks += "Attained BA" + newLine; awards.push("BA");
                        }
                        var finalStatBoost = function(){
                            var remarks = "";
                            if(characteristics[4].name === ENUM_CHARACTERISTICS.EDU){
                                if(characteristics[4].value < MinEndEdu){
                                    characteristics[4].value = MinEndEdu;
                                    remarks += ENUM_CHARACTERISTICS.EDU + " increased to " + characteristics[4].value +". " + newLine;
                                   record("Graduated from " + programName + " program. " + ENUM_CHARACTERISTICS.EDU + " increased to " + characteristics[4].value)
                                }else{
                                    remarks += gainCharacteristic(ENUM_CHARACTERISTICS.EDU,1)+". " + newLine;
                                }
                            }
                            log(remarks);
                        };
                        if(offerOTC){
                            
                            var options = [];
                            options.push("None");
                            if(awards.indexOf("Army Reserves") === -1){ options.push("OTC");}
                            if(awards.indexOf("Navy Reserves") === -1 || awards.indexOf("Marine Reserves") == -1){ options.push("NOTC");}
                            pickOption(options,"Do you wish to join OTC (Army) or NOTC (Navy)?",
                            function(choice){
                                var otc = false, notc = false, further_remarks = "";
                                if(choice === false){ choice = "None";}
                                switch(choice){
                                    case "OTC": otc = true; break;
                                    case "NOTC":  notc = true; break;
                                    case "None":
                                    default:
                                    break;
                                }
                                if(otc || notc){
                                    further_remarks += "Volunteered for " + choice +": ";
                                    var otcResult = checkCharacteristic(intScore > eduScore ? ENUM_CHARACTERISTICS.INT : ENUM_CHARACTERISTICS.EDU,2,0);
                                    record("Volunteered for " + choice+". " + otcResult.remarks);
                                    further_remarks += otcResult.remarks + newLine;
                                    if(!otcResult.success){
                                        var otcWaiverResult = promptEducationWaiver("Failed " + choice + " training course.");
                                        further_remarks += otcWaiverResult.remarks + newLine;
                                        otcResult.success = otcWaiverResult.success;
                                    }
                                    if(otcResult.success){
                                        var otc_skill_list = []
                                        if(otc){
                                            armyCommission = true;
                                            otc_skill_list = SoldierSkills;
                                        }else if(notc){
                                            navyCommission = true;
                                            otc_skill_list = StarshipSkills;
                                        }
                                        pickOption(otc_skill_list,"Please choose a " + (otc ? "Soldier" : "Starship") + " skill.",
                                            function(new_skill){
                                                var even_further_remarks = "";
                                                if(KnowledgeSpecialties[new_skill]){
                                                    pickOption(KnowledgeSpecialties[new_skill],"Please choose a knowledge from this list.",function(new_knowledge){
                                                        log(gainSkillOrKnowledge(new_skill,new_knowledge,true, "("+choice + ")"));
                                                        if(navyCommission){ 
                                                            var navyCommissionOptions = [];
                                                            if(! isNavyOfficer()){ navyCommissionOptions.push("Navy");}
                                                            if(! isMarineOfficer()){ navyCommissionOptions.push("Marine");}
                                                            if(navyCommissionOptions.length > 0){
                                                                pickOption(navyCommissionOptions,"Choose a service.",function(service_choice){
                                                                    awards.push(service_choice + " Officer1");
                                                                    awards.push(service_choice + " Reserves");
                                                                    record("Earned " + service_choice + " Commission ("+service_choice+" Officer1).");
                                                                    log("Earned " + service_choice + " Commission ("+service_choice+" Officer1).");
                                                                },true);
                                                            }
                                                        }
                                                    },true);
                                                }else{
                                                    if(navyCommission){ 
                                                        var navyCommissionOptions = [];
                                                        if(! isNavyOfficer()){ navyCommissionOptions.push("Navy");}
                                                        if(! isMarineOfficer()){ navyCommissionOptions.push("Marine");}
                                                        if(navyCommissionOptions.length > 0){
                                                            pickOption(navyCommissionOptions,"Choose a service.",function(service_choice){
                                                                awards.push(service_choice + " Officer1");
                                                                awards.push(service_choice + " Reserves");
                                                                record("Earned " + service_choice + " Commission ("+service_choice+" Officer1).");
                                                                log("Earned " + service_choice + " Commission ("+service_choice+" Officer1).");
                                                            },true);
                                                        }
                                                    }
                                                    even_further_remarks += gainSkillOrKnowledge(new_skill,undefined,true,"("+choice +")") + newLine;
                                                    log(even_further_remarks);
                                                }
                                            },true);
                                    }
                                    if(armyCommission && !isArmyOfficer()){ 
                                        awards.push("Army Officer1");
                                        awards.push("Army Reserves");
                                        further_remarks += "Earned Army commission (Army Officer1).";
                                       record("Earned Army commission (Army Officer1).");
                                    }
                                    
                                    log(further_remarks);
                                }else{
                                    further_remarks += "Declined to volunteer for OTC/NOTC.";
                                    log(further_remarks);
                                }
                                finalStatBoost();
                            },true);
                            
                        }else{
                            finalStatBoost();
                        }
                        if(commissionOnSuccess){
                            if(commissionOnSuccess === "Army"){
                                if(! isArmyOfficer()){
                                    awards.push("Army Officer1");
                                    remarks += "Earned Army commission (Army Officer1).";
                                    record("Earned Army commission (Army Officer1).");
                                }
                                if(awards.indexOf("Army Reserves") == -1){awards.push("Army Reserves");}
                            }else if(commissionOnSuccess === "Navy"){ 
                                var navyCommissionOptions = [];
                                if(! isNavyOfficer()){ navyCommissionOptions.push("Navy");}
                                if(! isMarineOfficer()){ navyCommissionOptions.push("Marine");}
                                if(navyCommissionOptions.length > 0){
                                    pickOption(navyCommissionOptions,"Choose a service.",function(service_choice){
                                        awards.push(service_choice + " Officer1");
                                        awards.push(service_choice + " Reserves");
                                        record("Earned " + service_choice + " Commission ("+service_choice+" Officer1).");
                                        log("Earned " + service_choice + " Commission ("+service_choice+" Officer1).");
                                    });
                                }                               
                            }
                        }
                    }
                    
                }else{
                    remarks += advanceAge(1);
                }
            }
        }else{
            remarks = "Character is ineligible for higher education due to having " + characteristics[4].name + " instead of " + ENUM_CHARACTERISTICS.EDU+". ";
            record(remarks);
        }
        return remarks;
    }
    function isArmyOfficer(){
        var isOfficer = awards.indexOf("Army Officer1") >= 0;
        if(!isOfficer){
            for(var i = 0, len = careers.length; i < len; i++){
                var career = careers[i];
                if(career.career == ENUM_CAREERS.Soldier){
                    isOfficer = career.rank.officer > 0;
                }
            }
        }
        return isOfficer;
    }
    function isNavyOfficer(){
        var isOfficer = awards.indexOf("Navy Officer1") >= 0;
        if(!isOfficer){
            for(var i = 0, len = careers.length; i < len; i++){
                var career = careers[i];
                if(career.career == ENUM_CAREERS.Spacer){
                    isOfficer = career.rank.officer > 0;
                }
            }
        }
        return isOfficer;
    }
    function isMarineOfficer(){
        var isOfficer = awards.indexOf("Marine Officer1") >= 0;
        if(!isOfficer){
            for(var i = 0, len = careers.length; i < len; i++){
                var career = careers[i];
                if(career.career == ENUM_CAREERS.Marine){
                    isOfficer = career.rank.officer > 0;
                }
            }
        }
        return isOfficer;
    }
    function Masters(MajorSkill,MajorKnowledge,MinorSkill,MinorKnowledge){
        var remarks = "", newLine = "_", notFlunked = false;
        var hasBA = awards.indexOf("BA") >= 0 || awards.indexOf("Honors BA") >= 0;
        if(!hasBA){
            remarks += "Character is ineligible for MA program without having earned a BA.";
            record(remarks);
        }else{
            remarks += "MA Program Application: ";
            var intScore = characteristics[3].value;
            var eduScore = characteristics[4].value; if(characteristics[4].name == ENUM_CHARACTERISTICS.TRA){ eduScore = eduScore/2;}
            var applyResult = checkCharacteristic(intScore > eduScore ? ENUM_CHARACTERISTICS.INT : ENUM_CHARACTERISTICS.EDU,2,0);
            record("Masters program application: " + applyResult.remarks);
            remarks +=  applyResult.remarks + newLine;
            if(! applyResult.success){ 
                var applyWaiverResult = promptEducationWaiver("Failed program application.");
                remarks += applyWaiverResult.remarks + newLine;
                applyResult.success = applyWaiverResult.success;
            }
            if(applyResult.success){
                record("Admitted to Masters program.");
                notFlunked = true;
                var secondGain = false;
                for(var i = 1; i <= 2 && notFlunked; i++){
                    var passResult = checkCharacteristic(intScore > eduScore ? ENUM_CHARACTERISTICS.INT : ENUM_CHARACTERISTICS.EDU,2,0);
                    remarks += "Year " + i +" Pass/Fail: " + passResult.remarks + newLine;
                    if(passResult.success){                          
                        if(secondGain){
                            remarks += gainSkillOrKnowledge(MinorSkill,MinorKnowledge,true) + newLine;
                            addMinor(MinorSkill,MinorKnowledge);
                        }
                        secondGain = !secondGain;
                        addMajor(MajorSkill,MajorKnowledge);
                        remarks += gainSkillOrKnowledge(MajorSkill,MajorKnowledge,true) + newLine;
                    }else{
                        var passWaiverResult = promptEducationWaiver("Failed to pass year " + i+".");
                        remarks += passWaiverResult.remarks + newLine;
                        if(passWaiverResult.success){
                            notFlunked = true;
                        }else{ 
                            notFlunked = false;
                        }
                    }
                    remarks += advanceAge(1) + newLine;
                }
                if(notFlunked){
                    addMajor(MajorSkill, MajorKnowledge);
                    addMinor(MinorSkill,MinorKnowledge);
                    var honorsResult = checkCharacteristic(intScore > eduScore ? ENUM_CHARACTERISTICS.INT : ENUM_CHARACTERISTICS.EDU,2,0);
                    remarks += "Honors program? " + honorsResult.remarks + newLine;
                    if(honorsResult.success){
                        remarks += gainSkillOrKnowledge(MajorSkill,MajorKnowledge,true,"Graduated with Honors.") + newLine;
                    }else{
                        var honorsWaiverResult = promptEducationWaiver("Failed to achieve Honors MA.");
                        remarks += honorsWaiverResult.remarks + newLine;
                        honorsResult.success = honorsWaiverResult.success;
                    }
                    if(honorsResult.success){
                        remarks += "Attained Honors MA" + newLine;; awards.push("Honors MA");
                    }else{
                        remarks += "Attained MA" + newLine;; awards.push("MA");
                    }
                    if(characteristics[4].name === ENUM_CHARACTERISTICS.EDU){
                        if(characteristics[4].value < 9){
                            characteristics[4].value = 9;
                            remarks += ENUM_CHARACTERISTICS.EDU + " increased to " + characteristics[4].value;
                        }else{
                            remarks += gainCharacteristic(ENUM_CHARACTERISTICS.EDU,1);
                        }
                    }
                }
            }
        }
        return remarks;
    }
    function Professors(MajorSkill,MajorKnowledge,MinorSkill,MinorKnowledge){
        var remarks = "", newLine = "_", notFlunked = false;
        var hasBA = awards.indexOf("MA") >= 0 || awards.indexOf("Honors MA") >= 0;
        if(!hasBA){
            remarks += "Character is ineligible for Professor program without having earned an MA.";
            record(remarks);
        }else{
            remarks += "Professor Program Application: ";
            var intScore = characteristics[3].value;
            var eduScore = characteristics[4].value; if(characteristics[4].name == ENUM_CHARACTERISTICS.TRA){ eduScore = eduScore/2;}
            var applyResult = checkCharacteristic(intScore > eduScore ? ENUM_CHARACTERISTICS.INT : ENUM_CHARACTERISTICS.EDU,2,0);
            record("Professor Application: " + applyResult.remarks);
            remarks +=  applyResult.remarks + newLine;
            if(! applyResult.success){ 
                var applyWaiverResult = promptEducationWaiver("Failed program application.");
                remarks += applyWaiverResult.remarks + newLine;
                applyResult.success = applyWaiverResult.success;
            }
            if(applyResult.success){
                record("Admitted to Professors program.");
                notFlunked = true;
                var secondGain = false;
                for(var i = 1; i <= 2 && notFlunked; i++){
                    var passResult = checkCharacteristic(intScore > eduScore ? ENUM_CHARACTERISTICS.INT : ENUM_CHARACTERISTICS.EDU,2,0);
                    remarks += "Year " + i +" Pass/Fail: " + passResult.remarks + newLine;
                    if(passResult.success){                          
                        if(secondGain){
                            remarks += gainSkillOrKnowledge(MinorSkill,MinorKnowledge,true) + newLine;
                            addMinor(MinorSkill,MinorKnowledge);
                        }
                        secondGain = !secondGain;
                        addMajor(MajorSkill,MajorKnowledge);
                        remarks += gainSkillOrKnowledge(MajorSkill,MajorKnowledge,true) + newLine;
                    }else{
                        var passWaiverResult = promptEducationWaiver("Failed to pass year " + i+".");
                        remarks += passWaiverResult.remarks + newLine;
                        if(passWaiverResult.success){
                            notFlunked = true;
                        }else{ 
                            notFlunked = false;
                        }
                    }
                    remarks += advanceAge(1) + newLine;
                }
                if(notFlunked){
                    addMajor(MajorSkill,MajorKnowledge);
                    addMinor(MinorSkill,MinorKnowledge);
                    var honorsResult = checkCharacteristic(intScore > eduScore ? ENUM_CHARACTERISTICS.INT : ENUM_CHARACTERISTICS.EDU,2,0);
                    remarks += "Honors program? " + honorsResult.remarks + newLine;
                    if(honorsResult.success){
                        remarks += gainSkillOrKnowledge(MajorSkill,MajorKnowledge,true,"Graduated with Honors.") + newLine;
                    }else{
                        var honorsWaiverResult = promptEducationWaiver("Failed to achieve Honors Professorship.");
                        remarks += honorsWaiverResult.remarks + newLine;
                        honorsResult.success = honorsWaiverResult.success;
                    }
                    if(honorsResult.success){
                        remarks += "Attained Honors Professorship" + newLine;; awards.push("Honors Professor");
                    }else{
                        remarks += "Attained Professorship" + newLine;; awards.push("Professor");
                    }
                    if(characteristics[4].name === ENUM_CHARACTERISTICS.EDU){
                        if(characteristics[4].value < 12){
                            characteristics[4].value = 12;
                            remarks += ENUM_CHARACTERISTICS.EDU + " increased to " + characteristics[4].value;
                        }else{
                            remarks += gainCharacteristic(ENUM_CHARACTERISTICS.EDU,1);
                        }
                    }
                }
            }
        }
        return remarks;
    }
    function MedicalSchool(MajorSkill){
        if(typeof MajorSkill === "undefined"){ MajorSkill = ENUM_SKILLS.Medic}
        var remarks = "", newLine = "_", notFlunked = false;
        var qualifies = true;
        var hasBA = awards.indexOf("Honors BA") >= 0;
        if(!hasBA){
            qualifies = false;
            if(awards.indexOf("BA") >= 0){
                var qualifyWaiverResult = promptEducationWaiver("Character does not have an Honors BA.");
                remarks += qualifyWaiverResult.remarks + newLine;
                qualifies = qualifyWaiverResult.success;
            }else{
                remarks += "Character is ineligible for Medical School program without having earned an Honors BA.";
            }
            record(remarks);
        }
        if(qualifies){
            remarks += "Medical School Program Application: ";
            var intScore = characteristics[3].value;
            var eduScore = characteristics[4].value; if(characteristics[4].name == ENUM_CHARACTERISTICS.TRA){ eduScore = eduScore/2;}
            var applyResult = checkCharacteristic(intScore > eduScore ? ENUM_CHARACTERISTICS.INT : ENUM_CHARACTERISTICS.EDU,2,0);
            remarks +=  applyResult.remarks + newLine;
            record("Med School Application: " + applyResult.remarks);
            if(! applyResult.success){ 
                var applyWaiverResult = promptEducationWaiver("Failed program application.");
                remarks += applyWaiverResult.remarks + newLine;
                applyResult.success = applyWaiverResult.success;
            }
            if(applyResult.success){
                record("Admitted to Medical School.");
                notFlunked = true;
                for(var i = 1; i <= 4 && notFlunked; i++){
                    var passResult = checkCharacteristic(intScore > eduScore ? ENUM_CHARACTERISTICS.INT : ENUM_CHARACTERISTICS.EDU,2,0);
                    remarks += "Year " + i +" Pass/Fail: " + passResult.remarks + newLine;
                    record("Med School Year " + i +" Pass/Fail: " + passResult.remarks);
                    if(passResult.success){                          
                        remarks += gainSkillOrKnowledge(MajorSkill,undefined,true) + newLine;
                        addMajor(MajorSkill);
                    }else{
                        var passWaiverResult = promptEducationWaiver("Failed to pass year " + i+".");
                        remarks += passWaiverResult.remarks + newLine;
                        if(passWaiverResult.success){
                            notFlunked = true;
                        }else{ 
                            notFlunked = false;
                        }
                    }
                    remarks += advanceAge(1) + newLine;
                }
                if(notFlunked){
                    addMajor(MajorSkill);
                    var honorsResult = checkCharacteristic(intScore > eduScore ? ENUM_CHARACTERISTICS.INT : ENUM_CHARACTERISTICS.EDU,2,0);
                    remarks += "Honors program? " + honorsResult.remarks + newLine;
                    if(honorsResult.success){
                        remarks += gainSkillOrKnowledge(MajorSkill,undefined,true,"Graduated with Honors.") + newLine;
                    }else{
                        var honorsWaiverResult = promptEducationWaiver("Failed to achieve Honors Doctor degree.");
                        remarks += honorsWaiverResult.remarks + newLine;
                        honorsResult.success = honorsWaiverResult.success;
                    }
                    if(honorsResult.success){
                        remarks += "Attained Honors Doctor" + newLine;; awards.push("Honors Doctor");
                    }else{
                        remarks += "Attained Doctor" + newLine; awards.push("Doctor");
                    }
                    if(characteristics[4].name === ENUM_CHARACTERISTICS.EDU){
                        if(characteristics[4].value < 10){
                            characteristics[4].value = 10;
                            remarks += ENUM_CHARACTERISTICS.EDU + " increased to " + characteristics[4].value;
                        }else{
                            remarks += gainCharacteristic(ENUM_CHARACTERISTICS.EDU,1);
                        }
                    }
                }
            }else{
                remarks += advanceAge(1) + newLine;
            }
        }
        return remarks;
    }
    function LawSchool(MajorSkill){
        if(typeof MajorSkill === "undefined"){ MajorSkill = ENUM_SKILLS.Advocate}
        var remarks = "", newLine = "_", notFlunked = false;
        var qualifies = true;
        var hasBA = awards.indexOf("Honors BA") >= 0;
        if(!hasBA){
            qualifies = false;
            if(awards.indexOf("BA") >= 0){
                var qualifyWaiverResult = promptEducationWaiver("Character does not have an Honors BA.");
                remarks += qualifyWaiverResult.remarks + newLine;
                qualifies = qualifyWaiverResult.success;
            }else{
                remarks += "Character is ineligible for Law School program without having earned an Honors BA.";
            }
            record(remarks);
        }
        if(qualifies){
            remarks += "Law School Program Application: ";
            var intScore = characteristics[3].value;
            var eduScore = characteristics[4].value; if(characteristics[4].name == ENUM_CHARACTERISTICS.TRA){ eduScore = eduScore/2;}
            var applyResult = checkCharacteristic(intScore > eduScore ? ENUM_CHARACTERISTICS.INT : ENUM_CHARACTERISTICS.EDU,2,0);
            remarks +=  applyResult.remarks + newLine;
            record("Law School Application: " + applyResult.remarks);
            if(! applyResult.success){ 
                var applyWaiverResult = promptEducationWaiver("Failed program application.");
                remarks += applyWaiverResult.remarks + newLine;
                applyResult.success = applyWaiverResult.success;
            }
            if(applyResult.success){
                notFlunked = true;
                record("Admitted to Law School.");
                for(var i = 1; i <= 2 && notFlunked; i++){
                    var passResult = checkCharacteristic(intScore > eduScore ? ENUM_CHARACTERISTICS.INT : ENUM_CHARACTERISTICS.EDU,2,0);
                    remarks += "Year " + i +" Pass/Fail: " + passResult.remarks + newLine;
                    record("Law School Year " + i +" Pass/Fail: " + passResult.remarks);
                    if(passResult.success){                
                        addMajor(MajorSkill);          
                        remarks += gainSkillOrKnowledge(MajorSkill,undefined,true) + newLine;
                    }else{
                        var passWaiverResult = promptEducationWaiver("Failed to pass year " + i+".");
                        remarks += passWaiverResult.remarks + newLine;
                        if(passWaiverResult.success){
                            notFlunked = true;
                        }else{ 
                            notFlunked = false;
                        }
                    }
                    remarks += advanceAge(1) + newLine;
                }
                if(notFlunked){
                    addMajor(MajorSkill);
                    var honorsResult = checkCharacteristic(intScore > eduScore ? ENUM_CHARACTERISTICS.INT : ENUM_CHARACTERISTICS.EDU,2,0);
                    remarks += "Honors program? " + honorsResult.remarks + newLine;
                    if(honorsResult.success){
                        remarks += gainSkillOrKnowledge(MajorSkill,undefined,true,"Graduated with Honors.") + newLine;
                    }else{
                        var honorsWaiverResult = promptEducationWaiver("Failed to achieve Honors Attorney degree.");
                        remarks += honorsWaiverResult.remarks + newLine;
                        honorsResult.success = honorsWaiverResult.success;
                    }
                    if(honorsResult.success){
                        remarks += "Attained Honors Attorney" + newLine;; awards.push("Honors Attorney");
                    }else{
                        remarks += "Attained Attorney" + newLine;; awards.push("Attorney");
                    }
                    if(characteristics[4].name === ENUM_CHARACTERISTICS.EDU){
                        if(characteristics[4].value < 10){
                            characteristics[4].value = 10;
                            remarks += ENUM_CHARACTERISTICS.EDU + " increased to " + characteristics[4].value;
                        }else{
                            remarks += gainCharacteristic(ENUM_CHARACTERISTICS.EDU,1);
                        }
                    }
                }
            }else{
                remarks += advanceAge(1) + newLine;
            }
        }
        return remarks;
    }    
    function resolveCareer(career,callback,resetCCs){
        switch(career){
            case ENUM_CAREERS.Craftsman: resolveCraftsman(career,callback); break;
            case ENUM_CAREERS.Scholar: resolveScholar(career,callback); break;
            case ENUM_CAREERS.Entertainer: resolveEntertainer(career,callback); break;
            case ENUM_CAREERS.Citizen: resolveCitizen(career,callback); break;
            case ENUM_CAREERS.Scout: resolveScout(career,callback,resetCCs); break;
            case ENUM_CAREERS.Merchant: resolveMerchant(career,callback); break;
            case ENUM_CAREERS.Spacer: resolveSpacer(career,callback,resetCCs); break;
            case ENUM_CAREERS.Soldier: resolveSoldier(career,callback,resetCCs); break;
            case ENUM_CAREERS.Agent: resolveAgent(career,callback); break;
            case ENUM_CAREERS.Rogue: resolveRogue(career,callback); break;
            case ENUM_CAREERS.Noble: resolveNoble(career,callback); break;
            case ENUM_CAREERS.Marine: resolveMarine(career,callback,resetCCs); break;
            case ENUM_CAREERS.Functionary: resolveFunctionary(career,callback); break;
        }
    }
    function gainCitizenLifeSkills(isJob, skill, knowledge, updateFunc, callback){
        if(isJob){
            job.skill = skill;
            job.knowledge = knowledge;
            lastCitLifeReceipt = "Job";
        }else{
            hobby.skill = skill;
            hobby.knowledge = knowledge;
            lastCitLifeReceipt = "Hobby";
        }
        if(typeof skill === "undefined"){
            console.log("Tried to acquire skill: " +skill + ", knowledge: " + knowledge);
            record("No skills acquired from useless " + lastCitLifeReceipt);
            updateFunc();
            callback();
        }else{
            if(typeof knowledge === "undefined" && KnowledgeSpecialties[skill]){
                pickOption(KnowledgeSpecialties[skill],"Choose a "+skill+" specialty",(k)=>{
                    var remark = "(Citizen Life "+lastCitLifeReceipt +")";
                    gainSkillOrKnowledge(skill,k,false,remark);
                    gainSkillOrKnowledge(skill,k,false,remark);
                    if(isJob){
                        gainSkillOrKnowledge(skill,k,false,remark);
                        gainSkillOrKnowledge(skill,k,false,remark);
                    }
                    updateFunc();
                    callback();
                },true);
            }else{
                var remark = "(Citizen Life "+lastCitLifeReceipt +")";
                gainSkillOrKnowledge(skill,knowledge,false,remark);
                gainSkillOrKnowledge(skill,knowledge,false,remark);
                if(isJob){
                    gainSkillOrKnowledge(skill,knowledge,false,remark);
                    gainSkillOrKnowledge(skill,knowledge,false,remark);
                }
                callback();
                updateFunc();
            }
        }
    }
    function gainTermSchoolSkills(career,updateFunc,callback){
        var commandCollege = false, ANMSchool = false;
        var commandIndex = -1, anmSchoolIndices = [];
        if(careers[careers.length-1].schools && careers[careers.length-1].schools.length > 0){
            for(var i = 0, len = careers[careers.length-1].schools.length; i < len; i++){
                var school = careers[careers.length-1].schools[i].school;
                if(school == "Upcoming Command College" && num == 0){
                    careers[careers.length-1].schools[i].school = "Command College";
                }else if(school == "Command College"){
                    commandCollege = true;
                    commandIndex = i;
                }else if(school == "ANM School"){
                    ANMSchool = true;
                    anmSchoolIndices.push(i);
                }
            }
        }
        if(commandCollege){
            careers[careers.length-1].schools.splice(commandIndex,1);
            var schoolType = "";
            if(career == ENUM_CAREERS.Spacer){
                schoolType = "N"
            }else if(career == ENUM_CAREERS.Soldier){
                schoolType = "A";
            }else if(career == ENUM_CAREERS.Marine){
                schoolType = "M";
            }
            var commandCollegeAttendance = checkCharacteristic(characteristics[3].value > characteristics[4].value ? "C4" : "C5",undefined,0,"Command College");
                record(commandCollegeAttendance.remarks);
                updateFunc();
                if(commandCollegeAttendance.success){
                    pickSkill(schoolType,"Command College provides two skills. (1 of 2)",(sk1)=>{
                        gainSkillOrKnowledge(sk1.skill,sk1.knowledge,true,"Command College");
                        updateFunc();
                        pickSkill(schoolType,"Command College provides two skills. (2 of 2)",(sk2)=>{
                            gainSkillOrKnowledge(sk2.skill,sk2.knowledge,true,"Command College");
                            updateFunc();
                            gainTermSchoolSkills(career,updateFunc,callback);
                        });
                    })
                }else{
                    gainTermSchoolSkills(career,updateFunc,callback);
                }
        }else if(ANMSchool){
            var anmSchoolIndex = anmSchoolIndices[0];
            var skillAcquisitionIndex = careers[careers.length-1].schools[anmSchoolIndex].term;
            careers[careers.length-1].schools.splice(anmSchoolIndex,1);
            var schoolType = "";
            if(career == ENUM_CAREERS.Spacer){
                schoolType = "N"
            }else if(career == ENUM_CAREERS.Soldier){
                schoolType = "A";
            }else if(career == ENUM_CAREERS.Marine){
                schoolType = "M";
            }
            var ANMSchoolResult = checkCharacteristic(characteristics[1].value > characteristics[2].value ? "C2" : "C3",undefined,0,"ANM School");
                record(ANMSchoolResult.remarks);
                updateFunc();
                if(ANMSchoolResult.success){
                    pickSkill(schoolType,"ANM School provides a skill",(sk1)=>{
                        if(sk1.skill === ENUM_SKILLS.Language){
                            pickOption(KnowledgeSpecialties[ENUM_SKILLS.Language],"Choose a language specialty",(sk2)=>{
                                if(typeof careers[careers.length-1].skillsToGain == "undefined"){ careers[careers.length-1].skillsToGain = []; }
                                careers[careers.length-1].skillsToGain.push({receipts:2,skill:sk1.skill,knowledge:sk2,isEducation:true,note:"ANM School",termIndex:skillAcquisitionIndex});
                                updateFunc();
                                gainTermSchoolSkills(career,updateFunc,callback);
                            },true); 
                        }else{
                            if(typeof careers[careers.length-1].skillsToGain == "undefined"){ careers[careers.length-1].skillsToGain = []; }
                            careers[careers.length-1].skillsToGain.push({receipts:2,skill:sk1.skill,knowledge:sk1.knowledge,isEducation:true,note:"ANM School",termIndex:skillAcquisitionIndex});
                            updateFunc();
                            gainTermSchoolSkills(career,updateFunc,callback);
                        }
                        

                    }, undefined, undefined, true);

                }else{
                    gainTermSchoolSkills(career,updateFunc,callback);
                }
        }else{
            callback();
        }
    }
    function gainTermSkills(tablesPerTerm,career,updateFunc,callback){
        if(tablesPerTerm.length > 0){
            var currentTablesObject = tablesPerTerm[0];
            var tables = CareerSkillTables[career];
            var defaultValue = undefined;
            if(typeof currentTablesObject.table != "undefined"){
                var tableHeaders = currentTablesObject.table;
                tables = {
                    "Tables":[]
                };
                for(var i = 0, len = tableHeaders.length; i < len; i++){
                    tables.Tables.push(tableHeaders[i]);
                    tables[tableHeaders[i]] = CareerSkillTables[career][tableHeaders[i]];
                    if(typeof currentTablesObject.note !== "undefined" &&  currentTablesObject.note.length > 0 &&(
                        currentTablesObject.note.indexOf(tableHeaders[i]) == 0 ||
                        tableHeaders[i].indexOf(currentTablesObject.note.split(" ")[0]) == 0
                    )){
                        defaultValue = tableHeaders[i];
                    }
                }
            }
            if(typeof currentTablesObject.schooling !== "undefined"){
                //{receipts:2,skill:sk1.skill,knowledge:sk1.knowledge,isEducation:true,note:"ANM School",termIndex:skillAcquisitionIndex}
                for(var r = 0, numReceipts = currentTablesObject.schooling.receipts; r < numReceipts; r++){
                    gainSkillOrKnowledge(currentTablesObject.schooling.skill,currentTablesObject.schooling.knowledge,true,currentTablesObject.schooling.note);
                }
                currentTablesObject.schooling = [];
            }

            var note = "Choose a skill table";
            if(typeof currentTablesObject.note !== "undefined"){ note = "" + currentTablesObject.note + ":<br/>" + note;}
            note += "<br/>("+(tablesPerTerm.length)+" picks remaining)"; 
                var getOlder = typeof currentTablesObject.age !== "undefined" && currentTablesObject.age;
                tablesPerTerm.splice(0,1);
                function nextSteps(n,addYear){
                    updateFunc();
                    if(addYear){
                        advanceAge(1);
                    }
                    setTimeout(()=>{gainTermSkills(n,career,updateFunc,callback);},0);
                };
                var previewArray = [];
                for(var i = 0, len = tables.Tables.length; i < len; i++){
                    previewArray.push(tables[tables.Tables[i]]);
                }
                pickOption(tables.Tables,note,
                    (table)=>{
                    var newSkill = tables[table][roller.d6().result-1];
                    //record(table + ": " + newSkill); updateFunc();
                    var note = "("+table + ": " + newSkill+")";
                    if(table === "Personal"){
                        var index = +(newSkill.substring(1));
                        gainCharacteristic(index,1,note);
                        nextSteps(tablesPerTerm,getOlder);
                    }else if(newSkill === "Major"){
                        if(majors.length > 0){
                            var getDegreeLabel = (x,i,ar)=>{return x.label;};
                            var choices = removeDuplicates(majors.map(getDegreeLabel));
                            pickOption(choices,"You can increase a Major",(choice)=>{
                                var skill, knowledge;
                                for(var i = 0, len = majors.length; i < len; i++){
                                    if(majors[i].label == choice){
                                        skill = majors[i].skill, knowledge = majors[i].knowledge;
                                        break;
                                    }
                                }
                                gainSkillOrKnowledge(skill,knowledge,false,note);
                                nextSteps(tablesPerTerm,getOlder);
                            },true);
                        }else{
                            record("Academic: You do not have a major; no skill increased.");
                            nextSteps(tablesPerTerm,getOlder);
                        }
                    }else if(newSkill === "Minor"){
                        if(minors.length > 0){
                            var getDegreeLabel = (x,i,ar)=>{return x.label;};
                            var choices = removeDuplicates(minors.map(getDegreeLabel));
                            pickOption(choices,"You can increase a Minor",(choice)=>{
                                var skill, knowledge;                           
                                for(var i = 0, len = minors.length; i < len; i++){
                                    if(minors[i].label == choice){
                                        skill = minors[i].skill, knowledge = minors[i].knowledge;
                                        break;
                                    }
                                }
                                gainSkillOrKnowledge(skill,knowledge,false,note);
                                nextSteps(tablesPerTerm,getOlder);
                            },true);
                        }else{
                            record("Academic: You do not have a minor; no skill increased.");
                            nextSteps(tablesPerTerm,getOlder);
                        }
                    }else if(newSkill === "New Trade"){
                        (function(tablesPerTerm,getOlder){
                            var trades = TradeSkills.slice();
                            for(var i = 0; i < trades.length; i++){
                                if(typeof skills[trades[i]] !== "undefined" && skills[trades[i]].Skill > 0){
                                    trades.splice(i,1);
                                    i-=1;
                                }
                            }
                            if(trades.length > 0){
                                pickOption(trades,"Choose a new skilled trade",(choice)=>{
                                    gainSkillOrKnowledge(choice,undefined,false,note);
                                    nextSteps(tablesPerTerm,getOlder);
                                },true);
                            }else{
                                record("New Trade: You already hold all trades; no skill increased.");
                                nextSteps(tablesPerTerm,getOlder);
                            }
                            
                        })(tablesPerTerm,getOlder);
                    }else if(newSkill === "One Trade"){
                        (function(tablesPerTerm,getOlder){
                            gainSkillWithPromptForCategory(note,"TRADE",()=>{nextSteps(tablesPerTerm,getOlder);});
                        })(tablesPerTerm,getOlder);
                    }else if(newSkill === "One Art"){
                        (function(tablesPerTerm,getOlder){
                            gainSkillWithPromptForCategory(note,"ART",()=>{nextSteps(tablesPerTerm,getOlder);});
                        })(tablesPerTerm,getOlder);
                    }else if(newSkill === "One Science"){
                        (function(tablesPerTerm,getOlder){
                        pickOption(KnowledgeSpecialties[ENUM_SKILLS.Science],"Choose a science knowledge",(choice)=>{
                            gainSkillOrKnowledge(ENUM_SKILLS.Science,choice,false,note);
                            nextSteps(tablesPerTerm,getOlder);
                        },true);})(tablesPerTerm,getOlder);
                    }else if(newSkill === "Soldier Skill"){
                        (function(tablesPerTerm,getOlder){
                            gainSkillWithPromptForCategory(note,"SOLDIER",()=>{nextSteps(tablesPerTerm,getOlder);});
                        })(tablesPerTerm,getOlder);
                    }else if(newSkill === "Starship Skill"){
                        (function(tablesPerTerm,getOlder){
                        gainSkillWithPromptForCategory(note,"SHIP",()=>{nextSteps(tablesPerTerm,getOlder);});
                        })(tablesPerTerm,getOlder);
                    }else if(newSkill === "Any Knowledge"){
                        record("Would gain "+newSkill+" from " + table + " here.");
                        nextSteps(tablesPerTerm,getOlder);
                    }else if(newSkill === "Capital"){ // noble
                        // TODO
                        // world knowledge of world of highest held noble land grant, value = 1D
                        record("Would gain "+newSkill+" world knowledge from " + table + " here.");
                        nextSteps(tablesPerTerm,getOlder);
                    }else if(newSkill === "Any Skill"){ // functionary
                        // TODO
                        // any skill from citizen life skills and knowledges
                        record("Would gain "+newSkill+" (from citizen life table) from " + table + " here.");
                        nextSteps(tablesPerTerm,getOlder);
                    }else{
                        gainSkillWithPromptForKnowledge(note,newSkill,()=>{nextSteps(tablesPerTerm,getOlder);});
                        // if(KnowledgeSpecialties[newSkill]){
                        //     (function(num){
                        //         pickOption(KnowledgeSpecialties[newSkill],"Choose a "+newSkill+" knowledge.",(k)=>{
                        //             gainSkillOrKnowledge(newSkill,k,false,note);
                        //             nextSteps(num);
                        //         },true);
                        //     })(num);
                        // }else{
                        //     gainSkillOrKnowledge(newSkill,undefined,false,note);
                        //     nextSteps(num);
                        // }
                        
                    }                
                    
                },true,defaultValue,previewArray,true);
            
        }else{
            updateFunc();
            setTimeout(callback,0);
        }
    }
    function promptContinue(career,updateFunc){
        if(careers[careers.length-1].awards && careers[careers.length-1].awards.indexOf("Disabled") >= 0){ 
            careers[careers.length-1].active = false;
                record("Forced to leave "+career+" career due to injuries sustained.");
                updateFunc();
                pickOption(["Pursue other opportunities","Muster Out"],"You are forced to leave this career due to your injuries. <br/> Do wish to muster out and start adventuring or pursue other opportunities first?",(choice)=>{
                    if(choice === "Pursue other opportunities"){
                        careers[careers.length-1].active = false;
                        updateFunc();
                    }else{
                        record("Chose to muster out and begin adventuring.");
                        updateFunc();
                        musterOut(updateFunc);
                    }
                },true);
        }else{
            var continueTarget = -1;
            switch(career){
                case ENUM_CAREERS.Craftsman:
                    continueTarget = skills[ENUM_SKILLS.Craftsman].Skill*2;;
                    break;
                case ENUM_CAREERS.Citizen:
                    continueTarget = 10;
                break;
                case ENUM_CAREERS.Spacer:
                    continueTarget = characteristics[0].value;
                    break;
                case ENUM_CAREERS.Soldier:
                        continueTarget = characteristics[2].value;
                        break;
                case ENUM_CAREERS.Marine:
                    continueTarget = characteristics[0].value;
                    break;
                case ENUM_CAREERS.Merchant:
                    continueTarget = characteristics[0].value;
                    break;
                case ENUM_CAREERS.Scout:
                    continueTarget = characteristics[3].value;
                    break;
            }
            pickOption(["Continue or Muster Out","Switch to a new career"],"Completed " + careers[careers.length-1].terms + " term"+(careers[careers.length-1].terms == 1 ? "":"s")+" as a " + career+".<br/>Do you want to switch from "+career+" to a different career?",(switchCareerChoice)=>{
                var switchCareer = switchCareerChoice === "Switch to a new career";
                if(!switchCareer){
                    var continueResult = roller.d6(2);
                    if(continueResult.result === 2){
                        if(species.getLifeStageFromAge(age) < 9 && 
                            (awards.indexOf("Army Reserves") >= 0 || awards.indexOf("Navy Reserves") >= 0 || awards.indexOf("Marine Reserves") >= 0 ) &&
                            [ENUM_CAREERS.Soldier,ENUM_CAREERS.Spacer,ENUM_CAREERS.Marine].indexOf(career) == -1
                        ){
                            var reserves = [];
                            for(var i = 0, len = awards.length; i < len; i++){
                                var award = awards[i];
                                if(award === "Army Reserves"){
                                    reserves.push({career:ENUM_CAREERS.Soldier,reserves:award});
                                }else if(award === "Navy Reserves"){
                                    reserves.push({career:ENUM_CAREERS.Spacer,reserves:award});
                                }else if(award === "Marine Reserves"){
                                    reserves.push({career:ENUM_CAREERS.Marine,reserves:award});
                                }
                            }
                            var reserve = reserves[(roller.random() * reserves.length) >>> 0];
                            record("Continue as "+career+": [" + continueResult.rolls.join(",") + "] = RESERVES");
                            updateFunc();
                            record("Called up by the " + reserve.reserves+ "!");
                            updateFunc();
                            alert("Called up by the " + reserve.reserves+ "!");
                            // TODO: Resume service career
                            var svcIndex = 0;
                            for(var s = 0; s < careers.length; s++){
                                if(careers[s].career === reserve.career){
                                    svcIndex = s; break;
                                }
                            }
                            careers[svcIndex].active = true;
                            careers[careers.length - 1].active = true;
                            var svcCareers = careers.splice(svcIndex,1);
                            careers.push(svcCareers[0]);
                            var resetCCs = true;
                            resolveCareer(reserve.career,updateFunc,resetCCs);
                    
                        }else{
                            record("Continue as "+career+": [" + continueResult.rolls.join(",") + "] = MANDATORY");
                            updateFunc();
                            record("Continuation is mandatory for this term.");
                            updateFunc();
                            resolveCareer(career,updateFunc);
                        }
                    }else{
                        var passedContinueRoll = false;          
                        switch(career){
                            case ENUM_CAREERS.Craftsman:
                                passedContinueRoll = continueResult.result <= skills[ENUM_SKILLS.Craftsman].Skill*2;
                                record("Continue as Craftsman: [" + continueResult.rolls.join(",") + "] < "+(skills[ENUM_SKILLS.Craftsman].Skill*2)+" ? " + (passedContinueRoll ? "PASS":"FAIL"));
                                updateFunc();
                                break;
                            case ENUM_CAREERS.Citizen:
                                passedContinueRoll = continueResult.result <= 10
                                record("Continue as Citizen: [" + continueResult.rolls.join(",") + "] < 10 ? " + (passedContinueRoll ? "PASS":"FAIL"));
                                updateFunc();
                            break;
                            case ENUM_CAREERS.Spacer:
                                passedContinueRoll = continueResult.result <= characteristics[0].value;
                                record("Continue as Spacer: [" + continueResult.rolls.join(",") + "] < Str ("+characteristics[0].value+") ? " + (passedContinueRoll ? "PASS":"FAIL"));
                                updateFunc();
                                break;
                            case ENUM_CAREERS.Soldier:
                                    passedContinueRoll = continueResult.result <= characteristics[2].value;
                                    record("Continue as Soldier: [" + continueResult.rolls.join(",") + "] < C3 ("+characteristics[2].value+") ? " + (passedContinueRoll ? "PASS":"FAIL"));
                                    updateFunc();
                                    break;
                            case ENUM_CAREERS.Marine:
                                passedContinueRoll = continueResult.result <= characteristics[0].value;
                                record("Continue as Marine: [" + continueResult.rolls.join(",") + "] < C1 ("+characteristics[0].value+") ? " + (passedContinueRoll ? "PASS":"FAIL"));
                                updateFunc();
                                break;
                            case ENUM_CAREERS.Merchant:
                                passedContinueRoll = continueResult.result <= characteristics[0].value;
                                record("Continue as Merchant: [" + continueResult.rolls.join(",") + "] < Str ("+characteristics[0].value+") ? " + (passedContinueRoll ? "PASS":"FAIL"));
                                updateFunc();
                                break;
                            case ENUM_CAREERS.Scout:
                                passedContinueRoll = continueResult.result <= characteristics[3].value;
                                record("Continue as Scout: [" + continueResult.rolls.join(",") + "] < Int ("+characteristics[3].value+") ? " + (passedContinueRoll ? "PASS":"FAIL"));
                                updateFunc();
                                break;
                        }
                        if(passedContinueRoll){
                            pickOption(["Continue with this career","Muster Out"],"Continue Roll was successful. <br/> Do wish to continue this career or start adventuring?",(choice)=>{
                                if(choice === "Continue with this career"){
                                    resolveCareer(career,updateFunc);
                                }else{
                                    record("Chose to muster out and begin adventuring.");
                                    updateFunc();
                                    musterOut(updateFunc);
                                }
                            },true);
                        }else{
                            record("Failed Continue roll. Begin adventuring.")
                            updateFunc();
                            musterOut(updateFunc);
                        }
                    }
                }else{
                    careers[careers.length-1].active = false;
                    record("Concluded "+career+" career to pursue other opportunities.");
                    updateFunc();
                    //musterOut(career,updateFunc);
                }
            },true,undefined,["Roll less than or equal to " +continueTarget+" to continue.","Leave " + career + " career to pursue other opportunities."]);    
        }           
    }
    function musterOut(updateFunc, callback){
        musteredOut = true;
        if(typeof callback === "undefined"){ callback = ()=>{};}
        updateFunc();
        var totalRolls = 0, priorCareer = false, priorCareerDM = 0;
        for(var i = careers.length-1; i >= 0; i--){
            var career = careers[i];
            var numRolls = career.terms;
            career.numRolls = numRolls;
            
            if(career.career === ENUM_CAREERS.Functionary){
                priorCareer = career.priorCareer;
                priorCareerDM = career.terms;
            }else if(priorCareer === career.career){
                career.benefitDM = priorCareerDM;
                priorCareer = false; priorCareerDM = 0;
            }else{
                career.benefitDM = 0;
            }
            if(career.awards && career.awards.length > 0){
                if(career.awards.indexOf("Disabled") >= 0){
                    career.numRolls *= 2;
                }
                for(var j = 0, jlen = career.awards.length; j<jlen; j++){
                    var award = career.awards[j];
                    if(award.indexOf("Commendation") === 0 || award === "MCG" || award === "SEH" || award === "*SEH*"){
                        career.numRolls += 1;
                    }
                }
            }
            totalRolls += career.numRolls;
        }
        if(calculateFame() >= 19){ totalRolls += 1;}

        record("Total benefit rolls: " + totalRolls);
        updateFunc();

        var careerIndex = 0;
        var musterContinue = function(){
            careerIndex += 1;
            if(careerIndex < careers.length){
                updateFunc();
                musterOutSpecificCareer(careerIndex,careers[careerIndex].numRolls,updateFunc,musterContinue);
            }else{
                if(calculateFame() >= 19 && !fameMusterOutBonus){
                    claimFameMusterOutBonus(updateFunc,true,function(){
                        record("Ready to begin adventuring!");
                        updateFunc();
                        callback();
                    });
                    callback();
                }else{
                    record("Ready to begin adventuring!");
                    updateFunc();
                    callback();
                }
            }
        };
        musterOutSpecificCareer(careerIndex,careers[careerIndex].numRolls,updateFunc,musterContinue);
    }
    function getForbiddenKnowledge(callback){
        var roll = roller.d6();
        var prompt = "Acquired forbidden knowledge."
        switch(roll.result){
            case 1: gainSkillWithPromptForKnowledge(prompt,ENUM_SKILLS.Fighter,callback,false); break;
            case 2: gainSkillWithPromptForKnowledge(prompt,ENUM_SKILLS.Streetwise,callback,false); break;
            case 3: gainSkillWithPromptForKnowledge(prompt,ENUM_SKILLS.Stealth,callback,false); break;
            case 4: gainSkillWithPromptForKnowledge(prompt,ENUM_SKILLS.Explosives,callback,false); break;
            case 5: 
                gainSkillOrKnowledge(ENUM_SKILLS.HeavyWeapons,"WMD",false,prompt);
                callback();
                 break;
            case 6: gainSkillWithPromptForKnowledge(prompt,ENUM_SKILLS.Programmer,callback,false); break;
        }
    }
    function musterOutSpecificCareer(careerIndex,rollsRemaining,updateFunc,callback){
        updateFunc();
        if(rollsRemaining > 0){
            rollsRemaining -= 1;
            var career = careers[careerIndex];
            if(typeof career.awards === "undefined"){ career.awards = [];}
            var bennyMod = 0, moneyMod = 0;
            var possibleMonies = [], possibleBennies = [];
            var mainOptions = ["Money","Benefits"];
            var eligibleForKnighthood = true;
            switch(career.career){
                case ENUM_CAREERS.Craftsman:
                    moneyMod = career.terms;
                    bennyMod = moneyMod;
                break;
                case ENUM_CAREERS.Citizen:
                    moneyMod = career.terms + career.benefitDM;
                    bennyMod = moneyMod; 
                break;
                case ENUM_CAREERS.Merchant:
                    moneyMod = career.terms + career.benefitDM; 
                    bennyMod = career.rank.officer + career.benefitDM;
                break;
                case ENUM_CAREERS.Spacer:
                case ENUM_CAREERS.Marine:
                case ENUM_CAREERS.Soldier:
                    if(career.rank.officer <= 0){
                        // ineligible for knighthood
                        eligibleForKnighthood = false;
                    }
                    moneyMod = career.terms + career.benefitDM; 
                    bennyMod = career.rank.officer + career.benefitDM;
                break;
                case ENUM_CAREERS.Scout:
                    moneyMod = career.terms;
                    bennyMod = calculateFame() / 2;
                    break;
            }
            possibleMonies = CareerBenefitTables[career.career]["Money"].map((val)=>val.label);
            possibleBennies = CareerBenefitTables[career.career]["Benefits"].map((val)=>{
                if(val.label !== "Knighthood" || eligibleForKnighthood){ return val.label }  
                else{ return "Soc +1";}
            });
            if(6+moneyMod < possibleMonies.length){ possibleMonies.splice(6+moneyMod); }
            if(6+bennyMod < possibleBennies.length){ possibleBennies.splice(6+bennyMod); }
            pickOption(mainOptions,"Choose a table for "+career.career+" benefits.<br/>("+(rollsRemaining+1)+" rolls remaining)",(choice)=>{
                switch(choice){
                    case "Money": 
                    var maxMod = moneyMod;
                    var roll = roller.d6().result; var rollChoices = []
                    for(var i = 0; i <= maxMod; i++){
                        var sum = roll + i - 1;
                        if(sum > 11){   
                            sum = 11; 
                        }
                        rollChoices.push((sum+1)+":" + CareerBenefitTables[career.career]["Money"][sum].label);
                    }
                    if(rollChoices.length > 1){
                        pickOption(rollChoices,"Roll='"+roll+"' choose a monetary benefit.",(rollChoice)=>{
                            var choiceIndex = +(rollChoice.substring(0,rollChoice.indexOf(":")))-1;
                            var chosenBenefit = CareerBenefitTables[career.career]["Money"][choiceIndex];
                            switch(chosenBenefit.type){
                                case "award": awards.push(chosenBenefit.label); career.awards.push(chosenBenefit.label); record("Gained " + chosenBenefit.label); break;
                                case "money": credits += (chosenBenefit.amount); record("Gained " + chosenBenefit.label); break;
                                case "ship": shipShares += 1; record("Gained " + chosenBenefit.label); break;
                            }
                            updateFunc();
                            musterOutSpecificCareer(careerIndex,rollsRemaining,updateFunc,callback);
                        },true,rollChoices[rollChoices.length-1]);
                    }else{
                        var chosenBenefit = CareerBenefitTables[career.career]["Money"][sum];
                        switch(chosenBenefit.type){
                            case "award": awards.push(chosenBenefit.label); career.awards.push(chosenBenefit.label); record("Gained " + chosenBenefit.label); break;
                            case "money": credits += (chosenBenefit.amount); record("Gained " + chosenBenefit.label); break;
                            case "ship": shipShares += 1; record("Gained " + chosenBenefit.label); break;
                        }
                        updateFunc();
                            musterOutSpecificCareer(careerIndex,rollsRemaining,updateFunc,callback);
                    }
                    break;
                    case "Benefits":
                        var maxMod = bennyMod;
                        var roll = roller.d6().result; var rollChoices = []
                        for(var i = 0; i <= maxMod; i++){
                            var sum = roll + i - 1;
                            if(sum > 11){   
                                sum = 11; 
                            }
                            rollChoices.push((sum+1)+":" +CareerBenefitTables[career.career]["Benefits"][sum].label);
                        }
                        if(rollChoices.length > 1){
                            pickOption(rollChoices,"Roll='"+roll+"' choose a benefit.",(rollChoice)=>{
                                var choiceIndex = +(rollChoice.substring(0,rollChoice.indexOf(":")))-1;
                                var chosenBenefit = CareerBenefitTables[career.career]["Benefits"][choiceIndex];
                                var keepGoing = true;
                                if(chosenBenefit.label == "Knighthood"){
                                    if(eligibleForKnighthood){
                                        if(characteristics[5].name === ENUM_CHARACTERISTICS.SOC){
                                            if(characteristics[5].value < 11){
                                                characteristics[5].value = 11;
                                                record("Knighthood receipt increased Social Standing to 11.");
                                            }else{
                                                gainCharacteristic(ENUM_CHARACTERISTICS.SOC,1,"Knighthood receipt.");
                                            }
                                        }
                                    }else{
                                        chosenBenefit.type = "characteristic";
                                        chosenBenefit.characteristic = "Soc";
                                    }
                                }
                                switch(chosenBenefit.type){
                                    case "knowledge": getForbiddenKnowledge(()=>{updateFunc(); musterOutSpecificCareer(careerIndex,rollsRemaining,updateFunc,callback); }); keepGoing = false; break;
                                    case "award": awards.push(chosenBenefit.label); career.awards.push(chosenBenefit.label); record("Gained " + chosenBenefit.label); break;
                                    case "characteristic": musterOutStatBonus(chosenBenefit.characteristic); break;
                                    case "ship": shipShares += 1; record("Gained " + chosenBenefit.label); break;
                                }
                                if(keepGoing){
                                    updateFunc();
                                    musterOutSpecificCareer(careerIndex,rollsRemaining,updateFunc,callback);
                                }
                            },true,rollChoices[rollChoices.length-1]);
                        }else{
                            record("Benefit roll="+roll);
                            var chosenBenefit = CareerBenefitTables[career.career]["Benefits"][sum];
                            var keepGoing = true;
                            // Reroll duplicate benefit awards (except knighthood, which confers Soc+1 on subsequent receipts)
                            while(chosenBenefit.type === "award" && awards.indexOf(chosenBenefit.label) >= 0 && ["Knighthood"].indexOf(chosenBenefit.label) == -1){
                                roll = roller.d6().result;
                                var sum = roll + i - 1;
                                if(sum > 11){   
                                    sum = 11; 
                                }
                                chosenBenefit = CareerBenefitTables[career.career]["Benefits"][sum];
                                record("Duplicate "+chosenBenefit.label+" benefit. Benefit reroll="+roll);
                                updateFunc();
                            }
                            switch(chosenBenefit.type){
                                case "knowledge": getForbiddenKnowledge(()=>{updateFunc(); musterOutSpecificCareer(careerIndex,rollsRemaining,updateFunc,callback); }); keepGoing = false; break;
                                case "award": awards.push(chosenBenefit.label); career.awards.push(chosenBenefit.label); record("Gained " + chosenBenefit.label); break;
                                case "characteristic": musterOutStatBonus(chosenBenefit.characteristic); break;
                                case "ship": shipShares += 1; record("Gained " + chosenBenefit.label); break;
                            }
                            if(keepGoing){
                                updateFunc();
                                musterOutSpecificCareer(careerIndex,rollsRemaining,updateFunc,callback);
                            }
                        } 
                    break;
                }
            },true,undefined,[possibleMonies,possibleBennies],true);
            
        }else{
            callback();
        }
    }
    function musterOutStatBonus(stat){
        switch(stat){
            case "C1": gainCharacteristic(1,1,"Mustering Out: "); break;
            case "C2": gainCharacteristic(2,1,"Mustering Out: "); break;
            case "C3": gainCharacteristic(3,1,"Mustering Out: "); break;
            case "C4": gainCharacteristic(4,1,"Mustering Out: "); break;
            case "C5": gainCharacteristic(5,1,"Mustering Out: "); break;
            case "C6": gainCharacteristic(6,1,"Mustering Out: "); break;
            case "Soc": 
            if(species.Characteristics[5].name == ENUM_CHARACTERISTICS.SOC){ gainCharacteristic(ENUM_CHARACTERISTICS.SOC,1,"Mustering Out: ");}
            else{ record("Character does not have Social Standing so the Soc increase benefit was lost.");}
             break;
        }
    }
    function claimFameMusterOutBonus(updateFunc,noCancel,callback){
        if(typeof noCancel == "undefined"){noCancel = false;}
        if(typeof callback == "undefined"){ callback = ()=>{return;} ; }
        var options = getCareers().map((v)=>{return v.career});
        pickOption(options,"Fame provides an additional mustering out bonus. Choose a career.",(option)=>{
            fameMusterOutBonus = true;
            musterOutSpecificCareer(options.indexOf(option),1,updateFunc,callback);
        },noCancel,undefined);
    }
    function canResumeFromService(career){
        var prevCareerIndex = -1, canResume = false;
        for(var i = 0, len = careers.length-1; i < len; i++){
            var prevCareer = careers[i];
            if(prevCareer.career === career && prevCareer.active ){
                canResume = true;
                prevCareerIndex = i;
                break;
            }
        }
        return {prevCareerIndex,canResume};
    }
    function swapCareerIndices(index){
        careers[careers.length - 1].active = false;
        careers[index].active = true;
        var svcCareers = careers.splice(index,1);
        careers.push(svcCareers[0]);
    }
    function resolveCitizen(career,updateFunc){
        var hasBeen = canResumeFromService(career);
        if(hasBeen.canResume){
            swapCareerIndices(hasBeen.prevCareerIndex);
        }
        var priorCareers = careers.length;
        if((priorCareers > 0 && careers[priorCareers - 1].career !== career && !hasBeen.canResume)){
            record("Cannot transfer to Citizen career from another career.")
            updateFunc();
        }else{
            
            if(CCs.length == 0 || priorCareers == 0 || careers[priorCareers - 1].active == false){
                CCs = getCCs(career);
            }
            var CCDescriptions = CCs.map((val)=>{var cci = +(val.substring(1))-1; return characteristics[cci].name + " (" + characteristics[cci].value + ")";});
            var nextSteps = function(){
                //advanceAge(4);
                updateFunc();
                var termSkillTables = [
                    {age:true},
                    {age:true},
                    {age:true},
                    {age:true},
                ];
                gainTermSkills(termSkillTables,ENUM_CAREERS.Citizen,updateFunc,()=>{
                    updateFunc(); 
                    promptContinue(ENUM_CAREERS.Citizen,updateFunc);
                });
            };
            pickOption(CCs,"Choose a controlling characteristic for the term.",function(selectedCC){
                if(priorCareers == 0 || careers[priorCareers - 1].active == false){
                    careers.push({career:career,terms:1,active:true,awards:[]});
                }else{
                    careers[careers.length-1].terms += 1;
                }
                updateFunc();
                var termNumber = careers[careers.length-1].terms;
                CCs.splice(CCs.indexOf(selectedCC),1);
                record("Chose " + selectedCC + " as controlling characteristic for Term #"+termNumber+". Choices remaining: " + CCs.join(","));
                updateFunc();
                var ccIndex = +(selectedCC.substring(1))-1;
                var numDice = species.Characteristics[ccIndex].nD + gender.Characteristics[ccIndex].nD + caste.Characteristics[ccIndex].nD;
                var citLifeResult = checkCharacteristic(selectedCC,numDice,0,"Citizen Life vs "+selectedCC);
                record(citLifeResult.remarks);
                updateFunc();
                if(citLifeResult.success){
                    if(typeof job.skill == "undefined" || typeof hobby.skill == "undefined"){ // gain job-4 or hobby-2
                        
                        if(majors.length > 0){
                            // chance to select job/hobby
                            var getDegreeLabel = (x,i,ar)=>{return x.label;};
                            var chooseJobResult = checkCharacteristic(ENUM_CHARACTERISTICS.EDU,species.Characteristics[4].nD + gender.Characteristics[4].nD + caste.Characteristics[4].nD,0,"Select a job vs EDU");
                            record(chooseJobResult.remarks); updateFunc();
                            if(chooseJobResult.success){
                                var choices = removeDuplicates(majors.map(getDegreeLabel).concat(minors.map(getDegreeLabel)));
                                var indexToRemove = -1;
                                if(job && typeof job.label !== "undefined"){
                                        for(var i = 0, len = choices.length; i < len; i++){
                                        if(choices[i] == job.label){
                                            indexToRemove = i;
                                        }
                                    }
                                }
                                if(indexToRemove >= 0){ choices.splice(indexToRemove,1);}
                                choices.push("Roll Randomly");
                                var isJob = typeof job.skill == "undefined";
                                pickOption(choices,"You may choose a "+(isJob ? "job" : "hobby")+" from your majors and minors.",function(chosenJob){
                                    var skill = "", knowledge = "";
                                    if(chosenJob == "Roll Randomly"){
                                        var randomJob = citizenLifeJob(roller);
                                        record("Roll for Citizen Skill/Knowledge: " + randomJob.rolls);
                                        updateFunc();
                                        skill = randomJob.job.skill, knowledge = randomJob.job.knowledge;
                                    }else{
                                        job.label = chosenJob;
                                        var degrees = majors.concat(minors);
                                        for(var i = 0, len = degrees.length; i < len; i++){
                                            if(degrees[i].label == chosenJob){
                                                skill = degrees[i].skill, knowledge = degrees[i].knowledge;
                                                
                                                break;
                                                
                                            }
                                        }
                                    }
                                    awardJobOrHobby(isJob,skill,knowledge);
                                    gainCitizenLifeSkills(isJob,skill,knowledge,updateFunc,nextSteps);
                                    
                                },true);
                            }else{
                                // roll randomly for job/hobby
                                var skill = "", knowledge = "";
                                var isJob = typeof job.skill == "undefined";
                                var randomJob = citizenLifeJob(roller);
                                record("Roll for Citizen Skill/Knowledge: " + randomJob.rolls);
                                updateFunc();
                                skill = randomJob.job.skill, knowledge = randomJob.job.knowledge;
                                awardJobOrHobby(isJob,skill,knowledge);
                                gainCitizenLifeSkills(isJob,skill,knowledge,updateFunc,nextSteps);
                            }
                        }else{
                            // roll randomly for job/hobby
                            var skill = "", knowledge = "";
                            var isJob = typeof job.skill == "undefined";
                            var randomJob = citizenLifeJob(roller);
                            record("Roll for Citizen Skill/Knowledge: " + randomJob.rolls);
                            updateFunc();
                            skill = randomJob.job.skill, knowledge = randomJob.job.knowledge;
                            awardJobOrHobby(isJob,skill,knowledge);
                            gainCitizenLifeSkills(isJob,skill,knowledge,updateFunc,nextSteps);
                        }
                    }else{ // increase job/hobby by 1
                        if(lastCitLifeReceipt == "Job"){
                            lastCitLifeReceipt = "Hobby";
                            if(typeof hobby.skill === "undefined"){
                                record("No skills acquired from useless hobby");
                                nextSteps();
                            }else{
                                if(typeof hobby.knowledge === "undefined" && KnowledgeSpecialties[hobby.skill]){
                                    pickOption(KnowledgeSpecialties[hobby.skill],"Choose a "+hobby.skill+" specialty",(k)=>{
                                        var remark = "(Citizen Life "+lastCitLifeReceipt +")";
                                        gainSkillOrKnowledge(hobby.skill,k,false,remark);
                                        nextSteps();
                                    },true);
                                }else{
                                    var remark = "(Citizen Life "+lastCitLifeReceipt +")";
                                    gainSkillOrKnowledge(hobby.skill,hobby.knowledge,false, remark);
                                    nextSteps();
                                }
                            }
                        }else{
                            lastCitLifeReceipt = "Job";
                            if(typeof job.skill === "undefined"){
                                record("No skills acquired from useless job");
                                nextSteps();
                            }else{
                                if(typeof job.knowledge === "undefined" && KnowledgeSpecialties[job.skill]){
                                    pickOption(KnowledgeSpecialties[job.skill],"Choose a "+job.skill+" specialty",(k)=>{
                                        var remark = "(Citizen Life "+lastCitLifeReceipt +")";
                                        gainSkillOrKnowledge(job.skill,k,false,remark);
                                        updateFunc();
                                        nextSteps();
                                    },true);
                                }else{
                                    var remark = "(Citizen Life "+lastCitLifeReceipt +")";
                                    gainSkillOrKnowledge(job.skill,job.knowledge,false,remark);
                                    updateFunc();
                                    nextSteps();
                                }
                            }
                        }
                    }
                }else{
                    nextSteps();
                }
                
            },true,undefined,CCDescriptions);
        }
    }
    function awardJobOrHobby(isJob,skill,knowledge){
        var jobDesc = "";
        if(typeof knowledge == "undefined"){
            jobDesc = skill;
        }else{
            jobDesc = skill + "("+knowledge+")";
        }
        if(isJob){
            jobDesc = "Job: " + jobDesc;
        }else{
            jobDesc = "Hobby: " + jobDesc;
        }
        careers[careers.length-1].awards.push(jobDesc);
    }
    function resolveSpacer(career, updateFunc, resetCCs){
        if(typeof resetCCs === "undefined"){resetCCs = false;}
        var hasBeen = canResumeFromService(career);
        if(hasBeen.canResume){
            swapCareerIndices(hasBeen.prevCareerIndex);
            resetCCs = true;
        }
        var priorCareers = careers.length;
        var CC = "";
        var getOperationFromRoll = function(sum){
            var operation = "", mod = 0;
            switch(sum){
                case 1: operation = "Battle"; mod = 2; break;
                case 2: operation = "Strike"; mod = 2; break;
                case 3: operation = "Siege"; mod = 0; break;
                case 4: operation = "Patrol"; mod = 1; break;
                case 5: operation = "Mission"; mod = 3; break;
                case 6: operation = "ANM School"; mod = 0; break;
                case 7: operation = "Shore Duty"; mod = 0; break;
                case 8: operation = "Shore Duty"; mod = 0; break;
            }
            return {operation,mod};
        }
        var rollForOperation = function(){
            var mod = 0;
            var roll = roller.d6(1);
            var sum = roll.result;
            var remark = "Roll for operation: ["+roll.rolls.join(",")+"]";
            if(characteristics[4].name === ENUM_CHARACTERISTICS.EDU && characteristics[4].value >= 10){
                sum += 2;
                remark += "+2";
            }
            remark += "=" + sum;
            var opsResult = getOperationFromRoll(sum);
            var operation = opsResult.operation; mod = opsResult.mod;
            remark += " - " + operation;
            record(remark);
            return{operation,mod,remark};
        };
        var advanceAndGetSkills = function(numYears){
            if(typeof numYears === "undefined"){numYears = 4;}
            var maxOperationMod = 0;
            
            var termSkillTables = [];
            var allOperationsEncountered = ["Personal"];
            for(var i = 0, len = numYears; i < len; i++){
                var opResult = rollForOperation();
                var operationHeading = opResult.operation;
                if(operationHeading == "Strike" || operationHeading == "Patrol"){
                    operationHeading = "Patrol/Strike";
                }else if(operationHeading === "ANM School"){
                    careers[careers.length-1].schools.push({school:"ANM School",term:i});
                }
                if(allOperationsEncountered.indexOf(operationHeading) === -1 && typeof CareerSkillTables[career][operationHeading] !== "undefined"){
                    allOperationsEncountered.push(operationHeading);
                }
                var termSkillTable = {table:["Personal"],age:true,note:opResult.operation + " during Year " + (i+1)}; 
                termSkillTables.push(termSkillTable);
                if(opResult.mod > maxOperationMod){ maxOperationMod = opResult.mod; }
            }
            if(( careers[careers.length-1].branch == "Technical" || careers[careers.length-1].branch === "Medical" ) && termSkillTable.table.indexOf("Technical") == -1){
                allOperationsEncountered.push("Technical");
            }
            for(var i = 0, len = termSkillTables.length; i < len; i++){
                termSkillTables[i].table = allOperationsEncountered.slice();
            }
            updateFunc();
            var isOfficer = careers[careers.length-1].rank.officer > 0;
            var branchMod = isOfficer ? ServiceBranchMods[career][careers[careers.length-1].branch] : ServiceBranchMods[career+"Enlisted"][careers[careers.length-1].branch];
            var totalMod = maxOperationMod + branchMod;
            var ccIndex = +(CC.substring(1))-1;
            var ccValue = characteristics[ccIndex].value;

            gainTermSchoolSkills(careers[careers.length-1].career,updateFunc,()=>{
                if(typeof careers[careers.length-1].skillsToGain !== "undefined"){
                    for(var i = 0, len = careers[careers.length-1].skillsToGain.length; i < len; i++){
                        var skillToGain = careers[careers.length-1].skillsToGain[i];
                        var termInWhichToGainSkill = skillToGain.termIndex;
                        termSkillTables[termInWhichToGainSkill].schooling = skillToGain;                        
                    }
                    var skillToGain = careers[careers.length-1].skillsToGain = [];
                }
                var defaultValue = 0;
                if(ccValue+totalMod > 12){
                    defaultValue = ccValue + totalMod - 12;
                }
                var cautionBraveryOptions = [9,8,7,6,5,4,3,2,1,0,-1,-2,-3,-4,-5,-6,-7,-8,-9];
                var cautionBraveryPreviews = cautionBraveryOptions.map((val,i,arr)=>["Injured if Risk roll > " + (val+ccValue-totalMod),"Medal if Reward roll < " + (-val+ccValue+totalMod)]);
                pickOption(cautionBraveryOptions,
                    "Select caution(+) or bravery(-) mod.<br/>" +
                    "Target " + CC + "=" + ccValue + "<br/>Branch:+"+branchMod + " Operation:+" + maxOperationMod+
                    "<br/>Risk: Roll <= "+(ccValue-totalMod) + " + Mod<br/>Reward: Roll <= "+(ccValue+totalMod)+" - Mod",
                    (selectedMod)=>{
                        var caution = +(selectedMod);
                        var numDice = species.Characteristics[ccIndex].nD + gender.Characteristics[ccIndex].nD + caste.Characteristics[ccIndex].nD;
                        var riskResult = checkCharacteristic(CC,numDice,-totalMod+caution,"Risk Roll");
                        record(riskResult.remarks);
                        updateFunc();
                        if(riskResult.success){
                            careers[careers.length-1].awards.push("Campaign Ribbon");
                            
                        }else{
                            var penalty = -totalMod;
                            if(caution < 0){ penalty += caution;}
                            var fresult = roller.flux().result;
                            penalty += fresult;
                            record("Attribute Damage = [" + (-totalMod) + " operation] " + (caution < 0 ? " + [" + (caution) + " bravery]" : "") + " + [" + fresult + " flux] = " + penalty)
                            if(penalty < 0){
                                decreaseCharacteristic(CC,-penalty,"Injury!");
                                if(characteristics[ccIndex].value <= 0){ 
                                    record("This character has died. Please create a new character.");
                                    updateFunc();
                                    return;
                                    characteristics[ccIndex].value = 1;
                                }
                                updateFunc();
                                careers[careers.length-1].awards.push("Wound Badge");
                                if(penalty <= -4){
                                    careers[careers.length-1].awards.push("Disabled");
                                }
                            }else{
                                record("Suffered a superficial injury. Characteristics unchanged."); updateFunc();
                            }
                        }
                        var rewardResult = checkCharacteristic(CC,numDice,totalMod-caution,"Reward Roll");
                        record(rewardResult.remarks);
                        var promoMod = 0;
                        if(rewardResult.success){
                            var rawResult = rewardResult.rolls.reduce((a, b) => a + b, 0);
                            if(careers[careers.length-1].rank.officer > 0){ rawResult += 1;}
                            if(rawResult <= 8){
                                careers[careers.length-1].awards.push("XS");
                                record("Earned Exemplary Service (XS) badge");
                                promoMod += 1;
                            }else if(rawResult <= 10){
                                careers[careers.length-1].awards.push("MCUF");
                                record("Earned Meritorious Conduct Under Fire (MCUF) medal");
                                promoMod += 2;
                            }else if(rawResult <= 11){
                                careers[careers.length-1].awards.push("MCG");
                                record("Earned Medal for Conspicuous Gallantry (MCG)");
                                promoMod += 3;
                            }else if(rawResult <= 12){
                                careers[careers.length-1].awards.push("SEH");
                                record("Earned Starburst for Extreme Heroism (SEH) medal");
                                promoMod += 1;
                            }else{
                                careers[careers.length-1].awards.push("*SEH*");
                                record("Earned Starburst for Extreme Heroism with Diamonds (*SEH*) medal");
                                promoMod += 5;0
                            }
                            updateFunc();
                        }
                    
                    if(careers[careers.length-1].rank.officer > 0){
                        // roll for officer promotion
                        var officerPromotion = false;
                        if(careers[careers.length-1].rank.officer < 7){
                            var promoRoll = checkCharacteristic(ENUM_CHARACTERISTICS.SOC,undefined,promoMod,"Roll for Officer Promotion");
                            record(promoRoll.remarks); updateFunc();
                            officerPromotion = promoRoll.success
                        }
                        if(officerPromotion){
                            termSkillTables.push({age:false,note:"Bonus skill from promotion"});
                            careers[careers.length-1].rank.officer += 1;
                            // gain officer skill here
                            if(careers[careers.length-1].rank.officer == 3){ 
                                gainSkillWithPromptForKnowledge("Promoted to Lieutenant. Gain Engineer.",ENUM_SKILLS.Engineer,()=>{
                                    updateFunc();
                                    gainTermSkills(termSkillTables,ENUM_CAREERS.Spacer,updateFunc,()=>{
                                        updateFunc(); 
                                        promptContinue(ENUM_CAREERS.Spacer,updateFunc);
                                    });
                                });
                            }else if(careers[careers.length-1].rank.officer == 4){
                                gainSkillWithPromptForKnowledge("Promoted to Lt Commander. Gain Pilot.",ENUM_SKILLS.Pilot,()=>{
                                    // TODO Command College in Year 1 of next term
                                    careers[careers.length-1].schools.push("Upcoming Command College");
                                    updateFunc();
                                    gainTermSkills(termSkillTables,ENUM_CAREERS.Spacer,updateFunc,()=>{
                                        updateFunc(); 
                                        promptContinue(ENUM_CAREERS.Spacer,updateFunc);
                                    });
                                });
                            }else if(careers[careers.length-1].rank.officer == 6){
                                gainSkillOrKnowledge(ENUM_SKILLS.Leader,undefined,false,"Promoted to Captain.");
                                updateFunc();
                                gainTermSkills(termSkillTables,ENUM_CAREERS.Spacer,updateFunc,()=>{
                                    updateFunc(); 
                                    promptContinue(ENUM_CAREERS.Spacer,updateFunc);
                                });
                            }else{
                                
                                gainTermSkills(termSkillTables,ENUM_CAREERS.Spacer,updateFunc,()=>{
                                    updateFunc(); 
                                    promptContinue(ENUM_CAREERS.Spacer,updateFunc);
                                });
                            }
                        }else{
                            
                            gainTermSkills(termSkillTables,ENUM_CAREERS.Spacer,updateFunc,()=>{
                                updateFunc(); 
                                promptContinue(ENUM_CAREERS.Spacer,updateFunc);
                            });
                        }
                    }else{
                        // roll for officer commission
                        var commissionRoll = checkCharacteristic("C2",undefined,0,"Roll for Officer Commission");
                        record(commissionRoll.remarks);
                        updateFunc();
                        if(commissionRoll.success){
                            careers[careers.length-1].freeBranchSelection = true;   
                            careers[careers.length-1].rank.officer = 1;
                            gainSkillOrKnowledge(ENUM_SKILLS.Astrogator,undefined,false,"Promoted to O1 Ensign.");
                            termSkillTables.push({age:false,note:"Bonus skill from promotion"});
                            
                            gainTermSkills(termSkillTables,ENUM_CAREERS.Spacer,updateFunc,()=>{
                                updateFunc(); 
                                promptContinue(ENUM_CAREERS.Spacer,updateFunc);
                            });
                        }else{
                            // roll for rating promotion
                            var ratingPromotion = false;
                            if(careers[careers.length-1].rank.enlisted < 6){
                                var ratingRoll = checkCharacteristic("C2",undefined,promoMod,"Roll for enlisted promotion");
                                record(ratingRoll.remarks); updateFunc();
                                ratingPromotion = ratingRoll.success;
                            }
                            if(ratingPromotion){
                                    careers[careers.length-1].freeBranchSelection = true;     
                                    termSkillTables.push({age:false,note:"Bonus skill from promotion"});
                                    careers[careers.length-1].rank.enlisted += 1;
                                    // gain enlisted skill here
                                    if(careers[careers.length-1].rank.enlisted == 4){
                                        gainSkillWithPromptForKnowledge("Promoted to Petty Officer First. Gain Gunner.",ENUM_SKILLS.Gunner,()=>{
                                            
                                            gainTermSkills(termSkillTables,ENUM_CAREERS.Spacer,updateFunc,()=>{
                                                updateFunc(); 
                                                promptContinue(ENUM_CAREERS.Spacer,updateFunc);
                                            });
                                        });
                                    }else if(careers[careers.length-1].rank.enlisted == 5){
                                        gainSkillOrKnowledge(ENUM_SKILLS.Sensors,undefined,false,"Promoted to Chief Petty Officer. Gain Sensors.");
                                        
                                        gainTermSkills(termSkillTables,ENUM_CAREERS.Spacer,updateFunc,()=>{
                                            updateFunc(); 
                                            promptContinue(ENUM_CAREERS.Spacer,updateFunc);
                                        });
                                    }else{
                                        
                                        gainTermSkills(termSkillTables,ENUM_CAREERS.Spacer,updateFunc,()=>{
                                            updateFunc(); 
                                            promptContinue(ENUM_CAREERS.Spacer,updateFunc);
                                        });
                                    }
                               
                            }else{
                                
                                gainTermSkills(termSkillTables,ENUM_CAREERS.Spacer,updateFunc,()=>{
                                    updateFunc(); 
                                    promptContinue(ENUM_CAREERS.Spacer,updateFunc);
                                });
                            }
                        }
                    }
                },true,defaultValue,cautionBraveryPreviews,false);
            });
        };
        var rollForBranch = function(callback,keepExisting){
            var firstTime = typeof keepExisting == "undefined" || keepExisting == false;
            // pick branch
            
            var chooseBranchRoll = checkCharacteristic(ENUM_CHARACTERISTICS.SOC,2,0,"Choose naval branch vs Soc");
            record(chooseBranchRoll.remarks);
            updateFunc();
            if(chooseBranchRoll.success){
                var isOfficer = careers[careers.length-1].rank.officer > 0;
                var options = isOfficer ? ["Line","Engineer","Gunnery","Flight","Technical","Medical"] : ["Crew","Engineer","Gunnery","Technical","Medical"];
                var branchDangerPreviews = options.map(
                    (v,i,arr)=>{
                    var baseDanger = ServiceBranchMods[career+(isOfficer > 0 ? "" : "Enlisted")][v];
                    var glory = "<strong>"+ v+" Operations: </strong><br/>";
                    var opHTML = "<ol>";
                    for(var roll = 1; roll < 7; roll++){
                        var potentialOp = getOperationFromRoll(roll);
                        opHTML += "<li>"+potentialOp.operation+" (+"+(baseDanger + potentialOp.mod)+" danger)</li>";
                    }
                    opHTML += "</ol>";
                    glory += opHTML;
                    return glory;
                    }
                );
                if(!firstTime){
                    var switchBranchOptions = ["Stay in " + careers[careers.length-1].branch + " branch","Switch branches"];
                    var switchBranchPrompt = "Thanks to your promotion, you may switch from "+careers[careers.length-1].branch+" to a different branch.";
                    if(isOfficer && careers[careers.length-1].branch == "Crew"){
                        switchBranchOptions = ["Switch branches"];
                        switchBranchPrompt = "Due to your commission, you must switch from "+careers[careers.length-1].branch+" to a different branch.";
                    }else{
                        var currentBranchIndex = options.indexOf(careers[careers.length-1].branch);
                        options.splice(currentBranchIndex,1);
                        branchDangerPreviews.splice(currentBranchIndex,1);
                    }
                    if(isOfficer){ 
                        switchBranchPrompt = switchBranchPrompt.replace("promotion","commission");
                    }
                    pickOption(switchBranchOptions,switchBranchPrompt,(decision)=>{
                        if(decision === "Switch branches"){
                            pickOption(options, "Choose a new naval branch for your service.",(choice)=>{
                                record("Joined " + choice + " branch");
                                careers[careers.length-1].branch = choice;
                                updateFunc();
                                if(choice == "Technical"){
                                    gainSkillWithPromptForCategory("Technical branch provides a skill.","Trade",()=>{
                                        updateFunc();
                                        callback();
                                    });
                                }else if(choice == "Medical"){
                                    gainSkillOrKnowledge(ENUM_SKILLS.Medic,undefined,false,"Medical branch provides a skill.");
                                    updateFunc();
                                    callback();
                                }else{
                                    callback();
                                }
                            },true,undefined,branchDangerPreviews);
                        }else{
                            record("Declined opportunity to change branches.");
                            callback();
                        }
                    },true,undefined);
                    
                }else{
                    pickOption(options, "You may choose a naval branch for your service.",(choice)=>{
                        careers[careers.length-1].branch = choice;
                        record("Joined " + choice + " branch");
                        updateFunc();
                        if(choice == "Technical"){
                            gainSkillWithPromptForCategory("Technical branch provides a skill.","Trade",()=>{
                                updateFunc();
                                callback();
                            });
                        }else if(choice == "Medical"){
                            gainSkillOrKnowledge(ENUM_SKILLS.Medic,undefined,false,"Medical branch provides a skill.");
                            updateFunc();
                            callback();
                        }else{
                            callback();
                        }
                    },true, undefined, branchDangerPreviews);
                }
                
            }else{
                if(typeof keepExisting == "undefined" || keepExisting == false || (typeof careers[careers.length-1].branch !== "undefined" && careers[careers.length-1].branch  === "Crew")){
                    // roll for branch
                    var roll = roller.d6(1);
                    var sum = roll.result;
                    var remark = "Roll for branch: ["+roll.rolls.join(",")+"]";
                    if(characteristics[4].name === ENUM_CHARACTERISTICS.EDU && characteristics[4].value >= 10){
                        sum += 2;
                        remark += "+2";
                    }
                    remark += "=" + sum;
                    var newBranch = "";
                    var isOfficer = careers[careers.length-1].rank.officer > 0;
                    if(isOfficer){
                        switch(sum){
                            case 1:
                            case 2:
                            case 3: newBranch = "Line"; break;
                            case 4: newBranch = "Engineer"; break;
                            case 5: newBranch = "Gunnery"; break;
                            case 6: newBranch = "Flight"; break;
                            case 7: newBranch = "Technical"; break;
                            case 8: newBranch = "Medical"; break;
                        }
                    }else{
                        switch(sum){
                            case 1:
                            case 2: newBranch = "Crew"; break;
                            case 3: 
                            case 4: newBranch = "Engineer"; break;
                            case 5: 
                            case 6: newBranch = "Gunnery"; break;
                            case 7: newBranch = "Technical"; break;
                            case 8: newBranch = "Medical"; break;
                        }
                    }
                    
                    remark += " - " + newBranch;
                    careers[careers.length - 1].branch = newBranch;
                    record(remark);
                    updateFunc();
                    if(newBranch == "Technical"){
                        gainSkillWithPromptForCategory("Technical branch provides a skill.","Trade",()=>{
                            updateFunc(); callback();
                        })
                    }else if(newBranch == "Medical"){
                        gainSkillOrKnowledge(ENUM_SKILLS.Medic,undefined,false,"Medical branch provides a skill.");
                        updateFunc();
                        callback();
                    }else{
                        callback();
                    }
                }else{
                    record("Remained in " + careers[careers.length-1].branch +" branch.");
                    updateFunc();
                    callback();
                }
            }
        }
        if(CCs.length == 0 || priorCareers == 0 || careers[priorCareers - 1].active == false || resetCCs){
            CCs = getCCs(career);
        }
        var CCDescriptions = CCs.map((val)=>{var cci = +(val.substring(1))-1; return characteristics[cci].name + " (" + characteristics[cci].value + ")";});
        if(priorCareers == 0 || careers[priorCareers - 1].active == false){
            // apply for career
            if(awards.indexOf("Navy Officer1") >= 0){
                awards.splice(awards.indexOf("Navy Officer1"),1);
                 // (automatic commission from NOTC or Naval Academy)
                 careers.push({career:career,awards:[],terms:1,active:true,rank:{label:"O1 Ensign",officer:1,enlisted:0},schools:[]});
                 gainSkillOrKnowledge(ENUM_SKILLS.Astrogator,undefined,false,"Gain Astrogator skill as an Ensign.");
                 updateFunc();
                 pickOption(CCs,"Choose a controlling characteristic for the term.",function(selectedCC){
                    CC = selectedCC;
                    CCs.splice(CCs.indexOf(selectedCC),1);
                    var termNumber = careers[careers.length-1].terms;record("Chose " + selectedCC + " as controlling characteristic for Term #"+termNumber+". Choices remaining: " + CCs.join(","));
                    // prompt for Flight School
                    pickOption(["Attend Flight School","No, don't bother"],"Do you wish to attend flight school?",(choice)=>{
                        var attendingFlightSchool = false;
                        if(choice === "Attend Flight School"){
                            if(awards.indexOf("Honors BA") >= 0){
                                attendingFlightSchool = true;
                            }else{
                                // if no Honors BA, prompt for education waiver
                                attendingFlightSchool = promptEducationWaiver("Flight school requires an Honors BA");
                            }
                            if(attendingFlightSchool){
                                var numDice = species.Characteristics[1].nD + gender.Characteristics[1].nD + caste.Characteristics[1].nD;
                                var flightSchoolResult = checkCharacteristic("C2",numDice,0,"Flight School");
                                record(flightSchoolResult.remarks);
                                updateFunc();
                                if(flightSchoolResult.success){
                                    gainSkillWithPromptForKnowledge("Passed flight school",ENUM_SKILLS.Pilot,()=>{
                                        updateFunc();
                                        gainSkillWithPromptForKnowledge("Passed flight school",ENUM_SKILLS.Pilot,()=>{
                                            updateFunc();
                                            gainSkillWithPromptForKnowledge("Passed flight school",ENUM_SKILLS.Pilot,()=>{
                                                updateFunc();
                                                // set branch = flight
                                                careers[careers.length-1].branch = "Flight";
                                                advanceAge(1); updateFunc();
                                                advanceAndGetSkills(3);
                                            });
                                        });
                                    });
                                }else{ // failed flight school
                                    updateFunc();
                                    rollForBranch(()=>{
                                        // proceed with R&R, +3 years of operations, promotion/commission
                                        advanceAge(1); updateFunc();
                                        advanceAndGetSkills(3);
                                    });
                                }
                            }else{
                                rollForBranch(()=>{
                                    // proceed with R&R, +4 years of skills, promotion/commission
                                    advanceAndGetSkills();
                                });
                            }
                        }else{
                            rollForBranch(()=>{
                                // proceed with R&R, +4 years of skills, promotion/commission
                                advanceAndGetSkills();
                            });
                        }
                    },true);
                },true,undefined,CCDescriptions);
            }else{
                // roll to apply
                var numDice = species.Characteristics[3].nD + gender.Characteristics[3].nD + caste.Characteristics[3].nD;
                var beginRoll = checkCharacteristic(ENUM_CHARACTERISTICS.INT,numDice,0,"Attempt to begin Spacer vs Intellect");
                record(beginRoll.remarks);
                updateFunc();
                if(beginRoll.success){
                    addToReserves("Navy");
                    careers.push({career:career,terms:1,active:true,rank:{label:"R1 Spacehand",officer:0,enlisted:1},schools:[],awards:[]});
                    gainSkillWithPromptForKnowledge("Gain Fighter skill as a Spacehand. ",ENUM_SKILLS.Fighter,()=>{
                        // roll to select branch
                        rollForBranch(()=>{
                            pickOption(CCs,"Choose a controlling characteristic for the term.",function(selectedCC){
                                CC = selectedCC;
                                CCs.splice(CCs.indexOf(selectedCC),1);var termNumber = careers[careers.length-1].terms;record("Chose " + selectedCC + " as controlling characteristic for Term #"+termNumber+". Choices remaining: " + CCs.join(","));
                                // proceed with R&R, +4 years of skills, promotion/commission
                                advanceAndGetSkills();
                            },true,undefined,CCDescriptions);
                        });
                    });
                    
                }else{
                    record("Failed to begin Spacer career.")
                    advanceAge(1);
                    pickOption(["Retry","Try something else"],"Failed to begin Spacer career. Do you wish to retry?",(retryOption)=>{
                        if(retryOption === "Retry"){
                            var numDice = species.Characteristics[3].nD + gender.Characteristics[3].nD + caste.Characteristics[3].nD;
                            var beginRoll = checkCharacteristic(ENUM_CHARACTERISTICS.INT,numDice,0,"Retry attempt to begin Spacer vs Intellect");
                            record(beginRoll.remarks);
                            updateFunc();
                            if(beginRoll.success){
                                addToReserves("Navy");
                                careers.push({career:career,terms:1,active:true,rank:{label:"R1 Spacehand",officer:0,enlisted:1},schools:[],awards:[]});
                                gainSkillWithPromptForKnowledge("Gain Fighter skill as a Spacehand. ",ENUM_SKILLS.Fighter,()=>{
                                    // roll to select branch
                                    rollForBranch(()=>{
                                        pickOption(CCs,"Choose a controlling characteristic for the term.",function(selectedCC){
                                            CC = selectedCC;
                                            CCs.splice(CCs.indexOf(selectedCC),1);var termNumber = careers[careers.length-1].terms;record("Chose " + selectedCC + " as controlling characteristic for Term #"+termNumber+". Choices remaining: " + CCs.join(","));
                                            // proceed with R&R, +4 years of skills, promotion/commission
                                            advanceAndGetSkills();
                                        },true,undefined,CCDescriptions);
                                    });
                                });
                            }else{
                                record("Failed to begin Spacer career.")
                                advanceAge(1);
                                updateFunc();
                            }
                        }
                    });
                }                
            }
        }else{
            if(careers[careers.length-1].freeBranchSelection){
                careers[careers.length-1].freeBranchSelection = false;
                rollForBranch(()=>{
                    careers[careers.length-1].terms += 1;
                    pickOption(CCs,"Choose a controlling characteristic for the term.",function(selectedCC){
                        CC = selectedCC;
                        CCs.splice(CCs.indexOf(selectedCC),1);var termNumber = careers[careers.length-1].terms;record("Chose " + selectedCC + " as controlling characteristic for Term #"+termNumber+". Choices remaining: " + CCs.join(","));
                        // proceed with R&R, +4 years of skills, promotion/commission
                        advanceAndGetSkills();
                        
                    },true,undefined,CCDescriptions);
                },true);
            }else{
                careers[careers.length-1].terms += 1;
                pickOption(CCs,"Choose a controlling characteristic for the term.",function(selectedCC){
                    CC = selectedCC;
                    CCs.splice(CCs.indexOf(selectedCC),1);var termNumber = careers[careers.length-1].terms;record("Chose " + selectedCC + " as controlling characteristic for Term #"+termNumber+". Choices remaining: " + CCs.join(","));
                    // proceed with R&R, +4 years of skills, promotion/commission
                    advanceAndGetSkills();
                    
                },true,undefined,CCDescriptions);
            }
        }
    }
    function resolveSoldier(career, updateFunc, resetCCs){
        if(typeof resetCCs === "undefined"){resetCCs = false;}
        var hasBeen = canResumeFromService(career);
        if(hasBeen.canResume){
            swapCareerIndices(hasBeen.prevCareerIndex);
            resetCCs = true;
        }
        var priorCareers = careers.length;
        var CC = "";
        var getBranchOperationDM = function(branch){
            var branchDM = 0;
            switch(branch){
                case "Protected": branchDM = 0; break;
                case "Infantry": branchDM = 1; break;
                case "Cavalry": branchDM = 3; break;
                case "Medical": branchDM = 4; break;
                case "Artillery": branchDM = 5; break;
                case "Technical": branchDM = 6; break;
            }
            return branchDM;
        }
        var getOperationFromRoll = function(sum){
            var operation = "", mod = 0;
            switch(sum){
                case 1: 
                case 2: operation = "Combat"; mod = 2; break;
                case 3: operation = "Peacekeeper"; mod = 1; break;
                case 4: operation = "Mission"; mod = 2; break;
                case 5: operation = "ANM School"; mod = 0; break;
                case 6: operation = "Combat"; mod = 3; break;
                case 7: operation = "Peacekeeper"; mod = 1; break;
                case 8: operation = "Mission"; mod = 2; break;
                case 9: 
                case 10:
                case 11: 
                case 12: 
                case 13: 
                case 14: operation = "Base"; mod = 0; break;
            }
            return {operation,mod};
        }
        var rollForOperation = function(){
            var mod = 0;
            var roll = roller.d6(1);
            var sum = roll.result;
            var remark = "Roll for operation: ["+roll.rolls.join(",")+"]";
            if(characteristics[4].name === ENUM_CHARACTERISTICS.EDU && characteristics[4].value >= 10){
                sum += 2;
                remark += "+2";
            }
            var branchDM = getBranchOperationDM(careers[careers.length - 1].branch);
            remark += "+"+branchDM;
            sum += branchDM;
            remark += "=" + sum;
            var opsResult = getOperationFromRoll(sum);
            remark += " - " + opsResult.operation;
            var operation = opsResult.operation, mod = opsResult.mod;
            record(remark);
            return{operation,mod,remark};
        };

        var advanceAndGetSkills = function(numYears){
            if(typeof numYears === "undefined"){numYears = 4;}
            var maxOperationMod = 0;
            
            var termSkillTables = [];
            var allOperationsEncountered = ["Personal"];
            var encounteredSomethingOtherThanBase = false;
            for(var i = 0, len = numYears; i < len; i++){
                var opResult = rollForOperation();
                var operationHeading = opResult.operation;
                if(operationHeading === "ANM School"){
                    careers[careers.length-1].schools.push({school:"ANM School",term:i});
                }
                if(allOperationsEncountered.indexOf(operationHeading) === -1 && typeof CareerSkillTables[career][operationHeading] !== "undefined"){
                    allOperationsEncountered.push(operationHeading);
                    if(operationHeading !== "Base" && operationHeading !== "ANM School"){
                        encounteredSomethingOtherThanBase = true;
                    }
                }
                var termSkillTable = {table:["Personal"],age:true,note:opResult.operation + " during Year " + (i+1)}; 
                termSkillTables.push(termSkillTable);
                if(opResult.mod > maxOperationMod){ maxOperationMod = opResult.mod; }
            }
            if(( careers[careers.length-1].branch == "Technical" || careers[careers.length-1].branch === "Medical" ) && termSkillTable.table.indexOf("Technical") == -1){
                allOperationsEncountered.push("Technical");
            }
            if(!encounteredSomethingOtherThanBase){
                allOperationsEncountered.push("Occupation");
            }
            for(var i = 0, len = termSkillTables.length; i < len; i++){
                termSkillTables[i].table = allOperationsEncountered.slice();
            }
            updateFunc();
            var branchMod = ServiceBranchMods[career][careers[careers.length-1].branch];
            var totalMod = maxOperationMod + branchMod;
            var ccIndex = +(CC.substring(1))-1;
            var ccValue = characteristics[ccIndex].value;

            gainTermSchoolSkills(careers[careers.length-1].career,updateFunc,()=>{
                if(typeof careers[careers.length-1].skillsToGain !== "undefined"){
                    for(var i = 0, len = careers[careers.length-1].skillsToGain.length; i < len; i++){
                        var skillToGain = careers[careers.length-1].skillsToGain[i];
                        var termInWhichToGainSkill = skillToGain.termIndex;
                        termSkillTables[termInWhichToGainSkill].schooling = skillToGain;                        
                    }
                    var skillToGain = careers[careers.length-1].skillsToGain = [];
                }
                var defaultValue = 0;
                if(ccValue+totalMod > 12){
                    defaultValue = ccValue + totalMod - 12;
                }
                var cautionBraveryOptions = [9,8,7,6,5,4,3,2,1,0,-1,-2,-3,-4,-5,-6,-7,-8,-9];
                var cautionBraveryPreviews = cautionBraveryOptions.map((val,i,arr)=>["Injured if Risk roll > " + (val+ccValue-totalMod),"Medal if Reward roll < " + (-val+ccValue+totalMod)]);
                
                pickOption(cautionBraveryOptions,
                    "Select caution(+) or bravery(-) mod.<br/>" +
                    "Target " + CC + "=" + ccValue + "<br/>Branch:+"+branchMod + " Operation:+" + maxOperationMod+
                    "<br/>Risk: Roll <= "+(ccValue-totalMod) + " + Mod<br/>Reward: Roll <= "+(ccValue+totalMod)+" - Mod",
                    (selectedMod)=>{
                        var caution = +(selectedMod);
                        var numDice = species.Characteristics[ccIndex].nD + gender.Characteristics[ccIndex].nD + caste.Characteristics[ccIndex].nD;
                        var riskResult = checkCharacteristic(CC,numDice,-totalMod+caution,"Risk Roll");
                        record(riskResult.remarks);
                        updateFunc();
                        if(riskResult.success){
                            careers[careers.length-1].awards.push("Campaign Ribbon");
                            
                        }else{
                            var penalty = -totalMod;
                            if(caution < 0){ penalty += caution;}
                            var fresult = roller.flux().result;
                            penalty += fresult;
                            record("Attribute Damage = [" + (-totalMod) + " operation] " + (caution < 0 ? " + [" + (caution) + " bravery]" : "") + " + [" + fresult + " flux] = " + penalty)
                            if(penalty < 0){
                                decreaseCharacteristic(CC,-penalty,"Injury!");
                                if(characteristics[ccIndex].value <= 0){ 
                                    record("This character has died. Please create a new character.");
                                    updateFunc();
                                    return;
                                    characteristics[ccIndex].value = 1;
                                }
                                updateFunc();
                                careers[careers.length-1].awards.push("Wound Badge");
                                if(penalty <= -4){
                                    careers[careers.length-1].awards.push("Disabled");
                                }
                            }else{
                                record("Suffered a superficial injury. Characteristics unchanged."); updateFunc();
                            }
                        }
                        var rewardResult = checkCharacteristic(CC,numDice,totalMod-caution,"Reward Roll");
                        record(rewardResult.remarks);
                        var promoMod = 0;
                        if(rewardResult.success){
                            var rawResult = rewardResult.rolls.reduce((a, b) => a + b, 0);
                            if(careers[careers.length-1].rank.officer > 0){ rawResult += 1;}
                            if(rawResult <= 8){
                                careers[careers.length-1].awards.push("XS");
                                record("Earned Exemplary Service (XS) badge");
                                promoMod += 1;
                            }else if(rawResult <= 10){
                                careers[careers.length-1].awards.push("MCUF");
                                record("Earned Meritorious Conduct Under Fire (MCUF) medal");
                                promoMod += 2;
                            }else if(rawResult <= 11){
                                careers[careers.length-1].awards.push("MCG");
                                record("Earned Medal for Conspicuous Gallantry (MCG)");
                                promoMod += 3;
                            }else if(rawResult <= 12){
                                careers[careers.length-1].awards.push("SEH");
                                record("Earned Starburst for Extreme Heroism (SEH) medal");
                                promoMod += 1;
                            }else{
                                careers[careers.length-1].awards.push("*SEH*");
                                record("Earned Starburst for Extreme Heroism with Diamonds (*SEH*) medal");
                                promoMod += 5;0
                            }
                            updateFunc();
                        }
                    
                    if(careers[careers.length-1].rank.officer > 0){
                        // roll for officer promotion
                        var officerPromotion = false
                        if(careers[careers.length-1].rank.officer < 7){
                            var promoRoll = checkCharacteristic(ENUM_CHARACTERISTICS.SOC,undefined,promoMod,"Roll for Officer Promotion");
                            record(promoRoll.remarks); updateFunc();
                            officerPromotion = promoRoll.success
                        }
                        if(officerPromotion){
                            termSkillTables.push({age:false,note:"Bonus skill from promotion"});
                            careers[careers.length-1].rank.officer += 1;
                            // gain officer skill here
                            if(careers[careers.length-1].rank.officer == 4){ 
                                gainSkillOrKnowledge(ENUM_SKILLS.Tactics,undefined,false,"Promoted to Major.");
                                updateFunc();
                                careers[careers.length-1].schools.push("Upcoming Command College");
                                gainTermSkills(termSkillTables,ENUM_CAREERS.Soldier,updateFunc,()=>{
                                    updateFunc(); 
                                    promptContinue(ENUM_CAREERS.Soldier,updateFunc);
                                });
                                
                            }else if(careers[careers.length-1].rank.officer == 6){
                                gainSkillOrKnowledge(ENUM_SKILLS.Leader,undefined,false,"Promoted to Colonel.");
                                updateFunc();
                                gainTermSkills(termSkillTables,ENUM_CAREERS.Soldier,updateFunc,()=>{
                                    updateFunc(); 
                                    promptContinue(ENUM_CAREERS.Soldier,updateFunc);
                                });
                            }else{
                                
                                gainTermSkills(termSkillTables,ENUM_CAREERS.Soldier,updateFunc,()=>{
                                    updateFunc(); 
                                    promptContinue(ENUM_CAREERS.Soldier,updateFunc);
                                });
                            }
                        }else{
                            
                            gainTermSkills(termSkillTables,ENUM_CAREERS.Soldier,updateFunc,()=>{
                                updateFunc(); 
                                promptContinue(ENUM_CAREERS.Soldier,updateFunc);
                            });
                        }
                    }else{
                        // roll for officer commission
                        var commissionRoll = checkCharacteristic("C3",undefined,0,"Roll for Officer Commission");
                        record(commissionRoll.remarks);
                        updateFunc();
                        if(commissionRoll.success){
                            careers[careers.length-1].freeBranchSelection = true;    
                            careers[careers.length-1].rank.officer = 1;
                            gainSkillOrKnowledge(ENUM_SKILLS.Leader,undefined,false,"Promoted to O1 2nd Lieutenant.");
                            termSkillTables.push({age:false,note:"Bonus skill from promotion"});
                            updateFunc();
                            gainTermSkills(termSkillTables,ENUM_CAREERS.Soldier,updateFunc,()=>{
                                updateFunc(); 
                                promptContinue(ENUM_CAREERS.Soldier,updateFunc);
                            });
                        }else{
                            // roll for rating promotion
                            var ratingPromotion = false;
                            if(careers[careers.length-1].rank.enlisted < 6){
                                var ratingRoll = checkCharacteristic("C3",undefined,promoMod,"Roll for enlisted promotion");
                                record(ratingRoll.remarks); updateFunc();
                                ratingPromotion = ratingRoll.success
                            }
                            if(ratingPromotion){
                                    careers[careers.length-1].freeBranchSelection = true;     
                                    termSkillTables.push({age:false,note:"Bonus skill from promotion"});
                                    careers[careers.length-1].rank.enlisted += 1;
                                    // gain enlisted skill here
                                    if(careers[careers.length-1].rank.enlisted == 3){
                                        gainSkillWithPromptForKnowledge("Promoted to Sergeant. Gain Heavy Weapons.",ENUM_SKILLS.HeavyWeapons,()=>{
                                            updateFunc();
                                            gainTermSkills(termSkillTables,ENUM_CAREERS.Soldier,updateFunc,()=>{
                                                updateFunc(); 
                                                promptContinue(ENUM_CAREERS.Soldier,updateFunc);
                                            });
                                        });
                                    }else if(careers[careers.length-1].rank.enlisted == 4){
                                        gainSkillOrKnowledge(ENUM_SKILLS.Leader,undefined,false,"Promoted to Staff Sergeant.");
                                        updateFunc();
                                        gainTermSkills(termSkillTables,ENUM_CAREERS.Soldier,updateFunc,()=>{
                                            updateFunc(); 
                                            promptContinue(ENUM_CAREERS.Soldier,updateFunc);
                                        });
                                    }else{
                                        
                                        gainTermSkills(termSkillTables,ENUM_CAREERS.Soldier,updateFunc,()=>{
                                            updateFunc(); 
                                            promptContinue(ENUM_CAREERS.Soldier,updateFunc);
                                        });
                                    }
                               
                            }else{
                                
                                gainTermSkills(termSkillTables,ENUM_CAREERS.Soldier,updateFunc,()=>{
                                    updateFunc(); 
                                    promptContinue(ENUM_CAREERS.Soldier,updateFunc);
                                });
                            }
                        }
                    }
                },true,defaultValue,cautionBraveryPreviews,false);
            });
        };

        var rollForBranch = function(callback,keepExisting){
            var firstTime = typeof keepExisting == "undefined" || keepExisting == false;
            // pick branch
            
            var chooseBranchRoll = checkCharacteristic(ENUM_CHARACTERISTICS.SOC,2,0,"Choose army branch vs Soc");
            record(chooseBranchRoll.remarks);
            updateFunc();
            if(chooseBranchRoll.success){
                var options = ["Infantry","Artillery","Cavalry","Protected","Technical","Medical"];
                var branchDangerPreviews = options.map((v,i,arr)=>{
                    var baseDanger = ServiceBranchMods[career][v];
                    var glory = "<strong>"+ v+" Operations: </strong><br/>";
                    var branchDM = getBranchOperationDM(v);
                    var opHTML = "<ol>";
                    for(var roll = 1; roll < 7; roll++){
                        var potentialOp = getOperationFromRoll(roll + branchDM);
                        opHTML += "<li>"+potentialOp.operation+" (+"+(baseDanger + potentialOp.mod)+" danger)</li>";
                    }
                    opHTML += "</ol>";
                    glory += opHTML;
                    return glory;
                });
                var isOfficer = careers[careers.length-1].rank.officer > 0;
                if(!firstTime){
                    var switchBranchOptions = ["Stay in " + careers[careers.length-1].branch + " branch","Switch branches"];
                    var switchBranchPrompt = "Thanks to your promotion, you may switch from "+careers[careers.length-1].branch+" to a different branch.";
                    if(isOfficer){ 
                        switchBranchPrompt = switchBranchPrompt.replace("promotion","commission");
                    }
                    pickOption(switchBranchOptions,switchBranchPrompt,(decision)=>{
                        if(decision === "Switch branches"){
                            var currentBranchIndex = options.indexOf(careers[careers.length-1].branch);
                            options.splice(currentBranchIndex,1);
                            branchDangerPreviews.splice(currentBranchIndex,1);
                            pickOption(options, "Choose a new army branch for your service.",(choice)=>{
                                record("Joined " + choice + " branch");
                                careers[careers.length-1].branch = choice;
                                updateFunc();
                                if(choice == "Technical"){
                                    gainSkillWithPromptForCategory("Technical branch provides a skill.","Trade",()=>{
                                        updateFunc();
                                        callback();
                                    });
                                }else if(choice == "Medical"){
                                    gainSkillOrKnowledge(ENUM_SKILLS.Medic,undefined,false,"Medical branch provides a skill.");
                                    updateFunc();
                                    callback();
                                }else{
                                    callback();
                                }
                            },true,undefined,branchDangerPreviews);
                        }else{
                            record("Declined opportunity to change branches.");
                            callback();
                        }
                    },true,undefined);
                    
                }else{
                    pickOption(options, "You may choose an army branch for your service.",(choice)=>{
                        careers[careers.length-1].branch = choice;
                        record("Joined " + choice + " branch");
                        updateFunc();
                        if(choice == "Technical"){
                            gainSkillWithPromptForCategory("Technical branch provides a skill.","Trade",()=>{
                                updateFunc();
                                callback();
                            });
                        }else if(choice == "Medical"){
                            gainSkillOrKnowledge(ENUM_SKILLS.Medic,undefined,false,"Medical branch provides a skill.");
                            updateFunc();
                            callback();
                        }else{
                            callback();
                        }
                    },true, undefined, branchDangerPreviews);
                } 
            }else{
                if(typeof keepExisting == "undefined" || keepExisting == false){
                    // roll for branch
                    var roll = roller.d6(1);
                    var sum = roll.result;
                    var remark = "Roll for branch: ["+roll.rolls.join(",")+"]";
                    if(characteristics[4].name === ENUM_CHARACTERISTICS.EDU && characteristics[4].value >= 10){
                        sum += 2;
                        remark += "+2";
                    }
                    remark += "=" + sum;
                    var newBranch = "";
                    switch(sum){
                        case 1:
                        case 2: newBranch = "Infantry"; break;
                        case 3: newBranch = "Artillery"; break;
                        case 4: newBranch = "Cavalry"; break;
                        case 5: 
                        case 6: newBranch = "Protected"; break;
                        case 7: newBranch = "Technical"; break;
                        case 8: newBranch = "Medical"; break;
                    }
                    remark += " - " + newBranch;
                    careers[careers.length - 1].branch = newBranch;
                    record(remark);
                    updateFunc();
                    if(newBranch == "Technical"){
                        gainSkillWithPromptForCategory("Technical branch provides a skill.","Trade",()=>{
                            updateFunc(); callback();
                        })
                    }else if(newBranch == "Medical"){
                        gainSkillOrKnowledge(ENUM_SKILLS.Medic,undefined,false,"Medical branch provides a skill.");
                        updateFunc();
                        callback();
                    }else{
                        callback();
                    }
                }else{
                    callback();
                }
            }
        };
        if(CCs.length == 0 || priorCareers == 0 || careers[priorCareers - 1].active == false || resetCCs){
            CCs = getCCs(career);
        }
        var CCDescriptions = CCs.map((val)=>{var cci = +(val.substring(1))-1; return characteristics[cci].name + " (" + characteristics[cci].value + ")";});
        if(priorCareers == 0 || careers[priorCareers - 1].active == false){
            // apply for career
            if(awards.indexOf("Army Officer1") >= 0){
                awards.splice(awards.indexOf("Army Officer1"),1);
                 // (automatic commission from OTC or Military Academy)
                 careers.push({career:career,awards:[],terms:1,active:true,rank:{label:"O1 2nd Lieutenant",officer:1,enlisted:0},schools:[]});
                 gainSkillOrKnowledge(ENUM_SKILLS.Leader,undefined,false,"Gain Leader skill as an 2nd Lieutenant.");
                 updateFunc();
                 pickOption(CCs,"Choose a controlling characteristic for the term.",function(selectedCC){
                    CC = selectedCC;
                    CCs.splice(CCs.indexOf(selectedCC),1);
                    var termNumber = careers[careers.length-1].terms;
                    record("Chose " + selectedCC + " as controlling characteristic for Term #"+termNumber+". Choices remaining: " + CCs.join(","));
                    rollForBranch(()=>{
                        // proceed with R&R, +4 years of skills, promotion/commission
                        advanceAndGetSkills();
                    });
                        
                },true,undefined,CCDescriptions);
            }else{
                // roll to apply
                var numDice = species.Characteristics[0].nD + gender.Characteristics[0].nD + caste.Characteristics[0].nD;
                var beginRoll = checkCharacteristic(ENUM_CHARACTERISTICS.STR,numDice,0,"Attempt to begin Soldier vs Strength");
                record(beginRoll.remarks);
                updateFunc();
                if(beginRoll.success){
                    addToReserves("Army");
                    careers.push({career:career,terms:1,active:true,rank:{label:"S1 Private",officer:0,enlisted:1},schools:[],awards:[]});
                    gainSkillWithPromptForKnowledge("Gain Fighter skill as a Private. ",ENUM_SKILLS.Fighter,()=>{
                        // roll to select branch
                        rollForBranch(()=>{
                            pickOption(CCs,"Choose a controlling characteristic for the term.",function(selectedCC){
                                CC = selectedCC;
                                CCs.splice(CCs.indexOf(selectedCC),1);var termNumber = careers[careers.length-1].terms;record("Chose " + selectedCC + " as controlling characteristic for Term #"+termNumber+". Choices remaining: " + CCs.join(","));
                                // proceed with R&R, +4 years of skills, promotion/commission
                                advanceAndGetSkills();
                            },true,undefined,CCDescriptions);
                        });
                    });
                    
                }else{
                    record("Failed to begin Soldier career.")
                    advanceAge(1);
                    pickOption(["Retry","Try something else"],"Failed to begin Soldier career. Do you wish to retry?",(retryOption)=>{
                        if(retryOption === "Retry"){
                            var numDice = species.Characteristics[0].nD + gender.Characteristics[0].nD + caste.Characteristics[0].nD;
                            var beginRoll = checkCharacteristic(ENUM_CHARACTERISTICS.STR,numDice,0,"Attempt to begin Soldier vs Strength");
                            record(beginRoll.remarks);
                            updateFunc();
                            if(beginRoll.success){
                                addToReserves("Army");
                                careers.push({career:career,terms:1,active:true,rank:{label:"S1 Private",officer:0,enlisted:1},schools:[],awards:[]});
                                gainSkillWithPromptForKnowledge("Gain Fighter skill as a Private. ",ENUM_SKILLS.Fighter,()=>{
                                    // roll to select branch
                                    rollForBranch(()=>{
                                        pickOption(CCs,"Choose a controlling characteristic for the term.",function(selectedCC){
                                            CC = selectedCC;
                                            CCs.splice(CCs.indexOf(selectedCC),1);var termNumber = careers[careers.length-1].terms;
                                            record("Chose " + selectedCC + " as controlling characteristic for Term #"+termNumber+". Choices remaining: " + CCs.join(","));
                                            // proceed with R&R, +4 years of skills, promotion/commission
                                            advanceAndGetSkills();
                                        },true,undefined,CCDescriptions);
                                    });
                                });
                            }else{
                                record("Failed to begin Soldier career.")
                                advanceAge(1);
                                updateFunc();
                            }
                        }
                    });
                }                
            }
        }else{
            if(careers[careers.length-1].freeBranchSelection){
                careers[careers.length-1].freeBranchSelection = false;
                rollForBranch(()=>{
                    careers[careers.length-1].terms += 1;
                    pickOption(CCs,"Choose a controlling characteristic for the term.",function(selectedCC){
                        CC = selectedCC;
                        CCs.splice(CCs.indexOf(selectedCC),1);var termNumber = careers[careers.length-1].terms;record("Chose " + selectedCC + " as controlling characteristic for Term #"+termNumber+". Choices remaining: " + CCs.join(","));
                        // proceed with R&R, +4 years of skills, promotion/commission
                        advanceAndGetSkills();
                        
                    },true,undefined,CCDescriptions);
                },true);
            }else{
                careers[careers.length-1].terms += 1;
                pickOption(CCs,"Choose a controlling characteristic for the term.",function(selectedCC){
                    CC = selectedCC;
                    CCs.splice(CCs.indexOf(selectedCC),1);var termNumber = careers[careers.length-1].terms;record("Chose " + selectedCC + " as controlling characteristic for Term #"+termNumber+". Choices remaining: " + CCs.join(","));
                    // proceed with R&R, +4 years of skills, promotion/commission
                    advanceAndGetSkills();
                    
                },true,undefined,CCDescriptions);
            }
        }
    }
    function resolveMarine(career, updateFunc, resetCCs){
        if(typeof resetCCs === "undefined"){resetCCs = false;}
        var hasBeen = canResumeFromService(career);
        if(hasBeen.canResume){
            swapCareerIndices(hasBeen.prevCareerIndex);
            resetCCs = true;
        }
        var priorCareers = careers.length;
        var CC = "";
        var getBranchOperationDM = function(branch){
            var branchDM = 0;
            switch(branch){
                case "Infantry": branchDM = 2; break;
                case "Artillery": branchDM = 5; break;
                case "Cavalry": branchDM = 3; break;
                case "Protected": branchDM = 1; break;
                case "Commando": branchDM = 0; break;
                case "Technical": branchDM = 6; break;
                case "Medical": branchDM = 4; break;
            }
            return branchDM;
        }
        var getOperationFromRoll = function(sum){
            var operation = "", mod = 0;
            switch(sum){
                case 1: 
                case 2: operation = "Combat"; mod = 2; break;
                case 3: operation = "Peacekeeper"; mod = 1; break;
                case 4: operation = "Mission"; mod = 2; break;
                case 5: operation = "ANM School"; mod = 0; break;
                case 6: operation = "Combat"; mod = 3; break;
                case 7: operation = "Peacekeeper"; mod = 1; break;
                case 8: operation = "Mission"; mod = 2; break;
                case 9: 
                case 10:
                case 11: 
                case 12: 
                case 13: 
                case 14: 
                case 15: 
                case 16: operation = "Garrison"; mod = 0; break;
            }
            return {operation,mod};
        }
        var rollForOperation = function(){
            var mod = 0;
            var roll = roller.d6(1);
            var sum = roll.result;
            var remark = "Roll for operation: ["+roll.rolls.join(",")+"]";
            if(characteristics[4].name === ENUM_CHARACTERISTICS.EDU && characteristics[4].value >= 10){
                sum += 2;
                remark += "+2";
            }
            var branchDM = getBranchOperationDM(careers[careers.length - 1].branch);
            
            remark += "+"+branchDM;
            sum += branchDM;
            remark += "=" + sum;
            var opResult = getOperationFromRoll(sum);
            var operation = opResult.operation;
            mod = opResult.mod;
            remark += " - " + operation;
            record(remark);
            return{operation,mod,remark};
        };

        var advanceAndGetSkills = function(numYears){
            if(typeof numYears === "undefined"){numYears = 4;}
            var maxOperationMod = 0;
            
            var termSkillTables = [];
            var allOperationsEncountered = ["Personal"];
            var encounteredSomethingOtherThanBase = false;
            for(var i = 0, len = numYears; i < len; i++){
                var opResult = rollForOperation();
                var operationHeading = opResult.operation;
                if(operationHeading === "ANM School"){
                    careers[careers.length-1].schools.push({school:"ANM School",term:i});
                }
                if(allOperationsEncountered.indexOf(operationHeading) === -1 && typeof CareerSkillTables[career][operationHeading] !== "undefined"){
                    allOperationsEncountered.push(operationHeading);
                    if(operationHeading !== "Garrison" && operationHeading !== "ANM School"){
                        encounteredSomethingOtherThanBase = true;
                    }
                }
                var termSkillTable = {table:["Personal"],age:true,note:opResult.operation + " during Year " + (i+1)}; 
                termSkillTables.push(termSkillTable);
                if(opResult.mod > maxOperationMod){ maxOperationMod = opResult.mod; }
            }
            if(( careers[careers.length-1].branch == "Technical" || careers[careers.length-1].branch === "Medical" ) && termSkillTable.table.indexOf("Technical") == -1){
                allOperationsEncountered.push("Technical");
            }
            if(!encounteredSomethingOtherThanBase){
                allOperationsEncountered.push("Occupation");
            }
            for(var i = 0, len = termSkillTables.length; i < len; i++){
                termSkillTables[i].table = allOperationsEncountered.slice();
            }
            updateFunc();
            var branchMod = ServiceBranchMods[career][careers[careers.length-1].branch];
            var totalMod = maxOperationMod + branchMod;
            var ccIndex = +(CC.substring(1))-1;
            var ccValue = characteristics[ccIndex].value;

            gainTermSchoolSkills(careers[careers.length-1].career,updateFunc,()=>{
                if(typeof careers[careers.length-1].skillsToGain !== "undefined"){
                    for(var i = 0, len = careers[careers.length-1].skillsToGain.length; i < len; i++){
                        var skillToGain = careers[careers.length-1].skillsToGain[i];
                        var termInWhichToGainSkill = skillToGain.termIndex;
                        termSkillTables[termInWhichToGainSkill].schooling = skillToGain;                        
                    }
                    var skillToGain = careers[careers.length-1].skillsToGain = [];
                }
                var defaultValue = 0;
                if(ccValue+totalMod > 12){
                    defaultValue = ccValue + totalMod - 12;
                }
                var cautionBraveryOptions = [9,8,7,6,5,4,3,2,1,0,-1,-2,-3,-4,-5,-6,-7,-8,-9];
                var cautionBraveryPreviews = cautionBraveryOptions.map((val,i,arr)=>["Injured if Risk roll > " + (val+ccValue-totalMod),"Medal if Reward roll < " + (-val+ccValue+totalMod)]);
                
                pickOption(cautionBraveryOptions,
                    "Select caution(+) or bravery(-) mod.<br/>" +
                    "Target " + CC + "=" + ccValue + "<br/>Branch:+"+branchMod + " Operation:+" + maxOperationMod+
                    "<br/>Risk: Roll <= "+(ccValue-totalMod) + " + Mod<br/>Reward: Roll <= "+(ccValue+totalMod)+" - Mod",
                    (selectedMod)=>{
                        var caution = +(selectedMod);
                        var numDice = species.Characteristics[ccIndex].nD + gender.Characteristics[ccIndex].nD + caste.Characteristics[ccIndex].nD;
                        var riskResult = checkCharacteristic(CC,numDice,-totalMod+caution,"Risk Roll");
                        record(riskResult.remarks);
                        updateFunc();
                        if(riskResult.success){
                            careers[careers.length-1].awards.push("Campaign Ribbon");
                            
                        }else{
                            var penalty = -totalMod;
                            if(caution < 0){ penalty += caution;}
                            var fresult = roller.flux().result;
                            penalty += fresult;
                            record("Attribute Damage = [" + (-totalMod) + " operation] " + (caution < 0 ? " + [" + (caution) + " bravery]" : "") + " + [" + fresult + " flux] = " + penalty)
                            if(penalty < 0){
                                decreaseCharacteristic(CC,-penalty,"Injury!");
                                if(characteristics[ccIndex].value <= 0){ 
                                    record("This character has died. Please create a new character.");
                                    updateFunc();
                                    return;
                                    characteristics[ccIndex].value = 1;
                                }
                                updateFunc();
                                careers[careers.length-1].awards.push("Wound Badge");
                                if(penalty <= -4){
                                    careers[careers.length-1].awards.push("Disabled");
                                }
                            }else{
                                record("Suffered a superficial injury. Characteristics unchanged."); updateFunc();
                            }
                        }
                        var rewardResult = checkCharacteristic(CC,numDice,totalMod-caution,"Reward Roll");
                        record(rewardResult.remarks);
                        var promoMod = 0;
                        if(rewardResult.success){
                            var rawResult = rewardResult.rolls.reduce((a, b) => a + b, 0);
                            if(careers[careers.length-1].rank.officer > 0){ rawResult += 1;}
                            if(rawResult <= 8){
                                careers[careers.length-1].awards.push("XS");
                                record("Earned Exemplary Service (XS) badge");
                                promoMod += 1;
                            }else if(rawResult <= 10){
                                careers[careers.length-1].awards.push("MCUF");
                                record("Earned Meritorious Conduct Under Fire (MCUF) medal");
                                promoMod += 2;
                            }else if(rawResult <= 11){
                                careers[careers.length-1].awards.push("MCG");
                                record("Earned Medal for Conspicuous Gallantry (MCG)");
                                promoMod += 3;
                            }else if(rawResult <= 12){
                                careers[careers.length-1].awards.push("SEH");
                                record("Earned Starburst for Extreme Heroism (SEH) medal");
                                promoMod += 1;
                            }else{
                                careers[careers.length-1].awards.push("*SEH*");
                                record("Earned Starburst for Extreme Heroism with Diamonds (*SEH*) medal");
                                promoMod += 5;0
                            }
                            updateFunc();
                        }
                    
                    if(careers[careers.length-1].rank.officer > 0){
                        // roll for officer promotion
                        var officerPromotion = false;
                        if(careers[careers.length-1].rank.officer < 7){
                            var promoRoll = checkCharacteristic(ENUM_CHARACTERISTICS.INT,undefined,promoMod,"Roll for Officer Promotion");
                            record(promoRoll.remarks); updateFunc();
                            officerPromotion = promoRoll.success;
                        }
                        if(officerPromotion){
                            termSkillTables.push({age:false,note:"Bonus skill from promotion"});
                            careers[careers.length-1].rank.officer += 1;
                            // gain officer skill here
                            if(careers[careers.length-1].rank.officer == 4){ 
                                gainSkillOrKnowledge(ENUM_SKILLS.Tactics,undefined,false,"Promoted to Force Commander.");
                                updateFunc();
                                careers[careers.length-1].schools.push("Upcoming Command College");
                                gainTermSkills(termSkillTables,ENUM_CAREERS.Marine,updateFunc,()=>{
                                    updateFunc(); 
                                    promptContinue(ENUM_CAREERS.Marine,updateFunc);
                                });
                                
                            }else if(careers[careers.length-1].rank.officer == 6){
                                gainSkillOrKnowledge(ENUM_SKILLS.Leader,undefined,false,"Promoted to Coronel.");
                                updateFunc();
                                gainTermSkills(termSkillTables,ENUM_CAREERS.Marine,updateFunc,()=>{
                                    updateFunc(); 
                                    promptContinue(ENUM_CAREERS.Marine,updateFunc);
                                });
                            }else{
                                
                                gainTermSkills(termSkillTables,ENUM_CAREERS.Marine,updateFunc,()=>{
                                    updateFunc(); 
                                    promptContinue(ENUM_CAREERS.Marine,updateFunc);
                                });
                            }
                        }else{
                            
                            gainTermSkills(termSkillTables,ENUM_CAREERS.Marine,updateFunc,()=>{
                                updateFunc(); 
                                promptContinue(ENUM_CAREERS.Marine,updateFunc);
                            });
                        }
                    }else{
                        // roll for officer commission
                        var commissionRoll = checkCharacteristic("C3",undefined,0,"Roll for Officer Commission");
                        record(commissionRoll.remarks);
                        updateFunc();
                        if(commissionRoll.success){
                            careers[careers.length-1].freeBranchSelection = true;    
                            careers[careers.length-1].rank.officer = 1;
                            gainSkillOrKnowledge(ENUM_SKILLS.Leader,undefined,false,"Promoted to O1 2nd Lieutenant.");
                            updateFunc();
                            termSkillTables.push({age:false,note:"Bonus skill from promotion"});                            
                            gainTermSkills(termSkillTables,ENUM_CAREERS.Marine,updateFunc,()=>{
                                updateFunc(); 
                                promptContinue(ENUM_CAREERS.Marine,updateFunc);
                            });
                        }else{
                            var ratingPromotion = false;
                            if(careers[careers.length-1].rank.enlisted < 6){
                                // roll for rating promotion
                                var ratingRoll = checkCharacteristic("C1",undefined,promoMod,"Roll for enlisted promotion");
                                record(ratingRoll.remarks); updateFunc();
                                ratingPromotion = ratingRoll.success;
                            }
                            if(ratingPromotion){
                                    careers[careers.length-1].freeBranchSelection = true;     
                                    termSkillTables.push({age:false,note:"Bonus skill from promotion"});
                                    careers[careers.length-1].rank.enlisted += 1;
                                    // gain enlisted skill here
                                    if(careers[careers.length-1].rank.enlisted == 3){
                                        gainSkillWithPromptForKnowledge("Promoted to Sergeant. Gain Heavy Weapons.",ENUM_SKILLS.HeavyWeapons,()=>{
                                            updateFunc();
                                            gainTermSkills(termSkillTables,ENUM_CAREERS.Marine,updateFunc,()=>{
                                                updateFunc(); 
                                                promptContinue(ENUM_CAREERS.Marine,updateFunc);
                                            });
                                        });
                                    }else if(careers[careers.length-1].rank.enlisted == 4){
                                        gainSkillOrKnowledge(ENUM_SKILLS.Tactics,undefined,false,"Promoted to Staff Sergeant.");
                                        updateFunc();
                                        gainTermSkills(termSkillTables,ENUM_CAREERS.Marine,updateFunc,()=>{
                                            updateFunc(); 
                                            promptContinue(ENUM_CAREERS.Marine,updateFunc);
                                        });
                                    }else if(careers[careers.length-1].rank.enlisted == 5){
                                        gainSkillOrKnowledge(ENUM_SKILLS.Leader,undefined,false,"Promoted to Master Sergeant.");
                                        updateFunc();
                                        gainTermSkills(termSkillTables,ENUM_CAREERS.Marine,updateFunc,()=>{
                                            updateFunc(); 
                                            promptContinue(ENUM_CAREERS.Marine,updateFunc);
                                        });
                                    }else{
                                        
                                        gainTermSkills(termSkillTables,ENUM_CAREERS.Marine,updateFunc,()=>{
                                            updateFunc(); 
                                            promptContinue(ENUM_CAREERS.Marine,updateFunc);
                                        });
                                    }
                               
                            }else{
                                
                                gainTermSkills(termSkillTables,ENUM_CAREERS.Marine,updateFunc,()=>{
                                    updateFunc(); 
                                    promptContinue(ENUM_CAREERS.Marine,updateFunc);
                                });
                            }
                        }
                    }
                },true,defaultValue,cautionBraveryPreviews,false);
            });
        };

        var rollForBranch = function(callback,keepExisting){
            var firstTime = typeof keepExisting == "undefined" || keepExisting == false;
            // pick branch
            
            var chooseBranchRoll = checkCharacteristic(ENUM_CHARACTERISTICS.SOC,2,0,"Choose marine branch vs Soc");
            record(chooseBranchRoll.remarks);
            updateFunc();
            if(chooseBranchRoll.success){
                var isOfficer = careers[careers.length-1].rank.officer > 0;
                var options = ["Infantry","Artillery","Cavalry","Protected","Commando","Technical","Medical"];
                var branchDangerPreviews = options.map((v,i,arr)=>{
                    var baseDanger = ServiceBranchMods[career][v];
                    var glory = "<strong>"+ v+" Operations: </strong><br/>";
                    var branchDM = getBranchOperationDM(v);
                    var opHTML = "<ol>";
                    for(var roll = 1; roll < 7; roll++){
                        var potentialOp = getOperationFromRoll(roll + branchDM);
                        opHTML += "<li>"+potentialOp.operation+" (+"+(baseDanger + potentialOp.mod)+" danger)</li>";
                    }
                    opHTML += "</ol>";
                    glory += opHTML;
                    return glory;
                });
                if(!firstTime){
                    var switchBranchOptions = ["Stay in " + careers[careers.length-1].branch + " branch","Switch branches"];
                    var switchBranchPrompt = "Thanks to your promotion, you may switch from "+careers[careers.length-1].branch+" to a different branch.";
                    if(isOfficer){ 
                        switchBranchPrompt = switchBranchPrompt.replace("promotion","commission");
                    }
                    pickOption(switchBranchOptions,switchBranchPrompt,(decision)=>{
                        if(decision === "Switch branches"){
                            var currentBranchIndex = options.indexOf(careers[careers.length-1].branch);
                            options.splice(currentBranchIndex,1);
                            branchDangerPreviews.splice(currentBranchIndex,1);
                            pickOption(options, "Choose a new marine branch for your service.",(choice)=>{
                                record("Joined " + choice + " branch");
                                careers[careers.length-1].branch = choice;
                                updateFunc();
                                if(choice == "Technical"){
                                    gainSkillWithPromptForCategory("Technical branch provides a skill.","Trade",()=>{
                                        updateFunc();
                                        callback();
                                    });
                                }else if(choice == "Medical"){
                                    gainSkillOrKnowledge(ENUM_SKILLS.Medic,undefined,false,"Medical branch provides a skill.");
                                    updateFunc();
                                    callback();
                                }else{
                                    callback();
                                }
                            },true,undefined,branchDangerPreviews);
                        }else{
                            record("Declined opportunity to change branches.");
                            callback();
                        }
                    },true,undefined);
                    
                }else{
                    pickOption(options, "You may choose a marine branch for your service.",(choice)=>{
                        careers[careers.length-1].branch = choice;
                        record("Joined " + choice + " branch");
                        updateFunc();
                        if(choice == "Technical"){
                            gainSkillWithPromptForCategory("Technical branch provides a skill.","Trade",()=>{
                                updateFunc();
                                callback();
                            });
                        }else if(choice == "Medical"){
                            gainSkillOrKnowledge(ENUM_SKILLS.Medic,undefined,false,"Medical branch provides a skill.");
                            updateFunc();
                            callback();
                        }else{
                            callback();
                        }
                    },true, undefined, branchDangerPreviews);
                }                
            }else{
                if(typeof keepExisting == "undefined" || keepExisting == false){
                    // roll for branch
                    var roll = roller.d6(1);
                    var sum = roll.result;
                    var remark = "Roll for branch: ["+roll.rolls.join(",")+"]";
                    if(characteristics[4].name === ENUM_CHARACTERISTICS.EDU && characteristics[4].value >= 10){
                        sum += 2;
                        remark += "+2";
                    }
                    remark += "=" + sum;
                    var newBranch = "";
                    switch(sum){
                        case 1:
                        case 2: newBranch = "Infantry"; break;
                        case 3: newBranch = "Artillery"; break;
                        case 4: newBranch = "Cavalry"; break;
                        case 5: newBranch = "Protected"; break;
                        case 6: newBranch = "Commando"; break;
                        case 7: newBranch = "Technical"; break;
                        case 8: newBranch = "Medical"; break;
                    }
                    remark += " - " + newBranch;
                    careers[careers.length - 1].branch = newBranch;
                    record(remark);
                    updateFunc();
                    if(newBranch == "Technical"){
                        gainSkillWithPromptForCategory("Technical branch provides a skill.","Trade",()=>{
                            updateFunc(); callback();
                        })
                    }else if(newBranch == "Medical"){
                        gainSkillOrKnowledge(ENUM_SKILLS.Medic,undefined,false,"Medical branch provides a skill.");
                        updateFunc();
                        callback();
                    }else{
                        callback();
                    }
                }else{
                    callback();
                }
            }
        };
        if(CCs.length == 0 || priorCareers == 0 || resetCCs || careers[priorCareers - 1].active == false){
            CCs = getCCs(career);
        }
        var CCDescriptions = CCs.map((val)=>{var cci = +(val.substring(1))-1; return characteristics[cci].name + " (" + characteristics[cci].value + ")";});
        if(priorCareers == 0 || careers[priorCareers - 1].active == false){
            // apply for career
            if(awards.indexOf("Marine Officer1") >= 0){
                awards.splice(awards.indexOf("Marine Officer1"),1);
                 // (automatic commission from OTC or Military Academy)
                 careers.push({career:career,awards:[],terms:1,active:true,rank:{label:"O1 2nd Lieutenant",officer:1,enlisted:0},schools:[]});
                 gainSkillOrKnowledge(ENUM_SKILLS.Leader,undefined,false,"Gain Leader skill as a 2nd Lieutenant.");
                 updateFunc();
                 pickOption(CCs,"Choose a controlling characteristic for the term.",function(selectedCC){
                    CC = selectedCC;
                    CCs.splice(CCs.indexOf(selectedCC),1);
                    var termNumber = careers[careers.length-1].terms;
                    record("Chose " + selectedCC + " as controlling characteristic for Term #"+termNumber+". Choices remaining: " + CCs.join(","));
                    rollForBranch(()=>{
                        // proceed with R&R, +4 years of skills, promotion/commission
                        advanceAndGetSkills();
                    });
                        
                },true,undefined,CCDescriptions);
            }else{
                // roll to apply
                var numDice = species.Characteristics[0].nD + gender.Characteristics[0].nD + caste.Characteristics[0].nD;
                var beginRoll = checkCharacteristic(ENUM_CHARACTERISTICS.STR,numDice,0,"Attempt to begin Marine vs Strength");
                record(beginRoll.remarks);
                updateFunc();
                if(beginRoll.success){
                    addToReserves("Marine");
                    careers.push({career:career,terms:1,active:true,rank:{label:"S1 Private",officer:0,enlisted:1},schools:[],awards:[]});
                    gainSkillWithPromptForKnowledge("Gain Fighter skill as a Private. ",ENUM_SKILLS.Fighter,()=>{
                        // roll to select branch
                        rollForBranch(()=>{
                            pickOption(CCs,"Choose a controlling characteristic for the term.",function(selectedCC){
                                CC = selectedCC;
                                CCs.splice(CCs.indexOf(selectedCC),1);var termNumber = careers[careers.length-1].terms;record("Chose " + selectedCC + " as controlling characteristic for Term #"+termNumber+". Choices remaining: " + CCs.join(","));
                                // proceed with R&R, +4 years of skills, promotion/commission
                                advanceAndGetSkills();
                            },true,undefined,CCDescriptions);
                        });
                    });
                    
                }else{
                    record("Failed to begin Marine career.")
                    advanceAge(1);
                    pickOption(["Retry","Try something else"],"Failed to begin Marine career. Do you wish to retry?",(retryOption)=>{
                        if(retryOption === "Retry"){
                            var numDice = species.Characteristics[0].nD + gender.Characteristics[0].nD + caste.Characteristics[0].nD;
                            var beginRoll = checkCharacteristic(ENUM_CHARACTERISTICS.STR,numDice,0,"Attempt to begin Marine vs Strength");
                            record(beginRoll.remarks);
                            updateFunc();
                            if(beginRoll.success){
                                addToReserves("Marine");
                                careers.push({career:career,terms:1,active:true,rank:{label:"S1 Private",officer:0,enlisted:1},schools:[],awards:[]});
                                gainSkillWithPromptForKnowledge("Gain Fighter skill as a Private. ",ENUM_SKILLS.Fighter,()=>{
                                    // roll to select branch
                                    rollForBranch(()=>{
                                        pickOption(CCs,"Choose a controlling characteristic for the term.",function(selectedCC){
                                            CC = selectedCC;
                                            CCs.splice(CCs.indexOf(selectedCC),1);var termNumber = careers[careers.length-1].terms;
                                            record("Chose " + selectedCC + " as controlling characteristic for Term #"+termNumber+". Choices remaining: " + CCs.join(","));
                                            // proceed with R&R, +4 years of skills, promotion/commission
                                            advanceAndGetSkills();
                                        },true,undefined,CCDescriptions);
                                    });
                                });
                            }else{
                                record("Failed to begin Marine career.")
                                advanceAge(1);
                                updateFunc();
                            }
                        }
                    });
                }                
            }
        }else{
            if(careers[careers.length-1].freeBranchSelection){
                careers[careers.length-1].freeBranchSelection = false;
                rollForBranch(()=>{
                    careers[careers.length-1].terms += 1;
                    pickOption(CCs,"Choose a controlling characteristic for the term.",function(selectedCC){
                        CC = selectedCC;
                        CCs.splice(CCs.indexOf(selectedCC),1);var termNumber = careers[careers.length-1].terms;record("Chose " + selectedCC + " as controlling characteristic for Term #"+termNumber+". Choices remaining: " + CCs.join(","));
                        // proceed with R&R, +4 years of skills, promotion/commission
                        advanceAndGetSkills();
                        
                    },true,undefined,CCDescriptions);
                },true);
            }else{
                careers[careers.length-1].terms += 1;
                pickOption(CCs,"Choose a controlling characteristic for the term.",function(selectedCC){
                    CC = selectedCC;
                    CCs.splice(CCs.indexOf(selectedCC),1);var termNumber = careers[careers.length-1].terms;record("Chose " + selectedCC + " as controlling characteristic for Term #"+termNumber+". Choices remaining: " + CCs.join(","));
                    // proceed with R&R, +4 years of skills, promotion/commission
                    advanceAndGetSkills();
                    
                },true,undefined,CCDescriptions);
            }
        }
    }
    function resolveMerchant(career, updateFunc){
        var hasBeen = canResumeFromService(career);
        if(hasBeen.canResume){
            swapCareerIndices(hasBeen.prevCareerIndex);
        }
        var CC = ""; var priorCareers = careers.length;
        var advanceAndGetSkills = function(){
            updateFunc();
            var termSkillTables = [
                {age:true},
                {age:true},
                {age:true},
                {age:true},
            ];
            var defaultValue = 0;
            var ccIndex = +(CC.substring(1))-1;
            var ccValue = characteristics[ccIndex].value;
            if(ccValue > 12){
                defaultValue = ccValue - 12;
            }
            var cautionBraveryOptions = [9,8,7,6,5,4,3,2,1,0,-1,-2,-3,-4,-5,-6,-7,-8,-9];
            var cautionBraveryPreviews = cautionBraveryOptions.map((val,i,arr)=>["Injured if Risk roll > " + (val+ccValue),"Gain " + merchantShipShareReceiptLevel + " Ship Share(s) if Reward roll < " + (-val+ccValue)]);
            
            pickOption(cautionBraveryOptions,
                "Select caution(+) or bravery(-) mod.<br/>" +
                "Target " + CC + "=" + ccValue + "<br/>" +
                "<br/>Risk: Roll <= "+(ccValue) + " + Mod<br/>Reward: Roll <= "+(ccValue)+" - Mod",
                (selectedMod)=>{
                    var caution = +(selectedMod);
                    var numDice = species.Characteristics[ccIndex].nD + gender.Characteristics[ccIndex].nD + caste.Characteristics[ccIndex].nD;
                    var riskResult = checkCharacteristic(CC,numDice,caution,"Risk Roll");
                    record(riskResult.remarks);
                    updateFunc();
                    if(riskResult.success){
                    }else{
                        var penalty = 0;
                        if(caution < 0){ penalty += caution;}
                        var fresult = roller.flux().result;
                        penalty += fresult;
                        record("Attribute Damage = [" + fresult + " flux]" + (caution < 0 ? " + [" + (caution) + " bravery]" : "") + " = " + penalty)
                        if(penalty < 0){
                            decreaseCharacteristic(CC,-penalty,"Injury!");
                            if(characteristics[ccIndex].value <= 0){ 
                                record("This character has died. Please create a new character.");
                                updateFunc();
                                return;
                                characteristics[ccIndex].value = 1;
                            }
                            updateFunc();
                            if(penalty <= -4){
                                careers[careers.length-1].awards.push("Disabled");
                            }
                        }else{
                            record("Suffered a superficial injury. Characteristics unchanged."); updateFunc();
                        }
                    }
                    var rewardResult = checkCharacteristic(CC,numDice,-caution,"Reward Roll");
                    record(rewardResult.remarks); updateFunc();
                    if(rewardResult.success){
                        shipShares += merchantShipShareReceiptLevel;
                        record("Gained " + merchantShipShareReceiptLevel + " ship share" + (merchantShipShareReceiptLevel > 1 ? "s" : "")); updateFunc();
                        if(merchantShipShareReceiptLevel < 6){merchantShipShareReceiptLevel += 1;}
                    }
                
                if(careers[careers.length-1].rank.officer > 0){
                    var officerPromotion = false;
                    if(careers[careers.length-1].rank.officer < 6){
                        // roll for officer promotion
                        var promoRoll = check((careers[careers.length-1].terms)*2,2,characteristics[3].value >= 8 ? 3 : 0,"Roll for Officer promotion");
                        record(promoRoll.remarks); updateFunc();
                        officerPromotion = promoRoll.success;
                    }else{
                        record("Already at max rank, ineligible for promotion.");
                        updateFunc();
                    }
                    if(officerPromotion){
                        termSkillTables.push({age:false,note:"Bonus skill from promotion"});
                        careers[careers.length-1].rank.officer += 1;updateFunc();
                        // gain officer skill here
                        if(careers[careers.length-1].rank.officer == 4){ 
                            gainSkillWithPromptForKnowledge("Promoted to First Officer.",ENUM_SKILLS.Pilot,()=>{
                                updateFunc();
                                gainTermSkills(termSkillTables,ENUM_CAREERS.Merchant,updateFunc,()=>{
                                    updateFunc(); 
                                    promptContinue(ENUM_CAREERS.Merchant,updateFunc);
                                });
                            },false);   
                        }else if(careers[careers.length-1].rank.officer == 3){
                            gainSkillOrKnowledge(ENUM_SKILLS.Astrogator,undefined,false,"Promoted to Second Officer"); 
                            updateFunc();
                            gainTermSkills(termSkillTables,ENUM_CAREERS.Merchant,updateFunc,()=>{
                                updateFunc(); 
                                promptContinue(ENUM_CAREERS.Merchant,updateFunc);
                            });
                        }else if(careers[careers.length-1].rank.officer == 2){
                            gainSkillWithPromptForKnowledge("Promoted to Third Officer.",ENUM_SKILLS.Engineer,()=>{
                                updateFunc();
                                gainTermSkills(termSkillTables,ENUM_CAREERS.Merchant,updateFunc,()=>{
                                    updateFunc(); 
                                    promptContinue(ENUM_CAREERS.Merchant,updateFunc);
                                });
                            },false); 
                        }else if(careers[careers.length-1].rank.officer == 1){
                            gainSkillOrKnowledge(ENUM_SKILLS.Steward,undefined,false,"Promoted to Fourth Officer");
                            updateFunc();
                            gainTermSkills(termSkillTables,ENUM_CAREERS.Merchant,updateFunc,()=>{
                                updateFunc(); 
                                promptContinue(ENUM_CAREERS.Merchant,updateFunc);
                            });
                        }else{
                            gainTermSkills(termSkillTables,ENUM_CAREERS.Merchant,updateFunc,()=>{
                                updateFunc(); 
                                promptContinue(ENUM_CAREERS.Merchant,updateFunc);
                            });
                        }
                    }else{
                        
                        gainTermSkills(termSkillTables,ENUM_CAREERS.Merchant,updateFunc,()=>{
                            updateFunc(); 
                            promptContinue(ENUM_CAREERS.Merchant,updateFunc);
                        });
                    }
                    
                }else if(careers[careers.length-1].rank.officer <= 0){
                    // roll for officer commission
                    var commissionRoll = checkCharacteristic(ENUM_CHARACTERISTICS.INT,undefined,0,"Roll for Officer Commission");
                    record(commissionRoll.remarks);
                    updateFunc();
                    if(commissionRoll.success){
                        careers[careers.length-1].rank.officer = 1; updateFunc();
                        gainSkillOrKnowledge(ENUM_SKILLS.Steward,undefined,false,"Promoted to M1 Fourth Officer.");
                        updateFunc();
                        termSkillTables.push({age:false,note:"Bonus skill from promotion"});
                        gainTermSkills(termSkillTables,ENUM_CAREERS.Merchant,updateFunc,()=>{
                            updateFunc(); 
                            promptContinue(ENUM_CAREERS.Merchant,updateFunc);
                        });
                    }else{
                        var ratingPromotion = false;
                        if(careers[careers.length-1].rank.enlisted < 2){
                            // roll for rating promotion
                            var ratingRoll = checkCharacteristic(ENUM_CHARACTERISTICS.DEX,undefined,characteristics[3].value >= 8 ? 3 : 0,"Roll for enlisted promotion.");
                            record(ratingRoll.remarks); updateFunc();
                            ratingPromotion = ratingRoll.success
                        }
                        if(ratingPromotion){
                                termSkillTables.push({age:false,note:"Bonus skill from promotion"});
                                careers[careers.length-1].rank.enlisted += 1; updateFunc();
                                // gain enlisted skill here
                                if(careers[careers.length-1].rank.enlisted == 1){
                                    gainSkillOrKnowledge(ENUM_SKILLS.Steward,undefined,false,"Promoted to Steward Apprentice.");
                                    updateFunc();
                                    gainTermSkills(termSkillTables,ENUM_CAREERS.Merchant,updateFunc,()=>{
                                        updateFunc(); 
                                        promptContinue(ENUM_CAREERS.Merchant,updateFunc);
                                    });
                                }else if(careers[careers.length-1].rank.enlisted == 2){
                                    gainSkillWithPromptForKnowledge("Promoted to Drive Helper.",ENUM_SKILLS.Engineer,()=>{
                                        updateFunc();
                                        gainTermSkills(termSkillTables,ENUM_CAREERS.Merchant,updateFunc,()=>{
                                            updateFunc(); 
                                            promptContinue(ENUM_CAREERS.Merchant,updateFunc);
                                        });
                                    },false); 
                                }else{
                                    gainTermSkills(termSkillTables,ENUM_CAREERS.Merchant,updateFunc,()=>{
                                        updateFunc(); 
                                        promptContinue(ENUM_CAREERS.Merchant,updateFunc);
                                    });
                                }
                        }else{
                            gainTermSkills(termSkillTables,ENUM_CAREERS.Merchant,updateFunc,()=>{
                                updateFunc(); 
                                promptContinue(ENUM_CAREERS.Merchant,updateFunc);
                            });
                        }
                    }
                }
            },true,defaultValue,cautionBraveryPreviews,false);
        };

        if(CCs.length == 0 || priorCareers == 0 || careers[priorCareers - 1].active == false || hasBeen.canResume){
            CCs = getCCs(career);
        }
        var CCDescriptions = CCs.map((val)=>{var cci = +(val.substring(1))-1; return characteristics[cci].name + " (" + characteristics[cci].value + ")";});
        if(priorCareers == 0 || careers[priorCareers - 1].active == false){
            // apply for career
            pickOption(["Begin as 4th Officer","Begin as Spacehand","Begin as Temp"],"Enlisting in merchant service...",function(enlistChoice){
                if(enlistChoice === "Begin as 4th Officer"){
                    var numDice = species.Characteristics[3].nD + gender.Characteristics[3].nD + caste.Characteristics[3].nD;
                    var beginRoll = checkCharacteristic(ENUM_CHARACTERISTICS.INT,numDice,0,"Begin Merchant officer vs Int");
                    record(beginRoll.remarks);
                    updateFunc();
                    if(beginRoll.success){
                        careers.push({career:career,terms:1,active:true,rank:{label:"M1 Fourth Officer",officer:1,enlisted:0},schools:[],awards:[]});
                        gainSkillOrKnowledge(ENUM_SKILLS.Steward,undefined,false,"Joined Merchants as Fourth Officer.");
                        updateFunc();
                    }else{
                        enlistChoice = "Begin as Spacehand";
                    }
                }
                if(enlistChoice === "Begin as Spacehand"){
                    var numDice = species.Characteristics[1].nD + gender.Characteristics[1].nD + caste.Characteristics[1].nD;
                    var beginRoll = checkCharacteristic(ENUM_CHARACTERISTICS.DEX,numDice,0,"Begin Merchant spacehand vs Dex");
                    record(beginRoll.remarks);
                    updateFunc();
                    if(beginRoll.success){
                        careers.push({career:career,terms:1,active:true,rank:{label:"R0 Fourth Officer",officer:0,enlisted:0},schools:[],awards:[]});
                        record("Joined Merchants as Spacehand.");
                        updateFunc();
                    }else{
                        enlistChoice = "Begin as Temp";
                    }
                }
                if(enlistChoice == "Begin as Temp"){
                    record("Joined Merchants as Temp.");
                    careers.push({career:career,terms:1,active:true,rank:{label:"RX Temp",officer:0,enlisted:-1},schools:[],awards:[]});
                    updateFunc();
                }
                pickOption(CCs,"Choose a controlling characteristic for the term.",function(selectedCC){
                    CC = selectedCC;
                    CCs.splice(CCs.indexOf(selectedCC),1);var termNumber = careers[careers.length-1].terms;record("Chose " + selectedCC + " as controlling characteristic for Term #"+termNumber+". Choices remaining: " + CCs.join(","));
                    // proceed with R&R, +4 years of skills, promotion/commission
                    advanceAndGetSkills();
                },true,undefined,CCDescriptions);
                
            },true,"Begin as 4th Officer",["Roll vs Int","Roll vs Dex","Automatic"]);
            return;
        }else{
            pickOption(CCs,"Choose a controlling characteristic for the term.",function(selectedCC){
                careers[careers.length-1].terms += 1;
                CC = selectedCC;
                CCs.splice(CCs.indexOf(selectedCC),1);var termNumber = careers[careers.length-1].terms;record("Chose " + selectedCC + " as controlling characteristic for Term #"+termNumber+". Choices remaining: " + CCs.join(","));
                // proceed with R&R, +4 years of skills, promotion/commission
                advanceAndGetSkills();
            },true,undefined,CCDescriptions);
        }
    }
    function resolveScout(career, updateFunc){
        var hasBeen = canResumeFromService(career);
        if(hasBeen.canResume){
            swapCareerIndices(hasBeen.prevCareerIndex);
        }
        var CC = ""; var priorCareers = careers.length;
        var advanceAndGetSkills = function(checkCC){
            updateFunc();
            var termSkillTables = [
                {age:true,table:["Personal","Academic","Courier","Business","Vocation","Avocation"],note:"Courier"},
                {age:true,table:["Personal","Academic","Courier","Business","Vocation","Avocation"],note:"Courier"},
                {age:true,table:["Personal","Academic","Courier","Business","Vocation","Avocation"],note:"Courier"},
                {age:true,table:["Personal","Academic","Courier","Business","Vocation","Avocation"],note:"Courier"},
            ];
            if(checkCC){
                termSkillTables = [
                    {age:false,table:["Personal","Academic","Exploration","Business","Vocation","Avocation"],note:"Exploration"},
                    {age:true,table:["Personal","Academic","Exploration","Business","Vocation","Avocation"],note:"Exploration"},
                    {age:false,table:["Personal","Academic","Exploration","Business","Vocation","Avocation"],note:"Exploration"},
                    {age:true,table:["Personal","Academic","Exploration","Business","Vocation","Avocation"],note:"Exploration"},
                    {age:false,table:["Personal","Academic","Exploration","Business","Vocation","Avocation"],note:"Exploration"},
                    {age:true,table:["Personal","Academic","Exploration","Business","Vocation","Avocation"],note:"Exploration"},
                    {age:false,table:["Personal","Academic","Exploration","Business","Vocation","Avocation"],note:"Exploration"},
                    {age:true,table:["Personal","Academic","Exploration","Business","Vocation","Avocation"],note:"Exploration"},
                ];
                var defaultValue = 0;
                var ccIndex = +(CC.substring(1))-1;
                var ccValue = characteristics[ccIndex].value;
                if(ccValue > 12){
                    defaultValue = ccValue - 12;
                }
                var isDead = false;
                var resetCC = function(){ characteristics[ccIndex].value = ccValue; isDead = false;};
                var tempRecord = [];
                var cautionBraveryOptions = [9,8,7,6,5,4,3,2,1,0,-1,-2,-3,-4,-5,-6,-7,-8,-9];
                var cautionBraveryPreviews = cautionBraveryOptions.map((val,i,arr)=>["Injured if Risk roll > " + (val+ccValue),"Make discovery if Reward roll < " + (-val+ccValue)]);
                pickOption(cautionBraveryOptions,
                    "Select caution(+) or bravery(-) mod.<br/>" +
                    "Target " + CC + "=" + ccValue + "<br/>" +
                    "<br/>Risk: Roll <= "+(ccValue) + " + Mod<br/>Reward: Roll <= "+(ccValue)+" - Mod",
                    (selectedMod)=>{
                        var caution = +(selectedMod);
                        var numDice = species.Characteristics[ccIndex].nD + gender.Characteristics[ccIndex].nD + caste.Characteristics[ccIndex].nD;
                        var riskResult = checkCharacteristic(CC,numDice,caution,"Risk Roll");
                        tempRecord.push(riskResult.remarks);
                        updateFunc();
                        if(riskResult.success){
                        }else{
                            var penalty = 0;
                            if(caution < 0){ penalty += caution;}
                            var fresult = roller.flux().result;
                            penalty += fresult;
                            tempRecord.push("Attribute Damage = [" + fresult + " flux]" + (caution < 0 ? " + [" + (caution) + " bravery]" : "") + " = " + penalty)
                            if(penalty < 0){
                                tempRecord.push(decreaseCharacteristic(CC,-penalty,"Injury!",false));                     
                                if(characteristics[ccIndex].value <= 0){ 
                                    isDead = true;
                                    tempRecord.push("This character has died. Please create a new character.");
                                    updateFunc();
                                }
                                updateFunc();
                                
                            }else{
                                tempRecord.push("Suffered a superficial injury. Characteristics unchanged."); updateFunc();
                            }
                        }
                        if(!isDead){
                            var rewardResult = checkCharacteristic(CC,numDice,-caution,"Reward Roll");
                            tempRecord.push(rewardResult.remarks); updateFunc();
                            if(rewardResult.success){
                                tempRecord.push("Made a discovery! Earned a land grant."); updateFunc();
                            }
                        }
                        pickOption(["Accept Results","Retry"],"You can check C5 for a Risk & Reward do-over.",(dooverchoice)=>{
                            if(dooverchoice == "Accept Results"){
                                for(var r = 0; r < tempRecord.length; r++){
                                    record(tempRecord[r]);
                                    if(tempRecord[r].indexOf("Made a discovery!")==0){
                                        careers[careers.length-1].awards.push("Discovery");
                                    }
                                    updateFunc();
                                }
                                if(penalty <= -4 && !isDead){
                                    careers[careers.length-1].awards.push("Disabled");
                                }
                                updateFunc();
                                if(isDead){return;}    
                                gainTermSkills(termSkillTables,ENUM_CAREERS.Scout,updateFunc,()=>{
                                    updateFunc(); 
                                    promptContinue(ENUM_CAREERS.Scout,updateFunc);
                                });
                            }else{
                                var numDice = species.Characteristics[3].nD + gender.Characteristics[3].nD + caste.Characteristics[3].nD;
                                var retryRoll = checkCharacteristic("C5",numDice,0,"Retry Risk & Reward vs C5");
                                
                                if(retryRoll.success){
                                    record(retryRoll.remarks);
                                    updateFunc();
                                    resetCC();
                                    pickOption(cautionBraveryOptions,
                                        "Select caution(+) or bravery(-) mod.<br/>" +
                                        "Target " + CC + "=" + ccValue + "<br/>" +
                                        "<br/>Risk: Roll <= "+(ccValue) + " + Mod<br/>Reward: Roll <= "+(ccValue)+" - Mod",
                                        (selectedMod)=>{
                                            var caution = +(selectedMod);
                                            var numDice = species.Characteristics[ccIndex].nD + gender.Characteristics[ccIndex].nD + caste.Characteristics[ccIndex].nD;
                                            var riskResult = checkCharacteristic(CC,numDice,caution,"Risk Roll");
                                            record(riskResult.remarks);
                                            updateFunc();
                                            if(riskResult.success){
                                            }else{
                                                isDead = false;
                                                var penalty = 0;
                                                if(caution < 0){ penalty += caution;}
                                                var fresult = roller.flux().result;
                                                penalty += fresult;
                                                record("Attribute Damage = [" + fresult + " flux]" + (caution < 0 ? " + [" + (caution) + " bravery]" : "") + " = " + penalty)
                                                if(penalty < 0){
                                                    decreaseCharacteristic(CC,-penalty,"Injury!");                     
                                                    if(characteristics[ccIndex].value <= 0){ 
                                                        isDead = true;
                                                        record("This character has died. Please create a new character.");
                                                        updateFunc();
                                                        return;
                                                    }
                                                    updateFunc();
                                                    if(penalty <= -4 && !isDead){
                                                        careers[careers.length-1].awards.push("Disabled");
                                                    }
                                                }else{
                                                    record("Suffered a superficial injury. Characteristics unchanged."); updateFunc();
                                                }
                                            }
                                            if(!isDead){
                                                var rewardResult = checkCharacteristic(CC,numDice,-caution,"Reward Roll");
                                                record(rewardResult.remarks); updateFunc();
                                                if(rewardResult.success){
                                                    record("Made a discovery! Earned a land grant."); 
                                                    careers[careers.length-1].awards.push("Discovery");
                                                    updateFunc();
                                                }
                                                gainTermSkills(termSkillTables,ENUM_CAREERS.Scout,updateFunc,()=>{
                                                    updateFunc(); 
                                                    promptContinue(ENUM_CAREERS.Scout,updateFunc);
                                                });
                                            }
                                        },true,defaultValue,cautionBraveryPreviews,false);
                                }else{
                                    for(var r = 0; r < tempRecord.length; r++){
                                        record(tempRecord[r]);
                                        if(tempRecord[r].indexOf("Made a discovery!")==0){
                                            careers[careers.length-1].awards.push("Discovery");
                                        }
                                        updateFunc();
                                    }
                                    if(penalty <= -4 && !isDead){
                                        careers[careers.length-1].awards.push("Disabled");
                                    }
                                    record(retryRoll.remarks);
                                    updateFunc();
                                    if(isDead){return;}    
                                    gainTermSkills(termSkillTables,ENUM_CAREERS.Scout,updateFunc,()=>{
                                        updateFunc(); 
                                        promptContinue(ENUM_CAREERS.Scout,updateFunc);
                                    });
                                }
                            }
                        },true,undefined,[tempRecord,["Retry Risk","Retry Reward"]],false);
                            //["Check EDU to Retry Risk and Reward","Accept these outcomes: Risk "+(riskResult.success?"Success":"Failure")+", Reward " + (rewardResult.success?"Success":"Failure")]);
                        
                                   
                        
                    },true,defaultValue,cautionBraveryPreviews,false);
            }else{
                gainTermSkills(termSkillTables,ENUM_CAREERS.Scout,updateFunc,()=>{
                    updateFunc(); 
                    promptContinue(ENUM_CAREERS.Scout,updateFunc);
                });
            }
        };

        if(CCs.length == 0 || priorCareers == 0 || careers[priorCareers - 1].active == false || hasBeen.canResume){
            CCs = getCCs(career);
        }
        var CCDescriptions = CCs.map((val)=>{var cci = +(val.substring(1))-1; return characteristics[cci].name + " (" + characteristics[cci].value + ")";});
        if(priorCareers == 0 || careers[priorCareers - 1].active == false){
            var highestCharIndex = 0;
            for(var i = 0; i < 3; i++){
                if(characteristics[i].value > characteristics[highestCharIndex].value){
                    highestCharIndex = i;
                }
            }
            // apply to join Scouts
            var numDice = species.Characteristics[highestCharIndex].nD + gender.Characteristics[highestCharIndex].nD + caste.Characteristics[highestCharIndex].nD;
            var beginRoll = checkCharacteristic(characteristics[highestCharIndex].name,numDice,0,"Begin Scouts vs "+(characteristics[highestCharIndex].name));
            record(beginRoll.remarks);
            updateFunc();
            if(beginRoll.success){ // joined successfully
                careers.push({career:career,terms:1,active:true,awards:[]});
                record("Joined Scouts.");
                updateFunc();
                pickOption(["Explorer Duty","Courier Duty"],"Do you wish to explore/survey or volunteer for courier duty?",(dutyChoice)=>{
                    if(dutyChoice === "Explorer Duty"){
                        pickOption(CCs,"Choose a controlling characteristic for the term.",function(selectedCC){
                            CC = selectedCC;
                            CCs.splice(CCs.indexOf(selectedCC),1);var termNumber = careers[careers.length-1].terms;record("Chose " + selectedCC + " as controlling characteristic for Term #"+termNumber+". Choices remaining: " + CCs.join(","));
                            // proceed with R&R, +4 years of skills, promotion/commission
                            careers[careers.length-1].duty = "Explorer";
                            advanceAndGetSkills(true);
                        },true,undefined,CCDescriptions);
                    }else{
                        careers[careers.length-1].duty = "Courier";
                        advanceAndGetSkills(false);
                    }
                },true,"Explorer Duty",[["Explore new worlds and update charts.","Gain 8 skills.","Risk and Reward vs C1,C2,C3"],["Carry messages and data between worlds.","Gain 4 skills.","Avoids Risk and Reward roll."]],false);
            }else{ // failed to join scouts. Can check EDU to reapply
                record("Failed to begin Scout career.")
                advanceAge(1);
                pickOption(["Retry","Try something else"],"Failed aptitude test to join Scouts. You may appeal for a second chance if you pass a qualifying exam.",(choice)=>{
                    if(choice === "Retry"){
                        var numDice = species.Characteristics[3].nD + gender.Characteristics[3].nD + caste.Characteristics[3].nD;
                        var retryRoll = checkCharacteristic("C5",numDice,0,"Retry Join Scouts vs C5");
                        record(retryRoll.remarks);
                        updateFunc();
                        if(retryRoll.success){
                            var highestCharIndex = 0;
                            for(var i = 0; i < 3; i++){
                                if(characteristics[i].value > characteristics[highestCharIndex].value){
                                    highestCharIndex = i;
                                }
                            }
                            beginRoll = checkCharacteristic(characteristics[highestCharIndex].name,numDice,0,"Begin Scouts vs "+(characteristics[highestCharIndex].name));
                            record(beginRoll.remarks);
                            updateFunc();
                            if(beginRoll.success){ // joined successfully
                                careers.push({career:career,terms:1,active:true,awards:[]});
                                record("Joined Scouts.");
                                updateFunc();
                                pickOption(["Explorer Duty","Courier Duty"],"Do you wish to explore/survey or volunteer for courier duty?",(dutyChoice)=>{
                                    if(dutyChoice === "Explorer Duty"){
                                        pickOption(CCs,"Choose a controlling characteristic for the term.",function(selectedCC){
                                            CC = selectedCC;
                                            CCs.splice(CCs.indexOf(selectedCC),1);var termNumber = careers[careers.length-1].terms;record("Chose " + selectedCC + " as controlling characteristic for Term #"+termNumber+". Choices remaining: " + CCs.join(","));
                                            // proceed with R&R, +4 years of skills, promotion/commission
                                            careers[careers.length-1].duty = "Explorer";
                                            advanceAndGetSkills(true);
                                        },true,undefined,CCDescriptions);
                                    }else{
                                        careers[careers.length-1].duty = "Courier";
                                        advanceAndGetSkills(false);
                                    }
                                },true,"Explorer Duty",[["Explore new worlds and update charts.","Gain 8 skills.","Risk and Reward vs C1,C2,C3"],["Carry messages and data between worlds.","Gain 4 skills.","Avoids Risk and Reward roll."]],false);
                            
                            }else{
                                record("Failed to begin Scout career.")
                                advanceAge(1);
                                updateFunc();
                            }
                        }
                    }
                },true,"Retry",["Check vs. C5 for a chance to try again.","Give up trying to join the Scouts."]);
            }
            
        }else{
            careers[careers.length-1].terms += 1;
            if(careers[careers.length-1].terms % 2 == 0){
                decreaseCharacteristic(ENUM_CHARACTERISTICS.SAN,1,"Long term isolation.");
                updateFunc();
            }
            pickOption(["Explorer Duty","Courier Duty"],"Do you wish to explore/survey or volunteer for courier duty?",(dutyChoice)=>{
                if(dutyChoice === "Explorer Duty"){
                    pickOption(CCs,"Choose a controlling characteristic for the term.",function(selectedCC){
                        CC = selectedCC;
                        CCs.splice(CCs.indexOf(selectedCC),1);var termNumber = careers[careers.length-1].terms;record("Chose " + selectedCC + " as controlling characteristic for Term #"+termNumber+". Choices remaining: " + CCs.join(","));
                        careers[careers.length-1].duty = "Explorer";
                        advanceAndGetSkills(true);
                    },true,undefined,CCDescriptions);
                }else{
                    careers[careers.length-1].duty = "Courier";
                    advanceAndGetSkills(false);
                }
            },true,"Explorer Duty",[["Explore new worlds and update charts.","Gain 8 skills.","Risk and Reward vs C1,C2,C3"],["Carry messages and data between worlds.","Gain 4 skills.","Avoids Risk and Reward roll."]],false);
        
        }
    }
    function resolveCraftsman(career, updateFunc){
        var hasBeen = canResumeFromService(career);
        if(hasBeen.canResume){
            swapCareerIndices(hasBeen.prevCareerIndex);
        }
        var CC = ""; var priorCareers = careers.length;
        var advanceAndGetSkills = function(checkCC,ccValue,quals){
            var termSkillTables = [
                {age:true},
                {age:true},
                {age:true},
                {age:true},
                {age:false},
            ];
            
            if(checkCC){
                var craftingSkills = quals.qualifyingSkills;
                var indexOfCraftsman = -1;
                for(var i = 0, len = craftingSkills.length; i < len; i++){
                    if(craftingSkills[i].Skill == ENUM_SKILLS.Craftsman){
                        indexOfCraftsman = i;
                    }
                }
                if(indexOfCraftsman >= 0){ craftingSkills.splice(indexOfCraftsman,1); }
                function chooseCraftingSkills(selectedSkills,availableSkills,availableSkillValues,total,callback){
                    if(selectedSkills.length < 5 && availableSkills.length > 0){
                        // prompt for a new skill
                        pickOption(availableSkills,"Choose a skill to use in composing your masterpiece",
                        function(selectedSkill){
                            selectedSkills.push(selectedSkill);
                            total += availableSkillValues[availableSkills.indexOf(selectedSkill)];
                            record("Using " + selectedSkill + "-"+availableSkillValues[availableSkills.indexOf(selectedSkill)] +". Subtotal=" + total);
                            updateFunc();
                            availableSkillValues.splice(availableSkills.indexOf(selectedSkill),1);
                            availableSkills.splice(availableSkills.indexOf(selectedSkill),1);
                            chooseCraftingSkills(selectedSkills,availableSkills,availableSkillValues,total,callback);
                        },
                        true,undefined,availableSkills.map((a,i)=>a+"-"+availableSkillValues[i]));
                    }else{
                        // callback with the selected skills
                        callback(selectedSkills,total);
                    }
                }
                var selectedSkills = [], availableSkills = craftingSkills.map((a)=>a.Skill), availableSkillValues = craftingSkills.map((a)=>a.Level);
                chooseCraftingSkills(selectedSkills,availableSkills,availableSkillValues,ccValue + skills[ENUM_SKILLS.Craftsman].Skill,
                    function(chosenSkills,total){
                        var wasSuccessful = false;
                        if(total >= 40){
                            record("Attempted to create a masterpiece using [" + selectedSkills.join(",")+"]");
                            updateFunc();
                            var masterpieceResult = check(total,9,0,"Creating a Masterpiece: 9D vs " + total);
                            wasSuccessful = masterpieceResult.success;
                            record(masterpieceResult.remarks);
                            updateFunc();

                        }else{
                            record("Attempted to create a masterpiece using [" + selectedSkills.join(",")+"]");
                            record("Total Master Points ("+total+") >= 40 ? FAIL");
                            updateFunc();
                            
                        }
                        if(wasSuccessful){
                            if(total >= 55){
                                record("A perfect masterpiece has been created with " + total + " points to allocate toward QREBS.");
                                careers[careers.length-1].awards.push("Perfect Masterpiece ("+selectedSkills.join(",")+") QREBS=" + total);
                            }else{
                                record("A beautiful masterpiece has been created with " + total + " points to allocate toward QREBS.");
                                careers[careers.length-1].awards.push("Masterpiece ("+selectedSkills.join(",")+") QREBS=" + total);
                            }
                            termSkillTables.push({age:false});
                            termSkillTables.push({age:false});
                            gainSkillOrKnowledge(ENUM_SKILLS.Craftsman,undefined,false);
                            updateFunc();
                            gainTermSkills(termSkillTables,ENUM_CAREERS.Craftsman,updateFunc,()=>{
                                updateFunc(); 
                                promptContinue(ENUM_CAREERS.Craftsman,updateFunc);
                            });
                        }else{
                            
                            gainSkillOrKnowledge(ENUM_SKILLS.Craftsman,undefined,false);
                            updateFunc();
                            gainTermSkills(termSkillTables,ENUM_CAREERS.Craftsman,updateFunc,()=>{
                                updateFunc(); 
                                promptContinue(ENUM_CAREERS.Craftsman,updateFunc);
                            });
                        }
                    
                });
            }else{
                var quals = getCraftsmanQualifications();
                record("Total possible Master Points (" + (ccValue + quals.masterPoints) + ") >= 40 ? FAIL");
                updateFunc();
                gainSkillOrKnowledge(ENUM_SKILLS.Craftsman,undefined,false);
                updateFunc();
                gainTermSkills(termSkillTables,ENUM_CAREERS.Craftsman,updateFunc,()=>{
                    updateFunc(); 
                    promptContinue(ENUM_CAREERS.Craftsman,updateFunc);
                });
            }
        }
        
        if(CCs.length == 0 || priorCareers == 0 || careers[priorCareers - 1].active == false || hasBeen.canResume){
            CCs = getCCs(career);
        }
        var quals = getCraftsmanQualifications();
        var CCDescriptions = CCs.map((val)=>{var cci = +(val.substring(1))-1; var points = quals.masterPoints + characteristics[cci].value;  return characteristics[cci].name + " (" + characteristics[cci].value + "), Possible Master Points="+points+(points < 40 ? " (failure)":"");});
        pickOption(CCs,"Choose a controlling characteristic for the term.",function(selectedCC){
            if(priorCareers == 0 || careers[priorCareers - 1].active == false){
                careers.push({career:career,terms:1,active:true,awards:[]});
            }else{
                careers[careers.length-1].terms += 1;
            }
            
            updateFunc();
            var termNumber = careers[careers.length-1].terms;
            CCs.splice(CCs.indexOf(selectedCC),1);
            
            record("Chose " + selectedCC + " as controlling characteristic for Term #"+termNumber+". Choices remaining: " + CCs.join(","));
            updateFunc();
            var ccIndex = +(selectedCC.substring(1))-1;
            var ccValue = characteristics[ccIndex].value;
            var quals = getCraftsmanQualifications();
            if(quals.masterPoints + ccValue >= 40){
                advanceAndGetSkills(true,ccValue, quals);
            }else{
                advanceAndGetSkills(false, ccValue, quals);
            }
        },true,undefined,CCDescriptions);
        
    }
    function removeDuplicates(arr){
        arr.sort();
        var i = 0;
        while(i < arr.length){
            if(i > 0 && arr[i] == arr[i-1]){
                arr.splice(i,1);
            }else{
                i+=1;
            }
        }
        return arr;
    }
    function setAge(newAge){age = newAge;}
    function getAge(){return age;}
    function getGenetics(){ return genetics; }
    function getNativeLanguage(){ return nativeLanguage;}
    function setNativeLanguage(newLanguage){
        var nativeLanguageValue = skills[ENUM_SKILLS.Language].Knowledge[nativeLanguage];
        delete skills[ENUM_SKILLS.Language].Knowledge[nativeLanguage];
        nativeLanguage = newLanguage;
        skills[ENUM_SKILLS.Language].Knowledge[nativeLanguage] = nativeLanguageValue;
        var message = "Native language = " +newLanguage;
       record(message);
        return message;
    }
    function setForcedGrowthClone(isClone){isForcedGrowthClone = isClone;}
    function setName(newName){ name = newName; }
    function getName(){ return name; }
    function check(target,difficulty,mods,remarks){
        target += mods;
        var result = 0, rolls = [];
        for(var i = 0; i < difficulty; i++){
            var roll = roller.d6(1);
            result += roll.result;
            rolls = rolls.concat(roll.rolls);
        }
        return { success: result <= target, result:result, rolls:rolls, target:target, remarks:remarks +": ["+ rolls + "] < "+target+" ? " + (result <= target ? "PASS" : "FAIL")}
    }
    function checkCharacteristic(characteristic, difficulty, mods, remarks){
        var target = 0;
        var index = -1;
        if(typeof mods === "undefined"){ mods = 0;}
        
        if(typeof characteristic === "number" && characteristic <= 6 && characteristic >= 1){ target = characteristics[characteristic-1].value;}
        else if(typeof characteristic === "string"){ 
            switch(characteristic){
                case "C1":
                case ENUM_CHARACTERISTICS.STR: 
                    target = characteristics[0].value; 
                    index = 0;
                    break;
                case "C2":
                    index = 1;
                    target = characteristics[1].value; 
                    break;
                case "C3":
                    index = 2;
                    target = characteristics[2].value; 
                    break;
                case "C4":
                    index = 3;
                    target = characteristics[3].value; 
                    break;
                case "C5":
                    index = 4;
                    target = characteristics[4].value; 
                    break;
                case "C6":
                    index = 5;
                    target = characteristics[5].value; 
                    break;
                case ENUM_CHARACTERISTICS.DEX:
                    index = 1; 
                    target = characteristics[1].name === ENUM_CHARACTERISTICS.DEX ? characteristics[1].value : characteristics[1].value/2; 
                    break;
                case ENUM_CHARACTERISTICS.AGI: 
                    index = 1;
                    target = characteristics[1].name === ENUM_CHARACTERISTICS.AGI ? characteristics[1].value : characteristics[1].value/2; 
                    break;
                case ENUM_CHARACTERISTICS.GRA: 
                    index = 1;
                    target = characteristics[1].name === ENUM_CHARACTERISTICS.GRA ? characteristics[1].value : characteristics[1].value/2; 
                    break;
                case ENUM_CHARACTERISTICS.END: 
                    index = 2;
                    target = characteristics[2].name === ENUM_CHARACTERISTICS.END ? characteristics[2].value : characteristics[2].value/2; 
                    break;
                case ENUM_CHARACTERISTICS.STA: 
                    index = 2;
                    target = characteristics[2].name === ENUM_CHARACTERISTICS.STA ? characteristics[2].value : characteristics[2].value/2; 
                    break;
                case ENUM_CHARACTERISTICS.VIG: 
                    index = 2;
                    target = characteristics[2].name === ENUM_CHARACTERISTICS.VIG ? characteristics[2].value : characteristics[2].value/2; 
                    break;
                case ENUM_CHARACTERISTICS.INT: 
                    index = 3;
                    target = characteristics[3].value; 
                    break;
                case ENUM_CHARACTERISTICS.EDU: 
                    index = 4;
                    switch(characteristics[4].name){
                        case ENUM_CHARACTERISTICS.EDU: target = characteristics[4].value; break;
                        case ENUM_CHARACTERISTICS.TRA: target = characteristics[4].value/2; break;
                        case ENUM_CHARACTERISTICS.INS: target = 4; break;
                    }
                    break;
                case ENUM_CHARACTERISTICS.TRA: 
                    index = 4;
                switch(characteristics[4].name){
                    case ENUM_CHARACTERISTICS.EDU: target = characteristics[4].value/2; break;
                    case ENUM_CHARACTERISTICS.TRA: target = characteristics[4].value; break;
                    case ENUM_CHARACTERISTICS.INS: target = 4; break;
                }
                break;
                case ENUM_CHARACTERISTICS.INS: 
                    index = 4;
                    switch(characteristics[4].name){
                        case ENUM_CHARACTERISTICS.INS: target = characteristics[4].value; break;
                        case ENUM_CHARACTERISTICS.TRA: target = 4; break;
                        case ENUM_CHARACTERISTICS.EDU: target = 4; break;
                    }
                    break;
                case ENUM_CHARACTERISTICS.SOC: 
                    index = 5;
                    switch(characteristics[5].name){
                        case ENUM_CHARACTERISTICS.SOC: target = characteristics[5].value; break;                    
                        case ENUM_CHARACTERISTICS.CHA: target = characteristics[5].value/2; break;                    
                        case ENUM_CHARACTERISTICS.CAS: target = 4; break;                    
                    }
                    break;
                case ENUM_CHARACTERISTICS.CHA: 
                    index = 5;
                    switch(characteristics[5].name){
                        case ENUM_CHARACTERISTICS.SOC: target = characteristics[5].value; break;                    
                        case ENUM_CHARACTERISTICS.CHA: target = characteristics[5].value; break;                    
                        case ENUM_CHARACTERISTICS.CAS: target = 4; break;                    
                    }
                    break;
                case ENUM_CHARACTERISTICS.CAS: 
                    index = 5;
                    switch(characteristics[5].name){
                        case ENUM_CHARACTERISTICS.SOC: target = 4; break;                    
                        case ENUM_CHARACTERISTICS.CHA: target = 4; break;                    
                        case ENUM_CHARACTERISTICS.CAS: target = characteristics[5].value; break;                    
                    }
                    break;
            }
        }
        if(typeof difficulty === "undefined"){ 
            difficulty = species.Characteristics[index].nD + gender.Characteristics[index].nD + caste.Characteristics[index].nD;
        }
        if(typeof remarks == "undefined"){
            remarks = difficulty + "D vs "+characteristic +" ("+target+")" + (mods > 0 ? ("+"+mods) : "");
        }
        return check(target,difficulty,mods,remarks);
    }
    function gainCharacteristic(characteristic, amount, premark, recordGain){
        if(typeof recordGain == "undefined"){ recordGain = true; }
        if(typeof amount == "undefined"){ amount = 1;}
        var index = 0; var special = false;
        var characteristicName = characteristic;
        if(typeof characteristic === "number" && characteristic <= 6 && characteristic >= 1){ index = characteristic-1; }
        else if(typeof characteristic === "string"){
            switch(characteristic){
                case "C1":
                case ENUM_CHARACTERISTICS.STR: 
                    index = 0; 
                    break;
                case "C2":
                case ENUM_CHARACTERISTICS.DEX: 
                    index = 1; 
                    break;
                case ENUM_CHARACTERISTICS.AGI: 
                    index = 1; 
                    break;
                case ENUM_CHARACTERISTICS.GRA: 
                    index = 1; 
                    break;
                case "C3":
                case ENUM_CHARACTERISTICS.END: 
                    index = 2; 
                    break;
                case ENUM_CHARACTERISTICS.STA: 
                    index = 2; 
                    break;
                case ENUM_CHARACTERISTICS.VIG: 
                    index = 2;  
                    break;
                case "C4":
                case ENUM_CHARACTERISTICS.INT: 
                    index = 3; 
                    break;
                case "C5":
                case ENUM_CHARACTERISTICS.EDU: 
                    index = 4; 
                    break;
                case ENUM_CHARACTERISTICS.TRA: 
                    index = 4; 
                    break;
                case ENUM_CHARACTERISTICS.INS: 
                    index = 4; 
                    break;
                case "C6":
                case ENUM_CHARACTERISTICS.SOC: 
                    index = 5; 
                    break;
                case ENUM_CHARACTERISTICS.CHA: 
                    index = 5; 
                    break;
                case ENUM_CHARACTERISTICS.CAS: 
                    index = 5; 
                    break;
                case ENUM_CHARACTERISTICS.SAN:
                    special = true;
                    characteristicName = "Sanity";
                    if(typeof getSanity() == "undefined"){
                        var sanityRoll = roller.d6(2);
                        record("Roll for Sanity: ["+sanityRoll.rolls.join(",")+"]");
                        console.log(sanityRoll.result);
                        setSanity(sanityRoll.result);
                    }
                    setSanity(getSanity() + amount);
                    
                    break;
            }
        }
        if(!special){
            characteristicName = characteristics[index].name
            var max = (species == human) ? 15 : species.Characteristics[index].nD*6+6;
            if(characteristics[index].value < max){
                characteristics[index].value += amount;
            }else{ amount = 0;}
            if(characteristics[index].value > max){
                amount = characteristics[index].value - max;
                characteristics[index].value = max;
            }
            
        }
        var message =  (amount >= 0 ? "Increased " : "Decreased ")+ characteristicName + " by " + amount + ".";  
        if(typeof premark !== "undefined"){ message = premark + " " + message; }
        if(recordGain){
            record(message);
        }       
        return message;
    }
    function decreaseCharacteristic(characteristic, amount, premark, recordLoss){
        if(typeof amount == "undefined"){ amount = 1;}
        if(typeof recordLoss == "undefined"){ recordLoss = true; }
        return gainCharacteristic(characteristic,-amount, premark, recordLoss);
    }
    function getPlayabilityScore(){
        var playabilityScore = 0;
        var charComponent = 0;
        for(var i = 0, len = characteristics.length; i < len; i++){
            charComponent += characteristics[i].value;
        }
        charComponent = charComponent / 6;

        var skillComponent = 0;
        var knowledgeComponent = 0;
        var languageComponent = 0;
        var JOTComponent = 0;
        var skillNames = Object.keys(skills);
        for(var i = 0, len = skillNames.length; i < len; i++){
            var skillName = skillNames[i];
            var skill = skills[skillName];
            if(skill.Skill >= 0){
                if(skillName === ENUM_SKILLS.JOT){
                    JOTComponent += skill.Skill * 2;
                }else{
                    skillComponent += skill.Skill;
                }
            }
            var knowledgeNames = Object.keys(skill.Knowledge);
            if(skillName === ENUM_SKILLS.Language){
                for(var j = 0, jlen = knowledgeNames.length; j < jlen; j++){
                    languageComponent += 1;
                }
            }else{
                for(var j = 0, jlen = knowledgeNames.length; j < jlen; j++){
                    knowledgeComponent += skill.Knowledge[knowledgeNames[j]];
                }
            }
            
        }
        knowledgeComponent = knowledgeComponent / 2
        playabilityScore = charComponent + skillComponent + knowledgeComponent + languageComponent + JOTComponent;
        return {
            score: ((playabilityScore * 10) >>> 0)/10,
            characteristicScore : ((charComponent*10) >>> 0)/10,
            skillScore : skillComponent >>> 0,
            knowledgeScore : ((knowledgeComponent * 10) >>> 0)/10,
            JOTScore : JOTComponent >>> 0,
            languageScore : languageComponent >>> 0
        };
    }
    function getCraftsmanQualifications(){
        var qualifies = false;
        var qualifyingSkills = [];
        var masterPoints = 0;
        var qualifyingSkillCount = 0;
        if(typeof skills[ENUM_SKILLS.Craftsman] !== "undefined" && skills[ENUM_SKILLS.Craftsman].Skill > 0){
            var skillLabels = Object.keys(skills);
            masterPoints = skills[ENUM_SKILLS.Craftsman].Skill;
            for(var i = 0, len = skillLabels.length; i < len; i++){
                var skillLabel = skillLabels[i];
                if(skillLabel !== ENUM_SKILLS.Language){
                    var skill = skills[skillLabel];
                    var baseSkill = skill.Skill;
                    var knowledgeLabels = Object.keys(skill.Knowledge);
                    if(baseSkill >= 6){ qualifyingSkillCount+=1; 
                        if(skillLabel !== ENUM_SKILLS.Craftsman){
                            qualifyingSkills.push({Skill:skillLabel, Level:baseSkill}); 
                        }
                    }
                    for(var k = 0, klen = knowledgeLabels.length; k < klen; k++){
                        var knowledgeLabel = knowledgeLabels[k];
                        var knowledge = skill.Knowledge[knowledgeLabel];
                        if(baseSkill > 0){
                            knowledge += baseSkill;
                        }
                        if(knowledge >= 6){
                            qualifyingSkillCount += 1;
                            qualifyingSkills.push({Skill:knowledgeLabel, Level:knowledge});
                        }
                    }
                }
            }
            if(qualifyingSkillCount >= 2){
                qualifies = true;
                qualifyingSkills.sort((a,b)=>{return a.Level > b.Level ? -1 : 1; });
                for(var i = 0; i < 5 && i < qualifyingSkills.length; i++){
                    if(qualifyingSkills[i].Skill !== ENUM_SKILLS.Craftsman){
                        masterPoints += qualifyingSkills[i].Level;
                    }
                }
            }
        }
        return {qualifies,qualifyingSkills,masterPoints};
    }
    function getQualifications(){
        var q = {};
        var isDead = false;
        for(var i = 0, len = characteristics.length; i < len; i++){
            if(characteristics[i].value <= 0){ isDead = true;}
        }
        var hasBeen = {}, isNow = {};
        for(var i = 0, len = careers.length; i < len; i++){
            var prevCareer = careers[i].career;
            hasBeen[prevCareer] = true;
            if(careers[i].active){ isNow[prevCareer] = true; } else{ isNow[prevCareer] = false; }
        }
        var availability = (musteredOut || isDead) ? false : true; // can't pursue careers if dead or you've already mustered out
        q.MusterOut = !isDead && (careers.length > 0 && musteredOut == false);
        q.Citizen = availability && careers.length == 0;
        q.Soldier = availability && (careers.length == 0 || (!hasBeen[ENUM_CAREERS.Soldier] || isNow[ENUM_CAREERS.Soldier]));
        q.Merchant = availability && (careers.length == 0 || (!hasBeen[ENUM_CAREERS.Merchant] || isNow[ENUM_CAREERS.Merchant]));
        q.Spacer = availability && (careers.length == 0 || (!hasBeen[ENUM_CAREERS.Spacer] || isNow[ENUM_CAREERS.Spacer]));
        q.Marine = availability && (careers.length == 0 ||(!hasBeen[ENUM_CAREERS.Marine] || isNow[ENUM_CAREERS.Marine]));
        q.Scout = availability && (careers.length == 0 ||(!hasBeen[ENUM_CAREERS.Scout] || isNow[ENUM_CAREERS.Scout]));
        var navyCommission = awards.indexOf("Navy Officer1") >= 0,
            armyCommission = awards.indexOf("Army Officer1") >= 0,
            marineCommission = awards.indexOf("Marine Officer1") >= 0;
        q.Craftsman = availability && careers.length >=1;
        
        if(navyCommission || armyCommission || marineCommission){
            q.Citizen = false, q.Spacer = false, q.Soldier = false, q.Marine = false, q.Merchant = false, q.Scout = false;
            q.Craftsman = false;
            q.BA = false;
            if(navyCommission){ q.Spacer = true;}
            if(armyCommission){ q.Soldier = true;}
            if(marineCommission){ q.Marine = true; }
        }else{
            q.BA = true;
        }
        if(q.Craftsman){
            var craftsmanQ = getCraftsmanQualifications();
            q.Craftsman = availability && ((!hasBeen[ENUM_CAREERS.Craftsman] || isNow[ENUM_CAREERS.Craftsman])) && craftsmanQ.qualifies;
        }
        q.fameEvent = !fameFluxApplied;
        if(!fameMusterOutBonus && calculateFame() >= 19){
            q.fameBonus = true;
        }else{
            q.fameBonus = false;
        }
        q.resignReserves = !resignationDeclined && (awards.indexOf("Navy Reserves") >= 0 || awards.indexOf("Marine Reserves") >= 0 || awards.indexOf("Army Reserves") >= 0);
        return q;
    }
    function checkCSK(characteristic, skill, knowledge, difficulty,mods,remarks){
        if(typeof remarks === "undefined"){ remarks = "";}else{ remarks += " "}
        var skillLevel = 0;
        var hasSkillOrKnowledge = false;
        if(skills[skill]){
            if(skills[skill] >= 0){
                skillLevel += skills[skill].Skill;
                hasSkillOrKnowledge = true;
            }
            if(knowledge != false){
                if(skills[skill].Knowledge[knowledge] >= 0){
                    skillLevel += skills[skill].Knowledge[knowledge];
                    hasSkillOrKnowledge = true;
                }
            }
        }
        if(
            !(hasSkillOrKnowledge) && !(skills[MasterSkills.JOT] && skills[MasterSkills.JOT].Skill > 0) // we don't have JoT
        ){
            
            remarks += "!!Character does not have the requisite skill!! "
        }
        mods += skillLevel;
        if(skills[MasterSkills.JOT]){
            skillLevel += skills[MasterSkills.JOT].Skill;
        }
        var tih = false;
        if(skillLevel < difficulty){
            difficulty += 1;
            tih = true;
        }
        remarks += difficulty + "D " + (tih ? "(TiH!) " : "" ) +"vs " + (typeof characteristic === "number" ? "C": "") + characteristic + " + " + skill;
        if(knowledge != false){ remarks += "("+knowledge+")";}
        
        return checkCharacteristic(characteristic,difficulty,mods,remarks);
    }
    function agingCheck(){
        function ageCheckCharacteristic(index){
            var result = check(stage,2,0,"Aging vs. " + characteristics[index].name);
            if(result.success){
                characteristics[index].value -= 1;
                if(characteristics[index].value === 0){
                    characteristics[index].value = 1;
                    numReducedToZero += 1;
                }
                remarks += characteristics[index].name + " reduced to " + characteristics[index].value + ". ";
            }else{
                remarks += characteristics[index].name + " OK. ";
            }
        }
        var stage = CLASS_SPECIES.getLifeStageFromAge(age);
        var numReducedToZero = 0;
        var remarks = "Aging check at age " + age + " vs life stage " + stage+": ";
        if(stage >= 9 || (isForcedGrowthClone && stage >= 8)){
            ageCheckCharacteristic(3);
            if(characteristics[4].name === ENUM_CHARACTERISTICS.INS){
                ageCheckCharacteristic(4);
            }
        }
        if(stage >= 5 || (isForcedGrowthClone && stage >= 4)){
            ageCheckCharacteristic(0);
            ageCheckCharacteristic(1);
            ageCheckCharacteristic(2);
        }else{
            remarks += " Character does not experience aging. "
        }
        if(numReducedToZero >= 3){ agingCrises += 1; 
            if(agingCrises == 1){
                remarks += "Extremely major illness. Requires 4 months rest and recuperation." ;
            }else{
                remarks += "This character has died of age-related illness."
            }
        }
        else if(numReducedToZero === 2){ remarks += "Major illness. Requires 4 weeks rest and recuperation.";}
       //record(remarks);
        return remarks;
    }
    function advanceAge(numYears){
        var prefix = "Age increased from " + age;
        var remarks = "";
        if(typeof numYears === "undefined"){ numYears = 1;}
        var peakStart = species.getFirstYearOfStage( isForcedGrowthClone ? 4 : 5);
        var retirementAge = species.getFirstYearOfStage(9);
        for(var i = 0; i < numYears; i++){
            age += 1;
            if(age >= peakStart){
                if((age - peakStart) % 4 === 0){
                    remarks += agingCheck();
                }
            }
            if(age === retirementAge && (awards.indexOf("Army Reserves") >= 0 || awards.indexOf("Navy Reserves") >= 0 || awards.indexOf("Marine Reserves") >= 0)){
                for(var j = 0, jlen = awards.length; j < jlen; j++){
                    var award = awards[j];
                    if(award.indexOf(" Reserves") > 0){
                        awards[j] = awards[j].replace("Reserves","Pension");
                        record("Retired from the " + award +" due to age. Gained pension.");
                    }
                }
            }
        }
        
        prefix += " to " + age + ". ";
        record(prefix + remarks);
        setAge(age);
        return prefix + remarks; 
    }
    function resignFromReserves(updateFunc){
        if(awards.indexOf("Army Reserves") >= 0 || awards.indexOf("Navy Reserves") >= 0 || awards.indexOf("Marine Reserves") >= 0){
            var resignResult = check(11,2,0,"Resign Attempt");
            if(resignResult.success){
                record(resignResult.remarks);
                updateFunc();
                while(awards.indexOf("Army Reserves") >= 0 || awards.indexOf("Navy Reserves") >= 0 || awards.indexOf("Marine Reserves") >= 0){
                    for(var j = 0, jlen = awards.length; j < jlen; j++){
                        var award = awards[j];
                        if(award.indexOf(" Reserves") > 0){
                            awards.splice(j,1);
                            record("Resigned from the " + award + ".");
                            updateFunc();
                            break;
                        }
                    }
                }
            }else{
                if(musteredOut){
                    record("Resignation from reserves was not accepted.");
                    resignationDeclined = true;
                    updateFunc();
                }else{
                    // TODO: Drafted into career of choice
                    var reserves = [];
                    for(var i = 0, len = awards.length; i < len; i++){
                        var award = awards[i];
                        if(award === "Army Reserves"){
                            reserves.push({career:ENUM_CAREERS.Soldier,reserves:award});
                        }else if(award === "Navy Reserves"){
                            reserves.push({career:ENUM_CAREERS.Spacer,reserves:award});
                        }else if(award === "Marine Reserves"){
                            reserves.push({career:ENUM_CAREERS.Marine,reserves:award});
                        }
                    }
                    var reserve = reserves[(roller.random() * reserves.length) >>> 0];
                    record("Called up by the " + reserve.reserves+ "!");
                    updateFunc();
                    var svcIndex = 0;
                    for(var s = 0; s < careers.length; s++){
                        if(careers[s].career === reserve.career){
                            svcIndex = s; break;
                        }
                    }
                    careers[svcIndex].active = true;
                    careers[careers.length - 1].active = false;
                    var svcCareers = careers.splice(svcIndex,1);
                    careers.push(svcCareers[0]);
                    var resetCCs = true;
                    resolveCareer(reserve.career,updateFunc,resetCCs);
                }
            }
        }else{
            record("Could not resign from reserves because character is not in the reserves.");
        }
        for(var i = 0, len = awards.length; i < len; i++){

        }
    }
    function getAwards(){
        return awards;
    }
    function getMajors(){
        return majors;
    }
    function getMinors(){
        return minors;
    }
    function getMajorsLabels(){
        return getDegreeLabels("major");
    }
    function getMinorsLabels(){
        return getDegreeLabels("minor");
    }
    function getDegreeLabels(majorOrMinor){
        var degrees = [];
        if(majorOrMinor === "major"){ degrees = majors; }
        else if(majorOrMinor === "minor"){ degrees = minors; }
        var labels = [];
        for(var i = 0, len = degrees.length; i < len; i++){
            var label = "";
            if(typeof degrees[i].knowledge == "undefined"){
                label = degrees[i].skill;
            }else{
                label = degrees[i].skill+"("+degrees[i].knowledge+")";
            }
            degrees[i].label = label;
            labels.push(label);
        }
        return labels;
    }
    function getHistory(){
        return history;
    }
    function getCareers(){
        return careers;
    }
    function getCredits(){
        return credits;
    }
    function getGender(){
        return genderKey;
    }
    function getSanity(){
        return sanity;
    }
    function setSanity(newValue){
        sanity = newValue;
    }
    function exportCharacter(){
        var character = {
            age:age,
            fameMusterOutBonus:fameMusterOutBonus,
            agingCrises:agingCrises,
            awards:getAwards(),
            careers:getCareers(),
            CCs:CCs,
            characteristics:getCharacteristics(),
            credits:credits,  
            edu_waivers:edu_waivers,
            fameFluxApplied:fameFluxApplied,
            finalFameRoll:finalFameRoll,
            gender:getGender(),
            genetics:getGenetics(),
            history:getHistory(),
            hobby:hobby,
            job:job,
            languageReceipts:languageReceipts,
            lastCitLifeReceipt:lastCitLifeReceipt,
            majors:majors,
            merchantShipShareReceiptLevel:merchantShipShareReceiptLevel,
            minors:minors,
            name:getName(),
            nativeLanguage:getNativeLanguage(),
            musteredOut:musteredOut,
            sanity:getSanity(),
            shipShares:getShipShares(),
            skills:skills,
            species:species,
            fameFlux:fameFlux,
            resignationDeclined:resignationDeclined
        }
        return character;
    }
    function setSkills(newSkills){
        skills = newSkills;
    }
    function getSkills(){
        return skills;
    }
    function importCharacter(characterJson){
        setAge(characterJson.age);
        agingCrises = characterJson.agingCrises;
        awards = characterJson.awards;
        careers = characterJson.careers;
        CCs = characterJson.CCs;
        if(typeof characterJson.fameMusterOutBonus !== "undefined"){
            fameMusterOutBonus = characterJson.fameMusterOutBonus;}else{fameMusterOutBonus = false;}
        setCharacteristics(characterJson.characteristics);
        credits = characterJson.credits;
        edu_waivers = characterJson.edu_waivers;
        fameFlux = typeof characterJson.fameFlux == "undefined" ? 0 : characterJson.fameFlux;
        fameFluxApplied = characterJson.fameFlux == "undefined" ? false : characterJson.fameFluxApplied;
        finalFameRoll = characterJson.finalFameRoll;
        genderKey = characterJson.gender;
        genetics = characterJson.genetics;
        hobby = characterJson.hobby;
        history = characterJson.history;
        job = characterJson.job;
        languageReceipts = characterJson.languageReceipts;
        lastCitLifeReceipt = characterJson.lastCitLifeReceipt;
        majors = characterJson.majors;
        merchantShipShareReceiptLevel = characterJson.merchantShipShareReceiptLevel;
        minors = characterJson.minors;
        setName(characterJson.name);
        nativeLanguage = characterJson.nativeLanguage;
        musteredOut = characterJson.musteredOut;
        setSanity(characterJson.sanity);
        shipShares = characterJson.shipShares;
        setSkills(characterJson.skills);
        resignationDeclined = typeof characterJson.resignationDeclined == "undefined" ? false : characterJson.resignationDeclined;
        switch(characterJson.species){
            case "human":species = human; break;
            default: species = human;
        }
    }
    function setCharacteristics(newCharacteristics){
        characteristics = newCharacteristics;
    }
    function getCharacteristics(){
        return characteristics;
    }
    return {
        isForcedGrowthClone:isForcedGrowthClone,
        gender:genderKey, getCharacteristics,
        getSkills, getGenetics:getGenetics, species:species,
        setAge:setAge, getAge:getAge, getNativeLanguage:getNativeLanguage, setNativeLanguage:setNativeLanguage, getNativeLanguageLevel,
        setForcedGrowthClone:setForcedGrowthClone, rollStatsFromGenes:rollStatsFromGenes,
        getAwards:getAwards, getMajorsLabels:getMajorsLabels, getMinorsLabels:getMinorsLabels, getMajors:getMajors, getMinors:getMinors,
        checkCharacteristic:checkCharacteristic, checkCSK:checkCSK,
        gainKnowledge:gainKnowledge, gainSkill:gainSkill, gainLanguage:gainLanguage,
        gainSkillOrKnowledge: gainSkillOrKnowledge, gainSkillsFromHomeworldTradeCodes:gainSkillsFromHomeworldTradeCodes,
        gainCharacteristic:gainCharacteristic, decreaseCharacteristic:decreaseCharacteristic,
        advanceAge:advanceAge, promptEducationWaiver:promptEducationWaiver,
        Apprenticeship:Apprenticeship, ED5:ED5, TradeSchool:TradeSchool, TrainingCourse,
        College:College, University:University, Masters:Masters, 
        Professors:Professors, MedicalSchool:MedicalSchool, LawSchool:LawSchool,
        NavalAcademy:NavalAcademy, MilitaryAcademy:MilitaryAcademy,getSanity, getHistory, initStats, getCharacteristics,
        resolveCareer, getCareers, getName, setName, getCredits, getQualifications, musterOut, getGender,
        getPlayabilityScore, getShipShares, calculateFame, fameFluxEvent, exportCharacter, importCharacter, fameMusterOutBonus, claimFameMusterOutBonus,
        resignFromReserves, getCraftsmanQualifications
    }
}
