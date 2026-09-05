export class ENUM_TECH_STAGE {
    static get Ultimate() { return "Ultimate"; }
    static get Advanced() { return "Advanced"; }
    static get Modified() { return "Modified"; }
    static get Generic() { return "Generic"; }
    static get Improved() { return "Improved"; }
    static get Standard() { return "Standard"; }
    static get Basic() { return "Basic"; }
    static get Early() { return "Early"; }
    static get Prototype() { return "Prototype"; }
    static get Experimental() { return "Experimental"; }
}
export class ENUM_DRIVE_CLASS {
    static get "A"() { return { name: "A", ep: 100 }; }
    static get "B"() { return { name: "B", ep: 200 }; }
    static get "C"() { return { name: "C", ep: 300 }; }
    static get "D"() { return { name: "D", ep: 400 }; }
    static get "E"() { return { name: "E", ep: 500 }; }
    static get "F"() { return { name: "F", ep: 600 }; }
    static get "G"() { return { name: "G", ep: 700 }; }
    static get "H"() { return { name: "H", ep: 800 }; }
    static get "J"() { return { name: "I", ep: 900 }; }
    static get "K"() { return { name: "J", ep: 1000 }; }
    static get "L"() { return { name: "K", ep: 1100 }; }
    static get "M"() { return { name: "L", ep: 1200 }; }
    static get "N"() { return { name: "M", ep: 1300 }; }
    static get "P"() { return { name: "N", ep: 1400 }; }
    static get "Q"() { return { name: "O", ep: 1500 }; }
    static get "R"() { return { name: "P", ep: 1600 }; }
    static get "S"() { return { name: "Q", ep: 1700 }; }
    static get "T"() { return { name: "R", ep: 1800 }; }
    static get "U"() { return { name: "S", ep: 1900 }; }
    static get "V"() { return { name: "T", ep: 2000 }; }
    static get "W"() { return { name: "U", ep: 2100 }; }
    static get "X"() { return { name: "V", ep: 2200 }; }
    static get "Y"() { return { name: "W", ep: 2300 }; }
    static get "Z"() { return { name: "X", ep: 2400 }; }
}
export class ENUM_DRIVE_TYPE {
    static get Jump() { return "Jump"; }
    static get MDrive() { return "M-Drive"; }
    static get GDrive() { return "G-Drive"; }
    static get PowerPlant() { return "Power Plant"; }
    static get Fission() { return "Fission"; }
    static get AntiMatter() { return "Anti-Matter"; }
    static get Hop() { return "Hop"; }
    static get Skip() { return "Skip"; }
    static get Rocket() { return "Rocket"; }
    static get NAFAL() { return "NAFAL"; }
    static get HEPlaR() { return "HEPlaR"; }
    static get Collector() { return "Collector"; }
}
export class ENUM_DRIVE_STAGE {
    static get Ultimate() { return { stage: "Ultimate", mod: 4, eff: 1.3, fuel: 0.7, tons: 1 / 4, cost: 3 } }
    static get Advanced() { return { stage: "Advanced", mod: 3, eff: 1.2, fuel: 0.8, tons: 1 / 3, cost: 2 } }
    static get Modified() { return { stage: "Modified", mod: 2, eff: 1.1, fuel: 0.9, tons: 1 / 2, cost: 1 / 2 } }
    static get Generic() { return { stage: "Generic", mod: 1, eff: 0.9, fuel: 1.1, tons: 1, cost: 1 / 2 } }
    static get Improved() { return { stage: "Improved", mod: 1, eff: 1.1, fuel: 0.9, tons: 1, cost: 1 }; }
    static get Standard() { return { stage: "Standard", mod: 0, eff: 1.0, fuel: 1.0, tons: 1, cost: 1 }; }
    static get Basic() { return { stage: "Basic", mod: 0, eff: 0.9, fuel: 1.1, tons: 1, cost: 1 / 2 }; }
    static get Early() { return { stage: "Early", mod: -1, eff: 0.9, fuel: 1.1, tons: 1, cost: 2 }; }
    static get Prototype() { return { stage: "Prototype", mod: -2, eff: 0.8, fuel: 1.2, tons: 2, cost: 5 }; }
    static get Experimental() { return { stage: "Experimental", mod: -3, eff: 0.5, fuel: 2, tons: 3, cost: 10 }; }
}
export class ENUM_HULL_TYPE {
    static get Cluster() { return "Cluster"; }
    static get Braced() { return "Braced"; }
    static get Planetoid() { return "Planetoid"; }
    static get Unstreamlined() { return "Unstreamlined"; }
    static get Streamlined() { return "Streamlined"; }
    static get Airframe() { return "Airframe"; }
    static get LiftingBody() { return "Lifting Body"; }
}
export class ENUM_HULL_CONFIG {
    static get Cluster() { return { type: "Cluster", friction: 2, agility: -5, accel: 0, maxG: 1, stability: -3, land: false, cost: 2 / 100, flatcost: 0, podflatcost: 0 } }
    static get Braced() { return { type: "Braced", friction: 2, agility: -4, accel: 0, maxG: 3, stability: -2, land: false, cost: 3 / 100, flatcost: 0, podflatcost: 0 } }
    static get Planetoid() { return { type: "Planetoid", friction: 1, agility: -2, accel: 0, maxG: 9, stability: -1, land: false, cost: 1 / 100, flatcost: 0, podflatcost: 0 } }
    static get Unstreamlined() { return { type: "Unstreamlined", friction: 0.5, agility: -1, accel: 0, maxG: 9, stability: 0, land: true, cost: 3 / 100, flatcost: 2, podflatcost: 0.5 } }
    static get Streamlined() { return { type: "Streamlined", friction: 1 / 3, agility: 0, accel: 0, maxG: 9, stability: 1, land: true, cost: 6 / 100, flatcost: 2, podflatcost: 0.8 } }
    static get Airframe() { return { type: "Airframe", friction: 0.25, agility: 1, accel: 1, maxG: 9, stability: 2, land: true, cost: 7 / 100, flatcost: 2, podflatcost: 0.8 } }
    static get LiftingBody() { return { type: "Lifting Body", friction: 0.2, agility: 1, accel: 1, maxG: 9, stability: 3, land: true, cost: 12 / 100, flatcost: 4, podflatcost: 1.6 } }
    static get "Lifting Body"() { return this.LiftingBody; }
}
export class ENUM_HULL_FITTINGS {
    static get keys() { return ['FlotationHull', 'SubmergenceHull', 'Fins', 'FoldingFins', 'Wings', 'FoldingWings', 'LandingSkids', 'LandingLegsWithPads', 'LandingWheels', 'RemoveLifters']; }
    static get FlotationHull() { return { mechanisms: 1, name: "Flotation Hull", baseTL: 5, cost: 1, tons: 1, tonnageCanBeUsedForFuel: false, installable: ["Planetoid", "Unstreamlined", "Streamlined", "Airframe"], automatic: ["Lifting Body"], removableFromAutoInstall: false, comment: "Sealed against prolonged fluid exposure, the flotation hull permits water landing and takeoff." } }
    static get SubmergenceHull() { return { mechanisms: 1, name: "Submergence Hull", baseTL: 6, cost: 2, tons: 2, tonnageCanBeUsedForFuel: false, installable: ["Planetoid", "Unstreamlined", "Streamlined", "Airframe", "Lifting Body"], automatic: [], removableFromAutoInstall: false, comment: "Sealed against prolonged fluid exposure, the submergence hull gives the ability to submerge and resurface in addition to permitting water landing and takeoff. Doubles the effectiveness of hull armor vs pressure." } }
    static get Fins() { return { mechanisms: 1, name: "Fins", baseTL: 5, cost: 0.5, tons: 2, tonnageCanBeUsedForFuel: true, installable: ["Unstreamlined", "Streamlined", "Lifting Body"], automatic: ["Airframe"], removableFromAutoInstall: false, comment: "Fins increase Agility +1 in worlds with Atmo 2+." } }
    static get FoldingFins() { return { mechanisms: 1, name: "Folding Fins", baseTL: 8, deployedTons: 2, cost: 0.5, tons: 0, tonnageCanBeUsedForFuel: false, installable: ["Unstreamlined", "Streamlined"], automatic: [], removableFromAutoInstall: false, comment: "Fins increase Agility +1 in worlds with Atmo 2+. Folding fins only contribute to displacement tonnage when deployed." } }
    static get Wings() { return { mechanisms: 1, name: "Wings", baseTL: 7, cost: 1, tons: 5, tonnageCanBeUsedForFuel: true, installable: ["Unstreamlined", "Streamlined"], automatic: ["Airframe", "Lifting Body"], removableFromAutoInstall: false, comment: "Wings increase Speed by 1G in worlds with Atmo 2+." } }
    static get FoldingWings() { return { mechanisms: 1, name: "Folding Wings", baseTL: 9, deployedTons: 5, cost: 2, tons: 1, tonnageCanBeUsedForFuel: false, installable: ["Unstreamlined", "Streamlined"], automatic: [], removableFromAutoInstall: false, comment: "Wings increase Speed by 1G in worlds with Atmo 2+. Folding wings consume significantly less displacement tonnage when retracted." } }
    static get LandingSkids() { return { mechanisms: 1, name: "Landing Skids", baseTL: 7, cost: 0, tons: 0, tonnageCanBeUsedForFuel: false, installable: ["Cluster", "Braced", "Planetoid", "Unstreamlined", "Airframe"], automatic: ["Streamlined", "Lifting Body"], removableFromAutoInstall: false, comment: "Default landing skids are weight-bearing horizontal bars, retractable, which require a solid tarmac or bedrock landing site." } }
    static get LandingLegsWithPads() { return { mechanisms: 1, name: "Landing Legs with Pads", baseTL: 8, cost: 1, tons: 1, tonnageCanBeUsedForFuel: false, installable: ["Cluster", "Braced", "Planetoid", "Unstreamlined", "Streamlined", "Airframe", "Lifting Body"], automatic: [], removableFromAutoInstall: false, comment: "Landing legs with pads permit wilderness landings on uneven terrain." } }
    static get LandingWheels() { return { mechanisms: 1, name: "Landing Wheels", baseTL: 5, cost: 1.5, tons: 3, tonnageCanBeUsedForFuel: false, installable: ["Cluster", "Braced", "Planetoid", "Unstreamlined", "Streamlined", "Lifting Body"], automatic: ["Airframe"], removableFromAutoInstall: false, comment: "Retractable landing wheels permit glide landing/takeoff from solid airstrips. Required when using wings for liftoff or landing." } }
    static get RemoveLifters() { return { mechanisms: -1, name: "Remove Lifters", baseTL: 8, cost: -0.5, tons: 0, tonnageCanBeUsedForFuel: false, installable: ["Cluster", "Braced", "Planetoid", "Unstreamlined", "Streamlined", "Airframe", "Lifting Body"], automatic: [], removableFromAutoInstall: false, comment: "Opt out of auto-installed Lifters. Deducts their cost from the hull." } }
}
export const ENUM_HULL_ARMOR = {
    Plate: { type: "Plate", AV_Mult: 1, ton_Mult: 1, AV_FlatBonus: 0, configurations: ["Cluster", "Braced", "Unstreamlined", "Streamlined"] },
    Charged: { type: "Charged", AV_Mult: 2, ton_Mult: 1, AV_FlatBonus: 0, configurations: ["Cluster", "Braced", "Unstreamlined", "Streamlined"] },
    Shell: { type: "Shell", AV_Mult: 0.5, ton_Mult: 0.5, AV_FlatBonus: 0, configurations: ["Streamlined", "Airframe", "Lifting Body"] },
    Polymer: { type: "Polymer", AV_Mult: 0.5, ton_Mult: 1, AV_FlatBonus: 0, configurations: ["Cluster", "Braced", "Unstreamlined", "Streamlined", "Airframe"] },
    Organic: { type: "Organic", AV_Mult: 0.5, ton_Mult: 1, AV_FlatBonus: 0, configurations: ["Cluster", "Braced", "Unstreamlined", "Streamlined", "Airframe"] },
    FeN: { type: "FeN", AV_Mult: 0, ton_Mult: 1, AV_FlatBonus: 20, configurations: ["Planetoid", "Unstreamlined"] }
};

