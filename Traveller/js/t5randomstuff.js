
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
    var val = "";
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
function getRandomVisibility(){
    var visibilities = [
        "0 Contact",
        "R Reading",
        "T Talking",
        "1 Vshort",
        "2 Short",
        "3 Medium",
        "4 Long",
        "5 Vlong",
        "6 Distant",
        "7 Vdistant",
        "8 Orbit"
    ]
    return visibilities[flux()+5];
}
function getRandomTemperature(){
    var environs = [
       "Frigid",
       "Vcold",
       "Cold",
       "Chilly",
       "Cool",
       "Nice",
       "Warm",
       "Vwarm",
       "Hot",
       "Vhot",
       "Scalding"
    ]
    return environs[flux()+5];
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