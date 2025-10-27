import { human } from "./human.js";
import { getRollerFromSeed } from "../rnd.js";
import { createCharacter } from "../character.js";
import { ENUM_SKILLS, Knowledges } from "./skills.js";
import { ENUM_CHARACTERISTICS } from "./species.js";
import { renderCharacter, clearElement } from "./character_renderer.js";
import { dialogCallback, getDialog, pickOption, pickSkill } from "./dialog.js";
import { ENUM_CAREERS } from "./careers.js";
import { NameGenerator, addCaps } from "../NameGeneratorModule.js";
import { getNames } from "../names.js";
var nameGenerator;
var roller = getRollerFromSeed(), person;
NameGenerator(getNames(),(generator)=>{ nameGenerator = generator;},undefined,roller.random,true);

var rdoHomeworlds = document.getElementsByName("homeworld");
for (var i = 0, len = rdoHomeworlds.length; i < len; i++) {
    var rdo = rdoHomeworlds[i];
    rdo.addEventListener("change", function (e) {
        if (e.target.value === "specify") {
            document.getElementById("divSpecifyTradeCodes").style.display = "block";
            document.getElementById("divChooseHomeworld").style.display = "none";
        } else {
            document.getElementById("divSpecifyTradeCodes").style.display = "none";
            document.getElementById("divChooseHomeworld").style.display = "block";
        }
    });
}
newCharacter();
    fetch("https://travellermap.com/data").then(response => response.json())
                    .then(data => {
                        console.log(data);
                        var arrMilieu = [];
                        data.Sectors.forEach(sector => {
                            if(true){
                            //if(sector.Tags.indexOf("Official OTU")==0 || sector.Tags.indexOf("OTU")==0){

                                // add sector Milieu to array if not already present
                                if(!arrMilieu.some(milieu => milieu.name === sector.Milieu)){
                                    arrMilieu.push({name: sector.Milieu, sectors: [{name: sector.Names[0].Text, abbr: sector.Abbreviation}]});
                                }else{
                                    // find the Milieu in the array and add the sector name to its sectors array
                                    arrMilieu.forEach(milieu => {
                                        if(milieu.name === sector.Milieu){
                                            milieu.sectors.push({name: sector.Names[0].Text, abbr: sector.Abbreviation});
                                        }
                                    });
                                }
                            }
                        });
                        // add the Milieu options to the select
                        var milieuSelect = document.getElementById("slctMilieu");
                        arrMilieu.forEach(milieu => {
                            // sort the sectors alphabetically by name
                            milieu.sectors.sort((a, b) => a.name.localeCompare(b.name));

                            var option = document.createElement("option");
                            option.value = milieu.name;
                            option.textContent = milieu.name;
                            milieuSelect.appendChild(option);
                        });
                        // add event listener to milieu select to populate sector select options
                        milieuSelect.addEventListener("change", onMilieuChange);
                        function onMilieuChange() {
                            var milieuSelect = document.getElementById("slctMilieu");
                            var selectedMilieu = milieuSelect.value;
                            console.log("Selected Milieu: " + selectedMilieu);
                            var sectorSelect = document.getElementById("slctSector");
                            // remove all options from sector select
                            var sectorOptions = sectorSelect.querySelectorAll("option");
                            sectorOptions.forEach(option => {
                                option.remove();
                            });
                            var milieu = arrMilieu.find(m => m.name === selectedMilieu);
                            console.log(milieu);
                            milieu.sectors.forEach(sector => {
                                var option = document.createElement("option");
                                option.value = sector.abbr;
                                option.textContent = sector.name + " (" + sector.abbr + ")";
                                sectorSelect.appendChild(option);
                            });
                            // set the sector select to the first option
                            sectorSelect.selectedIndex = 0;
                            loadTravMapSector();
                        }
                        var sectorSelect = document.getElementById("slctSector");
                        // add event listener to sector select to invoke HTTP Request to https://travellermap.com/data/sectorname?milieu=milieuvalue
                        sectorSelect.addEventListener("change", function () {
                            loadTravMapSector();
                        });
                        function loadTravMapSector(){
                            var sectorSelect = document.getElementById("slctSector");
                            var milieuSelect = document.getElementById("slctMilieu");
                            var selectedSector = sectorSelect.value;
                            var selectedMilieu = milieuSelect.value;
                            // make HTTP request to https://travellermap.com/data/sectorname?milieu=milieuvalue to return text data
                            fetch(`https://travellermap.com/data/${selectedSector}/tab?milieu=${selectedMilieu}&type=TabDelimited`)
                                .then(sectorData => {
                                   // set sectordata text area to sectorData value
                                   console.log(sectorData);
                                    if(sectorData.status !== 200){
                                        throw new Error("Failed to load sector data: " + sectorData.statusText);
                                    }
                                   return sectorData.text();
                                }).then(text=>{
                                    console.log(text);

                                    if(text === ""){
                                        document.getElementById("spanSectorError").textContent = "Sector data is empty.";
                                    }else{
                                        document.getElementById("spanSectorError").textContent = "";
                                        // populate slctHomeworld with the names of the worlds in the sector data

                                        // split text by lines
                                        var lines = text.split("\n");
                                        // first line is header
                                        var header = lines[0].split("\t");
                                        // get the Hex, Name, and Remarks columns
                                        var hexIndex = header.indexOf("Hex");
                                        var nameIndex = header.indexOf("Name");
                                        var remarksIndex = header.indexOf("Remarks");
                                        // clear the homeworld select
                                        var homeworldSelect = document.getElementById("slctHomeworld");
                                        var homeworldOptions = homeworldSelect.querySelectorAll("option");
                                        homeworldOptions.forEach(option => option.remove());
                                        // sort lines.slice(1) alphabetically by name column
                                        var sortedLines = lines.slice(1);
                                        sortedLines.sort((a, b) => {
                                            var aColumns = a.split("\t");
                                            if(aColumns.length < header.length) return -1; // push incomplete lines to the end
                                            var bColumns = b.split("\t");
                                            if(bColumns.length < header.length) return 1; // push incomplete lines to the end
                                            return aColumns[nameIndex].localeCompare(bColumns[nameIndex]);
                                        });

                                        // add an option for each world, displayed value is "Name (Hex) - Remarks" and value is Remarks
                                        sortedLines.forEach(line => {
                                            var columns = line.split("\t");
                                            var hex = columns[hexIndex];
                                            var name = columns[nameIndex];
                                            var remarks = columns[remarksIndex];
                                            var option = document.createElement("option");
                                            option.value = remarks;
                                            option.textContent = `${name} (${hex}) - ${remarks}`;
                                            // only append option is value is not undefined or empty
                                            if(option.value && option.value !== "undefined"){
                                                homeworldSelect.appendChild(option);
                                            }
                                        });
                                        // set the homeworld select to the first option
                                        homeworldSelect.selectedIndex = 0;
                                        onSystemChange();
                                    }
                                }).catch(error => {
                                    console.error(error);
                                });     
                        }
                        function onSystemChange(){
                            var systemSelect = document.getElementById("slctHomeworld");
                            var selectedHomeworld = systemSelect.value;
                            document.getElementById("txtHomeworldTradeCodes").value = selectedHomeworld;
                        }
                        var systemSelect = document.getElementById("slctHomeworld");
                        systemSelect.addEventListener("change", function () {
                            onSystemChange();
                        });
                        onMilieuChange();
                        
                    });
