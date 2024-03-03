import { SoldierSkills, StarshipSkills, ENUM_SKILLS, Knowledges, ArtSkills, TradeSkills } from "./skills.js";
import { getRollerFromSeed } from "../rnd.js";

export class ENUM_CAREERS{
    static get Craftsman(){ return "Craftsman"; }
    static get Scholar(){ return "Scholar"; }
    static get Entertainer(){ return "Entertainer"; }
    static get Citizen(){ return "Citizen"; }
    static get Scout(){ return "Scout"; }
    static get Merchant(){ return "Merchant"; }
    static get Spacer(){ return "Spacer"; }
    static get Soldier(){ return "Soldier"; }
    static get Agent(){ return "Agent"; }
    static get Rogue(){ return "Rogue"; }
    static get Noble(){ return "Noble"; }
    static get Marine(){ return "Marine"; }
    static get Functionary(){ return "Functionary"; }
}

export function getCCs(career){
    var ccs = [];
    switch(career){
        case ENUM_CAREERS.Scholar: ccs = ["C1","C2","C3","C4"]; break;
        case ENUM_CAREERS.Citizen: ccs = ["C1","C2","C3","C4"]; break;
        case ENUM_CAREERS.Scout: ccs = ["C1","C2","C3","C4"]; break;
        case ENUM_CAREERS.Merchant: ccs = ["C1","C2","C3","C4"]; break;
        case ENUM_CAREERS.Spacer: ccs = ["C1","C2","C4"]; break;
        case ENUM_CAREERS.Soldier: ccs = ["C1","C3","C4"]; break;
        case ENUM_CAREERS.Agent: ccs = ["C1","C2","C3","C4"]; break;
        case ENUM_CAREERS.Noble: ccs = ["C1","C2","C3","C4"]; break;
        case ENUM_CAREERS.Marine: ccs = ["C1","C4"]; break;
        case ENUM_CAREERS.Functionary: ccs = ["C2","C3","C4","C5"]; break;
    }
    return ccs;
}

