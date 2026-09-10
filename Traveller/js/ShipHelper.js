import { loadStarshipDrives, loadStarshipHulls } from "./DataLoader.js";

const _drivesData = await loadStarshipDrives();
const _hullsData = await loadStarshipHulls();

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

export class ENUM_DRIVE_CLASS {}
for (const [key, val] of Object.entries(_drivesData.driveClasses)) {
    Object.defineProperty(ENUM_DRIVE_CLASS, key, { get: () => val, enumerable: true });
}

export class ENUM_DRIVE_TYPE {}
if (_drivesData.driveTypeMap) {
    for (const [key, val] of Object.entries(_drivesData.driveTypeMap)) {
        Object.defineProperty(ENUM_DRIVE_TYPE, key, { get: () => val, enumerable: true });
    }
} else {
    for (const type of _drivesData.driveTypes) {
        const key = type.replace(/[^a-zA-Z0-9]/g, "");
        Object.defineProperty(ENUM_DRIVE_TYPE, key, { get: () => type, enumerable: true });
    }
}

export class ENUM_DRIVE_STAGE {}
for (const [key, val] of Object.entries(_drivesData.driveStages)) {
    Object.defineProperty(ENUM_DRIVE_STAGE, key, { get: () => val, enumerable: true });
}

export class ENUM_HULL_TYPE {}
if (_hullsData.hullTypeMap) {
    for (const [key, val] of Object.entries(_hullsData.hullTypeMap)) {
        Object.defineProperty(ENUM_HULL_TYPE, key, { get: () => val, enumerable: true });
    }
} else {
    for (const type of _hullsData.hullTypes) {
        const key = type.replace(/[^a-zA-Z0-9]/g, "");
        Object.defineProperty(ENUM_HULL_TYPE, key, { get: () => type, enumerable: true });
    }
}

export class ENUM_HULL_CONFIG {}
for (const [key, val] of Object.entries(_hullsData.hullConfigs)) {
    Object.defineProperty(ENUM_HULL_CONFIG, key, { get: () => val, enumerable: true });
}
if (_hullsData.hullConfigs["Lifting Body"]) {
    Object.defineProperty(ENUM_HULL_CONFIG, "Lifting Body", { get: () => _hullsData.hullConfigs["Lifting Body"], enumerable: true });
} else if (_hullsData.hullConfigs.LiftingBody) {
    Object.defineProperty(ENUM_HULL_CONFIG, "Lifting Body", { get: () => _hullsData.hullConfigs.LiftingBody, enumerable: true });
}

export class ENUM_HULL_FITTINGS {
    static get keys() { return Object.keys(_hullsData.hullFittings); }
}
for (const [key, val] of Object.entries(_hullsData.hullFittings)) {
    Object.defineProperty(ENUM_HULL_FITTINGS, key, { get: () => val, enumerable: true });
}

export const ENUM_HULL_ARMOR = _hullsData.hullArmor;
export const ENUM_STAGE_EFFECTS = _hullsData.stageEffects;
export const ENUM_SPACE_RANGES = _hullsData.spaceRanges;

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

export const ENUM_ACCOMMODATION_TYPES = {
    PassengerCommons: { key: 'PassengerCommons', name: 'Passenger Commons', tons: 1.0, cost: 0.0, occupants: 0, defaultRole: 'Commons', isCommons: true, fresher: 'N/A', comfort: 1.0, comment: 'Recreation, dining, lounges, and passenger circulation space (1 ton per passenger recommended).' },
    StandardStateroom: { key: 'StandardStateroom', name: 'Standard Stateroom', tons: 2.0, cost: 0.1, occupants: 1, defaultRole: 'Crew', isCommons: false, fresher: 'Shared/Integrated', comfort: 1.0, comment: 'Standard 2.0-ton stateroom with life support for 1 crew member or middle/high passenger.' },
    StandardSuite: { key: 'StandardSuite', name: 'Standard Suite', tons: 4.0, cost: 0.2, occupants: 2, defaultRole: 'Passenger', isCommons: false, fresher: 'Dedicated Private', comfort: 2.0, comment: 'Spacious 4.0-ton double-room suite with private sitting area and fresher for 2 occupants.' },
    DoubleStateroom: { key: 'DoubleStateroom', name: 'Double Stateroom', tons: 2.0, cost: 0.1, occupants: 2, defaultRole: 'Passenger', isCommons: false, fresher: 'Shared', comfort: 0.5, comment: 'Standard 2.0-ton stateroom fitted with bunk beds accommodating 2 occupants.' },
    TripleStateroom: { key: 'TripleStateroom', name: 'Triple Stateroom', tons: 2.0, cost: 0.1, occupants: 3, defaultRole: 'Passenger', isCommons: false, fresher: 'Shared', comfort: 0.33, comment: 'High-density stateroom with three tier bunks accommodating 3 occupants.' },
    CrampedStateroom: { key: 'CrampedStateroom', name: 'Cramped Stateroom', tons: 2.0, cost: 0.1, occupants: 4, defaultRole: 'Passenger', isCommons: false, fresher: 'Shared', comfort: 0.25, comment: 'Cramped quad-bunk quarters for steerage passengers or work crews (4 occupants).' },
    LuxuryStateroom: { key: 'LuxuryStateroom', name: 'Luxury Stateroom', tons: 6.0, cost: 0.4, occupants: 1, defaultRole: 'HighPax', isCommons: false, fresher: 'Dedicated Luxury', comfort: 3.0, comment: '6.0-ton luxury suite with private fresher, salon, and entertainment suite for high nobility or VIPs.' },
    Steerage: { key: 'Steerage', name: 'Steerage / Space Bunks', tons: 0.5, cost: 0.05, occupants: 2, defaultRole: 'Passenger', isCommons: false, fresher: 'Communal', comfort: 0.25, comment: '0.5-ton minimal curtained bunk unit for budget space travel (2 occupants).' },
    LowBerth: { key: 'LowBerth', name: 'Low Berth (Cryogenic)', tons: 0.5, cost: 0.1, occupants: 1, defaultRole: 'Cryo', isCommons: false, isCryo: true, fresher: 'None', comfort: 0.0, comment: 'Cryogenic suspended animation capsule for frozen passengers or medical preservation.' },
    SpacerNiche: { key: 'SpacerNiche', name: 'Spacer Niche', tons: 1.0, cost: 0.05, occupants: 1, defaultRole: 'Crew', isCommons: false, fresher: 'Communal', comfort: 0.5, comment: '1.0-ton semi-private crew sleeping pod or coffin-berth.' }
};

export const ENUM_FACILITY_TYPES = {
    StandardCargo: { key: 'StandardCargo', name: 'Standard Cargo Hold', unitTons: 1.0, unitCost: 0.0, category: 'Cargo', isCargo: true, comment: 'General pressurized and gravity-stabilized freight storage.' },
    ColdStorage: { key: 'ColdStorage', name: 'Refrigerated / Cold Storage', unitTons: 1.0, unitCost: 0.05, category: 'Cargo', isCargo: true, comment: 'Climate-controlled refrigerated freight bay for perishables, medicines, and organics.' },
    HazardousContainment: { key: 'HazardousContainment', name: 'Hazardous Cargo Containment', unitTons: 1.0, unitCost: 0.1, category: 'Cargo', isCargo: true, comment: 'Reinforced, sealed, and radiation-shielded containment bay for volatile materials.' },
    ArmoryVault: { key: 'ArmoryVault', name: 'Secure Armory / Vault', unitTons: 1.0, unitCost: 0.2, category: 'Security', isArmory: true, comment: 'Armored and biometric-locked vault for weapons, ammunition, and high-value cargo.' },
    MedicalBay: { key: 'MedicalBay', name: 'Medical Bay / Sickbay (4t)', unitTons: 4.0, unitCost: 2.0, category: 'Medical', fixedSize: true, isMedical: true, comment: '4.0-ton surgical theater, 2 trauma beds, and full diagnostic lab (+1 Medical Console link).' },
    ScienceLab: { key: 'ScienceLab', name: 'Science Laboratory (4t)', unitTons: 4.0, unitCost: 1.0, category: 'Research', fixedSize: true, isLab: true, comment: '4.0-ton modular research laboratory equipped with sensors, containment, and analysis gear.' },
    Workshop: { key: 'Workshop', name: 'Machine Workshop / Repair Bay (4t)', unitTons: 4.0, unitCost: 0.5, category: 'Engineering', fixedSize: true, isWorkshop: true, comment: '4.0-ton fabrication and repair facility with parts inventory, tools, and lathe units.' }
};