var collapserHandles = document.querySelectorAll("fieldset legend");
for (var i = 0, len = collapserHandles.length; i < len; i++) {
    var handle = collapserHandles[i];
    handle.addEventListener("click", function (e) {
        var parent = e.target.parentElement;
        if (parent.classList.contains("collapsed")) {
            parent.classList.remove("collapsed");
        } else {
            parent.classList.add("collapsed");
        }
    });
}
var menus = document.querySelectorAll("nav.menu ul li a");
for(var i = 0, len = menus.length; i < len; i++){
    var node = menus[i];
    node.addEventListener("click",onNavigate);
}
function onNavigate(e){
    var target = e.target.getAttribute("target");
    if(target){
        var tier =e.target.getAttribute("data-tier");
        var tierselector = "";
        if(tier){
            tierselector = "[data-tier='"+tier+"']";
        }
        var current = document.querySelector("nav.menu ul li a.selected"+tierselector);
        current.classList.remove(current.className);
        e.target.classList.add("selected");
        document.querySelector("[data-nav='"+current.getAttribute("target")+"']"+tierselector).style.display = "none";
        document.querySelector("[data-nav='"+target+"']"+tierselector).style.display = "block";
    }
}
document.getElementById("btnRandomName").addEventListener("click",()=>{
    var chosenGender = document.getElementById("slctGender").value;
    switch(chosenGender){
        case "random": document.getElementById("txtName").value = addCaps(nameGenerator.getRandomName("human")); break;
        case "M": document.getElementById("txtName").value = addCaps(nameGenerator.getRandomName("human.malefirstname") +" " + nameGenerator.getRandomName("human.lastname") + nameGenerator.getRandomName("human.suffix") ); break;
        case "F": document.getElementById("txtName").value = addCaps(nameGenerator.getRandomName("human.femalefirstname") +" " + nameGenerator.getRandomName("human.lastname") + nameGenerator.getRandomName("human.suffix") ); break;
    }
    onNameFieldValueChange();
});
document.getElementById("btnApplyName").addEventListener("click",()=>{
    person.setName(document.getElementById("txtName").value);
    onNameFieldValueChange();
    redraw();
});
document.getElementById("btnClearName").addEventListener("click",()=>{
    document.getElementById("txtName").value = "";
    onNameFieldValueChange();
});
document.getElementById("txtName").addEventListener("keyup",onNameFieldValueChange);
function onNameFieldValueChange(){
    var nameFieldValue = document.getElementById("txtName").value;
    if(nameFieldValue.length > 0){
        document.getElementById("btnClearName").style.display = "inherit";
        if(nameFieldValue == person.getName()){
            document.getElementById("btnApplyName").style.display = "none";
        }else{
            document.getElementById("btnApplyName").style.display = "inherit";
        }
    }else{
        document.getElementById("btnApplyName").style.display = "none";
        document.getElementById("btnClearName").style.display = "none";
    }
}
document.getElementById("btnReset").addEventListener("click",newCharacter);
document.getElementById("btnRandomHWTCs").addEventListener("click",function(){
    document.getElementById("txtHomeworldTradeCodes").value = getRandomTradeCodes();
    onHWTCFieldValueChange();
});
document.getElementById("txtHomeworldTradeCodes").addEventListener("keyup",function(){
    onHWTCFieldValueChange();
});
document.getElementById("btnClearHWTCs").addEventListener("click",()=>{
    document.getElementById("txtHomeworldTradeCodes").value = "";
    document.getElementById("btnClearHWTCs").style.display = "none";
});
function onHWTCFieldValueChange(){
    var HWTCs = document.getElementById("txtHomeworldTradeCodes").value;
    if(HWTCs.length > 0){
        document.getElementById("btnClearHWTCs").style.display = "inherit";
    }else{
        document.getElementById("btnClearHWTCs").style.display = "none";
    }
}
document.getElementById("btnED5").addEventListener("click",()=>{log(person.ED5()); document.getElementById("btnED5").setAttribute("disabled",true); redraw(); });
document.getElementById("btnApprenticeship").addEventListener("click",function(){
    pickOption(["Begin","Nevermind"],getCareerDescription("Apprenticeship",true),(choice)=>{
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
});
document.getElementById("btnTradeSchool").addEventListener("click",function(){
    pickOption(["Begin","Nevermind"],getCareerDescription("Trade School",true),(choice)=>{
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
});

document.getElementById("btnTrainingCourse").addEventListener("click",function(){
    pickOption(["Begin","Nevermind"],getCareerDescription("Training Course",true),(choice)=>{
    pickSkill("S", "Please choose a skill for your Training Course",
    function(choice){
        var selectedSkill = choice.skill;
        var selectedKnowledge = choice.knowledge;
        if(selectedKnowledge === "undefined"){ selectedKnowledge = undefined;}
        if(selectedSkill === ENUM_SKILLS.Language){
            pickOption(Knowledges[ENUM_SKILLS.Language], "Choose a language.", (lang)=>{
                log(person.TrainingCourse(selectedSkill, lang));
                redraw();
            });
        }else{
            log(person.TrainingCourse(selectedSkill,selectedKnowledge));
        }
    });
    });
});
document.getElementById("btnMedicalSchool").addEventListener("click",function(){
    pickOption(["Begin","Nevermind"],getCareerDescription("Medical School",true),(choice)=>{
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
});
document.getElementById("btnLawSchool").addEventListener("click",function(){
    pickOption(["Begin","Nevermind"],getCareerDescription("Law School",true),(choice)=>{
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
});
document.getElementById("btnCollege").addEventListener("click",function(){
    pickOption(["Begin","Nevermind"],getCareerDescription("College",true),(choice)=>{
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
                        var languages = Knowledges[ENUM_SKILLS.Language].slice();
                        var majorLangIndex = languages.indexOf(MajorKnowledge);
                        languages.splice(majorLangIndex,1);
                        pickOption(languages, "Choose a language.", (lang)=>{
                            MinorKnowledge = lang;
                            log(person.College(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge, log));
                        });
                    }else{
                        log(person.College(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge, log));
                        
                    }
                },undefined, preferredMinor); 
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
                },choice, preferredMinor); 
        }
    },undefined, preferredMajor);
});
});
document.getElementById("btnNavalAcademy").addEventListener("click",function(){
    pickOption(["Begin","Nevermind"],getCareerDescription("Naval Academy",true),(choice)=>{
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
                        var languages = Knowledges[ENUM_SKILLS.Language].slice();
                        var majorLangIndex = languages.indexOf(MajorKnowledge);
                        languages.splice(majorLangIndex,1);
                        pickOption(languages, "Choose a language.", (lang)=>{
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
});
document.getElementById("btnMilitaryAcademy").addEventListener("click",function(){
    pickOption(["Begin","Nevermind"],getCareerDescription("Military Academy",true),(choice)=>{
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
                        var languages = Knowledges[ENUM_SKILLS.Language].slice();
                        var majorLangIndex = languages.indexOf(MajorKnowledge);
                        languages.splice(majorLangIndex,1);
                        pickOption(languages, "Choose a language.", (lang)=>{
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
});
document.getElementById("btnUniversity").addEventListener("click",function(){
    pickOption(["Begin","Nevermind"],getCareerDescription("University",true),(choice)=>{
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
                        var languages = Knowledges[ENUM_SKILLS.Language].slice();
                        var majorLangIndex = languages.indexOf(MajorKnowledge);
                        languages.splice(majorLangIndex,1);
                        pickOption(languages, "Choose a language.", (lang)=>{
                            MinorKnowledge = lang;
                            log(person.University(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge, log));
                            
                        });
                    }else{
                        log(person.University(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge, log));
                        
                    }
                },undefined, preferredMinor); 
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
                },choice, preferredMinor); 
        }
    },undefined, preferredMajor);
});
});
document.getElementById("btnMasters").addEventListener("click",function(){
    pickOption(["Begin","Nevermind"],getCareerDescription("Masters Program",true),(choice)=>{
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
                        var languages = Knowledges[ENUM_SKILLS.Language].slice();
                        var majorLangIndex = languages.indexOf(MajorKnowledge);
                        languages.splice(majorLangIndex,1);
                        pickOption(languages, "Choose a language.", (lang)=>{
                            MinorKnowledge = lang;
                            log(person.Masters(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge, log));
                            
                        });
                    }else{
                        log(person.Masters(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge, log));
                        
                    }
                },undefined,preferredMinor); 
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
});
document.getElementById("btnProfessors").addEventListener("click",function(){
    pickOption(["Begin","Nevermind"],getCareerDescription("Professors Program",true),(choice)=>{
        if(choice == "Begin"){
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
                                var languages = Knowledges[ENUM_SKILLS.Language].slice();
                                var majorLangIndex = languages.indexOf(MajorKnowledge);
                                languages.splice(majorLangIndex,1);
                                pickOption(languages, "Choose a language.", (lang)=>{
                                    MinorKnowledge = lang;
                                    log(person.Professors(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge));
                                    
                                });
                            }else{
                                log(person.Professors(MajorSkill, MajorKnowledge, MinorSkill, MinorKnowledge));
                                
                            }
                        },undefined,preferredMinor); 
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
            
        }
    });
});
document.getElementById("btnMusterOut").addEventListener("click",function(){
    person.musterOut(redraw);
});
document.getElementById("btnFameFluxEvent").addEventListener("click",function(){
    person.fameFluxEvent(redraw);
    redraw();
});
document.getElementById("btnResignFromReserves").addEventListener("click",function(){
    pickOption(["Resign","Nevermind"],"Attempt to resign from armed forces reserves?<br/>Forfeits future retirement pension but avoids being called up for active service.",
    (choice)=>{
        if(choice == "Resign"){
            person.resignFromReserves(redraw);
            redraw();
        }
    },false,"Resign",["Roll anything but 12 to leave reserves.<br/>On a 12, you are called up for active service.","Stay in reserves. You will leave automatically and gain a pension at retirement age (66 for humans)."]);
});
document.getElementById("btnExport").addEventListener("click",()=>{
    var data = person.exportCharacter();
    var a = document.createElement("a");
    a.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    a.download = person.getName().trim() + ".json";
    a.click();
});
document.getElementById("btnImportJSON").addEventListener("change", function () {
    var curFiles = document.getElementById("btnImportJSON").files;
    if (curFiles.length > 0) {
        var reader = new FileReader();
        reader.onload = function (event) {
            person.importCharacter(JSON.parse(event.target.result));
            redraw();
        }
        reader.readAsText(curFiles[0]);

    }
});
function newCharacter(){
    clear();
    var chosenGender = document.getElementById("slctGender").value;
    person = createCharacter(roller, human, chosenGender);
    
    var isForcedGrowthClone = document.getElementById("isForcedGrowthClone").checked;
    if(document.getElementById("rdoAttributesNatural").checked){
        person.rollStatsFromGenes(["Random","Random","Random","Random"]);
    }else if(document.getElementById("rdoAttributesClone").checked){
        var genes = [
            document.getElementById("slctGeneticC1").value,
            document.getElementById("slctGeneticC2").value,
            document.getElementById("slctGeneticC3").value,
            document.getElementById("slctGeneticC4").value,
            document.getElementById("slctGeneticC5").value,
            ,
        ];
        person.rollStatsFromGenes(genes,document.getElementById("slctGeneticCS").value,document.getElementById("slctGeneticCP").value);
        //person.characteristics = person.getCharacteristics();
    }else if(document.getElementById("rdoAttributesCustom").checked){
        // TODO
        var attributes = [
            +(document.getElementById("txtCustomC1").value) + +(document.getElementById("txtCustomC1b").value),
            +(document.getElementById("txtCustomC2").value) + +(document.getElementById("txtCustomC2b").value),
            +(document.getElementById("txtCustomC3").value) + +(document.getElementById("txtCustomC3b").value),
            +(document.getElementById("txtCustomC4").value) + +(document.getElementById("txtCustomC4b").value),
            +(document.getElementById("txtCustomC5").value) + +(document.getElementById("txtCustomC5b").value),
            +(document.getElementById("txtCustomC6").value) + +(document.getElementById("txtCustomC6b").value),
        ];
        var genetics = [
            +(document.getElementById("txtCustomC1").value),
            +(document.getElementById("txtCustomC2").value),
            +(document.getElementById("txtCustomC3").value),
            +(document.getElementById("txtCustomC4").value),
            +(document.getElementById("txtCustomC5").value),
            +(document.getElementById("txtCustomC6").value),
        ];
        person.initStats(attributes, genetics);
        // person.getCharacteristics() = person.getCharacteristics();
    }
    
    if(document.getElementById("txtName").value){
        person.setName(document.getElementById("txtName").value);
    }else{
        
        if(person.getGender() === "M"){
            person.setName(addCaps(nameGenerator.getRandomName("human.malefirstname") + " " + nameGenerator.getRandomName("human.lastname")+nameGenerator.getRandomName("human.suffix")));
        }else if(person.getGender() === "F"){
            person.setName(addCaps(nameGenerator.getRandomName("human.femalefirstname") + " " + nameGenerator.getRandomName("human.lastname")+nameGenerator.getRandomName("human.suffix")));
        }else{
            person.setName(addCaps(nameGenerator.getRandomName("human")));
        }
    }
    //{human.firstname} {human.lastname}{human.suffix}
    if(isForcedGrowthClone) { person.setForcedGrowthClone(true);}
    log("Initial UPP: "+ person.getCharacteristics()[0].value + "," +  person.getCharacteristics()[1].value + "," + person.getCharacteristics()[2].value + "," + 
    person.getCharacteristics()[3].value + "," + person.getCharacteristics()[4].value + "," + person.getCharacteristics()[5].value
    );
    log(person.setNativeLanguage(document.getElementById("slctNativeLanguage").value));
    log(person.advanceAge(human.getFirstYearOfStage(3)));
    log(person.gainSkillsFromHomeworldTradeCodes(document.getElementById("txtHomeworldTradeCodes").value, log, undefined,undefined, document.getElementById("chkLowTechHW").checked)());
    renderCharacter(person, document.body);
    enableControls();

}
function enableControls(){
    var buttons = document.querySelectorAll("[data-educationbtn]");
    for(var i = 0, len = buttons.length; i < len; i++){
        buttons[i].removeAttribute("disabled");
    }
    
}
function validateQualifications(){
    var qual = person.getQualifications();
    if(qual.Agent){ document.getElementById("btnAgent").removeAttribute("disabled"); }else{ document.getElementById("btnAgent").setAttribute("disabled","");}
    if(qual.Merchant){ document.getElementById("btnMerchant").removeAttribute("disabled"); }else{ document.getElementById("btnMerchant").setAttribute("disabled","");}
    if(qual.Citizen){ document.getElementById("btnCitizen").removeAttribute("disabled"); }else{ document.getElementById("btnCitizen").setAttribute("disabled","");}
    if(qual.Craftsman){ document.getElementById("btnCraftsman").removeAttribute("disabled"); }else{ document.getElementById("btnCraftsman").setAttribute("disabled","");}
    if(qual.Spacer){ document.getElementById("btnSpacer").removeAttribute("disabled"); }else{ document.getElementById("btnSpacer").setAttribute("disabled","");}
    if(qual.Marine){ document.getElementById("btnMarine").removeAttribute("disabled"); }else{ document.getElementById("btnMarine").setAttribute("disabled","");}
    if(qual.Soldier){ document.getElementById("btnSoldier").removeAttribute("disabled"); }else{ document.getElementById("btnSoldier").setAttribute("disabled","");}
    if(qual.Scout){ document.getElementById("btnScout").removeAttribute("disabled"); }else{ document.getElementById("btnScout").setAttribute("disabled","");}
    if(qual.MusterOut){ document.getElementById("btnMusterOut").removeAttribute("disabled"); }else{ document.getElementById("btnMusterOut").setAttribute("disabled","");}
    if(qual.Entertainer){ document.getElementById("btnEntertainer").removeAttribute("disabled");}else{document.getElementById("btnEntertainer").setAttribute("disabled","");}
    if(qual.Scholar){ document.getElementById("btnScholar").removeAttribute("disabled");}else{document.getElementById("btnScholar").setAttribute("disabled","");}
    if(qual.Noble){ document.getElementById("btnNoble").removeAttribute("disabled");}else{document.getElementById("btnNoble").setAttribute("disabled","");}
    var baOptions = document.querySelectorAll("[data-qualify=\"BA\"]");
    if(qual.BA){ 
        for(var i = 0, len = baOptions.length; i < len; i++){
            baOptions[i].removeAttribute("disabled");
        }
    }else{
        for(var i = 0, len = baOptions.length; i < len; i++){
            baOptions[i].setAttribute("disabled","");
        }
    }
    if(qual.fameEvent){ document.getElementById("btnFameFluxEvent").removeAttribute("disabled"); }else{ document.getElementById("btnFameFluxEvent").setAttribute("disabled","");}
    if(qual.resignReserves){ document.getElementById("btnResignFromReserves").removeAttribute("disabled"); }else{ document.getElementById("btnResignFromReserves").setAttribute("disabled","");}
    //if(qual.fameBonus){ document.getElementById("btnFameMusterOutBonus").removeAttribute("disabled"); }else{document.getElementById("btnFameMusterOutBonus").setAttribute("disabled",""); }
}