export const ENUM_STAGE_EFFECTS = {
    Experimental: { code: 'Exp', stage: "Experimental", tlMod: -3, costMult: 10, mod: -3 },
    Prototype: { code: 'Pro', stage: "Prototype", tlMod: -2, costMult: 5, mod: -2 },
    Early: { code: 'Ear', stage: "Early", tlMod: -1, costMult: 2, mod: -1 },
    Standard: { code: 'Std', stage: "Standard", tlMod: 0, costMult: 1, mod: 0 },
    Basic: { code: 'Bas', stage: "Basic", tlMod: 0, costMult: 0.5, mod: 0 },
    Alternate: { code: 'Alt', stage: "Alternate", tlMod: 0, costMult: 1, mod: 0 },
    Improved: { code: 'Imp', stage: "Improved", tlMod: 1, costMult: 1, mod: 1 },
    Generic: { code: 'Gen', stage: "Generic", tlMod: 1, costMult: 0.5, mod: 0 },
    Modified: { code: 'Mod', stage: "Modified", tlMod: 2, costMult: 0.5, mod: 2 },
    Advanced: { code: 'Adv', stage: "Advanced", tlMod: 3, costMult: 2, mod: 3 },
    Ultimate: { code: 'Ult', stage: "Ultimate", tlMod: 4, costMult: 3, mod: 4 }
};

export const ENUM_SPACE_RANGES = {
    BR: { code: 'BR', name: "Boarding Range (BR, 0)", s: 0, r: 5, tlMod: -3, tonsMult: 0.25, costMult: 0.25 },
    FR: { code: 'FR', name: "Fighter Range (FR, 2)", s: 2, r: 6, tlMod: -2, tonsMult: 1 / 3, costMult: 1 / 3 },
    SR: { code: 'SR', name: "Short Range (SR, 5)", s: 5, r: 7, tlMod: -1, tonsMult: 0.5, costMult: 0.5 },
    AR: { code: 'AR', name: "Attack Range (AR, 7)", s: 7, r: 7, tlMod: 0, tonsMult: 1.0, costMult: 1.0 },
    LR: { code: 'LR', name: "Long Range (LR, 9)", s: 9, r: 8, tlMod: 1, tonsMult: 2.0, costMult: 3.0 },
    DS: { code: 'DS', name: "Deep Space (DS, 12)", s: 12, r: 9, tlMod: 2, tonsMult: 3.0, costMult: 5.0 }
};

export const ENUM_WEAPON_MOUNTS = {
    Fix: { code: 'Fix', name: "Fixed Mount", tons: 0, mod: -2, hits: 1, cost: 0.1, hardpointReq: 1, firmpointReq: 1, cp: 1 },
    T1: { code: 'T1', name: "Single Turret (T1)", tons: 1, mod: -2, hits: 1, cost: 0.2, hardpointReq: 1, firmpointReq: 0, cp: 1 },
    T2: { code: 'T2', name: "Dual Turret (T2)", tons: 1, mod: -1, hits: 2, cost: 0.5, hardpointReq: 1, firmpointReq: 0, cp: 1 },
    T3: { code: 'T3', name: "Triple Turret (T3)", tons: 1, mod: 0, hits: 3, cost: 1.0, hardpointReq: 1, firmpointReq: 0, cp: 1 },
    T4: { code: 'T4', name: "Quad Turret (T4)", tons: 1, mod: 1, hits: 4, cost: 1.5, hardpointReq: 1, firmpointReq: 0, cp: 1 },
    B1: { code: 'B1', name: "Single Barbette (B1)", tons: 3, mod: 2, hits: 5, cost: 3.0, hardpointReq: 1, firmpointReq: 0, cp: 1 },
    B2: { code: 'B2', name: "Dual Barbette (B2)", tons: 5, mod: 3, hits: 10, cost: 4.0, hardpointReq: 1, firmpointReq: 0, cp: 1 },
    Bay: { code: 'Bay', name: "Small Bay (50t)", tons: 50, mod: 5, hits: 20, cost: 5.0, hardpointReq: 5, firmpointReq: 0, cp: 2 },
    LBay: { code: 'LBay', name: "Large Bay (100t)", tons: 100, mod: 8, hits: 30, cost: 10.0, hardpointReq: 10, firmpointReq: 0, cp: 3 },
    M: { code: 'M', name: "Main / Spinal (200t)", tons: 200, mod: 10, hits: 100, cost: 20.0, hardpointReq: 20, firmpointReq: 0, cp: 4 }
};

export const ENUM_DEFENSE_MOUNTS = {
    Bo: { code: 'Bo', name: "Bolt-In Mount (3t)", tons: 3, mod: 3, cost: 3.0, hardpointReq: 1, firmpointReq: 0, cp: 1 },
    Surf: { code: 'Surf', name: "Surface Mount", tons: 0, mod: 0, cost: 1.0, hardpointReq: 0, firmpointReq: 0, cp: 1 },
    T1: { code: 'T1', name: "Single Turret (T1)", tons: 1, mod: 1, cost: 0.2, hardpointReq: 1, firmpointReq: 0, cp: 1 },
    T2: { code: 'T2', name: "Dual Turret (T2)", tons: 1, mod: 2, cost: 0.5, hardpointReq: 1, firmpointReq: 0, cp: 1 },
    T3: { code: 'T3', name: "Triple Turret (T3)", tons: 1, mod: 3, cost: 1.0, hardpointReq: 1, firmpointReq: 0, cp: 1 },
    T4: { code: 'T4', name: "Quad Turret (T4)", tons: 1, mod: 4, cost: 1.5, hardpointReq: 1, firmpointReq: 0, cp: 1 },
    B1: { code: 'B1', name: "Single Barbette (B1)", tons: 3, mod: 1, cost: 3.0, hardpointReq: 1, firmpointReq: 0, cp: 1 },
    B2: { code: 'B2', name: "Dual Barbette (B2)", tons: 5, mod: 2, cost: 4.0, hardpointReq: 1, firmpointReq: 0, cp: 1 },
    Bay: { code: 'Bay', name: "Small Bay (50t)", tons: 50, mod: 1, cost: 5.0, hardpointReq: 5, firmpointReq: 0, cp: 2 },
    LBay: { code: 'LBay', name: "Large Bay (100t)", tons: 100, mod: 1, cost: 10.0, hardpointReq: 10, firmpointReq: 0, cp: 3 },
    M: { code: 'M', name: "Main / Spinal (200t)", tons: 200, mod: 1, cost: 20.0, hardpointReq: 20, firmpointReq: 0, cp: 4 }
};

export const ENUM_SENSOR_MOUNTS = {
    Surf: { code: 'Surf', name: "Surface Mount", tons: 0, mod: 0, cost: 1.0, hardpointReq: 0, firmpointReq: 0, cp: 1 },
    Ant: { code: 'Ant', name: "Antenna (1t)", tons: 1, mod: 1, cost: 0.5, hardpointReq: 1, firmpointReq: 0, cp: 1 },
    T1: { code: 'T1', name: "Single Turret (T1)", tons: 1, mod: -2, cost: 0.2, hardpointReq: 1, firmpointReq: 0, cp: 1 },
    T2: { code: 'T2', name: "Dual Turret (T2)", tons: 1, mod: -1, cost: 0.5, hardpointReq: 1, firmpointReq: 0, cp: 1 },
    T3: { code: 'T3', name: "Triple Turret (T3)", tons: 1, mod: 0, cost: 1.0, hardpointReq: 1, firmpointReq: 0, cp: 1 },
    T4: { code: 'T4', name: "Quad Turret (T4)", tons: 1, mod: 1, cost: 1.5, hardpointReq: 1, firmpointReq: 0, cp: 1 },
    B1: { code: 'B1', name: "Single Barbette (B1)", tons: 3, mod: 2, cost: 3.0, hardpointReq: 1, firmpointReq: 0, cp: 1 },
    B2: { code: 'B2', name: "Dual Barbette (B2)", tons: 5, mod: 3, cost: 4.0, hardpointReq: 1, firmpointReq: 0, cp: 1 },
    BAnt: { code: 'BAnt', name: "Big Antenna (10t)", tons: 10, mod: 5, cost: 2.0, hardpointReq: 1, firmpointReq: 0, cp: 1 },
    Bay: { code: 'Bay', name: "Small Bay (50t)", tons: 50, mod: 5, cost: 5.0, hardpointReq: 5, firmpointReq: 0, cp: 2 },
    LBay: { code: 'LBay', name: "Large Bay (100t)", tons: 100, mod: 8, cost: 10.0, hardpointReq: 10, firmpointReq: 0, cp: 3 },
    M: { code: 'M', name: "Main Sensor Array (200t)", tons: 200, mod: 10, cost: 20.0, hardpointReq: 20, firmpointReq: 0, cp: 4 }
};

