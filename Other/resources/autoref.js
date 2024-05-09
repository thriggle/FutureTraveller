import { getRollerFromSeed } from "../../Traveller/js/rnd.js";
import {NameGenerator, addCaps } from "../../Traveller/js/NameGeneratorModule.js";
import { getNames } from "../../Traveller/js/namesModule.js"
var roller = getRollerFromSeed();
var historyContainer = document.querySelector(".history");
var wordMaker;
NameGenerator(getNames(),function(o){
    wordMaker = o; 
    var slctWordCategory = document.getElementById("slctWordCategory");
    var slctSubWordCategory = document.getElementById("slctSubWordCategory");
    var majorKeys = wordMaker.keys.filter((val)=>val.indexOf(".") === -1);
    for(var i = 0, len = majorKeys.length; i < len; i++){
        var key = majorKeys[i];
        var option = slctWordCategory.appendChild(document.createElement("option"));
        option.value = key; option.insertAdjacentHTML("beforeend",key);
    }
    slctWordCategory.addEventListener("change",randomWordCategoryChanged);
    randomWordCategoryChanged();
    function randomWordCategoryChanged(){
        var subKeys = wordMaker.keys.filter((val)=>val.indexOf(slctWordCategory.value +".") === 0);
        var keyDesc = slctWordCategory.value;
        switch(slctWordCategory.value){
            case "word": keyDesc = "Word"; break;
            case "ept": keyDesc = "English Phonotactics"; break;
            case "aslan": keyDesc = "Aslan Word"; break;
            case "human": keyDesc = "Person Name"; break;
            case "ship": keyDesc = "Starship Name"; break;
            case "system": keyDesc = "Mainworld Name"; break;
            case "animal": keyDesc = "Creature"; break;
        }
        document.getElementById("btnGetRandomWord").value = "Get " + keyDesc;
        subKeys.sort();
        while(slctSubWordCategory.childNodes.length > 0){
            slctSubWordCategory.removeChild(slctSubWordCategory.childNodes[slctSubWordCategory.childNodes.length-1]);
        }
        for(var i = 0, len = subKeys.length; i < len; i++){
            var key = subKeys[i];
            var option = slctSubWordCategory.appendChild(document.createElement("option"));
            option.value = key; option.insertAdjacentHTML("beforeend",key);
        }
        document.getElementById("random_word").innerHTML = "";
        document.getElementById("random_subword").innerHTML = "";
    }
    slctSubWordCategory.addEventListener("change",()=>{document.getElementById("random_subword").innerHTML = "";});
    document.getElementById("btnGetRandomWord").addEventListener("click", function(){ document.getElementById("random_word").innerHTML = addCaps(getWord(slctWordCategory.value));});
    document.getElementById("btnGetRandomSubWord").addEventListener("click", function(){ document.getElementById("random_subword").innerHTML = addCaps(getWord(slctSubWordCategory.value));});
},[],Math.random,true);
var randomScene = getRandomScene();

document.getElementById("txtScene").value = randomScene.description;

document.getElementById("txtQuestion").addEventListener("keyup",function(e){
    if(e.key == "Enter" && document.getElementById("txtQuestion").value.length > 0){consultOracle();}
});
document.getElementById("oracleButton").addEventListener("click",consultOracle);
document.getElementById("btnRandomScene").addEventListener("click",function(){
    var randomScene = getRandomScene();
    document.getElementById("txtScene").value = randomScene.description;
});
var menus = document.querySelectorAll("nav.menu ul li a");
for(var i = 0, len = menus.length; i < len; i++){
    var node = menus[i];
    node.addEventListener("click",onNavigate);
}
document.getElementById("btnGet").addEventListener("click", function() {
    var type = document.getElementById("slctType").value;
    document.getElementById("output").innerHTML = getRandomThing(type);
});
document.getElementById("btnMgT2Get").addEventListener("click", function() {
    var type = document.getElementById("slctMgT2Type").value;
    document.getElementById("MgT2output").innerHTML = getMgT2RandomThing(type);
});
var taskComponents = document.querySelectorAll("[data-asset],[data-task],[data-combat]");
for(var i = 0, len = taskComponents.length; i < len; i++){
    taskComponents[i].addEventListener("change",composeTasks);
}
composeTasks();
var firstRoll = true;
        updateRollButton();
        document.getElementById("nD").addEventListener("change", updateRollButton);
        document.getElementById("slctMode").addEventListener("change", function(){
            if(document.getElementById("slctMode").value == "keephigh" || document.getElementById("slctMode").value == "keeplow"){
                document.getElementById("panel_numkeep").style.display = "inline-block";
                document.getElementById("nD").value = 3;
                document.getElementById("nKeep").value = 2;
            }else{
                document.getElementById("panel_numkeep").style.display = "none";
                document.getElementById("nD").value = 2;
            }
            updateRollButton();
        });
        document.getElementById("btnRollFlux").addEventListener("click", function(){
            copyRoll();
            var total = 0;
            var roll = roller.d6().result;
            var output = removeChildElements(document.querySelector("#outputrow .roll_output"));
            var dieblock = output.appendChild(document.createElement("div"));
            dieblock.appendChild(document.createTextNode(roll));
            dieblock.className = "die";
            total += roll;
            output.appendChild(document.createTextNode(" - "));
            roll = roller.d6().result;
            dieblock = output.appendChild(document.createElement("div"));
            dieblock.appendChild(document.createTextNode(roll));
            dieblock.className = "die";
            total -= roll;
            document.querySelector("#outputrow .total").innerHTML = (total >= 0 ? "+" : "") + total;
        });
        document.getElementById("btnRollGoodFlux").addEventListener("click", function(){
            copyRoll();
            var total = 0;
            var rolls = [];
            var output = removeChildElements(document.querySelector("#outputrow .roll_output"));
            for(var i = 0; i < 2; i++){
                var roll = Math.floor(Math.random() * 6) + 1;
                rolls.push(roll);
            }
            rolls.sort(function(a,b){return b-a});
            var total = rolls[0] - rolls[1];
            var dieblock = output.appendChild(document.createElement("div"));
            dieblock.appendChild(document.createTextNode(rolls[0]));
            dieblock.className = "die";
            output.appendChild(document.createTextNode(" - "));
            dieblock = output.appendChild(document.createElement("div"));
            dieblock.appendChild(document.createTextNode(rolls[1]));
            dieblock.className = "die";
            document.querySelector("#outputrow .total").innerHTML = ("+") + total;
        });
        document.getElementById("btnClearHistory").addEventListener("click",function(){
            removeChildElements(document.getElementById("roll_history"));
            removeChildElements(document.getElementById("outputrow"));
            document.getElementById("outputrow").insertAdjacentHTML("afterbegin","<div class=\"roll_output\"><div class=\"die\">?</div></div>=<div class=\"total\">Roll</div>");
            firstRoll = true;
        })
        document.getElementById("btnRollBadFlux").addEventListener("click", function(){
            copyRoll();
            var total = 0;
            var rolls = [];
            var output = removeChildElements(document.querySelector("#outputrow .roll_output"));
            for(var i = 0; i < 2; i++){
                var roll = Math.floor(Math.random() * 6) + 1;
                rolls.push(roll);
            }
            rolls.sort(function(a,b){return a-b});
            var total = rolls[0] - rolls[1];
            var dieblock = output.appendChild(document.createElement("div"));
            dieblock.appendChild(document.createTextNode(rolls[0]));
            dieblock.className = "die";
            output.appendChild(document.createTextNode(" - "));
            dieblock = output.appendChild(document.createElement("div"));
            dieblock.appendChild(document.createTextNode(rolls[1]));
            dieblock.className = "die";
            document.querySelector("#outputrow .total").innerHTML =  total;
        });
        document.getElementById("nKeep").addEventListener("change", updateRollButton);
        document.getElementById("btnRoll").addEventListener("click",function(){
            copyRoll();
            var numDice = document.getElementById("nD").value;
            var mode = document.getElementById("slctMode").value;
            var output = removeChildElements(document.querySelector("#outputrow .roll_output"));
            if(mode === "normal"){
                var total = 0;
                for(var i = 0; i < numDice; i++){
                    var roll = Math.floor(Math.random() * 6) + 1;
                    var dieblock = output.appendChild(document.createElement("div"));
                    dieblock.appendChild(document.createTextNode(roll));
                    dieblock.className = "die";
                    total += roll;
                }               
            }else if(mode === "keephigh"){
                var numKeep = document.getElementById("nKeep").value;
                var rolls = [];
                for(var i = 0; i < numDice; i++){
                    var roll = Math.floor(Math.random() * 6) + 1;
                    rolls.push(roll);
                }
                rolls.sort(function(a,b){return b-a});
                var total = 0;
                for(var i = 0; i < numDice; i++){
                    var dieblock = output.appendChild(document.createElement("div"));
                    dieblock.appendChild(document.createTextNode(rolls[i]));
                    dieblock.className = "die";
                    if(i < numKeep){
                        total += rolls[i];
                    }else{
                        dieblock.classList.add("discarded");
                    }
                }
            }else if(mode === "keeplow"){
                var numKeep = document.getElementById("nKeep").value;
                var rolls = [];
                for(var i = 0; i < numDice; i++){
                    var roll = Math.floor(Math.random() * 6) + 1;
                    rolls.push(roll);
                }
                rolls.sort(function(a,b){return a-b});
                var total = 0;
                for(var i = 0; i < numDice; i++){
                    var dieblock = output.appendChild(document.createElement("div"));
                    dieblock.appendChild(document.createTextNode(rolls[i]));
                    dieblock.className = "die";
                    if(i < numKeep){
                        total += rolls[i];
                    }else{
                        dieblock.classList.add("discarded");
                    }
                }
            }
            document.querySelector("#outputrow .total").innerHTML = total;
        });
        document.getElementById("btnUNE").addEventListener("click",function(){
            document.getElementById("une_npc").innerHTML = une_npc();
        });
        document.getElementById("btnUNEMood").addEventListener("click",function(){
            var relationship = document.getElementById("slctUNERelationship").value;
            document.getElementById("une_mood").innerHTML = getUNEMood(relationship);
        });
        document.getElementById("btnUNEBearing").addEventListener("click",function(){
            var bearing = document.getElementById("slctUNEBearing").value;
            document.getElementById("une_bearing").innerHTML = getUNEBearing(bearing);
        });