function redraw(){
    validateQualifications();
    renderCharacter(person, document.body);
    console.log(person);
}

var careerBtns = document.querySelectorAll("[data-careerbtn]");
for(var i = 0, len = careerBtns.length; i < len; i++){
    (function(button){
    button.addEventListener("click",function(){
        var career = button.getAttribute("data-careerbtn");
        pickOption(["Begin","Nevermind"],getCareerDescription(career),(choice)=>{
            if(choice == "Begin"){
                button.setAttribute("disabled","disabled");
                person.resolveCareer(career,redraw);
            }
        });
    });
    })(careerBtns[i]);
}
function log(msg){
    if(typeof msg !== "undefined"){
        var historyRecipients = document.querySelectorAll("[data-history]");
        for(var i = 0, len = historyRecipients.length; i < len; i++){
            historyRecipients[i].insertAdjacentHTML("beforeend","<div>"+msg.replace(/\_/g,"<br/>")+"<hr/></div>");
        }
        redraw();
    }
}
function clear(){
    var historyRecipients = document.querySelectorAll("[data-history]");
    for(var i = 0, len = historyRecipients.length; i < len; i++){
        clearElement(historyRecipients[i]);     
    }

}
function getCareerDescription(career,isSchool){
    if(typeof isSchool === "undefined"){ isSchool = false;}
    var desc = isSchool ? "<div>Enroll in " + career + "?</div>" : "<div><strong>Begin a "+career+" career?</strong></div>";
    switch(career){
        case "Agent":
            desc += "<ul><li>Begin: C3</li><li>Controlling Characteristics: C1, C2, C3, C4</li><li>Continue: Str + Terms</li></ul>";
            break;
        case "Craftsman":
            var craftsmanQualifications = person.getCraftsmanQualifications();
            var masterPoints = craftsmanQualifications.masterPoints;
            var craftingSkills = craftsmanQualifications.qualifyingSkills;
            var skillDesc = "<ul><li>Craftsman-"+person.getSkills()["Craftsman"].Skill+"</li>";
            for(var i = 0; i < craftingSkills.length; i++){
                skillDesc += "<li>" + craftingSkills[i].Skill + "-" + craftingSkills[i].Level + "</li>";
            }
            skillDesc += "</ul>"
            desc += "<ul><li>Begin: Auto (if 2x Skill-6 and Craftsman-1)</li><li>Controlling Characteristics: C1, C2, C3, C4</li><li>Masterpiece: 9D < Master Points (min 40)</li><li>CC + Craftsman + Up to 5 Skill/Knowl at 6+</li><li>Qualifying Skills ("+masterPoints+"):"+skillDesc+"</li><li>Continue: Craftsman x2 ("+(2*person.getSkills()["Craftsman"].Skill)+")</li></ul>";
            break;
        case "Entertainer":
            desc += "<ul><li>Begin: Check C2, C3, Int, or C5</li><li>Initial Fame/Talent = 2D</li><li>Fame changes by 1-3 Flux rolls every subsequent term</li><li>If Fame increases, Talent +1</li><li>Comeback: Reset fame to 2D</li><li>Check Fame to continue</li></ul>";
            break;
        case "Scholar":
            desc += "<ul><li>Begin: Automatic if Edu 8+, otherwise check Edu or Tra</li><li>Controlling Characteristics: C1, C2, C3, C4</li><li>Promotion: Int (only if Edu 8+)</li><li>Check Edu or Tra to continue</li></ul>";
            break;
        case "Citizen":
            desc += "<ul><li>Begin: Automatic (1st career only)</li><li>Controlling Characteristics: C1, C2, C3, C4</li><li>Continue: 10-</li></ul>";
            break;
        case "Merchant":
            desc += "<ul><li>Begin:<ul><li>Begin as 4th Officer: Int</li><li>Begin as Spacehand: Dex</li><li>Begin as Temp: Automatic</li></ul></li><li>Controlling Characteristics: C1, C2, C3, C4</li><li>Promotion:<ul><li>Rating promotion: Dex*</li><li>Officer Commission: Int</li><li>Officer Promotion: Terms x2*</li></ul></li><li>Continue: Str</li></ul>*Mod +3 if Int 8+";
            break;
        case "Spacer":
            desc += "<ul><li>Begin: Int</li><li>Select Branch: Soc</li><li>Controlling Characteristics: C1, C2, C4</li><li>Promotion:<ul><li>Rating Promotion: C2*</li><li>Officer Commission: C2</li><li>Officer Promotion: Soc*</li></ul></li><li>Continue: Str</li></ul>*+mods from Medals earned";
            break;
        case "Soldier":
                desc += "<ul><li>Begin: Str</li><li>Select Branch: Soc</li><li>Controlling Characteristics: C1, C3, C4</li><li>Promotion:<ul><li>Enlisted Promotion: C3*</li><li>Officer Commission: C3</li><li>Officer Promotion: Soc*</li></ul></li><li>Continue: C3</li></ul>*+mods from Medals earned";
                break;
        case "Marine":
            desc += "<ul><li>Begin: Str</li><li>Select Branch: Soc</li><li>Controlling Characteristics: C1, C4</li><li>Promotion:<ul><li>Enlisted Promotion: Str*</li><li>Officer Commission: C3</li><li>Officer Promotion: Int*</li></ul></li><li>Continue: Str</li></ul>*+mods from Medals earned";
            break;
        case "Scout":
            desc += "<ul><li>Begin: C1, C2, or C3</li><li>Retry: C5</li><li>Controlling Characteristics: C1, C2, C3</li><li>Continue: Int</li></ul>";
            break;
        case "Noble":
            desc += "<ul><li>Begin: Automatic if Soc 11+</li><li>Controlling Characteristics: C2, C3, C4, C5</li><li>Continue: 7+</li></ul>";
            break;
        case "Apprenticeship": desc += "<ul><li>Begin: Automatic</li><li>Pass/Fail: Check Tra (or Edu/2)</li><li>Duration: Consumes no time (happens during youth)</li><li>Provides: Skill/Knowledge +4</li></ul>"; break;
        case "Trade School": desc += "<ul><li>Pre Req: Edu 5+</li><li>Begin: Int</li><li>Pass/Fail: Int or Edu, One check</li><li>Duration: 1 year</li><li>Provides: Major +2</li><li>Additional Major +1 with Honors</li></ul>"; break;
        case "Training Course": desc += "<ul><li>Pre Req: Tra 5+</li><li>Begin: Int</li><li>Pass/Fail: Tra (or Edu/2), One check</li><li>Duration: 1 year</li><li>Provides: Skill/Knowedge +2</li><li>Additional Skill/Knowledge +1 with Honors</li></ul>"; break;
        case "College": desc += "<ul><li>Pre Req: Edu 5+</li><li>Begin: Int or Edu</li><li>Pass/Fail: Int or Edu, 4 checks</li><li>Duration: 4 years</li><li>Provides: Major+4,Minor+2</li><li>Additional Major +1 with Honors</li><li>Optional NOTC/OTC Check: Gain Ship/Soldier Skill and Officer commission.</li><li>Graduation confers Edu=8 or Edu+1, BA</li></ul>"; break;
        case "University": desc += "<ul><li>Pre Req: Edu 7+</li><li>Begin: Int or Edu</li><li>Pass/Fail: Int or Edu, 4 checks</li><li>Duration: 4 years</li><li>Provides: Major+4,Minor+2</li><li>Additional Major +1 with Honors</li><li>Optional NOTC/OTC Check: Gain Ship/Soldier Skill and Officer commission.</li><li>Graduation confers Edu=9 or Edu+1, BA</li></ul>";  break;
        case "Naval Academy": desc += "<ul><li>Pre Req: Edu 6+</li><li>Begin: Int or Edu</li><li>Pass/Fail: Int or Edu, 4 checks</li><li>Duration: 4 years</li><li>Provides: Major+4,Minor+2</li><li>Additional Major +1 with Honors</li><li>Graduation confers Edu=8 or Edu+1, BA, Navy or Marine Officer commission</li></ul>";  break;
        case "Military Academy": desc += "<ul><li>Pre Req: Edu 6+</li><li>Begin: Int or Edu</li><li>Pass/Fail: Int or Edu, 4 checks</li><li>Duration: 4 years</li><li>Provides: Major+4,Minor+2</li><li>Additional Major +1 with Honors</li><li>Graduation confers Edu=8 or Edu+1, BA, Army Officer commission</li></ul>"; break;
        case "Masters Program": desc += "<ul><li>Pre Req: BA</li><li>Begin: Int or Edu</li><li>Pass/Fail: Int or Edu, 2 checks</li><li>Duration: 2 years</li><li>Provides: Major+2,Minor+1</li><li>Additional Major +1 with Honors</li><li>Graduation confers Edu=9 or Edu+1, MA</li></ul>"; break;
        case "Professors Program": desc += "<ul><li>Pre Req: MA</li><li>Begin: Int or Edu</li><li>Pass/Fail: Int or Edu, 2 checks</li><li>Duration: 2 years</li><li>Provides: Major+2,Minor+1</li><li>Additional Major +1 with Honors</li><li>Graduation confers Edu=12 or Edu+1, Professor</li></ul>"; break;
        case "Medical School": desc += "<ul><li>Pre Req: Honors BA</li><li>Begin: Int or Edu</li><li>Pass/Fail: Int or Edu, 4 checks</li><li>Duration: 4 years</li><li>Provides: Medic or Forensics +4</li><li>Additional Major +1 with Honors</li><li>Graduation confers Edu=10 or Edu+1, Doctor</li></ul>"; break;
        case "Law School": desc += "<ul><li>Pre Req: Honors BA</li><li>Begin: Int or Edu</li><li>Pass/Fail: Int or Edu, 2 checks</li><li>Duration: 2 years</li><li>Provides: Advocate or Diplomat +4</li><li>Additional Major +1 with Honors</li><li>Graduation confers Edu=10 or Edu+1, Attorney</li></ul>"; break;
    }
    return desc;
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