export const ENUM_LIFE_SUPPORT_TYPES = {
    ExtendedLifeSupport: { key: 'ExtendedLifeSupport', name: 'Extended Life Support Stores', personDaysPerTon: 100, costPerTon: 0.01, unitTons: 1.0, comment: 'Consumable oxygen, water filters, and ration stores (100 Person-Days per ton).' },
    RecyclerUnit: { key: 'RecyclerUnit', name: 'Atmospheric Recycler / Water Recovery', tons: 2.0, cost: 0.5, efficiencyBonus: 0.5, comment: 'Closed-loop environmental reclamation unit (extends life support endurance by +50%).' }
};

export const ENUM_JUMP_FIELDS = {
    Bubble: {
        key: 'Bubble',
        name: 'Bubble Jump Field (Default)',
        strength: 100,
        mult: 1.0,
        armorMod: 'std',
        flash: 'std',
        comment: 'Bubble produces the standard value for D (Table 07G).'
    },
    Grid: {
        key: 'Grid',
        name: 'Grid (Embedded in Hull)',
        strength: 80,
        mult: 0.8,
        armorMod: '-1D',
        flash: '+1',
        comment: 'Embedded in the Hull. Grid reduces safe jump distance D.'
    },
    Plates: {
        key: 'Plates',
        name: 'Plates (1 Plate / 10t)',
        strength: 140,
        mult: 1.4,
        armorMod: '/2',
        flash: '+1',
        comment: '1 Plate Per 10 Hull Tons. Plates produce the greatest value for D.'
    }
};

export const ENUM_MISSION_LIST = [
    { id: 1, service: "Naval", activity: "Combat", type: "Offensive", qualifier: "Principal", mission: "Cruiser", code: "C" },
    { id: 2, service: "Naval", activity: "Combat", type: "Offensive", qualifier: "Major", mission: "Frigate", code: "G" },
    { id: 3, service: "Naval", activity: "Combat", type: "Offensive", qualifier: "Special", mission: "Destroyer", code: "V" },
    { id: 4, service: "Naval", activity: "Combat", type: "Offensive", qualifier: "Minor", mission: "Corvette", code: "T" },
    { id: 5, service: "Naval", activity: "Combat", type: "Siege", qualifier: "Attack", mission: "Ortillery", code: "H" },
    { id: 6, service: "Naval", activity: "Combat", type: "Siege", qualifier: "Invasion", mission: "Assault", code: "T" },
    { id: 7, service: "Naval", activity: "Combat", type: "Siege", qualifier: "Defender", mission: "Sentinel", code: "S" },
    { id: 8, service: "Naval", activity: "Combat", type: "Defensive", qualifier: "Minor", mission: "Escort", code: "E" },
    { id: 9, service: "Naval", activity: "Combat", type: "Defensive", qualifier: "Special", mission: "Special Boat", code: "B" },
    { id: 10, service: "Naval", activity: "Combat", type: "Defensive", qualifier: "Major", mission: "Defender", code: "D" },
    { id: 11, service: "Naval", activity: "Combat", type: "Defensive", qualifier: "Principal", mission: "Monitor", code: "N" },
    { id: 12, service: "Naval", activity: "Combat", type: "Independent", qualifier: "Anti-Shipping", mission: "Corsair", code: "P" },
    { id: 13, service: "Naval", activity: "Combat", type: "Independent", qualifier: "Anti-Commerce", mission: "Raider", code: "R" },
    { id: 14, service: "Naval", activity: "Combat", type: "Independent", qualifier: "Anti-Port", mission: "Marauder", code: "P" },
    { id: 15, service: "Naval", activity: "Auxiliary", type: "Supply", qualifier: "Major", mission: "Transport", code: "T" },
    { id: 16, service: "Naval", activity: "Auxiliary", type: "Supply", qualifier: "Minor", mission: "Barge", code: "W" },
    { id: 17, service: "Naval", activity: "Auxiliary", type: "Supply", qualifier: "Resupply", mission: "Tender/Tug", code: "T" },
    { id: 18, service: "Naval", activity: "Auxiliary", type: "Supply", qualifier: "Information", mission: "Corvette", code: "E" },
    { id: 19, service: "Commerce", activity: "Merchant", type: "Scheduled", qualifier: "Passenger", mission: "Liner", code: "M" },
    { id: 20, service: "Commerce", activity: "Merchant", type: "Scheduled", qualifier: "Cargo", mission: "Merchant", code: "R" },
    { id: 21, service: "Commerce", activity: "Merchant", type: "Scheduled", qualifier: "Freight", mission: "Freighter", code: "F" },
    { id: 22, service: "Commerce", activity: "Merchant", type: "UnScheduled", qualifier: "Freight", mission: "Transport", code: "T" },
    { id: 23, service: "Commerce", activity: "Merchant", type: "UnScheduled", qualifier: "Cargo", mission: "Trader", code: "A" },
    { id: 24, service: "Commerce", activity: "Merchant", type: "UnScheduled", qualifier: "Passenger", mission: "Packet", code: "U" },
    { id: 25, service: "Commerce", activity: "", type: "Charter", qualifier: "Recreation", mission: "Safari", code: "K" },
    { id: 26, service: "Commerce", activity: "", type: "Charter", qualifier: "Active", mission: "Expedition", code: "K" },
    { id: 27, service: "Commerce", activity: "", type: "Charter", qualifier: "Luxury", mission: "Yacht", code: "Y" },
    { id: 28, service: "Government/NGO/Private", activity: "", type: "Information", qualifier: "Small Goods", mission: "Courier", code: "S" },
    { id: 29, service: "Government/NGO/Private", activity: "", type: "Information", qualifier: "Data Files", mission: "Messenger", code: "S" },
    { id: 30, service: "Government/NGO/Private", activity: "", type: "Information", qualifier: "Goods and Files", mission: "Express", code: "X" },
    { id: 31, service: "Government/NGO/Private", activity: "", type: "Exploration", qualifier: "First Look", mission: "Scout", code: "S" },
    { id: 32, service: "Government/NGO/Private", activity: "", type: "Exploration", qualifier: "Re-Look", mission: "Survey", code: "N" },
    { id: 33, service: "Government/NGO/Private", activity: "", type: "Exploration", qualifier: "Data Collection", mission: "Beagle", code: "B" },
    { id: 34, service: "Government/NGO/Private", activity: "", type: "Exploration", qualifier: "Medical Data", mission: "Med", code: "N" },
    { id: 35, service: "Government/NGO/Private", activity: "", type: "Exploration", qualifier: "Data Analysis", mission: "Lab", code: "L" },
    { id: 36, service: "Government/NGO/Private", activity: "", type: "Exploration", qualifier: "Resource Search", mission: "Prospector", code: "J" },
    { id: 37, service: "Government/NGO/Private", activity: "", type: "Bureaucratic", qualifier: "Inspection", mission: "Picket", code: "P" },
    { id: 38, service: "Government/NGO/Private", activity: "", type: "Bureaucratic", qualifier: "Enforcement", mission: "Patrol", code: "P" },
    { id: 39, service: "Government/NGO/Private", activity: "", type: "", qualifier: "", mission: "Privateer", code: "P" },
    { id: 40, service: "Unclassified", activity: "", type: "", qualifier: "", mission: "Unassigned", code: "Z" }
];

export const ENUM_MODIFIERS_LIST = [
    { code: "A", words: ["Alternate", "Improved", "Armored", "Attack"] },
    { code: "B", words: ["Boat", "Bulk", "Battle", "Big"] },
    { code: "C", words: ["Close", "Carrier", "Communications"] },
    { code: "D", words: ["Defense", "Defending", "Interceptor"] },
    { code: "E", words: ["Escort", "Essential", "Electronic Warfare"] },
    { code: "F", words: ["Fast", "Fat", "Frontier", "Far", "Flag", "Free"] },
    { code: "G", words: ["Gunned", "Upgunned", "Gas"] },
    { code: "H", words: ["Fuel", "Tanker", "Hydrogen"] },
    { code: "J", words: ["Survey", "Prospector", "Interface", "Intruder"] },
    { code: "K", words: ["Subsidized", "Fast", "Diplomatic"] },
    { code: "L", words: ["LR", "Lifeboat", "Exploratory", "Light"] },
    { code: "M", words: ["Military", "Militia", "Mercenary", "Motivator", "Tug"] },
    { code: "N", words: ["Naval", "Nuclear", "Fleet"] },
    { code: "P", words: ["Patrol", "Plus", "Passenger", "Mercenary"] },
    { code: "Q", words: ["Disguised", "Decoy", "Quarantine", "Mother"] },
    { code: "R", words: ["Recon", "Rescue", "Rider"] },
    { code: "S", words: ["Slow", "System", "Special", "Luxury", "Small"] },
    { code: "T", words: ["Tramp", "Tender", "Transport"] },
    { code: "U", words: ["Unarmed", "Hulk", "De-activated", "Inop"] },
    { code: "V", words: ["Vehicle Carrier", "Drone", "Remote"] },
    { code: "W", words: ["Unpowered", "Non-Jump"] },
    { code: "X", words: ["Experimental", "Special", "Express"] },
    { code: "Y", words: ["Hull", "Subhull", "Pod", "Rider", "Modular"] },
    { code: "Z", words: ["Unassigned"] }
];

