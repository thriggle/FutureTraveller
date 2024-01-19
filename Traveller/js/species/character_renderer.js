export function renderCharacter(character,element){
    injectHTML("[data-ageblock]",ageBlock);
    injectHTML("[data-statblock]",statBlock)
    injectHTML("[data-skillblock]",skillBlock);
    injectHTML("[data-awards]",awards);
    function injectHTML(selector,htmlfunc){
        var elements = document.querySelectorAll(selector);
        for(var i = 0, len = elements.length; i < len; i++){
            clearElement(elements[i]);
            htmlfunc(character,elements[i]);
        }
    }
}
export function clearElement(el) {
    while (el.children.length > 0) {
        el.removeChild(el.children[el.children.length - 1]);
    }
}
function awards(character,element){
    element.insertAdjacentHTML("beforeend","<div>" + character.getAwards().join(", ") + "<div>");
    var majors = character.getMajorsLabels();
    if(majors.length > 0){
        element.insertAdjacentHTML("beforeend","<div> Majors: " + majors.join(", ") + "<div>");
    }
    var minors = character.getMinorsLabels();
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
    for(var i = 0, len = skills.length; i < len; i++){
        var skill = skills[i];
        statHTML += "<li> "+ skill +": " + (character.skills[skill].Skill >= 0 ? character.skills[skill].Skill : "n/a")
        if(character.skills[skill].Knowledge){
            statHTML += "<ul>";
            var knowledges = Object.keys(character.skills[skill].Knowledge).sort();
            for(var j = 0, jlen = knowledges.length; j < jlen; j++){
                var k = knowledges[j];
                statHTML += "<li> "+ k +": " + (character.skills[skill].Knowledge[k] )
            }
            statHTML += "</ul>";
        }
        statHTML +=" </li>";
    }
    statHTML += "</ul>";
    element.insertAdjacentHTML("beforeend",statHTML);
}