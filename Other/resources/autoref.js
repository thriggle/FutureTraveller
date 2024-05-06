import { getRollerFromSeed } from "../../Traveller/js/rnd.js";
var roller = getRollerFromSeed();
var historyContainer = document.querySelector(".history");
function logHistory(msg){
    var record = historyContainer.appendChild(document.createElement("li"));
    record.insertAdjacentHTML("beforeend",msg);
}
var randomScene = getRandomScene();

document.getElementById("txtScene").value = randomScene.description;
document.getElementById("txtThread").value = randomScene.thread;

function getScene(){
    return document.getElementById("scene").value;
}
function getSurge(){
   return +( document.getElementById("surge").innerHTML );
}
function setSurge(num){
    document.getElementById("surge").innerHTML = num;
}
document.getElementById("txtQuestion").addEventListener("keyup",function(e){
    if(e.key == "Enter" && document.getElementById("txtQuestion").value.length > 0){consultOracle();}
});
document.getElementById("oracleButton").addEventListener("click",consultOracle);
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
            logHistory( "<b>"+txtQuestion.value + "</b><br/>" + result +"<textarea></textarea>");
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
        case 1: result = "foreshadowing (set a thread to be the main thread for the next scene; the current scene should then start wrapping up)"; break;
        case 2: result = "tying off (the main thread resolves or substantially moves forward in this scene by narrative decree)"; break;
        case 3: result = "to conflict (the next scene centers on a conflict of your choosing; set the main elements of the next scene, and start heading toward them in this scene.)";  break;
        case 4: result = "costume change (an NPC drastically changes their mind, motivations, alliances, etc. for better or worse)"; break;
        case 5: result = "key grip (set the location or general elements for the next scene; the current scene should then start wrapping up)"; break;
        case 6: result = "to knowledge (the next scene centers on lore or investigation of your choosing; set the main elements of the next scene, and start heading toward them in this scene)";  break;
        case 7: result = "framing (an npc or object becomes critical to the main thread)"; break;
        case 8: result = "set change (scene continues in another location; the current thread remains as much as makes sense)"; break;
        case 9: result = "upstaged (an NPC makes a big move; if the NPC has any motivations, plot vectors, or goals they go into overdrive)"; break;
        case 10: result = "pattern change (the main thread gets modified, drastically; whatever direction the main thread was heading, make a hard left.)"; break;
        case 11: result = "limelit (the rest of the scene goes great for the PCs; assume majority of questions pertaining to the main thread with regard to the scene are answered in a beneficial way)"; break;
        case 12: result = "entering the red (threat of danger or combat arrives)"; break;
        case 13: result = "to endings (the next scene resolves or substantially moves forward a thread of your choosing; set the main elements of the next scene, and start heading toward them in this scene)";  break;
        case 14: result = "montage (the timeframe of the scene changes to a montage of actions set across various scenes to move forward)"; break;
        case 15: result = "enter stage left (a PC or NPC arrives fresh in the scene)"; break;
        case 16: result = "cross stitch (choose another thread to be the main thread for the rest of the scene)"; break;
        case 17: result = "seix degrees (a meaningful, but not always positive, connection forms between two PCs/NPCs)"; break;
        case 18: result = "re-roll/reserved"; break;
        case 19: result = "re-roll/reserved"; break;
        case 20: result = "re-roll/reserved"; break;
    }
    return result;
}
document.getElementById("btnAddThread").addEventListener("click",addThread);
document.getElementById("txtThread").addEventListener("keyup",function(e){
    if(e.key == "Enter" && document.getElementById("txtThread").value.length > 0){addThread();}
});
function addThread(){
    var newThread = document.getElementById("txtThread").value;
    var option = document.getElementById("thread").appendChild(document.createElement("option"));
    option.value = newThread;
    option.innerHTML = newThread;
    document.getElementById("txtThread").value = "";
}
document.getElementById("btnRandomScene").addEventListener("click",function(){
    var randomScene = getRandomScene();
    document.getElementById("txtScene").value = randomScene.description;
    document.getElementById("txtThread").value = randomScene.thread;
});
document.getElementById("describeScene").addEventListener("click",function(){
    logHistory("SCENE: " + document.getElementById("txtScene").value)
});
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