function logHistory(msg){
    var record = historyContainer.appendChild(document.createElement("li"));
    record.insertAdjacentHTML("beforeend",msg);
}
function getWord(key){
    return wordMaker.getRandomName(key);
}
function onNavigate(e){
    var target = e.target.getAttribute("target");
    if(target){
        var current = document.querySelector("nav.menu ul li a.selected");
        current.classList.remove(current.className);
        e.target.classList.add("selected");
        document.querySelector("[data-nav='"+current.getAttribute("target")+"']").style.display = "none";
        document.querySelector("[data-nav='"+target+"']").style.display = "block";
    }
}
function getScene(){
    return document.getElementById("scene").value;
}
function getSurge(){
   return +( document.getElementById("surge").innerHTML );
}
function setSurge(num){
    document.getElementById("surge").innerHTML = num;
}
function consultOracle(){
        var roll = roller.random()*100 + 1 >> 0;
        var surge = getSurge();
        if(roll > 50){ roll = roll + surge; }else{ roll = roll - surge;}
        var scene = getScene();
        var thresholds = [];
        switch(scene){
            case "To Knowledge": 
                thresholds = [96,86,81,51,21,16,6,1];
                break;
            case "To Conflict": 
                thresholds = [99,95,85,51,17,7,3,1];
                break;
            case "To Endings": 
                thresholds = [100,99,81,51,21,3,2,1];
                break;
        }
        var result = "";
        var unexpected = false;
        var resetSurge = false;
        if(roll >= thresholds[0]){
            unexpected = true;
            resetSurge = true;
            result = "Yes, and unexepectedly " + getUnexpectedly();
        }else if(roll >= thresholds[1]){
            resetSurge = true;
            result = "Yes, but ";
        }else if(roll >= thresholds[2]){
            resetSurge = true;
            result = "Yes, and ";
        }else if(roll >= thresholds[3]){
            result = "Yes";
        }else if(roll >= thresholds[4]){
            result = "No";
        }else if(roll >= thresholds[5]){
            result = "No, and ";
            resetSurge = true;
        }else if(roll >= thresholds[6]){
            result = "No, but ";
            resetSurge = true;
        }else{
            resetSurge = true;
            unexpected = true;
            result = "No, and unexpectedly " + getUnexpectedly();
        }
        var txtQuestion = document.getElementById("txtQuestion");
        if(resetSurge){ 
            setSurge(0); 
            logHistory( "<b>"+txtQuestion.value + "</b><br/>" + result +"<br/><textarea></textarea>");
        }else{
            setSurge(surge + 2);
            logHistory( "<b>"+txtQuestion.value + "</b><br/>" + result);
        }    
        txtQuestion.value = "";
    
}
function getUnexpectedly(){
    var roll = roller.random()*20 + 1 >> 0;
    var result = "";
    switch(roll){
        case 1: result = "<b>foreshadowing</b> (set a thread to be the main thread for the next scene; the current scene should then start wrapping up)"; break;
        case 2: result = "<b>tying off</b> (the main thread resolves or substantially moves forward in this scene by narrative decree)"; break;
        case 3: result = "<b>to conflict</b> (the next scene centers on a conflict of your choosing; set the main elements of the next scene, and start heading toward them in this scene.)";  break;
        case 4: result = "<b>costume change</b> (an NPC drastically changes their mind, motivations, alliances, etc. for better or worse)"; break;
        case 5: result = "<b>key grip</b> (set the location or general elements for the next scene; the current scene should then start wrapping up)"; break;
        case 6: result = "<b>to knowledge</b> (the next scene centers on lore or investigation of your choosing; set the main elements of the next scene, and start heading toward them in this scene)";  break;
        case 7: result = "<b>framing</b> (an npc or object becomes critical to the main thread)"; break;
        case 8: result = "<b>set change</b> (scene continues in another location; the current thread remains as much as makes sense)"; break;
        case 9: result = "<b>upstaged</b> (an NPC makes a big move; if the NPC has any motivations, plot vectors, or goals they go into overdrive)"; break;
        case 10: result = "<b>pattern change</b> (the main thread gets modified, drastically; whatever direction the main thread was heading, make a hard left.)"; break;
        case 11: result = "<b>limelit</b> (the rest of the scene goes great for the PCs; assume majority of questions pertaining to the main thread with regard to the scene are answered in a beneficial way)"; break;
        case 12: result = "<b>entering the red</b> (threat of danger or combat arrives)"; break;
        case 13: result = "<b>to endings</b> (the next scene resolves or substantially moves forward a thread of your choosing; set the main elements of the next scene, and start heading toward them in this scene)";  break;
        case 14: result = "<b>montage</b> (the timeframe of the scene changes to a montage of actions set across various scenes to move forward)"; break;
        case 15: result = "<b>enter stage left</b> (a PC or NPC arrives fresh in the scene)"; break;
        case 16: result = "<b>cross stitch</b> (choose another thread to be the main thread for the rest of the scene)"; break;
        case 17: result = "<b>six degrees</b> (a meaningful, but not always positive, connection forms between two PCs/NPCs)"; break;
        case 18: result = "<b>Bad Scene</b> (potential for Mishaps in this scene; check item QREBs: Potential failure if Reliability<=Flux, warning signs if Flux<=Safety) "; break;
        case 19: result = "<b>Bad Scene</b> (potential for Mishaps in this scene; check item QREBs: Potential failure if Reliability<=Flux, warning signs if Flux<=Safety) "; break;
        case 20: result = "<b>Theme Injection: "+getTheme()+"</b>"; break;
    }
    return result;
}
function getTheme(){
    var themes = [
        ["Justice","Happiness","Kindness","Honesty","Truthfulness","Cleanliness"],
        ["Loyalty","Cheerfulness","Trustworthiness","Admiration","Friendliness","Novelty"],
        ["Awe","Human Frailty","Bravery","Bizarreness","Thriftiness","Profitability"],
        ["Danger","Paranoia","Pursuit","Revenge","Humiliation","Improbability"],
        ["Laziness","Heroism","Escape","Deception","Conformity","Extremes"],
        ["Betrayal","Disappointment","Unreliability","Stupidity","Confusion","Chaos"]
    ]
    return themes[d6()-1][d6()-1];
    
}
function getRandomScene(){
    var description = "";
    var thread = "";
    var location = ""
    switch(roller.d6().result){
        case 1: location = "a bar"; break;
        case 2: location = "the wilderness"; break;
        case 3: location = "almost total darkness"; break;
        case 4: location = "a corridor"; break;
        case 5: location = "a city"; break;
        case 6: location = "a jail cell"; break;
    }
    description = "You find yourself in " + location+". ";
    var senses = "";
    var senseRoll1, senseRoll2; 
    var priorSenseRoll1, priorSenseRoll2;
    var numRolls = 2, rollCount = 0;
    while(rollCount < numRolls){
        senseRoll1 = roller.d6().result, senseRoll2 = roller.d6().result;
        if(priorSenseRoll1 == senseRoll1){
            senseRoll1 = roller.d6().result;
        }
        while(priorSenseRoll1 == senseRoll1 && priorSenseRoll2 == senseRoll2){
            senseRoll1 = roller.d6().result, senseRoll2 = roller.d6().result;
        }
        rollCount += 1;
        var item;
        switch(senseRoll1){
            case 1: senses = "sight"; 
            switch(senseRoll2){
                case 1: item = "someone watching you"; thread = "The stranger"; break;
                case 2: item = "someone's personal belongings"; thread = "The missing belongings"; break;
                case 3: item = "an animal"; thread = "The beast"; break;
                case 4: item = "a wallet"; thread = "The missing wallet"; break;
                case 5: item = "a crowd of people"; thread = "The gathering crowd"; break;
                case 6: item = "a weapon"; thread = "The weapon"; break;
            }
            description += "You see " + item +". "; 
            break;
            case 2: senses = "sound"; 
            switch(senseRoll2){
                case 1: item = "dripping water"; thread = "The water"; break;
                case 2: item = "an alarm sounding"; thread = "The alarm"; break;
                case 3: item = "an eerie silence"; thread = "The silence"; break;
                case 4: item = "what sounds like music"; thread = "The music"; break;
                case 5: item = "people talking"; thread = "The discussion"; break;
                case 6: item = "gunfire"; thread = "The shooting"; break;
            }
            description += "You hear " + item +". "; 
            break;
            case 3: senses = "smell"; 
            switch(senseRoll2){
                case 1: item = "animals"; thread = "The beasts"; break;
                case 2: item = "perfume"; thread = "The perfume"; break;
                case 3: item = "smoke"; thread = "The smoke"; break;
                case 4: item = "something delicious"; thread = "The feast"; break;
                case 5: item = "exhaust fumes"; thread = "The fumes"; break;
                case 6: item = "sweat"; thread = "The perspiration"; break;
            }
            description += "You detect the scent of " + item +". "; 
            break;
            case 4: senses = "touch"; 
            switch(senseRoll2){
                case 1: item = "the sores on your wrists where you were recently bound"; thread = "The escape"; break;
                case 2: item = "the weight of something in your pocket"; thread = "The burden"; break;
                case 3: item = "a dull vibration beneath your feet"; thread = "The vibration"; break;
                case 4: item = "your wet clothes sticking to your skin"; thread = "The drench"; break;
                case 5: item = "broken glass beneath your feet"; thread = "The broken glass"; break;
                case 6: item = "blood seeping from a wound"; thread = "The wound"; break;
            }
            description += "You feel " + item +". "; 
            break;
            case 5: senses = "temperature"; 
            switch(senseRoll2){
                case 1: item = "an unusual stillness in the air"; thread = "The stillness"; break;
                case 2: item = "a frigid wind"; thread = "The cold"; break;
                case 3: item = "an oppressive heat"; thread = "The heat"; break;
                case 4: item = "the heat from a fire"; thread = "The fire"; break;
                case 5: item = "lightheaded from lack of oxygen"; thread = "The breath"; break;
                case 6: item = "delirious with fever"; thread = "The fever"; break;
            }
            description += "You feel " + item +". ";
            break;
            case 6: senses = "taste"; 
             numRolls += 1;
            break;
        }
        priorSenseRoll1 = senseRoll1;
        priorSenseRoll2 = senseRoll2;
    }
    return{description,thread};
}
function d6() {
    return roller.d6().result;
}
function flux(){
   return d6() - d6();
}
function posFlux(){
    var d1 = d6(), d2 = d6();
    return d1 > d2 ? d1 - d2 : d2 - d1;
}
function negFlux(){
    var d1 = d6(), d2 = d6();
    return d1 > d2 ? d2 - d1 : d1 - d2;
}
function getRandomThing(type){
    var val = "";
    var list = {
        "Range":{
            "selection":"flux",
            "options":[
                "0 - Contact", "R - Reading", "T - Talking",
                "1 - Vshort",  "2 - Short", "3 - Medium",
                "4 - Long", "5 - Vlong", "6 - Distant",
                "7 - Vdistant", "8 - Orbit"
            ]
        },
        "Environ":{
            "selection":"flux",
            "options":[
                "Frigid", "Vcold", "Cold",
                "Chilly",  "Cool", 
                "Nice",
                "Warm", "VWarm", "Hot",
                "Vhot", "Scalding"
            ]
        },
        "Damage":{
            "selection":"d6",
            "options":[
                "Slight 1D",
                "Light 2D",
                "Serious 3D",
                "Critical 4D",
                "Intense 5D",
                "Disastrous 6D"
            ]
        },
        "Diagnosis":{
            "selection":"d6",
            "options":[
                "Ordinary 1D",
                "Hard 2D",
                "Difficult 3D",
                "Obscure 4D",
                "Very Obscure 5D",
                "Hopeless 6D"
            ]
        },
        "Comms":{
            "selection":"flux",
            "options":[
                "Jammed", "Equip Fault", "Equip Glitch",
                "Interference",  "Static", 
                "Good",
                "Very Good", "Excellent", "Clear",
                "Very Clear", "Crystal Clear"
            ]
        },
        "Nobility":{
            "selection":"flux",
            "options":[
                "A - Gentleman", "B - Knight", "c - Baronet",
                "C - Baron",  "D - Marquis", 
                "e - Viscount",
                "E - Count", "f - Minor Duke", "F - Duke",
                "G - Archduke", "h - Imperial Family"
            ]
        },
        "Friends":{
            "selection":"flux",
            "options":[
                "Enemy", "Antagonist", "Adversary",
                "Rival",  "Opponent", 
                "Acquaintance",
                "Contact", "Friend", "Companion",
                "Fast Friend", "Best Friend"
            ]
        },
        "Weather":{
            "selection":"flux",
            "options":[
                "Extremely Bad", "Very Bad", "Worse",
                "Bad",  "Inconvenient", 
                "Neutral",
                "Fortuitous", "Good", "Better",
                "Very Good", "Extremely Good"
            ]
        },
        "Supply":{
            "selection":"flux",
            "options":[
                "-5 Ubiquitous", "-4 Abundant", "-3 Very Common",
                "-2 Quite Common",  "-1 Common", 
                "0 -Typical",
                "+1 Uncommon", "+2 Scarce", "+3 Rare",
                "+4 Quite Rare", "+5 -Truly Rare"
            ]
        },
        "Demand":{
            "selection":"flux",
            "options":[
                "-5 Very Low", "-4 Quite Low", "-3 Low",
                "-2 Weak",  "-1 Less Ordinary", 
                "0 Ordinary",
                "+1 Good", "+2 Strong", "+3 High",
                "+4 Quite High", "+5 Very High"
            ]
        },
        "Respect":{
            "selection":"flux",
            "options":[
                "Ignored", "Utter Contempt", "Contempt",
                "Distaste",  "Tolerance", 
                "Peer",
                "Acknowledgement", "Respect", "Admiration",
                "Absolute Respect", "Idolization"
            ]
        },
    };
    switch(type){
        case "crime":
            val = getRandomCrime();
            break;
        case "majortheme":
            val = getRandomMajorTheme();
            break;
        case "theme":
            val = getRandomTheme();
            break;
        case "devicedamagelocation":
            val = getDeviceDamageLocation();
            break;
        case "tooldamagelocation":
            val = getToolDamageLocation();
            break;
        case "weapondamagelocation":
            val = getWeaponDamageLocation();
            break;
        case "heavyweapondamagelocation":
            val = getHeavyWeaponDamageLocation();
            break;
        case "vehicledamagelocation":
            val = getVehicleDamageLocation();
            break;
        case "anatomicaldamagelocation":
            val = getAnatomicalDamageLocation();
            break;
        case "biologicaldamagelocation":
            val = getBiologicalDamageLocation();
            break;
        case "visibility":
            val = getRandomVisibility();
            break;
        case "temperature":
            val = getRandomTemperature();
            break;
        case "attitude":
            val = getRandomAttitude();
            break;
        case "typicaltech":
            val = getTypicalTechCategory();
            break;
        case "hightech":
            val = getHighTechCategory();
            break;
        case "XHigh":
        case "UHigh":
        case "VHigh":
        case "High":
        case "Med":
        case "Low":
        case "VLow":
            val = type + " (" + getTL(type) + ")";
            break;
        case "Fantastic":
            val = type + " (" + getTL(d6() % 2 == 0 ? "Fantastic1" : "Fantastic2") + ")";
            break;
        default:
            if(typeof list[type] !== "undefined"){
                var sublist = list[type];
                var roll = 0;
                var selectionMode = sublist["selection"];
                if(selectionMode == "flux"){
                    roll = roller.flux().result;
                    roll += 5;
                    roll = roll.toString();
                }else if(selectionMode == "d6"){
                    roll = roller.d6().result - 1;
                    roll = roll.toString();
                }
                val = sublist["options"][roll]
            }
    }
    return val;
}
function getRandomAttitude(){
    var attitudes = [
        "Dismissive",
        "Unenthusiastic",
        "Unsupportive",
        "Unhelpful",
        "Indifferent",
        "Helpful",
        "Interested",
        "Individualist",
        "Supportive",
        "Attentive",
        "Enthusiastic"
    ]
    return attitudes[flux()+5];
}