// Flattened list of modifier word options for UI dropdowns
export const ENUM_MODIFIER_WORD_OPTIONS = (() => {
    const options = [];
    ENUM_MODIFIERS_LIST.forEach(item => {
        item.words.forEach(word => {
            options.push({
                word: word,
                code: item.code,
                label: `${word} [${item.code}]`
            });
        });
    });
    return options.sort((a, b) => a.word.localeCompare(b.word));
})();

// Legacy backward-compatibility aliases
export const ENUM_MISSION_SERVICE = {
    Naval: { code: 'Naval', name: 'Naval' },
    Commerce: { code: 'Commerce', name: 'Commerce' },
    "Government/NGO/Private": { code: 'Government/NGO/Private', name: 'Government/NGO/Private' },
    Unclassified: { code: 'Unclassified', name: 'Unclassified' }
};
export const ENUM_MISSION_ACTIVITY = {};
export const ENUM_MISSION_TYPE = {};
export const ENUM_MISSION_QUALIFIER = {};
export const ENUM_MISSION_MODIFIER = {};

export function buildAccommodation(typeKey, count = 1, options = {}) {
    const aDef = ENUM_ACCOMMODATION_TYPES[typeKey] || ENUM_ACCOMMODATION_TYPES.StandardStateroom;
    const cnt = Math.max(1, parseInt(count, 10) || 1);
    const importFee = options.importFee === true;
    const tlVal = options.tl !== undefined ? options.tl : (options.shipBaseTL || 12);
    const assignment = options.assignment || aDef.defaultRole;

    // Custom tonnage override allowed for PassengerCommons
    let singleTons = aDef.tons;
    if (aDef.isCommons && options.tons !== undefined) {
        singleTons = Math.max(1, parseFloat(options.tons) || 1);
    }
    const totalTons = singleTons * (aDef.isCommons ? 1 : cnt);
    const singleCost = aDef.cost * (importFee ? 1.1 : 1.0);
    const totalCost = singleCost * cnt;
    const totalOccupants = (aDef.occupants || 0) * cnt;

    return {
        isAccommodation: true,
        accommodationKey: typeKey,
        name: aDef.name,
        assignment: assignment,
        count: cnt,
        occupants: totalOccupants,
        singleOccupants: aDef.occupants || 0,
        tons: Math.round(totalTons * 100) / 100,
        cost: Math.round(totalCost * 1000) / 1000,
        fresher: aDef.fresher,
        comfort: aDef.comfort,
        isCommons: !!aDef.isCommons,
        isCryo: !!aDef.isCryo,
        tl: tlVal,
        importFee: importFee,
        comment: aDef.comment
    };
}

export function buildFacility(facilityKey, amount = 1, options = {}) {
    const fDef = ENUM_FACILITY_TYPES[facilityKey] || ENUM_FACILITY_TYPES.StandardCargo;
    const amt = Math.max(1, parseFloat(amount) || 1);
    const importFee = options.importFee === true;
    const tlVal = options.tl !== undefined ? options.tl : (options.shipBaseTL || 12);

    let totalTons = 0;
    let totalCost = 0;
    let count = 1;

    if (fDef.fixedSize) {
        count = Math.max(1, Math.round(amt));
        totalTons = fDef.unitTons * count;
        totalCost = fDef.unitCost * count * (importFee ? 1.1 : 1.0);
    } else {
        totalTons = amt;
        totalCost = fDef.unitCost * amt * (importFee ? 1.1 : 1.0);
        count = Math.max(1, Math.round(amt));
    }

    return {
        isFacility: true,
        facilityKey: facilityKey,
        name: fDef.name,
        category: fDef.category,
        count: count,
        tons: Math.round(totalTons * 100) / 100,
        cost: Math.round(totalCost * 1000) / 1000,
        isCargo: !!fDef.isCargo,
        isArmory: !!fDef.isArmory,
        isMedical: !!fDef.isMedical,
        isLab: !!fDef.isLab,
        isWorkshop: !!fDef.isWorkshop,
        tl: tlVal,
        importFee: importFee,
        comment: fDef.comment
    };
}