export const ENUM_WEAPONS2 = {
    MiningLaser: { key: 'MiningLaser', code: 'J', name: 'Mining Laser', category: 'Beams', baseTL: 8, defaultMount: 'T1', defaultRange: 'AR', baseCost: 0.5, principle: 'Electronic. Turret. Bay. Main.', comment: 'Short pulsed industrial laser with high thermal output.' },
    PulseLaser: { key: 'PulseLaser', code: 'K', name: 'Pulse Laser', category: 'Beams', baseTL: 9, defaultMount: 'T1', defaultRange: 'AR', baseCost: 0.3, principle: 'Electronic. Turret. Bay. Main.', comment: 'High-energy burst laser optimized for armor ablation.' },
    BeamLaser: { key: 'BeamLaser', code: 'L', name: 'Beam Laser', category: 'Beams', baseTL: 10, defaultMount: 'T1', defaultRange: 'AR', baseCost: 0.5, principle: 'Electronic. Turret. Bay. Main.', comment: 'Continuous beam weapon offering high precision targeting.' },
    PlasmaGun: { key: 'PlasmaGun', code: 'P', name: 'Plasma Gun', category: 'Beams', baseTL: 11, defaultMount: 'B1', defaultRange: 'AR', baseCost: 1.0, principle: 'Electronic. Gravitic. Turret. Bay. Main.', comment: 'Superheated magnetically-contained plasma packet projector.' },
    FusionGun: { key: 'FusionGun', code: 'F', name: 'Fusion Gun', category: 'Beams', baseTL: 12, defaultMount: 'B1', defaultRange: 'AR', baseCost: 1.5, principle: 'Electronic. Gravitic. Turret. Bay. Main.', comment: 'High-yield thermonuclear fusion bolt projector.' },
    SlugThrower: { key: 'SlugThrower', code: 'B', name: 'Slug Thrower', category: 'Kinetic', baseTL: 9, defaultMount: 'T1', defaultRange: 'AR', baseCost: 0.2, principle: 'Electronic. Turret. Bay. Main.', comment: 'High-velocity chemically propelled projectile weapon.' },
    SalvoRack: { key: 'SalvoRack', code: 'V', name: 'Salvo Rack', category: 'Missiles', baseTL: 10, defaultMount: 'Bay', defaultRange: 'AR', baseCost: 10.0, principle: 'Electronic. Magnetic. Bay. Main.', comment: 'High-density multi-missile saturation battery.' },
    RailGun: { key: 'RailGun', code: 'R', name: 'Rail Gun', category: 'Kinetic', baseTL: 12, defaultMount: 'Bay', defaultRange: 'AR', baseCost: 12.0, principle: 'Electronic. Magnetic. Ortillery.', comment: 'Linear electromagnetic mass accelerator with kinetic slugs.' },
    Missile: { key: 'Missile', code: 'M', name: 'Missile Rack', category: 'Missiles', baseTL: 7, defaultMount: 'T1', defaultRange: 'AR', baseCost: 2.0, principle: 'Electronic. Turret. Bay. Main.', comment: 'Standard space-combat guided missile launcher.' },
    KKMissile: { key: 'KKMissile', code: 'N', name: 'KK Missile Launcher', category: 'Missiles', baseTL: 10, defaultMount: 'Bay', defaultRange: 'AR', baseCost: 3.0, principle: 'Electronic. Bay. Main.', comment: 'Kinetic-kill relativistic warhead delivery system.' },
    AMMissile: { key: 'AMMissile', code: 'X', name: 'Antimatter Missile Launcher', category: 'Missiles', baseTL: 20, defaultMount: 'B1', defaultRange: 'AR', baseCost: 5.0, principle: 'Electronic. Turret. Bay. Main.', comment: 'Annihilation warhead launcher for extreme destructive yield.' },
    JumpDamper: { key: 'JumpDamper', code: 'T', name: 'Jump Damper', category: 'Exotics', baseTL: 14, defaultMount: 'B1', defaultRange: 'AR', baseCost: 15.0, principle: 'Electronic. Turret. Bay. Main.', comment: 'Projects jump-suppression field to inhibit nearby drives.' },
    TractorPressor: { key: 'TractorPressor', code: 'U', name: 'Tractor / Pressor Beam', category: 'Exotics', baseTL: 16, defaultMount: 'B1', defaultRange: 'AR', baseCost: 5.0, principle: 'Electronic. Turret. Bay. Main.', comment: 'Gravitic manipulator for towing, pushing, and capture.' },
    Inducer: { key: 'Inducer', code: 'H', name: 'Inducer', category: 'Exotics', baseTL: 17, defaultMount: 'T1', defaultRange: 'AR', baseCost: 1.0, principle: 'Electronic. Turret. Bay. Main.', comment: 'Exotic matter disruption emitter.' },
    Disruptor: { key: 'Disruptor', code: 'W', name: 'Disruptor', category: 'Exotics', baseTL: 18, defaultMount: 'B1', defaultRange: 'AR', baseCost: 15.0, principle: 'Electronic. Gravitic. Turret. Bay. Main.', comment: 'Molecular bond destabilization field projector.' },
    Stasis: { key: 'Stasis', code: 'E', name: 'Stasis Beam', category: 'Exotics', baseTL: 21, defaultMount: 'T1', defaultRange: 'AR', baseCost: 5.0, principle: 'Electronic. Turret. Bay. Main.', comment: 'Temporal velocity retardation beam.' },
    DataCaster: { key: 'DataCaster', code: 'D', name: 'DataCaster', category: 'Special', baseTL: 10, defaultMount: 'T1', defaultRange: 'AR', baseCost: 1.0, principle: 'Electronic. Turret. Bay. Main.', comment: 'High-bandwidth cyberwarfare & datalink projector.' },
    SandCaster: { key: 'SandCaster', code: 'S', name: 'SandCaster', category: 'Special', baseTL: 9, defaultMount: 'T1', defaultRange: 'AR', baseCost: 0.1, principle: 'Electronic. Turret. Bay. Main.', comment: 'Ablative refractory sand canister launcher vs beam lasers.' },
    Ortillery: { key: 'Ortillery', code: 'Q', name: 'Ortillery (Orbital Artillery)', category: 'Special', baseTL: 12, defaultMount: 'Bay', defaultRange: 'AR', baseCost: 15.0, principle: 'Electronic. Ortillery.', comment: 'Heavy planetary bombardment and siege weapon.' },
    CommCaster: { key: 'CommCaster', code: 'C', name: 'CommCaster', category: 'Special', baseTL: 8, defaultMount: 'T1', defaultRange: 'AR', baseCost: 5.0, principle: 'Electronic. Turret. Bay. Main.', comment: 'Long-range tightbeam multi-channel communications broadcaster.' },
    HybridSLM: { key: 'HybridSLM', code: 'Y', name: 'Hybrid Sand/Laser/Missile', category: 'Special', baseTL: 10, defaultMount: 'T1', defaultRange: 'AR', baseCost: 1.0, principle: 'Electronic. Turret. Bay. Main.', comment: 'Multi-role combination turret carrying sand, laser, and missile.' },
    ParticleAccel: { key: 'ParticleAccel', code: 'A', name: 'Particle Accelerator (PA)', category: 'Heavy', baseTL: 11, defaultMount: 'B1', defaultRange: 'AR', baseCost: 2.5, principle: 'Electronic. Magnetic. Turret. Bay. Main.', comment: 'High-energy relativistic subatomic particle beam cannon.' },
    MesonGun: { key: 'MesonGun', code: 'G', name: 'Meson Gun', category: 'Heavy', baseTL: 13, defaultMount: 'M', defaultRange: 'AR', baseCost: 5.0, principle: 'Electronic. Gravitic. Main.', comment: 'Decaying meson subatomic beam bypassing conventional hull armor.' }
};

export const ENUM_DEFENSES2 = {
    NuclearDamper: { key: 'NuclearDamper', code: 'N', name: 'Nuclear Damper', category: 'Screens', baseTL: 12, defaultMount: 'Bo', defaultRange: 'AR', baseCost: 1.0, principle: 'Electronic. Turret. Bay. Main.', comment: 'Suppresses strong nuclear force; neutralizes nuclear warheads.' },
    MesonScreen: { key: 'MesonScreen', code: 'G', name: 'Meson Screen', category: 'Screens', baseTL: 13, defaultMount: 'Bo', defaultRange: 'AR', baseCost: 3.0, principle: 'Electronic. Turret. Bay. Main.', comment: 'Deflects and decays hostile meson particle beams.' },
    ProtonScreen: { key: 'ProtonScreen', code: 'R', name: 'Proton Screen', category: 'Screens', baseTL: 19, defaultMount: 'Bo', defaultRange: 'AR', baseCost: 1.0, principle: 'Electronic. Turret. Bay. Main.', comment: 'High-energy charged particle screen.' },
    MagScrambler: { key: 'MagScrambler', code: 'Q', name: 'Magnetic Scrambler', category: 'Scramblers', baseTL: 14, defaultMount: 'Bo', defaultRange: 'AR', baseCost: 1.0, principle: 'Magnetic Screens.', comment: 'Active magnetic pulse field distorting missile tracking.' },
    GravScrambler: { key: 'GravScrambler', code: 'J', name: 'Gravitic Scrambler', category: 'Scramblers', baseTL: 17, defaultMount: 'Bo', defaultRange: 'AR', baseCost: 2.0, principle: 'Gravitic. Screens.', comment: 'Gravitational ripple distortion screen.' },
    ElecScrambler: { key: 'ElecScrambler', code: 'E', name: 'Electronic Scrambler', category: 'Scramblers', baseTL: 12, defaultMount: 'Bo', defaultRange: 'AR', baseCost: 2.0, principle: 'Electronic. Screens.', comment: 'Broadband EW jamming screen.' },
    BlackGlobe: { key: 'BlackGlobe', code: 'T', name: 'Black Globe Generator', category: 'Globes', baseTL: 16, defaultMount: 'Bo', defaultRange: 'AR', baseCost: 10.0, principle: 'Electronic. Screens.', comment: 'Absorbs incoming energy and weapons fire into internal force field.' },
    WhiteGlobe: { key: 'WhiteGlobe', code: 'U', name: 'White Globe Generator', category: 'Globes', baseTL: 20, defaultMount: 'Bo', defaultRange: 'AR', baseCost: 10.0, principle: 'Electronic. Screens.', comment: 'Reflective high-density repulsion screen.' },
    SilverGlobe: { key: 'SilverGlobe', code: 'V', name: 'Silver Globe Generator', category: 'Globes', baseTL: 22, defaultMount: 'Bo', defaultRange: 'AR', baseCost: 10.0, principle: 'Electronic. Screens.', comment: 'Phase-shifting defense barrier.' },
    StasisGlobe: { key: 'StasisGlobe', code: 'W', name: 'Stasis Globe Generator', category: 'Globes', baseTL: 24, defaultMount: 'Bo', defaultRange: 'AR', baseCost: 10.0, principle: 'Electronic. Screens.', comment: 'Total temporal barrier rendering ship invulnerable.' },
    Jammer: { key: 'Jammer', code: 'J', name: 'EW Jammer', category: 'EW', baseTL: 8, defaultMount: 'Surf', defaultRange: 'AR', baseCost: 1.0, principle: 'Electronic EW suite.', comment: 'Active radar and radio frequency barrage jammer.' },
    StealthMask: { key: 'StealthMask', code: 'Q', name: 'Stealth Mask System', category: 'EW', baseTL: 12, defaultMount: 'Surf', defaultRange: 'AR', baseCost: 1.0, principle: 'Signature reduction.', comment: 'Surface masking array reducing active and passive detectability.' },
    SandCasterDef: { key: 'SandCasterDef', code: 'S', name: 'Point Defense SandCaster', category: 'Point Defense', baseTL: 9, defaultMount: 'T1', defaultRange: 'AR', baseCost: 0.1, principle: 'Defensive Laser Countermeasure.', comment: 'Canister dispenser creating laser-diffusing aerosol clouds.' },
    PDLLaser: { key: 'PDLLaser', code: 'L', name: 'Point Defense Laser (PDL)', category: 'Point Defense', baseTL: 10, defaultMount: 'T1', defaultRange: 'AR', baseCost: 0.5, principle: 'Fast tracking point-defense.', comment: 'Rapid auto-targeting laser to intercept incoming missiles and torpedoes.' }
};