export function citizenLifeJob(roller){
    if(typeof roller === "undefined"){
        roller = getRollerFromSeed();
    }
    var roll1 = roller.d6(1), roll2 = roller.d6(1), roll3 = roller.d6(1);
    while(roll1.result > 3){ roll1 = roller.d6(1); }
    var jobList = [
        // r1 = 1
        [
            // r2 = 1
            [
                {skill:ENUM_SKILLS.Driver,knowledge:"ACV"},
                {skill:ENUM_SKILLS.JOT},
                {skill:ENUM_SKILLS.Flyer,knowledge:"LTA"},
                {skill:ENUM_SKILLS.HeavyWeapons,knowledge:"WMD"},
                {skill:ENUM_SKILLS.Chef},
                {skill:ENUM_SKILLS.Driver,knowledge:"Mole"}
            ],
            // r2 = 2
            [
                {skill:ENUM_SKILLS.Comms},
                {skill:ENUM_SKILLS.Animals,knowledge:"Rider"},
                {skill:ENUM_SKILLS.Gunner,knowledge:"Spines"},
                {skill:ENUM_SKILLS.Leader},
                {skill:ENUM_SKILLS.Survey},
                {skill:ENUM_SKILLS.Dancer}
            ],
            // r2 = 3
            [
                {skill:ENUM_SKILLS.HighG},
                {skill:ENUM_SKILLS.Sensors},
                {skill:ENUM_SKILLS.Flyer,knowledge:"Flapper"},
                {skill:ENUM_SKILLS.Driver,knowledge:"Tracked"},
                {skill:ENUM_SKILLS.Animals},
                {skill:ENUM_SKILLS.Tactics}
            ],
            // r2 = 4
            [
                {skill:ENUM_SKILLS.Steward},
                {skill:ENUM_SKILLS.ForwardObserver},
                {skill:ENUM_SKILLS.Seafarer},
                {skill:ENUM_SKILLS.Engineer},
                {skill:ENUM_SKILLS.Fluidics},
                {skill:ENUM_SKILLS.HeavyWeapons,knowledge:"Launcher"}
            ],
            // r2 = 5
            [
                {skill:ENUM_SKILLS.HeavyWeapons,knowledge:"Ordnance"},
                {skill:ENUM_SKILLS.Survival},
                {skill:undefined},
                {skill:ENUM_SKILLS.Computer},
                {skill:ENUM_SKILLS.Gunner,knowledge:"Bay Weapons"},
                {skill:ENUM_SKILLS.Magnetics}
            ],
            // r2 = 6
            [
                {skill:ENUM_SKILLS.NavalArchitect},
                {skill:ENUM_SKILLS.Streetwise},
                {skill:ENUM_SKILLS.Astrogator},
                {skill:ENUM_SKILLS.Navigator},
                {skill:ENUM_SKILLS.Explosives},
                {skill:ENUM_SKILLS.Engineer,knowledge:"Jump Drives"}
            ]
        ],
        // r1 = 2
        [
            // r2 = 1
            [
                {skill:ENUM_SKILLS.Driver,knowledge:"Grav"},
                {skill:ENUM_SKILLS.Seafarer,knowledge:"Boat"},
                {skill:ENUM_SKILLS.Seafarer,knowledge:"Ship"},
                {skill:ENUM_SKILLS.Flyer,knowledge:"Winged"},
                {skill:ENUM_SKILLS.Recon},
                {skill:ENUM_SKILLS.Actor}
            ],
            // r2 = 2
            [
                {skill:ENUM_SKILLS.Artist},
                {skill:ENUM_SKILLS.Driver,knowledge:"Legged"},
                {skill:ENUM_SKILLS.Sapper},
                {skill:ENUM_SKILLS.Driver},
                {skill:ENUM_SKILLS.Gunner},
                {skill:ENUM_SKILLS.Fighter,knowledge:"Blades"}
            ],
            // r2 = 3
            [
                {skill:ENUM_SKILLS.Gunner,knowledge:"Turrets"},
                {skill:ENUM_SKILLS.Teacher},
                {skill:ENUM_SKILLS.Fighter,knowledge:"Unarmed"},
                {skill:ENUM_SKILLS.Fighter,knowledge:"Exotics"},
                {skill:ENUM_SKILLS.Stealth},
                {skill:ENUM_SKILLS.Animals,knowledge:"Trainer"}
            ],
            // r2 = 4
            [
                {skill:ENUM_SKILLS.Animals,knowledge:"Teamster"},
                {skill:ENUM_SKILLS.Designer},
                {skill:ENUM_SKILLS.Engineer},
                {skill:ENUM_SKILLS.Language},
                {skill:ENUM_SKILLS.Musician},
                {skill:ENUM_SKILLS.Strategy}
            ],
            // r2 = 5
            [
                {skill:ENUM_SKILLS.Photonics},
                {skill:ENUM_SKILLS.VaccSuit},
                {skill:ENUM_SKILLS.HeavyWeapons,knowledge:"Artillery"},
                {skill:ENUM_SKILLS.Craftsman},
                {skill:ENUM_SKILLS.Gravitics},
                {skill:ENUM_SKILLS.Forensics}
            ],
            // r2 = 6
            [
                {skill:ENUM_SKILLS.Counsellor},
                {skill:ENUM_SKILLS.Seafarer,knowledge:"Sub"},
                {skill:ENUM_SKILLS.Flyer,knowledge:"Aeronautics"},
                {skill:ENUM_SKILLS.Seafarer,knowledge:"Aquanautics"},
                {skill:ENUM_SKILLS.Fighter,knowledge:"Battle Dress"},
                {skill:ENUM_SKILLS.Electronics}
            ]
        ],
        // r1 = 3
        [
            // r2 = 1
            [
                {skill:ENUM_SKILLS.Flyer},
                {skill:ENUM_SKILLS.Pilot},
                {skill:ENUM_SKILLS.Flyer,knowledge:"Rotor"},
                {skill:ENUM_SKILLS.Admin},
                {skill:ENUM_SKILLS.Fighter,knowledge:"Beams"},
                {skill:ENUM_SKILLS.Medic}
            ],
            // r2 = 2
            [
                {skill:ENUM_SKILLS.ZeroG},
                {skill:ENUM_SKILLS.Author},
                {skill:ENUM_SKILLS.Broker},
                {skill:ENUM_SKILLS.Trader},
                {skill:ENUM_SKILLS.Fighter,knowledge:"Sprays"},
                {skill:ENUM_SKILLS.Gambler}
            ],
            // r2 = 3
            [
                {skill:ENUM_SKILLS.Animals},
                {skill:ENUM_SKILLS.Liaison},
                {skill:ENUM_SKILLS.Athlete},
                {skill:ENUM_SKILLS.Fighter},
                {skill:ENUM_SKILLS.Driver,knowledge:"Wheeled"},
                {skill:ENUM_SKILLS.Gunner,knowledge:"Screens"}
            ],
            // r2 = 4
            [
                {skill:ENUM_SKILLS.Engineer,knowledge:"Maneuver Drive"},
                {skill:ENUM_SKILLS.Polymers},
                {skill:ENUM_SKILLS.Advocate},
                {skill:ENUM_SKILLS.Computer},
                {skill:ENUM_SKILLS.Diplomat},
                {skill:ENUM_SKILLS.Mechanic}
            ],
            // r2 = 5
            [
                {skill:ENUM_SKILLS.Biologics},
                {skill:ENUM_SKILLS.Gunner,knowledge:"Ortillery"},
                {skill:ENUM_SKILLS.Driver,knowledge:"Automotive"},
                {skill:ENUM_SKILLS.Bureaucrat},
                {skill:ENUM_SKILLS.HeavyWeapons},
                {skill:ENUM_SKILLS.Programmer}
            ],
            // r2 = 6
            [
                {skill:ENUM_SKILLS.HostileEnviron},
                {skill:ENUM_SKILLS.Engineer,knowledge:"Power Systems"},
                {skill:ENUM_SKILLS.Engineer,knowledge:"Life Support"},
                {skill:ENUM_SKILLS.Fighter,knowledge:"Slug Throwers"},
                {skill:ENUM_SKILLS.FleetTactics},
                {skill:ENUM_SKILLS.Pilot,knowledge:"ACS"}
            ]
        ]
    ];
    var job = jobList[roll1.result-1][roll2.result-1][roll3.result-1];
    return {rolls:[roll1.result,roll2.result,roll3.result],job:job};
}
export var CareerSkillTables = {
    "Citizen" : { // Career 04
        "Tables":["Personal","Academic","Travel","General","Business","Vocation","Avocation"],
        "Personal":["C1","C2","C3","C4","C5","C6"],
        "Academic":["Major","Major","Minor","Minor","One Trade","One Trade"],
        "Travel":["Seafarer","Navigator","Hostile Environ","Flyer","Driver","Vacc Suit"],
        "General":["Admin","Broker","Computer","Animals","Bureaucrat","Trader"],
        "Business":["Advocate","Broker","Trader","Liaison","Counsellor","Teacher"],
        "Vocation":["One Art","One Science","One Trade","Driver","Bureaucrat","Computer"],
        "Avocation":["One Art","One Science","JOT","Athlete","Medic","One Trade"]
    },
    "Spacer":{ // Career 07
        "Tables":["Personal","Shore Duty","Battle","Patrol/Strike","Siege","Mission","Technical"],
        "Personal":["C1","C2","C3","C4","C5","C6"],
        "Shore Duty":["Major","Major","Minor","Minor","One Trade","One Trade"],
        "Battle":["Fighter","Fleet Tactics","Pilot","Starship Skill","Gunner","Sensors"],
        "Patrol/Strike":["Astrogator","Fleet Tactics","Computer","Starship Skill","Gunner","Sensors"],
        "Siege":["Computer","Strategy","Counsellor","Gunner","Gunner","Sensors"],
        "Mission":["Diplomat","Admin","Language","Starship Skill","Liaison","Comms"],
        "Technical":["One Art","One Science","Athlete","Medic","Zero-G","One Trade"]
    },
    "Soldier":{ // Career 08
        "Tables":["Personal","Base","Combat","Peacekeeper","Occupation","Mission","Technical"],
        "Personal":["C1","C2","C3","C4","C5","C6"],
        "Base":["Major","Major","Minor","Minor","One Trade","One Trade"],
        "Combat":["Fighter","Vacc Suit","Fighter","Stealth","Leader","Tactics"],
        "Peacekeeper":["Admin","Fighter","Hostile Environ","Animals","Liaison","Navigator"],
        "Occupation":["Fighter","Vacc Suit","Driver","Stealth","Heavy Weapons","Sensors"],
        "Mission":["Soldier Skill","Liaison","Language","Soldier Skill","Computer","Tactics"],
        "Technical":["One Art","One Science","Explosives","Medic","Seafarer","One Trade"]
    },
    "Marine":{ // Career 12
        "Tables":["Personal","Garrison","Combat","Peacekeeper","Occupation","Mission","Technical"],
        "Personal":["C1","C2","C3","C4","C5","C6"],
        "Garrison":["Major","Major","Minor","Minor","One Trade","One Trade"],
        "Combat":["Fighter","Fighter","Soldier Skill","Soldier Skill","Leader","Tactics"],
        "Peacekeeper":["Vacc Suit","Fighter","Hostile Environ","Stealth","Leader","Tactics"],
        "Occupation":["Fighter","Fighter","Flyer","Stealth","Leader","Heavy Weapons"],
        "Mission":["Soldier Skill","Survival","Language","Gunner","Leader","Fighter"],
        "Technical":["One Art","One Science","Explosives","Medic","Seafarer","One Trade"]
    },
    "Craftsman":{ // Career 01
        "Tables":["Personal","Academic","Travel","General","Business","Vocation","Avocation"],
        "Personal":["C1","C2","C3","C4","C5","C6"],
        "Academic":["Major","Major","Minor","Minor","One Trade","One Trade"],
        "Travel":["Seafarer","Navigation","Hostile Environ","Flyer","Driver","Vacc Suit"],
        "General":["Animals","Comms","Computer","Designer","Designer","Designer"],
        "Business":["Liaison","Comms","Bureaucrat","Diplomat","Leader","Trader"],
        "Vocation":["Naval Architect","One Art","New Trade","New Trade", "One Trade","One Trade"],
        "Avocation":["Animals","One Art","One Science","Athlete","Medic","One Trade"]
    },
    "Scholar":{ // Career 02
        "Tables":["Personal","Academic","Travel","General","Conflict","Vocation","Avocation"],
        "Personal":["C1","C2","C3","C4","C5","C6"],
        "Academic":["Major","Major","Minor","Minor","One Trade","One Trade"],
        "Travel":["Seafarer","Navigator","Hostile Environ","Flyer","Driver","Vacc Suit"],
        "General":["Survey","Astrogator","Hostile Environ","Survival","Animals","Bureaucrat"],
        "Conflict":["Fighter","Fighter","Stealth","Flyer","Gunner","Sensors"],
        "Vocation":["Admin","Language","One Science","Comms","Starship Skill","Bureaucrat"],
        "Avocation":["Seafarer","One Art","One Science","Athlete","Medic","One Trade"]
    },
    "Entertainer":{ // Career 03
        "Tables":["Personal","Academic","Travel","General","Business","Vocation","Avocation"],
        "Personal":["C1","C2","C3","C4","C5","C6"],
        "Academic":["Major","Major","Minor","Minor","One Trade","One Trade"],
        "Travel":["Zero-G","Vacc Suit","Pilot","Astrogator","Sensors","Starship Skill"],
        "General":["Survey","Survival","Hostile Environ","Animals","Bureaucrat","Navigator"],
        "Business":["Broker","Trader","Advocate","Liaison","Diplomat","Bureaucrat"],
        "Vocation":["Broker","One Art","Language","Admin","One Art","Bureaucrat"],
        "Avocation":["one Art","One Art","One Trade","Athlete","Medic","One Trade"]
    },
    "Scout":{ // Career 05
        "Tables":["Personal","Academic","Courier","Exploration","Business","Vocation","Avocation"],
        "Personal":["C1","C2","C3","C4","C5","C6"],
        "Academic":["Major","Major","Minor","Minor","One Trade","One Trade"],
        "Courier":["Comms","Language","Computer","JOT","Gunner","Starship Skills"],
        "Exploration":["Survey","Survival","Hostile Environ","Animals","Vacc Suit","Navigator"],
        "Business":["Diplomat","Sensors","Trader","Teacher","Fighter","Streetwise"],
        "Vocation":["Survey","Flyer","Language","Starship Skill","Engineer","Comms"],
        "Avocation":["One Art","One Science","Seafarer","Athlete","Medic","One Trade"]
    },
    "Merchant":{ // Career 06
        "Tables":["Personal","Academic","Space Travel","Trade","Business","Vocation","Avocation"],
        "Personal":["C1","C2","C3","C4","C5","C6"],
        "Academic":["Major","Major","Minor","Minor","One Trade","One Trade"],
        "Space Travel":["Astrogator","Pilot","Medic","Sensors","Steward","Gunner"],
        "Trade":["Broker","Trader","Diplomat","Admin","Steward","Trader"],
        "Business":["Computer","Trader","Driver","Advocate","Steward","Comms"],
        "Vocation":["Broker","Admin","Language","Starship Skill","JOT","Vacc Suit"],
        "Avocation":["One Art","One Science","Computer","Comms","Medic","One Trade"]
    },
    "Agent":{ // Career 09
        "Tables":["Personal","Academic","Travel","Mission","Conflict","Vocation","Avocation"],
        "Personal":["C1","C2","C3","C4","C5","C6"],
        "Academic":["Major","Major","Minor","Minor","One Trade","One Trade"],
        "Travel":["Zero-G","Vacc Suit","Pilot","Starhip Skill","Gunner","Sensors"],
        "Mission":["Survey","Survival","Hostile Environ","Animals","Bureaucrat","Navigator"],
        "Conflict":["Fighter","Soldier Skill","Flyer","Stealth","Gunner","Streetwise"],
        "Vocation":["Any Knowledge","Admin","Language","Starhip Skill","Forensics","Comms"],
        "Avocation":["One Art","One Science","Athlete","Medic","Seafarer","One Trade"]
    },
    "Rogue":{ // Career 10
        "Tables":["Personal","Academic","World Travel","Space Travel","Business","Vocation","Avocation"],
        "Personal":["C1","C2","C3","C4","C5","C6"],
        "Academic":["Major","Major","Minor","Minor","One Trade","One Trade"],
        "World Travel":["Driver","Flyer","Hostile Environ","High-G","Vacc Suit","Navigator"],
        "Space Travel":["Starhip Skill","Pilot","Engineer","Zero-G","Vacc Suit","Astrogator"],
        "Business":["Trader","Broker","Computer","JOT","Teacher","Fighter"],
        "Vocation":["Advocate","Counsellor","Language","Leader","Streetwise","Comms"],
        "Avocation":["One Art","One Science","Athlete","Soldier Skill","Starship Skill","One Trade"]
    },
    "Noble":{ // Career 11
        "Tables":["Personal","Academic","Travel","General","Political","Vocation","Technical"],
        "Personal":["C1","C2","C3","C4","C5","C6"],
        "Academic":["Major","Major","Minor","Minor","One Trade","One Trade"],
        "Travel":["Driver","Flyer","Pilot","Starship Skill","High-G","Zero-G"],
        "General":["Advocate","Counsellor","Bureaucrat","Liaison","Leader","Leader"],
        "Political":["Liaison","Strategy","Tactics","Diplomat","Advocate","Leader"],
        "Vocation":["Capital","Admin","Language","Starship Skill","Bureaucrat","Comms"],
        "Technical":["One Art","One Science","Athlete","Soldier Skill","Starship Skill","One Trade"]
    },
    "Functionary":{ // Career 13
        "Tables":["Personal","Academic","World Travel","General","Business","Vocation","Avocation"],
        "Personal":["C1","C2","C3","C4","C5","C6"],
        "Academic":["Major","Major","Minor","Minor","One Trade","One Trade"],
        "World Travel":["High-G","Vacc Suit","Driver","Flyer","Navigator","Seafarer"],
        "General":["One Trade","One Art","One Science","Any Skill","Bureaucrat","Leader"],
        "Business":["Advocate","Broker","Trader","Teacher","One Trade","Driver"],
        "Vocation":["Advocate","Comms","Language","Admin","Bureaucrat","Comms"],
        "Avocation":["One Art","One Science","Athlete","Designer","Seafarer","One Trade"]
    }
}
export var ServiceBranchMods = {
    "Spacer" : {
        "Line":1,
        "Engineer":0,
        "Gunnery":1,
        "Flight":2,
        "Technical":0,
        "Medical":0
    },
    "SpacerEnlisted":{
        "Crew":1,
        "Engineer":0,
        "Gunnery":1,
        "Technical":0,
        "Medical":0
    },
    "Soldier" : {
        "Infantry":1,
        "Artillery":1,
        "Cavalry":1,
        "Protected":2,
        "Technical":0,
        "Medical":0
    },
    "Marine" : {
        "Infantry":1,
        "Artillery":1,
        "Cavalry":1,
        "Protected":2,
        "Commando":2,
        "Technical":0,
        "Medical":0
    }
};
export var CareerBenefitTables = {
    "Citizen":{
        "Money":[
            {label:"Low Psg",type:"award"},
            {label:"Low Psg",type:"award"},
            {label:"Low Psg",type:"award"},
            {label:"Mid Psg",type:"award"},
            {label:"High Psg",type:"award"},
            {label:"Cr 15,000",type:"money",amount:15000},
            {label:"StarPass",type:"award"},
            {label:"Cr 25,000",type:"money",amount:25000},
            {label:"Cr 30,000",type:"money",amount:30000},
            {label:"Cr 35,000",type:"money",amount:35000},
            {label:"Cr 40,000",type:"money",amount:40000},
            {label:"Cr 50,000",type:"money",amount:50000},
        ],
        "Benefits":[
            {label:"Low Psg",type:"award"},
            {label:"Str +1",type:"characteristic",characteristic:"C1"},
            {label:"Str +1",type:"characteristic",characteristic:"C1"},
            {label:"Wafer Jack",type:"award"},
            {label:"C5 +1",type:"characteristic",characteristic:"C5"},
            {label:"Str +1",type:"characteristic",characteristic:"C1"},
            {label:"C2 +1",type:"characteristic",characteristic:"C2"},
            {label:"C3 +1",type:"characteristic",characteristic:"C3"},
            {label:"Int +1",type:"characteristic",characteristic:"C4"},
            {label:"Soc +1",type:"characteristic",characteristic:"Soc"},
            {label:"TAS Fellow",type:"award"},
            {label:"Ship Share",type:"ship"}            
        ]
    },
    "Spacer":{
        "Money":[
            {label:"Low Psg",type:"award"},
            {label:"Mid Psg",type:"award"},
            {label:"High Psg",type:"award"},
            {label:"StarPass",type:"award"},
            {label:"Cr 30,000",type:"money",amount:30000},
            {label:"Cr 40,000",type:"money",amount:40000},
            {label:"Cr 50,000",type:"money",amount:50000},
            {label:"Retirex2",type:"award"},
            {label:"Retirex2",type:"award"},
            {label:"Cr 60,000",type:"money",amount:60000},
            {label:"Cr 70,000",type:"money",amount:70000},
            {label:"Cr 80,000",type:"money",amount:80000},
        ],
        "Benefits":[
            {label:"Forbidden K",type:"knowledge"},
            {label:"Str +1",type:"characteristic",characteristic:"C1"},
            {label:"Wafer Jack",type:"award"},
            {label:"C5 +1",type:"characteristic",characteristic:"C5"},
            {label:"Str +1",type:"characteristic",characteristic:"C1"},
            {label:"C2 +1",type:"characteristic",characteristic:"C2"},
            {label:"C3 +1",type:"characteristic",characteristic:"C3"},
            {label:"Int +1",type:"characteristic",characteristic:"C4"},
            {label:"Ship Share",type:"ship"},
            {label:"Life Insur",type:"award"},
            {label:"Knighthood",type:"award"},
            {label:"Knighthood",type:"award"},
        ]
    },
    "Soldier":{
        "Money":[
            {label:"Low Psg",type:"award"},
            {label:"Mid Psg",type:"award"},
            {label:"High Psg",type:"award"},
            {label:"StarPass",type:"award"},
            {label:"Cr 30,000",type:"money",amount:30000},
            {label:"Cr 40,000",type:"money",amount:40000},
            {label:"Cr 50,000",type:"money",amount:50000},
            {label:"Retirex2",type:"award"},
            {label:"Retirex2",type:"award"},
            {label:"Cr 60,000",type:"money",amount:60000},
            {label:"Cr 70,000",type:"money",amount:70000},
            {label:"Cr 80,000",type:"money",amount:80000},
        ], 
        "Benefits":[
            {label:"Forbidden K",type:"knowledge"},
            {label:"Str +1",type:"characteristic",characteristic:"C1"},
            {label:"Wafer Jack",type:"award"},
            {label:"C5 +1",type:"characteristic",characteristic:"C5"},
            {label:"Int +1",type:"characteristic",characteristic:"C4"},
            {label:"C2 +1",type:"characteristic",characteristic:"C2"},
            {label:"C3 +1",type:"characteristic",characteristic:"C3"},
            {label:"Life Insur",type:"award"},
            {label:"TAS Fellow",type:"award"},
            {label:"Knighthood",type:"award"},
            {label:"Knighthood",type:"award"},
            {label:"Knighthood",type:"award"}
        ]
    },
    "Marine":{
        "Money":[
            {label:"Low Psg",type:"award"},
            {label:"Mid Psg",type:"award"},
            {label:"High Psg",type:"award"},
            {label:"StarPass",type:"award"},
            {label:"Cr 30,000",type:"money",amount:30000},
            {label:"Cr 40,000",type:"money",amount:40000},
            {label:"Cr 50,000",type:"money",amount:50000},
            {label:"Retirex2",type:"award"},
            {label:"Retirex2",type:"award"},
            {label:"Cr 60,000",type:"money",amount:60000},
            {label:"Cr 70,000",type:"money",amount:70000},
            {label:"Cr 80,000",type:"money",amount:80000},
        ], 
        "Benefits":[
            {label:"Forbidden K",type:"knowledge"},
            {label:"Str +1",type:"characteristic",characteristic:"C1"},
            {label:"Wafer Jack",type:"award"},
            {label:"C5 +1",type:"characteristic",characteristic:"C5"},
            {label:"Int +1",type:"characteristic",characteristic:"C4"},
            {label:"C2 +1",type:"characteristic",characteristic:"C2"},
            {label:"Life Insur",type:"award"},
            {label:"Ship Share",type:"ship"},
            {label:"Directorship",type:"award"},
            {label:"Knighthood",type:"award"},
            {label:"Knighthood",type:"award"},
            {label:"Knighthood",type:"award"},
        ]
    },
    "Scouts":{
        "Money":[
            {label:"Low Psg",type:"award"},
            {label:"Mid Psg",type:"award"},
            {label:"High Psg",type:"award"},
            {label:"StarPass",type:"award"},
            {label:"Cr 30,000",type:"money",amount:30000},
            {label:"Cr 40,000",type:"money",amount:40000},
            {label:"Cr 50,000",type:"money",amount:50000},
            {label:"Cr 60,000",type:"money",amount:60000},
            {label:"Cr 60,000",type:"money",amount:60000},
            {label:"Cr 60,000",type:"money",amount:60000},
            {label:"Cr 70,000",type:"money",amount:70000},
            {label:"Cr 80,000",type:"money",amount:80000},
        ], 
        "Benefits":[
            {label:"Ship Share",type:"ship"},
            {label:"Forbidden K",type:"knowledge"},
            {label:"Wafer Jack",type:"award"},
            {label:"C5 +1",type:"characteristic",characteristic:"C5"},
            {label:"Str +1",type:"characteristic",characteristic:"C1"},
            {label:"C2 +1",type:"characteristic",characteristic:"C2"},
            {label:"C3 +1",type:"characteristic",characteristic:"C3"},
            {label:"Ship Share",type:"ship"},
            {label:"Life Insur",type:"award"},
            {label:"TAS Fellow",type:"award"},
            {label:"Fame +2",type:"fame",amount:2}, //not sure what type to use.
            {label:"Knighthood",type:"award"},
        ]
    },
    "Noble":{
        "Money":[
            {label:"StarPass",type:"award"},
            {label:"StarPass",type:"award"},
            {label:"StarPass",type:"award"},
            {label:"StarPass",type:"award"},
            {label:"Cr 100,000",type:"money",amount:100000},
            {label:"Cr 200,000",type:"money",amount:200000},
            {label:"Cr 300,000",type:"money",amount:300000},
            {label:"Cr 400,000",type:"money",amount:400000},
            {label:"Cr 500,000",type:"money",amount:500000},
            {label:"Cr 600,000",type:"money",amount:600000},
            {label:"Cr 700,000",type:"money",amount:700000},
            {label:"Cr 800,000",type:"money",amount:800000},
        ],
        "Benefits":[
            {label:"Forbidden K",type:"knoweldge"},
            {label:"Str +1",type:"characteristic",characteristic:"C1"},
            {label:"Wafer Jack",type:"award"},
            {label:"C5 +1",type:"characteristic",characteristic:"C5"},
            {label:"Directorship",type:"award"},
            {label:"C2 +1",type:"characteristic",characteristic:"C2"},
            {label:"C3 +1",type:"characteristic",characteristic:"C3"},
            {label:"Int +1",type:"characteristic",characteristic:"C4"},
            {label:"Ship Share",type:"ship"},
            {label:"Life Insurance",type:"award"},
            {label:"TAS Life",type:"award"},
            {label:"Directorship",type:"award"},
        ],
        "Power":[
            {label:"Proxy (1)",type:"proxy",value:"1"},
            {label:"Proxy (2)",type:"proxy",value:"2"},
            {label:"Proxy (3)",type:"proxy",value:"3"},
            {label:"Proxy (4)",type:"proxy",value:"4"},
            {label:"Proxy (5)",type:"proxy",value:"5"},
            {label:"Proxy (6)",type:"proxy",value:"6"},
            {label:"Proxy (2D)",type:"proxy",value:"2D"},
            {label:"Proxy (2D)",type:"proxy",value:"2D"},
            {label:"Proxy (2D)",type:"proxy",value:"2D"},
            {label:"Proxy (2D)",type:"proxy",value:"2D"},
            {label:"Proxy (2D)",type:"proxy",value:"2D"},
            {label:"Proxy (2D)",type:"proxy",value:"2D"}
        ]
    },
    "Craftsman":{
        "Money":[
            {label:"Low Psg",type:"award"},
            {label:"Low Psg",type:"award"},
            {label:"Mid Psg",type:"award"},
            {label:"High Psg",type:"award"},
            {label:"Cr 15,000",type:"money",amount:30000},
            {label:"StarPass",type:"award"},
            {label:"Cr 25,000",type:"money",amount:25000},
            {label:"Cr 30,000",type:"money",amount:30000},
            {label:"Cr 35,000",type:"money",amount:35000},
            {label:"Cr 40,000",type:"money",amount:40000},
            {label:"Cr 50,000",type:"money",amount:50000},
            {label:"Cr 60,000",type:"money",amount:60000},
        ], 
        "Benefits":[
            {label:"Forbidden K",type:"knowledge"},
            {label:"Forbidden K",type:"knowledge"},
            {label:"Wafer Jack",type:"award"},
            {label:"C5 +1",type:"characteristic",characteristic:"C5"},
            {label:"Str +1",type:"characteristic",characteristic:"C1"},
            {label:"C2 +1",type:"characteristic",characteristic:"C2"},
            {label:"C3 +1",type:"characteristic",characteristic:"C3"},
            {label:"Int +1",type:"characteristic",characteristic:"C4"},
            {label:"Ship Share",type:"ship"},
            {label:"TAS Fellow",type:"award"},
            {label:"Directorship",type:"award"},
            {label:"TAS Life",type:"award"}
        ]
    },
    "Scholar":{
        "Money":[
            {label:"Low Psg",type:"award"},
            {label:"Low Psg",type:"award"},
            {label:"Mid Psg",type:"award"},
            {label:"High Psg",type:"award"},
            {label:"Cr 15,000",type:"money",amount:30000},
            {label:"StarPass",type:"award"},
            {label:"Cr 25,000",type:"money",amount:25000},
            {label:"Cr 30,000",type:"money",amount:30000},
            {label:"Cr 35,000",type:"money",amount:35000},
            {label:"Cr 40,000",type:"money",amount:40000},
            {label:"Cr 50,000",type:"money",amount:50000},
            {label:"Cr 60,000",type:"money",amount:60000},
        ], 
        "Benefits":[
            {label:"C5 +1",type:"characteristic",characteristic:"C5"},
            {label:"C5 +1",type:"characteristic",characteristic:"C5"},
            {label:"Wafer Jack",type:"award"},
            {label:"Edu +1",type:"characteristic",characteristic:"C5"},
            {label:"Str +1",type:"characteristic",characteristic:"C1"},
            {label:"C2 +1",type:"characteristic",characteristic:"C2"},
            {label:"C3 +1",type:"characteristic",characteristic:"C3"},
            {label:"Int +1",type:"characteristic",characteristic:"C4"},
            {label:"Fame +1",type:"fame",amount:1},
            {label:"Ship Share",type:"ship"},
            {label:"TAS Fellow",type:"award"},
            {label:"TAS Fellow",type:"award"}
        ]
    },
    "Entertainer":{
        "Money":[
            {label:"Low Psg",type:"award"},
            {label:"Low Psg",type:"award"},
            {label:"Mid Psg",type:"award"},
            {label:"High Psg",type:"award"},
            {label:"Cr 15,000",type:"money",amount:15000},
            {label:"StarPass",type:"award"},
            {label:"Cr 25,000",type:"money",amount:25000},
            {label:"Cr 30,000",type:"money",amount:30000},
            {label:"Cr 35,000",type:"money",amount:35000},
            {label:"Cr 40,000",type:"money",amount:40000},
            {label:"Cr 50,000",type:"money",amount:50000},
            {label:"Cr 400,000",type:"money",amount:400000},
        ], 
        "Benefits":[
            {label:"C5 +1",type:"characteristic",characteristic:"C5"},
            {label:"C5 +1",type:"characteristic",characteristic:"C5"},
            {label:"Wafer Jack",type:"award"},
            {label:"Edu +1",type:"characteristic",characteristic:"C5"},
            {label:"Str +1",type:"characteristic",characteristic:"C1"},
            {label:"C2 +1",type:"characteristic",characteristic:"C2"},
            {label:"C3 +1",type:"characteristic",characteristic:"C3"},
            {label:"Int +1",type:"characteristic",characteristic:"C4"},
            {label:"Fame +1",type:"fame",amount:1},
            {label:"Ship Share",type:"ship"},
            {label:"TAS Fellow",type:"award"},
            {label:"Knighthood",type:"award"}
        ]
    },
    "Merchant":{
        "Money":[
            {label:"Cr 40,000",type:"money", amount: 40000},
            {label:"StarPass",type:"award"},
            {label:"StarPass",type:"award"},
            {label:"High Psg",type:"award"},
            {label:"High Psg",type:"award"},
            {label:"StarPass",type:"award"},
            {label:"Cr 25,000",type:"money",amount:25000},
            {label:"Cr 30,000",type:"money",amount:30000},
            {label:"Cr 35,000",type:"money",amount:35000},
            {label:"Cr 40,000",type:"money",amount:40000},
            {label:"Cr 50,000",type:"money",amount:50000},
            {label:"Cr 90,000",type:"money",amount:90000},
        ], 
        "Benefits":[
            {label:"Str +1",type:"characteristic",characteristic:"C1"},
            {label:"C5 +1",type:"characteristic",characteristic:"C5"},
            {label:"Wafer Jack",type:"award"},
            {label:"C2 +1",type:"characteristic",characteristic:"C2"},
            {label:"C3 +1",type:"characteristic",characteristic:"C3"},
            {label:"Life Insur",type:"award"},
            {label:"Ship Share",type:"ship"},
            {label:"Knighthood",type:"award"},
            {label:"Ship Share",type:"ship"},
            {label:"Ship Share",type:"ship"},
            {label:"Ship Share",type:"ship"},
            {label:"Knighthood",type:"award"}
        ]
    },
    "Agent":{
        "Money":[
            {label:"Low Psg",type:"award"},
            {label:"Low Psg",type:"award"},
            {label:"Mid Psg",type:"award"},
            {label:"High Psg",type:"award"},
            {label:"Cr 15,000",type:"money",amount:15000},
            {label:"StarPass",type:"award"},
            {label:"Cr 25,000",type:"money",amount:25000},
            {label:"Cr 30,000",type:"money",amount:30000},
            {label:"Cr 35,000",type:"money",amount:35000},
            {label:"Cr 40,000",type:"money",amount:40000},
            {label:"Cr 80,000",type:"money",amount:80000},
            {label:"Cr 90,000",type:"money",amount:90000},
        ], 
        "Benefits":[
            {label:"Ship Share",type:"ship"},
            {label:"Forbidden K",type:"knowledge"},
            {label:"Wafer Jack",type:"award"},
            {label:"C5 +1",type:"characteristic",characteristic:"C5"},
            {label:"Str +1",type:"characteristic",characteristic:"C1"},
            {label:"C2 +1",type:"characteristic",characteristic:"C2"},
            {label:"C3 +1",type:"characteristic",characteristic:"C3"},
            {label:"Ship Share",type:"ship"},
            {label:"Life Insur",type:"award"},
            {label:"TAS Fellow",type:"award"},
            {label:"Fame +2",type:"fame",amount:2},
            {label:"Knighthood",type:"award"}
        ]
    },
    "Rogue":{
        "Money":[
            {label:"Cr 40,000",type:"money",amount:40000},
            {label:"StarPass",type:"award"},
            {label:"StarPass",type:"award"},
            {label:"High Psg",type:"award"},
            {label:"High Psg",type:"award"},
            {label:"StarPass",type:"award"},
            {label:"Cr 25,000",type:"money",amount:25000},
            {label:"Cr 30,000",type:"money",amount:30000},
            {label:"Cr 35,000",type:"money",amount:35000},
            {label:"Cr 40,000",type:"money",amount:40000},
            {label:"Cr 50,000",type:"money",amount:50000},
            {label:"Cr 90,000",type:"money",amount:90000},
        ], 
        "Benefits":[
            {label:"Str +1",type:"characteristic",characteristic:"C1"},
            {label:"C5 +1",type:"characteristic",characteristic:"C5"},
            {label:"Wafer Jack",type:"award"},
            {label:"C2 +1",type:"characteristic",characteristic:"C2"},
            {label:"C3 +1",type:"characteristic",characteristic:"C3"},
            {label:"Life Insur",type:"award"},
            {label:"Ship Share",type:"ship"},
            {label:"Knighthood",type:"award"},
            {label:"Ship Share",type:"ship"},
            {label:"Ship Share",type:"ship"},
            {label:"Ship Share",type:"ship"},
            {label:"Knighthood",type:"award"}
        ]
    },
    "Functionary":{
        "Money":[
            {label:"Cr 5,000",type:"money",amount:5000},
            {label:"Cr 10,000",type:"money",amount:10000},
            {label:"Cr 15,000",type:"money",amount:15000},
            {label:"Cr 20,000",type:"money",amount:20000},
            {label:"High Psg",type:"award"},
            {label:"StarPass",type:"award"},
            {label:"Cr 25,000",type:"money",amount:25000},
            {label:"Cr 30,000",type:"money",amount:30000},
            {label:"Cr 35,000",type:"money",amount:35000},
            {label:"Pension x2",type:"award"},
            {label:"Pension x2",type:"award"},
            {label:"Pension x2",type:"award"},
        ], 
        "Benefits":[
            {label:"Forbidden K",type:"knowledge"},
            {label:"Str +1",type:"characteristic",characteristic:"C1"},
            {label:"Wafer Jack",type:"award"},
            {label:"Str +1",type:"characteristic",characteristic:"C1"},
            {label:"C2 +1",type:"characteristic",characteristic:"C2"},
            {label:"C3 +1",type:"characteristic",characteristic:"C3"},
            {label:"Int +1",type:"characteristic",characteristic:"C4"},
            {label:"Life Insur",type:"award"},
            {label:"TAS Fellow",type:"award"},
            {label:"Knighthood",type:"award"},
            {label:"Directorship",type:"award"},
            {label:"Knighthood",type:"award"}
        ]
    }
};