export function buildLifeSupport(lsKey, amount = 1, options = {}) {
    const lsDef = ENUM_LIFE_SUPPORT_TYPES[lsKey] || ENUM_LIFE_SUPPORT_TYPES.ExtendedLifeSupport;
    const amt = Math.max(1, parseFloat(amount) || 1);
    const importFee = options.importFee === true;
    const tlVal = options.tl !== undefined ? options.tl : (options.shipBaseTL || 12);

    let totalTons = 0;
    let totalCost = 0;
    let personDays = 0;
    let count = 1;

    if (lsKey === 'RecyclerUnit') {
        count = Math.max(1, Math.round(amt));
        totalTons = lsDef.tons * count;
        totalCost = lsDef.cost * count * (importFee ? 1.1 : 1.0);
    } else {
        // ExtendedLifeSupport: amt is tonnage
        totalTons = amt;
        count = Math.max(1, Math.round(amt));
        totalCost = (lsDef.costPerTon || 0.01) * amt * (importFee ? 1.1 : 1.0);
        personDays = Math.round(amt * (lsDef.personDaysPerTon || 100));
    }

    return {
        isLifeSupport: true,
        lifeSupportKey: lsKey,
        name: lsDef.name,
        count: count,
        tons: Math.round(totalTons * 100) / 100,
        cost: Math.round(totalCost * 1000) / 1000,
        personDays: personDays,
        efficiencyBonus: lsDef.efficiencyBonus || 0,
        tl: tlVal,
        importFee: importFee,
        comment: lsDef.comment
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
    const stageFuelMod = (ENUM_DRIVE_STAGE[drive.stage] && ENUM_DRIVE_STAGE[drive.stage].fuel !== undefined) ? ENUM_DRIVE_STAGE[drive.stage].fuel : 1;

    switch (drive.driveType) {
        case ENUM_DRIVE_TYPE.Jump:
            fuelConsumption = Math.round((potential * shipTonnage / 10 * stageFuelMod) * 100) / 100;
            if (potential > 1) {
                minConsumption = Math.round((shipTonnage / 10 * stageFuelMod) * 100) / 100;
                minNote = minConsumption + " tons per Jump-1";
            }
            note = fuelConsumption + " tons per Jump-" + potential;
            break;
        case ENUM_DRIVE_TYPE.Hop:
            fuelConsumption = Math.round((potential * shipTonnage / 10 * stageFuelMod) * 100) / 100;
            note = fuelConsumption + " tons per Hop-" + potential;
            if (potential > 1) {
                minConsumption = Math.round((shipTonnage / 10 * stageFuelMod) * 100) / 100;
                minNote = minConsumption + " tons per Hop-1";
            }
            break;
        case ENUM_DRIVE_TYPE.Skip:
            fuelConsumption = Math.round((potential * shipTonnage / 10 * stageFuelMod) * 100) / 100;
            note = fuelConsumption + " tons per Skip-" + potential;
            if (potential > 1) {
                minConsumption = Math.round((shipTonnage / 10 * stageFuelMod) * 100) / 100;
                minNote = minConsumption + " tons per Skip-1";
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
            fuelConsumption = Math.round((potential * shipTonnage / 100 * stageFuelMod) * 100) / 100;
            note = fuelConsumption + " tons per month for P=" + potential;
            if (potential > 1) {
                minConsumption = Math.round((shipTonnage / 100 * stageFuelMod) * 100) / 100;
                minNote = minConsumption + " tons per Power Output Level";
            }
            break;
        case ENUM_DRIVE_TYPE.Fission:
            fuelConsumption = Math.round((potential * shipTonnage / 100 * stageFuelMod) * 100) / 100;
            note = fuelConsumption + " rods per 10 years";
            if (potential > 1) {
                minConsumption = Math.round((shipTonnage / 100 * stageFuelMod) * 100) / 100;
                minNote = minConsumption + " rods per 10 years per Power Output Level";
            }
            break;
        case ENUM_DRIVE_TYPE.AntiMatter:
            fuelConsumption = Math.round((potential * shipTonnage / 100 * stageFuelMod) * 100) / 100;
            note = fuelConsumption + " slugs per year";
            if (potential > 1) {
                minConsumption = Math.round((shipTonnage / 100 * stageFuelMod) * 100) / 100;
                minNote = minConsumption + " slugs per year per Power Output Level";
            }
            break;
        case ENUM_DRIVE_TYPE.Rocket:
            fuelConsumption = 0;
            note = "Uses Rocket Fuel";
            minConsumption = fuelConsumption;
            minNote = note;
            break;
        case ENUM_DRIVE_TYPE.HEPlaR:
            fuelConsumption = Math.round((potential * shipTonnage / 100 * stageFuelMod) * 100) / 100;
            note = fuelConsumption + " tons per burn in addition to Rocket Fuel";
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
    minConsumption = Math.round(minConsumption * 100) / 100;
    fuelConsumption = Math.round(fuelConsumption * 100) / 100;
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
        this.shipName = "Starship";
        this.registration = "REG-0101";
        this.missionId = 23; // Default: Trader [A] in Commerce > Merchant > UnScheduled > Cargo
        this.missionService = "Commerce";
        this.missionActivity = "Merchant";
        this.missionType = "UnScheduled";
        this.missionQualifier = "Cargo";
        this.missionName = "Trader";
        this.missionCodeKey = "A";
        this.modifier1Word = "Far";
        this.modifier1Code = "F";
        this.modifier2Word = "";
        this.modifier2Code = "";
        this.jumpFieldKey = "Bubble";
        this.engineerSkill = 0; // Engineer rank (0-15)
        this.jumpDriveSpecialty = 0; // Jump Drives specialty rank (0-6)
        this.jumpDiameters = null; // Custom jump initiation distance (defaults to safe distance D)
    }

    get hasJumpDrive() {
        return this.drives.some(d => ['Jump', 'Hop', 'Skip'].includes(d.driveType));
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

    get accommodations() {
        return this.components.filter(c => c.isAccommodation);
    }

    get facilities() {
        return this.components.filter(c => c.isFacility);
    }

    get lifeSupport() {
        return this.components.filter(c => c.isLifeSupport);
    }

    get totalCrewBerths() {
        return this.accommodations.filter(a => a.assignment === 'Crew').reduce((sum, a) => sum + (a.occupants || 0), 0);
    }

    get totalCrewQuartersTons() {
        return this.accommodations.filter(a => a.assignment === 'Crew').reduce((sum, a) => sum + (a.tons || 0), 0);
    }

    get totalHighPaxBerths() {
        return this.accommodations.filter(a => a.assignment === 'HighPax').reduce((sum, a) => sum + (a.occupants || 0), 0);
    }

    get totalMidPaxBerths() {
        return this.accommodations.filter(a => a.assignment === 'MidPax' || a.assignment === 'Passenger').reduce((sum, a) => sum + (a.occupants || 0), 0);
    }

    get totalPassengerBerths() {
        return this.totalHighPaxBerths + this.totalMidPaxBerths;
    }

    get totalPassengerAccommodationsTons() {
        return this.accommodations.filter(a => a.assignment !== 'Crew' && !a.isCommons).reduce((sum, a) => sum + (a.tons || 0), 0);
    }

    get totalLowBerths() {
        return this.accommodations.filter(a => a.isCryo).reduce((sum, a) => sum + (a.occupants || 0), 0);
    }

    get totalCommonsTons() {
        return this.accommodations.filter(a => a.isCommons).reduce((sum, a) => sum + (a.tons || 0), 0);
    }

    get totalCargoTons() {
        let cargo = 0;
        this.facilities.filter(f => f.isCargo).forEach(f => { cargo += f.tons; });
        this.components.filter(c => c.name === 'Cargo Space').forEach(c => { cargo += c.tons; });
        return cargo;
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

    get crewComfortRatio() {
        const req = this.getCrewRequirements('Merchant');
        const crewCount = req.totalCrew || 1;
        const quartersTons = this.totalCrewQuartersTons;
        if (crewCount <= 0) return 1.0;
        return Math.round((quartersTons / crewCount) * 100) / 100;
    }

    get passengerDemand() {
        const paxCount = this.totalPassengerBerths;
        if (paxCount <= 0) return 0;
        const totalPaxTons = this.totalPassengerAccommodationsTons + this.totalCommonsTons;
        const ratio = totalPaxTons / paxCount;
        return Math.round((ratio - 5) * 10) / 10;
    }

    getLifeSupportStatus() {
        const crewReq = this.getCrewRequirements('Merchant');
        const activeOccupants = (crewReq.totalCrew || 0) + this.totalPassengerBerths;
        const cryoOccupants = this.totalLowBerths;

        // Base 30 days (1 month) per active occupant provided by staterooms
        const basePersonDays = activeOccupants * 30;

        // Extended stores (100 person-days per ton)
        let extendedPersonDays = 0;
        let recyclerCount = 0;
        this.lifeSupport.forEach(ls => {
            if (ls.lifeSupportKey === 'ExtendedLifeSupport') {
                extendedPersonDays += (ls.personDays || 0);
            } else if (ls.lifeSupportKey === 'RecyclerUnit') {
                recyclerCount += (ls.count || 1);
            }
        });

        // Recycler units increase endurance efficiency by +50% per unit (max 3x)
        const recyclerMultiplier = Math.min(3.0, 1.0 + (recyclerCount * 0.5));
        const totalEffectivePersonDays = Math.round((basePersonDays + extendedPersonDays) * recyclerMultiplier);

        // Daily consumption: 1 person-day per active occupant + 0.1 per cryo occupant
        const dailyConsumption = activeOccupants + (cryoOccupants * 0.1);
        const daysEndurance = dailyConsumption > 0 ? Math.floor(totalEffectivePersonDays / dailyConsumption) : 30;
        const monthsEndurance = Math.round((daysEndurance / 30) * 10) / 10;

        return {
            activeOccupants: activeOccupants,
            cryoOccupants: cryoOccupants,
            totalSouls: activeOccupants + cryoOccupants,
            basePersonDays: basePersonDays,
            extendedPersonDays: extendedPersonDays,
            recyclerCount: recyclerCount,
            recyclerMultiplier: recyclerMultiplier,
            totalPersonDays: totalEffectivePersonDays,
            dailyConsumption: dailyConsumption,
            daysEndurance: daysEndurance,
            monthsEndurance: monthsEndurance
        };
    }

    getCrewRequirements(staffingModel = 'Merchant') {
        const tonnage = this.tonnage;
        const drives = this.drives;
        const totalDriveTons = drives.reduce((sum, d) => sum + (d.tons || 0), 0);
        const hasJump = drives.some(d => ['Jump', 'Hop', 'Skip'].includes(d.driveType));
        const weapons = this.weapons;
        const defenses = this.defenses;
        const sensors = this.sensors;
        const consoles = this.consoles;
        const hasMedicalBay = this.facilities.some(f => f.isMedical);
        const hasLab = this.facilities.some(f => f.isLab);

        const highPax = this.totalHighPaxBerths;
        const midPax = this.totalMidPaxBerths;
        const totalPax = highPax + midPax;
        const lowPax = this.totalLowBerths;

        const roster = [];

        if (staffingModel === 'Scout') {
            // Scout Minimal Multi-Hatted Crew
            if (tonnage <= 200) {
                roster.push({ department: 'Command', role: 'Scout Commander', title: 'Commander', rank: 'O-4', count: 1, skill: 'Pilot / Astrogation / Leadership', comment: 'Vessel command, helm controls, and jump course plotting.' });
                roster.push({ department: 'Engineering', role: 'Scout Engineer', title: 'Chief Specialist', rank: 'E-7', count: 1, skill: 'Engineer / Mechanic', comment: 'Drives, power plant regulation, and life support maintenance.' });
                if (weapons.length > 0 || sensors.length > 0 || hasLab) {
                    roster.push({ department: 'Operations', role: 'Scout Specialist', title: 'Specialist', rank: 'E-6', count: 1, skill: 'Sensors / Gunnery / Medic', comment: 'Survey sensors, defensive turrets, and trauma response.' });
                }
            } else {
                // Scout Cruiser / Heavy Survey (300t+)
                roster.push({ department: 'Command', role: 'Scout Captain', title: 'Captain', rank: 'O-5', count: 1, skill: 'Leadership / Tactics', comment: 'Mission commander and vessel operations.' });
                roster.push({ department: 'Command', role: 'Pilot / Astrogator', title: 'Lieutenant', rank: 'O-3', count: 1, skill: 'Pilot / Astrogation', comment: 'Helm, orbital maneuvers, and jump navigation.' });
                roster.push({ department: 'Engineering', role: 'Chief Engineer', title: 'Staff Specialist', rank: 'E-8', count: 1, skill: 'Engineer (Drive/Power)', comment: 'Drive bay supervision and repairs.' });
                const addEng = Math.max(0, Math.ceil(totalDriveTons / 35) - 1);
                if (addEng > 0) {
                    roster.push({ department: 'Engineering', role: 'Drive Technicians', title: 'Tech Specialist', rank: 'E-5', count: addEng, skill: 'Mechanic / Electronics', comment: 'Drive mechanics and power distribution.' });
                }
                if (sensors.length > 0 || hasLab) {
                    roster.push({ department: 'Operations', role: 'Science Officer / Sensop', title: 'Survey Officer', rank: 'O-2', count: 1, skill: 'Sensors / Science', comment: 'Deep sensor analysis and lab experiments.' });
                }
                if (weapons.length > 0) {
                    roster.push({ department: 'Gunnery', role: 'Gunners', title: 'Gunner', rank: 'E-4', count: weapons.length, skill: 'Gunner', comment: 'Turret and defense screen operation.' });
                }
                if (hasMedicalBay || totalPax > 0 || tonnage >= 400) {
                    roster.push({ department: 'Medical', role: 'Medical Specialist', title: 'Surgeon / Medic', rank: 'O-2', count: 1, skill: 'Medic', comment: 'Crew physicals and trauma diagnostics.' });
                }
            }
        } else if (staffingModel === 'Naval') {
            // Full Military Naval Hierarchy
            const isCapital = tonnage >= 1000;
            const isCruiser = tonnage >= 400;

            roster.push({ department: 'Command', role: 'Commanding Officer (CO)', title: isCapital ? 'Captain' : (isCruiser ? 'Commander' : 'Lt Commander'), rank: isCapital ? 'O-6' : (isCruiser ? 'O-5' : 'O-4'), count: 1, skill: 'Leadership / Tactics (Naval)', comment: 'Vessel command and operational decisions.' });
            roster.push({ department: 'Command', role: 'Executive Officer (XO)', title: isCapital ? 'Commander' : 'Lieutenant', rank: isCapital ? 'O-5' : 'O-3', count: 1, skill: 'Admin / Leadership', comment: 'Second-in-command and ship routine coordinator.' });
            roster.push({ department: 'Command', role: 'Helm / Pilot Officer', title: 'Flight Lieutenant', rank: 'O-3', count: 1, skill: 'Pilot (Spacecraft)', comment: 'Sublight navigation and combat evasion maneuvers.' });

            if (hasJump) {
                roster.push({ department: 'Command', role: 'Astrogator / Nav Officer', title: 'Navigator', rank: 'O-2', count: 1, skill: 'Astrogation', comment: 'Interstellar plotting, micro-jump calculations.' });
            }

            if (sensors.length > 0 || isCruiser) {
                roster.push({ department: 'Operations', role: 'Tactical Sensor Officer (Sensop)', title: 'Sensors Sub-Lieutenant', rank: 'O-2', count: 1, skill: 'Sensors', comment: 'Electronic warfare, passive arrays, and target tracking.' });
            }
            roster.push({ department: 'Operations', role: 'Communications Officer', title: 'Comms Officer', rank: 'O-1', count: 1, skill: 'Comms', comment: 'Subspace datalinks, transponders, and fleet signals.' });

            // Engineering
            roster.push({ department: 'Engineering', role: 'Chief Engineer', title: 'Lieutenant Commander', rank: 'O-4', count: 1, skill: 'Engineer (All)', comment: 'Engine room head and power grid regulator.' });
            const engCount = Math.max(1, Math.ceil(totalDriveTons / 35));
            if (engCount > 1) {
                roster.push({ department: 'Engineering', role: 'Drive & Power Technicians', title: 'Petty Officer', rank: 'E-6', count: engCount - 1, skill: 'Mechanic / Engineer', comment: 'Reaction mass feeds, capacitor banks, and field coils.' });
            }
            const dcCount = Math.max(1, Math.floor(tonnage / 200));
            roster.push({ department: 'Engineering', role: 'Damage Control Crew', title: 'Leading Spacer', rank: 'E-4', count: dcCount, skill: 'Mechanic / Vacc Suit', comment: 'Hull breach patching, fire suppression, and redundant routing.' });

            // Gunnery
            if (weapons.length > 0 || defenses.length > 0) {
                if (weapons.length >= 3 || isCruiser) {
                    roster.push({ department: 'Gunnery', role: 'Gunnery Officer (GunnO)', title: 'Gunnery Lieutenant', rank: 'O-3', count: 1, skill: 'Heavy Weapons / Tactics', comment: 'Fire control coordination and battery convergence.' });
                }
                const totalMounts = weapons.reduce((s, w) => s + (w.count || 1), 0) + defenses.reduce((s, d) => s + (d.count || 1), 0);
                roster.push({ department: 'Gunnery', role: 'Turret & Screen Gunners', title: 'Gunner Mate', rank: 'E-5', count: Math.max(1, totalMounts), skill: 'Gunner (Turret/Bay/Screens)', comment: 'Direct point defense, missile tracking, and screen tuning.' });
            }

            // Medical
            const medicCount = Math.max(1, Math.ceil(tonnage / 500) + (hasMedicalBay ? 1 : 0));
            roster.push({ department: 'Medical', role: 'Medical Staff', title: 'Surgeon / Corpsman', rank: 'O-3 / E-5', count: medicCount, skill: 'Medic', comment: 'Sickbay triage, surgical care, and bio-containment.' });

            // Service / Logistics
            if (tonnage >= 300) {
                roster.push({ department: 'Service', role: 'Logistics Purser & Supply', title: 'Supply Officer', rank: 'O-2', count: 1, skill: 'Admin / Broker', comment: 'Inventory, ordinance requisitions, and ration stores.' });
            }
            const cookCount = Math.max(1, Math.floor(tonnage / 400));
            roster.push({ department: 'Service', role: 'Culinary & Mess Staff', title: 'Mess Specialist', rank: 'E-3', count: cookCount, skill: 'Steward', comment: 'Galley operations and crew nutrition.' });

            // Marine Troops
            const marineSquads = Math.max(1, Math.floor(tonnage / 500));
            const troopCount = marineSquads * 4; // 4 troopers per fireteam/squad
            roster.push({ department: 'Troops', role: 'Marine Detachment', title: 'Marine Sergeant & Troopers', rank: 'E-7 / E-4', count: troopCount, skill: 'Gun Combat / Battle Dress', comment: 'Boarding defense, security patrols, and assault actions.' });

        } else {
            // Standard Commercial / Merchant Staffing
            roster.push({ department: 'Command', role: 'Captain / Master', title: 'Captain', rank: 'O-5', count: 1, skill: 'Pilot / Leadership', comment: 'Vessel master, docking command, and commercial decisions.' });

            if (tonnage >= 400) {
                roster.push({ department: 'Command', role: 'First Mate / XO', title: 'First Officer', rank: 'O-4', count: 1, skill: 'Admin / Pilot', comment: 'Watch officer and freight loading supervisor.' });
            }

            if (hasJump) {
                roster.push({ department: 'Command', role: 'Astrogator / Navigator', title: 'Second Officer', rank: 'O-3', count: 1, skill: 'Astrogation', comment: 'Plotting jump vectors and system transitions.' });
            }

            // Engineering: 1 Chief Engineer + 1 per 35 drive tons
            roster.push({ department: 'Engineering', role: 'Chief Engineer', title: 'Chief Engineer', rank: 'O-4', count: 1, skill: 'Engineer (Drive)', comment: 'Engine room supervisor and power plant oversight.' });
            const engCount = Math.max(0, Math.ceil(totalDriveTons / 35) - 1);
            if (engCount > 0) {
                roster.push({ department: 'Engineering', role: 'Assistant Engineers', title: 'Second/Third Engineer', rank: 'E-6', count: engCount, skill: 'Mechanic / Electronics', comment: 'Drive watchstanders and routine maintenance.' });
            }

            // Gunnery (if armed)
            if (weapons.length > 0) {
                const gunnerCount = weapons.reduce((s, w) => s + (w.count || 1), 0);
                roster.push({ department: 'Gunnery', role: 'Ship Gunners', title: 'Gunner', rank: 'E-4', count: gunnerCount, skill: 'Gunner', comment: 'Defensive turret operators against pirate interdiction.' });
            }

            // Service & Hospitality (Stewards based on T5 passenger formula: 1 per 8 High Pax, 1 per 24 Mid Pax)
            const requiredHighStewards = Math.ceil(highPax / 8);
            const requiredMidStewards = Math.ceil(midPax / 24);
            const totalStewards = requiredHighStewards + requiredMidStewards;

            if (totalPax > 0) {
                roster.push({ department: 'Service', role: 'Passenger Stewards', title: 'Chief Steward & Attendants', rank: 'E-5', count: Math.max(1, totalStewards), skill: 'Steward', comment: `Dining service, cabin service (${highPax} High Pax @ 1:8, ${midPax} Mid Pax @ 1:24).` });
            }

            if (totalPax >= 6 || tonnage >= 400) {
                roster.push({ department: 'Service', role: 'Purser / Supercargo', title: 'Purser', rank: 'O-2', count: 1, skill: 'Broker / Admin', comment: 'Ticket manifests, customs declarations, and cargo billing.' });
            }

            // Medical: 1 medic if ship >= 120 tons or 10+ passengers or Medical Bay
            if (tonnage >= 120 || (totalPax + lowPax) >= 10 || hasMedicalBay) {
                roster.push({ department: 'Medical', role: 'Ship Medical Officer', title: 'Doctor / Medic', rank: 'O-3', count: 1, skill: 'Medic', comment: 'Passenger health checks, cryo revive, and sickbay care.' });
            }

            // Cargo Master / Deckhands if substantial cargo
            const cargoTons = this.totalCargoTons;
            if (cargoTons >= 200) {
                const deckhands = Math.max(1, Math.floor(cargoTons / 200));
                roster.push({ department: 'Operations', role: 'Cargo Master & Deckhands', title: 'Cargo Specialist', rank: 'E-4', count: deckhands, skill: 'Freight / Vacc Suit', comment: 'Cargo bay loading cranes, securing ties, and mass balancing.' });
            }
        }

        const totalCrew = roster.reduce((sum, r) => sum + r.count, 0);
        const totalOfficers = roster.filter(r => r.rank && r.rank.startsWith('O-')).reduce((sum, r) => sum + r.count, 0);
        const totalEnlisted = totalCrew - totalOfficers;
        const totalTroops = roster.filter(r => r.department === 'Troops').reduce((sum, r) => sum + r.count, 0);
        const totalStewards = roster.filter(r => r.role.includes('Steward')).reduce((sum, r) => sum + r.count, 0);

        return {
            staffingModel: staffingModel,
            roster: roster,
            totalCrew: totalCrew,
            totalOfficers: totalOfficers,
            totalEnlisted: totalEnlisted,
            totalTroops: totalTroops,
            totalStewards: totalStewards,
            highPassengers: highPax,
            middlePassengers: midPax,
            totalPassengers: totalPax,
            lowPassengers: lowPax,
            totalSouls: totalCrew + totalPax + lowPax
        };
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

    get missionObject() {
        if (this.missionId) {
            const found = ENUM_MISSION_LIST.find(m => m.id === this.missionId);
            if (found) return found;
        }
        if (this.missionName) {
            const found = ENUM_MISSION_LIST.find(m => m.mission === this.missionName && (!this.missionCodeKey || m.code === this.missionCodeKey));
            if (found) return found;
        }
        return ENUM_MISSION_LIST[22]; // Default Trader [A]
    }

    get missionCode() {
        const obj = this.missionObject;
        const base = this.missionCodeKey || obj?.code || 'A';
        const m1 = this.modifier1Code || (this.modifier1Word ? (ENUM_MODIFIERS_LIST.find(m => m.words.includes(this.modifier1Word))?.code || '') : '');
        const m2 = this.modifier2Code || (this.modifier2Word ? (ENUM_MODIFIERS_LIST.find(m => m.words.includes(this.modifier2Word))?.code || '') : '');
        return `${base}${m1}${m2}`;
    }

    get missionFullTitle() {
        const words = [];
        if (this.modifier1Word) words.push(this.modifier1Word);
        if (this.modifier2Word && this.modifier2Word !== this.modifier1Word) words.push(this.modifier2Word);
        const mName = this.missionName || this.missionObject?.mission || 'Trader';
        words.push(mName);
        return words.join(' ');
    }

    get derivedHullClassification() {
        return this.missionCode;
    }

    get jumpField() {
        return ENUM_JUMP_FIELDS[this.jumpFieldKey] || ENUM_JUMP_FIELDS.Bubble;
    }

    safeJumpDistance(engineerSkill = this.engineerSkill, jumpDriveSpecialty = this.jumpDriveSpecialty) {
        const jDrive = this.drives.find(d => ['Jump', 'Hop', 'Skip'].includes(d.driveType));
        const hasJumpDrive = !!jDrive;
        const eff = jDrive ? (ENUM_DRIVE_STAGE[jDrive.stage]?.eff || 1.0) : 1.0;
        const field = this.jumpField;
        const strength = field.strength; // 100 for Bubble, 80 for Grid, 140 for Plates
        const engRank = Math.min(15, Math.max(0, parseInt(engineerSkill, 10) || 0));
        const jdRank = Math.min(6, Math.max(0, parseInt(jumpDriveSpecialty, 10) || 0));
        const totalEng = engRank + jdRank;

        // Safe Jump Distance D = (Field Strength / Drive Efficiency) - Engineer Skill
        const rawD = (strength / eff) - totalEng;
        const D = Math.max(0, Math.round(rawD * 10) / 10);
        const safeDiameters = D;

        return {
            hasJumpDrive: hasJumpDrive,
            strength: strength,
            E: eff,
            engineerRank: engRank,
            jumpDriveSpecialty: jdRank,
            totalEngineerSkill: totalEng,
            D: D,
            safeDiameters: safeDiameters,
            fieldName: field.name,
            fieldKey: field.key,
            armorMod: field.armorMod,
            flash: field.flash,
            comment: field.comment,
            driveStage: jDrive ? jDrive.stage : 'None'
        };
    }

    jumpInterference(engineerSkill = this.engineerSkill, jumpDriveSpecialty = this.jumpDriveSpecialty, actualDiameters = null, gravityFlux = 0) {
        const safe = this.safeJumpDistance(engineerSkill, jumpDriveSpecialty);
        if (!safe.hasJumpDrive) {
            return {
                hasJumpDrive: false,
                X: 0,
                jumpDistance: 0,
                gravityFlux: 0,
                misjumpRisk: "No Jump Drive Fitted",
                riskClass: "warning",
                safetyMargin: 0
            };
        }
        const flux = parseFloat(gravityFlux) || 0;
        const jumpDist = (actualDiameters !== null && actualDiameters !== undefined && !isNaN(parseFloat(actualDiameters)))
            ? parseFloat(actualDiameters)
            : safe.D;

        // X = Field Str / Efficiency - (Engineer + Diameters) (+ flux)
        const X = Math.round(((safe.strength / safe.E) - (safe.totalEngineerSkill + jumpDist) + flux) * 10) / 10;

        let misjumpRisk = "Nominal / Safe (0% Misjump Risk)";
        let riskClass = "good";
        if (X > 2.0) {
            misjumpRisk = "Critical Hazard (Severe Misjump / Field Collapse)";
            riskClass = "warning";
        } else if (X > 0.5) {
            misjumpRisk = "Caution (Minor Flux / +1 Jump Difficulty)";
            riskClass = "warning";
        } else if (X > 0) {
            misjumpRisk = "Acceptable Standard";
            riskClass = "good";
        }

        return {
            hasJumpDrive: true,
            X: X,
            jumpDistance: jumpDist,
            gravityFlux: flux,
            misjumpRisk: misjumpRisk,
            riskClass: riskClass,
            safetyMargin: Math.max(0, Math.round((10 - X) * 10) / 10)
        };
    }

    get qualityEvaluations() {
        const paxBerths = this.totalPassengerBerths;
        const paxTons = this.totalPassengerAccommodationsTons;
        const crewBerths = this.totalCrewBerths;
        const crewReq = this.getCrewRequirements('Merchant').totalCrew;
        const crewTons = this.totalCrewQuartersTons;
        const panels = this.totalControlPanels;
        const consoleTons = this.totalConsoleTons;

        // Demand D = (T / P) - 5
        const D = paxBerths > 0 ? Math.round(((paxTons / paxBerths) - 5) * 10) / 10 : 0;
        let demandRating = "Standard Comfort";
        let demandModifier = "+0%";
        let demandClass = "good";
        if (paxBerths === 0) {
            demandRating = "N/A (No Passengers)";
            demandModifier = "N/A";
            demandClass = "good";
        } else if (D >= 3.0) {
            demandRating = "Luxury High Comfort";
            demandModifier = "+25% Surcharge";
            demandClass = "good";
        } else if (D >= 0) {
            demandRating = "Standard Commercial";
            demandModifier = "+0% Baseline";
            demandClass = "good";
        } else if (D >= -2.0) {
            demandRating = "Substandard / Cramped";
            demandModifier = "-15% Discount";
            demandClass = "warning";
        } else {
            demandRating = "Steerage / High Density";
            demandModifier = "-30% Deep Discount";
            demandClass = "warning";
        }

        // Comfort C = Q / M
        const effectiveCrew = Math.max(1, crewBerths > 0 ? Math.min(crewBerths, crewReq) : crewReq);
        const C = Math.round((crewTons / effectiveCrew) * 100) / 100;
        let comfortRating = "Standard Berthing";
        let tensionCheck = "None";
        let comfortClass = "good";
        if (C >= 2.0) {
            comfortRating = "Spacious Quarters";
            tensionCheck = "None (High Morale)";
            comfortClass = "good";
        } else if (C >= 1.0) {
            comfortRating = "Standard Berthing";
            tensionCheck = "Standard (Monthly)";
            comfortClass = "good";
        } else if (C >= 0.5) {
            comfortRating = "Cramped Living Space";
            tensionCheck = "Moderate (+1 Tension / Week)";
            comfortClass = "warning";
        } else {
            comfortRating = "Severe Overcrowding";
            tensionCheck = "High (+2 Tension / Day)";
            comfortClass = "warning";
        }

        // Ergonomics E = Console Tons / Total CP
        const ergo = panels > 0 ? Math.round((consoleTons / panels) * 100) / 100 : 0;
        let ergoRating = "Adequate Ergonomics";
        let mishapRisk = "Standard 2D6";
        let ergoClass = "good";
        if (panels === 0) {
            ergoRating = "N/A (No Mechanisms)";
            mishapRisk = "None";
            ergoClass = "good";
        } else if (ergo >= 1.0) {
            ergoRating = "Superior Ergonomic Layout";
            mishapRisk = "Zero Mishap Penalty (DM-2)";
            ergoClass = "good";
        } else if (ergo >= 0.5) {
            ergoRating = "Standard Control Coverage";
            mishapRisk = "Standard 2D6 Mishap Checks";
            ergoClass = "good";
        } else if (ergo >= 0.25) {
            ergoRating = "Deficient Operator Controls";
            mishapRisk = "+1 Mishap Hazard on 2D6";
            ergoClass = "warning";
        } else {
            ergoRating = "Severe Control Deficit / Panel Overload";
            mishapRisk = "+2 Critical Mishap Hazard";
            ergoClass = "warning";
        }

        const risks = [];
        if (crewBerths < crewReq) risks.push(`Crew Berth Deficit: ${crewReq - crewBerths} crew members lack assigned staterooms.`);
        if (C < 0.5) risks.push(`Severe Living Space Overcrowding (C = ${C}): High crew friction and tension breakdown risks.`);
        if (ergo < 0.25 && panels > 0) risks.push(`Severe Control Panel Deficit (E = ${ergo}): Operator console overload hazard.`);
        if (this.computers.length > 0 && this.totalComputerCells < this.totalConsoleCount) {
            risks.push(`Computer Cell Deficit: ${this.totalConsoleCount - this.totalComputerCells} consoles lack processing bandwidth.`);
        }

        return {
            demand: D,
            demandRating: demandRating,
            demandModifier: demandModifier,
            demandClass: demandClass,
            comfort: C,
            comfortRating: comfortRating,
            tensionCheck: tensionCheck,
            comfortClass: comfortClass,
            ergonomics: ergo,
            ergoRating: ergoRating,
            mishapRisk: mishapRisk,
            ergoClass: ergoClass,
            risks: risks
        };
    }

    getFillform1Data() {
        const primaryHull = this.subhulls[0] || { name: 'Main Hull', tons: 100, config: 'Streamlined', tl: this.baseTL };
        const mainSubhull = primaryHull;
        const totalTons = this.tonnage;
        let totalCost = this.baseCost;
        this.subhulls.forEach(h => {
            totalCost += (h.cost || 0);
            (h.drives || []).forEach(d => totalCost += (d.cost || 0));
            (h.components || []).forEach(c => totalCost += (c.cost || 0));
        });

        const jDrive = this.drives.find(d => ['Jump', 'Hop', 'Skip'].includes(d.driveType));
        const mDrive = this.drives.find(d => ['M-Drive', 'G-Drive', 'HEPlaR', 'Rocket', 'NAFAL'].includes(d.driveType));
        const pPlant = this.drives.find(d => ['Power Plant', 'Fission', 'Anti-Matter', 'Collector'].includes(d.driveType));

        const jPerf = jDrive ? Math.floor(jDrive.ep / Math.max(1, totalTons)) : 0;
        const mPerf = mDrive ? Math.floor(mDrive.ep / Math.max(1, totalTons)) : 0;
        const pPerf = pPlant ? Math.round(pPlant.ep) : 0;

        const fuelTons = this.components.filter(c => c.isFuel).reduce((sum, c) => sum + c.tons, 0);
        const crewReq = this.getCrewRequirements('Merchant');
        const lsStatus = this.getLifeSupportStatus();

        return {
            page: 1,
            title: "T5 Starship Construction Fillform 1: Overview, Mission, Hulls & Performance",
            shipName: this.shipName || mainSubhull.name || "Starship",
            registration: this.registration || "REG-0101",
            missionCode: this.missionCode,
            missionTitle: this.missionFullTitle,
            hullClassification: this.derivedHullClassification,
            baseTL: this.baseTL,
            tonnage: totalTons,
            configuration: this.configurationType,
            totalCostMCr: Math.round(totalCost * 10) / 10,
            qsp: `${this.missionCode} (${this.missionFullTitle}) TL${this.baseTL} ${totalTons}t J${jPerf} M${mPerf} P${pPerf}`,
            subhulls: this.subhulls.map((h, i) => ({
                index: i + 1,
                name: h.name,
                tons: h.tons,
                tl: h.tl,
                config: h.config,
                armorType: h.armorType,
                armorLayers: h.armorLayers,
                av: this.getSubhullAV(h)
            })),
            drives: {
                jump: jDrive ? { name: jDrive.driveType, rating: jPerf, tons: jDrive.tons, cost: jDrive.cost, stage: jDrive.stage } : null,
                maneuver: mDrive ? { name: mDrive.driveType, rating: mPerf, tons: mDrive.tons, cost: mDrive.cost, stage: mDrive.stage } : null,
                power: pPlant ? { name: pPlant.driveType, ep: pPerf, tons: pPlant.tons, cost: pPlant.cost, stage: pPlant.stage } : null,
                fuelTons: fuelTons
            },
            accommodations: {
                crewBerths: this.totalCrewBerths,
                crewQuartersTons: this.totalCrewQuartersTons,
                passengerBerths: this.totalPassengerBerths,
                highPaxBerths: this.totalHighPaxBerths,
                midPaxBerths: this.totalMidPaxBerths,
                lowBerths: this.totalLowBerths,
                commonsTons: this.totalCommonsTons,
                cargoTons: this.totalCargoTons
            },
            crew: {
                totalCrew: crewReq.totalCrew,
                totalOfficers: crewReq.totalOfficers,
                totalEnlisted: crewReq.totalEnlisted,
                totalTroops: crewReq.totalTroops
            },
            lifeSupport: {
                daysEndurance: lsStatus.daysEndurance,
                monthsEndurance: lsStatus.monthsEndurance,
                totalPersonDays: lsStatus.totalPersonDays
            }
        };
    }

    getFillform2Data() {
        const weapons = this.weapons;
        const defenses = this.defenses;
        const sensors = this.sensors;
        const consoles = this.consoles;
        const computers = this.computers;

        return {
            page: 2,
            title: "T5 Starship Construction Fillform 2: Armament, Defenses, Sensors & Consoles",
            shipName: this.shipName || "Starship",
            missionCode: this.missionCode,
            hardpoints: {
                max: this.maxHardpoints,
                used: this.hardpointsUsed,
                maxFirmpoints: this.maxFirmpoints,
                firmpointsUsed: this.firmpointsUsed
            },
            weapons: weapons.map(w => ({
                name: w.name,
                mount: w.mountKey || 'Turret',
                count: w.count || 1,
                range: w.rangeKey || 'AR',
                damage: w.damage || '1D',
                tons: w.tons,
                cost: w.cost
            })),
            defenses: defenses.map(d => ({
                name: d.name,
                mount: d.mountKey || 'Surface',
                count: d.count || 1,
                defenseValue: d.defenseValue || '1D',
                tons: d.tons,
                cost: d.cost
            })),
            sensors: sensors.map(s => ({
                name: s.name,
                mount: s.mountKey || 'Surface',
                count: s.count || 1,
                range: s.rangeKey || 'AR',
                tons: s.tons,
                cost: s.cost
            })),
            consoles: {
                totalCount: this.totalConsoleCount,
                totalTons: this.totalConsoleTons,
                totalCP: this.totalControlPanels,
                ergonomics: this.controlErgonomics,
                items: consoles.map(c => ({
                    role: c.roleKey || 'Operator',
                    type: c.typeKey || 'Standard',
                    tons: c.tons,
                    cost: c.cost
                }))
            },
            computers: {
                totalCells: this.totalComputerCells,
                items: computers.map(c => ({
                    model: `Model/${c.model}${c.isBis ? ' bis' : ''}`,
                    cells: c.cells,
                    tons: c.tons,
                    cost: c.cost,
                    isMaster: !!c.isMaster
                }))
            }
        };
    }

    getFillform3Data(staffingModel = 'Merchant', engineerSkill = this.engineerSkill, jumpDriveSpecialty = this.jumpDriveSpecialty) {
        const crewReq = this.getCrewRequirements(staffingModel);
        const quality = this.qualityEvaluations;
        const safeJump = this.safeJumpDistance(engineerSkill, jumpDriveSpecialty);
        const jumpInterference = this.jumpInterference(engineerSkill, jumpDriveSpecialty, null, 0);

        return {
            page: 3,
            title: "T5 Starship Construction Fillform 3: Crew Hierarchy, Livability & Jump Fields",
            shipName: this.shipName || "Starship",
            missionCode: this.missionCode,
            staffingModel: staffingModel,
            crewSummary: {
                totalCrew: crewReq.totalCrew,
                totalOfficers: crewReq.totalOfficers,
                totalEnlisted: crewReq.totalEnlisted,
                totalTroops: crewReq.totalTroops,
                totalStewards: crewReq.totalStewards,
                totalPassengers: crewReq.totalPassengers,
                totalSouls: crewReq.totalSouls
            },
            roster: crewReq.roster,
            quality: quality,
            jumpFields: {
                hasJumpDrive: safeJump.hasJumpDrive,
                jumpField: safeJump.fieldName,
                strength: safeJump.strength,
                efficiencyE: safeJump.E,
                driveStage: safeJump.driveStage,
                engineerRank: safeJump.engineerRank,
                jumpDriveSpecialty: safeJump.jumpDriveSpecialty,
                totalEngineerSkill: safeJump.totalEngineerSkill,
                safeDistanceD: safeJump.D,
                safeDiameters: safeJump.safeDiameters,
                armorMod: safeJump.armorMod,
                flashSize: safeJump.flash,
                interferenceX: jumpInterference.X,
                misjumpRisk: jumpInterference.misjumpRisk,
                safetyMargin: jumpInterference.safetyMargin
            },
            // Legacy alias
            astrogation: {
                jumpField: safeJump.fieldName,
                fieldFactorS: safeJump.strength,
                efficiencyE: safeJump.E,
                skillK: safeJump.totalEngineerSkill,
                safeDistanceD: safeJump.D,
                safeDiameters: safeJump.safeDiameters,
                interferenceX: jumpInterference.X,
                misjumpRisk: jumpInterference.misjumpRisk,
                safetyMargin: jumpInterference.safetyMargin
            }
        };
    }

    exportMarkdownFillform(staffingModel = 'Merchant') {
        const f1 = this.getFillform1Data();
        const f2 = this.getFillform2Data();
        const f3 = this.getFillform3Data(staffingModel);
        const jf = f3.jumpFields;

        return `# TRAVELLER 5 STARSHIP CONSTRUCTION FILLFORMS
**Vessel:** ${f1.shipName} | **Reg:** ${f1.registration} | **Mission:** ${f1.missionCode} (${f1.hullClassification}) | **Base TL:** ${f1.baseTL}

---

## FILLFORM 1: OVERVIEW, HULLS, DRIVES & PERFORMANCE
- **Displacement:** ${f1.tonnage.toLocaleString()} tons
- **Hull Configuration:** ${f1.configuration}
- **Total MCr:** MCr${f1.totalCostMCr}
- **QSP:** \`${f1.qsp}\`

### Subhulls & Armor Structure
| # | Name | Tons | Config | TL | Armor Type | Layers | AV |
|---|---|---|---|---|---|---|---|
${f1.subhulls.map(h => `| ${h.index} | ${h.name} | ${h.tons}t | ${h.config} | TL-${h.tl} | ${h.armorType} | ${h.armorLayers} | AV-${h.av} |`).join('\n')}

### Drive & Power Specifications
- **Jump Drive:** ${f1.drives.jump ? `${f1.drives.jump.name} (J-${f1.drives.jump.rating}, ${f1.drives.jump.tons}t, MCr${f1.drives.jump.cost})` : 'None'}
- **Maneuver Drive:** ${f1.drives.maneuver ? `${f1.drives.maneuver.name} (M-${f1.drives.maneuver.rating}, ${f1.drives.maneuver.tons}t, MCr${f1.drives.maneuver.cost})` : 'None'}
- **Power Plant:** ${f1.drives.power ? `${f1.drives.power.name} (${f1.drives.power.ep} EP, ${f1.drives.power.tons}t, MCr${f1.drives.power.cost})` : 'None'}
- **Fuel Stores:** ${f1.drives.fuelTons} tons

### Accommodations & Cargo
- **Crew Berths:** ${f1.accommodations.crewBerths} berths (${f1.accommodations.crewQuartersTons}t)
- **Passenger Berths:** ${f1.accommodations.passengerBerths} berths (${f1.accommodations.highPaxBerths} High, ${f1.accommodations.midPaxBerths} Mid)
- **Low Berths (Cryo):** ${f1.accommodations.lowBerths} berths
- **Passenger Commons:** ${f1.accommodations.commonsTons} tons
- **Cargo Space:** ${f1.accommodations.cargoTons} tons
- **Life Support Endurance:** ${f1.lifeSupport.daysEndurance} Days (${f1.lifeSupport.monthsEndurance} Months / ${f1.lifeSupport.totalPersonDays} p-days)

---

## FILLFORM 2: ARMAMENT, DEFENSES, SENSORS & CONTROLS
- **Hardpoints Used:** ${f2.hardpoints.used} / ${f2.hardpoints.max}
- **Control Panels (P):** ${f2.consoles.totalCP} CP | **Consoles:** ${f2.consoles.totalCount} (${f2.consoles.totalTons}t, E: ${f2.consoles.ergonomics})
- **Computer Processing:** ${f2.computers.totalCells} Cells (${f2.computers.items.map(c => c.model).join(', ') || 'None'})

### Weapons & Offensive Systems
${f2.weapons.length > 0 ? f2.weapons.map(w => `- **${w.name}** [${w.mount}] Range: ${w.range}, Damage: ${w.damage}, Count: ${w.count} (${w.tons}t, MCr${w.cost})`).join('\n') : '*No offensive weapons installed.*'}

### Defenses & Countermeasures
${f2.defenses.length > 0 ? f2.defenses.map(d => `- **${d.name}** [${d.mount}] Defense: ${d.defenseValue}, Count: ${d.count} (${d.tons}t, MCr${d.cost})`).join('\n') : '*No active defense screens installed.*'}

### Sensor Arrays
${f2.sensors.length > 0 ? f2.sensors.map(s => `- **${s.name}** [${s.mount}] Range: ${s.range}, Count: ${s.count} (${s.tons}t, MCr${s.cost})`).join('\n') : '*Standard bridge sensors only.*'}

---

## FILLFORM 3: CREW HIERARCHY, LIVABILITY & JUMP FIELDS
- **Staffing Model:** ${f3.staffingModel}
- **Total Personnel:** ${f3.crewSummary.totalCrew} Crew (${f3.crewSummary.totalOfficers} Officers, ${f3.crewSummary.totalEnlisted} Enlisted) + ${f3.crewSummary.totalPassengers} Pax = **${f3.crewSummary.totalSouls} Total Souls**

### Department Crew Roster
| Department | Rank | Role / Title | Qty | Skill / Assignment |
|---|---|---|---|---|
${f3.roster.map(r => `| ${r.department} | ${r.rank || '—'} | ${r.role} | ${r.count} | ${r.skill} |`).join('\n')}

### Quality & Livability Evaluations (Section 26)
- **Passenger Demand (D):** D = ${f3.quality.demand >= 0 ? '+' : ''}${f3.quality.demand} (${f3.quality.demandRating}, ${f3.quality.demandModifier})
- **Crew Comfort (C):** C = ${f3.quality.comfort} (${f3.quality.comfortRating}, Tension: ${f3.quality.tensionCheck})
- **Control Ergonomics (E):** E = ${f3.quality.ergonomics} (${f3.quality.ergoRating}, Mishap: ${f3.quality.mishapRisk})
${f3.quality.risks.length > 0 ? `\n**Operational Warnings:**\n${f3.quality.risks.map(r => `- ⚠️ ${r}`).join('\n')}` : '\n*All operational safety metrics nominal.*'}

### Jump Fields (Section 07 / Table 07G)
${jf.hasJumpDrive ? `- **Jump Field Type:** ${jf.jumpField} (Strength: ${jf.strength})
- **Drive Tech Stage:** ${jf.driveStage} (Efficiency E: ${jf.efficiencyE})
- **Engineer Qualifications:** Engineer Rank ${jf.engineerRank} + Jump Drives Specialty Rank ${jf.jumpDriveSpecialty} = **Skill ${jf.totalEngineerSkill}**
- **Safe Jump Distance (D):** D = ${jf.safeDistanceD} (${jf.safeDiameters} Planetary Diameters)
- **Armor Modifier:** ${jf.armorMod} | **Flash Size:** ${jf.flashSize}
- **Jump Initiation Interference (X):** X = ${jf.interferenceX} (${jf.misjumpRisk})` : '*No Jump, Hop, or Skip Drive installed on this vessel.*'}
`;
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