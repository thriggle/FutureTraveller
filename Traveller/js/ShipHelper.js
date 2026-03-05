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
export const ENUM_HULL_ARMOR = {
    Plate: { type: "Plate", AV_Mult: 1, ton_Mult: 1, AV_FlatBonus: 0, configurations: ["Cluster", "Braced", "Unstreamlined", "Streamlined"] },
    Charged: { type: "Charged", AV_Mult: 2, ton_Mult: 1, AV_FlatBonus: 0, configurations: ["Cluster", "Braced", "Unstreamlined", "Streamlined"] },
    Shell: { type: "Shell", AV_Mult: 0.5, ton_Mult: 0.5, AV_FlatBonus: 0, configurations: ["Streamlined", "Airframe", "Lifting Body"] },
    Polymer: { type: "Polymer", AV_Mult: 0.5, ton_Mult: 1, AV_FlatBonus: 0, configurations: ["Cluster", "Braced", "Unstreamlined", "Streamlined", "Airframe"] },
    Organic: { type: "Organic", AV_Mult: 0.5, ton_Mult: 1, AV_FlatBonus: 0, configurations: ["Cluster", "Braced", "Unstreamlined", "Streamlined", "Airframe"] },
    FeN: { type: "FeN", AV_Mult: 0, ton_Mult: 1, AV_FlatBonus: 20, configurations: ["Planetoid", "Unstreamlined"] }
};
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
        // Flatten all components from all subhulls into a single array for overall iteration
        return this.subhulls.flatMap(h => h.components);
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
            components: []
        };

        this.subhulls.push(newHull);
        const newHullIndex = this.subhulls.length - 1;

        // Auto-link Grapples if connecting to an existing ship
        if (this.subhulls.length > 1 && this.selectedSubhullIndex >= 0) {
            const oldHull = this.subhulls[this.selectedSubhullIndex];
            const smallerTons = Math.min(newHull.tons, oldHull.tons);
            const numGrapples = Math.max(1, Math.floor(smallerTons / 35));

            for (let i = 0; i < numGrapples; i++) {
                const grappleCompNew = { isGeneric: true, name: 'Grapple', tons: 1, cost: 0, label: `To Hull ${this.selectedSubhullIndex + 1}` };
                const grappleCompOld = { isGeneric: true, name: 'Grapple', tons: 1, cost: 0, label: `To Hull ${newHullIndex + 1}` };

                newHull.components.push(grappleCompNew);
                oldHull.components.push(grappleCompOld);
            }
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
        }
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

    // Proxy methods for components
    addDrive(drive) {
        if (this.selectedSubhullIndex >= 0 && this.selectedSubhullIndex < this.subhulls.length) {
            this.subhulls[this.selectedSubhullIndex].components.push(drive);
        } else {
            throw new Error("No Subhull or Pod selected to attach component.");
        }
    }

    addComponent(component) {
        this.addDrive(component);
    }

    getComponentByIdx(globalIndex) {
        let count = 0;
        for (let h = 0; h < this.subhulls.length; h++) {
            for (let c = 0; c < this.subhulls[h].components.length; c++) {
                if (count === globalIndex) {
                    return { hullIndex: h, compIndex: c, component: this.subhulls[h].components[c] };
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

    removeDriveAtIndex(globalIndex) {
        const target = this.getComponentByIdx(globalIndex);
        if (!target) return;

        const hull = this.subhulls[target.hullIndex];
        const drivesToRemove = new Set([target.compIndex]);

        // Find components explicitly linked to the one we're removing (within the same hull)
        hull.components.forEach((d, i) => {
            if (d.linkedDriveIndex === target.compIndex) {
                // Warning: Linked indices might break if referring to global drives array.
                // Assuming links are localized for now or will be refactored to unique IDs.
                drivesToRemove.add(i);
            }
        });

        // Rebuild the array and map old indices to new indices
        const newDrives = [];
        const indexMap = new Map(); // oldIndex -> newIndex

        hull.components.forEach((d, oldIndex) => {
            if (!drivesToRemove.has(oldIndex)) {
                indexMap.set(oldIndex, newDrives.length);
                newDrives.push(d);
            }
        });

        // Update the linkedDriveIndex for remaining components
        newDrives.forEach(d => {
            if (d.linkedDriveIndex !== undefined) {
                if (indexMap.has(d.linkedDriveIndex)) {
                    d.linkedDriveIndex = indexMap.get(d.linkedDriveIndex);
                } else {
                    // The linked drive was removed
                    delete d.linkedDriveIndex;
                }
            }
        });

        hull.components = newDrives;
    }

    removeComponentAtIndex(index) {
        this.removeDriveAtIndex(index);
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