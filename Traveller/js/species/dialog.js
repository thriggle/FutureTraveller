import { clearElement } from "./character_renderer.js";

export var dialogCallback = () => {};
export function pickOption(choices,prompt,callback){
    var pickerDialog = getDialog();
    var dialog = pickerDialog.dialog, selector = pickerDialog.selector, dialogText = pickerDialog.dialogText;
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
export function getDialog(){
    var existingDialog = document.getElementById("dialog"), existingSelector = document.getElementById("slctDialog"), dialogText = document.getElementById("txtDialog");
    if(existingDialog){
        return {dialog:existingDialog,selector:existingSelector,dialogText:dialogText}
    }else{
        var dialog = document.body.appendChild(document.createElement("dialog")); dialog.id = "dialog";
        var dialogText = dialog.appendChild(document.createElement("div")); dialogText.id = "txtDialog";
        var selector = dialog.appendChild(document.createElement("select")); selector.id = "slctDialog";
        var dlgBtn = dialog.appendChild(document.createElement("input")); dlgBtn.setAttribute("type","button"); dlgBtn.setAttribute("value","OK"); dlgBtn.id = "dlgBtn";
        var cancelDlgBtn = dialog.appendChild(document.createElement("input")); cancelDlgBtn.setAttribute("type","button"); cancelDlgBtn.setAttribute("value","Cancel"); cancelDlgBtn.id = "cancelDlgBtn";
        dlgBtn.addEventListener("click",() =>{ dialog.close(selector.value); dialogCallback(selector.value); });
        cancelDlgBtn.addEventListener("click",function(){ dialog.close(false); });
        return {dialog:dialog,selector:selector,dialogText:dialogText}
    }
    
}
export function pickSkill(category, prompt, callback){
    var pickerDialog = getDialog();
    var dialog = pickerDialog.dialog, selector = pickerDialog.selector, dialogText = pickerDialog.dialogText;
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
            {name:"Mechanic",skill:"Mechanic",knowledge:undefined},
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
                {name:"Mechanic",skill:"Mechanic",knowledge:undefined},
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
    dialogCallback = function(){ 
        var option = selector.options[selector.selectedIndex];
        var selectedSkill = option.getAttribute("data-skill");
        var selectedKnowledge = option.getAttribute("data-knowledge");
        if(selectedKnowledge === "undefined"){ selectedKnowledge = undefined;}
        callback({name:selector.value,skill:selectedSkill,knowledge:selectedKnowledge}); };
    dialog.showModal();
}