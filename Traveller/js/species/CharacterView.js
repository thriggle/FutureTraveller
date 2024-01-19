import { human } from "./human.js";
import { getRollerFromSeed } from "../rnd.js";
import { createCharacter } from "../character.js";
import { ENUM_SKILLS, Knowledges } from "./skills.js";
import { ENUM_CHARACTERISTICS } from "./species.js";
import { renderCharacter, clearElement } from "./character_renderer.js";
import { dialogCallback, getDialog, pickOption, pickSkill } from "./dialog.js";


var roller = getRollerFromSeed("2"), person;
//document.getElementById("txtHomeworldTradeCodes").value = getRandomTradeCodes();
newCharacter(); 
document.getElementById("btnReset").addEventListener("click",newCharacter);
document.getElementById("btnRandomHWTCs").addEventListener("click",function(){
    document.getElementById("txtHomeworldTradeCodes").value = getRandomTradeCodes();
})
document.getElementById("btnED5").addEventListener("click",()=>{log(person.ED5()); document.getElementById("btnED5").setAttribute("disabled",true); redraw(); });
document.getElementById("btnApprenticeship").addEventListener("click",function(){
    pickSkill("S", "Please choose a skill for your apprenticeship",
    function(choice){
        document.getElementById("btnApprenticeship").setAttribute("disabled",true);
        var selectedSkill = choice.skill;
        var selectedKnowledge = choice.knowledge;
        if(selectedKnowledge === "undefined"){ selectedKnowledge = undefined;}
        if(choice.skill === ENUM_SKILLS.Language){
            pickOption(Knowledges[ENUM_SKILLS.Language], "Choose a language.", (lang)=>{
                log(person.Apprenticeship(selectedSkill, lang));
            });
        }else{
            log(person.Apprenticeship(selectedSkill,selectedKnowledge));
        }
    });
});
document.getElementById("btnTradeSchool").addEventListener("click",function(){
    pickSkill("S", "Please choose a skill for your Trade School",
    function(choice){
        var selectedSkill = choice.skill;
        var selectedKnowledge = choice.knowledge;
        if(selectedKnowledge === "undefined"){ selectedKnowledge = undefined;}
        if(selectedSkill === ENUM_SKILLS.Language){
            pickOption(Knowledges[ENUM_SKILLS.Language], "Choose a language.", (lang)=>{
                log(person.TradeSchool(selectedSkill, lang));
                redraw();
            });
        }else{
            log(person.TradeSchool(selectedSkill,selectedKnowledge));
        }
    });
});
document.getElementById("btnMedicalSchool").addEventListener("click",function(){
    pickSkill("Medical", "Please choose a major for Medical School",
    function(choice){
        var selectedSkill = choice.skill;
        var selectedKnowledge = choice.knowledge;
        if(selectedKnowledge === "undefined"){ selectedKnowledge = undefined;}
        if(selectedSkill === ENUM_SKILLS.Language){
            pickOption(Knowledges[ENUM_SKILLS.Language], "Choose a language.", (lang)=>{
                log(person.MedicalSchool(selectedSkill, lang));
                redraw();
            });
        }else{
            log(person.MedicalSchool(selectedSkill,selectedKnowledge));
        }
    });
});
document.getElementById("btnLawSchool").addEventListener("click",function(){
    pickSkill("Law", "Please choose a major for Law School",
    function(choice){
        var selectedSkill = choice.skill;
        var selectedKnowledge = choice.knowledge;
        if(selectedKnowledge === "undefined"){ selectedKnowledge = undefined;}
        if(selectedSkill === ENUM_SKILLS.Language){
            pickOption(Knowledges[ENUM_SKILLS.Language], "Choose a language.", (lang)=>{
                log(person.LawSchool(selectedSkill, lang));
                redraw();
            });
        }else{
            log(person.LawSchool(selectedSkill,selectedKnowledge));
        }
    });
});
document.getElementById("btnCollege").addEventListener("click",function(){
    pickSkill("C", "Please choose a Major",
    function(choice){
        var MajorSkill = choice.skill;
        var MajorKnowledge = choice.knowledge;
        if(MajorKnowledge === "undefined"){ MajorKnowledge = undefined;}
        if(MajorSkill === ENUM_SKILLS.Language){
            pickOption(Knowledges[ENUM_SKILLS.Language], "Choose a language.", (lang)=>{
                MajorKnowledge = lang;
                pickSkill("C", "Please choose a Minor",
                function(minorChoice){
                    var MinorSkill = minorChoice.skill;
                    var MinorKnowledge = minorChoice.knowledge;
                    if(MinorKnowledge === "undefined"){ MinorKnowledge = undefined;}
                    if(MinorSkill === ENUM_SKILLS.Language){
                        pickOption(Knowledges[ENUM_SKILLS.Language], "Choose a language.", (lang)=>{
                            MinorKnowledge = lang;
                            log(person.College(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge, log));
                        });
                    }else{
                        log(person.College(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge, log));
                        
                    }
                },choice); 
            });
        }else{
            pickSkill("C", "Please choose a Minor",
                function(minorChoice){
                    var MinorSkill = minorChoice.skill;
                    var MinorKnowledge = minorChoice.knowledge;
                    if(MinorKnowledge === "undefined"){ MinorKnowledge = undefined;}
                    if(MinorSkill === ENUM_SKILLS.Language){
                        pickOption(Knowledges[ENUM_SKILLS.Language], "Choose a language.", (lang)=>{
                            MinorKnowledge = lang;
                            log(person.College(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge, log));
                            
                        });
                    }else{
                        log(person.College(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge, log));
                        
                    }
                },choice); 
        }
    });
});
document.getElementById("btnNavalAcademy").addEventListener("click",function(){
    pickSkill("N", "Please choose a Major for Navy Academy",
    function(choice){
        var MajorSkill = choice.skill;
        var MajorKnowledge = choice.knowledge;
        if(MajorKnowledge === "undefined"){ MajorKnowledge = undefined;}
        if(MajorSkill === ENUM_SKILLS.Language){
            pickOption(Knowledges[ENUM_SKILLS.Language], "Choose a language.", (lang)=>{
                MajorKnowledge = lang;
                pickSkill("N", "Please choose a Minor",
                function(minorChoice){
                    var MinorSkill = minorChoice.skill;
                    var MinorKnowledge = minorChoice.knowledge;
                    if(MinorKnowledge === "undefined"){ MinorKnowledge = undefined;}
                    if(MinorSkill === ENUM_SKILLS.Language){
                        pickOption(Knowledges[ENUM_SKILLS.Language], "Choose a language.", (lang)=>{
                            MinorKnowledge = lang;
                            log(person.NavalAcademy(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge, log));
                        });
                    }else{
                        log(person.NavalAcademy(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge, log));
                        
                    }
                },choice); 
            });
        }else{
            pickSkill("N", "Please choose a Minor",
                function(minorChoice){
                    var MinorSkill = minorChoice.skill;
                    var MinorKnowledge = minorChoice.knowledge;
                    if(MinorKnowledge === "undefined"){ MinorKnowledge = undefined;}
                    if(MinorSkill === ENUM_SKILLS.Language){
                        pickOption(Knowledges[ENUM_SKILLS.Language], "Choose a language.", (lang)=>{
                            MinorKnowledge = lang;
                            log(person.NavalAcademy(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge, log));
                            
                        });
                    }else{
                        log(person.NavalAcademy(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge, log));
                        
                    }
                },choice); 
        }
    });
});
document.getElementById("btnMilitaryAcademy").addEventListener("click",function(){
    pickSkill("A", "Please choose a Major for Military Academy",
    function(choice){
        var MajorSkill = choice.skill;
        var MajorKnowledge = choice.knowledge;
        if(MajorKnowledge === "undefined"){ MajorKnowledge = undefined;}
        if(MajorSkill === ENUM_SKILLS.Language){
            pickOption(Knowledges[ENUM_SKILLS.Language], "Choose a language.", (lang)=>{
                MajorKnowledge = lang;
                pickSkill("A", "Please choose a Minor",
                function(minorChoice){
                    var MinorSkill = minorChoice.skill;
                    var MinorKnowledge = minorChoice.knowledge;
                    if(MinorKnowledge === "undefined"){ MinorKnowledge = undefined;}
                    if(MinorSkill === ENUM_SKILLS.Language){
                        pickOption(Knowledges[ENUM_SKILLS.Language], "Choose a language.", (lang)=>{
                            MinorKnowledge = lang;
                            log(person.MilitaryAcademy(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge, log));
                        });
                    }else{
                        log(person.MilitaryAcademy(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge, log));
                        
                    }
                },choice); 
            });
        }else{
            pickSkill("A", "Please choose a Minor",
                function(minorChoice){
                    var MinorSkill = minorChoice.skill;
                    var MinorKnowledge = minorChoice.knowledge;
                    if(MinorKnowledge === "undefined"){ MinorKnowledge = undefined;}
                    if(MinorSkill === ENUM_SKILLS.Language){
                        pickOption(Knowledges[ENUM_SKILLS.Language], "Choose a language.", (lang)=>{
                            MinorKnowledge = lang;
                            log(person.MilitaryAcademy(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge, log));
                            
                        });
                    }else{
                        log(person.MilitaryAcademy(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge, log));
                        
                    }
                },choice); 
        }
    });
});
document.getElementById("btnUniversity").addEventListener("click",function(){
    pickSkill("C", "Please choose a Major",
    function(choice){
        var MajorSkill = choice.skill;
        var MajorKnowledge = choice.knowledge;
        if(MajorKnowledge === "undefined"){ MajorKnowledge = undefined;}
        if(MajorSkill === ENUM_SKILLS.Language){
            pickOption(Knowledges[ENUM_SKILLS.Language], "Choose a language.", (lang)=>{
                MajorKnowledge = lang;
                pickSkill("C", "Please choose a Minor",
                function(minorChoice){
                    var MinorSkill = minorChoice.skill;
                    var MinorKnowledge = minorChoice.knowledge;
                    if(MinorKnowledge === "undefined"){ MinorKnowledge = undefined;}
                    if(MinorSkill === ENUM_SKILLS.Language){
                        pickOption(Knowledges[ENUM_SKILLS.Language], "Choose a language.", (lang)=>{
                            MinorKnowledge = lang;
                            log(person.University(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge, log));
                            
                        });
                    }else{
                        log(person.University(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge, log));
                        
                    }
                },choice); 
            });
        }else{
            pickSkill("C", "Please choose a Minor",
                function(minorChoice){
                    var MinorSkill = minorChoice.skill;
                    var MinorKnowledge = minorChoice.knowledge;
                    if(MinorKnowledge === "undefined"){ MinorKnowledge = undefined;}
                    if(MinorSkill === ENUM_SKILLS.Language){
                        pickOption(Knowledges[ENUM_SKILLS.Language], "Choose a language.", (lang)=>{
                            MinorKnowledge = lang;
                            log(person.University(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge, log));
                            
                        });
                    }else{
                        log(person.University(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge, log));
                        
                    }
                },choice); 
        }
    });
});
document.getElementById("btnMasters").addEventListener("click",function(){
    var majors = person.getMajors(), minors = person.getMinors(), preferredMajor = undefined, preferredMinor = undefined;
    if(majors.length > 0){
        preferredMajor = majors[majors.length-1];
    }
    if(minors.length > 0){
        preferredMinor = minors[minors.length-1];
    }
    pickSkill("C", "Please choose a Major",
    function(choice){
        var MajorSkill = choice.skill;
        var MajorKnowledge = choice.knowledge;
        if(MajorKnowledge === "undefined"){ MajorKnowledge = undefined;}
        if(MajorSkill === ENUM_SKILLS.Language){
            pickOption(Knowledges[ENUM_SKILLS.Language], "Choose a language.", (lang)=>{
                MajorKnowledge = lang;
                pickSkill("C", "Please choose a Minor",
                function(minorChoice){
                    var MinorSkill = minorChoice.skill;
                    var MinorKnowledge = minorChoice.knowledge;
                    if(MinorKnowledge === "undefined"){ MinorKnowledge = undefined;}
                    if(MinorSkill === ENUM_SKILLS.Language){
                        pickOption(Knowledges[ENUM_SKILLS.Language], "Choose a language.", (lang)=>{
                            MinorKnowledge = lang;
                            log(person.Masters(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge, log));
                            
                        });
                    }else{
                        log(person.Masters(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge, log));
                        
                    }
                },choice,preferredMinor); 
            });
        }else{
            pickSkill("C", "Please choose a Minor",
            function(minorChoice){
                var MinorSkill = minorChoice.skill;
                var MinorKnowledge = minorChoice.knowledge;
                if(MinorKnowledge === "undefined"){ MinorKnowledge = undefined;}
                if(MinorSkill === ENUM_SKILLS.Language){
                        pickOption(Knowledges[ENUM_SKILLS.Language], "Choose a language.", (lang)=>{
                            MinorKnowledge = lang;
                            log(person.Masters(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge, log));
                            
                        });
                    }else{
                        log(person.Masters(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge, log));
                        
                    }
                },choice,preferredMinor); 
        }
    },undefined,preferredMajor);
});
document.getElementById("btnProfessors").addEventListener("click",function(){
    var majors = person.getMajors(), minors = person.getMinors(), preferredMajor = undefined, preferredMinor = undefined;
    if(majors.length > 0){
        preferredMajor = majors[majors.length-1];
    }
    if(minors.length > 0){
        preferredMinor = minors[minors.length-1];
    }
    pickSkill("C", "Please choose a Major",
    function(choice){
        var MajorSkill = choice.skill;
        var MajorKnowledge = choice.knowledge;
        if(MajorKnowledge === "undefined"){ MajorKnowledge = undefined;}
        if(MajorSkill === ENUM_SKILLS.Language){
            pickOption(Knowledges[ENUM_SKILLS.Language], "Choose a language.", (lang)=>{
                MajorKnowledge = lang;
                pickSkill("C", "Please choose a Minor",
                function(minorChoice){
                    var MinorSkill = minorChoice.skill;
                    var MinorKnowledge = minorChoice.knowledge;
                    if(MinorKnowledge === "undefined"){ MinorKnowledge = undefined;}
                    if(MinorSkill === ENUM_SKILLS.Language){
                        pickOption(Knowledges[ENUM_SKILLS.Language], "Choose a language.", (lang)=>{
                            MinorKnowledge = lang;
                            log(person.Professors(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge));
                            
                        });
                    }else{
                        log(person.Professors(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge));
                        
                    }
                },choice,preferredMinor); 
            });
        }else{
            pickSkill("C", "Please choose a Minor",
            function(minorChoice){
                var MinorSkill = minorChoice.skill;
                var MinorKnowledge = minorChoice.knowledge;
                if(MinorKnowledge === "undefined"){ MinorKnowledge = undefined;}
                if(MinorSkill === ENUM_SKILLS.Language){
                        pickOption(Knowledges[ENUM_SKILLS.Language], "Choose a language.", (lang)=>{
                            MinorKnowledge = lang;
                            log(person.Professors(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge));
                            
                        });
                    }else{
                        log(person.Professors(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge));
                        
                    }
                },choice,preferredMinor); 
        }
    },undefined,preferredMajor);
});
function newCharacter(){
    clear();
    person = createCharacter(roller, human);
    var isForcedGrowthClone = document.getElementById("isForcedGrowthClone").getAttribute("checked");
    if(isForcedGrowthClone) { person.setForcedGrowthClone(true);}
    var genes = [
        document.getElementById("slctGeneticC1").value,
        document.getElementById("slctGeneticC2").value,
        document.getElementById("slctGeneticC3").value,
        document.getElementById("slctGeneticC4").value,
        document.getElementById("slctGeneticC5").value,
    ]
    
    person.rollStatsFromGenes(genes);
    log("Initial UPP: "+ person.characteristics[0].value + "," +  person.characteristics[1].value + "," + person.characteristics[2].value + "," + 
    person.characteristics[3].value + "," + person.characteristics[4].value + "," + person.characteristics[5].value
    );
    log(person.setNativeLanguage(document.getElementById("slctNativeLanguage").value));
    log(person.advanceAge(human.getFirstYearOfStage(3)));
    log(person.gainSkillsFromHomeworldTradeCodes(document.getElementById("txtHomeworldTradeCodes").value, log));
    renderCharacter(person, document.body);
    enableControls();
}
function enableControls(){
    var buttons = document.querySelectorAll("[data-educationbtn]");
    for(var i = 0, len = buttons.length; i < len; i++){
        buttons[i].removeAttribute("disabled");
    }
}
function redraw(){
    renderCharacter(person, document.body);
}

