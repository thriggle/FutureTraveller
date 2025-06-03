import { clearElement } from "./character_renderer.js";

export var dialogCallback = () => {};
export function pickOption(choices,prompt,callback,noCancel,defaultSelection,previews,numberedPreviews){
    if(typeof previews === "undefined"){ previews = [];}
    if(typeof numberedPreviews === "undefined"){ numberedPreviews = false;}
    var pickerDialog = getDialog();
    var dialog = pickerDialog.dialog, selector = pickerDialog.selector, dialogText = pickerDialog.dialogText;
    if(noCancel){
        document.getElementById("cancelDlgBtn").setAttribute("disabled","disabled");
    }else{
        document.getElementById("cancelDlgBtn").removeAttribute("disabled");
    }
    clearElement(selector); 
    var dlgPreviewText = document.getElementById("txtDialogPreview");
    clearElement(dlgPreviewText);
   
    var selectorChange = function(){
        clearElement(dlgPreviewText);
        var i = selector.selectedIndex;
        if(previews.length > i){
            var selectedPreview = previews[i];
            if(typeof selectedPreview === "string"){
                dlgPreviewText.appendChild(document.createElement("span")).insertAdjacentHTML("beforeend",selectedPreview);
            }else if(typeof selectedPreview !== "undefined" && selectedPreview.length > 0){
                var previewList = dlgPreviewText.appendChild(document.createElement( numberedPreviews ? "ol" : "ul"));
                for(var j = 0, jlen = selectedPreview.length; j < jlen; j++){
                    previewList.appendChild(document.createElement("li")).appendChild(document.createTextNode(selectedPreview[j]));
                }
            }
        }
    };
    selector.addEventListener("change",selectorChange);
    clearElement(dialogText);
    dialogText.insertAdjacentHTML("beforeend","<span>"+prompt+"</span>");
    for(var i = 0, len = choices.length; i < len; i++){
        var option = selector.appendChild(document.createElement("option"));
        var val = choices[i];
        if(val.toString().indexOf("<!>") === 0){
            option.innerHTML = val.substring(3);
            option.value = "undefined";
        }else{
            option.value = val;
            option.innerHTML = val;
        }
    }
    if(typeof defaultSelection !== "undefined"){
        selector.value = defaultSelection;
    }
    selectorChange();
    dialogCallback = function(){ 
        var dlgPreviewText = document.getElementById("txtDialogPreview");
        clearElement(dlgPreviewText); 
        callback(selector.value); 
        selector.removeEventListener("change",selectorChange)
    };
    dialog.showModal();
}
export function getDialog(){
    var pos1 = 0, yDiff = 0;
    var startY;
    var existingDialog = document.getElementById("dialog"), existingSelector = document.getElementById("slctDialog"), dialogText = document.getElementById("txtDialog");
    if(existingDialog){
        return {dialog:existingDialog,selector:existingSelector,dialogText:dialogText}
    }else{
        var dialog = document.body.appendChild(document.createElement("dialog")); dialog.id = "dialog"; dialog.style.position = "absolute"; dialog.style.top = "0px";
        var dialogHandle = dialog.appendChild(document.createElement("div"));
        dialogHandle.style.cursor = "move"; dialogHandle.style.backgroundColor = "#455151"; dialogHandle.style.borderTop = "1rem solid #455151"; dialogHandle.style.marginTop="0px";
        var dialogText = dialog.appendChild(document.createElement("div")); dialogText.id = "txtDialog";
        var selector = dialog.appendChild(document.createElement("select")); selector.id = "slctDialog";
        var dlgBtn = dialog.appendChild(document.createElement("input")); dlgBtn.setAttribute("type","button"); dlgBtn.setAttribute("value","OK"); dlgBtn.id = "dlgBtn";
        selector.addEventListener("keypress",(ev)=>{if(ev.key === "Enter"){ ev.preventDefault(); dlgBtn.click();}});
        
        var cancelDlgBtn = dialog.appendChild(document.createElement("input")); cancelDlgBtn.setAttribute("type","button"); cancelDlgBtn.setAttribute("value","Cancel"); cancelDlgBtn.id = "cancelDlgBtn";
        var rndBtn = dialog.appendChild(document.createElement("input")); rndBtn.setAttribute("type","button"); rndBtn.setAttribute("value","🎲"); rndBtn.id = "rndBtn";
        rndBtn.addEventListener("click",function(){
            var options = selector.options;
            var randomIndex = Math.floor(Math.random() * options.length);
            selector.selectedIndex = randomIndex;
            selector.dispatchEvent(new Event("change"));

        });
        dialog.appendChild(document.createElement("br"));
        var dlgPreviewText = dialog.appendChild(document.createElement("div")); dlgPreviewText.id = "txtDialogPreview";
        dlgBtn.addEventListener("click",() =>{ dialog.style.top = "0px"; dialog.close(selector.value); dialogCallback(selector.value); });
        cancelDlgBtn.addEventListener("click",function(){ dialog.style.top = "0px"; dialog.close(false); });
        dialogHandle.onmousedown = dragMouseDown;
        dialogHandle.ontouchstart = dragMouseDown;
        var baseOffsetTop = undefined;
        startY = dialog.getBoundingClientRect().top;
        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            if(typeof baseOffsetTop == "undefined"){
                baseOffsetTop = dialog.getBoundingClientRect().top;
            }
            startY = dialog.getBoundingClientRect().top; 
            pos1 = e.clientY || e.targetTouches[0].pageY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
            document.ontouchmove = elementDrag;
            document.ontouchend = closeDragElement;
          }
          function elementDrag(e) {
            e = e || window.event;
            var newY = e.clientY || e.targetTouches[0].pageY;
            // calculate the new cursor position:
            yDiff = pos1 - newY;
            // set the element's new position:
            var newPos =  dialog.getBoundingClientRect().top - baseOffsetTop - yDiff >> 0;
            dialog.style.top = newPos + "px";
          }
          function closeDragElement() {
            dialog.style.top = "0px";
            document.onmouseup = null;
            document.onmousemove = null;
            document.ontouchmove = null;
            document.ontouchend = null;
          }
        return {dialog:dialog,selector:selector,dialogText:dialogText}
    }
    
}
export function pickSkill(category, prompt, callback, excludedChoice, preferredChoice, noCancel){
    var pickerDialog = getDialog();
    if(typeof noCancel === "undefined"){ noCancel = false;}
    var dialog = pickerDialog.dialog, selector = pickerDialog.selector, dialogText = pickerDialog.dialogText;
    var dlgPreviewText = document.getElementById("txtDialogPreview");
    clearElement(dlgPreviewText);
    if(noCancel){
        document.getElementById("cancelDlgBtn").setAttribute("disabled","disabled");
    }else{
        document.getElementById("cancelDlgBtn").removeAttribute("disabled");
    }
    var skills = [];
    switch(category){
        case "S":
        skills = [
            {name:"Actor",skill:"Actor",knowledge:undefined},
            {name:"Admin",skill:"Admin",knowledge:undefined},
            {name:"Animals(Rider)",skill:"Animals",knowledge:"Rider"},
            {name:"Animals(Teamster)",skill:"Animals",knowledge:"Teamster"},
            {name:"Animals(Trainer)",skill:"Animals",knowledge:"Trainer"},
            {name:"Artist",skill:"Artist",knowledge:undefined},
            {name:"Author",skill:"Author",knowledge:undefined},

            {name:"Biologics",skill:"Biologics",knowledge:undefined},

            {name:"Chef",skill:"Chef",knowledge:undefined},
            {name:"Comms",skill:"Comms",knowledge:undefined},
            {name:"Computer",skill:"Computer",knowledge:undefined},
            {name:"Craftsman",skill:"Craftsman",knowledge:undefined},
            
            {name:"Dancer",skill:"Dancer",knowledge:undefined},
            {name:"Driver(ACV)",skill:"Driver",knowledge:"ACV"},
            {name:"Driver(Automotive)",skill:"Driver",knowledge:"Automotive"},
            {name:"Driver(Grav)",skill:"Driver",knowledge:"Grav"},
            {name:"Driver(Legged)",skill:"Driver",knowledge:"Legged"},
            {name:"Driver(Mole)",skill:"Driver",knowledge:"Mole"},
            {name:"Driver(Tracked)",skill:"Driver",knowledge:"Tracked"},
            {name:"Driver(Wheeled)",skill:"Driver",knowledge:"Wheeled"},
            
            {name:"Electronics",skill:"Electronics",knowledge:undefined},
            {name:"Engineer(Jump Drives)",skill:"Engineer",knowledge:"Jump Drives"},
            {name:"Engineer(Life Support)",skill:"Engineer",knowledge:"Life Support"},
            {name:"Engineer(Maneuver Drive)",skill:"Engineer",knowledge:"Maneuver Drive"},
            {name:"Engineer(Power Systems)",skill:"Engineer",knowledge:"Power Systems"},
            {name:"Explosives",skill:"Explosives",knowledge:undefined},

            {name:"Fighter(Blades)",skill:"Fighter",knowledge:"Blades"},
            {name:"Fighter(Slug Throwers)",skill:"Fighter",knowledge:"Slug Throwers"},
            {name:"Fighter(Unarmed)",skill:"Fighter",knowledge:"Unarmed"},
            {name:"Fluidics",skill:"Fluidics",knowledge:undefined},
            {name:"Flyer(Aeronautics)",skill:"Flyer",knowledge:"Aeronautics"},
            {name:"Flyer(Grav)",skill:"Flyer",knowledge:"Grav"},
            {name:"Flyer(LTA)",skill:"Flyer",knowledge:"LTA"},
            {name:"Flyer(Rotor)",skill:"Flyer",knowledge:"Rotor"},
            {name:"Flyer(Winged)",skill:"Flyer",knowledge:"Winged"},
            {name:"Fwd Obs",skill:"Forward Observer",knowledge:undefined},
            
            {name:"Gravitics",skill:"Gravitics",knowledge:undefined},

            {name:"High-G",skill:"High-G",knowledge:undefined},
            {name:"Hostile Environ",skill:"Hostile Environ",knowledge:undefined},

            {name:"Language",skill:"Language",knowledge:undefined},

            {name:"Magnetics",skill:"Magnetics",knowledge:undefined},
            {name:"Mechanic",skill:"Mechanic",knowledge:undefined},
            {name:"Medic",skill:"Medic",knowledge:undefined},
            {name:"Musician",skill:"Musician",knowledge:undefined},

            {name:"Navigator",skill:"Navigator",knowledge:undefined},

            {name:"Photonics",skill:"Photonics",knowledge:undefined},
            {name:"Pilot(Small Craft)",skill:"Pilot",knowledge:"Small Craft"},
            {name:"Polymers",skill:"Polymers",knowledge:undefined},
            {name:"Programmer",skill:"Programmer",knowledge:undefined},
            
            {name:"Recon",skill:"Recon",knowledge:undefined},

            {name:"Sapper",skill:"Sapper",knowledge:undefined},
            {name:"Science(Linguistics)",skill:"Science",knowledge:"Linguistics"},
            {name:"Science(Robotics)",skill:"Science",knowledge:"Robotics"},
            {name:"Seafarer(Aquanautics)",skill:"Seafarer",knowledge:"Aquanautics"},
            {name:"Seafarer(Boat)",skill:"Seafarer",knowledge:"Boat"},
            {name:"Seafarer(Grav)",skill:"Seafarer",knowledge:"Grav"},
            {name:"Seafarer(Ship)",skill:"Seafarer",knowledge:"Ship"},
            {name:"Seafarer(Sub)",skill:"Seafarer",knowledge:"Sub"},
            {name:"Sensors",skill:"Sensors",knowledge:undefined},
            {name:"Steward",skill:"Steward",knowledge:undefined},
            {name:"Survey",skill:"Survey",knowledge:undefined},
            {name:"Survival",skill:"Survival",knowledge:undefined},

            {name:"Tactics",skill:"Tactics",knowledge:undefined},
            {name:"Trader",skill:"Trader",knowledge:undefined},

            {name:"Vacc Suit",skill:"Vacc Suit",knowledge:undefined},

            {name:"Zero-G",skill:"Zero-G",knowledge:undefined}
        ];
        break;
        case "C":
            skills = [
                {name:"Actor",skill:"Actor",knowledge:undefined},
                {name:"Artist",skill:"Artist",knowledge:undefined},
                {name:"Astrogator",skill:"Astrogator",knowledge:undefined},
                {name:"Athlete",skill:"Athlete",knowledge:undefined},
                {name:"Author",skill:"Author",knowledge:undefined},

                {name:"Biologics",skill:"Biologics",knowledge:undefined},
                {name:"Broker",skill:"Broker",knowledge:undefined},
                {name:"Bureaucrat",skill:"Bureaucrat",knowledge:undefined},
                
                {name:"Chef",skill:"Chef",knowledge:undefined},
                {name:"Counsellor",skill:"Counsellor",knowledge:undefined},
                {name:"Craftsman",skill:"Craftsman",knowledge:undefined},

                {name:"Dancer",skill:"Dancer",knowledge:undefined},
                {name:"Designer",skill:"Designer",knowledge:undefined},
                {name:"Driver(Automotive)",skill:"Driver",knowledge:"Automotive"},

                {name:"Electronics",skill:"Electronics",knowledge:undefined},

                {name:"Flyer(Aeronautics)",skill:"Flyer",knowledge:"Aeronautics"},
                {name:"Fluidics",skill:"Fluidics",knowledge:undefined},

                {name:"Gravitics",skill:"Gravitics",knowledge:undefined},
                
                {name:"Language",skill:"Language",knowledge:undefined},
                
                {name:"Magnetics",skill:"Magnetics",knowledge:undefined},
                {name:"Mechanic",skill:"Mechanic",knowledge:undefined},
                {name:"Musician",skill:"Musician",knowledge:undefined},
                
                {name:"Photonics",skill:"Photonics",knowledge:undefined},
                {name:"Polymers",skill:"Polymers",knowledge:undefined},
                {name:"Programmer",skill:"Programmer",knowledge:undefined},
                
                {name:"Seafarer(Aquanautics)",skill:"Seafarer",knowledge:"Aquanautics"},
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

                {name:"Teacher",skill:"Teacher",knowledge:undefined}
            ];
            break;
        case "N":
            skills = [
                {name:"Animals(Trainer)",skill:"Animals",knowledge:"Trainer"},
                {name:"Astrogator",skill:"Astrogator",knowledge:undefined},

                {name:"Driver(Grav)",skill:"Driver",knowledge:"Grav"},
                {name:"Driver(Wheeled)",skill:"Driver",knowledge:"Wheeled"},

                {name:"Engineer(Jump Drives)",skill:"Engineer",knowledge:"Jump Drives"},
                {name:"Engineer(Life Support)",skill:"Engineer",knowledge:"Life Support"},
                {name:"Engineer(Maneuver Drive)",skill:"Engineer",knowledge:"Maneuver Drive"},
                {name:"Engineer(Power Systems)",skill:"Engineer",knowledge:"Power Systems"},

                {name:"Fighter(Battle Dress)",skill:"Fighter",knowledge:"Battle Dress"},
                {name:"Fighter(Slug Throwers)",skill:"Fighter",knowledge:"Slug Throwers"},
                {name:"Fleet Tactics",skill:"Fleet Tactics",knowledge:undefined},
                {name:"Flyer(Aeronautics)",skill:"Flyer",knowledge:"Aeronautics"},
                {name:"Flyer(Grav)",skill:"Flyer",knowledge:"Grav"},

                {name:"Gunner(Bay Weapons)",skill:"Gunner",knowledge:"Bay Weapons"},
                {name:"Gunner(Ortillery)",skill:"Gunner",knowledge:"Ortillery"},
                {name:"Gunner(Screens)",skill:"Gunner",knowledge:"Screens"},
                {name:"Gunner(Spines)",skill:"Gunner",knowledge:"Screens"},
                {name:"Gunner(Turrets)",skill:"Gunner",knowledge:"Turrets"},

                {name:"Heavy Weapons(WMD)",skill:"Heavy Weapons",knowledge:"WMD"},

                {name:"Language",skill:"Language",knowledge:undefined},
                {name:"Leader",skill:"Leader",knowledge:undefined},
                {name:"Liaison",skill:"Liaison",knowledge:undefined},

                {name:"Medic",skill:"Medic",knowledge:undefined},
                {name:"Naval Architect",skill:"Naval Architect",knowledge:undefined},

                {name:"Pilot(ACS)",skill:"Pilot",knowledge:"ACS"},
                {name:"Pilot(BCS)",skill:"Pilot",knowledge:"BCS"},

                {name:"Science(Robotics)",skill:"Science",knowledge:"Robotics"},
                {name:"Seafarer(Grav)",skill:"Seafarer",knowledge:"Grav"},
                {name:"Sensors",skill:"Sensors",knowledge:undefined},
                {name:"Steward",skill:"Steward",knowledge:undefined},
                {name:"Strategy",skill:"Strategy",knowledge:undefined},

                {name:"Tactics",skill:"Tactics",knowledge:undefined}
            ];
            break;
        case "A":
            skills = [
                {name:"Animals(Rider)",skill:"Animals",knowledge:"Rider"},
                {name:"Animals(Teamster)",skill:"Animals",knowledge:"Teamster"},
                {name:"Animals(Trainer)",skill:"Animals",knowledge:"Trainer"},

                {name:"Driver(ACV)",skill:"Driver",knowledge:"ACV"},
                {name:"Driver(Automotive)",skill:"Driver",knowledge:"Automotive"},
                {name:"Driver(Grav)",skill:"Driver",knowledge:"Grav"},
                {name:"Driver(Legged)",skill:"Driver",knowledge:"Legged"},
                {name:"Driver(Mole)",skill:"Driver",knowledge:"Mole"},
                {name:"Driver(Tracked)",skill:"Driver",knowledge:"Tracked"},
                {name:"Driver(Wheeled)",skill:"Driver",knowledge:"Wheeled"},

                {name:"Engineer(Life Support)",skill:"Engineer",knowledge:"Life Support"},
                {name:"Engineer(Power Systems)",skill:"Engineer",knowledge:"Power Systems"},

                {name:"Fighter(Battle Dress)",skill:"Fighter",knowledge:"Battle Dress"},
                {name:"Fighter(Beams)",skill:"Fighter",knowledge:"Beams"},
                {name:"Fighter(Blades)",skill:"Fighter",knowledge:"Blades"},
                {name:"Fighter(Exotics)",skill:"Fighter",knowledge:"Exotics"},
                {name:"Fighter(Slug Throwers)",skill:"Fighter",knowledge:"Slug Throwers"},
                {name:"Fighter(Sprays)",skill:"Fighter",knowledge:"Sprays"},
                {name:"Fighter(Unarmed)",skill:"Fighter",knowledge:"Unarmed"},


                {name:"Flyer(Aeronautics)",skill:"Flyer",knowledge:"Aeronautics"},
                {name:"Flyer(Flapper)",skill:"Flyer",knowledge:"Flapper"},
                {name:"Flyer(Grav)",skill:"Flyer",knowledge:"Grav"},
                {name:"Flyer(Rotor)",skill:"Flyer",knowledge:"Rotor"},
                {name:"Flyer(Winged)",skill:"Flyer",knowledge:"Winged"},
                {name:"Fwd Obs",skill:"Forward Observer",knowledge:undefined},

                {name:"Gunner(Screens)",skill:"Gunner",knowledge:"Screens"},

                {name:"Heavy Weapons(Artillery)",skill:"Heavy Weapons",knowledge:"Artillery"},
                {name:"Heavy Weapons(Launcher)",skill:"Heavy Weapons",knowledge:"Launcher"},
                {name:"Heavy Weapons(Ordnance)",skill:"Heavy Weapons",knowledge:"Ordnance"},
                {name:"Heavy Weapons(WMD)",skill:"Heavy Weapons",knowledge:"WMD"},

                {name:"Language",skill:"Language",knowledge:undefined},
                {name:"Leader",skill:"Leader",knowledge:undefined},
                {name:"Liaison",skill:"Liaison",knowledge:undefined},

                {name:"Medic",skill:"Medic",knowledge:undefined},
                {name:"Navigator",skill:"Navigator",knowledge:undefined},
                
                {name:"Pilot(Small Craft)",skill:"Pilot",knowledge:"Small Craft"},
                
                {name:"Recon",skill:"Recon",knowledge:undefined},
                {name:"Sapper",skill:"Sapper",knowledge:undefined},
                {name:"Science(Robotics)",skill:"Science",knowledge:"Robotics"},
                {name:"Seafarer(Grav)",skill:"Seafarer",knowledge:"Grav"},
                {name:"Strategy",skill:"Strategy",knowledge:undefined},

                {name:"Tactics",skill:"Tactics",knowledge:undefined}
            ];
            break;
        case "M":
            skills = [
                {name:"Animals(Rider)",skill:"Animals",knowledge:"Rider"},
                {name:"Animals(Teamster)",skill:"Animals",knowledge:"Teamster"},
                {name:"Animals(Trainer)",skill:"Animals",knowledge:"Trainer"},

                {name:"Driver(Grav)",skill:"Driver",knowledge:"Grav"},
                {name:"Driver(Tracked)",skill:"Driver",knowledge:"Tracked"},
                {name:"Driver(Wheeled)",skill:"Driver",knowledge:"Wheeled"},

                {name:"Engineer(Power Systems)",skill:"Engineer",knowledge:"Power Systems"},

                {name:"Fighter(Battle Dress)",skill:"Fighter",knowledge:"Battle Dress"},
                {name:"Fighter(Beams)",skill:"Fighter",knowledge:"Beams"},
                {name:"Fighter(Blades)",skill:"Fighter",knowledge:"Blades"},
                {name:"Fighter(Exotics)",skill:"Fighter",knowledge:"Exotics"},
                {name:"Fighter(Slug Throwers)",skill:"Fighter",knowledge:"Slug Throwers"},
                {name:"Fighter(Sprays)",skill:"Fighter",knowledge:"Sprays"},
                {name:"Fighter(Unarmed)",skill:"Fighter",knowledge:"Unarmed"},

                {name:"Flyer(Grav)",skill:"Flyer",knowledge:"Grav"},

                {name:"Fwd Obs",skill:"Forward Observer",knowledge:undefined},

                {name:"Gunner(Turrets)",skill:"Gunner",knowledge:"Turrets"},

                {name:"Heavy Weapons(Artillery)",skill:"Heavy Weapons",knowledge:"Artillery"},
                {name:"Heavy Weapons(Launcher)",skill:"Heavy Weapons",knowledge:"Launcher"},
                {name:"Heavy Weapons(Ordnance)",skill:"Heavy Weapons",knowledge:"Ordnance"},
                {name:"Heavy Weapons(WMD)",skill:"Heavy Weapons",knowledge:"WMD"},

                {name:"Language",skill:"Language",knowledge:undefined},
                {name:"Leader",skill:"Leader",knowledge:undefined},
                {name:"Liaison",skill:"Liaison",knowledge:undefined},

                {name:"Medic",skill:"Medic",knowledge:undefined},
                {name:"Navigator",skill:"Navigator",knowledge:undefined},
                
                {name:"Pilot(Small Craft)",skill:"Pilot",knowledge:"Small Craft"},
                
                {name:"Recon",skill:"Recon",knowledge:undefined},
                {name:"Sapper",skill:"Sapper",knowledge:undefined},
                {name:"Science(Robotics)",skill:"Science",knowledge:"Robotics"},
                {name:"Seafarer(Grav)",skill:"Seafarer",knowledge:"Grav"},
                {name:"Seafarer(Boat)",skill:"Seafarer",knowledge:"Boat"},
                {name:"Seafarer(Ship)",skill:"Seafarer",knowledge:"Ship"},
                {name:"Seafarer(Sub)",skill:"Seafarer",knowledge:"Sub"},
                {name:"Strategy",skill:"Strategy",knowledge:undefined},

                {name:"Tactics",skill:"Tactics",knowledge:undefined}
            ];
            break;
        case "Medical":
            skills = [
                {name:"Forensics",skill:"Forensics",knowledge:undefined},
                {name:"Medic",skill:"Medic",knowledge:undefined},
        ];
            break;
        case "Law":
        skills = [
            {name:"Advocate",skill:"Advocate",knowledge:undefined},
            {name:"Diplomat",skill:"Diplomat",knowledge:undefined},
        ];
        break;
        case "Soldier": skills = [
            {name:"Fighter",skill:"Fighter",knowledge:undefined},
            {name:"Vacc Suit",skill:"Vacc Suit",knowledge:undefined},
            {name:"Stealth",skill:"Stealth",knowledge:undefined},
            {name:"Leader",skill:"Leader",knowledge:undefined},
            {name:"Tactics",skill:"Tactics",knowledge:undefined},
            {name:"Admin",skill:"Admin",knowledge:undefined},
            {name:"Hostile Environ",skill:"Hostile Environ",knowledge:undefined},
            {name:"Animals",skill:"Animals",knowledge:undefined},
            {name:"Liaison",skill:"Liaison",knowledge:undefined},
            {name:"Navigator",skill:"Navigator",knowledge:undefined},
            {name:"Driver",skill:"Driver",knowledge:undefined},
            {name:"Heavy Weapons",skill:"Heavy Weapons",knowledge:undefined},
            {name:"Sensors",skill:"Sensors",knowledge:undefined},
            {name:"Language",skill:"Language",knowledge:undefined},
            {name:"Computer",skill:"Computer",knowledge:undefined},
            {name:"Tactics",skill:"Tactics",knowledge:undefined},
            {name:"Explosives",skill:"Explosives",knowledge:undefined},
            {name:"Medic",skill:"Medic",knowledge:undefined},
            {name:"Seafarer",skill:"Seafarer",knowledge:undefined},
            {name:"Forward Observer",skill:"Forward Observer",knowledge:undefined},
            {name:"Recon",skill:"Recon",knowledge:undefined},
            {name:"Sapper",skill:"Sapper",knowledge:undefined},
            
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
            
            {name:"Actor",skill:"Actor",knowledge:undefined},
            {name:"Artist",skill:"Artist",knowledge:undefined},
            {name:"Author",skill:"Author",knowledge:undefined},
            {name:"Chef",skill:"Chef",knowledge:undefined},
            {name:"Dancer",skill:"Dancer",knowledge:undefined},
            {name:"Musician",skill:"Musician",knowledge:undefined},

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
            {name:"Science(Sophontology)",skill:"Science",knowledge:"Sophontology"}
            
        ]; break;
        case "Marine": skills = [
            {name:"Fighter",skill:"Fighter",knowledge:undefined},
            {name:"Forward Observer",skill:"Forward Observer",knowledge:undefined},
            {name:"Recon",skill:"Recon",knowledge:undefined},
            {name:"Sapper",skill:"Sapper",knowledge:undefined},
            {name:"Heavy Weapons",skill:"Heavy Weapons",knowledge:undefined},
            {name:"Navigator",skill:"Navigator",knowledge:undefined},

            {name:"Leader",skill:"Leader",knowledge:undefined},
            {name:"Tactics",skill:"Tactics",knowledge:undefined},
            {name:"Vacc Suit",skill:"Vacc Suit",knowledge:undefined},
            {name:"Hostile Environ",skill:"Hostile Environ",knowledge:undefined},
            {name:"Stealth",skill:"Stealth",knowledge:undefined},
            {name:"Flyer",skill:"Flyer",knowledge:undefined},
            {name:"Survival",skill:"Survival",knowledge:undefined},
            {name:"Language",skill:"Language",knowledge:undefined},
            {name:"Gunner",skill:"Gunner",knowledge:undefined},
            {name:"Explosives",skill:"Explosives",knowledge:undefined},
            {name:"Medic",skill:"Medic",knowledge:undefined},
            {name:"Seafarer",skill:"Seafarer",knowledge:undefined},
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
            
            {name:"Actor",skill:"Actor",knowledge:undefined},
            {name:"Artist",skill:"Artist",knowledge:undefined},
            {name:"Author",skill:"Author",knowledge:undefined},
            {name:"Chef",skill:"Chef",knowledge:undefined},
            {name:"Dancer",skill:"Dancer",knowledge:undefined},
            {name:"Musician",skill:"Musician",knowledge:undefined},

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
            {name:"Science(Sophontology)",skill:"Science",knowledge:"Sophontology"}
        ]; break;
        case "Spacer": skills = [
            {name:"Fighter",skill:"Fighter",knowledge:undefined},
            {name:"Fleet Tactics",skill:"Fleet Tactics",knowledge:undefined},

            {name:"Astrogator",skill:"Astrogator",knowledge:undefined},
            {name:"Engineer",skill:"Engineer",knowledge:undefined},
            {name:"Gunner",skill:"Gunner",knowledge:undefined},
            {name:"Medic",skill:"Medic",knowledge:undefined},
            {name:"Pilot",skill:"Pilot",knowledge:undefined},
            {name:"Sensors",skill:"Sensors",knowledge:undefined},
            {name:"Steward",skill:"Steward",knowledge:undefined},

            {name:"Computer",skill:"Computer",knowledge:undefined},
            {name:"Strategy",skill:"Strategy",knowledge:undefined},
            {name:"Counsellor",skill:"Counsellor",knowledge:undefined},
            
            {name:"Diplomat",skill:"Diplomat",knowledge:undefined},
            {name:"Admin",skill:"Admin",knowledge:undefined},
            {name:"Language",skill:"Language",knowledge:undefined},
            {name:"Liaison",skill:"Liaison",knowledge:undefined},
            {name:"Comms",skill:"Comms",knowledge:undefined},

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
            
            {name:"Actor",skill:"Actor",knowledge:undefined},
            {name:"Artist",skill:"Artist",knowledge:undefined},
            {name:"Author",skill:"Author",knowledge:undefined},
            {name:"Chef",skill:"Chef",knowledge:undefined},
            {name:"Dancer",skill:"Dancer",knowledge:undefined},
            {name:"Musician",skill:"Musician",knowledge:undefined},

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

            {name:"Athlete",skill:"Athlete",knowledge:undefined},
            {name:"Zero-G",skill:"Zero-G",knowledge:undefined},
            

        ]; break;
        case "Scholar": skills = [
            {name:"Seafarer",skill:"Seafarer",knowledge:undefined},
            {name:"Navigator",skill:"Navigator",knowledge:undefined},
            {name:"Hostile Environ",skill:"Hostile Environ",knowledge:undefined},
            {name:"Flyer",skill:"Flyer",knowledge:undefined},
            {name:"Driver",skill:"Driver",knowledge:undefined},
            {name:"Vacc Suit",skill:"Vacc Suit",knowledge:undefined},

            {name:"Survey",skill:"Survey",knowledge:undefined},
            
            {name:"Survival",skill:"Survival",knowledge:undefined},
            {name:"Animals",skill:"Animals",knowledge:undefined},
            {name:"Bureaucrat",skill:"Bureaucrat",knowledge:undefined},
            {name:"Fighter",skill:"Fighter",knowledge:undefined},
            {name:"Stealth",skill:"Stealth",knowledge:undefined},
            {name:"Admin",skill:"Admin",knowledge:undefined},
            {name:"Language",skill:"Language",knowledge:undefined},
            {name:"Comms",skill:"Comms",knowledge:undefined},
            {name:"Seafarer",skill:"Seafarer",knowledge:undefined},         
            {name:"Athlete",skill:"Athlete",knowledge:undefined},

            // starship skills
            {name:"Astrogator",skill:"Astrogator",knowledge:undefined},
            {name:"Engineer",skill:"Engineer",knowledge:undefined},
            {name:"Gunner",skill:"Gunner",knowledge:undefined},
            {name:"Medic",skill:"Medic",knowledge:undefined},
            {name:"Pilot",skill:"Pilot",knowledge:undefined},
            {name:"Sensors",skill:"Sensors",knowledge:undefined},
            {name:"Steward",skill:"Steward",knowledge:undefined},          

            // Trades 
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
            
            // Arts
            {name:"Actor",skill:"Actor",knowledge:undefined},
            {name:"Artist",skill:"Artist",knowledge:undefined},
            {name:"Author",skill:"Author",knowledge:undefined},
            {name:"Chef",skill:"Chef",knowledge:undefined},
            {name:"Dancer",skill:"Dancer",knowledge:undefined},
            {name:"Musician",skill:"Musician",knowledge:undefined},

            // Sciences
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
        ]; break;
        case "Entertainer": skills = [
            {name:"Actor",skill:"Actor",knowledge:undefined},
            {name:"Admin",skill:"Admin",knowledge:undefined},
            {name:"Advocate",skill:"Advocate",knowledge:undefined},
            {name:"Animals",skill:"Animals",knowledge:undefined},
            {name:"Artist",skill:"Artist",knowledge:undefined},
            {name:"Astrogator",skill:"Astrogator",knowledge:undefined},
            {name:"Athlete",skill:"Athlete",knowledge:undefined},
            {name:"Author",skill:"Author",knowledge:undefined},
            {name:"Biologics",skill:"Biologics",knowledge:undefined},
            {name:"Broker",skill:"Broker",knowledge:undefined},
            {name:"Bureaucrat",skill:"Bureaucrat",knowledge:undefined},
            {name:"Chef",skill:"Chef",knowledge:undefined},
            {name:"Craftsman",skill:"Craftsman",knowledge:undefined},
            {name:"Dancer",skill:"Dancer",knowledge:undefined},
            {name:"Diplomat",skill:"Diplomat",knowledge:undefined},
            
            {name:"Electronics",skill:"Electronics",knowledge:undefined},
            {name:"Engineer",skill:"Engineer",knowledge:undefined},
            {name:"Fluidics",skill:"Fluidics",knowledge:undefined},
            {name:"Gravitics",skill:"Gravitics",knowledge:undefined},
            {name:"Gunner",skill:"Gunner",knowledge:undefined},
            {name:"Hostile Environ",skill:"Hostile Environ",knowledge:undefined},
            {name:"Language",skill:"Language",knowledge:undefined},
            {name:"Liaison",skill:"Liaison",knowledge:undefined},
            {name:"Magnetics",skill:"Magnetics",knowledge:undefined},
            {name:"Mechanic",skill:"Mechanic",knowledge:undefined},
            {name:"Medic",skill:"Medic",knowledge:undefined},
            {name:"Musician",skill:"Musician",knowledge:undefined},
            {name:"Navigator",skill:"Navigator",knowledge:undefined},
            {name:"Photonics",skill:"Photonics",knowledge:undefined},
            {name:"Pilot",skill:"Pilot",knowledge:undefined},
            {name:"Polymers",skill:"Polymers",knowledge:undefined},
            {name:"Programmer",skill:"Programmer",knowledge:undefined},
            {name:"Sensors",skill:"Sensors",knowledge:undefined},
            {name:"Steward",skill:"Steward",knowledge:undefined}, 
            {name:"Survey",skill:"Survey",knowledge:undefined},
            {name:"Survival",skill:"Survival",knowledge:undefined},
            {name:"Trader",skill:"Trader",knowledge:undefined},
            {name:"Vacc Suit",skill:"Vacc Suit",knowledge:undefined},

            {name:"Zero-G",skill:"Zero-G",knowledge:undefined},
            
        ]; break;
        case "Citizen": skills = [
            {name:"Actor",skill:"Actor",knowledge:undefined},
            {name:"Admin",skill:"Admin",knowledge:undefined},
            {name:"Advocate",skill:"Advocate",knowledge:undefined},
            {name:"Animals",skill:"Animals",knowledge:undefined},
            {name:"Artist",skill:"Artist",knowledge:undefined},
            {name:"Athlete",skill:"Athlete",knowledge:undefined},
            {name:"Author",skill:"Author",knowledge:undefined},
            {name:"Biologics",skill:"Biologics",knowledge:undefined},
            {name:"Broker",skill:"Broker",knowledge:undefined},
            {name:"Bureaucrat",skill:"Bureaucrat",knowledge:undefined},
            {name:"Computer",skill:"Computer",knowledge:undefined},
            {name:"Chef",skill:"Chef",knowledge:undefined},
            {name:"Counsellor",skill:"Counsellor",knowledge:undefined},
            {name:"Craftsman",skill:"Craftsman",knowledge:undefined},
            {name:"Dancer",skill:"Dancer",knowledge:undefined},
            {name:"Driver",skill:"Driver",knowledge:undefined},
            {name:"Electronics",skill:"Electronics",knowledge:undefined},
            {name:"Flyer",skill:"Flyer",knowledge:undefined},
            {name:"Fluidics",skill:"Fluidics",knowledge:undefined},
            {name:"Gravitics",skill:"Gravitics",knowledge:undefined},
            {name:"Hostile Environ",skill:"Hostile Environ",knowledge:undefined},
            {name:"JOT",skill:"JOT",knowledge:undefined},
            {name:"Liaison",skill:"Liaison",knowledge:undefined},
            {name:"Musician",skill:"Musician",knowledge:undefined},
            {name:"Magnetics",skill:"Magnetics",knowledge:undefined},
            {name:"Medic",skill:"Medic",knowledge:undefined},
            {name:"Mechanic",skill:"Mechanic",knowledge:undefined},
            {name:"Navigator",skill:"Navigator",knowledge:undefined},
            {name:"Photonics",skill:"Photonics",knowledge:undefined},
            {name:"Polymers",skill:"Polymers",knowledge:undefined},
            {name:"Programmer",skill:"Programmer",knowledge:undefined},
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
            {name:"Seafarer",skill:"Seafarer",knowledge:undefined},
            {name:"Trader",skill:"Trader",knowledge:undefined},
            {name:"Teacher",skill:"Teacher",knowledge:undefined},
            {name:"Vacc Suit",skill:"Vacc Suit",knowledge:undefined}
        ]; break;
        case "Merchant": skills = [
            {name:"Actor",skill:"Actor",knowledge:undefined},
            {name:"Admin",skill:"Admin",knowledge:undefined},
            {name:"Advocate",skill:"Advocate",knowledge:undefined},
            {name:"Artist",skill:"Artist",knowledge:undefined},
            {name:"Astrogator",skill:"Astrogator",knowledge:undefined},
            {name:"Author",skill:"Author",knowledge:undefined},
            {name:"Biologics",skill:"Biologics",knowledge:undefined},
            {name:"Broker",skill:"Broker",knowledge:undefined},           
            {name:"Chef",skill:"Chef",knowledge:undefined},
            {name:"Computer",skill:"Computer",knowledge:undefined},
            {name:"Comms",skill:"Comms",knowledge:undefined},
            {name:"Craftsman",skill:"Craftsman",knowledge:undefined},
            {name:"Dancer",skill:"Dancer",knowledge:undefined},
            {name:"Diplomat",skill:"Diplomat",knowledge:undefined},
            {name:"Driver",skill:"Driver",knowledge:undefined},
            {name:"Electronics",skill:"Electronics",knowledge:undefined},
            {name:"Engineer",skill:"Engineer",knowledge:undefined},
            {name:"Fluidics",skill:"Fluidics",knowledge:undefined},
            {name:"Gravitics",skill:"Gravitics",knowledge:undefined},
            {name:"Gunner",skill:"Gunner",knowledge:undefined},     
            {name:"JOT",skill:"JOT",knowledge:undefined},
            {name:"Language",skill:"Language",knowledge:undefined},
            {name:"Magnetics",skill:"Magnetics",knowledge:undefined},
            {name:"Mechanic",skill:"Mechanic",knowledge:undefined},
            {name:"Medic",skill:"Medic",knowledge:undefined},
            {name:"Musician",skill:"Musician",knowledge:undefined},
            {name:"Photonics",skill:"Photonics",knowledge:undefined},
            {name:"Pilot",skill:"Pilot",knowledge:undefined},
            {name:"Polymers",skill:"Polymers",knowledge:undefined},
            {name:"Programmer",skill:"Programmer",knowledge:undefined},
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
            {name:"Sensors",skill:"Sensors",knowledge:undefined},
            {name:"Steward",skill:"Steward",knowledge:undefined},
            {name:"Trader",skill:"Trader",knowledge:undefined},
            {name:"Vacc Suit",skill:"Vacc Suit",knowledge:undefined}
        ]; break;
        case "Scout": skills = [
            {name:"Actor",skill:"Actor",knowledge:undefined},
            {name:"Animals",skill:"Animals",knowledge:undefined},
            {name:"Artist",skill:"Artist",knowledge:undefined},
            {name:"Astrogator",skill:"Astrogator",knowledge:undefined},
            {name:"Athlete",skill:"Athlete",knowledge:undefined},
            {name:"Author",skill:"Author",knowledge:undefined},
            {name:"Biologics",skill:"Biologics",knowledge:undefined},
            
            {name:"Chef",skill:"Chef",knowledge:undefined},
            {name:"Comms",skill:"Comms",knowledge:undefined},
            {name:"Computer",skill:"Computer",knowledge:undefined},
            {name:"Craftsman",skill:"Craftsman",knowledge:undefined},
            {name:"Dancer",skill:"Dancer",knowledge:undefined},
            {name:"Diplomat",skill:"Diplomat",knowledge:undefined},
            
            {name:"Electronics",skill:"Electronics",knowledge:undefined},
            {name:"Engineer",skill:"Engineer",knowledge:undefined},
            {name:"Fighter",skill:"Fighter",knowledge:undefined},
            {name:"Flyer",skill:"Flyer",knowledge:undefined},
            {name:"Fluidics",skill:"Fluidics",knowledge:undefined},
            {name:"Gravitics",skill:"Gravitics",knowledge:undefined},
            {name:"Gunner",skill:"Gunner",knowledge:undefined},
            {name:"Hostile Environ",skill:"Hostile Environ",knowledge:undefined},
            {name:"JOT",skill:"JOT",knowledge:undefined},
            {name:"Language",skill:"Language",knowledge:undefined},
            {name:"Magnetics",skill:"Magnetics",knowledge:undefined},
            {name:"Mechanic",skill:"Mechanic",knowledge:undefined},
            {name:"Medic",skill:"Medic",knowledge:undefined},
            {name:"Musician",skill:"Musician",knowledge:undefined},
            {name:"Navigator",skill:"Navigator",knowledge:undefined},
            {name:"Photonics",skill:"Photonics",knowledge:undefined},
            {name:"Pilot",skill:"Pilot",knowledge:undefined},
            {name:"Polymers",skill:"Polymers",knowledge:undefined},
            {name:"Programmer",skill:"Programmer",knowledge:undefined},
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
            {name:"Seafarer",skill:"Seafarer",knowledge:undefined},
            {name:"Sensors",skill:"Sensors",knowledge:undefined},
            {name:"Steward",skill:"Steward",knowledge:undefined}, 
            {name:"Streetwise",skill:"Streetwise",knowledge:undefined},
            {name:"Survey",skill:"Survey",knowledge:undefined},
            {name:"Survival",skill:"Survival",knowledge:undefined},
            {name:"Teacher",skill:"Teacher",knowledge:undefined},
            {name:"Trader",skill:"Trader",knowledge:undefined},
            {name:"Vacc Suit",skill:"Vacc Suit",knowledge:undefined}
        ]; break;
        case "Noble": skills = [
            {name:"Actor",skill:"Actor",knowledge:undefined},
            {name:"Admin",skill:"Admin",knowledge:undefined},
            {name:"Advocate",skill:"Advocate",knowledge:undefined},
            {name:"Artist",skill:"Artist",knowledge:undefined},
            {name:"Astrogator",skill:"Astrogator",knowledge:undefined},
            {name:"Athlete",skill:"Athlete",knowledge:undefined},
            {name:"Author",skill:"Author",knowledge:undefined},
            
            {name:"Biologics",skill:"Biologics",knowledge:undefined},
            {name:"Bureaucrat",skill:"Bureaucrat",knowledge:undefined},
            
            {name:"Chef",skill:"Chef",knowledge:undefined},
            {name:"Comms",skill:"Comms",knowledge:undefined},
            {name:"Counsellor",skill:"Counsellor",knowledge:undefined},
            {name:"Craftsman",skill:"Craftsman",knowledge:undefined},
            
            {name:"Dancer",skill:"Dancer",knowledge:undefined},
            {name:"Diplomat",skill:"Diplomat",knowledge:undefined},
            {name:"Driver",skill:"Driver",knowledge:undefined},
            {name:"Electronics",skill:"Electronics",knowledge:undefined},
            {name:"Engineer",skill:"Engineer",knowledge:undefined},
            
            {name:"Fighter",skill:"Fighter",knowledge:undefined},
            {name:"Fluidics",skill:"Fluidics",knowledge:undefined},
            {name:"Flyer",skill:"Flyer",knowledge:undefined},
            {name:"Forward Observer",skill:"Forward Observer",knowledge:undefined},
            {name:"Gravitics",skill:"Gravitics",knowledge:undefined},
            {name:"Gunner",skill:"Gunner",knowledge:undefined},
            
            {name:"Heavy Weapons",skill:"Heavy Weapons",knowledge:undefined},
            {name:"High-G",skill:"High-G",knowledge:undefined},
            
            {name:"Language",skill:"Language",knowledge:undefined},
            {name:"Leader",skill:"Leader",knowledge:undefined},
            {name:"Liaison",skill:"Liaison",knowledge:undefined},
            
            {name:"Magnetics",skill:"Magnetics",knowledge:undefined},
            {name:"Mechanic",skill:"Mechanic",knowledge:undefined},
            {name:"Medic",skill:"Medic",knowledge:undefined},
            {name:"Musician",skill:"Musician",knowledge:undefined},
            {name:"Navigator",skill:"Navigator",knowledge:undefined},
            {name:"Photonics",skill:"Photonics",knowledge:undefined},
            {name:"Pilot",skill:"Pilot",knowledge:undefined},
            {name:"Polymers",skill:"Polymers",knowledge:undefined},
            {name:"Programmer",skill:"Programmer",knowledge:undefined},
            
            {name:"Recon",skill:"Recon",knowledge:undefined},
            {name:"Sapper",skill:"Sapper",knowledge:undefined},

             // Sciences
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

            {name:"Sensors",skill:"Sensors",knowledge:undefined},
            {name:"Steward",skill:"Steward",knowledge:undefined}, 
            {name:"Strategy",skill:"Strategy",knowledge:undefined},
            {name:"Tactics",skill:"Tactics",knowledge:undefined},
            {name:"Zero-G",skill:"Zero-G",knowledge:undefined},

        ]; break;
        case "Functionary": skills = [
            {name:"Actor",skill:"Actor",knowledge:undefined},
                {name:"Admin",skill:"Admin",knowledge:undefined},
                {name:"Advocate",skill:"Advocate",knowledge:undefined},
                {name:"Animals",skill:"Animals",knowledge:undefined},
                {name:"Artist",skill:"Artist",knowledge:undefined},
                {name:"Astrogator",skill:"Astrogator",knowledge:undefined},
                {name:"Athlete",skill:"Athlete",knowledge:undefined},
                {name:"Author",skill:"Author",knowledge:undefined},

                {name:"Biologics",skill:"Biologics",knowledge:undefined},
                {name:"Broker",skill:"Broker",knowledge:undefined},
                {name:"Bureaucrat",skill:"Bureaucrat",knowledge:undefined},

                {name:"Chef",skill:"Chef",knowledge:undefined},
                {name:"Comms",skill:"Comms",knowledge:undefined},
                {name:"Computer",skill:"Computer",knowledge:undefined},
                {name:"Counsellor",skill:"Counsellor",knowledge:undefined},
                {name:"Craftsman",skill:"Craftsman",knowledge:undefined},
                
                {name:"Dancer",skill:"Dancer",knowledge:undefined},
                {name:"Designer",skill:"Designer",knowledge:undefined},
                {name:"Diplomat",skill:"Diplomat",knowledge:undefined},
                {name:"Driver",skill:"Driver",knowledge:undefined},
                
                {name:"Electronics",skill:"Electronics",knowledge:undefined},
                {name:"Engineer",skill:"Engineer",knowledge:undefined},
                {name:"Explosives",skill:"Explosives",knowledge:undefined},

                {name:"Fighter",skill:"Fighter",knowledge:undefined},

                {name:"Fleet Tactics",skill:"Fleet Tactics",knowledge:undefined},
                {name:"Fluidics",skill:"Fluidics",knowledge:undefined},
                {name:"Flyer",skill:"Flyer",knowledge:undefined},
                {name:"Fwd Obs",skill:"Forward Observer",knowledge:undefined},
                {name:"Forensics",skill:"Forensics",knowledge:undefined},
                
                {name:"Gambler",skill:"Gambler",knowledge:undefined},
                {name:"Gravitics",skill:"Gravitics",knowledge:undefined},
                {name:"Gunner",skill:"Gunner",knowledge:undefined},

                {name:"Heavy Weapons",skill:"Heavy Weapons",knowledge:undefined},
                {name:"High-G",skill:"High-G",knowledge:undefined},
                {name:"Hostile Environ",skill:"Hostile Environ",knowledge:undefined},
                {name:"JOT",skill:"JOT",knowledge:undefined},
                {name:"Language",skill:"Language",knowledge:undefined},
                {name:"Leader",skill:"Leader",knowledge:undefined},
                {name:"Liaison",skill:"Liaison",knowledge:undefined},
                
                {name:"Magnetics",skill:"Magnetics",knowledge:undefined},
                {name:"Mechanic",skill:"Mechanic",knowledge:undefined},
                {name:"Medic",skill:"Medic",knowledge:undefined},
                {name:"Musician",skill:"Musician",knowledge:undefined},
                
                {name:"Naval Architect",skill:"Naval Architect",knowledge:undefined},
                {name:"Navigator",skill:"Navigator",knowledge:undefined},

                {name:"Photonics",skill:"Photonics",knowledge:undefined},
                {name:"Pilot",skill:"Pilot",knowledge:undefined},
                {name:"Polymers",skill:"Polymers",knowledge:undefined},
                {name:"Programmer",skill:"Programmer",knowledge:undefined},
                
                {name:"Recon",skill:"Recon",knowledge:undefined},

                {name:"Sapper",skill:"Sapper",knowledge:undefined},

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

                {name:"Seafarer",skill:"Seafarer",knowledge:undefined},
                {name:"Sensors",skill:"Sensors",knowledge:undefined},
                {name:"Stealth",skill:"Stealth",knowledge:undefined},
                {name:"Steward",skill:"Steward",knowledge:undefined},
                {name:"Strategy",skill:"Strategy",knowledge:undefined},
                {name:"Streetwise",skill:"Streetwise",knowledge:undefined},
                {name:"Survey",skill:"Survey",knowledge:undefined},
                {name:"Survival",skill:"Survival",knowledge:undefined},

                {name:"Tactics",skill:"Tactics",knowledge:undefined},
                {name:"Teacher",skill:"Teacher",knowledge:undefined},
                {name:"Trader",skill:"Trader",knowledge:undefined},

                {name:"Vacc Suit",skill:"Vacc Suit",knowledge:undefined},

                {name:"Zero-G",skill:"Zero-G",knowledge:undefined}
        ]; 
        break;
        case "Any":
            skills = [
                {name:"Actor",skill:"Actor",knowledge:undefined},
                {name:"Admin",skill:"Admin",knowledge:undefined},
                {name:"Advocate",skill:"Advocate",knowledge:undefined},
                {name:"Animals(Rider)",skill:"Animals",knowledge:"Rider"},
                {name:"Animals(Teamster)",skill:"Animals",knowledge:"Teamster"},
                {name:"Animals(Trainer)",skill:"Animals",knowledge:"Trainer"},
                {name:"Artist",skill:"Artist",knowledge:undefined},
                {name:"Astrogator",skill:"Astrogator",knowledge:undefined},
                {name:"Athlete",skill:"Athlete",knowledge:undefined},
                {name:"Author",skill:"Author",knowledge:undefined},

                {name:"Biologics",skill:"Biologics",knowledge:undefined},
                {name:"Broker",skill:"Broker",knowledge:undefined},
                {name:"Bureaucrat",skill:"Bureaucrat",knowledge:undefined},

                {name:"Chef",skill:"Chef",knowledge:undefined},
                {name:"Comms",skill:"Comms",knowledge:undefined},
                {name:"Computer",skill:"Computer",knowledge:undefined},
                {name:"Counsellor",skill:"Counsellor",knowledge:undefined},
                {name:"Craftsman",skill:"Craftsman",knowledge:undefined},
                
                {name:"Dancer",skill:"Dancer",knowledge:undefined},
                {name:"Designer",skill:"Designer",knowledge:undefined},
                {name:"Diplomat",skill:"Diplomat",knowledge:undefined},
                {name:"Driver(ACV)",skill:"Driver",knowledge:"ACV"},
                {name:"Driver(Automotive)",skill:"Driver",knowledge:"Automotive"},
                {name:"Driver(Grav)",skill:"Driver",knowledge:"Grav"},
                {name:"Driver(Legged)",skill:"Driver",knowledge:"Legged"},
                {name:"Driver(Mole)",skill:"Driver",knowledge:"Mole"},
                {name:"Driver(Tracked)",skill:"Driver",knowledge:"Tracked"},
                {name:"Driver(Wheeled)",skill:"Driver",knowledge:"Wheeled"},
                
                {name:"Electronics",skill:"Electronics",knowledge:undefined},
                {name:"Engineer(Jump Drives)",skill:"Engineer",knowledge:"Jump Drives"},
                {name:"Engineer(Life Support)",skill:"Engineer",knowledge:"Life Support"},
                {name:"Engineer(Maneuver Drive)",skill:"Engineer",knowledge:"Maneuver Drive"},
                {name:"Engineer(Power Systems)",skill:"Engineer",knowledge:"Power Systems"},
                {name:"Explosives",skill:"Explosives",knowledge:undefined},

                {name:"Fighter(Battle Dress)",skill:"Fighter",knowledge:"Battle Dress"},
                {name:"Fighter(Beams)",skill:"Fighter",knowledge:"Beams"},
                {name:"Fighter(Blades)",skill:"Fighter",knowledge:"Blades"},
                {name:"Fighter(Exotics)",skill:"Fighter",knowledge:"Exotics"},
                {name:"Fighter(Slug Throwers)",skill:"Fighter",knowledge:"Slug Throwers"},
                {name:"Fighter(Sprays)",skill:"Fighter",knowledge:"Sprays"},
                {name:"Fighter(Unarmed)",skill:"Fighter",knowledge:"Unarmed"},
                {name:"Fleet Tactics",skill:"Fleet Tactics",knowledge:undefined},
                {name:"Fluidics",skill:"Fluidics",knowledge:undefined},
                {name:"Flyer(Aeronautics)",skill:"Flyer",knowledge:"Aeronautics"},
                {name:"Flyer(Grav)",skill:"Flyer",knowledge:"Grav"},
                {name:"Flyer(LTA)",skill:"Flyer",knowledge:"LTA"},
                {name:"Flyer(Rotor)",skill:"Flyer",knowledge:"Rotor"},
                {name:"Flyer(Winged)",skill:"Flyer",knowledge:"Winged"},
                {name:"Fwd Obs",skill:"Forward Observer",knowledge:undefined},
                {name:"Forensics",skill:"Forensics",knowledge:undefined},
                
                {name:"Gambler",skill:"Gambler",knowledge:undefined},
                {name:"Gravitics",skill:"Gravitics",knowledge:undefined},
                {name:"Gunner(Bay Weapons)",skill:"Gunner",knowledge:"Bay Weapons"},
                {name:"Gunner(Ortillery)",skill:"Gunner",knowledge:"Ortillery"},
                {name:"Gunner(Screens)",skill:"Gunner",knowledge:"Screens"},
                {name:"Gunner(Spines)",skill:"Gunner",knowledge:"Screens"},
                {name:"Gunner(Turrets)",skill:"Gunner",knowledge:"Turrets"},

                {name:"Heavy Weapons(Artillery)",skill:"Heavy Weapons",knowledge:"Artillery"},
                {name:"Heavy Weapons(Launcher)",skill:"Heavy Weapons",knowledge:"Launcher"},
                {name:"Heavy Weapons(Ordnance)",skill:"Heavy Weapons",knowledge:"Ordnance"},
                {name:"Heavy Weapons(WMD)",skill:"Heavy Weapons",knowledge:"WMD"},
                {name:"High-G",skill:"High-G",knowledge:undefined},
                {name:"Hostile Environ",skill:"Hostile Environ",knowledge:undefined},

                {name:"Language",skill:"Language",knowledge:undefined},
                {name:"Leader",skill:"Leader",knowledge:undefined},
                {name:"Liaison",skill:"Liaison",knowledge:undefined},
                
                {name:"Magnetics",skill:"Magnetics",knowledge:undefined},
                {name:"Mechanic",skill:"Mechanic",knowledge:undefined},
                {name:"Medic",skill:"Medic",knowledge:undefined},
                {name:"Musician",skill:"Musician",knowledge:undefined},
                
                {name:"Naval Architect",skill:"Naval Architect",knowledge:undefined},
                {name:"Navigator",skill:"Navigator",knowledge:undefined},

                {name:"Photonics",skill:"Photonics",knowledge:undefined},
                {name:"Pilot(Small Craft)",skill:"Pilot",knowledge:"Small Craft"},
                {name:"Pilot(ACS)",skill:"Pilot",knowledge:"ACS"},
                {name:"Pilot(BCS)",skill:"Pilot",knowledge:"BCS"},
                {name:"Polymers",skill:"Polymers",knowledge:undefined},
                {name:"Programmer",skill:"Programmer",knowledge:undefined},
                
                {name:"Recon",skill:"Recon",knowledge:undefined},

                {name:"Sapper",skill:"Sapper",knowledge:undefined},
                {name:"Seafarer(Aquanautics)",skill:"Seafarer",knowledge:"Aquanautics"},
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
                {name:"Seafarer(Aquanautics)",skill:"Seafarer",knowledge:"Aquanautics"},
                {name:"Seafarer(Boat)",skill:"Seafarer",knowledge:"Boat"},
                {name:"Seafarer(Grav)",skill:"Seafarer",knowledge:"Grav"},
                {name:"Seafarer(Ship)",skill:"Seafarer",knowledge:"Ship"},
                {name:"Seafarer(Sub)",skill:"Seafarer",knowledge:"Sub"},
                {name:"Sensors",skill:"Sensors",knowledge:undefined},
                {name:"Stealth",skill:"Stealth",knowledge:undefined},
                {name:"Steward",skill:"Steward",knowledge:undefined},
                {name:"Strategy",skill:"Strategy",knowledge:undefined},
                {name:"Streetwise",skill:"Streetwise",knowledge:undefined},
                {name:"Survey",skill:"Survey",knowledge:undefined},
                {name:"Survival",skill:"Survival",knowledge:undefined},

                {name:"Tactics",skill:"Tactics",knowledge:undefined},
                {name:"Teacher",skill:"Teacher",knowledge:undefined},
                {name:"Trader",skill:"Trader",knowledge:undefined},

                {name:"Vacc Suit",skill:"Vacc Suit",knowledge:undefined},

                {name:"Zero-G",skill:"Zero-G",knowledge:undefined}
            ]
            break;
        }
    var hasExcludedChoice = typeof excludedChoice !== "undefined",
        hasPreferredChoice = typeof preferredChoice !== "undefined";
    if(hasExcludedChoice){
        for(var i = 0, len = skills.length; i < len; i++){
            var skill = skills[i];
            if(skill.name == excludedChoice.name){
                skills.splice(i,1);
                console.log(i);
                break;
            } 
        }
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
        if(hasPreferredChoice && preferredChoice.skill == skills[i].skill){
            if(skills[i].knowledge == preferredChoice.knowledge){
                option.setAttribute("selected","selected");
            }
        }
    }
    dialogCallback = function(){ 
        var option = selector.options[selector.selectedIndex];
        var selectedSkill = option.getAttribute("data-skill");
        var selectedKnowledge = option.getAttribute("data-knowledge");
        if(selectedKnowledge === "undefined"){ selectedKnowledge = undefined;}
        callback({name:selector.value,skill:selectedSkill,knowledge:selectedKnowledge}); };
    dialog.showModal();
}