export const ENUM_SENSORS2 = {
    Communicator: { key: 'Communicator', code: 'C', name: 'Communicator Array', category: 'Visual/Comms', baseTL: 8, defaultMount: 'Surf', defaultRange: 'AR', baseCost: 1.0, mode: 'Passive/Active', principle: 'Electronics. Comms.', comment: 'Standard multi-band subspace and radio communications transceiver.' },
    Holovisor: { key: 'Holovisor', code: 'H', name: 'Holovisor', category: 'Visual/Comms', baseTL: 18, defaultMount: 'Surf', defaultRange: 'AR', baseCost: 1.0, mode: 'Passive', principle: 'Photonics.', comment: 'Full-spectrum holographic optical sensor.' },
    Scope: { key: 'Scope', code: 'T', name: 'Optical Telescope / Scope', category: 'Visual/Comms', baseTL: 9, defaultMount: 'Surf', defaultRange: 'AR', baseCost: 1.0, mode: 'Passive', principle: 'Photonics.', comment: 'Magnified optical and visual light telescope array.' },
    Visor: { key: 'Visor', code: 'V', name: 'Wide-Spectrum Visor', category: 'Visual/Comms', baseTL: 14, defaultMount: 'Surf', defaultRange: 'AR', baseCost: 1.0, mode: 'Passive', principle: 'Photonics.', comment: 'Enhanced multi-wavelength visual sensor.' },
    HeatSensor: { key: 'HeatSensor', code: 'H', name: 'Thermal / Heat Sensor', category: 'Thermal/EM', baseTL: 10, defaultMount: 'Surf', defaultRange: 'AR', baseCost: 1.0, mode: 'Passive', principle: 'Thermal IR.', comment: 'Infrared detector for drive flares and hull thermal emissions.' },
    EMSensor: { key: 'EMSensor', code: 'E', name: 'EM / Radio Frequency Sensor', category: 'Thermal/EM', baseTL: 10, defaultMount: 'Surf', defaultRange: 'AR', baseCost: 1.0, mode: 'Passive', principle: 'Electromagnetic.', comment: 'Passive antenna monitoring electromagnetic emanations.' },
    Densitometer: { key: 'Densitometer', code: 'D', name: 'Densitometer', category: 'Gravitic', baseTL: 14, defaultMount: 'Surf', defaultRange: 'AR', baseCost: 1.0, mode: 'Passive', principle: 'Gravitic.', comment: 'Measures density variations through solid structures and hulls.' },
    Neutrino: { key: 'Neutrino', code: 'N', name: 'Neutrino Sensor', category: 'Nuclear', baseTL: 10, defaultMount: 'Surf', defaultRange: 'AR', baseCost: 1.0, mode: 'Passive', principle: 'Nuclear.', comment: 'Detects fusion and fission power plant neutrino fluxes.' },
    ActivitySensor: { key: 'ActivitySensor', code: 'A', name: 'Activity Detector', category: 'Special', baseTL: 13, defaultMount: 'Surf', defaultRange: 'AR', baseCost: 1.0, mode: 'Passive', principle: 'Activity.', comment: 'Detects organic movement, biological signs, and interior operations.' },
    Proximity: { key: 'Proximity', code: 'P', name: 'Proximity Sensor', category: 'Visual/Comms', baseTL: 9, defaultMount: 'Surf', defaultRange: 'AR', baseCost: 1.0, mode: 'Passive', principle: 'Proximity.', comment: 'Short-range navigational collision warning sensors.' },
    Radar: { key: 'Radar', code: 'R', name: 'Radar Suite', category: 'Active', baseTL: 9, defaultMount: 'Surf', defaultRange: 'AR', baseCost: 1.0, mode: 'Active', principle: 'Radar.', comment: 'Active radio wave pulse reflection detection and tracking.' },
    Lidar: { key: 'Lidar', code: 'L', name: 'Lidar Suite', category: 'Active', baseTL: 11, defaultMount: 'Surf', defaultRange: 'AR', baseCost: 1.0, mode: 'Active', principle: 'Lidar.', comment: 'Active coherent light laser ranging and imaging array.' },
    Scanner: { key: 'Scanner', code: 'S', name: 'Deep Scanner', category: 'Active', baseTL: 12, defaultMount: 'Surf', defaultRange: 'AR', baseCost: 1.0, mode: 'Active', principle: 'Scanner.', comment: 'High-penetration active search scanner.' },
    JammerSensor: { key: 'JammerSensor', code: 'J', name: 'Sensor Jammer', category: 'Special', baseTL: 8, defaultMount: 'Surf', defaultRange: 'AR', baseCost: 1.0, mode: 'Active', principle: 'Jammer.', comment: 'Blinds hostile sensor receivers with active electronic noise.' },
    Sonar: { key: 'Sonar', code: 'O', name: 'Active/Passive Sonar', category: 'Special', baseTL: 7, defaultMount: 'Surf', defaultRange: 'AR', baseCost: 1.0, mode: 'Active', principle: 'Acoustic Sonar.', comment: 'Acoustic detection for submerged or oceanic operations.' },
    Searchlight: { key: 'Searchlight', code: 'I', name: 'High-Power Searchlight', category: 'Visual/Comms', baseTL: 6, defaultMount: 'Surf', defaultRange: 'AR', baseCost: 1.0, mode: 'Active', principle: 'Searchlight.', comment: 'Visible and UV high-candela optical illuminator.' },
    StealthMaskSensor: { key: 'StealthMaskSensor', code: 'Q', name: 'Stealth Mask Suite', category: 'Special', baseTL: 12, defaultMount: 'Surf', defaultRange: 'AR', baseCost: 1.0, mode: 'Active', principle: 'Stealth Mask.', comment: 'Active counter-emission field neutralizing enemy sensor probes.' }
};

export function buildWeapon(weaponKey, mountKey = 'T1', stageKey = 'Standard', rangeKey = 'AR', count = 1, options = {}) {
    const wDef = ENUM_WEAPONS2[weaponKey];
    if (!wDef) throw new Error(`Unknown weapon key: ${weaponKey}`);
    const mDef = ENUM_WEAPON_MOUNTS[mountKey] || ENUM_WEAPON_MOUNTS.T1;
    const sDef = ENUM_STAGE_EFFECTS[stageKey] || ENUM_STAGE_EFFECTS.Standard;
    const rDef = ENUM_SPACE_RANGES[rangeKey] || ENUM_SPACE_RANGES.AR;

    const baseTL = options.tl !== undefined ? options.tl : Math.max(0, wDef.baseTL + sDef.tlMod + rDef.tlMod);
    const deployable = options.deployable === true;
    const extendable = options.extendable === true;
    const importFee = options.importFee === true;

    const singleWpnCost = wDef.baseCost * sDef.costMult * (importFee ? 1.1 : 1.0);
    const singleMountCost = (mDef.cost * rDef.costMult + (deployable ? 3.0 : 0) + (extendable ? 1.0 : 0)) * (importFee ? 1.1 : 1.0);
    const totalCost = (singleWpnCost + singleMountCost) * count;

    const singleTons = (mDef.tons * rDef.tonsMult) + (deployable ? 2.0 : 0) + (extendable ? 2.0 : 0);
    const totalTons = singleTons * count;

    const hardpointsReq = (mDef.hardpointReq || 0) * count;
    const firmpointsReq = (mDef.firmpointReq || 0) * count;
    const totalCP = (mDef.cp || 1) * count;

    return {
        isWeapon: true,
        weaponKey: weaponKey,
        name: wDef.name,
        code: wDef.code,
        category: wDef.category,
        mountKey: mountKey,
        mountName: mDef.name,
        mountCode: mDef.code,
        stage: stageKey,
        rangeKey: rangeKey,
        rangeName: rDef.name,
        spaceRange: rDef.s,
        worldRange: rDef.r,
        tl: baseTL,
        count: count,
        deployable: deployable,
        extendable: extendable,
        importFee: importFee,
        hits: mDef.hits || 1,
        mod: (mDef.mod || 0) + (sDef.mod || 0),
        tons: Math.round(totalTons * 100) / 100,
        cost: Math.round(totalCost * 1000) / 1000,
        hardpointReq: hardpointsReq,
        firmpointReq: firmpointsReq,
        cp: totalCP,
        comment: wDef.comment
    };
}

export function buildDefense(defenseKey, mountKey = 'Bo', stageKey = 'Standard', rangeKey = 'AR', count = 1, options = {}) {
    const dDef = ENUM_DEFENSES2[defenseKey];
    if (!dDef) throw new Error(`Unknown defense key: ${defenseKey}`);
    const mDef = ENUM_DEFENSE_MOUNTS[mountKey] || ENUM_DEFENSE_MOUNTS.Bo;
    const sDef = ENUM_STAGE_EFFECTS[stageKey] || ENUM_STAGE_EFFECTS.Standard;
    const rDef = ENUM_SPACE_RANGES[rangeKey] || ENUM_SPACE_RANGES.AR;

    const baseTL = options.tl !== undefined ? options.tl : Math.max(0, dDef.baseTL + sDef.tlMod + rDef.tlMod);
    const deployable = options.deployable === true;
    const extendable = options.extendable === true;
    const importFee = options.importFee === true;

    const singleDefCost = dDef.baseCost * sDef.costMult * (importFee ? 1.1 : 1.0);
    const singleMountCost = (mDef.cost * rDef.costMult + (deployable ? 3.0 : 0) + (extendable ? 1.0 : 0)) * (importFee ? 1.1 : 1.0);
    const totalCost = (singleDefCost + singleMountCost) * count;

    const singleTons = (mDef.tons * rDef.tonsMult) + (deployable ? 2.0 : 0) + (extendable ? 2.0 : 0);
    const totalTons = singleTons * count;

    const hardpointsReq = (mDef.hardpointReq || 0) * count;
    const firmpointsReq = (mDef.firmpointReq || 0) * count;
    const totalCP = (mDef.cp || 1) * count;

    return {
        isDefense: true,
        defenseKey: defenseKey,
        name: dDef.name,
        code: dDef.code,
        category: dDef.category,
        mountKey: mountKey,
        mountName: mDef.name,
        mountCode: mDef.code,
        stage: stageKey,
        rangeKey: rangeKey,
        rangeName: rDef.name,
        spaceRange: rDef.s,
        worldRange: rDef.r,
        tl: baseTL,
        count: count,
        deployable: deployable,
        extendable: extendable,
        importFee: importFee,
        mod: (mDef.mod || 0) + (sDef.mod || 0),
        tons: Math.round(totalTons * 100) / 100,
        cost: Math.round(totalCost * 1000) / 1000,
        hardpointReq: hardpointsReq,
        firmpointReq: firmpointsReq,
        cp: totalCP,
        comment: dDef.comment
    };
}