function getDeviceDamageLocation(){
    var locations = ["Case","Power","Input","Output","Controls","Processor"];
    return locations[d6()-1];
}
function getToolDamageLocation(){
    var locations = ["Case","Power","Adjuster","Toolhead","Grip","Safety"];
    return locations[d6()-1];
}
function getWeaponDamageLocation(){
    var locations = ["Frame","Ammunition","Sights","Barrel","Grip","Mechanism"];
    return locations[d6()-1];
}
function getAnatomicalDamageLocation(){
    var locations = [
        "Head",
        "Head",
        "Limb-Group-1",
        "Limb-Group-2",
        "Torso",
        "Torso",
        "Torso",
        "Limb-Group-3",
        "Limb-Group-4",
        "Graze",
        "Graze"
    ];
    return locations[d6()+d6()-2];
}
function getBiologicalDamageLocation(){
    var locations = [
        "Brain",
        "Senses",
        "Circulation",
        "Skeleton",
        "Respiration",
        "Skin",
        "Digestion",
        "Elimination",
        "Muscle",
        "Skin",
        "Skin"
    ]
    return locations[d6()+d6()-2];
}
function getVehicleDamageLocation(){
    var locations =[
        "Controls",
        "Interior",
        "Visor",
        "Protections",
        "Life Support",
        "Locomotion",
        "Power",
        "Torso",
        "Manipulators",
        "Navigation",
        "Computer"
    ]
    return locations[d6()+d6()-2];
}
function getHeavyWeaponDamageLocation(){
    var locations = [
        "Controls",
        "Mount",
        "Sights",
        "Shields",
        "Stocks",
        "Barrel",
        "Power",
        "Frame",
        "Ammunition",
        "Mechanism",
        "Computer"
    ];
    return locations[d6()+d6()-2];
}
function getRandomCrime(){
    var intensity = d6()-1, type = d6()-1;
    var intensities = [" gaffe","n infraction"," misdemeanor"," felony"," high crime","n atrocity"];
    var types = ["property","the environment","sophonts","society","justice","doctrine"];
    var crimes = [
        ["Misuse","Vandalism","Damage","Theft","Destruction","Havoc"],
        ["Litter","Waste","Damage","Pollution","Ravage","Ruin"],
        ["Offense","Insult","Assault","Mayhem","Killing","Mass Killing"],
        ["Disharmony","Rudeness","Slack","Dishonor","Treason","High Treason"],
        ["a Mistake","Inattention","Inaction","False Witness","Injustice","Tyranny"],
        ["Ignorance","Questioning","Heterodoxy","Blasphemy","Heresy","Mass Deception"]
    ];
    return "The crime is "+crimes[type][intensity]+", a" + intensities[intensity] + " against " + types[type] + ".";
}
function getRandomMajorTheme(){
    var themes = [
        ["Justice","Happiness","Kindness","Honesty","Truthfulness","Cleanliness"],
        ["Loyalty","Cheerfulness","Trustworthiness","Admiration","Friendliness","Novelty"],
        ["Awe","Human Frailty","Bravery","Bizarreness","Thriftiness","Profitability"],
        ["Danger","Paranoia","Pursuit","Revenge","Humiliation","Improbability"],
        ["Laziness","Heroism","Escape","Deception","Conformity","Extremes"],
        ["Betrayal","Disappointment","Unreliability","Stupidity","Confusion","Chaos"]
    ]
    return themes[d6()-1][d6()-1];
}
function getRandomTheme(){
    var themes = [
        [
            ["Justice","Happiness","Kindness","Honesty","Truthfulness","Cleanliness"],
            ["Abandonment","Absurdity","Accidents","Adorability","Agility","Air"],
            ["Ambiguity","Arrogance","Art","Averageness","Beauty","Billigerance"],
            ["Bewilderment","Bigness","Blue","Boorishness","Boredom","Brawn"],
            ["Breakability","Bullying","Calm","Cautiousness","Charity","Charm"],
            ["Cheapness","Chivalry","Cleverness","Clutter","Conspiracy","Comfort"]
        ],
        [
            ["Loyalty","Cheerfulness","Trustworthiness","Admiration","Friendliness","Novelty"],
            ["Contagion","Coordination","Courtesy","Crabbiness","Craftsmanship","Cumbrousness"],
            ["Death","Defectiveness","Derangement","Desertion","Diligence","Disagreeability"],
            ["Disgust","Distraction","Duplicity","Dystopia","Efficiency","Endurance"],
            ["Energy","Erraticism","Extra-Large","Extra-Small","Faded","Faithfulness"],
            ["Faithlessness","Speed","Fear","Fierceness","Filthyness","Fire"]
        ],
        [
            ["Awe","Human Frailty","Bravery","Bizarreness","Thriftiness","Profitability"],
            ["Flawlessness","Flimsiness","Foolhardiness","Fragility","Franticness","Freezing"],
            ["Fright","Fuzziness","Gaudiness","Goofiness","Gracefulness","Grandiosity"],
            ["Grief","Gruesomeness","Hard-to-Find","Harshness","Hedonism","Hellish"],
            ["Helpful","Helpless","Hissing","Hope","Huge","Icky"],
            ["Ignorant","Impolite","Incompetent","Intelligence","Invicible","Irate"]
        ],
        [
            ["Danger","Paranoia","Pursuit","Revenge","Humiliation","Improbability"],
            ["Jobless","Jumbled","Knowledge","Knowledgeable","Labored","Lackadaisical"],
            ["Loud","Lucky","Ludicrous","Macabre","Maddening","Majestic"],
            ["Makeshift","Materialistic","Mediocrity","Mercy","Military","Morality"],
            ["Muddled","Murky","Mysterious","Naive","Noisy","Obnoxious"],
            ["Obsolete","Old","Ordinary","Pacifistic","Painful","Painstaking"]
        ],
        [
            ["Laziness","Heroism","Escape","Deception","Conformity","Extremes"],
            ["Patriotism","Peaceful","Perfidy","Pricey","Principle","Puzzling"],
            ["Quaint","Quarrelsome","Quiet","Quirky","Red","Redundant"],
            ["Repulsive","Resolute","Responsibility","Rotten","Sacrifice","Scary"],
            ["Science","Secretive","Shiny","Silent","Slippery","Spring"],
            ["Storms","Strange","Strength","Sudden","Summer","Suspicious"]
        ],
        [
            ["Betrayal","Disappointment","Unreliability","Stupidity","Confusion","Chaos"],
            ["Tedious","Thirsty","Tiresome","Traitorous","Treason","Ubiqutious"],
            ["Unarmed","Unique","Unwieldy","Utopian","Vagabond","Valuable"],
            ["Vast","Vigor","Violent","Voiceless","Wasteful","Water"],
            ["Weak","Weary","Wet","Wholesale","Wild","Winter"],
            ["Wisdom","Wonderful","Worthless","Wrong","Young","Zany"]
        ]
    ]
    return themes[d6()-1][d6()-1][d6()-1];
}
function getTypicalTechCategory(){
    var roll = posFlux();
    switch(roll){
        case 0: var techCategory = "Med"; /*"XHigh"*/; var tl = getTL(techCategory); break;
        case 1: var techCategory = "High";/* "VHigh"*/; var tl = getTL(techCategory); break;
        case 2: var techCategory = "Low"; /*"High"*/; var tl = getTL(techCategory); break;
        case 3: var techCategory = "VLow";/* "Med"*/; var tl = getTL(techCategory); break;
        case 4: var techCategory = "VHigh"; /*"Low"*/; var tl = getTL(techCategory); break;
        case 5: var techCategory = "XHigh";/* "VLow"*/; var tl = getTL(techCategory); break;
    }
    return techCategory + " (" + tl + ")";
}
function getHighTechCategory(){
    var roll = posFlux();
    switch(roll){
        case 0: 
        var techCategory = "High"; var tl = getTL(techCategory); break;
        case 1: 
        var techCategory = "VHigh"; var tl = getTL(techCategory); break;
        case 2: 
        var techCategory = "XHigh"; var tl = getTL(techCategory); break;
        case 3: 
        var techCategory = "UHigh"; var tl = getTL(techCategory); break;
        case 4: 
        var techCategory = "Fantastic"; var tl = getTL(techCategory+"1"); break;
        case 5: 
        var techCategory = "Fantastic"; var tl = getTL(techCategory+"2"); break;
    }
    return techCategory + " (" + tl + ")";
}
function getTL(category){
    var roll = d6();
    var TL = 0;
    switch(category){
        case "VLow": 
            switch(roll){
                case 1: TL = 0; break;
                case 2: TL = 1; break;
                case 3: TL = 1.3; break;
                case 4: TL = 1.6; break;
                case 5: TL = 2; break;
                case 6: TL = 3; break;
            }
            break;
        case "Low": 
            switch(roll){
                case 1: TL = 3.3; break;
                case 2: TL = 3.6; break;
                case 3: TL = 4; break;
                case 4: TL = 5; break;
                case 5: TL = 6; break;
                case 6: TL = 7; break;
            }
            break;
        case "Med": 
            switch(roll){
                case 1: TL = 6; break;
                case 2: TL = 7; break;
                case 3: TL = 8; break;
                case 4: TL = 8.5; break;
                case 5: TL = 9; break;
                case 6: TL = 10; break;
            }
            break;
            case "High": 
            switch(roll){
                case 1: TL = 9; break;
                case 2: TL = 10; break;
                case 3: TL = 11; break;
                case 4: TL = 12; break;
                case 5: TL = 12.5; break;
                case 6: TL = 13; break;
            }
            break;
            case "VHigh": 
            switch(roll){
                case 1: TL = 12; break;
                case 2: TL = 13; break;
                case 3: TL = 14; break;
                case 4: TL = 15; break;
                case 5: TL = 15.5; break;
                case 6: TL = 16; break;
            }
            break;
        case "XHigh": 
            switch(roll){
                case 1: TL = 15; break;
                case 2: TL = 16; break;
                case 3: TL = 17; break;
                case 4: TL = 18; break;
                case 5: TL = 18.5; break;
                case 6: TL = 19; break;
            }
            break;
            case "UHigh": 
            switch(roll){
                case 1: TL = 18; break;
                case 2: TL = 19; break;
                case 3: TL = 20; break;
                case 4: TL = 21; break;
                case 5: TL = 21.5; break;
                case 6: TL = 22; break;
            }
            break;
            case "Fantastic1": 
            switch(roll){
                case 1: TL = 22; break;
                case 2: TL = 23; break;
                case 3: TL = 24; break;
                case 4: TL = 25; break;
                case 5: TL = 26; break;
                case 6: TL = 27; break;
            }
            break;
        case "Fantastic2": 
            switch(roll){
                case 1: TL = 28; break;
                case 2: TL = 29; break;
                case 3: TL = 30; break;
                case 4: TL = 31; break;
                case 5: TL = 32; break;
                case 6: TL = 33; break;
            }
            break;
    }
    return TL;
}
function getMgT2RandomThing(key){
    var lists = {
        "Passenger":[
            "Refugee - Political",
            "Refugee - Economic",
            "Starting a New Life Offworld",
            "Mercenary",
            "Spy",
            "Corporate Executive",
            "Out to See the Universe",
            "Tourist (1-3: Irritating, 4-6: Charming)",
            "Wide-Eyed Yokel",
            "Adventurer",
            "Explorer",
            "Claustrophobic",
            "Expectant Mother",
            "Wants to Stowaway or Join the Crew",
            "Possesses Something Dangerous or Illegal",
            "Causes Trouble (1-3: Drunkard, 4-5: Violent, 6: Insane)",
            "Unusually Pretty or Handsome",
            "Engineer (Mechanic and Engineer 1D-1 each)",
            "Ex-Scout",
            "Wanderer",
            "Thief or Other Criminal",
            "Scientist",
            "Journalist or Researcher",
            "Entertainer (Steward and Perform 1D-1 each)",
            "Gambler (Gambler 1D-1)",
            "Rich Noble - Complains a Lot",
            "Rich Noble - Eccentric",
            "Rich Noble - Raconteur",
            "Diplomat on a Mission",
            "Agent on a Mission",
            "Patron",
            "Alien",
            "Bounty Hunter",
            "On the Run",
            "Wants to be on Board the Travellers' Ship for Some Reason",
            "Hijacker or Pirate Agent"
        ],
        "CommonTradeGood":[
            "Common Electronics",
            "Common Industrial Goods",
            "Common Manufactured Goods",
            "Common Raw Materials",
            "Common Consumables",
            "Common Ore"
        ],
        "TradeGood":[
        "Common Electronics",
            "Common Industrial Goods",
            "Common Manufactured Goods",
            "Common Raw Materials",
            "Common Consumables",
            "Common Ore",
            "Advanced Electronics",
            "Advanced Machine Parts",
            "Advanced Manufactured Goods",
            "Advanced Weapons",
            "Advanced Vehicles",
            "Biochemicals",
            "Crystals and Gems",
            "Cybernetics",
            "Live Animals",
            "Luxury Consumables",
            "Medical Supplies",
            "Petrochemicals",
            "Pharmaceuticals",
            "Polymers",
            "Precious Metals",
            "Radioactives",
            "Robots",
            "Spices",
            "Textiles",
            "Uncommon Ore",
            "Uncommon Raw Materials",
            "Wood",
            "Vehicles",
            "Illegal Biochemicals",
            "Cybernetics, Illegal",
            "Drugs, Illegal",
            "Luxuries, Illegal",
            "Weapons, Illegal",
            "Exotics"
        ],
        "AllyEnemy":[
            "Naval officer",
            "Imperial diplomat",
            "Crooked trader",
            "Medical doctor",
            "Eccentric scientist",
            "Mercenary",
            "Famous performer",
            "Alien thief",
            "Free trader",
            "Explorer",
            "Marine captain",
            "Corporate executive",
            "Researcher",
            "Culturalattaché",
            "Religious leader",
            "Conspirator",
            "Rich noble",
            "Artificial intelligence",
            "Bored noble",
            "Planetary governor",
            "Inveterate gambler",
            "Crusading journalist",
            "Doomsday cultist",
            "Corporate agent",
            "Criminal syndicate",
            "Military governor",
            "Army quartermaster",
            "Private investigator",
            "Starport administrator",
            "Retired admiral",
            "Alien ambassador",
            "Smuggler",
            "Weapons inspector",
            "Elder stateman",
            "Planetary warlord",
            "Imperial agent"
        ],
        "CharacterQuirk":[
            "Loyal",
            "Distracted by other worries",
            "In debt to criminals",
            "Makes very bad jokes",
            "Will betray characters",
            "Aggressive",
            "Has secret allies",
            "Secret anagathic user",
            "Looking for something",
            "Helpful",
            "Forgetful",
            "Wants to hire the Travellers",
            "Has useful contacts",
            "Artistic",
            "Easily confused",
            "Unusually ugly",
            "Worried about current situation",
            "Shows pictures of their children",
            "Rumour-monger",
            "Unusually provincial",
            "Drunkard or drug addict",
            "Grovernment informant",
            "Mistakes a Traveller for someone else",
            "Possesses unusually advanced technology",
            "Unusually handsome or beautiful",
            "Spying on the Travellers",
            "Possesses TAS membership",
            "Is secretly hostile towards the Travellers",
            "Wants to borrow money",
            "Is convinced the Travellers are dangerous",
            "Involved in political intrigue",
            "Has a dangerous secret",
            "Wants to get off planet as soon as possible",
            "Attracted to a Traveller",
            "From offworld",
            "Possesses telepathy or other unusual quality"
        ],
        "Starport": // starport encounters
        [
            "Maintenance robot at work",
            "Trade ship arrives or departs",
            "Captain argues about fuel prices",
            "News report about pirate activity on a starport screen draws a crowd",
            "Bored clerk makes life difficult for the Travellers",
            "Local merchant with cargo to transport seeks a ship",
            "Dissident tries to claim sanctuary from planetary authorities",
            "Traders from offworld argue with local brokers",
            "Technician repairing starport computer system",
            "Reporter asks for news from offworld",
            "BIzarre cultural performance",
            "Patron argues with another group of Travellers",
            "Military vessel arrives or departs",
            "Demonstration outside starport",
            "Escaped prisoners beg for passage offworld",
            "Impromptu bazaar of bizarre items",
            "Security patrol",
            "Unusual alien",
            "Traders offer spare parts and supplies at cut-price rates",
            "Repair yard catches fire",
            "Passenger liner arrives or departs",
            "Servant robot offers to guide Travellers around the spaceport",
            "Trader from a distant system selling strange curios",
            "Old crippled belter asks for spare change and complains about drones taking their job",
            "Patron offers the Travellers a job",
            "Passenger looking for a ship",
            "Religious pilgrims try to convert the Travellers",
            "Cargo hauler arrives or departs",
            "Scout ship arrives or departs",
            "Illegal or dangerous goods are impounded",
            "Pickpocket tries to steal from the Travellers",
            "Drunken crew pick a fight",
            "Government officials investigate the characters",
            "Random security sweep scans Travellers and their baggage",
            "Starport is temporarily shut down for security reasons",
            "Damaged ship makes emergency docking"
        ],
        "Rural":[
            "Wild animal",
            "Agricultural robots",
            "Crop sprayer drone flies overhead",
            "Damaged agricultural robot being repaired",
            "Small, isolationist community",
            "Noble hunting party",
            "Wild animal",
            "Local landing field",
            "Lost child",
            "Travelling merchant caravan",
            "Cargo convoy",
            "Police chase",
            "Wild animal",
            "Telecommunications black spot",
            "Security patrol",
            "Military facility",
            "Bar or waystation",
            "Grounded spacecraft",
            "Wild animal",
            "Small community - quiet place to live",
            "Small community - on a trade route",
            "Small community - festival in progress",
            "Small community - in danger",
            "Small community - not what it seems",
            "Wild animal",
            "Unusual weather",
            "Difficult terrain",
            "Unusual creature",
            "Isolated homestead - welcoming",
            "Isolated homestead - unfriendly",
            "Wild animal",
            "Private villa",
            "Monastery or retreat",
            "Experimental farm",
            "Ruined structure",
            "Research facility"
        ],
        "Urban":[
            "Street riot in progress",
            "Travellers pass a charming restaurant",
            "Trader in illegal goods",
            "Public argument",
            "Sudden change of weather",
            "Travellers are asked for help",
            "Travellers pass a bar or pub",
            "Travellers pass a theatre or other entertainment venue",
            "Curiosity shop",
            "Street market stall tries to sell the Travellers something",
            "Fire, dome breach or other emergency in progress",
            "Attempted robbery of the Travellers",
            "Vehicle accident involving the Travellers",
            "Low-flying spacecraft flies overhead",
            "Alien or other offworlder",
            "Random character bumps into a Traveller",
            "Pickpocket",
            "Media team or journalist",
            "Security patrol",
            "Ancient building or archive",
            "Festival",
            "Someone is following the characters",
            "Unusual cultural group or event",
            "Planetary official",
            "Travellers spot someone they recognise",
            "Public demonstration",
            "Robot or other servant passes Travelelrs",
            "Prospective patron",
            "Crime such as robbery or attack in progress",
            "Street preacher rants at the Travellers",
            "News broadcast on public screens",
            "Sudden curfew or other restriction on movement",
            "Unusually empty or quiet street",
            "Public announcement",
            "Sports event",
            "Imperial dignitary"
        ],
        "Patron":[
            "Assassin",
            "Smuggler",
            "Terrorist",
            "Embezzler",
            "Thief",
            "Revolutionary",
            "Clerk",
            "Administrator",
            "Mayor",
            "Minor Noble",
            "Physician",
            "Tribal Leader",
            "Diplomat",
            "Courier",
            "Spy",
            "Ambassador",
            "Noble",
            "Police Officer",
            "Merchant",
            "Free Trader",
            "Broker",
            "Corporate Executive",
            "Corporate Agent",
            "Financier",
            "Belter",
            "Researcher",
            "Naval Officer",
            "Pilot",
            "Startport Administrator",
            "Scout",
            "Alien",
            "Playboy",
            "Stowaway",
            "Family Relative",
            "Agent of Foreign Power",
            "Imperial Agent"
        ],
        "Mission":[
            "Assassinate a target",
            "Frame a target",
            "Destroy a target",
            "Steal from a target",
            "Aid in burglary",
            "Stop a burglary",
            "Retrieve data or an object from a secure facility",
            "Discredit a target",
            "Find a lost cargo",
            "Find a lost person",
            "Deceive a target",
            "Sabotage a target",
            "Transport goods",
            "Transport a person",
            "Transport data",
            "Transport goods secretly",
            "Transport goods quickly",
            "Transport dangerous goods",
            "Investigate a crime",
            "Investigate a theft",
            "Investigate a murder",
            "Investigate a mystery",
            "Investigate a target",
            "Investigate an event",
            "Join an expedition",
            "Survey a planet",
            "Explore a new system",
            "Explore a ruin",
            "Salvage a ship",
            "Capture a creature",
            "Hijack a ship",
            "Entertain a noble",
            "Protect a target",
            "Save a target",
            "Aid a target",
            "It's a trap - the patron intends to betray the Traveller"
        ],
        "Target":[
            "Common Trade Goods",
            "Common Trade Goods",
            "Random Trade Goods",
            "Random Trade Goods",
            "Illegal Trade Goods",
            "Illegal Trade Goods",
            "Computer Data",
            "Alien Artefact",
            "Personal Effects",
            "Work of Art",
            "Historical Artefact",
            "Weapon",
            "Starport",
            "Asteroid Base",
            "City",
            "Research station",
            "Bar or Nightclub",
            "Medical Facility",
            "Random Patron",
            "Random Patron",
            "Random Patron",
            "Random Ally/Enemy",
            "Random Ally/Enemy",
            "Random Ally/Enemy",
            "Local Government",
            "Planetary Government",
            "Corporation",
            "Imperial Intelligence",
            "Criminal Syndicate",
            "Criminal Gang",
            "Free Trader",
            "Yacht",
            "Cargo Hauler",
            "Police Cutter",
            "Space Station",
            "Warship"
        ],
        "Opposition":[
            "Animals",
            "Large animal",
            "Bandits and thieves",
            "Fearful peasants",
            "Local authorities",
            "Local lord",
            "Criminals - thugs or corsairs",
            "Criminals - thieves or saboteurs",
            "Police - ordinary security forces",
            "Police - inspectors and detectives",
            "Corporate - agents",
            "Corporate - legal",
            "Starport security",
            "Imperial marines",
            "Interstellar corporation",
            "Alien - private citizen or corporation",
            "Alien - government",
            "Space travellers or rival ship",
            "Target is in deep space",
            "Target is in orbit",
            "Hostile weather conditions",
            "Dangerous organisms or radiation",
            "Target is in a dangerous region",
            "Target is in a restricted area",
            "Target is under electronic observation",
            "Hostile guard robots or ships",
            "Biometric identification required",
            "Mechanical failure or computer hacking",
            "Travellers are under surveillance",
            "Out of fuel or ammunition",
            "Police investigation",
            "Legal barriers",
            "Nobility",
            "Government officials",
            "Target is protected by a third party",
            "Hostages"
        ]
    };
    var list = lists[key];
    var value = list[roller.random()*list.length >> 0];
    return value;
}
        
