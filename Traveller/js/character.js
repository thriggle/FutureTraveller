import { getRollerFromSeed } from "./rnd.js";
import { human } from "./species/human.js";
import { ENUM_CHARACTERISTICS } from "./species/species.js";
import {CLASS_SPECIES} from "./species/species.js";
import { SoldierSkills, StarshipSkills, ENUM_SKILLS, ENUM_SKILLS as MasterSkills, Knowledges as KnowledgeSpecialties, ArtSkills, TradeSkills } from "./species/skills.js";
import { getDialog, dialogCallback, pickOption, pickSkill } from "./species/dialog.js";
export function createCharacter(roller, species){
    if(typeof roller === "undefined"){
        roller = getRollerFromSeed();
    }
    if(typeof species === "undefined"){
        species = human;
    }
    var majors = [], minors = [];
    var nativeLanguage = "Anglic";
    var languageReceipts = 0; var edu_waivers = 0; var awards = [];
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
    var statRollResults = rollStats();
    var characteristics = statRollResults.characteristics, genetics = statRollResults.genetics;
    function rollStats(){
        var statRolls = [
            roller.d6(species.Characteristics[0].nD + gender.Characteristics[0].nD + caste.Characteristics[0].nD),
            roller.d6(species.Characteristics[1].nD + gender.Characteristics[1].nD + caste.Characteristics[1].nD),
            roller.d6(species.Characteristics[2].nD + gender.Characteristics[2].nD + caste.Characteristics[2].nD),
            roller.d6(species.Characteristics[3].nD + gender.Characteristics[3].nD + caste.Characteristics[3].nD),
            roller.d6(species.Characteristics[4].nD + gender.Characteristics[4].nD + caste.Characteristics[4].nD),
            roller.d6(species.Characteristics[5].nD + gender.Characteristics[5].nD + caste.Characteristics[5].nD)
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
        languageReceipts = 0;
        if(species.Characteristics[4].name == ENUM_CHARACTERISTICS.INS){ genetics.push(statRolls[4].rolls[0]);}
        skills[MasterSkills.Language].Knowledge[nativeLanguage] = characteristics[3].value;
        if(species.Characteristics[4].name == ENUM_CHARACTERISTICS.EDU && characteristics[4].value > characteristics[3].value){
            skills[MasterSkills.Language].Knowledge[nativeLanguage] = characteristics[4].value;
        }
        edu_waivers = characteristics[5].value; 
        return {statRolls, characteristics, genetics}
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
        edu_waivers = characteristics[5].value;
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
        }
    }
    function gainSkill(skill){
        if(typeof skills[skill] != "undefined"){
            if(skills[skill].Skill >= 0){
                skills[skill].Skill += 1;
            }else{
                skills[skill].Skill = 1;
            }
        }else{
            skills[skill] = {Skill:1,Knowledge:{}}
        }
    }
    function gainKnowledge(skill,knowledge){
        if(typeof skills[skill] != "undefined"){
            if(skills[skill].Knowledge[knowledge] >= 0){
                skills[skill].Knowledge[knowledge] += 1;
            }else{
                skills[skill].Knowledge[knowledge] = 1;
            }
        }else{
            skills[skill] = {Skill:0,Knowledge:{}}
            skills[skill].Knowledge[knowledge] = 1;
        }
    }
    function gainSkillsFromHomeworldTradeCodes(codes, callback){
        var codeArray = codes.split(" ");
        for(var i = 0, len = codeArray.length; i < len; i++){
            var code = codeArray[i];
            var note = code + " trade code on homeworld provides a skill.";
            switch(code){
                case "Ag": gainSkillWithPromptForKnowledge(note,ENUM_SKILLS.Animals,callback); break;
                case "As": gainSkillWithPromptForKnowledge(note,ENUM_SKILLS.ZeroG,callback); break;
                case "Co": gainSkillWithPromptForKnowledge(note,ENUM_SKILLS.HostileEnviron,callback); break;
                case "Cp": gainSkillWithPromptForKnowledge(note,ENUM_SKILLS.Admin,callback); break;
                case "Cs": gainSkillWithPromptForKnowledge(note,ENUM_SKILLS.Bureaucrat,callback); break;
                case "Cx": gainSkillWithPromptForKnowledge(note,ENUM_SKILLS.Language,callback); break;
                case "Da": gainSkillWithPromptForKnowledge(note,ENUM_SKILLS.Fighter,callback); break;
                case "De": gainSkillWithPromptForKnowledge(note,ENUM_SKILLS.Survival,callback); break;
                case "Ds": gainSkillWithPromptForKnowledge(note,ENUM_SKILLS.VaccSuit,callback); gainSkillWithPromptForKnowledge(ENUM_SKILLS.ZeroG,callback);break;
                case "Fa": gainSkillWithPromptForKnowledge(note,ENUM_SKILLS.Animals,callback); break;
                case "Fl": gainSkillWithPromptForKnowledge(note,ENUM_SKILLS.HostileEnviron,callback); break;
                case "Fr": gainSkillWithPromptForKnowledge(note,ENUM_SKILLS.HostileEnviron,callback); break;
                case "Ga": gainSkillWithPromptForKnowledge(note,ENUM_SKILLS.Trader,callback); break;
                case "He": gainSkillWithPromptForKnowledge(note,ENUM_SKILLS.HostileEnviron,callback); break;
                case "Hi": gainSkillWithPromptForKnowledge(note,ENUM_SKILLS.Streetwise,callback); break;
                case "Ho": gainSkillWithPromptForKnowledge(note,ENUM_SKILLS.HostileEnviron,callback); break;
                case "Ic": gainSkillWithPromptForKnowledge(note,ENUM_SKILLS.VaccSuit,callback); break;
                case "In": gainSkillWithPromptForCategory(note,"TRADE",callback); break;
                case "Lo": gainSkillWithPromptForKnowledge(note,ENUM_SKILLS.Flyer,callback); break;
                case "Na": gainSkillWithPromptForKnowledge(note,ENUM_SKILLS.Survey,callback); break;
                case "Ni": gainSkillWithPromptForKnowledge(note,ENUM_SKILLS.Driver,callback); break;
                case "Oc": gainSkillWithPromptForKnowledge(note,ENUM_SKILLS.HighG,callback); break;
                case "Pa": gainSkillWithPromptForKnowledge(note,ENUM_SKILLS.Trader,callback); break;
                case "Pi": gainSkillWithPromptForKnowledge(note,ENUM_SKILLS.JOT,callback); break;
                case "Po": gainSkillWithPromptForKnowledge(note,ENUM_SKILLS.Steward,callback); break;
                case "Pr": gainSkillWithPromptForKnowledge(note,ENUM_SKILLS.Craftsman,callback); break;
                case "Ri": gainSkillWithPromptForCategory(note,"ART",callback); break;
                case "Tr": gainSkillWithPromptForKnowledge(note,ENUM_SKILLS.Survival,callback); break;
                case "Tu": gainSkillWithPromptForKnowledge(note,ENUM_SKILLS.Survival,callback); break;
                case "Tu": gainSkillWithPromptForKnowledge(note,ENUM_SKILLS.Driver,callback); break;
                case "Va": gainSkillWithPromptForKnowledge(note,ENUM_SKILLS.VaccSuit,callback); break;
                case "Wa": gainSkillWithPromptForKnowledge(note,ENUM_SKILLS.Seafarer,callback); break;
                default: break; 
            }
        }
    }
    function gainSkillWithPromptForCategory(prompt,skillCategory,callback){
        switch(skillCategory.toUpperCase()){
            case "ART": 
            pickOption(ArtSkills,prompt + " Choose an Art skill.",function(x){proceed(x);});
            break;
            case "TRADE": 
            pickOption(TradeSkills,prompt + " Choose a skilled Trade.",function(x){proceed(x);});
            break;
            case "SHIP":
                case "STARSHIP": 
                pickOption(StarshipSkillsSkills,prompt + " Choose a Starship Skill.",function(x){proceed(x);});
                break;
                case "SOLDIER": 
                pickOption(SoldierSkillsSkills,prompt + " Choose a Soldier Skill.",function(x){proceed(x);});
            break;
        }
        function proceed(chosenSkill){
            gainSkillWithPromptForKnowledge(prompt,chosenSkill,callback);
        }
    }
    function gainSkillWithPromptForKnowledge(prompt,skill,callback){
        if(KnowledgeSpecialties[skill]){
            pickOption(KnowledgeSpecialties[skill],prompt + " Choose a specialized "+skill+" knowledge.",function(x){proceed(x);})
        }else{proceed(undefined);}
        function proceed(chosenKnowledge){
            callback(prompt + " " + gainSkillOrKnowledge(skill,chosenKnowledge,false));
        }
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
        return remarks;
    }
    function promptEducationWaiver(note){
        if(typeof note === "undefined"){ note = "";}else{ note += " "}
        var remarks = "";
        var success = false;
        if(edu_waivers >= 2){
            var useWaiver = confirm(note + "Do you want to try to use an education waiver? (Current waiver value="+edu_waivers+")");
            if(useWaiver){
                var result = check(edu_waivers,2,0,"Education Waiver vs " + edu_waivers)
                edu_waivers -= 1;
                success = result.success;
                remarks += result.remarks;
            }else{
                success = false;
                remarks = " Declined to try using an education waiver. ";
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
                remarks += waiverResult.remarks + newLine;
                tryTradeSchool = waiverResult.success;
            }
            if(tryTradeSchool){
                remarks += "Trade School Application: ";
                var applyResult = checkCharacteristic(ENUM_CHARACTERISTICS.INT,2,0);
                remarks +=  applyResult.remarks + newLine;
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
                    if(passResult.success){
                        gainSkillOrKnowledge(MajorSkill,MajorKnowledge,true);
                        remarks += gainSkillOrKnowledge(MajorSkill,MajorKnowledge,true) + newLine;
                        addMajor(MajorSkill,MajorKnowledge);
                    }
                    remarks += advanceAge(1);
                }else{
                    remarks += advanceAge(1);
                }
            }
        }else{
            remarks = "Character is ineligible for Trade School due to having " + characteristics[4].name + " instead of " + ENUM_CHARACTERISTICS.EDU+". ";
        }
        return remarks;
    }
    function Apprenticeship(skill,knowledge){
        var newLine = "_";
        var remarks = "";
        if(age > species.getFirstYearOfStage(3)){
            remarks += "Character ineligible for apprenticeship due to having passed the age of apprenticeship ("+species.getFirstYearOfStage(3)+").";
        }else{
            var result = checkCharacteristic(ENUM_CHARACTERISTICS.TRA,2,0);
            remarks = "Apprenticeship: " + result.remarks + newLine;
            if(result.success){
                gainSkillOrKnowledge(skill,knowledge,true);
                gainSkillOrKnowledge(skill,knowledge,true);
                gainSkillOrKnowledge(skill,knowledge,true);
                remarks += gainSkillOrKnowledge(skill,knowledge,true);
            }
        }
        
        return remarks;
    }
    
    function College(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge, log){
        var result = "College:_"+BAProgram(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge, 5, 8, true, log);    
        return result;
    }
    function University(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge, log){
        var result = "University:_" +BAProgram(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge, 7, 9, true, log);
        return result;
    }
    function MilitaryAcademy(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge, log){
        return ServiceAcademy(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge, "Army", log);
    }
    function NavalAcademy(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge, log){
        return ServiceAcademy(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge, "Navy", log);
    }
    function ServiceAcademy(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge, branch, log){
        return branch + " Academy:_" + BAProgram(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge, 6, 8, false, log, branch);
    }
    function BAProgram(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge, MinStartEdu, MinEndEdu, offerOTC, log, commissionOnSuccess){
        var newLine = "_";
        var remarks = "", notFlunked = false;
        if(characteristics[4].name != ENUM_CHARACTERISTICS.INS){
            var tryBAProgram = true;
            if(characteristics[4].value < MinStartEdu || characteristics[4].name === ENUM_CHARACTERISTICS.TRA){
                tryBAProgram = false;
                var waiverResult = promptEducationWaiver("Insufficient EDU to attend BA program.");
                remarks += waiverResult.remarks + newLine;
                tryBAProgram = waiverResult.success;
            }
            if(tryBAProgram){
                remarks += "BA Program Application: ";
                var intScore = characteristics[3].value;
                var eduScore = characteristics[4].value; if(characteristics[4].name == ENUM_CHARACTERISTICS.TRA){ eduScore = eduScore/2;}
                var applyResult = checkCharacteristic(intScore > eduScore ? ENUM_CHARACTERISTICS.INT : ENUM_CHARACTERISTICS.EDU,2,0);
                remarks +=  applyResult.remarks + newLine;
                if(! applyResult.success){ 
                    var applyWaiverResult = promptEducationWaiver("Failed program application.");
                    remarks += applyWaiverResult.remarks + newLine;
                    applyResult.success = applyWaiverResult.success;
                }
                if(applyResult.success){
                    var armyCommission = false, navyCommission = false;

                    notFlunked = true;
                    var secondGain = false;
                    for(var i = 1; i <= 4 && notFlunked; i++){
                        var passResult = checkCharacteristic(intScore > eduScore ? ENUM_CHARACTERISTICS.INT : ENUM_CHARACTERISTICS.EDU,2,0);
                        remarks += "Year " + i +" Pass/Fail: " + passResult.remarks + newLine;
                        if(passResult.success){                          
                            if(secondGain){
                                addMinor(MinorSkill,MinorKnowledge);
                                remarks += gainSkillOrKnowledge(MinorSkill,MinorKnowledge,true) + newLine;
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
                            remarks += gainSkillOrKnowledge(MajorSkill,MajorKnowledge,true) + newLine;
                        }else{
                            var honorsWaiverResult = promptEducationWaiver("Failed to achieve Honors BA.");
                            remarks += honorsWaiverResult.remarks + newLine;
                            honorsResult.success = honorsWaiverResult.success;
                        }
                        if(honorsResult.success){
                            remarks += "Attained Honors BA" + newLine;; awards.push("Honors BA");
                        }else{
                            remarks += "Attained BA" + newLine;; awards.push("BA");
                        }
                        
                        if(offerOTC){
                            var finalStatBoost = function(){
                                var remarks = "";
                                if(characteristics[4].name === ENUM_CHARACTERISTICS.EDU){
                                    if(characteristics[4].value < MinEndEdu){
                                        characteristics[4].value = MinEndEdu;
                                        remarks += ENUM_CHARACTERISTICS.EDU + " increased to " + characteristics[4].value +". " + newLine;;
                                    }else{
                                        remarks += gainCharacteristic(ENUM_CHARACTERISTICS.EDU,1)+". " + newLine;;
                                    }
                                }
                                log(remarks);
                            };
                            var options = [];
                            options.push("None");
                            if(awards.indexOf("Army Officer1") === -1){ options.push("OTC");}
                            if(awards.indexOf("Navy Officer1") === -1){ options.push("NOTC");}
                            pickOption(options,"Do you wish to join OTC (Army) or NOTC (Navy)?",
                            function(choice){
                                var otc = false, notc = false, further_remarks = "";
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
                                    finalStatBoost();
                                    further_remarks += otcResult.remarks + newLine;
                                    if(!otcResult.success){
                                        var otcWaiverResult = promptEducationWaiver("Failed " + choice + " training course.");
                                        further_remarks += otcWaiverResult.remarks + newLine;
                                        otcResult.success = otcWaiverResult.success;
                                        if(otcResult.success){
                                            if(choice === "OTC"){
                                                armyCommission = true;
                                            }else{
                                                navyCommission = true;
                                            }
                                        }
                                    }else{
                                        var otc_skill_list = []
                                        if(otc){
                                            armyCommission = true;
                                            otc_skill_list = SoldierSkills;
                                        }else if(notc){
                                            navyCommission = true;
                                            otc_skill_list = StarshipSkills;
                                        }
                                        pickOption(otc_skill_list,"Please choose a " + (otc ? "Soldier" : "Starship") + " skill.",function(new_skill){
                                            var even_further_remarks = "";
                                            if(KnowledgeSpecialties[new_skill]){
                                                pickOption(KnowledgeSpecialties[new_skill],"Please choose a knowledge from this list.",function(new_knowledge){
                                                    log(gainSkillOrKnowledge(new_skill,new_knowledge,true));
                                                    if(navyCommission){ 
                                                        pickOption(["Navy","Marine"],"Choose a service.",function(service_choice){
                                                        awards.push(service_choice + " Officer1");
                                                        log("Earned " + service_choice + " Commission ("+service_choice+" Officer1).");
                                                        });
                                                    }
                                                });
                                            }else{
                                                if(navyCommission){ 
                                                    pickOption(["Navy","Marine"],"Choose a service.",function(service_choice){
                                                    awards.push(service_choice + " Officer1");
                                                    log("Earned " + service_choice + " Commission ("+service_choice+" Officer1).");
                                                    });
                                                }
                                                even_further_remarks += gainSkillOrKnowledge(new_skill,undefined,true) + newLine;
                                                log(even_further_remarks);
                                            }
                                        });
                                    }
                                    if(armyCommission){ 
                                        awards.push("Army Officer1");
                                        further_remarks += "Earned Army commission (Army Officer1).";
                                    }
                                    
                                    log(further_remarks);
                                }else{
                                    further_remarks += "Declined to volunteer for OTC/NOTC.";
                                    log(further_remarks);
                                    finalStatBoost();
                                }
                            });
                            
                        }else{
                            if(characteristics[4].name === ENUM_CHARACTERISTICS.EDU){
                                if(characteristics[4].value < MinEndEdu){
                                    characteristics[4].value = MinEndEdu;
                                    remarks += ENUM_CHARACTERISTICS.EDU + " increased to " + characteristics[4].value +". " + newLine;;
                                }else{
                                    remarks += gainCharacteristic(ENUM_CHARACTERISTICS.EDU,1)+". " + newLine;;
                                }
                            }
                        }
                        if(commissionOnSuccess){
                            if(commissionOnSuccess === "Army"){
                                    awards.push("Army Officer1");
                                    remarks += "Earned Army commission (Army Officer1).";
                            }else if(commissionOnSuccess === "Navy"){ 
                                pickOption(["Navy","Marine"],"Choose a service.",function(service_choice){
                                    awards.push(service_choice + " Officer1");
                                    log("Earned " + service_choice + " Commission ("+service_choice+" Officer1).");
                                });
                            }
                        }
                    }
                    
                }else{
                    remarks += advanceAge(1);
                }
            }
        }else{
            remarks = "Character is ineligible for higher education due to having " + characteristics[4].name + " instead of " + ENUM_CHARACTERISTICS.EDU+". ";
        }
        return remarks;
    }
    function Masters(MajorSkill,MajorKnowledge,MinorSkill,MinorKnowledge){
        var remarks = "", newLine = "_", notFlunked = false;
        var hasBA = awards.indexOf("BA") >= 0 || awards.indexOf("Honors BA") >= 0;
        if(!hasBA){
            remarks += "Character is ineligible for MA program without having earned a BA.";
        }else{
            remarks += "MA Program Application: ";
            var intScore = characteristics[3].value;
            var eduScore = characteristics[4].value; if(characteristics[4].name == ENUM_CHARACTERISTICS.TRA){ eduScore = eduScore/2;}
            var applyResult = checkCharacteristic(intScore > eduScore ? ENUM_CHARACTERISTICS.INT : ENUM_CHARACTERISTICS.EDU,2,0);
            remarks +=  applyResult.remarks + newLine;
            if(! applyResult.success){ 
                var applyWaiverResult = promptEducationWaiver("Failed program application.");
                remarks += applyWaiverResult.remarks + newLine;
                applyResult.success = applyWaiverResult.success;
            }
            if(applyResult.success){
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
                        remarks += gainSkillOrKnowledge(MajorSkill,MajorKnowledge,true) + newLine;
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
        }else{
            remarks += "Professor Program Application: ";
            var intScore = characteristics[3].value;
            var eduScore = characteristics[4].value; if(characteristics[4].name == ENUM_CHARACTERISTICS.TRA){ eduScore = eduScore/2;}
            var applyResult = checkCharacteristic(intScore > eduScore ? ENUM_CHARACTERISTICS.INT : ENUM_CHARACTERISTICS.EDU,2,0);
            remarks +=  applyResult.remarks + newLine;
            if(! applyResult.success){ 
                var applyWaiverResult = promptEducationWaiver("Failed program application.");
                remarks += applyWaiverResult.remarks + newLine;
                applyResult.success = applyWaiverResult.success;
            }
            if(applyResult.success){
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
                        remarks += gainSkillOrKnowledge(MajorSkill,MajorKnowledge,true) + newLine;
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
        var hasBA = awards.indexOf("Honors BA") >= 0;
        if(!hasBA){
            remarks += "Character is ineligible for Medical School program without having earned an Honors BA.";
        }else{
            remarks += "Medical School Program Application: ";
            var intScore = characteristics[3].value;
            var eduScore = characteristics[4].value; if(characteristics[4].name == ENUM_CHARACTERISTICS.TRA){ eduScore = eduScore/2;}
            var applyResult = checkCharacteristic(intScore > eduScore ? ENUM_CHARACTERISTICS.INT : ENUM_CHARACTERISTICS.EDU,2,0);
            remarks +=  applyResult.remarks + newLine;
            if(! applyResult.success){ 
                var applyWaiverResult = promptEducationWaiver("Failed program application.");
                remarks += applyWaiverResult.remarks + newLine;
                applyResult.success = applyWaiverResult.success;
            }
            if(applyResult.success){
                notFlunked = true;
                for(var i = 1; i <= 4 && notFlunked; i++){
                    var passResult = checkCharacteristic(intScore > eduScore ? ENUM_CHARACTERISTICS.INT : ENUM_CHARACTERISTICS.EDU,2,0);
                    remarks += "Year " + i +" Pass/Fail: " + passResult.remarks + newLine;
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
                        remarks += gainSkillOrKnowledge(MajorSkill,undefined,true) + newLine;
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
        var hasBA = awards.indexOf("Honors BA") >= 0;
        if(!hasBA){
            remarks += "Character is ineligible for Law School program without having earned an Honors BA.";
        }else{
            remarks += "Law School Program Application: ";
            var intScore = characteristics[3].value;
            var eduScore = characteristics[4].value; if(characteristics[4].name == ENUM_CHARACTERISTICS.TRA){ eduScore = eduScore/2;}
            var applyResult = checkCharacteristic(intScore > eduScore ? ENUM_CHARACTERISTICS.INT : ENUM_CHARACTERISTICS.EDU,2,0);
            remarks +=  applyResult.remarks + newLine;
            if(! applyResult.success){ 
                var applyWaiverResult = promptEducationWaiver("Failed program application.");
                remarks += applyWaiverResult.remarks + newLine;
                applyResult.success = applyWaiverResult.success;
            }
            if(applyResult.success){
                notFlunked = true;
                for(var i = 1; i <= 2 && notFlunked; i++){
                    var passResult = checkCharacteristic(intScore > eduScore ? ENUM_CHARACTERISTICS.INT : ENUM_CHARACTERISTICS.EDU,2,0);
                    remarks += "Year " + i +" Pass/Fail: " + passResult.remarks + newLine;
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
                        remarks += gainSkillOrKnowledge(MajorSkill,undefined,true) + newLine;
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
    function gainLanguage(language,isEducation){
        var remarks = "";
        if(isEducation){
            if(skills[ENUM_SKILLS.Language].Knowledge[language]){
                skills[ENUM_SKILLS.Language].Knowledge[language] += 2;
                remarks = "Gained Language(" + language + ")-" + skills[ENUM_SKILLS.Language].Knowledge[language];
            }else{
                skills[ENUM_SKILLS.Language].Knowledge[language] = 2;
                remarks = "Gained Language(" + language + ")-" + skills[ENUM_SKILLS.Language].Knowledge[language];
            }
        }else{
            languageReceipts += 1;
            if(skills[ENUM_SKILLS.Language].Knowledge[language]){
                skills[ENUM_SKILLS.Language].Knowledge[language] +=1;
                remarks = "Gained Language(" + language + ")-" + skills[ENUM_SKILLS.Language].Knowledge[language];
            }else{
                skills[ENUM_SKILLS.Language].Knowledge[language] = skills[ENUM_SKILLS.Language].Knowledge[nativeLanguage]-languageReceipts;
                remarks = "Gained Language(" + language + ")-" + skills[ENUM_SKILLS.Language].Knowledge[language];
            }
        }
        return remarks;
    }
    function gainSkillOrKnowledge(skill,knowledge,isEducation){
        var remarks = "";
        if(typeof knowledge == "undefined"){ // if no knowledge specified, just increase skill
            if(typeof skills[skill] != "undefined"){
                if(skills[skill].Skill >= 0){
                    if(skills[skill].Skill < 15){
                        skills[skill].Skill += 1;
                        remarks += "Gained " + skill + "-" + skills[skill].Skill + ". ";
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
                if(skill == ENUM_SKILLS.Language && isEducation){ // Language gains are doubled during Education and not limited to 6
                    if(skills[skill].Knowledge[knowledge]){
                        skills[skill].Knowledge[knowledge] += 2;
                        remarks += "Gained " + skill + "("+knowledge + ")-" + skills[skill].Knowledge[knowledge] + ". ";
                    }else{
                        skills[skill].Knowledge[knowledge] = 2;
                        remarks += "Gained " + skill + "("+knowledge + ")-" + skills[skill].Knowledge[knowledge] + ". ";
                    }
                }else if(skills[skill].Knowledge[knowledge]){  // if we already have the knowledge
                    if(skills[skill].Knowledge[knowledge] < 6){ // and we haven't reached the cap
                        skills[skill].Knowledge[knowledge] += 1; // increase it by 1
                        remarks += "Gained " + skill + "("+knowledge + ")-" + skills[skill].Knowledge[knowledge] + ". ";
                    }else if( skill === ENUM_SKILLS.Science){ // if we have reached the cap and it's a science, gain a specialty instead
                        var spec_counter = 0;
                        var specialty_name = knowledge;
                        while(skill[skill].Knowledge[specialty_name] && skill[skill].Knowledge[specialty_name] === 6){
                            spec_counter += 1;
                            specialty_name = knowledge + " specialty " + spec_counter;
                        }
                        if(skill[skill].Knowledge[specialty_name]){
                            skill[skill].Knowledge[specialty_name] += 1;
                            remarks += "Gained " + skill + "("+knowledge + ")-" + skills[skill].Knowledge[specialty_name] + ". ";
                        }else{
                            skill[skill].Knowledge[specialty_name] = 1;
                            remarks += "Gained " + skill + "("+knowledge + ")-" + skills[skill].Knowledge[specialty_name] + ". ";
                        }
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
                    // increase knowledge
                    if(typeof skills[skill].Knowledge[knowledge] == "undefined"){
                        skills[skill].Knowledge[knowledge] = 1;
                        remarks += "Gained " + skill + "("+knowledge + ")-" + skills[skill].Knowledge[knowledge] + ". ";
                    }else if(skills[skill].Knowledge[knowledge] < 6){
                        skills[skill].Knowledge[knowledge] += 1;
                        remarks += "Gained " + skill + "("+knowledge + ")-" + skills[skill].Knowledge[knowledge] + ". ";
                    }else{
                        remarks += "Could not increase knowledge."
                    }
                }
            }
        }
        
        return remarks;
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
        return "Native language = " +newLanguage;
    }
    function setForcedGrowthClone(isClone){isForcedGrowthClone = isClone;}
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
        if(typeof mods === "undefined"){ mods = 0;}
        if(typeof difficulty === "undefined"){ difficulty = 2;}
        if(typeof characteristic === "number" && characteristic <= 6 && characteristic >= 1){ target = characteristics[characteristic-1].value;}
        else if(typeof characteristic === "string"){ 
            switch(characteristic){
                case ENUM_CHARACTERISTICS.STR: 
                    target = characteristics[0].value; 
                    break;
                case ENUM_CHARACTERISTICS.DEX: 
                    target = characteristics[1].name === ENUM_CHARACTERISTICS.DEX ? characteristics[1].value : characteristics[1].value/2; 
                    break;
                case ENUM_CHARACTERISTICS.AGI: 
                    target = characteristics[1].name === ENUM_CHARACTERISTICS.AGI ? characteristics[1].value : characteristics[1].value/2; 
                    break;
                case ENUM_CHARACTERISTICS.GRA: 
                    target = characteristics[1].name === ENUM_CHARACTERISTICS.GRA ? characteristics[1].value : characteristics[1].value/2; 
                    break;
                case ENUM_CHARACTERISTICS.END: 
                    target = characteristics[2].name === ENUM_CHARACTERISTICS.END ? characteristics[2].value : characteristics[2].value/2; 
                    break;
                case ENUM_CHARACTERISTICS.STA: 
                    target = characteristics[2].name === ENUM_CHARACTERISTICS.STA ? characteristics[2].value : characteristics[2].value/2; 
                    break;
                case ENUM_CHARACTERISTICS.VIG: 
                    target = characteristics[2].name === ENUM_CHARACTERISTICS.VIG ? characteristics[2].value : characteristics[2].value/2; 
                    break;
                case ENUM_CHARACTERISTICS.INT: 
                    target = characteristics[3].value; 
                    break;
                case ENUM_CHARACTERISTICS.EDU: 
                    switch(characteristics[4].name){
                        case ENUM_CHARACTERISTICS.EDU: target = characteristics[4].value; break;
                        case ENUM_CHARACTERISTICS.TRA: target = characteristics[4].value/2; break;
                        case ENUM_CHARACTERISTICS.INS: target = 4; break;
                    }
                    break;
                case ENUM_CHARACTERISTICS.TRA: 
                switch(characteristics[4].name){
                    case ENUM_CHARACTERISTICS.EDU: target = characteristics[4].value/2; break;
                    case ENUM_CHARACTERISTICS.TRA: target = characteristics[4].value; break;
                    case ENUM_CHARACTERISTICS.INS: target = 4; break;
                }
                break;
                case ENUM_CHARACTERISTICS.INS: 
                    switch(characteristics[4].name){
                        case ENUM_CHARACTERISTICS.INS: target = characteristics[4].value; break;
                        case ENUM_CHARACTERISTICS.TRA: target = 4; break;
                        case ENUM_CHARACTERISTICS.EDU: target = 4; break;
                    }
                    break;
                case ENUM_CHARACTERISTICS.SOC: 
                    switch(characteristics[5].name){
                        case ENUM_CHARACTERISTICS.SOC: target = characteristics[5].value; break;                    
                        case ENUM_CHARACTERISTICS.CHA: target = characteristics[5].value/2; break;                    
                        case ENUM_CHARACTERISTICS.CAS: target = 4; break;                    
                    }
                    break;
                case ENUM_CHARACTERISTICS.CHA: 
                    switch(characteristics[5].name){
                        case ENUM_CHARACTERISTICS.SOC: target = characteristics[5].value; break;                    
                        case ENUM_CHARACTERISTICS.CHA: target = characteristics[5].value; break;                    
                        case ENUM_CHARACTERISTICS.CAS: target = 4; break;                    
                    }
                    break;
                case ENUM_CHARACTERISTICS.CAS: 
                    switch(characteristics[5].name){
                        case ENUM_CHARACTERISTICS.SOC: target = 4; break;                    
                        case ENUM_CHARACTERISTICS.CHA: target = 4; break;                    
                        case ENUM_CHARACTERISTICS.CAS: target = characteristics[5].value; break;                    
                    }
                    break;
            }
        }
        if(typeof remarks == "undefined"){
            remarks = difficulty + "D vs "+characteristic +" ("+target+")" + (mods > 0 ? ("+"+mods) : "");
        }
        return check(target,difficulty,mods,remarks);
    }
    function gainCharacteristic(characteristic, amount){
        if(typeof amount == "undefined"){ amount = 1;}
        var index = 0;
        if(typeof characteristic === "number" && characteristic <= 6 && characteristic >= 1){ index = characteristic-1; }
        else if(typeof characteristic === "string"){
            switch(characteristic){
                case ENUM_CHARACTERISTICS.STR: 
                    index = 0; 
                    break;
                case ENUM_CHARACTERISTICS.DEX: 
                    index = 1; 
                    break;
                case ENUM_CHARACTERISTICS.AGI: 
                    index = 1; 
                    break;
                case ENUM_CHARACTERISTICS.GRA: 
                    index = 1; 
                    break;
                case ENUM_CHARACTERISTICS.END: 
                    index = 2; 
                    break;
                case ENUM_CHARACTERISTICS.STA: 
                    index = 2; 
                    break;
                case ENUM_CHARACTERISTICS.VIG: 
                    index = 2;  
                    break;
                case ENUM_CHARACTERISTICS.INT: 
                    index = 3; 
                    break;
                case ENUM_CHARACTERISTICS.EDU: 
                    index = 4; 
                    break;
                case ENUM_CHARACTERISTICS.TRA: 
                    index = 4; 
                    break;
                case ENUM_CHARACTERISTICS.INS: 
                    index = 4; 
                    break;
                case ENUM_CHARACTERISTICS.SOC: 
                    index = 5; 
                    break;
                case ENUM_CHARACTERISTICS.CHA: 
                    index = 5; 
                    break;
                case ENUM_CHARACTERISTICS.CAS: 
                    index = 5; 
                    break;
            }
        }
        characteristics[index].value += amount;
        return (amount > 0 ? "Increased " : "Decreased ")+ characteristics[index].name + " by " + amount;
    }
    function decreaseCharacteristic(characteristic, amount){
        if(typeof amount == "undefined"){ amount = 1;}
        return gainCharacteristic(characteristic,-amount);
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
        if(numReducedToZero >= 3){ remarks += "Extremely major illness. Requires 4 months rest and recuperation. If 2nd time receiving this event, character has died." ;}
        else if(numReducedToZero === 2){ remarks += "Major illness. Requires 4 weeks rest and recuperation.";}
        return remarks;
    }
    function advanceAge(numYears){
        var prefix = "Age increased from " + age;
        var remarks = "";
        if(typeof numYears === "undefined"){ numYears = 1;}
        var peakStart = species.getFirstYearOfStage( isForcedGrowthClone ? 4 : 5);
        for(var i = 0; i < numYears; i++){
            age += 1;
            if(age >= peakStart){
                if((age - peakStart) % 4 === 0){
                    remarks += "<br/>"+agingCheck();
                }
            }
        }
        
        prefix += " to " + age + ". ";
        setAge(age);
        return prefix + remarks; 
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
            if(typeof degrees[i].knowledge == "undefined"){
                labels.push(degrees[i].skill);
            }else{
                labels.push(degrees[i].skill+"("+degrees[i].knowledge+")");
            }
        }
        return labels;
    }
    return {
        isForcedGrowthClone:isForcedGrowthClone,
        gender:genderKey, characteristics:characteristics,
        skills:skills, getGenetics:getGenetics, species:species,
        setAge:setAge, getAge:getAge, getnativeLanguage:getNativeLanguage, setNativeLanguage:setNativeLanguage, 
        setForcedGrowthClone:setForcedGrowthClone, rollStatsFromGenes:rollStatsFromGenes,
        getAwards:getAwards, getMajorsLabels:getMajorsLabels, getMinorsLabels:getMinorsLabels, getMajors:getMajors, getMinors:getMinors,
        checkCharacteristic:checkCharacteristic, checkCSK:checkCSK,
        gainKnowledge:gainKnowledge, gainSkill:gainSkill, gainLanguage:gainLanguage,
        gainSkillOrKnowledge: gainSkillOrKnowledge, gainSkillsFromHomeworldTradeCodes:gainSkillsFromHomeworldTradeCodes,
        gainCharacteristic:gainCharacteristic, decreaseCharacteristic:decreaseCharacteristic,
        advanceAge:advanceAge, promptEducationWaiver:promptEducationWaiver,
        Apprenticeship:Apprenticeship, ED5:ED5, TradeSchool:TradeSchool, 
        College:College, University:University, Masters:Masters, 
        Professors:Professors, MedicalSchool:MedicalSchool, LawSchool:LawSchool,
        NavalAcademy:NavalAcademy, MilitaryAcademy:MilitaryAcademy,
    }
}