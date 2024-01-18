import { human } from "./human.js";
import { getRollerFromSeed } from "../rnd.js";
import { createCharacter } from "../character.js";
import { ENUM_SKILLS, Knowledges } from "./skills.js";
import { ENUM_CHARACTERISTICS } from "./species.js";
import { renderCharacter, clearElement } from "./character_renderer.js";


var dialog = document.body.appendChild(document.createElement("dialog")); dialog.id = "dialog";
var dialogCallback = () => {};
var dialogText = dialog.appendChild(document.createElement("div"));
var selector = dialog.appendChild(document.createElement("select")); selector.id = "slctDialog";
var dlgBtn = dialog.appendChild(document.createElement("input")); dlgBtn.setAttribute("type","button"); dlgBtn.setAttribute("value","OK"); dlgBtn.id = "dlgBtn";
dlgBtn.addEventListener("click",function(){
    dialog.close(selector.value);
    dialogCallback(selector.value);
});
var cancelDlgBtn = dialog.appendChild(document.createElement("input")); cancelDlgBtn.setAttribute("type","button"); cancelDlgBtn.setAttribute("value","Cancel"); cancelDlgBtn.id = "cancelDlgBtn";
cancelDlgBtn.addEventListener("click",function(){
    dialog.close(false);
});
var roller = getRollerFromSeed(), person;
newCharacter(); 
document.getElementById("btnReset").addEventListener("click",newCharacter);
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
document.getElementById("btnED5").addEventListener("click",()=>{log(person.ED5()); document.getElementById("btnED5").setAttribute("disabled",true); redraw(); });
document.getElementById("btnApprenticeship").addEventListener("click",function(){
    document.getElementById("btnApprenticeship").setAttribute("disabled",true);
    pickSkill("S", "Please choose a skill for your apprenticeship",
    function(){
        var option = selector.options[selector.selectedIndex];
        var selectedSkill = option.getAttribute("data-skill");
        var selectedKnowledge = option.getAttribute("data-knowledge");
        if(selectedKnowledge === "undefined"){ selectedKnowledge = undefined;}
        if(option.getAttribute("data-skill") === ENUM_SKILLS.Language){
            pickOption(Knowledges[ENUM_SKILLS.Language], "Choose a language.", (lang)=>{
                log(person.Apprenticeship(selectedSkill, lang));
                redraw();
            });
        }else{
            log(person.Apprenticeship(selectedSkill,selectedKnowledge));
        }
        redraw();
    });
});
document.getElementById("btnTradeSchool").addEventListener("click",function(){
    pickSkill("S", "Please choose a skill for your Trade School",
    function(){
        var option = selector.options[selector.selectedIndex];
        var selectedSkill = option.getAttribute("data-skill");
        var selectedKnowledge = option.getAttribute("data-knowledge");
        if(selectedKnowledge === "undefined"){ selectedKnowledge = undefined;}
        if(option.getAttribute("data-skill") === ENUM_SKILLS.Language){
            pickOption(Knowledges[ENUM_SKILLS.Language], "Choose a language.", (lang)=>{
                log(person.TradeSchool(selectedSkill, lang));
                redraw();
            });
        }else{
            log(person.TradeSchool(selectedSkill,selectedKnowledge));
        }
        redraw();
    });
});
document.getElementById("btnCollege").addEventListener("click",function(){
    pickSkill("C", "Please choose a Major",
    function(){
        var option = selector.options[selector.selectedIndex];
        var MajorSkill = option.getAttribute("data-skill");
        var MajorKnowledge = option.getAttribute("data-knowledge");
        if(MajorKnowledge === "undefined"){ MajorKnowledge = undefined;}
        if(option.getAttribute("data-skill") === ENUM_SKILLS.Language){
            pickOption(Knowledges[ENUM_SKILLS.Language], "Choose a language.", (lang)=>{
                MajorKnowledge = lang;
                pickSkill("C", "Please choose a Minor",
                function(){
                    var option = selector.options[selector.selectedIndex];
                    var MinorSkill = option.getAttribute("data-skill");
                    var MinorKnowledge = option.getAttribute("data-knowledge");
                    if(MinorKnowledge === "undefined"){ MinorKnowledge = undefined;}
                    if(option.getAttribute("data-skill") === ENUM_SKILLS.Language){
                        pickOption(Knowledges[ENUM_SKILLS.Language], "Choose a language.", (lang)=>{
                            MinorKnowledge = lang;
                            log(person.College(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge));
                            redraw();
                        });
                    }else{
                        log(person.College(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge));
                        redraw();
                    }
                }); 
            });
        }else{
            pickSkill("C", "Please choose a Minor",
                function(){
                    var option = selector.options[selector.selectedIndex];
                    var MinorSkill = option.getAttribute("data-skill");
                    var MinorKnowledge = option.getAttribute("data-knowledge");
                    if(MinorKnowledge === "undefined"){ MinorKnowledge = undefined;}
                    if(option.getAttribute("data-skill") === ENUM_SKILLS.Language){
                        pickOption(Knowledges[ENUM_SKILLS.Language], "Choose a language.", (lang)=>{
                            MinorKnowledge = lang;
                            log(person.College(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge));
                            redraw();
                        });
                    }else{
                        log(person.College(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge));
                        redraw();
                    }
                }); 
        }
    });
});
document.getElementById("btnUniversity").addEventListener("click",function(){
    pickSkill("C", "Please choose a Major",
    function(){
        var option = selector.options[selector.selectedIndex];
        var MajorSkill = option.getAttribute("data-skill");
        var MajorKnowledge = option.getAttribute("data-knowledge");
        if(MajorKnowledge === "undefined"){ MajorKnowledge = undefined;}
        if(option.getAttribute("data-skill") === ENUM_SKILLS.Language){
            pickOption(Knowledges[ENUM_SKILLS.Language], "Choose a language.", (lang)=>{
                MajorKnowledge = lang;
                pickSkill("C", "Please choose a Minor",
                function(){
                    var option = selector.options[selector.selectedIndex];
                    var MinorSkill = option.getAttribute("data-skill");
                    var MinorKnowledge = option.getAttribute("data-knowledge");
                    if(MinorKnowledge === "undefined"){ MinorKnowledge = undefined;}
                    if(option.getAttribute("data-skill") === ENUM_SKILLS.Language){
                        pickOption(Knowledges[ENUM_SKILLS.Language], "Choose a language.", (lang)=>{
                            MinorKnowledge = lang;
                            log(person.University(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge));
                            redraw();
                        });
                    }else{
                        log(person.University(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge));
                        redraw();
                    }
                }); 
            });
        }else{
            pickSkill("C", "Please choose a Minor",
                function(){
                    var option = selector.options[selector.selectedIndex];
                    var MinorSkill = option.getAttribute("data-skill");
                    var MinorKnowledge = option.getAttribute("data-knowledge");
                    if(MinorKnowledge === "undefined"){ MinorKnowledge = undefined;}
                    if(option.getAttribute("data-skill") === ENUM_SKILLS.Language){
                        pickOption(Knowledges[ENUM_SKILLS.Language], "Choose a language.", (lang)=>{
                            MinorKnowledge = lang;
                            log(person.University(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge));
                            redraw();
                        });
                    }else{
                        log(person.University(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge));
                        redraw();
                    }
                }); 
        }
    });
});
document.getElementById("btnMasters").addEventListener("click",function(){
    pickSkill("C", "Please choose a Major",
    function(){
        var option = selector.options[selector.selectedIndex];
        var MajorSkill = option.getAttribute("data-skill");
        var MajorKnowledge = option.getAttribute("data-knowledge");
        if(MajorKnowledge === "undefined"){ MajorKnowledge = undefined;}
        if(option.getAttribute("data-skill") === ENUM_SKILLS.Language){
            pickOption(Knowledges[ENUM_SKILLS.Language], "Choose a language.", (lang)=>{
                MajorKnowledge = lang;
                pickSkill("C", "Please choose a Minor",
                function(){
                    var option = selector.options[selector.selectedIndex];
                    var MinorSkill = option.getAttribute("data-skill");
                    var MinorKnowledge = option.getAttribute("data-knowledge");
                    if(MinorKnowledge === "undefined"){ MinorKnowledge = undefined;}
                    if(option.getAttribute("data-skill") === ENUM_SKILLS.Language){
                        pickOption(Knowledges[ENUM_SKILLS.Language], "Choose a language.", (lang)=>{
                            MinorKnowledge = lang;
                            log(person.Masters(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge));
                            redraw();
                        });
                    }else{
                        log(person.Masters(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge));
                        redraw();
                    }
                }); 
            });
        }else{
            pickSkill("C", "Please choose a Minor",
                function(){
                    var option = selector.options[selector.selectedIndex];
                    var MinorSkill = option.getAttribute("data-skill");
                    var MinorKnowledge = option.getAttribute("data-knowledge");
                    if(MinorKnowledge === "undefined"){ MinorKnowledge = undefined;}
                    if(option.getAttribute("data-skill") === ENUM_SKILLS.Language){
                        pickOption(Knowledges[ENUM_SKILLS.Language], "Choose a language.", (lang)=>{
                            MinorKnowledge = lang;
                            log(person.Masters(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge));
                            redraw();
                        });
                    }else{
                        log(person.Masters(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge));
                        redraw();
                    }
                }); 
        }
    });
});
document.getElementById("btnProfessors").addEventListener("click",function(){
    pickSkill("C", "Please choose a Major",
    function(){
        var option = selector.options[selector.selectedIndex];
        var MajorSkill = option.getAttribute("data-skill");
        var MajorKnowledge = option.getAttribute("data-knowledge");
        if(MajorKnowledge === "undefined"){ MajorKnowledge = undefined;}
        if(option.getAttribute("data-skill") === ENUM_SKILLS.Language){
            pickOption(Knowledges[ENUM_SKILLS.Language], "Choose a language.", (lang)=>{
                MajorKnowledge = lang;
                pickSkill("C", "Please choose a Minor",
                function(){
                    var option = selector.options[selector.selectedIndex];
                    var MinorSkill = option.getAttribute("data-skill");
                    var MinorKnowledge = option.getAttribute("data-knowledge");
                    if(MinorKnowledge === "undefined"){ MinorKnowledge = undefined;}
                    if(option.getAttribute("data-skill") === ENUM_SKILLS.Language){
                        pickOption(Knowledges[ENUM_SKILLS.Language], "Choose a language.", (lang)=>{
                            MinorKnowledge = lang;
                            log(person.Professors(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge));
                            redraw();
                        });
                    }else{
                        log(person.Professors(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge));
                        redraw();
                    }
                }); 
            });
        }else{
            pickSkill("C", "Please choose a Minor",
                function(){
                    var option = selector.options[selector.selectedIndex];
                    var MinorSkill = option.getAttribute("data-skill");
                    var MinorKnowledge = option.getAttribute("data-knowledge");
                    if(MinorKnowledge === "undefined"){ MinorKnowledge = undefined;}
                    if(option.getAttribute("data-skill") === ENUM_SKILLS.Language){
                        pickOption(Knowledges[ENUM_SKILLS.Language], "Choose a language.", (lang)=>{
                            MinorKnowledge = lang;
                            log(person.Professors(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge));
                            redraw();
                        });
                    }else{
                        log(person.Professors(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge));
                        redraw();
                    }
                }); 
        }
    });
});
function pickOption(choices,prompt,callback){
    clearElement(selector); 
    clearElement(dialogText);
    dialogText.insertAdjacentHTML("beforeend","<span>"+prompt+"</span>");
    for(var i = 0, len = choices.length; i < len; i++){
        var option = selector.appendChild(document.createElement("option"));
        option.value = choices[i];
        option.innerHTML = choices[i];
    }
    dialogCallback = function(){ callback(selector.value); };
    dialog.showModal();
}
function pickSkill(category, prompt, callback){
    var skills = [];
    switch(category){
        case "S":
        skills = [
            {name:"Admin",skill:"Admin",knowledge:undefined},
            {name:"Comms",skill:"Comms",knowledge:undefined},
            {name:"Computer",skill:"Computer",knowledge:undefined},
            {name:"Explosives",skill:"Explosives",knowledge:undefined},
            {name:"High-G",skill:"High-G",knowledge:undefined},
            {name:"Hostile Env",skill:"Hostile Env",knowledge:undefined},
            {name:"Language",skill:"Language",knowledge:undefined},
            {name:"Survey",skill:"Survey",knowledge:undefined},
            {name:"Survival",skill:"Survival",knowledge:undefined},
            {name:"Tactics",skill:"Tactics",knowledge:undefined},
            {name:"Trader",skill:"Trader",knowledge:undefined},
            {name:"Vacc Suit",skill:"Vacc Suit",knowledge:undefined},
            {name:"Zero-G",skill:"Zero-G",knowledge:undefined},
            {name:"Medic",skill:"Medic",knowledge:undefined},
            {name:"Sensors",skill:"Sensors",knowledge:undefined},
            {name:"Steward",skill:"Steward",knowledge:undefined},
            {name:"Fwd Obs",skill:"Fwd Obs",knowledge:undefined},
            {name:"Navigation",skill:"Navigation",knowledge:undefined},
            {name:"Recon",skill:"Recon",knowledge:undefined},
            {name:"Sapper",skill:"Sapper",knowledge:undefined},
            {name:"Actor",skill:"Actor",knowledge:undefined},
            {name:"Artist",skill:"Artist",knowledge:undefined},
            {name:"Author",skill:"Author",knowledge:undefined},
            {name:"Chef",skill:"Chef",knowledge:undefined},
            {name:"Dancer",skill:"Dancer",knowledge:undefined},
            {name:"Musician",skill:"Musician",knowledge:undefined},
            {name:"Biologics",skill:"Biologics",knowledge:undefined},
            {name:"Craftsman",skill:"Craftsman",knowledge:undefined},
            {name:"Electronics",skill:"Electronics",knowledge:undefined},
            {name:"Fluidics",skill:"Fluidics",knowledge:undefined},
            {name:"Gravitics",skill:"Gravitics",knowledge:undefined},
            {name:"Magnetics",skill:"Magnetics",knowledge:undefined},
            {name:"Mechanics",skill:"Mechanics",knowledge:undefined},
            {name:"Photonics",skill:"Photonics",knowledge:undefined},
            {name:"Polymers",skill:"Polymers",knowledge:undefined},
            {name:"Programmer",skill:"Programmer",knowledge:undefined},
            {name:"Driver(ACV)",skill:"Driver",knowledge:"ACV"},
            {name:"Driver(Automotive)",skill:"Driver",knowledge:"Automotive"},
            {name:"Driver(Grav)",skill:"Driver",knowledge:"Grav"},
            {name:"Driver(Legged)",skill:"Driver",knowledge:"Legged"},
            {name:"Driver(Mole)",skill:"Driver",knowledge:"Mole"},
            {name:"Driver(Tracked)",skill:"Driver",knowledge:"Tracked"},
            {name:"Driver(Wheeled)",skill:"Driver",knowledge:"Wheeled"},
            {name:"Fighter(Blades)",skill:"Fighter",knowledge:"Blades"},
            {name:"Fighter(Slug Throwers)",skill:"Fighter",knowledge:"Slug Throwers"},
            {name:"Fighter(Unarmed)",skill:"Fighter",knowledge:"Unarmed"},
            {name:"Engineer(Jump Drives)",skill:"Engineer",knowledge:"Jump Drives"},
            {name:"Engineer(Life Support)",skill:"Engineer",knowledge:"Life Support"},
            {name:"Engineer(Maneuver Drive)",skill:"Engineer",knowledge:"Maneuver Drive"},
            {name:"Engineer(Power Systems)",skill:"Engineer",knowledge:"Power Systems"},
            {name:"Science(Linguistics)",skill:"Science",knowledge:"Linguistics"},
            {name:"Science(Robotics)",skill:"Science",knowledge:"Robotics"},
            {name:"Flyer(Aeronautics)",skill:"Flyer",knowledge:"Aeronautics"},
            {name:"Flyer(Grav)",skill:"Flyer",knowledge:"Grav"},
            {name:"Flyer(LTA)",skill:"Flyer",knowledge:"LTA"},
            {name:"Flyer(Rotor)",skill:"Flyer",knowledge:"Rotor"},
            {name:"Flyer(Winged)",skill:"Flyer",knowledge:"Winged"},
            {name:"Pilot(Small Craft)",skill:"Pilot",knowledge:"Small Craft"},
            {name:"Animals(Rider)",skill:"Animals",knowledge:"Rider"},
            {name:"Animals(Teamster)",skill:"Animals",knowledge:"Teamster"},
            {name:"Animals(Trainer)",skill:"Animals",knowledge:"Trainer"},
            {name:"Seafarer(Aquanautics)",skill:"Seafarer",knowledge:"Aquanautics"},
            {name:"Seafarer(Grav)",skill:"Seafarer",knowledge:"Grav"},
            {name:"Seafarer(Boat)",skill:"Seafarer",knowledge:"Boat"},
            {name:"Seafarer(Ship)",skill:"Seafarer",knowledge:"Ship"},
            {name:"Seafarer(Sub)",skill:"Seafarer",knowledge:"Sub"},
        ];
        break;
        case "C":
            skills = [
                {name:"Athlete",skill:"Athlete",knowledge:undefined},
                {name:"Broker",skill:"Broker",knowledge:undefined},
                {name:"Bureaucrat",skill:"Bureaucrat",knowledge:undefined},
                {name:"Counsellor",skill:"Counsellor",knowledge:undefined},
                {name:"Designer",skill:"Designer",knowledge:undefined},
                {name:"Language",skill:"Language",knowledge:undefined},
                {name:"Teacher",skill:"Teacher",knowledge:undefined},
                {name:"Astrogator",skill:"Astrogator",knowledge:undefined},
                {name:"Actor",skill:"Actor",knowledge:undefined},
                {name:"Artist",skill:"Artist",knowledge:undefined},
                {name:"Author",skill:"Author",knowledge:undefined},
                {name:"Chef",skill:"Chef",knowledge:undefined},
                {name:"Dancer",skill:"Dancer",knowledge:undefined},
                {name:"Musician",skill:"Musician",knowledge:undefined},
                {name:"Biologics",skill:"Biologics",knowledge:undefined},
                {name:"Craftsman",skill:"Craftsman",knowledge:undefined},
                {name:"Electronics",skill:"Electronics",knowledge:undefined},
                {name:"Fluidics",skill:"Fluidics",knowledge:undefined},
                {name:"Gravitics",skill:"Gravitics",knowledge:undefined},
                {name:"Magnetics",skill:"Magnetics",knowledge:undefined},
                {name:"Mechanics",skill:"Mechanics",knowledge:undefined},
                {name:"Photonics",skill:"Photonics",knowledge:undefined},
                {name:"Polymers",skill:"Polymers",knowledge:undefined},
                {name:"Programmer",skill:"Programmer",knowledge:undefined},
                {name:"Driver(Automotive)",skill:"Driver",knowledge:"Automotive"},
                {name:"Science(Archeology)",skill:"Science",knowledge:"Archeology"},
                {name:"Science(Biology)",skill:"Science",knowledge:"Biology"},
                {name:"Science(Chemistry)",skill:"Science",knowledge:"Chemistry"},
                {name:"Science(History)",skill:"Science",knowledge:"History"},
                {name:"Science(Linguistics)",skill:"Science",knowledge:"Linguistics"},
                {name:"Science(Philosophy)",skill:"Science",knowledge:"Philosophy"},
                {name:"Science(Physics)",skill:"Science",knowledge:"Physics"},
                {name:"Science(Planetology)",skill:"Science",knowledge:"Planetology"},
                {name:"Science(Psionicology)",skill:"Science",knowledge:"Psionicology"},
                {name:"Science(Psychohistory)",skill:"Science",knowledge:"Psychohistory"},
                {name:"Science(Psychology)",skill:"Science",knowledge:"Psychology"},
                {name:"Science(Robotics)",skill:"Science",knowledge:"Robotics"},
                {name:"Science(Sophontology)",skill:"Science",knowledge:"Sophontology"},
                {name:"Flyer(Aeronautics)",skill:"Flyer",knowledge:"Aeronautics"},
                {name:"Seafarer(Aquanautics)",skill:"Seafarer",knowledge:"Aquanautics"},
            ];
            break;
        case "N":
            skills = [
                {name:"Fleet Tactics",skill:"Fleet Tactics",knowledge:undefined},
                {name:"Language",skill:"Language",knowledge:undefined},
                {name:"Leader",skill:"Leader",knowledge:undefined},
                {name:"Liaison",skill:"Liaison",knowledge:undefined},
                {name:"Naval Architect",skill:"Naval Architect",knowledge:undefined},
                {name:"Strategy",skill:"Strategy",knowledge:undefined},
                {name:"Tactics",skill:"Tactics",knowledge:undefined},
                {name:"Astrogator",skill:"Astrogator",knowledge:undefined},
                {name:"Medic",skill:"Medic",knowledge:undefined},
                {name:"Sensors",skill:"Sensors",knowledge:undefined},
                {name:"Steward",skill:"Steward",knowledge:undefined},
                {name:"Driver(Grav)",skill:"Driver",knowledge:"Grav"},
                {name:"Fighter(Battle Dress)",skill:"Fighter",knowledge:"Battle Dress"},
                {name:"Fighter(Slug Throwers)",skill:"Fighter",knowledge:"Slug Throwers"},
                {name:"Science(Robotics)",skill:"Science",knowledge:"Robotics"},
                {name:"Flyer(Aeronautics)",skill:"Flyer",knowledge:"Aeronautics"},
                {name:"Flyer(Grav)",skill:"Flyer",knowledge:"Grav"},
                {name:"Pilot(ACS)",skill:"Pilot",knowledge:"ACS"},
                {name:"Pilot(BCS)",skill:"Pilot",knowledge:"BCS"},
                {name:"Seafarer(Grav)",skill:"Seafarer",knowledge:"Grav"},
                {name:"Heavy Weapons(WMD)",skill:"Heavy Weapons",knowledge:"WMD"},
                {name:"Gunner(Bay Weapons)",skill:"Gunner",knowledge:"Bay Weapons"},
                {name:"Gunner(Ortillery)",skill:"Gunner",knowledge:"Ortillery"},
                {name:"Gunner(Screens)",skill:"Gunner",knowledge:"Screens"},
                {name:"Gunner(Screens)",skill:"Gunner",knowledge:"Screens"},
                {name:"Gunner(Turrets)",skill:"Gunner",knowledge:"Turrets"},
            ];
            break;
    }
    clearElement(selector); 
    clearElement(dialogText);
    dialogText.insertAdjacentHTML("beforeend","<span>"+prompt+"</span>");
    for(var i = 0, len = skills.length; i < len; i++){
        var option = selector.appendChild(document.createElement("option"));
        option.value = skills[i].name;
        option.innerHTML = skills[i].name;
        option.setAttribute("data-skill",skills[i].skill);
        option.setAttribute("data-knowledge",skills[i].knowledge);
    }
    dialogCallback = callback;
    dialog.showModal();
}
function log(msg){
    document.getElementById("history").insertAdjacentHTML("beforeend","<div>"+msg.replace(/\_/g,"<br/>")+"<hr/></div>");
}
function clear(){
    clearElement(document.getElementById("history"));
}


