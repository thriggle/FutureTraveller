import { ENUM_SKILLS } from "./skills.js";
import { ENUM_CHARACTERISTICS } from "./species.js";

export function renderCharacter(character,element){
    console.log(character.getHistory());
    injectHTML("[data-name]",renderName);
    injectHTML("[data-ageblock]",ageBlock);
    injectHTML("[data-statblock]",statBlock)
    injectHTML("[data-skillblock]",skillBlock);
    injectHTML("[data-awards]",awards);
    history(character,document.querySelectorAll("[data-history]"));
    injectHTML("[data-careers]",careers);
    injectHTML("[data-credits]",renderCredits);
    function injectHTML(selector,htmlfunc){
        var elements = document.querySelectorAll(selector);
        for(var i = 0, len = elements.length; i < len; i++){
            clearElement(elements[i]);
            htmlfunc(character,elements[i]);
        }
    }
}
function careers(character,element){
    var careers = character.getCareers();
    for(var i =0, len = careers.length; i < len; i++){
        element.insertAdjacentHTML("beforeend","<div>"+careers[i].career+", " + careers[i].terms + " terms</div>");
    }
}
function renderName(character,element){
    element.insertAdjacentHTML("beforeend","<span>"+ character.getName() + "</span>");
}
function renderCredits(character,element){
    element.insertAdjacentHTML("beforeend","<span>Cr"+ character.getCredits() + "</span>");
}
function history(character, elements){
    var events = character.getHistory();
    for(var j = 0, jlen = elements.length; j < jlen; j++){
        var element = elements[j];
  
            
                clearElement(element);
                // clear history and start over
                var lastAge = "Age 0";
                for(var i = 0, len = events.length; i < len; i++){
                    var eventSplit = events[i].match(/(Age \d*):(.*)/);
                    var age = eventSplit[1];
                    var isNewAge = false;
                    if(age != lastAge){
                        console.log(age);
                        console.log(lastAge);
                        lastAge = age;
                        isNewAge = true;
                    }
                    var eventText = eventSplit[2];
                    var isGain = eventText.indexOf("Gained ") >= 0;
                    var isPass = eventText.indexOf("? PASS") >= 0;
                    var isFail = eventText.indexOf("? FAIL") >= 0;
                    var isLoss = eventText.indexOf(" reduced to ") >= 0;
                    var isAging = eventText.indexOf("Aging check") >= 0;
                    element.insertAdjacentHTML("beforeend","<div class=\"event"+(isNewAge ? " newage" : "")+(isGain ? " Gain" : "")+(isPass ? " Pass" : "")+(isFail ? " Fail" : "")+(isLoss ? " Loss" : "")+(isAging ? " Aging" : "")+"\"><div class=\"event_index\">"+i+"</div><div class=\"event_age\">"+eventSplit[1]+"</div> <div class=\"event_text\">"+eventSplit[2]+"</div> </div>");  
                }
            
        
    }
}
export function clearElement(el) {
    while (el.children.length > 0) {
        el.removeChild(el.children[el.children.length - 1]);
    }
}
function awards(character,element){
    var awards = character.getAwards();
    element.insertAdjacentHTML("beforeend","<div>" + awards.map((val,i,arr)=>{return "<span class=\"award\" >"+val + (i==arr.length-1?" ":", ")+"</span>"}).join("") + "<div>");
    var majors = character.getMajorsLabels();
    if(awards.length > 0 && majors.length > 0){
        element.insertAdjacentHTML("beforeend","<hr/>");
    }
    if(majors.length > 0){
        element.insertAdjacentHTML("beforeend","<div> Majors: " + majors.join(", ") + "<div>");
    }
    var minors = character.getMinorsLabels();
    if(majors.length > 0 && minors.length > 0){
        element.insertAdjacentHTML("beforeend","<hr/>");
    }
    if(minors.length > 0){
        element.insertAdjacentHTML("beforeend","<div> Minors: " + minors.join(", ") + "<div>");
    }
    
}
function ageBlock(character,element){
    var ageHTML = "<span>"+character.getAge() + " years</span>";
    element.insertAdjacentHTML("beforeend",ageHTML);
}
function statBlock(character,element){
    var statHTML = "<ul>";
    for(var i = 0; i < 6; i++){
        statHTML += "<li> "+ character.characteristics[i].name +": " + character.characteristics[i].value +" </li>";
    }
    statHTML += "</ul>";
    statHTML += "<span>Genetics: " + character.getGenetics().join(",")+"</span>";
    element.insertAdjacentHTML("beforeend",statHTML);
}
function skillBlock(character,element){
    var statHTML = "<ul>";
    var skills = Object.keys(character.skills).sort();
    var nativeLanguage = character.getNativeLanguage(), nativeLanguageLevel = character.getNativeLanguageLevel()
    for(var i = 0, len = skills.length; i < len; i++){
        var skill = skills[i];
        statHTML += "<li> "+ skill +": " + (character.skills[skill].Skill >= 0 ? character.skills[skill].Skill : "n/a")
        if(character.skills[skill].Knowledge){
            statHTML += "<ul>";
            var knowledges = Object.keys(character.skills[skill].Knowledge).sort();
            for(var j = 0, jlen = knowledges.length; j < jlen; j++){
                var k = knowledges[j];
                if(skill == ENUM_SKILLS.Language && k === nativeLanguage){
                    statHTML += "<li> "+ k +": " + nativeLanguageLevel;
                }else{
                    statHTML += "<li> "+ k +": " + (character.skills[skill].Knowledge[k] );
                }
            }
            statHTML += "</ul>";
        }
        statHTML +=" </li>";
    }
    statHTML += "</ul>";
    element.insertAdjacentHTML("beforeend",statHTML);
}