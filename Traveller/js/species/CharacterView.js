import { human } from "./human.js";
import { getRollerFromSeed } from "../rnd.js";
import { createCharacter } from "../character.js";
import { ENUM_SKILLS, Knowledges } from "./skills.js";
import { ENUM_CHARACTERISTICS } from "./species.js";
import { renderCharacter, clearElement } from "./character_renderer.js";
import { dialogCallback, getDialog, pickOption, pickSkill } from "./dialog.js";


var roller = getRollerFromSeed(), person;
newCharacter(); 
document.getElementById("btnReset").addEventListener("click",newCharacter);
document.getElementById("btnSetLanguage").addEventListener("click",()=>{
    pickOption(Knowledges[ENUM_SKILLS.Language], "Choose a language.", (lang)=>{
        log(person.setNativeLanguage(lang));
    });
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
                            log(person.Masters(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge, log));
                            
                        });
                    }else{
                        log(person.Masters(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge, log));
                        
                    }
                },choice); 
        }
    });
});
document.getElementById("btnProfessors").addEventListener("click",function(){
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
                            log(person.Professors(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge));
                            
                        });
                    }else{
                        log(person.Professors(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge));
                        
                    }
                },choice); 
        }
    });
});
function newCharacter(){
    clear();
    person = createCharacter(roller, human);
    
    log("Initial UPP: "+ person.characteristics[0].value + "," +  person.characteristics[1].value + "," + person.characteristics[2].value + "," + 
        person.characteristics[3].value + "," + person.characteristics[4].value + "," + person.characteristics[5].value
    );
    log(person.advanceAge(human.getFirstYearOfStage(3)));
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
    document.getElementById("history").insertAdjacentHTML("beforeend","<div>"+msg.replace(/\_/g,"<br/>")+"<hr/></div>");
    redraw();
}
function clear(){
    clearElement(document.getElementById("history"));
}


