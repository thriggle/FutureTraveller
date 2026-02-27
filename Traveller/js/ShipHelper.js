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
    static get Cluster() { return { type: "Cluster", friction: 2, agility: -5, accel: 0, maxG: 1, stability: -3, land: false, cost: 2 / 100, flatcost: 0 } }
    static get Braced() { return { type: "Braced", friction: 2, agility: -4, accel: 0, maxG: 3, stability: -2, land: false, cost: 3 / 100, flatcost: 0 } }
    static get Planetoid() { return { type: "Planetoid", friction: 1, agility: -2, accel: 0, maxG: 9, stability: -1, land: false, cost: 1 / 100, flatcost: 0 } }
    static get Unstreamlined() { return { type: "Unstreamlined", friction: 0.5, agility: -1, accel: 0, maxG: 9, stability: 0, land: true, cost: 3 / 100, flatcost: 5 } }
    static get Streamlined() { return { type: "Streamlined", friction: 1 / 3, agility: 0, accel: 0, maxG: 9, stability: 1, land: true, cost: 6 / 100, flatcost: 2 } }
    static get Airframe() { return { type: "Airframe", friction: 0.25, agility: 1, accel: 1, maxG: 9, stability: 2, land: true, cost: 7 / 100, flatcost: 2 } }
    static get LiftingBody() { return { type: "Lifting Body", friction: 0.2, agility: 1, accel: 1, maxG: 9, stability: 3, land: true, cost: 12 / 100, flatcost: 4 } }
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
                var text = desc + ": max " + tech + "-" + p + " (" + (effectivePotential) + ")";
                var component = {
                    name: text,
                    stage: stage.desc,
                    eff: stage.eff * p,
                    fuel: stage.fuel,
                    tons: stage.tons,
                    cost: stage.cost
                }

                if (p === evalFunction(tl - 2) && p === evalFunction(tl)) {
                    if (mod === 0 || mod === 1) {
                        exclude = true;
                    } else if (mod === 2) {

                        exclude = false;
                    }
                } else if (p === evalFunction(tl - 1) && p === evalFunction(tl)) {
                    if (mod === 0) {
                        exclude = true;
                    } else if (mod === 1) {

                        exclude = false;
                    }
                } else if (mod === 0) {

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
export function buildDrive(stage, nexus = 1, driveClass, driveType, tl) {
    /**
     * @param {string} stage - Tech stage
     * @param {number} nexus - Nexus multiplier
     * @param {string} driveClass - Drive class (A, B, C, etc.)
     * @param {string} driveType - Drive type (Jump, M-Drive, etc.)
     * @param {number} tl - Tech level
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
            case ENUM_DRIVE_TYPE.Collector:
                minTonnage = 20;
                baseTonnage = ((ENUM_DRIVE_CLASS[driveClass].ep / 100) * 10) + 10;
                baseCost = 0.5 * baseTonnage;
                break;
        }
        tons = Math.max(minTonnage, ENUM_DRIVE_STAGE[stage].tons * baseTonnage) * nexus;
        cost = baseCost * nexus * ENUM_DRIVE_STAGE[stage].cost;


    }
    var drive = {
        ep: ep,
        tons: tons,
        cost: cost,
        stage: stage,
        driveClass: (nexus > 1 ? `${driveClass}${nexus}` : driveClass),
        driveType: driveType,
        tl: tl,
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
            fuelConsumption = potential * shipTonnage / 100 * ENUM_DRIVE_STAGE[drive.stage].fuel;
            note = fuelConsumption.toString() + " tons per month";
            minConsumption = fuelConsumption;
            minNote = note;
            break;
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
    if (potential < 1) {
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
    constructor(baseTL = 12, tonnage = 100, configuration = ENUM_HULL_TYPE.Unstreamlined) {
        this.drives = [];
        this.baseTL = baseTL; // Base Tech Level
        this.tonnage = tonnage;
        this.configurationType = configuration;
        this.configuration = ENUM_HULL_CONFIG[configuration];
        this.baseCost = this.tonnage * this.configuration.cost + this.configuration.flatcost;
    }
    setBaseTL(tl) {
        this.baseTL = tl;
    }
    setTonnage(tonnage) {
        this.tonnage = tonnage;
        this.baseCost = this.tonnage * this.configuration.cost + this.configuration.flatcost;
    }
    setConfiguration(configuration) {
        this.configurationType = configuration;
        this.configuration = ENUM_HULL_CONFIG[configuration];
        this.baseCost = this.tonnage * this.configuration.cost + this.configuration.flatcost;
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