function updateRollButton(){
    var btn = document.getElementById("btnRoll");
    var mode = document.getElementById("slctMode").value;
    var numDice = document.getElementById("nD").value;
    var numKeep =document.getElementById("nKeep").value;
    if(numDice > 0){
        btn.disabled = false;
    }else{
        btn.disabled = true;
    }
    var text = "Roll " + numDice + "d6";
    if(mode == "keephigh"){
        text += "k" + numKeep;
    }else if(mode == "keeplow"){
        text += "r" + (-1*(numKeep - numDice));
    }
    btn.value = text;
}
function removeChildElements(element){
    while(element.childNodes.length > 0){
        element.removeChild(element.childNodes[element.childNodes.length-1]);
    }
    return element;
}
function copyRoll(){
    if(!firstRoll){
        var history = document.getElementById("roll_history");
        history.insertAdjacentHTML("afterbegin",document.getElementById("outputrow").innerHTML);
        history.insertAdjacentHTML("afterbegin","<hr>");
    }else{
        firstRoll = false;
    }
}

function une_npc(){
    var modifiers = [
        "superfluous",
        "addicted",
        "conformist",
        "nefarious",
        "sensible",
        "untrained",
        "romantic",
        "unreasonable",
        "skilled",
        "neglectful",
        "lively",
        "forthright",
        "idealistic",
        "unsupportive",
        "rational",
        "coarse",
        "foolish",
        "cunning",
        "delightful",
        "miserly",
        "inept",
        "banal",
        "logical",
        "subtle",
        "reputable",
        "wicked",
        "lazy",
        "pessimistic",
        "solemn",
        "habitual",
        "meek",
        "helpful",
        "unconcerned",
        "generous",
        "docile",
        "cheery",
        "pragmatic",
        "serene",
        "thoughtful",
        "hopeless",
        "pleasant",
        "insensitive",
        "titled",
        "inexperienced",
        "prying",
        "oblivious",
        "refined",
        "indispensible",
        "scholarly",
        "conservative",
        "uncouth",
        "willful",
        "indifferent",
        "fickle",
        "elderly",
        "sinful",
        "naive",
        "privileged",
        "glum",
        "likable",
        "lethargic",
        "defiant",
        "obnoxious",
        "insightful",
        "tactless",
        "fanatic",
        "plebeian",
        "childish",
        "pious",
        "uneducated",
        "inconsiderate",
        "cultured",
        "revolting",
        "curious",
        "touchy",
        "needy",
        "dignified",
        "pushy",
        "kind",
        "corrupt",
        "jovial",
        "shrewd",
        "compliant",
        "destitute",
        "conniving",
        "careful",
        "alluring",
        "defective",
        "optimistic",
        "affluent",
        "despondent",
        "mindless",
        "passionate",
        "devoted",
        "established",
        "unseemly",
        "dependable",
        "righteous",
        "confident"
    ];
var nouns = [
    "gypsy",
    "witch",
    "merchant",
    "expert",
    "commoner",
    "judge",
    "ranger",
    "occultist",
    "reverend",
    "thug",
    "drifter",
    "journeyman",
    "statesman",
    "astrologer",
    "duelist",
    "jack-of-all-trades",
    "aristocrat",
    "preacher",
    "artisan",
    "rogue",
    "missionary",
    "outcast",
    "caretaker",
    "hermit",
    "orator",
    "chieftain",
    "pioneer",
    "burglar",
    "vicar",
    "officer",
    "explorer",
    "warden",
    "outlaw",
    "adept",
    "bum",
    "sorcerer",
    "laborer",
    "master",
    "ascendant",
    "villager",
    "magus",
    "conscript",
    "worker",
    "actor",
    "herald",
    "highwayman",
    "fortune-hunter",
    "governor",
    "scrapper",
    "monk",
    "homemaker",
    "recluse",
    "steward",
    "polymath",
    "magician",
    "traveler",
    "vagrant",
    "apprentice",
    "politician",
    "mediator",
    "crook",
    "civilian",
    "activist",
    "hero",
    "champion",
    "cleric",
    "slave",
    "gunman",
    "clairvoyant",
    "patriarch",
    "shopkeeper",
    "crone",
    "adventurer",
    "soldier",
    "entertainer",
    "craftsman",
    "scientist",
    "ascetic",
    "superior",
    "performer",
    "magister",
    "serf",
    "brute",
    "inqisitor",
    "lord",
    "villain",
    "professor",
    "servant",
    "charmer",
    "globetrotter",
    "sniper",
    "courtier",
    "priest",
    "tradesman",
    "hitman",
    "wizard",
    "beggar",
    "tradesman",
    "warrior"
];
var modifier = modifiers[roller.random() * modifiers.length >> 0];
var noun = nouns[roller.random() * nouns.length >> 0];

var motivations = [
    ["advises","obtains","attempts","spoils","oppresses","interacts","creates","abducts","promotes","conceives","blights","progresses","distresses","possesses","records","embraces","contacts","pursues","associates with","prepares"],
    ["shepherds","abuses","indulges","chronicles","fulfills","drives","reviews","aids","follows","advances","guards","conquers","hinders","plunders","constructs","encourages","agonizes","comprehends","administers","relates"],
    ["takes","discovers","deters","acquires","damages","publicizes","burdens","advocates","implements","understands","collaborates","strives","completes","compels","joins","assists","defiles","produces","institutes","accounts"],
    ["works","accompanies","offends","guides","learns","persecutes","communicates","processes","reports","develops","steals","suggests","weakens","achieves","secures","informs","patronizes","depresses","determines","seeks"],
    ["manages","suppresses","proclaims","operates","accesses","refines","composes","undermines","explains","discourages","attends","detects","executes","maintains","realizes","conveys","robs","establishes","overthrows","supports"]
];
var motivationCol1 = roller.random() * motivations.length >> 0;
var motivationCol2 = roller.random() * motivations.length >> 0;
var motivationCol3 = roller.random() * motivations.length >> 0;

var motiveVerb1 = motivations[motivationCol1][roller.random() * motivations[motivationCol1].length >> 0];
var motiveVerb2 = motivations[motivationCol2][roller.random() * motivations[motivationCol1].length >> 0];
var motiveVerb3 = motivations[motivationCol3][roller.random() * motivations[motivationCol1].length >> 0];

var motiveNouns = [
    ["wealth","hardship","affluence","resources","prosperity","poverty","opulence","deprivation","success","distress","contraband","music","literature","technology","alcohol","medicines","beauty","strength","intelligence","force"],
    ["the wealthy","the populace","enemies","the public","religion","the poor","family","the elite","academia","the forsaken","the law","the government","the oppressed","friends","criminals","allies","secret societies","the world","military","the church"],
    ["dreams","discretion","love","freedom","pain","faith","slavery","enlightenment","racism","sensuality","dissonance","peace","discrimination","disbelief","pleasure","hate","happiness","servitude","harmony","justice"],
    ["gluttony","lust","envy","greed","laziness","wrath","pride","purity","moderation","vigilance","zeal","composure","charity","modesty","atrocities","cowardice","narcissism","compassion","valor","patience"],
    ["advice","propaganda","science","knowledge","communications","lies","myths","riddles","stories","legends","industry","new religions","progress","animals","ghosts","magic","nature","old religions","expertise","spirits"]
]
var motiveNounCol1 = roller.random() * motivations.length >> 0;
var motiveNounCol2 = roller.random() * motivations.length >> 0;
var motiveNounCol3 = roller.random() * motivations.length >> 0;

var motiveNoun1 = motiveNouns[motiveNounCol1][roller.random() * motivations[motiveNounCol1].length >> 0];
var motiveNoun2 = motiveNouns[motiveNounCol2][roller.random() * motivations[motiveNounCol1].length >> 0];
while(motiveNounCol2 == motiveNounCol1){ motiveNounCol2 = roller.random() * motivations.length >> 0; }
var motiveNoun3 = motiveNouns[motiveNounCol3][roller.random() * motivations[motiveNounCol1].length >> 0];
while(motiveNounCol3 == motiveNounCol1 || motiveNounCol3 == motiveNounCol2){ motiveNounCol3 = roller.random() * motivations.length >> 0; }

return modifier + " " + noun + ", "
    + motiveVerb1 + " " + motiveNoun1 + ", "
    + motiveVerb2 + " " + motiveNoun2 + ", and "
    + motiveVerb3 + " " + motiveNoun3 + ".";
}
function getUNEMood(relationship){
    var moodRoll = roller.random()*100 + 1 >> 0;
    var moodThresholds = [];
    switch(relationship){
        case "loved": moodThresholds = [1,6,16,31,70,85]; break;
        case "friendly": moodThresholds = [2,8,20,40,76,89]; break;
        case "peaceful": moodThresholds = [3,11,25,55,82,93]; break;
        case "neutral": moodThresholds = [5,15,30,60,85,95]; break;
        case "distrustful": moodThresholds = [7,18,46,76,90,97]; break;
        case "hostile": moodThresholds = [11,24,61,81,93,98]; break;
        case "hated": moodThresholds = [15,30,69,84,94,99]; break;
    }
    var mood = "";
    if(moodRoll <= moodThresholds[0]){ mood = "withdrawn"; }
    else if(moodRoll <= moodThresholds[1]){ mood = "guarded";}
    else if(moodRoll <= moodThresholds[2]){ mood = "cautious";}
    else if(moodRoll <= moodThresholds[3]){ mood = "neutral";}
    else if(moodRoll <= moodThresholds[4]){ mood = "sociable";}
    else if(moodRoll <= moodThresholds[5]){ mood = "helpful";}
    else{ mood = "forthcoming";}
    return mood;
}
function getUNEBearing(bearing){
    if(typeof bearing == "undefined" || bearing == "random"){
        var classRoll = roller.random() * 100 + 1 >> 0;
        if(classRoll <= 12){ 
            bearing = "scheming";
        }else if(classRoll <= 24){
            bearing = "insane";
        }else if (classRoll <= 36){
            bearing = "friendly";
        }else if(classRoll <= 49){
            bearing = "hostile";
        }else if(classRoll <= 62){
            bearing = "inquisitive";
        }else if(classRoll <= 75){
            bearing = "knowing";
        }else if(classRoll <= 88){
            bearing = "mysterious";
        }else{
            bearing = "prejudiced";
        }
    }
    var bearingTopicRoll = roller.random() * 100 + 1 >> 0;
    var bearingTopics = [];
    switch(bearing){
        case "scheming": bearingTopics = ["intent","bargain","means","proposition","plan","compromise","agenda","arrangement","negotiation","plot"]; break;
        case "insane": bearingTopics = ["madness","fear","accident","chaos","idiocy","illusion","turmoil","confusion","facade","bewilderment"]; break;
        case "friendly": bearingTopics = ["alliance","comfort","gratitude","shelter","happiness","support","promise","delight","aid","celebration"]; break;
        case "hostile": bearingTopics = ["death","capture","judgment","combat","surrender","rage","resentment","submission","injury","destruction"]; break;
        case "inquisitive": bearingTopics = ["questions","investigation","interest","demand","suspicion","request","curiosity","skepticism","command","petition"]; break;
        case "knowing": bearingTopics = ["report","effects","examination","records","account","news","history","telling","discourse","speech"]; break;
        case "mysterious": bearingTopics = ["rumor","uncertainty","secrets","misdirection","whispers","lies","shadows","enigma","obscurity","conundrum"]; break;
        case "prejudiced": bearingTopics = ["reputation","doubt","bias","dislike","partiality","belief","view","discrimination","assessment","difference"]; break;
    }
    var bearingTopic = "";
    if(bearingTopicRoll <= 10){ bearingTopic = bearingTopics[0]; }
    else if(bearingTopicRoll <= 20){ bearingTopic = bearingTopics[1];}
    else if(bearingTopicRoll <= 30){ bearingTopic = bearingTopics[2];}
    else if(bearingTopicRoll <= 40){ bearingTopic = bearingTopics[3];}
    else if(bearingTopicRoll <= 50){ bearingTopic = bearingTopics[4];}
    else if(bearingTopicRoll <= 60){ bearingTopic = bearingTopics[5];}
    else if(bearingTopicRoll <= 70){ bearingTopic = bearingTopics[6];}
    else if(bearingTopicRoll <= 80){ bearingTopic = bearingTopics[7];}
    else if(bearingTopicRoll <= 90){ bearingTopic = bearingTopics[8];}
    else if(bearingTopicRoll <= 100){ bearingTopic = bearingTopics[9];}
    var focusRoll = roller.random()*100 + 1 >> 0;
    var topicFocus = "";
    if(focusRoll <= 3){ topicFocus = "current scene"; }
    else if(focusRoll <= 6){ topicFocus = "last story"; }
    else if(focusRoll <= 9){ topicFocus = "equipment"; }
    else if(focusRoll <= 12){ topicFocus = "parents"; }
    else if(focusRoll <= 15){ topicFocus = "history"; }
    else if(focusRoll <= 18){ topicFocus = "retainers"; }
    else if(focusRoll <= 21){ topicFocus = "wealth"; }
    else if(focusRoll <= 24){ topicFocus = "relics"; }
    else if(focusRoll <= 27){ topicFocus = "last action"; }
    else if(focusRoll <= 30){ topicFocus = "skills"; }
    else if(focusRoll <= 33){ topicFocus = "superiors"; }
    else if(focusRoll <= 36){ topicFocus = "fame"; }
    else if(focusRoll <= 39){ topicFocus = "campaign"; }
    else if(focusRoll <= 42){ topicFocus = "future action"; }
    else if(focusRoll <= 45){ topicFocus = "friends"; }
    else if(focusRoll <= 48){ topicFocus = "allies"; }
    else if(focusRoll <= 51){ topicFocus = "last scene"; }
    else if(focusRoll <= 54){ topicFocus = "contacts"; }
    else if(focusRoll <= 57){ topicFocus = "flaws"; }
    else if(focusRoll <= 60){ topicFocus = "antagonist"; }
    else if(focusRoll <= 63){ topicFocus = "rewards"; }
    else if(focusRoll <= 66){ topicFocus = "experience"; }
    else if(focusRoll <= 69){ topicFocus = "knowledge"; }
    else if(focusRoll <= 72){ topicFocus = "recent scene"; }
    else if(focusRoll <= 75){ topicFocus = "community"; }
    else if(focusRoll <= 78){ topicFocus = "treasure"; }
    else if(focusRoll <= 81){ topicFocus = "the character"; }
    else if(focusRoll <= 84){ topicFocus = "current story"; }
    else if(focusRoll <= 87){ topicFocus = "family"; }
    else if(focusRoll <= 90){ topicFocus = "power"; }
    else if(focusRoll <= 93){ topicFocus = "weapons"; }
    else if(focusRoll <= 96){ topicFocus = "previous scene"; }
    else{ topicFocus = "enemy"; }
    var topic = "speaks of " + bearingTopic + " regarding " + topicFocus;
    return "<b>"+bearing+"</b>: " + topic;
}
function composeTasks(){
    var characteristic = +(document.querySelector("[data-asset='characteristic']").value);
    var skill = +(document.querySelector("[data-asset='skill']").value);
    var other = +(document.querySelector("[data-asset='other']").value);
   
    var equipmentquality = +(document.querySelector("[data-asset='equipmentquality']").value);
    var equipmentease = +(document.querySelector("[data-asset='equipmentease']").value);
    
    var assetValue = characteristic + skill + other + equipmentease + equipmentquality - 5;

    var jot = +(document.querySelector("[data-asset='jot']").value);
    var strWakefulness = (document.querySelector("[data-asset='wakefulness']").value);
    
    var tasktarget = assetValue;
    var taskhaste = document.querySelector("[data-task='haste']").value;
    var taskdifficulty = +(document.querySelector("[data-task='difficulty']").value);
    var taskmods = +(document.querySelector("[data-task='mods']").value);
    var tasktih = false;
    if(taskdifficulty > skill + jot){ taskdifficulty += 1; tasktih = true;}
    switch(taskhaste){
        case "XHasty": taskdifficulty += 2; if(strWakefulness == "optimal"){ tasktarget += 1; }else if(strWakefulness == "tired" || strWakefulness == "sleepy"){ tasktarget -= 1;} break;
        case "Hasty": taskdifficulty += 1; if(strWakefulness == "optimal"){ tasktarget += 1; }else if(strWakefulness == "tired" || strWakefulness == "sleepy"){ tasktarget -= 1;} break;
        case "Standard": break;
        case "Cautious": taskdifficulty -=1; if(strWakefulness == "optimal"){ tasktarget += 1; }else if(strWakefulness == "tired" || strWakefulness == "sleepy"){ tasktarget -= 1;} break;
    }
    tasktarget += taskmods;
    document.querySelector("[data-formula='task']").innerHTML = taskdifficulty + "D"+(tasktih ? "*" : "")+" <= " + tasktarget + " ("+getOdds(taskdifficulty,tasktarget)+"%)";

    var combattarget = assetValue;
    var attackerstatus = +(document.querySelector("[data-asset='attackerstatus']").value);
    combattarget += attackerstatus;
    var combatattackerspeed = +(document.querySelector("[data-combat='attackerspeed']").value);
    var combattargetspeed = +(document.querySelector("[data-combat='targetspeed']").value);
    var combatmode = document.querySelector("[data-combat='mode']").value;
    var combatsize = +(document.querySelector("[data-combat='size']").value);
    var combatrange = +(document.querySelector("[data-combat='range']").value);
    var combatstance = +(document.querySelector("[data-combat='stance']").value);
    var combatcover = +(document.querySelector("[data-combat='cover']").value);
    var combatconcealment = +(document.querySelector("[data-combat='concealment']").value);
    var combattargetaction = +(document.querySelector("[data-combat='targetaction']").value);
    
    var combatdifficulty = combatrange;
    if(combatdifficulty == 0){combatdifficulty = 1;}
    var combattih = false;
    if(combatdifficulty > skill + jot){ combatdifficulty += 1; combattih = true;}
    switch(combatmode){
        case "Aimed": combatdifficulty -= 1; if(strWakefulness == "optimal"){ combattarget += 1; }else if(strWakefulness == "tired" || strWakefulness == "sleepy"){ combattarget -= 1;} break;
        case "Standard": break;
        case "Snapfire": combatdifficulty += 1; if(strWakefulness == "optimal"){ combattarget += 1; }else if(strWakefulness == "tired" || strWakefulness == "sleepy"){ combattarget -= 1;} break;
    }
    var targeteffectivesize = Math.max(combatsize + combatstance - combatrange - combatcover - combatconcealment + combattargetaction,0);
    combatdifficulty += combatattackerspeed;
    combatdifficulty += combattargetspeed;
    combattarget += targeteffectivesize;

    document.querySelector("[data-formula='combat']").innerHTML = (combatattackerspeed >= 2 && combatmode == "Aimed") ? "Cannot aim while running" : combatdifficulty + "D"+(combattih ? "*" : "")+" <= " + combattarget + " ("+getOdds(combatdifficulty,combattarget)+"%)";
    document.querySelector("[data-formula='targetsize']").innerHTML = "Target apparent size=" +  targeteffectivesize + (targeteffectivesize == 0 ? " (invisible)":"");
    document.querySelector("[data-formula='taskwarning']").innerHTML = (tasktih ? "*This is Hard! " : "") + (strWakefulness === "sleepy" ? "Sleepy: Check C3 before any task." : "");
    document.querySelector("[data-formula='combatwarning']").innerHTML = (combattih ? "*This is Hard! " : "") + (strWakefulness === "sleepy" ? "Sleepy: Check C3 before any task." : "");
}
function getOdds(numberOfDice,targetNumber){
    console.log(numberOfDice);
    console.log(targetNumber);
    // Initialize a 2D array to store probabilities
    const dp = new Array(numberOfDice + 1).fill(0).map(() => new Array(targetNumber + 1).fill(0));

    // Base case: If no dice, probability of sum <= 0 is 1
    for (let i = 0; i <= targetNumber; i++) {
        dp[0][i] = 1;
    }

    // Fill in the DP table
    for (let i = 1; i <= numberOfDice; i++) {
        for (let j = 1; j <= targetNumber; j++) {
            // Probability of rolling 1 to 6 on the current die
            for (let face = 1; face <= 6; face++) {
                if (j - face >= 0) {
                    dp[i][j] += dp[i - 1][j - face];
                }
            }
        }
    }

    // Calculate the overall probability
    const totalOutcomes = Math.pow(6, numberOfDice);
    const favorableOutcomes = dp[numberOfDice][targetNumber];
    const probability = favorableOutcomes / totalOutcomes;

    // Convert to percentage
    const percentage = probability * 100;

    return percentage.toFixed(2);
}