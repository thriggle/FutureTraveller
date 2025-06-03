import { ENUM_CAREERS } from "./careers.js";
import { ENUM_SKILLS } from "./skills.js";
import { ENUM_CHARACTERISTICS } from "./species.js";

export function renderCharacter(character,element){
    injectHTML("[data-name]",renderName);
    injectHTML("[data-ageblock]",ageBlock);
    injectHTML("[data-statblock]",statBlock)
    injectHTML("[data-skillblock]",skillBlock);
    injectHTML("[data-awards]",awards);
    history(character,document.querySelectorAll("[data-history]"));
    injectHTML("[data-careers]",careers);
    injectHTML("[data-credits]",renderCredits);
    injectHTML("[data-gender]",renderGender);
    injectHTML("[data-score]",renderScore);
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
        var rank = "";
        if(careers[i].rank){
            switch(careers[i].career){
                case ENUM_CAREERS.Spacer: 
                    rank = (careers[i].rank.officer>0 ? "O"+careers[i].rank.officer : ("R"+careers[i].rank.enlisted));
                    rank = "-"+rank;
                    break;
                case ENUM_CAREERS.Soldier: 
                    rank = (careers[i].rank.officer>0 ? "O"+careers[i].rank.officer : ("R"+careers[i].rank.enlisted));
                    rank = "-"+rank;
                    break;
                case ENUM_CAREERS.Marine: 
                    rank = (careers[i].rank.officer>0 ? "O"+careers[i].rank.officer : ("R"+careers[i].rank.enlisted));
                    rank = "-"+rank;
                    break;
                case ENUM_CAREERS.Merchant: 
                    rank = (careers[i].rank.officer>0 ? "M"+careers[i].rank.officer : ("R"+(careers[i].rank.enlisted < 0 ? "X" : careers[i].rank.enlisted)));
                    rank = "-"+rank;
                    break;
                case ENUM_CAREERS.Scholar:
                    rank = "-"+careers[i].rank.label;
                    break;
                case ENUM_CAREERS.Noble:
                    var nobility = character.getNobleRank();
                    rank = "-"+nobility.code + " ("+nobility.title+")";
                    break;
            }
        }
        var awards = "";
        if(careers[i].fame || (careers[i].awards && careers[i].awards.length > 0)){

            var awards = "<ul style=\"font-size:smaller\">";
            if(careers[i].fame){
                awards += "<li>"+(careers[i].fame)+" Fame</li>";
            }
            if(careers[i].awards && careers[i].awards.length > 0){
                awards += "<li>" + careers[i].awards.join("</li><li>") + "</li>";
            }
            if(careers[i].major && careers[i].minor){
                awards += "<li>Major: " + careers[i].major.label + "</li>";
                awards += "<li>Minor: " + careers[i].minor.label + "</li>";
            }
            if(careers[i].publications && careers[i].publications > 0){
                awards += "<li>" + careers[i].publications + " Publications</li>";
            }
            if(careers[i].majorpublications && careers[i].majorpublications > 0){
                awards += "<li>" + careers[i].majorpublications + " Award-Winning Publications</li>";
            }
            if(careers[i].commendations){ 
                awards += "<li>Total Commendations: " + careers[i].commendations + "</li>";
            }
            if(careers[i].career == ENUM_CAREERS.Noble){
                var nobleIntrigue = character.getNobleIntrigue();
                awards += "<li>Successful Intrigues: " + nobleIntrigue.successfulIntrigues + "</li>";
                awards += "<li>Exiled: " + nobleIntrigue.timesExiled + " time"+(nobleIntrigue.timesExiled !== 1 ? "s":"")+"</li>";
                if(nobleIntrigue.isInExile){
                    awards += "<li>Currently in Exile</li>";
                }
            }
            awards += "</ul>";
        }
        
        element.insertAdjacentHTML("beforeend","<div>"+careers[i].career+rank+", " + careers[i].terms + " terms"+awards+"</div>");
    }
}
function renderName(character,element){
    element.insertAdjacentHTML("beforeend","<span>"+ character.getName() + "</span>");
}
function renderCredits(character,element){
    element.insertAdjacentHTML("beforeend","<span>Cr"+ character.getCredits() + "</span>");
}
function renderGender(character,element){
    element.insertAdjacentHTML("beforeend","<span>"+ character.getGender() + "</span>");
}
function renderScore(character,element){
    var scores = character.getPlayabilityScore();
    var score = scores.score;
    var scoreDesc = "";
    if(score < 15){ 
        scoreDesc = "Incompetent";
    }else if(score < 20){
        scoreDesc = "Novice";
    }else if(score < 25){
        scoreDesc = "Adequate";
    }else if(score < 30){
        scoreDesc = "Competent";
    }else if(score < 35){
        scoreDesc = "Proficient";
    }else if(score < 40){
        scoreDesc = "Expert";
    }else if(score < 50){
        scoreDesc = "Veteran";
    }else{
        scoreDesc = "Legendary";
    }
    var lineBreak = `
`;
    var title = "Characteristics: " + scores.characteristicScore + lineBreak 
    + "Skills: " + scores.skillScore + lineBreak
    + "Knowledge: " + scores.knowledgeScore + lineBreak
    + "Languages: " + scores.languageScore + lineBreak
    + "JOT: " + scores.JOTScore;
    element.insertAdjacentHTML("beforeend","<span alt==\""+title+"\" title=\""+title+"\" data-skilllevel=\""+scoreDesc+"\">" + scoreDesc + " ("+score+")</span>");
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
                        lastAge = age;
                        isNewAge = true;
                    }
                    var eventText = eventSplit[2];
                    var isGain = eventText.indexOf("Gained ") >= 0;
                    var isPass = eventText.indexOf("? PASS") >= 0;
                    var isFail = eventText.indexOf("? FAIL") >= 0;
                    var isLoss = eventText.indexOf(" reduced to ") >= 0;
                    var isAging = eventText.indexOf("Aging check") >= 0;
                    var isDeath = false, isAgingFail = false;
                    var isReady = eventText.indexOf("Ready to begin adventuring!") >=0;
                    var isDrafted = eventText.indexOf("] = RESERVES") >= 0;
                    var isCalledUp = eventText.indexOf("Called up by the ") >= 0 || eventText.indexOf("Retired from the ") > 0;
                    if(isAging){
                        isAgingFail = eventText.indexOf("illness") >= 0;
                    }
                    isDeath = eventText.indexOf("This character has died") >= 0;
                    element.insertAdjacentHTML("beforeend","<div class=\"event"+(isNewAge ? " newage" : "") + (isDrafted ? " drafted" : "") + (isCalledUp ? " calledup" : "") +(isReady ? " ready" : "")+(isGain ? " Gain" : "")+(isAgingFail ? " AgingFail" : "")+(isPass ? " Pass" : "")+(isFail ? " Fail" : "")+(isLoss ? " Loss" : "")+(isAging ? " Aging" : "")+(isDeath ? " Death" : "")+"\"><div class=\"event_index\">"+i+"</div><div class=\"event_age\">"+eventSplit[1]+"</div> <div class=\"event_text\">"+eventSplit[2]+"</div> </div>");  
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
    var shares = character.getShipShares();
    if(shares > 0){
        element.insertAdjacentHTML("beforeend","<hr/><div> Ship Shares: " + shares +"</div>");
    }
    var proxies = character.getProxies();
    if(proxies > 0){
        element.insertAdjacentHTML("beforeend","<hr/><div> Proxies: " + proxies +"</div>");
    }
    var landGrants = character.getLandGrants();
    if(landGrants.length > 0){
        element.insertAdjacentHTML("beforeend","<hr/><div> Land Grants: " + landGrants +"</div>");
    }
    
}
function ageBlock(character,element){
    var ageHTML = "<span>"+character.getAge() + " years</span>";
    element.insertAdjacentHTML("beforeend",ageHTML);
}
function statBlock(character,element){
    var statHTML = "<ul>";
    for(var i = 0; i < 6; i++){
        statHTML += "<li>(C"+(i+1)+") "+ character.getCharacteristics()[i].name +": " + character.getCharacteristics()[i].value +" </li>";
    }
    if(typeof character.getSanity() === "undefined"){
        statHTML += "<li data-characteristic='unknown'>(CS) Sanity: ?</li>";
    }else{
        statHTML += "<li>(CS) Sanity: "+character.getSanity()+"</li>";
    }
    statHTML += "</ul>";
    statHTML += "<hr/><span>Genetics: " + character.getGenetics().join(",")+"</span>";
    if(typeof character.getSanityGene() !== "undefined"){ statHTML += " <span>San-" + character.getSanityGene()+"</span>";}
    if(typeof character.getPsiGene() !== "undefined"){ statHTML += " <span>Psi-" + character.getPsiGene()+"</span>";}
    var fame = character.calculateFame();
    statHTML += "<hr/><span>Fame-" + (fame >= 0 ? fame : ("("+fame+")")) +"</span>";
    var talent = character.getTalent();
    if(talent.value > 0){
        statHTML += "<hr/><span>Talent("+talent.name+")-"+talent.value+"</span>";
    }
    element.insertAdjacentHTML("beforeend",statHTML);
}
function skillBlock(character,element){
    var statHTML = "<ul>";
    var skills = Object.keys(character.getSkills()).sort();
    var nativeLanguage = character.getNativeLanguage(), nativeLanguageLevel = character.getNativeLanguageLevel();
    for(var i = 0, len = skills.length; i < len; i++){
        var skill = skills[i];
        var skillLevel = character.getSkills()[skill].Skill;
        statHTML += "<li data-skill=\""+(skillLevel >= 1)+"\"> "+ skill +": " + (skillLevel >= 0 ? character.getSkills()[skill].Skill : "n/a")
        if(character.getSkills()[skill].Knowledge){
            statHTML += "<ul>";
            var knowledges = Object.keys(character.getSkills()[skill].Knowledge).sort();
            for(var j = 0, jlen = knowledges.length; j < jlen; j++){
                var k = knowledges[j];
                if(skill == ENUM_SKILLS.Language && k === nativeLanguage){
                    statHTML += "<li data-skill=\"true\"> "+ k +": " + nativeLanguageLevel;
                }else{
                    var klevel = character.getSkills()[skill].Knowledge[k];
                    statHTML += "<li data-skill=\""+(klevel > 0)+"\"> "+ k +": " + (klevel );
                }
            }
            statHTML += "</ul>";
        }
        statHTML +=" </li>";
    }
    statHTML += "</ul>";
    element.insertAdjacentHTML("beforeend",statHTML);
}