export function buildSensor(sensorKey, mountKey = 'Surf', stageKey = 'Standard', rangeKey = 'AR', count = 1, options = {}) {
    const sDef = ENUM_SENSORS2[sensorKey];
    if (!sDef) throw new Error(`Unknown sensor key: ${sensorKey}`);
    const mDef = ENUM_SENSOR_MOUNTS[mountKey] || ENUM_SENSOR_MOUNTS.Surf;
    const stgDef = ENUM_STAGE_EFFECTS[stageKey] || ENUM_STAGE_EFFECTS.Standard;
    const rDef = ENUM_SPACE_RANGES[rangeKey] || ENUM_SPACE_RANGES.AR;

    const baseTL = options.tl !== undefined ? options.tl : Math.max(0, sDef.baseTL + stgDef.tlMod + rDef.tlMod);
    const deployable = options.deployable === true;
    const extendable = options.extendable === true;
    const importFee = options.importFee === true;

    const singleSensorCost = sDef.baseCost * stgDef.costMult * (importFee ? 1.1 : 1.0);
    const singleMountCost = (mDef.cost * rDef.costMult + (deployable ? 3.0 : 0) + (extendable ? 1.0 : 0)) * (importFee ? 1.1 : 1.0);
    const totalCost = (singleSensorCost + singleMountCost) * count;

    const singleTons = (mDef.tons * rDef.tonsMult) + (deployable ? 2.0 : 0) + (extendable ? 2.0 : 0);
    const totalTons = singleTons * count;

    const hardpointsReq = (mDef.hardpointReq || 0) * count;
    const firmpointsReq = (mDef.firmpointReq || 0) * count;
    const totalCP = (mDef.cp || 1) * count;

    return {
        isSensor: true,
        sensorKey: sensorKey,
        name: sDef.name,
        code: sDef.code,
        category: sDef.category,
        mode: sDef.mode,
        mountKey: mountKey,
        mountName: mDef.name,
        mountCode: mDef.code,
        stage: stageKey,
        rangeKey: rangeKey,
        rangeName: rDef.name,
        spaceRange: rDef.s,
        worldRange: rDef.r,
        tl: baseTL,
        count: count,
        deployable: deployable,
        extendable: extendable,
        importFee: importFee,
        mod: (mDef.mod || 0) + (stgDef.mod || 0),
        tons: Math.round(totalTons * 100) / 100,
        cost: Math.round(totalCost * 1000) / 1000,
        hardpointReq: hardpointsReq,
        firmpointReq: firmpointsReq,
        cp: totalCP,
        comment: sDef.comment
    };
}

export const ENUM_CONSOLE_TYPES = {
    Cramped: { key: 'Cramped', name: 'Cramped Console', tons: 0.5, sq: 1, baseCost: 0.2, comment: 'Compact 0.5-ton operator station (1 square).' },
    Standard: { key: 'Standard', name: 'Standard Console', tons: 1.0, sq: 2, baseCost: 0.2, comment: 'Standard 1.0-ton ergonomic control station (2 squares).' },
    Roomy: { key: 'Roomy', name: 'Roomy Console', tons: 1.5, sq: 3, baseCost: 0.2, comment: 'Spacious 1.5-ton station with auxiliary monitors (3 squares).' },
    Spacious: { key: 'Spacious', name: 'Spacious / Master Console', tons: 2.0, sq: 4, baseCost: 0.5, comment: 'Executive 2.0-ton command console (4 squares).' },
    Workstation: { key: 'Workstation', name: 'Workstation', tons: 0.5, sq: 1, baseCost: 0.05, comment: 'Basic clerical / diagnostic information terminal (1 square).' },
    MedConsole: { key: 'MedConsole', name: 'Medical Console', tons: 0.5, sq: 1, baseCost: 0.5, comment: 'Dedicated surgical & patient monitoring console (1 square).' }
};

export const ENUM_CONSOLE_ROLES = {
    Bridge: { key: 'Bridge', name: 'Bridge Command', type: 'CC', skill: 'Leadership', defaultType: 'Standard', comment: 'Central ship operations and executive overview.' },
    Pilot: { key: 'Pilot', name: 'Pilot / Helm', type: 'CC', skill: 'Pilot', defaultType: 'Standard', comment: 'Maneuver and sublight flight controls with analog inputs.' },
    Astrogation: { key: 'Astrogation', name: 'Astrogation / Nav', type: 'CC', skill: 'Astrogation', defaultType: 'Standard', comment: 'Course plotting, jump calculation, and spatial positioning.' },
    Gunnery: { key: 'Gunnery', name: 'Fire Control / Gunnery', type: 'CC', skill: 'Gunner', defaultType: 'Standard', comment: 'Weapons coordination, targeting, and turret links.' },
    Sensors: { key: 'Sensors', name: 'Sensor Suite Operator', type: 'CC', skill: 'Sensors', defaultType: 'Standard', comment: 'Active/passive scanner analysis and EW suite management.' },
    Engineering: { key: 'Engineering', name: 'Engineering / Drives', type: 'CC', skill: 'Engineer', defaultType: 'Standard', comment: 'Power distribution, drive regulation, and fuel management.' },
    Comms: { key: 'Comms', name: 'Communications & Datalink', type: 'OC', skill: 'Comms', defaultType: 'Standard', comment: 'Subspace radio, transponder, and comms routing.' },
    DamageControl: { key: 'DamageControl', name: 'Damage Control', type: 'OC', skill: 'Mechanic', defaultType: 'Standard', comment: 'Hull integrity monitoring, fire suppression, and repairs.' },
    LifeSupport: { key: 'LifeSupport', name: 'Life Support / Environmental', type: 'OC', skill: 'Steward', defaultType: 'Standard', comment: 'Atmosphere scrubbing, temperature, and grav control.' },
    Cargo: { key: 'Cargo', name: 'Freight & Cargo Handling', type: 'OC', skill: 'Freight', defaultType: 'Standard', comment: 'Cargo lock operation, loading cranes, and mass balance.' },
    Security: { key: 'Security', name: 'Security & Internal Defense', type: 'OC', skill: 'Security', defaultType: 'Standard', comment: 'Bulkhead locking, internal sensors, and armory access.' },
    Medical: { key: 'Medical', name: 'Medical & Diagnostics', type: 'OC', skill: 'Medic', defaultType: 'MedConsole', comment: 'Patient diagnostics, trauma monitoring, and sickbay link.' },
    Workstation: { key: 'Workstation', name: 'General Workstation', type: 'W', skill: 'Education', defaultType: 'Workstation', comment: 'Clerical, academic, counseling, or general ship administration.' },
    General: { key: 'General', name: 'Multi-Purpose Console', type: 'CC', skill: 'Varies', defaultType: 'Standard', comment: 'Reconfigurable general purpose control station.' }
};

export const ENUM_COMPUTER_TABLE = {
    0: { model: 0, tons: 0.5, sq: 1, baseTL: 8, costStd: 0.1, cellsStd: 0, costBis: 0.5, cellsBis: 1 },
    1: { model: 1, tons: 1.0, sq: 2, baseTL: 9, costStd: 1.5, cellsStd: 1, costBis: 3.0, cellsBis: 2 },
    2: { model: 2, tons: 2.0, sq: 4, baseTL: 10, costStd: 5.0, cellsStd: 2, costBis: 7.5, cellsBis: 3 },
    3: { model: 3, tons: 3.0, sq: 6, baseTL: 11, costStd: 10.5, cellsStd: 3, costBis: 14.0, cellsBis: 4 },
    4: { model: 4, tons: 4.0, sq: 8, baseTL: 12, costStd: 18.0, cellsStd: 4, costBis: 22.0, cellsBis: 5 },
    5: { model: 5, tons: 5.0, sq: 10, baseTL: 13, costStd: 27.0, cellsStd: 5, costBis: 33.0, cellsBis: 6 },
    6: { model: 6, tons: 6.0, sq: 12, baseTL: 14, costStd: 39.0, cellsStd: 6, costBis: 45.0, cellsBis: 7 },
    7: { model: 7, tons: 7.0, sq: 14, baseTL: 15, costStd: 52.0, cellsStd: 7, costBis: 60.0, cellsBis: 8 },
    8: { model: 8, tons: 8.0, sq: 16, baseTL: 16, costStd: 68.0, cellsStd: 8, costBis: 76.0, cellsBis: 9 },
    9: { model: 9, tons: 9.0, sq: 18, baseTL: 17, costStd: 85.0, cellsStd: 9, costBis: 95.0, cellsBis: 10 }
};

export function getComputerSpecs(modelNumber, isBis = false) {
    const m = Math.max(0, Math.min(33, parseInt(modelNumber, 10) || 0));
    if (ENUM_COMPUTER_TABLE[m]) {
        const row = ENUM_COMPUTER_TABLE[m];
        return {
            model: m,
            isBis: isBis,
            tons: row.tons,
            sq: row.sq,
            baseTL: row.baseTL,
            cost: isBis ? row.costBis : row.costStd,
            cells: isBis ? row.cellsBis : row.cellsStd
        };
    }
    // Extended Models (10..33) calculated from T5 formulas
    const tons = m;
    const sq = m * 2;
    const baseTL = m + 8;
    const cells = isBis ? m + 1 : m;
    const costStd = Math.round(m * (m + 0.5) * 10) / 10;
    const costBis = Math.round((m + 0.5) * (m + 1.2) * 10) / 10;
    return {
        model: m,
        isBis: isBis,
        tons: tons,
        sq: sq,
        baseTL: baseTL,
        cost: isBis ? costBis : costStd,
        cells: cells
    };
}

export function buildConsole(roleKey, typeKey = 'Standard', count = 1, options = {}) {
    const rDef = ENUM_CONSOLE_ROLES[roleKey] || ENUM_CONSOLE_ROLES.General;
    const tDef = ENUM_CONSOLE_TYPES[typeKey] || ENUM_CONSOLE_TYPES.Standard;
    const cnt = Math.max(1, parseInt(count, 10) || 1);
    const holographic = options.holographic === true;
    const importFee = options.importFee === true;
    const tlVal = options.tl !== undefined ? options.tl : (holographic ? 15 : (options.shipBaseTL || 12));

    const singleTons = (tDef.tons * (holographic ? 0.5 : 1.0));
    const singleCost = (tDef.baseCost * (holographic ? 1.5 : 1.0)) * (importFee ? 1.1 : 1.0);
    const totalTons = singleTons * cnt;
    const totalCost = singleCost * cnt;
    const totalSq = (tDef.sq * (holographic ? 0.5 : 1.0)) * cnt;

    return {
        isConsole: true,
        roleKey: roleKey,
        roleName: rDef.name,
        roleType: rDef.type,
        typeKey: typeKey,
        typeName: tDef.name,
        name: `${rDef.name} Console`,
        count: cnt,
        tons: Math.round(totalTons * 100) / 100,
        cost: Math.round(totalCost * 1000) / 1000,
        sq: totalSq,
        tl: tlVal,
        holographic: holographic,
        importFee: importFee,
        skill: rDef.skill,
        comment: rDef.comment
    };
}

export function buildComputer(modelNumber, isBis = false, count = 1, options = {}) {
    const specs = getComputerSpecs(modelNumber, isBis);
    const cnt = Math.max(1, parseInt(count, 10) || 1);
    const fiberOptic = options.fiberOptic === true;
    const isBackup = options.isBackup === true;
    const isMaster = options.isMaster === true;
    const importFee = options.importFee === true;
    const tlVal = options.tl !== undefined ? options.tl : specs.baseTL;

    let singleCost = specs.cost * (fiberOptic ? 1.5 : 1.0) * (isBackup ? 0.5 : 1.0) * (importFee ? 1.1 : 1.0);
    const totalCost = singleCost * cnt;
    const totalTons = specs.tons * cnt;
    const totalCells = specs.cells * cnt;
    const totalSq = specs.sq * cnt;

    const bisText = isBis ? ' bis' : '';
    const fibText = fiberOptic ? '/fib' : '';
    const roleText = isBackup ? ' (Backup)' : (isMaster ? ' (Master)' : '');

    return {
        isComputer: true,
        model: specs.model,
        isBis: isBis,
        fiberOptic: fiberOptic,
        isBackup: isBackup,
        isMaster: isMaster,
        name: `Ship's Computer Model/${specs.model}${bisText}${fibText}${roleText}`,
        count: cnt,
        tons: Math.round(totalTons * 100) / 100,
        cost: Math.round(totalCost * 1000) / 1000,
        cells: totalCells,
        singleCells: specs.cells,
        sq: totalSq,
        baseTL: specs.baseTL,
        tl: tlVal,
        importFee: importFee,
        softwareCapacity: `C+S = ${tlVal}`,
        comment: `${specs.cells} Console-Equivalent Cells. Base TL ${specs.baseTL}. ${fiberOptic ? 'EMP/Radiation hardened (/fib). ' : ''}${isBackup ? 'Off-line Standby Backup. ' : ''}`
    };
}

