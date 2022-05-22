
function d6() {
    return Math.floor(Math.random() * 6) + 1;
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
    switch(type){
        case "crime":
            return getRandomCrime();
            break;
    }
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