function log(msg){
    if(typeof msg !== "undefined"){

        document.getElementById("history").insertAdjacentHTML("beforeend","<div>"+msg.replace(/\_/g,"<br/>")+"<hr/></div>");
        redraw();
    }
}
function clear(){
    clearElement(document.getElementById("history"));
}
function getRandomTradeCodes() {
    var classifications1 = [
        ["Ba De","De He Po","Di Fl Oc", "Hi Ic In Va","Ba De He","De He Hi In Na Po"],
        ["Ba He", "De Hi In", "As Ba Va", "He Na Po Pi", "De Hi Pr", "De He Hi In Po"],
        ["Di He", "Ba He Po", "Ba Fl He", "De Na Po Pi", "Di Ic Va", "De He Na Ni Po"],
        ["De Pi", "Fl Oc Ph", "De Di Po", "He Na Ni Po", "De He Hi", "He Hi In Na Po"],
        ["Ba Fl", "Fl Hi Oc", "De Ph Ri", "Ba De He Po", "Na Ph Pi Va", "De Hi In Na Po"],
        ["Di", "De He Lo", "Fl Ph Wa", "De Di He Po", "Hi In Na Va", "Hi Ic In Na Va"],
        ["Ag", "Oc Ph Pi", "Fl Hi Wa", "Ic Na Ph Pi", "Fl He Ni", "As Hi In Na Va"],
        ["Ri", "Ph Wa", "Na Pi", "He Ni", "Hi Po", "Ni Oc"],
        ["Hi In", "Fl Ni", "Ni Pa", "Hi In", "Ic Va", "Fl Lo"],
        ["Ni", "Ga", "Va", "Po", "De Lo", "Ri"],
        ["","","","","",""],
        ["Lo", "Ph","Wa","Pi","Ic","Fl"],
        ["Hi In", "Lo Wa", "Ni Va", "Ag Pi", "De Po", "Lo Va"],
        ["Po", "Hi Pr", "Na Ni", "Pa Ph", "Ph Po", "Ri Wa"],
        ["Na", "Hi In Oc", "Ph Pi Po", "Hi Ic In Na", "Ag Ga Ni Ri", "As Na Ph Pi Va"],
        ["Ba", "De Po Ph", "Hi In Po", "Ga Pa Ph Ri", "As Na Ni Va", "Ic Na Ph Pi Va"],
        ["Lo Oc", "De Ni Ri", "De Ni Pr", "De Na Ni Po", "Ba De Po", "De Na Ph Pi Po"],
        ["Di Fl", "De Hi Po", "Oc Ph Ri", "Ic Na Pi Va", "De He Ph", "He Na Ph Pi Po"],
        ["Ba Oc", "Di He Po", "Di Fl He", "Ag Ga Ni Pr", "Hi Oc Pr", "De He Na Pi Po"],
        ["Di Oc", "De He Pi", "As Di Va", "As Na Pi Va", "Ic Ba Va", "De He Ph Pi Po"],
        ["De Di", "De Ph Pi", "Ba Fl Oc", "Ic Na Ni Va", "De Di He", "De He Na Ph Pi Po"]
    ];
    var classifications2 = [
        ["De Ph","Ni Oc Pr","Pa Ph Ri","Oc Pi","Fl Oc","De He Ph Pi"],
        ["Oc Ph","Na Po Pi","De Lo Po","As Va","Di Wa","De He Po Pi"],
        ["Ic Ba","Ni Oc Ri","Ni Ri Wa","Hi In Na","Pi Po","Na Po Ph Pi"],
        ["Ic Di","Fl Lo Wa","Hi Pr Wa","Na Ni Po","Oc Ri","Hi In Na Po"],
        ["Ba Po","De Pi Po","Fl Ni Oc","Ag Ga Ri","Ic Lo Va","De Hi In Po"],
        ["Di Po","He Ph Pi","Ic Na Pi","Ic Na Ni","Ag Ni Pr","De Hi Na Po"],
        ["Ba Ga","He Hi In","Fl He Lo","Ri Ph Wa","As Ni Va","Ic Ph Pi Va"],
        ["Di Ga","Fl He Ph","Na Ph Pi","Fl He Ni","De Ni Po","Ri Ph"],
        ["Na Po","Ic Lo","Fl Ph","Ic Pi","Fl He","Ic Ni"],
        ["He Pi","Ag Ri","Ni Ri","Ni Wa","Ag Ga","Ag"],
        ["","","","","",""],
        ["Ba","Di","De","He","Oc","Hi"],
        ["Lo Po","Fl Hi","Pi Wa","De Ni","He Lo","Ni Po"],
        ["Ga Lo","Ag Ni","Ph Pi","Hi Wa","Hi Ga","Ni Pr"],
        ["Fl Wa","Hi Ic In","He Lo Po","Fl He Hi","Ag Ni Ri","He Hi In Po"],
        ["Ba Va","Fl Lo Oc","Ag Ga Ni","Ga Hi Pr","Pa Ph Pi","He Ph Pi Po"],
        ["Di Va","Fl Ni Wa","Ga Ni Pa","De Na Po","Ic Ni Va","De Na Ph Po"],
        ["De Hi","Na Ph Po","Ni Pr Wa","De He Ni","As Lo Va","De Ph Pi Po"],
        ["De He","He Pi Po","Na Pi Va","Ga Pa Ph","Na Ni Va","De He Ni Po"],
        ["De Ri","Ic Pi Va","Ph Pi Wa","Ic Ph Pi","He Ni Po","De He Lo Po"],
        ["Hi Oc","Hi Na Po","Hi In Wa","He Po","Ba Wa","De He Hi In"]
    ];
    var table = roller.d6(1).result <=3 ? classifications1 : classifications2;
    var row = roller.d6(4).result - 4;
    var column = roller.d6(1).result - 1;
    return table[row][column]
}