export function getAvailableTechStages(tl, tech) {
    /**
     * @param {number} tl - Tech level
     * @param {string} tech - Technology type
     * @returns {Array<Object>} Available tech stages
     */
    var stages = [
        { desc: ENUM_DRIVE_STAGE.Ultimate.stage, mod: 4, eff: 1.3, fuel: 0.7, tons: 1 / 4, cost: 3 },
        { desc: ENUM_DRIVE_STAGE.Advanced.stage, mod: 3, eff: 1.2, fuel: 0.8, tons: 1 / 3, cost: 2 },
        { desc: ENUM_DRIVE_STAGE.Modified.stage, mod: 2, eff: 1.1, fuel: 0.9, tons: 1 / 2, cost: 1 },
        { desc: ENUM_DRIVE_STAGE.Generic.stage, mod: 1, eff: 0.9, fuel: 1.1, tons: 1, cost: 1 / 2 },
        { desc: ENUM_DRIVE_STAGE.Improved.stage, mod: 1, eff: 1.1, fuel: 0.9, tons: 1, cost: 1 },
        { desc: ENUM_DRIVE_STAGE.Standard.stage, mod: 0, eff: 1.0, fuel: 1.0, tons: 1, cost: 1 },
        { desc: ENUM_DRIVE_STAGE.Basic.stage, mod: 0, eff: 0.9, fuel: 1.1, tons: 1, cost: 1 / 2 },
        { desc: ENUM_DRIVE_STAGE.Early.stage, mod: -1, eff: 0.9, fuel: 1.1, tons: 1, cost: 2 },
        { desc: ENUM_DRIVE_STAGE.Prototype.stage, mod: -2, eff: 0.8, fuel: 1.2, tons: 2, cost: 5 },
        { desc: ENUM_DRIVE_STAGE.Experimental.stage, mod: -3, eff: 0.5, fuel: 2, tons: 3, cost: 10 },
    ];
    var evalFunction;
    switch (tech) {
        case ENUM_DRIVE_TYPE.Jump:
            evalFunction = tlJump; break;
        case ENUM_DRIVE_TYPE.MDrive:
            evalFunction = tlM; break;
        case ENUM_DRIVE_TYPE.GDrive:
            evalFunction = tlG; break;
        case ENUM_DRIVE_TYPE.PowerPlant:
            evalFunction = tlPower; break;
        case ENUM_DRIVE_TYPE.Fission:
            evalFunction = tlFission; break;
        case ENUM_DRIVE_TYPE.AntiMatter:
            evalFunction = tlAM; break;
        case ENUM_DRIVE_TYPE.Hop:
            evalFunction = tlHop; break;
        case ENUM_DRIVE_TYPE.Skip:
            evalFunction = tlSkip; break;
        case ENUM_DRIVE_TYPE.Rocket:
            evalFunction = tlRocket; break;
        case ENUM_DRIVE_TYPE.NAFAL:
            evalFunction = tlNAFAL; break;
        case ENUM_DRIVE_TYPE.HEPlaR:
            evalFunction = tlHep; break;
        case ENUM_DRIVE_TYPE.Collector:
            evalFunction = tlCol; break;
    }
    var availableComponents = [];
    var lp = 0;
    for (var i = 0, len = stages.length; i < len; i++) {
        var exclude = false;
        var stage = stages[i];
        var mod = stage.mod;
        var desc = stage.desc;
        var p = evalFunction(tl - mod);
        if (p != lp || mod >= 0) {
            lp = p;
            if (p > 0) {
                var effectivePotential = (stage.eff * p);
                // round effectivePotential to 2 decimal places
                effectivePotential = Math.round(effectivePotential * 100) / 100;
                var roundedDown = Math.floor(effectivePotential);
                //var text = desc + " " + tech + "-" + p + " (max " + effectivePotential + (effectivePotential !== roundedDown ? "=" + roundedDown : "") + ")";
                var text = desc + " (max " + effectivePotential + (effectivePotential !== roundedDown ? "=" + roundedDown : "") + ")";
                var component = {
                    name: text,
                    stage: stage.desc,
                    eff: stage.eff * p,
                    fuel: stage.fuel,
                    tons: stage.tons,
                    cost: stage.cost
                }

                if (!exclude) {
                    availableComponents.push(component);
                }
            }
        }
    }
    return availableComponents;

    function tlPower(tl) {
        var max = 0;
        if (tl >= 8 && tl < 16) {
            max = tl - 7;
        } else if (tl >= 16) {
            max = 9;
        }
        return max;
    }
    function tlAM(tl) {
        var max = 0;
        if (tl >= 19 && tl < 27) {
            max = tl - 18;
        } else if (tl >= 27) {
            max = 9;
        }
        return max;
    }
    function tlCol(tl) {
        var max = 0;
        if (tl >= 14 && tl < 22) {
            max = tl - 13;
        } else if (tl >= 22) {
            max = 9;
        }
        return max;
    }
    function tlFission(tl) {
        var max = 0;
        if (tl >= 7 && tl < 15) {
            max = tl - 6;
        } else if (tl >= 15) {
            max = 9;
        }
        return max;
    }
    function tlM(tl) {
        var max = 0;
        if (tl === 9) { max = 1; }
        else if (tl === 10) { max = 3; }
        else if (tl === 11) { max = 5; }
        else if (tl === 12) { max = 7; }
        else if (tl >= 13) { max = 9; }
        return max;
    }
    function tlHep(tl) {
        var max = 0;
        if (tl === 8) { max = 1; }
        else if (tl === 9) { max = 3; }
        else if (tl === 10) { max = 5; }
        else if (tl === 11) { max = 7; }
        else if (tl >= 12) { max = 9; }
        return max;
    }
    function tlG(tl) {
        var max = 0;
        if (tl === 8) { max = 1; }
        else if (tl === 9) { max = 4; }
        else if (tl === 10) { max = 7; }
        else if (tl >= 11) { max = 9; }
        return max;
    }
    function tlNAFAL(tl) {
        var max = 0;
        if (tl === 9) { max = 1; }
        else if (tl === 10) { max = 4; }
        else if (tl === 11) { max = 7; }
        else if (tl >= 12) { max = 9; }
        return max;
    }
    function tlRocket(tl) {
        var max = 0;
        if (tl === 7) { max = 1; }
        else if (tl === 8) { max = 4; }
        else if (tl === 9) { max = 7; }
        else if (tl >= 10) { max = 9; }
        return max;
    }
    function tlJump(tl) {
        var max = 0;
        if (tl >= 9 && tl <= 10) { max = 1; }
        else { max = Math.max(0, Math.min(9, tl - 9)); }
        return max;
    }
    function tlHop(tl) {
        var max = 0;
        if (tl >= 17 && tl <= 18) { max = 1; }
        else { max = Math.max(0, Math.min(9, tl - 17)); }
        return max;
    }
    function tlSkip(tl) {
        var max = 0;
        if (tl >= 20 && tl <= 21) { max = 1; }
        else { max = Math.max(0, Math.min(9, tl - 20)); }
        return max;
    }

}

