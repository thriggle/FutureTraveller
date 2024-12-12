export class ENUM_SKILLS{
    static get Admin(){ return "Admin"; }
    static get Advocate(){ return "Advocate"; }
    static get Animals(){ return "Animals"; }
    static get Athlete(){ return "Athlete"; }
    static get Broker(){ return "Broker"; }
    static get Bureaucrat(){ return "Bureaucrat"; }
    static get Comms(){ return "Comms"; }
    static get Computer(){ return "Computer"; }
    static get Counsellor(){ return "Counsellor"; }
    static get Designer(){ return "Designer"; }
    static get Diplomat(){ return "Diplomat"; }
    static get Driver(){ return "Driver"; }
    static get Explosives(){ return "Explosives"; }
    static get FleetTactics(){ return "Fleet Tactics"; }
    static get Flyer(){ return "Flyer"; }
    static get Forensics(){ return "Forensics"; }
    static get Gambler(){ return "Gambler"; }
    static get HighG(){ return "High-G"; }
    static get HostileEnviron(){ return "Hostile Environ"; }
    static get JOT(){ return "JOT"; }
    static get Language(){ return "Language"; }
    static get Leader(){ return "Leader"; }
    static get Liaison(){ return "Liaison"; }
    static get NavalArchitect(){ return "Naval Architect"; }
    static get Seafarer(){ return "Seafarer"; }
    static get Stealth(){ return "Stealth"; }
    static get Strategy(){ return "Strategy"; }
    static get Streetwise(){ return "Streetwise"; }
    static get Survey(){ return "Survey"; }
    static get Survival(){ return "Survival"; }
    static get Tactics(){ return "Tactics"; }
    static get Teacher(){ return "Teacher"; }
    static get Trader(){ return "Trader"; }
    static get VaccSuit(){ return "Vacc Suit"; }
    static get ZeroG(){ return "Zero-G"; }
    static get Astrogator(){ return "Astrogator"; }
    static get Engineer(){ return "Engineer"; }
    static get Gunner(){ return "Gunner"; }
    static get Medic(){ return "Medic"; }
    static get Pilot(){ return "Pilot"; }
    static get Sensors(){ return "Sensors"; }
    static get Steward(){ return "Steward"; }
    static get Biologics(){ return "Biologics"; }
    static get Craftsman(){ return "Craftsman"; }
    static get Electronics(){ return "Electronics"; }
    static get Fluidics(){ return "Fluidics"; }
    static get Gravitics(){ return "Gravitics"; }
    static get Magnetics(){ return "Magnetics"; }
    static get Mechanic(){ return "Mechanic"; }
    static get Photonics(){ return "Photonics"; }
    static get Polymers(){ return "Polymers"; }
    static get Programmer(){ return "Programmer"; }
    static get Actor(){ return "Actor"; }
    static get Artist(){ return "Artist"; }
    static get Author(){ return "Author"; }
    static get Chef(){ return "Chef"; }
    static get Dancer(){ return "Dancer"; }
    static get Musician(){ return "Musician"; }
    static get Fighter(){ return "Fighter"; }
    static get ForwardObserver(){ return "Forward Observer"; }
    static get HeavyWeapons(){ return "Heavy Weapons"; }
    static get Navigator(){ return "Navigator"; }
    static get Recon(){ return "Recon"; }
    static get Sapper(){ return "Sapper"; }
    static get Science(){ return "Science";}
}

export var StarshipSkills = [
    ENUM_SKILLS.Astrogator,
    ENUM_SKILLS.Engineer,
    ENUM_SKILLS.Gunner,
    ENUM_SKILLS.Medic,
    ENUM_SKILLS.Pilot,
    ENUM_SKILLS.Sensors,
    ENUM_SKILLS.Steward
];

export var TradeSkills = [
    ENUM_SKILLS.Biologics,
    ENUM_SKILLS.Craftsman,
    ENUM_SKILLS.Electronics,
    ENUM_SKILLS.Fluidics,
    ENUM_SKILLS.Gravitics,
    ENUM_SKILLS.Magnetics,
    ENUM_SKILLS.Mechanic,
    ENUM_SKILLS.Photonics,
    ENUM_SKILLS.Polymers,
    ENUM_SKILLS.Programmer
];

export var ArtSkills = [
    ENUM_SKILLS.Actor,
    ENUM_SKILLS.Artist,
    ENUM_SKILLS.Author,
    ENUM_SKILLS.Chef,
    ENUM_SKILLS.Dancer,
    ENUM_SKILLS.Musician
];

export var SoldierSkills = [
    ENUM_SKILLS.Fighter,
    ENUM_SKILLS.ForwardObserver,
    ENUM_SKILLS.HeavyWeapons,
    ENUM_SKILLS.Navigator,
    ENUM_SKILLS.Recon,
    ENUM_SKILLS.Sapper
];

export var Knowledges = {}
/*Knowledges[ENUM_SKILLS.Musician] = [
    "Voice",
    "Banjo",
    "Cello",
    "Didgeridoo",
    "Drums",
    "Guitar",
    "Harmonica",
    "Kalimba",
    "Keyboard",
    "Mandolin",
    "Mouth harp",
    "Pan flute",
    "Piano",
    "Theremin",
    "Trombone",
    "Trumpet",
    "Tuba",
    "Violin",
    "Viola",
    "Woodwind"
];*/
Knowledges[ENUM_SKILLS.Animals] = ["Rider","Teamster","Trainer"];
Knowledges[ENUM_SKILLS.Driver] = ["Automotive","ACV","Grav","Legged","Mole","Tracked","Wheeled"];
Knowledges[ENUM_SKILLS.Engineer] = ["Jump Drives","Life Support","Maneuver Drive","Power Systems"];
Knowledges[ENUM_SKILLS.Fighter] = ["Battle Dress","Beams","Blades","Exotics","Slug Throwers","Sprays","Unarmed"];
Knowledges[ENUM_SKILLS.Flyer] = ["Aeronautics","Flapper","Grav","LTA","Rotor","Winged"];
Knowledges[ENUM_SKILLS.Gunner] = ["Bay Weapons","Ortillery","Screens","Spines","Turrets"];
Knowledges[ENUM_SKILLS.HeavyWeapons] = ["Artillery","Launcher","Ordnance","WMD"];
Knowledges[ENUM_SKILLS.Pilot] = ["Small Craft","ACS","BCS"];
Knowledges[ENUM_SKILLS.Seafarer] = ["Aquanautics","Grav","Boat","Ship","Sub"];
Knowledges[ENUM_SKILLS.Language] = ["!kee","Anglic","Vilani","Battle","Gonk","Gvegh","Oynprith","Sagamaal","Tezapet","Trokh","Zdetl"];
Knowledges[ENUM_SKILLS.Science] = ["Archeology","Biology","Chemistry","History","Linguistics","Philosophy","Physics","Planetology","Psionicology","Psychohistory","Psychology","Robotics","Sophontology"];


