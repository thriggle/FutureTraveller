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
    "Citizen" : {
        "Tables":["Personal","Academic","Travel","General","Business","Vocation","Avocation"],
        "Personal":["C1","C2","C3","C4","C5","C6"],
        "Academic":["Major","Major","Minor","Minor","One Trade","One Trade"],
        "Travel":["Seafarer","Navigator","Hostile Environ","Flyer","Driver","Vacc Suit"],
        "General":["Admin","Broker","Computer","Animals","Bureaucrat","Trader"],
        "Business":["Diplomat","Sensors","Trader","Teacher","Fighter","Streetwise"],
        "Vocation":["Survey","Flyer","Language","Starship Skill","Engineer","Comms"],
        "Avocation":["One Art","One Science","Seafarer","Athlete","Medic","One Trade"]
    }
}