export function getBaseDriveIntroTL(driveType, potential = 1) {
    const p = Math.max(1, Math.min(9, Math.round(potential) || 1));
    switch (driveType) {
        case ENUM_DRIVE_TYPE.Jump:
            return p === 1 ? 9 : (p === 2 ? 11 : p + 9);
        case ENUM_DRIVE_TYPE.MDrive:
            if (p === 1) return 9;
            if (p <= 3) return 10;
            if (p <= 5) return 11;
            if (p <= 7) return 12;
            return 13;
        case ENUM_DRIVE_TYPE.GDrive:
            if (p === 1) return 8;
            if (p <= 4) return 9;
            if (p <= 7) return 10;
            return 11;
        case ENUM_DRIVE_TYPE.PowerPlant:
            return p + 7;
        case ENUM_DRIVE_TYPE.Fission:
            return p + 6;
        case ENUM_DRIVE_TYPE.AntiMatter:
            return p + 18;
        case ENUM_DRIVE_TYPE.Collector:
            return p + 13;
        case ENUM_DRIVE_TYPE.Hop:
            return p === 1 ? 17 : p + 17;
        case ENUM_DRIVE_TYPE.Skip:
            return p === 1 ? 20 : p + 20;
        case ENUM_DRIVE_TYPE.Rocket:
            if (p === 1) return 7;
            if (p <= 4) return 8;
            if (p <= 7) return 9;
            return 10;
        case ENUM_DRIVE_TYPE.NAFAL:
            if (p === 1) return 9;
            if (p <= 4) return 10;
            if (p <= 7) return 11;
            return 12;
        case ENUM_DRIVE_TYPE.HEPlaR:
            if (p === 1) return 8;
            if (p <= 3) return 9;
            if (p <= 5) return 10;
            if (p <= 7) return 11;
            return 12;
        default:
            return 9;
    }
}
export function buildDrive(stage, nexus = 1, driveClass, driveType, tl, importFee = false) {
    /**
     * @param {string} stage - Tech stage
     * @param {number} nexus - Nexus multiplier
     * @param {string} driveClass - Drive class (A, B, C, etc.)
     * @param {string} driveType - Drive type (Jump, M-Drive, etc.)
     * @param {number} tl - Tech level
     * @param {boolean} [importFee=false] - Apply 10% import markup if true
     * @returns {Object} Drive object
     */
    var availableStages = getAvailableTechStages(tl, driveType);
    var maxDrivePotential = 0;
    if (!availableStages.some(s => s.stage === stage)) {
        throw new Error(`${stage} is not a valid stage for ${driveType} drives at TL-${tl}`);
    } else {
        // Get max drive potential from "eff" value of available tech stage
        maxDrivePotential = Math.floor(availableStages.find(s => s.stage === stage).eff);

        var ep = ENUM_DRIVE_CLASS[driveClass].ep * ENUM_DRIVE_STAGE[stage].eff * nexus;
        // round ep to 0 decimal places
        ep = Math.round(ep);
        var tons = 0, cost = 0;
        var minTonnage = 0, baseTonnage = 0, baseCost = 0;
        switch (driveType) {
            case ENUM_DRIVE_TYPE.Jump:
                minTonnage = 10;
                baseTonnage = (ENUM_DRIVE_CLASS[driveClass].ep / 100 * 5) + 5;
                baseCost = 1 * baseTonnage;
                break;
            case ENUM_DRIVE_TYPE.GDrive:
                minTonnage = 9;
                baseTonnage = ENUM_DRIVE_CLASS[driveClass].ep == 100 ? 9 : (ENUM_DRIVE_CLASS[driveClass].ep / 100 * 9);
                baseCost = 0.5 * baseTonnage;
                break;
            case ENUM_DRIVE_TYPE.NAFAL:
                minTonnage = 2;
                baseTonnage = (ENUM_DRIVE_CLASS[driveClass].ep / 100 * 2);
                baseCost = 2 * baseTonnage;
                break;
            case ENUM_DRIVE_TYPE.Rocket:
                minTonnage = 2;
                baseTonnage = (ENUM_DRIVE_CLASS[driveClass].ep / 100 * 2);
                baseCost = 0.5 * baseTonnage;
                break;
            case ENUM_DRIVE_TYPE.HEPlaR:
                minTonnage = 1;
                baseTonnage = (ENUM_DRIVE_CLASS[driveClass].ep / 100);
                baseCost = 1 * baseTonnage;
                break;
            case ENUM_DRIVE_TYPE.MDrive:
                minTonnage = 2;
                baseTonnage = ENUM_DRIVE_CLASS[driveClass].ep == 100 ? 2 : (ENUM_DRIVE_CLASS[driveClass].ep / 100 * 2) - 1;
                baseCost = 2 * baseTonnage;
                break;
            case ENUM_DRIVE_TYPE.PowerPlant:
                minTonnage = 4;
                baseTonnage = ((ENUM_DRIVE_CLASS[driveClass].ep / 100) * 3) + 1;
                baseCost = 1 * baseTonnage;
                break;
            case ENUM_DRIVE_TYPE.Fission:
                minTonnage = 15;
                baseTonnage = ((ENUM_DRIVE_CLASS[driveClass].ep / 100) * 5) + 10;
                baseCost = 1.5 * baseTonnage;
                break;
            case ENUM_DRIVE_TYPE.Hop:
                minTonnage = 15;
                baseTonnage = ((ENUM_DRIVE_CLASS[driveClass].ep / 100) * 5) + 10;
                baseCost = 2 * baseTonnage;
                break;
            case ENUM_DRIVE_TYPE.Skip:
                minTonnage = 20;
                baseTonnage = ((ENUM_DRIVE_CLASS[driveClass].ep / 100) * 5) + 15;
                baseCost = 3 * baseTonnage;
                break;
            case ENUM_DRIVE_TYPE.Collector:
                minTonnage = 20;
                baseTonnage = ((ENUM_DRIVE_CLASS[driveClass].ep / 100) * 10) + 10;
                baseCost = 0.5 * baseTonnage;
                break;
            case ENUM_DRIVE_TYPE.AntiMatter:
                minTonnage = 31;
                baseTonnage = (ENUM_DRIVE_CLASS[driveClass].ep / 100) + 30;
                baseCost = 2 * baseTonnage;
                break;
        }
        tons = Math.max(minTonnage, ENUM_DRIVE_STAGE[stage].tons * baseTonnage) * nexus;
        cost = baseCost * nexus * ENUM_DRIVE_STAGE[stage].cost;
        if (importFee) {
            cost *= 1.1;
        }

    }
    var drive = {
        ep: ep,
        tons: tons,
        cost: cost,
        stage: stage,
        driveClass: (nexus > 1 ? `${driveClass}${nexus}` : driveClass),
        driveType: driveType,
        tl: tl,
        importFee: importFee,
        maxDrivePotential: maxDrivePotential
    };
    return drive;
}
export function getDrivePerformance(drive, shipTonnage) {
    /**
     * @param {Object} drive - Drive object
     * @param {number} shipTonnage - Ship tonnage
     * @returns {Object} Performance object with properties for Potential and fuel consumption
     */
    var potential = 0, fuelConsumption = 0, note = '', minConsumption = 0, minNote = '';
    potential = Math.floor(Math.min(potential = drive.ep / shipTonnage * 2, drive.maxDrivePotential));

    if (drive.performanceLimit !== undefined) {
        potential = Math.min(potential, drive.performanceLimit);
    }
    switch (drive.driveType) {
        case ENUM_DRIVE_TYPE.Jump:
            fuelConsumption = potential * shipTonnage / 10 * ENUM_DRIVE_STAGE[drive.stage].fuel;
            if (potential > 1) {
                minConsumption = shipTonnage / 10 * ENUM_DRIVE_STAGE[drive.stage].fuel;
                minNote = minConsumption.toString() + " tons per Jump-1";
            }
            note = fuelConsumption.toString() + " tons per Jump-" + potential.toString();
            break;
        case ENUM_DRIVE_TYPE.Hop:
            fuelConsumption = potential * shipTonnage / 10 * ENUM_DRIVE_STAGE[drive.stage].fuel;
            note = fuelConsumption.toString() + " tons per Hop-" + potential.toString();
            if (potential > 1) {
                minConsumption = shipTonnage / 10 * ENUM_DRIVE_STAGE[drive.stage].fuel;
                minNote = minConsumption.toString() + " tons per Hop-1";
            }
            break;
        case ENUM_DRIVE_TYPE.Skip:
            fuelConsumption = potential * shipTonnage / 10 * ENUM_DRIVE_STAGE[drive.stage].fuel;
            note = fuelConsumption.toString() + " tons per Skip-" + potential.toString();
            if (potential > 1) {
                minConsumption = shipTonnage / 10 * ENUM_DRIVE_STAGE[drive.stage].fuel;
                minNote = minConsumption.toString() + " tons per Skip-1";
            }
            break;
        case ENUM_DRIVE_TYPE.NAFAL:
        case ENUM_DRIVE_TYPE.MDrive:
        case ENUM_DRIVE_TYPE.GDrive:
            fuelConsumption = 0;
            note = "Included in Power Plant consumption";
            minConsumption = fuelConsumption;
            minNote = note;
            break;
        case ENUM_DRIVE_TYPE.PowerPlant:
            fuelConsumption = potential * shipTonnage / 100 * ENUM_DRIVE_STAGE[drive.stage].fuel;
            note = fuelConsumption.toString() + " tons per month for P=" + potential.toString();
            if (potential > 1) {
                minConsumption = shipTonnage / 100 * ENUM_DRIVE_STAGE[drive.stage].fuel;
                minNote = minConsumption.toString() + " tons per Power Output Level";
            }
            break;
        case ENUM_DRIVE_TYPE.Fission:
            fuelConsumption = potential * shipTonnage / 100 * ENUM_DRIVE_STAGE[drive.stage].fuel;
            note = fuelConsumption.toString() + " rods per 10 years";
            if (potential > 1) {
                minConsumption = shipTonnage / 100 * ENUM_DRIVE_STAGE[drive.stage].fuel;
                minNote = minConsumption.toString() + " rods per 10 years per Power Output Level";
            }
            break;
        case ENUM_DRIVE_TYPE.AntiMatter:
            fuelConsumption = potential * shipTonnage / 100 * ENUM_DRIVE_STAGE[drive.stage].fuel;
            note = fuelConsumption.toString() + " slugs per year";
            if (potential > 1) {
                minConsumption = shipTonnage / 100 * ENUM_DRIVE_STAGE[drive.stage].fuel;
                minNote = minConsumption.toString() + " slugs per year per Power Output Level";
            }
            break;
        case ENUM_DRIVE_TYPE.Rocket:
            fuelConsumption = 0;
            note = "Uses Rocket Fuel";
            minConsumption = fuelConsumption;
            minNote = note;
            break;
        case ENUM_DRIVE_TYPE.HEPlaR:
            fuelConsumption = potential * shipTonnage / 100 * ENUM_DRIVE_STAGE[drive.stage].fuel;
            note = fuelConsumption.toString() + " tons per burn in addition to Rocket Fuel";
            minConsumption = fuelConsumption;
            minNote = note;
            break;
        case ENUM_DRIVE_TYPE.Collector:
            fuelConsumption = 0;
            note = "Collects charges from exotic particles";
            minConsumption = fuelConsumption;
            minNote = note;
            break;
    }
    if (potential <= 1) {
        minConsumption = fuelConsumption;
        minNote = note;
    }
    return {
        potential: potential,
        fuelConsumption: fuelConsumption,
        note: note,
        minConsumption: minConsumption,
        minNote: minNote
    };
}
export class Hull {
    constructor(baseTL = 12) {
        this.baseTL = baseTL;
        this.subhulls = []; // Array of hull objects: { name, tons, tl, config, components: [] }
        this.selectedSubhullIndex = -1;
    }

    setBaseTL(tl) {
        this.baseTL = tl;
    }

    get tonnage() {
        if (this.subhulls.length === 0) return 0;
        return this.subhulls.reduce((sum, h) => sum + h.tons, 0);
    }

    // Determine the least favorable configuration
    get configurationType() {
        if (this.subhulls.length === 0) return "Unstreamlined";
        let chosenName = "Streamlined";

        const configRanks = [
            "Lifting Body",
            "Airframe",
            "Streamlined",
            "Unstreamlined",
            "Planetoid",
            "Braced",
            "Cluster"
        ]; // Ordered from best (0) to worst (6)

        let worstRank = -1;
        let hasAirframeSubhull = this.subhulls.some(h => !h.isPod && h.config === "Airframe");

        for (const h of this.subhulls) {
            let rank = configRanks.indexOf(h.config);

            // Exception: Streamlined Pods do not reduce an Airframe hull to Streamlined
            if (h.isPod && h.config === "Streamlined" && hasAirframeSubhull) {
                rank = configRanks.indexOf("Airframe");
            }

            if (rank > worstRank) {
                worstRank = rank;
                chosenName = configRanks[worstRank];
            }
        }
        return chosenName;
    }

    get configuration() {
        return ENUM_HULL_CONFIG[this.configurationType] || ENUM_HULL_CONFIG["Unstreamlined"];
    }

    getSubhullArmorTons(h) {
        if (!h.armorType || h.armorLayers <= 1) return 0;
        const armorDef = ENUM_HULL_ARMOR[h.armorType];
        if (!armorDef) return 0;
        return (h.armorLayers - 1) * 0.04 * h.tons * armorDef.ton_Mult;
    }

    getSubhullAV(h) {
        if (!h.armorType) return 0;
        const armorDef = ENUM_HULL_ARMOR[h.armorType];
        if (!armorDef) return 0;
        return (h.tl * armorDef.AV_Mult) + armorDef.AV_FlatBonus;
    }

    get baseCost() {
        return this.subhulls.reduce((sum, h) => {
            const conf = ENUM_HULL_CONFIG[h.config];
            const base = (h.tons * conf.cost + (h.isPod ? conf.podflatcost : conf.flatcost));
            return sum + (h.importFee ? base * 1.1 : base);
        }, 0);
    }

    get drives() {
        return this.subhulls.flatMap(h => h.drives || []);
    }

    get components() {
        return this.subhulls.flatMap(h => h.components || []);
    }

    get weapons() {
        return this.components.filter(c => c.isWeapon);
    }

    get defenses() {
        return this.components.filter(c => c.isDefense);
    }

    get sensors() {
        return this.components.filter(c => c.isSensor);
    }

    get consoles() {
        return this.components.filter(c => c.isConsole);
    }

    get computers() {
        return this.components.filter(c => c.isComputer);
    }

    get totalConsoleCount() {
        return this.consoles.reduce((sum, c) => sum + (c.count || 1), 0);
    }

    get totalConsoleTons() {
        return this.consoles.reduce((sum, c) => sum + (c.tons || 0), 0);
    }

    get totalComputerCells() {
        return this.computers.filter(c => !c.isBackup).reduce((sum, c) => sum + (c.cells || 0), 0);
    }

    get controlErgonomics() {
        const cp = this.totalControlPanels;
        if (cp <= 0) return 1;
        return Math.ceil(this.totalConsoleTons / cp);
    }

    get controlErgonomicsRatio() {
        const cp = this.totalControlPanels;
        if (cp <= 0) return 1;
        return Math.round((this.totalConsoleTons / cp) * 100) / 100;
    }

    get maxHardpoints() {
        return Math.floor(this.tonnage / 100);
    }

    get maxFirmpoints() {
        return Math.floor(this.tonnage / 35);
    }

    get hardpointsUsed() {
        return this.components.reduce((sum, c) => sum + (c.hardpointReq || 0), 0);
    }

    get firmpointsUsed() {
        return this.components.reduce((sum, c) => sum + (c.firmpointReq || 0), 0);
    }

    get totalControlPanels() {
        let cp = this.subhulls.length;
        this.drives.forEach(d => {
            cp += Math.ceil(d.tons / 35);
        });
        this.components.forEach(c => {
            if (c.cp !== undefined) cp += c.cp;
            else if (c.isHullFitting) cp += Math.max(0, (c.mechanisms ?? 1));
            else if (c.name === 'Grapple') cp += 1;
        });
        return cp;
    }

    _syncAutoFittings(hull) {
        const config = hull.config;
        const tons = hull.tons;
        const shouldBeAuto = new Set(
            ENUM_HULL_FITTINGS.keys.filter(k => ENUM_HULL_FITTINGS[k].automatic.includes(config))
        );
        const currentAutoKeys = new Set(
            hull.components.filter(c => c.isHullFitting && c.isAutoInstalled).map(c => c.fittingKey)
        );
        // Update or remove existing auto-fittings
        hull.components = hull.components.filter(c => {
            if (c.isHullFitting && c.isAutoInstalled) {
                if (shouldBeAuto.has(c.fittingKey)) {
                    const fDef = ENUM_HULL_FITTINGS[c.fittingKey];
                    c.tons = 0;
                    c.cost = 0;
                    if (fDef.deployedTons !== undefined) c.deployedTons = fDef.deployedTons * tons / 100;
                    else delete c.deployedTons;
                    return true;
                }
                return false; // no longer auto for this config
            }
            return true;
        });
        // Add newly required auto-fittings
        for (const key of ENUM_HULL_FITTINGS.keys) {
            if (shouldBeAuto.has(key) && !currentAutoKeys.has(key)) {
                const fDef = ENUM_HULL_FITTINGS[key];
                const comp = {
                    isHullFitting: true,
                    isAutoInstalled: true,
                    removableFromAutoInstall: fDef.removableFromAutoInstall,
                    fittingKey: key,
                    name: fDef.name,
                    mechanisms: fDef.mechanisms ?? 1,
                    tons: 0,
                    cost: 0,
                    comment: fDef.comment
                };
                if (fDef.deployedTons !== undefined) comp.deployedTons = fDef.deployedTons * tons / 100;
                // Insert before the first non-fitting component so fittings appear first
                const firstNonFitting = hull.components.findIndex(c => !c.isHullFitting);
                if (firstNonFitting === -1) hull.components.push(comp);
                else hull.components.splice(firstNonFitting, 0, comp);
            }
        }
    }

    _removeIncompatibleFittings(hull) {
        const config = hull.config;
        const tons = hull.tons;
        const removed = [];
        hull.components = hull.components.filter(c => {
            if (c.isHullFitting && !c.isAutoInstalled) {
                const fDef = ENUM_HULL_FITTINGS[c.fittingKey];
                if (fDef && !fDef.installable.includes(config) && !fDef.automatic.includes(config)) {
                    removed.push(c.name);
                    return false;
                }
                // Recalculate cost/tons for new tonnage
                if (fDef) {
                    c.tons = fDef.tons * tons / 100;
                    c.cost = fDef.cost * tons / 100;
                    if (fDef.deployedTons !== undefined) c.deployedTons = fDef.deployedTons * tons / 100;
                    else delete c.deployedTons;
                }
            }
            return true;
        });
        return removed;
    }

    addSubhull(name, tons, tl, config, isPod = false, armorType = null, armorLayers = 1, importFee = false) {
        if (!armorType) {
            // Find a valid default armor for this configuration
            for (const key of Object.keys(ENUM_HULL_ARMOR)) {
                if (ENUM_HULL_ARMOR[key].configurations.includes(config)) {
                    armorType = ENUM_HULL_ARMOR[key].type;
                    break;
                }
            }
        }

        const newHull = {
            isHull: true,
            isPod: isPod,
            name: name,
            tons: Math.max(isPod ? 10 : 100, Math.min(tons, isPod ? 90 : Infinity)),
            tl: tl,
            config: config,
            armorType: armorType,
            armorLayers: Math.max(1, armorLayers),
            importFee: importFee,
            drives: [],
            components: []
        };

        // Auto-install hull fittings for this configuration
        this._syncAutoFittings(newHull);

        this.subhulls.push(newHull);
        const newHullIndex = this.subhulls.length - 1;

        // Auto-link Grapples if connecting to an existing ship
        if (this.subhulls.length > 1 && this.selectedSubhullIndex >= 0) {
            const oldHull = this.subhulls[this.selectedSubhullIndex];
            const smallerTons = Math.min(newHull.tons, oldHull.tons);
            const numGrapples = Math.ceil(smallerTons / 35);

            const grappleCompNew = { isGeneric: true, name: 'Grapple', tons: numGrapples, cost: 0, label: `To Hull ${this.selectedSubhullIndex + 1}` };
            const grappleCompOld = { isGeneric: true, name: 'Grapple', tons: numGrapples, cost: 0, label: `To Hull ${newHullIndex + 1}` };

            newHull.components.push(grappleCompNew);
            oldHull.components.push(grappleCompOld);
        }

        this.selectedSubhullIndex = newHullIndex;
    }

    updateSubhull(index, name, tons, tl, config, armorType, armorLayers, importFee = false) {
        if (index >= 0 && index < this.subhulls.length) {
            const h = this.subhulls[index];
            h.name = name;
            h.tons = Math.max(h.isPod ? 10 : 100, Math.min(tons, h.isPod ? 90 : Infinity));
            h.tl = tl;
            h.config = config;
            h.importFee = importFee;
            if (armorType) h.armorType = armorType;
            if (armorLayers !== undefined) h.armorLayers = Math.max(1, armorLayers);

            // Validate that current armor is still compatible with new config
            const armorDef = ENUM_HULL_ARMOR[h.armorType];
            if (!armorDef || !armorDef.configurations.includes(h.config)) {
                for (const key of Object.keys(ENUM_HULL_ARMOR)) {
                    if (ENUM_HULL_ARMOR[key].configurations.includes(h.config)) {
                        h.armorType = ENUM_HULL_ARMOR[key].type;
                        break;
                    }
                }
            }

            // Sync auto-fittings for new config/tonnage, then remove incompatible manual fittings
            this._syncAutoFittings(h);
            const removedManualFittingNames = this._removeIncompatibleFittings(h);
            return { removedManualFittingNames };
        }
        return { removedManualFittingNames: [] };
    }

    removeSubhull(index) {
        if (index >= 0 && index < this.subhulls.length) {
            this.subhulls.splice(index, 1);
            if (this.selectedSubhullIndex >= this.subhulls.length) {
                this.selectedSubhullIndex = this.subhulls.length - 1;
            }
        }
    }

    selectSubhull(index) {
        if (index >= 0 && index < this.subhulls.length) {
            this.selectedSubhullIndex = index;
        }
    }

    // Proxy methods — drives go to drives[], all other components go to components[]
    addDrive(drive) {
        if (this.selectedSubhullIndex >= 0 && this.selectedSubhullIndex < this.subhulls.length) {
            this.subhulls[this.selectedSubhullIndex].drives.push(drive);
        } else {
            throw new Error("No Subhull or Pod selected to attach component.");
        }
    }

    addComponent(component) {
        if (this.selectedSubhullIndex >= 0 && this.selectedSubhullIndex < this.subhulls.length) {
            this.subhulls[this.selectedSubhullIndex].components.push(component);
        } else {
            throw new Error("No Subhull or Pod selected to attach component.");
        }
    }

    // Search non-drive components (hull fittings, fuel, grapples, cargo)
    getComponentByIdx(globalIndex) {
        let count = 0;
        for (let h = 0; h < this.subhulls.length; h++) {
            const comps = this.subhulls[h].components || [];
            for (let c = 0; c < comps.length; c++) {
                if (count === globalIndex) {
                    return { hullIndex: h, compIndex: c, component: comps[c] };
                }
                count++;
            }
        }
        return null;
    }

    // Search actual drives
    getDriveByIdx(globalIndex) {
        let count = 0;
        for (let h = 0; h < this.subhulls.length; h++) {
            const drives = this.subhulls[h].drives || [];
            for (let d = 0; d < drives.length; d++) {
                if (count === globalIndex) {
                    return { hullIndex: h, driveIndex: d, component: drives[d] };
                }
                count++;
            }
        }
        return null;
    }

    updateComponent(globalIndex, newComp) {
        const target = this.getComponentByIdx(globalIndex);
        if (target) {
            this.subhulls[target.hullIndex].components[target.compIndex] = newComp;
        }
    }

    updateDrive(globalIndex, newDrive) {
        const target = this.getDriveByIdx(globalIndex);
        if (target) {
            this.subhulls[target.hullIndex].drives[target.driveIndex] = newDrive;
        }
    }

    removeDriveAtIndex(globalIndex) {
        const target = this.getDriveByIdx(globalIndex);
        if (!target) return;

        // Remove the drive
        this.subhulls[target.hullIndex].drives.splice(target.driveIndex, 1);

        // Remove any non-drive components linked to this drive, and decrement
        // linkedDriveIndex in remaining components throughout all hulls
        this.subhulls.forEach(h => {
            h.components = (h.components || []).filter(c => c.linkedDriveIndex !== globalIndex);
            h.components.forEach(c => {
                if (c.linkedDriveIndex !== undefined && c.linkedDriveIndex > globalIndex) {
                    c.linkedDriveIndex--;
                }
            });
        });
    }

    removeComponentAtIndex(globalIndex) {
        const target = this.getComponentByIdx(globalIndex);
        if (!target) return;
        this.subhulls[target.hullIndex].components.splice(target.compIndex, 1);
    }
}
export class Ship {
    constructor() {
        this.drives = [];
        this.baseTL = 0; // Base Tech Level
        this.tonnage = 0; // Total tonnage of the ship
    }
    setBaseTL(tl) {
        this.baseTL = tl;
    }
    setTonnage(tonnage) {
        this.tonnage = tonnage;
    }
    addDrive(drive) {
        this.drives.push(drive);
    }
    removeDriveAtIndex(index) {
        if (index >= 0 && index < this.drives.length) {
            this.drives.splice(index, 1);
        }
    }

}