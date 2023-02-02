var MathRandom = pseudoRandomNumberGenerator((Math.random() * 1000000).toString());
function pseudoRandomNumberGenerator(word) {
    var seed = xmur3(word);
    var a = seed(), b = seed(), c = seed(), d = seed();
    return xoshiro128ss(a, b, c, d);
}
function xmur3(str) {
    for (var i = 0, h = 1779033703 ^ str.length; i < str.length; i++) {
        h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
        h = h << 13 | h >>> 19;
    } return function () {
        h = Math.imul(h ^ (h >>> 16), 2246822507);
        h = Math.imul(h ^ (h >>> 13), 3266489909);
        return (h ^= h >>> 16) >>> 0;
    }
}
function xoshiro128ss(a, b, c, d) {
    return function () {
        var t = b << 9, r = a * 5; r = (r << 7 | r >>> 25) * 9;
        c ^= a; d ^= b;
        b ^= c; a ^= d; c ^= t;
        d = d << 11 | d >>> 21;
        return (r >>> 0) / 4294967296;
    }
}
function ext(num) {
    if (num <= 17) {
        return num.toString(36).toUpperCase();
    } else {
        if (num <= 22) {
            return (num + 1).toString(36).toUpperCase();
        } else {
            return (num + 2).toString(36).toUpperCase();
        }
    }
}
function revExt(str) {
    var num = parseInt(str, 36);
    if (str.toUpperCase() >= "I") { num += 1; }
    if (str.toUpperCase() >= "O") { num += 1; }
    return num;
}
function isValidStellarNumbers(type, decimal, size, allowwhitedwarf) {
    if (!allowwhitedwarf && size === 5) {
        return false;
    }
    var isOk = true;
    if ((((type === 1 || type === 2) && (decimal >= 5 && decimal <= 9)) ||
        (type === 3 || type === 4))
        && (size === 3)) {
        isOk = false;
    } else if (
        ((type === -3 || type === -2) && decimal <= 4) && (size === 4 || size >= 6)
    ) {
        isOk = false;
    }
    return isOk;
}
function updateTradeCodes(system, rules) {
    var tradecodes = [], starport = system.starport, bases = system.bases, popdigit = system.mainworld.popdigit, size = system.size, atmo = system.atmo, hydro = system.hydro, pop = system.pop, gov = system.gov, law = system.law, tech = system.tech;
    var uwp = starport + ext(size) + ext(atmo) + ext(hydro) + ext(pop) + ext(gov) + ext(law) + "-" + ext(tech);
    system.mainworld.uwp = uwp;
    var difference = system.stars.primary.HZOrbit - system.mainworld.orbit;
    if (difference >= 2) {
        tradecodes.push("Tr");
    } else if (difference === 1) {
        if (size >= 6 && size <= 9 && atmo >= 4 && atmo <= 9 && hydro >= 3 && hydro <= 7) {
            tradecodes.push("Tr");
        } else {
            tradecodes.push("Ho");
        }
    } else if (difference === 0) {

    } else if (difference === -1) {
        if (size >= 6 && size <= 9 && atmo >= 4 && atmo <= 9 && hydro >= 3 && hydro <= 7) {
            tradecodes.push("Tu");
        } else {
            tradecodes.push("Co");
        }
    } else if (difference <= -2) {
        //if(size >= 2 && size <= 9 && hydro > 0){
        tradecodes.push("Fr");
        //}
    }
    if (system.mainworld.orbit <= 1) { tradecodes.push("Tz"); }

    // trade codes
    if (size === 0 && atmo === 0 && hydro === 0) { tradecodes.push("As"); }
    if (atmo >= 2 && atmo <= 9 && hydro === 0) { tradecodes.push("De"); }
    if (atmo >= 10 && atmo <= 12 && hydro >= 1) { tradecodes.push("Fl"); }
    if (size >= 6 && size <= 8 &&
        (atmo === 5 || atmo === 6 || atmo === 8) &&
        (hydro >= 5 && hydro <= 7)
    ) {
        tradecodes.push("Ga");
    }
    if (size >= 3 &&
        (atmo === 2 || atmo === 4 || atmo === 7 || atmo === 9 || atmo === 10 || atmo === 11 || atmo === 12) &&
        (hydro <= 2)
    ) {
        tradecodes.push("He");
    }
    if (atmo <= 1 && hydro >= 1) { tradecodes.push("Ic"); }
    if (size >= 10 && hydro === 10 && (
        (atmo >= 3 && atmo <= 9) || (atmo >= 13)
    )) { tradecodes.push("Oc"); }
    if (size <= 9 && hydro === 10 && (
        (atmo >= 3 && atmo <= 9) || (atmo >= 13)
    )) { tradecodes.push("Wa"); }
    if (atmo === 0) { tradecodes.push("Va"); }

    if (pop === 0) {

        if (tech > 0) { tradecodes.push("Di"); }
        else { tradecodes.push("Ba"); }
    }
    else if (pop <= 3) {
        tradecodes.push("Lo");
    } else if (pop <= 6) {
        tradecodes.push("Ni");
    } else if (pop === 8) {
        tradecodes.push("Ph");
    } else if (pop >= 9) {
        tradecodes.push("Hi");
    }
    if (atmo >= 4 && atmo <= 9 && hydro >= 4 && hydro <= 8 && (pop === 4 || pop === 8)) { tradecodes.push("Pa"); }
    if (atmo >= 4 && atmo <= 9 && hydro >= 4 && hydro <= 8 && (pop >= 5 && pop <= 7)) { tradecodes.push("Ag"); }
    if (atmo <= 3 && hydro <= 3 && pop >= 6) { tradecodes.push("Na"); }
    if (gov === 6) { // captive gov

        if ((atmo === 2 || atmo === 3 || atmo === 10 || atmo === 11) &&
            hydro <= 5 && pop >= 3 && pop <= 6 && law >= 6 && law <= 9 && gov === 6
        ) {
            tradecodes.push("Px");
        } else if (pop <= 4 && (law == 0 || law == 4 || law == 5)) {
            tradecodes.push("Re");
        }

    }
    if ((atmo <= 2 || atmo === 4 || atmo === 7 || atmo === 9) && (pop === 7 || pop === 8)) { tradecodes.push("Pi"); }
    if ((atmo <= 2 || atmo === 4 || atmo === 7 || atmo === 9 || atmo === 10 || atmo === 11 || atmo === 12)
        && (pop >= 9)) {
            tradecodes.push("In");
    }
    if (atmo >= 2 && atmo <= 5 && hydro <= 3) {
        tradecodes.push("Po");
    }
    if (atmo === 6 || atmo === 8) {
        if (pop === 5 || pop === 9) { tradecodes.push("Pr"); }
        else if (pop >= 6 && pop <= 8) { tradecodes.push("Ri"); }
    }
    if (pop >= 5 && pop <= 10 && gov === 6 && law <= 3) { tradecodes.push("Cy"); }


    var importance = 0, importanceDesc = "", dailyships = "0", weeklyships = "0";
    if (starport === "A" || starport === "B") { importance += 1; }
    else if (starport === "D" || starport === "E" || starport === "X") { importance -= 1; }
    if (tech >= 16) { importance += 1; }
    if (tech >= 10) { importance += 1; }
    if (tech <= 8) { importance -= 1; }
    if (tradecodes.indexOf("Ag") >= 0) { importance += 1; }
    if (tradecodes.indexOf("Hi") >= 0) { importance += 1; }
    if (tradecodes.indexOf("In") >= 0) { importance += 1; }
    if (tradecodes.indexOf("Ri") >= 0) { importance += 1; }
    if (pop <= 6) { importance -= 1; }
    if (bases.indexOf("Naval") >= 0 && bases.indexOf("Scout") >= 0) { importance += 1; }
    if (bases.indexOf("Way Station") >= 0 || bases.indexOf("Naval Depot") >= 0) { importance += 1; }
    var isImportant = importance >= 4;
    if (importance <= -2) { importanceDesc = "Very Unimportant"; }
    else if (importance <= 0) { importanceDesc = "Unimportant"; dailyships = "1"; weeklyships = importance === 0 ? "2" : "1"; }
    else if (importance <= 3) {
        importanceDesc = "Ordinary";
        if (importance === 1) { dailyships = "1-2"; weeklyships = "10"; }
        else if (importance === 2) { dailyships = "2-4"; weeklyships = "20"; }
        else if (importance === 3) { dailyships = "3-6"; weeklyships = "30"; }
    }
    else if (importance <= 4) { importanceDesc = "Important"; dailyships = "15-20"; weeklyships = "100"; }
    else if (importance >= 5) { importanceDesc = "Very Important"; dailyships = "100"; weeklyships = "1000"; }
    var isUnimportant = importance <= 0;
    var economics = { resources: 0, infrastructure: 0, labor: 0, efficiency: 0 };
    economics.resources = d6(2) + (tech >= 8 ? system.gg + system.planetoidBelts : 0);
    economics.labor = Math.max(0, pop - 1);
    if (pop === 0) {
        economics.infrastructure = 0;
    } else if (pop <= 3) {
        economics.infrastructure = Math.max(0, importance);
    } else if (pop <= 6) {
        economics.infrastructure = Math.max(0, d6() + importance);
    } else {
        economics.infrastructure = Math.max(0, d6(2) + importance);
    }
    economics.efficiency = d6() - d6();
    economics.extension = "" + ext(economics.resources) + ext(economics.labor) + ext(economics.infrastructure) + (economics.efficiency >= 0 ? "+" : "") + (economics.efficiency == 0 ? 1 : economics.efficiency);
    economics.RU = Math.max(1, economics.resources) * Math.max(1, economics.labor) * Math.max(1, economics.infrastructure) * (economics.efficiency === 0 ? 1 : economics.efficiency);
    system.economics = economics;
    var cultural = {};
    if (pop === 0) {
        cultural = { heterogeneity: 0, acceptance: 0, strangeness: 0, symbols: 0, extension: "0000" }
    } else {
        cultural.heterogeneity = Math.max(1, pop + d6() - d6());
        cultural.acceptance = Math.max(1, importance + pop);
        cultural.strangeness = Math.max(1, d6() - d6() + 5);
        cultural.symbols = Math.max(1, d6() - d6() + tech);
        cultural.extension = ext(cultural.heterogeneity) + ext(cultural.acceptance) + ext(cultural.strangeness) + ext(cultural.symbols);
    }
    tradecodes.sort();
    uwp = starport + ext(size) + ext(atmo) + ext(hydro) + ext(pop) + ext(gov) + ext(law) + "-" + ext(tech);
    if (typeof rules === "undefined" || rules === "T5") {
        var highport = false;
        if (starport === "A" && pop >= 7) { highport = true; }
        else if (starport === "B" && pop >= 8) { highport = true; }
        else if (starport === "C" && pop >= 9) { highport = true; }
        system.mainworld.highport = highport;
    }
    var roughpop = popdigit * Math.pow(10, pop);
    system.mainworld.roughpop = roughpop;
    system.mainworld.cultural = cultural;
    system.mainworld.isAsteroidBelt = size === 0;

    if (system.mainworld.worldtype === "Far Satellite") { tradecodes.push("Sa"); }
    else if (system.mainworld.worldtype === "Close Satellite") { tradecodes.push("Lk"); }
    var totalpops = getTotalPop(system.stars.primary);
    var totalpop = 0;
    for (var i = 0, len = totalpops.length; i < len; i++) {
        totalpop += totalpops[i] * Math.pow(10, i);
    }
    // nobility
    var nobility = ["B"];
    if (tradecodes.indexOf("Pa") >= 0 || tradecodes.indexOf("Pr") >= 0) { nobility.push("c"); }
    if (tradecodes.indexOf("Ag") >= 0 || tradecodes.indexOf("Ri") >= 0) { nobility.push("C"); }
    if (tradecodes.indexOf("Pi") >= 0) { nobility.push("D"); }
    if (tradecodes.indexOf("Ph") >= 0) { nobility.push("e"); }
    if (tradecodes.indexOf("In") >= 0 || tradecodes.indexOf("Hi") >= 0) { nobility.push("E"); }
    if (isImportant) { nobility.push("f"); }
    system.mainworld.tradecodes = tradecodes;
    system.importance = { weeklytraffic: weeklyships, dailytraffic: dailyships, isImportant: isImportant, isUnimportant: isUnimportant, extension: importance, description: importanceDesc };
    return system;
}
function generateSystemDetails(name, gasGiantFrequency, permitDieback, maxTechLevel, diebackPenalty, ruleset, allowNonMWPops, applyHillSphereLimit, allowInnerWhiteDwarfs, predefinedUWP) {
    if (typeof ruleset === "undefined") { ruleset = "T5"; }
    if (typeof diebackPenalty === "undefined") { diebackPenalty = 2; }
    if (typeof allowNonMWPops === "undefined") { allowNonMWPops = true; }
    if (typeof applyHillSphereLimit === "undefined") { applyHillSphereLimit = true; }
    if (typeof allowInnerWhiteDwarfs === "undefined") { allowInnerWhiteDwarfs = true; }
    if (typeof predefinedUWP === "undefined") { predefinedUWP = false; }
    var planetoidBelts = Math.max(d6() - 3, 0);
    var gg = d6(2) <= gasGiantFrequency ? Math.max(((d6(2) / 2) >> 0) - 2, 1) : 0;
    var roll;
    var uwp = predefinedUWP ? predefinedUWP : "", popdigit = 0, totalpop = 0;
    console.log(uwp);
    var tradecodes = [];
    var stars = { primary: {}, primary_companion: false, close: false, near: false, near_companion: false, close_companion: false, far: false, far_companion: false };
    var primaryType = d6() - d6(),
        primaryDecimal = d09(),
        primarySize = d6() - d6();

    var hasPrimaryCompanion = d6() - d6() >= 3;
    var hasCloseStar = d6() - d6() >= 3;
    var hasCloseCompanion = hasCloseStar ? d6() - d6() >= 3 : false;
    var hasNearStar = d6() - d6() >= 3;
    var hasNearCompanion = hasNearStar ? d6() - d6() >= 3 : false;
    var hasFarStar = d6() - d6() >= 3;
    var hasFarCompanion = hasFarStar ? d6() - d6() >= 3 : false;
    while (!isValidStellarNumbers(primaryType, primaryDecimal, primarySize, allowInnerWhiteDwarfs || !(hasPrimaryCompanion || hasCloseStar || hasCloseCompanion || hasNearStar || hasNearCompanion || hasFarStar || hasFarCompanion))) {
        primaryType = d6() - d6();
        primaryDecimal = d09();
        primarySize = d6() - d6();
    }
    if (primarySize === 5) {
        var isOk = false;
        while (!isOk) {
            primaryType = d6() - d6();
            primaryDecimal = d09();
            primarySize = d6() - d6();
            isOk = isValidStellarNumbers(primaryType, primaryDecimal, primarySize, allowInnerWhiteDwarfs || !(hasPrimaryCompanion || hasCloseStar || hasCloseCompanion || hasNearStar || hasNearCompanion || hasFarStar || hasFarCompanion))
        }
    }
    stars.primary = getStar(primaryType, primaryDecimal, primarySize, 20);
    stars.primary.worldtype = "primary star";

    var primarySurface = getInnermostOrbit(stars.primary);
    var secondaryOrbitDeduction = 2;
    if (primarySurface > -1) {
        secondaryOrbitDeduction += primarySurface;
    }

    var newSize, newType, newDecimal;
    if (hasPrimaryCompanion) {
        newSize = primarySize + d6() + 2;
        newDecimal = d09();
        newType = primaryType + d6() - 1;
        while (!isValidStellarNumbers(newType, newDecimal, newSize, allowInnerWhiteDwarfs || !(hasCloseStar || hasCloseCompanion || hasNearStar || hasNearCompanion || hasFarStar || hasFarCompanion))) {
            newSize = primarySize + d6() + 2;
            newDecimal = d09();
            newType = primaryType + d6() - 1;
        }
        stars.primary_companion = getStar(newType, newDecimal, newSize, 0);
        var starOrbit = 0;
        //stars.primary_companion.numOrbits = 0;
        if (primarySurface > -1) {
            stars.primary_companion.worldtype = "companion star";
            stars.primary.satellites[primarySurface] = stars.primary_companion; //{worldtype:"companion star", details:stars.primary_companion};
            starOrbit = primarySurface;
        }
        let starOrbitDetails = createOrbitDetails(starOrbit);
        stars.primary_companion.decimalOrbit = starOrbitDetails.decimalOrbit;
        stars.primary_companion.au = starOrbitDetails.au;
    }
    if (hasCloseStar) {
        var closeOrbit = d6() - 1
        newSize = primarySize + d6() + 2;
        newDecimal = d09();
        newType = primaryType + d6() - 1;
        while (!isValidStellarNumbers(newType, newDecimal, newSize, allowInnerWhiteDwarfs || !(hasCloseCompanion || hasNearStar || hasNearCompanion || hasFarStar || hasFarCompanion))) {
            newSize = primarySize + d6() + 2;
            newDecimal = d09();
            newType = primaryType + d6() - 1;
        }
        stars.close = getStar(newType, newDecimal, newSize, closeOrbit > secondaryOrbitDeduction + 1 ? closeOrbit - secondaryOrbitDeduction : 0);
        stars.close.orbit = closeOrbit;

        if (hasCloseCompanion) {
            newSize = primarySize + d6() + 2;
            newDecimal = d09();
            newType = primaryType + d6() - 1;
            while (!isValidStellarNumbers(newType, newDecimal, newSize, allowInnerWhiteDwarfs || !(hasNearStar || hasNearCompanion || hasFarStar || hasFarCompanion))) {
                newSize = primarySize + d6() + 2;
                newDecimal = d09();
                newType = primaryType + d6() - 1;
            }
            stars.close_companion = getStar(newType, newDecimal, newSize, 0);
            let inner = getInnermostOrbit(stars.close);
            if (inner > -1) {
                stars.close_companion.worldtype = "close companion star";
                let closeCompanionDetails = createOrbitDetails(inner);
                stars.close_companion.decimalOrbit = closeCompanionDetails.decimalOrbit;
                stars.close_companion.au = closeCompanionDetails.au;
                stars.close.satellites[inner] = stars.close_companion; //{worldtype:"close companion star",details:stars.close_companion};
            }

        }
        stars.close.worldtype = "close star";
        if (typeof stars.primary.satellites[closeOrbit] === "undefined") {
            stars.primary.satellites[closeOrbit] = stars.close;
            let starOrbitDetails = createOrbitDetails(closeOrbit);
            stars.close.decimalOrbit = starOrbitDetails.decimalOrbit;
            stars.close.au = starOrbitDetails.au;
        } else {
            var amp = 1;
            while (typeof stars.primary.satellites[closeOrbit + amp] !== "undefined") {
                amp++;
            }
            stars.close.orbit = closeOrbit + amp;
            let starOrbitDetails = createOrbitDetails(closeOrbit + amp);
            stars.close.decimalOrbit = starOrbitDetails.decimalOrbit;
            stars.close.au = starOrbitDetails.au;
            stars.primary.satellites[stars.close.orbit + amp] = stars.close;
        }
    }
    if (hasNearStar) {
        var nearOrbit = 5 + d6();
        newSize = primarySize + d6() + 2;
        newDecimal = d09();
        newType = primaryType + d6() - 1;
        while (!isValidStellarNumbers(newType, newDecimal, newSize, allowInnerWhiteDwarfs || !(hasNearCompanion || hasFarStar || hasFarCompanion))) {
            newSize = primarySize + d6() + 2;
            newDecimal = d09();
            newType = primaryType + d6() - 1;
        }
        stars.near = getStar(newType, newDecimal, newSize, nearOrbit - secondaryOrbitDeduction);
        stars.near.orbit = nearOrbit;
        //stars.near.numOrbits = stars.near.orbit - 2;
        //stars.near.satellites = new Array(stars.near.numOrbits);
        if (hasNearCompanion) {
            newSize = primarySize + d6() + 2;
            newDecimal = d09();
            newType = primaryType + d6() - 1;
            while (!isValidStellarNumbers(newType, newDecimal, newSize, allowInnerWhiteDwarfs || !(hasFarStar || hasFarCompanion))) {
                newSize = primarySize + d6() + 2;
                newDecimal = d09();
                newType = primaryType + d6() - 1;
            }
            stars.near_companion = getStar(newType, newDecimal, newSize, 0);
            //stars.near_companion.numOrbits = 0;
            let inner = getInnermostOrbit(stars.near);
            if (inner > -1) {
                let nearCompanionDetails = createOrbitDetails(inner);
                stars.near_companion.decimalOrbit = nearCompanionDetails.decimalOrbit;
                stars.near_companion.au = nearCompanionDetails.au;
                stars.near_companion.worldtype = "near companion star";
                stars.near.satellites[inner] = stars.near_companion; //{worldtype:"near companion star", details:stars.near_companion};
            }
        }
        stars.near.worldtype = "near star";
        if (typeof stars.primary.satellites[nearOrbit] === "undefined") {
            stars.primary.satellites[nearOrbit] = stars.near;
            let starOrbitDetails = createOrbitDetails(nearOrbit);
            stars.near.decimalOrbit = starOrbitDetails.decimalOrbit;
            stars.near.au = starOrbitDetails.au;
        } else {
            var amp = 1;
            while (typeof stars.primary.satellites[nearOrbit + amp] !== "undefined") {
                amp++;
            }
            stars.near.orbit = nearOrbit + amp;
            let starOrbitDetails = createOrbitDetails(nearOrbit + amp);
            stars.near.decimalOrbit = starOrbitDetails.decimalOrbit;
            stars.near.au = starOrbitDetails.au;
            stars.primary.satellites[stars.near.orbit + amp] = stars.near;
        }
    }
    if (hasFarStar) {
        var farOrbit = 11 + d6();
        newSize = primarySize + d6() + 2;
        newDecimal = d09();
        newType = primaryType + d6() - 1;
        while (!isValidStellarNumbers(newType, newDecimal, newSize, allowInnerWhiteDwarfs || !(hasFarCompanion))) {
            newSize = primarySize + d6() + 2;
            newDecimal = d09();
            newType = primaryType + d6() - 1;
        }
        stars.far = getStar(newType, newDecimal, newSize, farOrbit - secondaryOrbitDeduction);
        stars.far.orbit = farOrbit;
        //stars.far.numOrbits = stars.far.orbit - 2;
        //stars.far.satellites = new Array(stars.far.numOrbits);
        if (hasFarCompanion) {
            newSize = primarySize + d6() + 2;
            newDecimal = d09();
            newType = primaryType + d6() - 1;
            while (!isValidStellarNumbers(newType, newDecimal, newSize, true)) {
                newSize = primarySize + d6() + 2;
                newDecimal = d09();
                newType = primaryType + d6() - 1;
            }
            stars.far_companion = getStar(newType, newDecimal, newSize, 0);
            //stars.far_companion.numOrbits = 0;
            let inner = getInnermostOrbit(stars.far);
            if (inner > -1) {
                let farCompanionDetails = createOrbitDetails(inner);
                stars.far_companion.decimalOrbit = farCompanionDetails.decimalOrbit;
                stars.far_companion.au = farCompanionDetails.au;
                stars.far_companion.worldtype = "far companion star";
                stars.far.satellites[inner] = stars.far_companion;
            }
        }
        stars.far.worldtype = "far star";
        if (typeof stars.primary.satellites[farOrbit] === "undefined") {
            let starOrbitDetails = createOrbitDetails(farOrbit);
            stars.far.decimalOrbit = starOrbitDetails.decimalOrbit;
            stars.far.au = starOrbitDetails.au;
            stars.primary.satellites[farOrbit] = stars.far;
        } else {
            var amp = 1;
            while (typeof stars.primary.satellites[farOrbit + amp] !== "undefined") {
                amp++;
            }
            stars.far.orbit = farOrbit + amp;
            let starOrbitDetails = createOrbitDetails(farOrbit + amp);
            stars.far.decimalOrbit = starOrbitDetails.decimalOrbit;
            stars.far.au = starOrbitDetails.au;
            stars.primary.satellites[stars.far.orbit + amp] = stars.far;
        }
    }


    roll = d6() - d6(); // roll for mainworld orbit

    var MWOrbit = stars.primary.HZOrbit; var climate = "";
    if (stars.primary.type === "M") { roll += 2; }
    else if (stars.primary.type === "O" || stars.primary.type === "B") { roll -= 2; }
    if (roll <= -6) {
        MWOrbit -= 2;
    }
    else if (roll <= -3) {
        MWOrbit -= 1;
    }
    else if (roll <= 2) { MWOrbit = stars.primary.HZOrbit; }
    else if (roll <= 5) {
        MWOrbit += 1;
    }
    else if (roll >= 6) {
        MWOrbit += 2;
    }
    if (size === 0) { // asteroid belt placement is independent of HZ
        roll = d6(2) - 3;
        MWOrbit = stars.primary.HZOrbit + roll;
    }
    if (MWOrbit < 0) { MWOrbit = 0; }
    var validOrbit = false;
    if (typeof stars.primary.satellites[MWOrbit] !== "undefined") { // check if desired orbit already occupied (by a star)
        while (!validOrbit) { // mainworld will be placed in next available orbit
            MWOrbit += 1;
            validOrbit = typeof stars.primary.satellites[MWOrbit] === "undefined";

        }
    }
    var highport = false;
    var bases = [];
    var basesPopulated = false;
    var starport, size, atmo, hydro, pop, gov, law, tech, pop2;
    if (ruleset !== "T5" && predefinedUWP == false) {
        switch (ruleset) {
            case "CE":
                var CESystem = getCepheusEngineUWP(stars.primary.HZOrbit - MWOrbit, maxTechLevel);
                predefinedUWP = CESystem.uwp;
                bases = CESystem.bases; basesPopulated = true;
                pop2 = revExt(predefinedUWP[4]);
                break;
            case "MgT2":
                var MongooseSystem = getMgT2UWP(stars.primary.HZOrbit - MWOrbit, maxTechLevel);
                predefinedUWP = MongooseSystem.uwp;
                pop2 = revExt(predefinedUWP[4]);
                bases = MongooseSystem.bases; basesPopulated=true;
                climate = MongooseSystem.temp;
                highPort = MongooseSystem.hasHighPort;
                break;
            default: console.log("Unrecognized ruleset code: " + ruleset); break;
        }
    }

    if (typeof predefinedUWP !== "undefined" && predefinedUWP !== false && predefinedUWP.length >= 9) {
        starport = predefinedUWP[0];
        size = revExt(predefinedUWP[1]);
        atmo = revExt(predefinedUWP[2]);
        hydro = revExt(predefinedUWP[3]);
        pop = revExt(predefinedUWP[4]);
        pop2 = pop;
        gov = revExt(predefinedUWP[5]);
        law = revExt(predefinedUWP[6]);

        tech = predefinedUWP.length > 9 ? Number(predefinedUWP[8] + predefinedUWP[9]) : revExt(predefinedUWP[8]);
        if(pop !== 0 && popdigit === 0){
            popdigit = d19();
        }
        if (!basesPopulated) {
            if (ruleset === "T5") {
                switch (starport) {
                    case "A":
                        if (d6(2) <= 6) { bases.push("Naval"); };
                        if (d6(2) <= 4) { bases.push("Scout"); }
                        break;
                    case "B":
                        if (d6(2) <= 5) { bases.push("Naval"); }
                        if (d6(2) <= 5) { bases.push("Scout"); }
                        break;
                    case "C":
                        if (d6(2) <= 6) { bases.push("Scout"); }
                        break;
                    case "D":
                        if (d6(2) <= 7) { bases.push("Scout"); }
                        break;
                    case "E":
                        break;
                    case "X":
                        break;
                    default: console.log("Invalid starport in UWP: " + starport); break;
                }
            } else if (ruleset === "CE") {
                if (starport === "X") {
                    if (d6(2) === 12) {
                        bases.push("Pirate");
                    }
                } else if (starport === "E") {
                    if (d6(2) === 12) {
                        bases.push("Pirate");
                    }
                } else if (starport === "D") {
                    if (d6(2) >= 7) {
                        bases.push("Scout");
                    }
                    if (d6(2) === 12) {
                        bases.push("Pirate");
                    }

                } else if (starport === "C") {
                    if (d6(2) === 12) {
                        bases.push("Pirate");
                    }
                    if (d6(2) >= 8) {
                        bases.push("Scout");
                    }
                } else if (starport === "B") {
                    starport = "B";
                    if (d6(2) >= 8) {
                        bases.push("Naval");
                    } else {
                        if (d6(2) === 12) {
                            bases.push("Pirate");
                        }
                    }
                    if (d6(2) >= 9) {
                        bases.push("Scout");
                    }
                } else if (starport === "A") {
                    if (d6(2) >= 8) {
                        bases.push("Naval");
                    }
                    if (d6(2) >= 10) {
                        bases.push("Scout");
                    }
                }
            } else if (ruleset === "MgT2") {
                var corsairDM = 0;
                if (law === 0) { corsairDM = 2; } else if (law >= 2) { corsairDM = -2; }
                if (starport === "X") {
                    if (d6(2) + corsairDM >= 10) {
                        bases.push("Corsair");
                    }
                } else if (starport === "E") {
                    if (d6(2) + corsairDM >= 10) {
                        bases.push("Corsair");
                    }
                } else if (starport === "D") {
                    if (d6(2) >= 8) {
                        bases.push("Scout");
                    }
                    if (d6(2) + corsairDM >= 12) {
                        bases.push("Corsair");
                    }

                } else if (starport === "C") {
                    if (d6(2) >= 10) {
                        bases.push("Military");
                    }
                    if (d6(2) >= 9) {
                        bases.push("Scout");
                    }
                } else if (starport === "B") {
                    if (d6(2) >= 8) {
                        bases.push("Military");
                    }
                    if (d6(2) >= 8) {
                        bases.push("Naval");
                    }
                    if (d6(2) >= 9) {
                        bases.push("Scout");
                    }
                } else if (starport === "A") {
                    if (d6(2) >= 8) {
                        bases.push("Military");
                    }
                    if (d6(2) >= 8) {
                        bases.push("Naval");
                    }
                    if (d6(2) >= 10) {
                        bases.push("Scout");
                    }
                }
                var highportDM = 0;
                if (tech < 9) {
                } else if (tech >= 9 && tech <= 11) {
                    highportDM = 1;
                } else {
                    highportDM = 2;
                }
                if (pop >= 9) { highportDM += 1; } else if (pop <= 6) { highportDM -= 1; }
                if (starport === "A") { highport = d6(2) + highportDM >= 6; }
                else if (starport === "B") { highport = d6(2) + highportDM >= 8; }
                else if (starport === "C") { highport = d6(2) + highportDM >= 10; }
                else if (starport === "D") { highport = d6(2) + highportDM >= 12; }
            }
            if (pop === 0) {
                bases = [];
                popdigit = 0;
            } 
            uwp = starport + ext(size) + ext(atmo) + ext(hydro) + ext(pop) + ext(gov) + ext(law) + "-" + ext(tech);
        }
    } else {
        roll = d6(2); // roll for starport
        if (roll <= 4) {
            starport = "A";
            if (d6(2) <= 6) {
                if (d6(2) <= 4) { }
                //    bases.push("Naval Depot");
                //}else{ bases.push("Naval"); }
                bases.push("Naval");
            }
            if (d6(2) <= 4) {
                if (d6(2) <= 7) { }
                //    bases.push("Way Station");
                //}else{ bases.push("Scout");}
                bases.push("Scout");
            }
        }
        else if (roll <= 6) {
            starport = "B";
            if (d6(2) <= 5) { bases.push("Naval"); }
            if (d6(2) <= 5) { bases.push("Scout"); }
        }
        else if (roll <= 8) {
            starport = "C";
            if (d6(2) <= 6) { bases.push("Scout"); }
        }
        else if (roll == 9) {
            starport = "D";
            if (d6(2) <= 7) { bases.push("Scout"); }
        }
        else if (roll <= 11) {
            starport = "E";
        }
        else if (roll == 12) {
            starport = "X";
        }


        // roll for size
        size = d6(2) - 2;
        if (size === 10) { size = d6() + 9; }
        uwp += size.toString(36);
        //roll for atmosphere
        atmo = d6() - d6() + size;
        if (atmo < 0 || size === 0) { atmo = 0; }
        if (atmo > 15) { atmo = 15; }
        uwp += atmo.toString(36);
        //roll for hydro
        var hydroMods = 0;
        if (atmo < 2 || atmo > 9) { hydroMods = 4; }
        hydro = d6() - d6() + atmo + hydroMods;
        if (size < 2 || hydro < 0) { hydro = 0; }
        if (hydro > 10) { hydro = 10; }
        uwp += hydro.toString(36);
        // roll for pop
        pop = d6(2) - 2;
        pop2 = d6(2) - 2;
        var popdigit = 0;
        if (pop === 0) {
            //uwp = "X"+uwp.substring(1); 
            //starport = "X"; 
            bases = [];
            popdigit = 0;
        } else {
            popdigit = d19()
        }

        if (pop === 10) { pop = d6(2) + 3; }
        if (pop2 === 10) { pop2 = d6(2) + 3; }
        pop2 = Math.max(pop, pop2);

        uwp += pop.toString(36);

        if (starport === "A" && pop >= 7) { highport = true; }
        else if (starport === "B" && pop >= 8) { highport = true; }
        else if (starport === "C" && pop >= 9) { highport = true; }

        // roll for gov
        gov = d6() - d6() + pop;
        if (gov > 15) { gov = 15; }
        if (gov < 0) { gov = 0; }
        if (pop === 0) { gov = 0; }
        uwp += gov.toString(36);
        // roll for law
        law = d6() - d6() + gov;
        if (law < 0) { law = 0; }
        if (law > 18) { law = 18; }
        if (pop === 0) { law = 0; }
        if (law <= 17) {
            uwp += law.toString(36);
        } else {
            uwp += (law + 1).toString(36);
        }
        // roll for TL
        tech = d6(1);
        if (starport === "A") { tech += 6; }
        else if (starport === "B") { tech += 4; }
        else if (starport === "C") { tech += 2; }
        else if (starport === "X") { tech -= 4; }

        if (pop > 0) {
            if (size <= 1) { tech += 2; }
            else if (size <= 4) { tech += 1; }

            if (atmo <= 3) { tech += 1; }
            else if (atmo >= 10) { tech += 1; }

            if (hydro === 9) { tech += 1; }
            else if (hydro === 10) { tech += 2; }

            if (pop <= 5) { tech += 1; }
            else if (pop === 9) { tech += 2; }
            else if (pop >= 10) { tech += 4; }
        }
        if ((tech > 0 && gov === 0) || gov === 5) { tech += 1; }
        else if (gov === 13) { tech -= 2; }

        if (pop === 0) {
            if (tech > 0) {
                // This will be a dieback world. Give them the tech bonuses for planet features.
                if (size <= 1) { tech += 2; }
                else if (size <= 4) { tech += 1; }

                if (atmo <= 3) { tech += 1; }
                else if (atmo >= 10) { tech += 1; }

                if (hydro === 9) { tech += 1; }
                else if (hydro === 10) { tech += 2; }
            }
        }
        if (tech < 0) { tech = 0; }
        if (tech > +(maxTechLevel)) {
            tech = +(maxTechLevel);
        }
        if (pop === 0) {
            if (!permitDieback || pop2 === 0) {
                tech = 0;
            }
            if (tech === 0) { // barren worlds require starport E or X
                if (starport !== "E") {
                    starport = "X";
                    uwp = "X" + uwp.substring(1);
                }
            }
        }
        if (tech <= 17) {
            uwp += "-" + tech.toString(36);
        } else {
            uwp += "-" + ((+(tech) + 1).toString(36));
        }
    }


    // roll to see if the world is a satellite
    roll = d6() - d6();
    var MWType, MWPrimary, MWOrbitAroundPrimary;
    if (roll <= -4) {
        MWType = "Far Satellite";
        roll = d6() - d6();
        if (roll === -5) { MWOrbitAroundPrimary = 14; /*"Oh";*/ }
        else if (roll === -4) { MWOrbitAroundPrimary = 15; /*"Pee";*/ }
        else if (roll === -3) { MWOrbitAroundPrimary = 16; /*"Que";*/ }
        else if (roll === -2) { MWOrbitAroundPrimary = 17; /*"Arr";*/ }
        else if (roll === -1) { MWOrbitAroundPrimary = 18; /*"Ess";*/ }
        else if (roll === 0) { MWOrbitAroundPrimary = 19; /*"Tee";*/ }
        else if (roll === 1) { MWOrbitAroundPrimary = 20; /*"Yu";*/ }
        else if (roll === 2) { MWOrbitAroundPrimary = 21; /*"Vee";*/ }
        else if (roll === 3) { MWOrbitAroundPrimary = 22; /*"Dub";*/ }
        else if (roll === 4) { MWOrbitAroundPrimary = 23; /*"Ex";*/ }
        else if (roll === 5) { MWOrbitAroundPrimary = 24; /*"Wye";*/ }
    }
    else if (roll <= -3) {
        MWType = "Close Satellite";
        roll = d6() - d6();
        if (roll === -5 && size <= 2) { MWOrbitAroundPrimary = 1; /*"Bee";*/ }
        else if (roll <= -4 && size <= 2) { MWOrbitAroundPrimary = 2; /*"Cee";*/ }
        else if (roll <= -3) { MWOrbitAroundPrimary = 3; /*"Dee";*/ }
        else if (roll === -2) { MWOrbitAroundPrimary = 4; /*"Ee";*/ }
        else if (roll === -1) { MWOrbitAroundPrimary = 5; /*"Eff";*/ }
        else if (roll === 0) { MWOrbitAroundPrimary = 6; /*"Gee";*/ }
        else if (roll === 1) { MWOrbitAroundPrimary = 7; /*"Aitch";*/ }
        else if (roll === 2) { MWOrbitAroundPrimary = 8; /*"Eye";*/ }
        else if (roll === 3) { MWOrbitAroundPrimary = 9; /*"Jay";*/ }
        else if (roll === 4) { MWOrbitAroundPrimary = 10; /*"Kay";*/ }
        else if (roll === 5) { MWOrbitAroundPrimary = 11; /*"Ell";*/ }
    } else {
        if (size === 0) { MWType = "Belt"; } else { MWType = "Planet"; }
        MWPrimary = "Star"; MWOrbitAroundPrimary = MWOrbit;
    }
    if (MWType.indexOf("Satellite") > 0) {
        if (gg >= 1 && d6() - d6() <= 0) {
            MWPrimary = "Gas Giant";
        } else {
            MWPrimary = "Planet";
        }
    }

    var difference = stars.primary.HZOrbit - MWOrbit; // >= 1 hot, 0 = temperate <=-1 cold
    var needsClimate = climate.length === 0;
    if (difference >= 2) {
        tradecodes.push("Tr"); if (needsClimate) { climate = "Hot. Tropic."; }
    } else if (difference === 1) {
        if (size >= 6 && size <= 9 && atmo >= 4 && atmo <= 9 && hydro >= 3 && hydro <= 7) {
            tradecodes.push("Tr"); if (needsClimate) { climate = "Tropic."; }
        } else {
            tradecodes.push("Ho"); if (needsClimate) { climate = "Hot."; }
        }
    } else if (difference === 0) {
        if (atmo === 0) { console.log(climate); }
        if (needsClimate) { climate = "Temperate."; }
    } else if (difference === -1) {
        if (size >= 6 && size <= 9 && atmo >= 4 && atmo <= 9 && hydro >= 3 && hydro <= 7) {
            tradecodes.push("Tu"); if (needsClimate) { climate = "Tundra."; }
        } else {
            tradecodes.push("Co"); if (needsClimate) { climate = "Cold."; }
        }
    } else if (difference <= -2) {
        //if(size >= 2 && size <= 9 && hydro > 0){
        tradecodes.push("Fr");
        if (needsClimate) { climate = "Frozen."; }
        //}
    }
    if (MWOrbit <= 1) { tradecodes.push("Tz"); }

    // trade codes
    if (size === 0 && atmo === 0 && hydro === 0) { tradecodes.push("As"); }
    if (atmo >= 2 && atmo <= 9 && hydro === 0) { tradecodes.push("De"); }
    if (atmo >= 10 && atmo <= 12 && hydro >= 1) { tradecodes.push("Fl"); }
    if (size >= 6 && size <= 8 &&
        (atmo === 5 || atmo === 6 || atmo === 8) &&
        (hydro >= 5 && hydro <= 7)
    ) {
        tradecodes.push("Ga");
    }
    if (size >= 3 &&
        (atmo === 2 || atmo === 4 || atmo === 7 || atmo === 9 || atmo === 10 || atmo === 11 || atmo === 12) &&
        (hydro <= 2)
    ) {
        tradecodes.push("He");
    }
    if (atmo <= 1 && hydro >= 1) { tradecodes.push("Ic"); }
    if (size >= 10 && hydro === 10 && (
        (atmo >= 3 && atmo <= 9) || (atmo >= 13)
    )) { tradecodes.push("Oc"); }
    if (size <= 9 && hydro === 10 && (
        (atmo >= 3 && atmo <= 9) || (atmo >= 13)
    )) { tradecodes.push("Wa"); }
    if (atmo === 0) { tradecodes.push("Va"); }

    if (pop === 0) {

        if (tech > 0) { tradecodes.push("Di"); }
        else { tradecodes.push("Ba"); }
    }
    else if (pop <= 3) {
        tradecodes.push("Lo");
    } else if (pop <= 6) {
        tradecodes.push("Ni");
    } else if (pop === 8) {
        tradecodes.push("Ph");
    } else if (pop >= 9) {
        tradecodes.push("Hi");
    }
    if (atmo >= 4 && atmo <= 9 && hydro >= 4 && hydro <= 8 && (pop === 4 || pop === 8)) { tradecodes.push("Pa"); }
    if (atmo >= 4 && atmo <= 9 && hydro >= 4 && hydro <= 8 && (pop >= 5 && pop <= 7)) { tradecodes.push("Ag"); }
    if (atmo <= 3 && hydro <= 3 && pop >= 6) { tradecodes.push("Na"); }
    if (gov === 6) { // captive gov

        if ((atmo === 2 || atmo === 3 || atmo === 10 || atmo === 11) &&
            hydro <= 5 && pop >= 3 && pop <= 6 && law >= 6 && law <= 9 && gov === 6
        ) {
            tradecodes.push("Px");
        } else if (pop <= 4 && (law == 0 || law == 4 || law == 5)) {
            tradecodes.push("Re");
        }

    }
    if ((atmo <= 2 || atmo === 4 || atmo === 7 || atmo === 9) && (pop === 7 || pop === 8)) { tradecodes.push("Pi"); }
    if ((atmo <= 2 || atmo === 4 || atmo === 7 || atmo === 9 || atmo === 10 || atmo === 11 || atmo === 12)
        && (pop >= 9)) {
            tradecodes.push("In");
    }
    if (atmo >= 2 && atmo <= 5 && hydro <= 3) {
        tradecodes.push("Po");
    }
    if (atmo === 6 || atmo === 8) {
        if (pop === 5 || pop === 9) { tradecodes.push("Pr"); }
        else if (pop >= 6 && pop <= 8) { tradecodes.push("Ri"); }
    }
    if (pop >= 5 && pop <= 10 && gov === 6 && law <= 3) { tradecodes.push("Cy"); }


    var importance = 0, importanceDesc = "", dailyships = "0", weeklyships = "0";
    if (starport === "A" || starport === "B") { importance += 1; }
    else if (starport === "D" || starport === "E" || starport === "X") { importance -= 1; }
    if (tech >= 16) { importance += 1; }
    if (tech >= 10) { importance += 1; }
    if (tech <= 8) { importance -= 1; }
    if (tradecodes.indexOf("Ag") >= 0) { importance += 1; }
    if (tradecodes.indexOf("Hi") >= 0) { importance += 1; }
    if (tradecodes.indexOf("In") >= 0) { importance += 1; }
    if (tradecodes.indexOf("Ri") >= 0) { importance += 1; }
    if (pop <= 6) { importance -= 1; }
    if (bases.indexOf("Naval") >= 0 && bases.indexOf("Scout") >= 0) { importance += 1; }
    if (bases.indexOf("Way Station") >= 0 || bases.indexOf("Naval Depot") >= 0) { importance += 1; }
    var isImportant = importance >= 4;
    var isUnimportant = importance <= 0;
    if (importance <= -2) { importanceDesc = "Very Unimportant"; }
    else if (importance <= 0) { importanceDesc = "Unimportant"; dailyships = "1"; weeklyships = importance === 0 ? "2" : "1"; }
    else if (importance <= 3) {
        importanceDesc = "Ordinary";
        if (importance === 1) { dailyships = "1-2"; weeklyships = "10"; }
        else if (importance === 2) { dailyships = "2-4"; weeklyships = "20"; }
        else if (importance === 3) { dailyships = "3-6"; weeklyships = "30"; }
    }
    else if (importance <= 4) { importanceDesc = "Important"; dailyships = "15-20"; weeklyships = "100"; }
    else if (importance >= 5) { importanceDesc = "Very Important"; dailyships = "100"; weeklyships = "1000"; }

    var economics = { resources: 0, infrastructure: 0, labor: 0, efficiency: 0 };
    economics.resources = d6(2) + (tech >= 8 ? gg + planetoidBelts : 0);
    economics.labor = Math.max(0, pop - 1);
    if (pop === 0) {
        economics.infrastructure = 0;
    } else if (pop <= 3) {
        economics.infrastructure = Math.max(0, importance);
    } else if (pop <= 6) {
        economics.infrastructure = Math.max(0, d6() + importance);
    } else {
        economics.infrastructure = Math.max(0, d6(2) + importance);
    }
    economics.efficiency = d6() - d6();
    economics.extension = "" + ext(economics.resources) + ext(economics.labor) + ext(economics.infrastructure) + (economics.efficiency >= 0 ? "+" : "") + (economics.efficiency == 0 ? 1 : economics.efficiency);
    economics.RU = Math.max(1, economics.resources) * Math.max(1, economics.labor) * Math.max(1, economics.infrastructure) * (economics.efficiency === 0 ? 1 : economics.efficiency);
    var cultural = {};
    if (pop === 0) {
        cultural = { heterogeneity: 0, acceptance: 0, strangeness: 0, symbols: 0, extension: "0000" }
    } else {
        cultural.heterogeneity = Math.max(1, pop + d6() - d6());
        cultural.acceptance = Math.max(1, importance + pop);
        cultural.strangeness = Math.max(1, d6() - d6() + 5);
        cultural.symbols = Math.max(1, d6() - d6() + tech);
        cultural.extension = ext(cultural.heterogeneity) + ext(cultural.acceptance) + ext(cultural.strangeness) + ext(cultural.symbols);
    }
    tradecodes.sort();
    uwp = starport + ext(size) + ext(atmo) + ext(hydro) + ext(pop) + ext(gov) + ext(law) + "-" + ext(tech);


    var roughpop = popdigit * Math.pow(10, pop);
    var mainworld = { cultural: cultural, isMainworld: true, roughpop: roughpop, popdigit: popdigit, maxpop: pop2, uwp: uwp, highport: highport, tradecodes: tradecodes, size: size, atmo: atmo, hydro: hydro, pop: pop, gov: gov, law: law, tech: tech, worldtype: MWType, primary: MWPrimary, climate: climate, orbitAroundPrimary: MWOrbitAroundPrimary, isAsteroidBelt: size === 0, orbit: MWOrbit, starport: starport };
    if (applyHillSphereLimit) {
        mainworld = applyHillSphereLimitToMainworld(mainworld);
    }
    if (mainworld.worldtype === "Far Satellite") { mainworld.tradecodes.push("Sa"); }
    else if (mainworld.worldtype === "Close Satellite") { mainworld.tradecodes.push("Lk"); }
    stars = placeWorlds(stars, mainworld, gg, planetoidBelts, d6(2), +maxTechLevel, allowNonMWPops, permitDieback, applyHillSphereLimit)
    var totalpops = getTotalPop(stars.primary);
    var totalpop = 0;
    for (var i = 0, len = totalpops.length; i < len; i++) {
        totalpop += totalpops[i] * Math.pow(10, i);
    }
    // nobility
    var nobility = ["B"];
    if (mainworld.tradecodes.indexOf("Pa") >= 0 || mainworld.tradecodes.indexOf("Pr") >= 0) { nobility.push("c"); }
    if (mainworld.tradecodes.indexOf("Ag") >= 0 || mainworld.tradecodes.indexOf("Ri") >= 0) { nobility.push("C"); }
    if (mainworld.tradecodes.indexOf("Pi") >= 0) { nobility.push("D"); }
    if (mainworld.tradecodes.indexOf("Ph") >= 0) { nobility.push("e"); }
    if (mainworld.tradecodes.indexOf("In") >= 0 || mainworld.tradecodes.indexOf("Hi") >= 0) { nobility.push("E"); }
    if (isImportant) { nobility.push("f"); }
    return { name: name, nobility: nobility, economics: economics, pbg: ext(popdigit) + ext(planetoidBelts) + ext(gg), totalpop: totalpop, popdigit: popdigit, allegiance: "Im", uwp: uwp, bases: bases, stars: stars, gg: gg, planetoidBelts: planetoidBelts, importance: { weeklytraffic: weeklyships, dailytraffic: dailyships, isImportant: isImportant, isUnimportant: isUnimportant, extension: importance, description: importanceDesc }, mainworld: mainworld, tradecodes: tradecodes };
}
function getTotalPop(star, total) {
    if (typeof total == "undefined") {
        total = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
    for (var i = 0, len = star.satellites.length; i < len; i++) {
        if (typeof star.satellites[i] !== "undefined") {
            var sat = star.satellites[i];
            if (sat.pop) {
                total[sat.pop] += sat.popdigit ? sat.popdigit : 4;
            }
            if (sat.satellites) {
                total = getTotalPop(sat, total);
            }
        }
    }
    return total;
}
function getInnermostOrbit(star) {
    for (var i = 0, len = star.satellites.length; i < len; i++) {
        if (typeof star.satellites[i] === "undefined") {
            return i;
        }
    }
    return -1;
}
function placeWorlds(stars, mainworld, gg, belts, other, maxTech, allowNonMWPops, permitDieback, applyHillSphereLimit) {

    var availableOrbits = stars.primary.numOrbits;
    var arrStars = [stars.primary];
    var closeIndex = -1;
    if (stars.close) {
        arrStars.push(stars.close);
        closeIndex = arrStars.length - 1;
        availableOrbits -= 1;
        for (var i = 0, len = stars.close.satellites.length; i < len; i++) {
            if (typeof stars.close.satellites[i] !== "undefined") {
                availableOrbits += 1;
            }
        }
    }
    var nearIndex = -1;
    if (stars.near) {
        arrStars.push(stars.near);
        nearIndex = arrStars.length - 1;
        availableOrbits -= 1;
        for (var i = 0, len = stars.near.satellites.length; i < len; i++) {
            if (typeof stars.near.satellites[i] !== "undefined") {
                availableOrbits += 1;
            }
        }
    }
    var farIndex = -1;
    if (stars.far) {
        arrStars.push(stars.far);
        farIndex = arrStars.length - 1;
        availableOrbits -= 1;
        for (var i = 0, len = stars.far.satellites.length; i < len; i++) {
            if (typeof stars.far.satellites[i] !== "undefined") {
                availableOrbits += 1;
            }
        }
    }

    var planetsToPlace = [];
    var SGGCount = 0;
    var isBelt = mainworld.worldtype === "Belt";
    if (mainworld.worldtype === "Planet" || isBelt) {
        if (isBelt) {
            mainworld.worldtype = "Asteroid Belt";
        } else {
            mainworld.worldtype = "Mainworld";
        }
        planetsToPlace.push(mainworld);
    } else if (mainworld.primary === "Gas Giant") {
        var giant = createGasGiant();
        if (giant.worldtype === "Small Gas Giant") {
            SGGCount += 1;
        }
        //giant.satellites = new Array(26);
        giant.orbit = mainworld.orbit;
        giant.satellites = addSatellite(new Array(26), mainworld, giant.size, applyHillSphereLimit, giant.orbit);
        planetsToPlace.push(giant);
        gg -= 1;
    } else if (mainworld.primary === "Planet") {
        var bw = createBigWorld(mainworld, mainworld.pop - 1, maxTech, allowNonMWPops, permitDieback)
        //bw.satellites = new Array(26);
        bw.orbit = mainworld.orbit;
        bw.satellites = addSatellite(new Array(26), mainworld, bw.size, applyHillSphereLimit, bw.orbit);
        planetsToPlace.push(bw);
    } else {
        console.log("Unexpected mainworld worldtype or primary! Mainworld not placed.")
        console.log(mainworld);
    }
    for (var i = 0; i < gg; i++) {
        var ngiant = createGasGiant();
        if (ngiant.worldtype === "Small Gas Giant") {
            SGGCount += 1;
            if (SGGCount % 2 === 0) {
                ngiant.worldtype = "Ice Giant";
            }
        }
        planetsToPlace.push(ngiant);
    }
    for (var i = 0; i < belts; i++) {
        planetsToPlace.push(createBelt(mainworld, mainworld.pop - 1));
    }

    for (var i = 0; i < other && availableOrbits > planetsToPlace.length + 1; i++) {
        planetsToPlace.push({ worldtype: "Other World", uwp: "??Y000000-0" });
    }
    s = 0;
    var attemptCounterMax = planetsToPlace.length;
    var attemptCounter = 0;
    while (planetsToPlace.length > 0 && availableOrbits >= planetsToPlace.length) {
        attemptCounter += 1;
        if (attemptCounter >= attemptCounterMax) {
            var numAvailableOrbits = 0;
            for (var i = 0, len = arrStars.length; i < len; i++) {
                for (var j = 0, jlen = arrStars[i].satellites.length; j < jlen; j++) {
                    if (typeof arrStars[i].satellites[j] === "undefined") {
                        numAvailableOrbits += 1;
                    }
                }
            }
            if (numAvailableOrbits === 0) {
                console.log(mainworld);
                console.log("Problem detected for " + mainworld.uwp + ". " + planetsToPlace.length + " worlds left to place. Only " + numAvailableOrbits + " orbits available.");
                console.log(arrStars);
                planetsToPlace = [];
                break;
            }
        }
        var planet = planetsToPlace[0];
        var size = revExt(planet.uwp[1]), atmo = revExt(planet.uwp[2]), hydro = planet.uwp[3], pop = planet.uwp[4];
        var star = arrStars[s];
        if (typeof planet.orbit !== "undefined") { // if planet already has a preferred orbit...
            if (typeof star.satellites[planet.orbit] === "undefined") {
                star.satellites[planet.orbit] = planet;
                var orbitDetails = createOrbitDetails(planet.orbit);
                planet.decimalOrbit = orbitDetails.decimalOrbit;
                planet.au = orbitDetails.au;
                planetsToPlace.splice(0, 1);
                availableOrbits -= 1;
                if (planet.worldtype.indexOf("Giant") === -1) {

                    var difference = star.HZOrbit - planet.orbit;
                    planet.tradecodes = addClimateCodes(planet, difference, size, atmo, hydro, pop, planet.orbit);

                }
            } else {
                var amp = 0, placedSuccessfully = false;
                while (!placedSuccessfully && amp < star.satellites.length) {
                    amp++;
                    if (planet.orbit - amp >= 0 && typeof star.satellites[planet.orbit - amp] === "undefined") {
                        star.satellites[planet.orbit - amp] = planet;
                        planet.orbit = planet.orbit - amp;
                        var orbitDetails = createOrbitDetails(planet.orbit);
                        planet.decimalOrbit = orbitDetails.decimalOrbit;
                        planet.au = orbitDetails.au;
                        planetsToPlace.splice(0, 1);
                        availableOrbits -= 1;
                        placedSuccessfully = true;
                        if (planet.worldtype.indexOf("Giant") === -1) {
                            var difference = star.HZOrbit - planet.orbit;
                            planet.tradecodes = addClimateCodes(planet, difference, size, atmo, hydro, pop, planet.orbit);
                        }
                    } else if (star.satellites.length > planet.orbit + amp && typeof star.satellites[planet.orbit + amp] === "undefined") {
                        star.satellites[planet.orbit + amp] = planet;
                        planet.orbit = planet.orbit + amp
                        var orbitDetails = createOrbitDetails(planet.orbit);

                        planet.decimalOrbit = orbitDetails.decimalOrbit;
                        planet.au = orbitDetails.au;
                        planetsToPlace.splice(0, 1);
                        availableOrbits -= 1;
                        placedSuccessfully = true;
                        if (planet.worldtype.indexOf("Giant") === -1) {
                            var difference = star.HZOrbit - planet.orbit;
                            planet.tradecodes = addClimateCodes(planet, difference, size, atmo, hydro, pop, planet.orbit);
                        }
                    }
                }
            }
            if (planet.worldtype.indexOf("Giant") > 0) {
                // add gas giant moons
                var numExistingMoons = 0;
                if (typeof planet.satellites === "undefined") {
                    planet.satellites = new Array(26);
                } else {
                    numExistingMoons = planet.satellites.filter(function (val, i, arr) { return typeof val !== "undefined" }).length;
                }
                var moons = planet.satellites;
                var numAdditionalMoons = d6() - 1 - numExistingMoons;
                if (numAdditionalMoons > 0) {
                    var diff = orbit - star.HZOrbit;
                    if (isNaN(diff)) { console.log(779); }
                    var moonMaker = diff <= 1 ? createInnerSatellite : createOuterSatellite;
                    for (var m = 0; m < numAdditionalMoons; m++) {
                        var moon = moonMaker(mainworld, planet.size, mainworld.pop - 1, maxTech, allowNonMWPops, permitDieback);
                        moons = addSatellite(moons, moon, planet.size, applyHillSphereLimit, planet.orbit, star.HZOrbit);
                    }
                    planet.satellites = moons;
                }
            } else if (planet.worldtype === "BigWorld") {
                // add bigworld moons
                var numExistingMoons = 0;
                if (typeof planet.satellites === "undefined") {
                    planet.satellites = new Array(26);
                } else {
                    numExistingMoons = planet.satellites.filter(function (val, i, arr) { return typeof val !== "undefined" }).length;
                }
                var moons = planet.satellites;
                var diff = orbit - star.HZOrbit;
                var numAdditionalMoons = 0;
                if (diff < -1) {
                    numAdditionalMoons = d6() - 5 - numExistingMoons;
                } else if (diff <= 1) {
                    numAdditionalMoons = d6() - 4 - numExistingMoons;
                } else {
                    numAdditionalMoons = d6() - 3 - numExistingMoons;
                }
                if (numAdditionalMoons > 0) {
                    var moonMaker = diff <= 1 ? createInnerSatellite : createOuterSatellite;
                    for (var m = 0; m < numAdditionalMoons; m++) {
                        var moon = moonMaker(mainworld, planet.size, mainworld.pop - 1, maxTech, allowNonMWPops, permitDieback);
                        if (isNaN(star.HZOrbit)) { console.log(809); }
                        moons = addSatellite(moons, moon, planet.size, applyHillSphereLimit, planet.orbit, star.HZOrbit);
                    }
                    planet.satellites = moons;
                }
            }
        } else {
            while (star.satellites.length === 0) { // if the current star has no available orbits, rotate
                s++;
                if (s >= arrStars.length) { s = 0; }
                star = arrStars[s];
            }
            var roll = d6(2);
            var orbit = star.HZOrbit;
            switch (planet.worldtype) {
                case "Large Gas Giant":
                    orbit = roll - 5 + orbit;
                    break;
                case "Small Gas Giant":
                    orbit = roll - 4 + orbit;
                    break;
                case "Ice Giant":
                    orbit = roll - 1 + orbit;
                    break;
                case "Planetoid Belt":
                case "Belt":
                case "Asteroid Belt":
                    orbit = roll - 3 + orbit;
                    break;
                default:
                    if (planetsToPlace.length === 1) {
                        orbit = 19 - roll;
                    } else {
                        if (roll <= 2) {
                            orbit = 10;
                        } else if (roll === 3) {
                            orbit = 8;
                        } else if (roll === 4) {
                            orbit = 6;
                        } else if (roll === 5) {
                            orbit = 4;
                        } else if (roll === 6) {
                            orbit = 2;
                        } else if (roll === 7) {
                            orbit = 0;
                        } else if (roll === 8) {
                            orbit = 1;
                        } else if (roll === 9) {
                            orbit = 3;
                        } else if (roll === 10) {
                            orbit = 5;
                        } else if (roll === 11) {
                            orbit = 7;
                        } else if (roll === 12) {
                            orbit = 9;
                        }
                    }
            }
            if (orbit < 0) { orbit = 0; }
            while (orbit >= star.satellites.length) { // if this is outside the available orbits, try next inside one
                orbit -= 1;
            }
            if (typeof star.satellites[orbit] === "undefined") {
                if (planet.worldtype === "Other World") {
                    planet = createOtherWorld(mainworld, orbit, star.HZOrbit, mainworld.pop - 1, maxTech, allowNonMWPops, permitDieback, applyHillSphereLimit);
                } else if (planet.worldtype.indexOf("Giant") > 0) {
                    // add gas giant moons
                    var numExistingMoons = 0;
                    if (typeof planet.satellites === "undefined") {
                        planet.satellites = new Array(26);
                    } else {
                        numExistingMoons = planet.satellites.filter(function (val, i, arr) { return typeof val !== "undefined" });
                    }
                    var moons = planet.satellites;
                    var numAdditionalMoons = d6() - 1 - numExistingMoons;
                    if (numAdditionalMoons > 0) {
                        var diff = orbit - star.HZOrbit;
                        if (isNaN(diff)) { console.log(886); }
                        var moonMaker = diff <= 1 ? createInnerSatellite : createOuterSatellite;
                        for (var m = 0; m < numAdditionalMoons; m++) {
                            var moon = moonMaker(mainworld, planet.size, mainworld.pop - 1, maxTech, allowNonMWPops, permitDieback);
                            moons = addSatellite(moons, moon, planet.size, applyHillSphereLimit, orbit, star.HZOrbit);
                        }
                        planet.satellites = moons;
                    }

                } else if (planet.worldtype === "BigWorld") {
                    // add bigworld moons
                    var numExistingMoons = 0;
                    if (typeof planet.satellites === "undefined") {
                        planet.satellites = new Array(26);
                    } else {
                        numExistingMoons = planet.satellites.filter(function (val, i, arr) { return typeof val !== "undefined" });
                    }
                    var moons = planet.satellites;
                    var diff = orbit - star.HZOrbit;
                    var numAdditionalMoons = 0;
                    if (diff < -1) {
                        numAdditionalMoons = d6() - 5 - numExistingMoons;
                    } else if (diff <= 1) {
                        numAdditionalMoons = d6() - 4 - numExistingMoons;
                    } else {
                        numAdditionalMoons = d6() - 3 - numExistingMoons;
                    }
                    if (numAdditionalMoons > 0) {
                        var moonMaker = diff <= 1 ? createInnerSatellite : createOuterSatellite;
                        for (var m = 0; m < numAdditionalMoons; m++) {
                            moons = addSatellite(moons, moonMaker(mainworld, planet.size, mainworld.pop - 1, maxTech, allowNonMWPops, permitDieback), planet.size, applyHillSphereLimit, planet.orbit, star.HZOrbit);
                        }
                        planet.satellites = moons;
                    }
                }
                star.satellites[orbit] = planet; //{worldtype:planet.worldtype, uwp:planet.uwp, details:planet};
                var orbitDetails = createOrbitDetails(orbit);
                planet.orbit = orbit;
                planet.decimalOrbit = orbitDetails.decimalOrbit;
                planet.au = orbitDetails.au;
                planetsToPlace.splice(0, 1);
                availableOrbits -= 1;
                if (planet.worldtype.indexOf("Giant") === -1) {
                    var difference = star.HZOrbit - planet.orbit;
                    if (isNaN(difference)) { console.log(928); }
                    planet.tradecodes = addClimateCodes(planet, difference, size, atmo, hydro, pop, planet.orbit);
                }
            } else {
                var amp = 0, placedSuccessfully = false;
                while (!placedSuccessfully && amp < star.satellites.length) {
                    amp++;
                    if (orbit - amp >= 0 && typeof star.satellites[orbit - amp] === "undefined") {
                        if (planet.worldtype === "Other World") {
                            planet = createOtherWorld(mainworld, orbit - amp, star.HZOrbit, mainworld.pop - 1, maxTech, allowNonMWPops, permitDieback, applyHillSphereLimit);
                        }
                        star.satellites[orbit - amp] = planet; //{worldtype:planet.worldtype,uwp:planet.uwp, details:planet};
                        var orbitDetails = createOrbitDetails(orbit - amp);
                        planet.orbit = orbit - amp;
                        planet.decimalOrbit = orbitDetails.decimalOrbit;
                        planet.au = orbitDetails.au;
                        planetsToPlace.splice(0, 1);
                        availableOrbits -= 1;
                        placedSuccessfully = true;
                        planet.orbit = orbit - amp;
                        if (planet.worldtype.indexOf("Giant") === -1) {
                            var difference = star.HZOrbit - planet.orbit;
                            if (isNaN(difference)) { console.log(948); }
                            planet.tradecodes = addClimateCodes(planet, difference, size, atmo, hydro, pop, planet.orbit);
                        }
                    } else if (star.satellites.length > orbit + amp && typeof star.satellites[orbit + amp] === "undefined") {
                        if (planet.worldtype === "Other World") {
                            planet = createOtherWorld(mainworld, orbit + amp, star.HZOrbit, mainworld.pop - 1, maxTech, allowNonMWPops, permitDieback, applyHillSphereLimit);
                        }
                        star.satellites[orbit + amp] = planet; //{worldtype:planet.worldtype,uwp:planet.uwp, details:planet};
                        planet.orbit = orbit + amp;
                        var orbitDetails = createOrbitDetails(orbit + amp);
                        planet.decimalOrbit = orbitDetails.decimalOrbit;
                        planet.au = orbitDetails.au;
                        planetsToPlace.splice(0, 1);
                        availableOrbits -= 1;
                        placedSuccessfully = true;
                        planet.orbit = orbit + amp;
                        if (planet.worldtype.indexOf("Giant") === -1) {
                            var difference = star.HZOrbit - planet.orbit;
                            if (isNaN(difference)) { console.log(966); }
                            planet.tradecodes = addClimateCodes(planet, difference, size, atmo, hydro, pop, planet.orbit);
                        }
                    }
                }
            }

        }
        s++;
        if (s >= arrStars.length) { s = 0; }
    }
    stars.primary = arrStars[0];
    if (stars.close) { stars.close = arrStars[closeIndex]; }
    if (stars.near) { stars.near = arrStars[nearIndex]; }
    if (stars.far) { stars.far = arrStars[farIndex]; }
    return stars;
}
function addClimateCodes(planet, difference, size, atmo, hydro, pop, orbit) {
    var tradecodes = planet.tradecodes;
    if (difference > 1) {
        if (tradecodes.indexOf("Ho") === -1) {
            tradecodes.push("Ho");
        }
    } else if (difference === 1) {
        if (size >= 6 && size <= 9 && atmo >= 4 && atmo <= 9 && hydro >= 3 && hydro <= 7) {
            if (tradecodes.indexOf("Tr") === -1) {
                tradecodes.push("Tr");
            }
        } else {
            if (tradecodes.indexOf("Ho") === -1) {
                tradecodes.push("Ho");
            }
        }
    } else if (!planet.isMainworld && difference === 0 && atmo >= 4 && atmo <= 9 && hydro >= 4 && hydro <= 8 && pop >= 2 && pop <= 6) {
        if (tradecodes.indexOf("Fa") === -1) {
            tradecodes.push("Fa");
        }
    } else if (difference === -1) {
        if (size >= 6 && size <= 9 && atmo >= 4 && atmo <= 9 && hydro >= 3 && hydro <= 7) {
            if (tradecodes.indexOf("Tu") === -1) {
                tradecodes.push("Tu");
            }
        } else {
            if (tradecodes.indexOf("Co") === -1) {
                tradecodes.push("Co");
            }
        }
    } else if (difference <= -2) {
        if (size >= 2 && size <= 9 && hydro > 0) {
            if (tradecodes.indexOf("Fr") === -1) {
                tradecodes.push("Fr");
            }
        }
    } else if (difference !== 0 && !planet.isMainworld) {
        console.log("Invalid distance from HZ");
        console.log(difference);
        console.log(planet);
    }
    if (orbit <= 1) {
        if (tradecodes.indexOf("Tz") === -1) {
            tradecodes.push("Tz");
        }
    }
    tradecodes.sort();
    return tradecodes;
}
function applyHillSphereLimitToMainworld(mw) {
    var limit = getHillSphereLimit(mw.orbit);
    if (mw.orbitAroundPrimary > limit) {
        mw.orbitAroundPrimary = limit;
        if (mw.orbitAroundPrimary < 13) {
            mw.worldtype = mw.worldtype.replace("Far", "Close");
        }
    }
    return mw;
}
function getHillSphereLimit(orbit) {
    var limit = 25;
    switch (orbit) {
        case -0.5:
        case -0.4:
        case -0.3: limit = 8; break;
        case -0.2:
        case -0.1:
        case 0:
        case 0.1: limit = 9; break;
        case 0.2:
        case 0.3:
        case 0.4: limit = 10; break;
        case 0.5:
        case 0.6:
        case 0.7: limit = 11; break;
        case 0.8:
        case 0.9:
        case 1: limit = 12; break;
        case 1.1:
        case 1.2: limit = 13; break;
        case 1.3:
        case 1.4:
        case 1.5:
        case 1.6:
            limit = 14; break;
        case 1.7:
        case 1.8:
        case 1.9:
        case 2:
        case 2.1:
        case 2.2:
        case 2.3:
        case 2.4:
        case 2.5: limit = 15; break; // orbit 2 - p
        case 2.6:
        case 2.7:
        case 2.8:
        case 2.9:
        case 3:
        case 3.1:
        case 3.2: limit = 16; break;
        case 3.3:
        case 3.4:
        case 3.5:
        case 3.6:
        case 3.7: limit = 17; break;
        case 3.8:
        case 3.9:
        case 4:
        case 4.1: limit = 18; break;
        case 4.2:
        case 4.3:
        case 4.4:
        case 4.5:
        case 4.6: limit = 19; break;
        case 4.7:
        case 4.8:
        case 4.9:
        case 5: limit = 20; break;
        case 5.1:
        case 5.2: limit = 21; break;
        case 5.3:
        case 5.4:
        case 5.5: limit = 22; break;
        case 5.6:
        case 5.7: limit = 23; break;
        case 5.8:
        case 5.9:
        case 6: limit = 24; break;
        case 6.1:
        case 6.2:
        case 6.3:
        case 6.4:
        case 6.5: limit = 25; break;
        default: limit = 25; break;
    }
    return limit;
}
function addSatellite(moons, moon, primarySize, applyHillSphereLimit, orbit, HZOrbit) {
    var difference = HZOrbit - orbit;
    var size = revExt(moon.uwp[1]), atmo = revExt(moon.uwp[2]), hydro = moon.uwp[3], pop = moon.uwp[4];
    moon.tradecodes = addClimateCodes(moon, difference, size, atmo, hydro, pop, 99);

    var preferredOrbit = moon.orbitAroundPrimary;
    var originalPreferredOrbit = preferredOrbit;
    var newOrbit = preferredOrbit;
    var limit = 25, placedSuccessfully = false
    if (applyHillSphereLimit) {
        limit = getHillSphereLimit(orbit);
    }
    if (preferredOrbit > limit) {
        preferredOrbit = limit;
        newOrbit = limit;
    }
    moon.primarysize = primarySize;
    if (typeof moons[preferredOrbit] === "undefined") {
        moons[preferredOrbit] = moon;
        placedSuccessfully = true;
    } else {
        var amp = 0;
        while (!placedSuccessfully && amp < moons.length) {
            amp++;
            if (preferredOrbit - amp >= 0 && typeof moons[preferredOrbit - amp] === "undefined") {
                moons[preferredOrbit - amp] = moon;
                newOrbit = preferredOrbit - amp;
                placedSuccessfully = true;
            } else if (moons.length > preferredOrbit + amp && preferredOrbit + amp <= limit && typeof moons[preferredOrbit + amp] === "undefined") {
                moons[preferredOrbit + amp] = moon;
                newOrbit = preferredOrbit + amp;
                placedSuccessfully = true;
            }
        }
    }

    if (placedSuccessfully) {
        var newMoonType = moon.worldtype;
        if (newOrbit < 13) {
            newMoonType = newMoonType.replace("Far", "Close");
            var satCodeIndex = moons[newOrbit].tradecodes.indexOf("Sa");
            if (satCodeIndex >= 0) {
                moons[newOrbit].tradecodes.splice(satCodeIndex, 1);
                moons[newOrbit].tradecodes.push("Lk");
            }
        }
        else {
            newMoonType = newMoonType.replace("Close", "Far");
            var satCodeIndex = moons[newOrbit].tradecodes.indexOf("Lk");
            if (satCodeIndex >= 0) {
                moons[newOrbit].tradecodes.splice(satCodeIndex, 1);
                moons[newOrbit].tradecodes.push("Sa");
            }
        }

        moons[newOrbit].worldtype = newMoonType;

    } else {
        console.log(moon.worldtype + " NOT PLACED SUCCESSFULLY");
    }

    return moons;
}
function createOrbitDetails(orbit) {
    var flux = (d6(2) - 2);
    var decimalOrbits = [
        [.15, .16, .17, .18, .19, .2, .22, .24, .26, .28, .30], // 0
        [.3, .32, .34, .36, .38, .4, .43, .46, .49, .52, .55], // 1
        [.55, .58, .61, .64, .67, .7, .73, .76, .79, .82, .85], // 2
        [.85, .88, .91, .94, .97, 1, 1.06, 1.12, 1.18, 1.124, 1.30], // 3
        [1.3, 1.36, 1.42, 1.48, 1.54, 1.6, 1.72, 1.84, 1.96, 2.08, 2.20], // 4
        [2.2, 2.32, 2.44, 2.56, 2.68, 2.8, 3.04, 3.28, 3.52, 3.76, 4], // 5
        [4, 4.2, 4.4, 4.7, 4.9, 5.2, 5.6, 6.1, 6.6, 7.1, 7.6], // 6
        [7.6, 8.1, 8.5, 9.0, 9.5, 10, 11, 12, 13, 14, 15], // 7
        [15, 16, 17, 18, 19, 20, 22, 24, 26, 28, 30], // 8
        [30, 32, 34, 36, 38, 40, 43, 47, 51, 54, 58], // 9
        [58, 62, 65, 69, 73, 77, 84, 92, 100, 107, 115], // 10
        [115, 123, 130, 138, 146, 154, 169, 184, 200, 215, 231], // 11
        [231, 246, 261, 277, 292, 308, 338, 369, 400, 430, 461], // 12
        [461, 492, 522, 553, 584, 615, 676, 738, 799, 861, 922], // 13
        [922, 984, 1045, 1107, 1168, 1230, 1352, 1475, 1598, 1721, 1844], // 14
        [1844, 1966, 2089, 2212, 2335, 2458, 2703, 2949, 3195, 3441, 3687], // 15
        [3687, 3932, 4178, 4424, 4670, 4916, 5407, 5898, 6390, 6881, 7373], // 16
        [7373, 7864, 8355, 8847, 9338, 9830, 10797, 11764, 12731, 13698, 14665], // 17
        [14665, 15632, 16599, 17566, 18533, 19500, 21500, 23500, 25500, 27500, 29500], // 18 = 19500
        [29500, 31500, 33500, 35500, 37500, 39500, 43420, 47340, 51260, 55180, 59100], // 19 = 39500
        [59100, 63020, 66940, 70860, 74780, 78700, 86620, 94540, 102460, 110380, 118300] // 20 = 78700
    ];
    var au = decimalOrbits[orbit][flux];
    flux = flux - 5;
    var decimalOrbit = (orbit + flux / 10).toFixed(1);
    return { decimalOrbit: decimalOrbit, au: au }
}
function createBigWorld(mw, maxPop, maxTech, allowNonMWPops, permitDieback) {
    if (typeof maxTech === "undefined") { console.error("BigWorld"); }
    var planet = createPlanet(mw, "BigWorld", -1, maxPop, maxTech, allowNonMWPops, permitDieback);
    return { worldtype: "BigWorld", uwp: planet.uwp, size: planet.size, tradecodes: planet.tradecodes }
}
function createGasGiant() {
    var roll = d6();
    if (roll <= 3) { type = "Small Gas Giant"; }
    else { type = "Large Gas Giant"; }
    size = 20 + roll;
    var uwp = "Y" + ext(size) + "X0000-0";
    return { worldtype: type, uwp: uwp, size: size }
}
function createBelt(mw, maxPop, maxTech, allowNonMWPops, permitDieback) {
    var uwp = "??";
    var planet = createPlanet(mw, "Planetoid", 0, maxPop, maxTech, allowNonMWPops, permitDieback);
    return { worldtype: "Planetoid Belt", uwp: planet.uwp, maxpop: uwp.maxpop, pop: planet.pop, tradecodes: planet.tradecodes }
}
function createRing() {
    var uwp = "Y000000-0"; // TODO Rings?
    var distanceRoll = d6();
    var orbit = 0;
    if (distanceRoll <= 2) {
        orbit = 0;
    } else if (distanceRoll <= 4) {
        orbit = 1;
    } else if (distanceRoll <= 6) {
        orbit = 2;
    }
    return { worldtype: "Ring System", uwp: uwp, orbitAroundPrimary: orbit, tradecodes: [] }
}
function createInnerSatellite(mw, maxSize, maxPop, maxTech, allowNonMWPops, permitDieback) {
    var worldtype = "";
    var roll = d6();
    while (maxSize < 9 && roll === 3) { roll = d6(); }
    var type = "";
    if (roll === 1) {
        type = "Inferno";
    } else if (roll === 2) {
        type = "Inner World";
    } else if (roll === 3) {
        type = "BigWorld";
    } else if (roll === 4) {
        type = "StormWorld";
    } else if (roll === 5) {
        type = "RadWorld";
    } else if (roll === 6) {
        type = "Hospitable";
    }
    var planet = createPlanet(mw, type, maxSize, maxPop, maxTech, allowNonMWPops, permitDieback);
    var distanceRoll = d6(2);
    var orbit = "??";
    if (distanceRoll <= 7) {
        worldtype = "Close " + type + " Satellite";
        planet.tradecodes.push("Lk");
        var roll = d6() - d6();
        if (roll === -5 && planet.size < 2) { orbit = 1; /*"Bee";*/ }
        else if (roll <= -4 && planet.size < 2) { orbit = 2; /*"Cee";*/ }
        else if (roll <= -3) { orbit = 3; /*"Dee";*/ }
        else if (roll === -2) { orbit = 4; /*"Ee";*/ }
        else if (roll === -1) { orbit = 5; /*"Eff";*/ }
        else if (roll === 0) { orbit = 6; /*"Gee";*/ }
        else if (roll === 1) { orbit = 7; /*"Aitch";*/ }
        else if (roll === 2) { orbit = 8; /*"Eye";*/ }
        else if (roll === 3) { orbit = 9; /*"Jay";*/ }
        else if (roll === 4) { orbit = 10; /*"Kay";*/ }
        else if (roll === 5) { orbit = 11; /*"Ell";*/ }
    } else {
        worldtype = "Far " + type + " Satellite";
        planet.tradecodes.push("Sa");
        var roll = d6() - d6();
        if (roll === -5) { orbit = 14; /*"Oh";*/ }
        else if (roll === -4) { orbit = 15; /*"Pee";*/ }
        else if (roll === -3) { orbit = 16; /*"Que";*/ }
        else if (roll === -2) { orbit = 17; /*"Arr";*/ }
        else if (roll === -1) { orbit = 18; /* "Ess";*/ }
        else if (roll === 0) { orbit = 19; /*"Tee";*/ }
        else if (roll === 1) { orbit = 20; /*"Yu";*/ }
        else if (roll === 2) { orbit = 21; /*"Vee";*/ }
        else if (roll === 3) { orbit = 22; /*"Dub";*/ }
        else if (roll === 4) { orbit = 23; /*"Ex";*/ }
        else if (roll === 5) { orbit = 24; /*"Wye";*/ }
    }
    return { worldtype: worldtype, uwp: planet.uwp, maxpop: planet.maxpop, orbitAroundPrimary: orbit, pop: planet.pop, tradecodes: planet.tradecodes }
}
function createOuterSatellite(mw, maxSize, maxPop, maxTech, allowNonMWPops, permitDieback) {
    var worldtype = "";
    var roll = d6();
    while (maxSize < 9 && roll === 3) { roll = d6(); }
    var type = "";
    if (roll === 1) {
        type = "Worldlet";
    } else if (roll === 2) {
        type = "Iceworld";
    } else if (roll === 3) {
        type = "BigWorld";
    } else if (roll === 4) {
        type = "StormWorld";
    } else if (roll === 5) {
        type = "RadWorld";
    } else if (roll === 6) {
        type = "Iceworld";
    }
    var planet = createPlanet(mw, type, maxSize, maxPop, maxTech, allowNonMWPops, permitDieback);
    var distanceRoll = d6(2);
    var orbit = "??";
    if (distanceRoll <= 7) {
        planet.tradecodes.push("Lk");
        worldtype = "Close " + type + " Satellite";
        var roll = d6() - d6();
        if (roll === -5 && planet.size < 2) { orbit = 1; /*"Bee";*/ }
        else if (roll <= -4 && planet.size < 2) { orbit = 2; /*"Cee";*/ }
        else if (roll <= -3) { orbit = 3; /*"Dee";*/ }
        else if (roll === -2) { orbit = 4; /*"Ee";*/ }
        else if (roll === -1) { orbit = 5; /*"Eff";*/ }
        else if (roll === 0) { orbit = 6; /*"Gee";*/ }
        else if (roll === 1) { orbit = 7; /*"Aitch";*/ }
        else if (roll === 2) { orbit = 8; /*"Eye";*/ }
        else if (roll === 3) { orbit = 9; /*"Jay";*/ }
        else if (roll === 4) { orbit = 10; /*"Kay";*/ }
        else if (roll === 5) { orbit = 11; /*"Ell";*/ }
    } else {
        planet.tradecodes.push("Sa");
        worldtype = "Far " + type + " Satellite";
        var roll = d6() - d6();
        if (roll === -5) { orbit = 14; /*"Oh";*/ }
        else if (roll === -4) { orbit = 15; /*"Pee";*/ }
        else if (roll === -3) { orbit = 16; /*"Que";*/ }
        else if (roll === -2) { orbit = 17; /*"Arr";*/ }
        else if (roll === -1) { orbit = 18; /* "Ess";*/ }
        else if (roll === 0) { orbit = 19; /*"Tee";*/ }
        else if (roll === 1) { orbit = 20; /*"Yu";*/ }
        else if (roll === 2) { orbit = 21; /*"Vee";*/ }
        else if (roll === 3) { orbit = 22; /*"Dub";*/ }
        else if (roll === 4) { orbit = 23; /*"Ex";*/ }
        else if (roll === 5) { orbit = 24; /*"Wye";*/ }
    }
    return { worldtype: worldtype, uwp: planet.uwp, maxpop: planet.maxpop, orbitAroundPrimary: orbit, pop: planet.pop, tradecodes: planet.tradecodes }
}
function createPlanet(mw, type, maxSize, maxPop, maxTech, allowNonMWPops, permitDieback) {
    var size = 0;
    var techmod = 0;
    if (type === "Planetoid") {
        size = 0;
    } else if (type === "RadWorld") {
        size = d6(2);
    } else if (type === "Inferno") {
        size = 6 + d6();
    } else if (type === "BigWorld") {
        size = d6(2) + 7;
    } else if (type === "Worldlet") {
        size = d6() - 3;
    } else if (type === "Stormworld") {
        size = d6(2);
    } else {
        size = d6(2) - 2;
    }
    if (size <= 0) {
        size = 0;
    } else if (maxSize >= 0 && size > maxSize) {
        size = maxSize;
    }
    var atmo = 0;
    if (type === "Planetoid" || size === 0) {
        atmo = 0;
    } else {
        atmo = d6() - d6() + size;
        if (type === "Inferno") {
            atmo = 11;
        } else if (type === "Stormworld") {
            atmo += 4;
        }
        if (atmo < 0) { atmo = 0; }
        if (atmo > 15) { atmo = 15; }
    }
    var hydro = 0;
    if (type === "Planetoid" || size < 2 || type === "Inferno") {
        hydro = 0;
    } else {
        hydro = d6() - d6() + atmo;
        if (atmo < 2 || atmo > 9) { hydro -= 4; }
        if (type === "Inner World" || type === "Stormworld") {
            hydro -= 4;
        }
        if (hydro < 0) { hydro = 0; }
        if (hydro > 10) { hydro = 10; }
    }
    var pop = 0, pop2 = 0;
    if (type === "RadWorld" || type === "Inferno") {
        pop = 0;
        pop2 = 0;
    } else {
        pop = d6(2) - 2;
        pop2 = d6(2) - 2;
        if (type === "Iceworld" || type === "Stormworld") {
            pop -= 6;
            pop2 -= 6;
            if (pop <= 0) {
                pop2 -= 1;
            }
            if (pop2 > 0) { techmod++; }
        } else if (type === "Inner World") {
            pop -= 4;
            pop2 -= 4;
            if (pop <= 0) {
                pop2 -= 1;
            }
            if (pop2 > 0) { techmod++; }
        }
    }
    if (pop > maxPop) {
        pop = maxPop;
    }
    if (pop < 0) {
        pop = 0;
    }
    if (pop2 < 0) {
        pop2 = 0;
    }
    if (!allowNonMWPops) { pop = 0; }
    var portRoll = pop - d6(), port = "Y";
    if (portRoll <= 0) {
        port = "Y";
    } else if (portRoll <= 2) {
        port = "H";
    } else if (portRoll <= 3) {
        port = "G";
    } else if (portRoll >= 4) {
        port = "F";
    }

    var gov = 0, law = 0;
    if (pop > 0) {
        gov = d6() - d6() + pop;
        if (gov < 0) { gov = 0; }
        else if (gov > 15) { gov = 15; }
        law = d6() - d6() + gov;
        if (law < 0) { law = 0; }
        else if (law > 18) { law = 18; }
    }
    var tech = 0;
    if (type === "RadWorld" || type === "Inferno" || (pop === 0 && !permitDieback)) {
        tech = 0;
    } else {
        tech = d6();
        if (port === "F") {
            tech += 1;
        }
        if (size <= 1) { tech += 1; }
        else if (size <= 4) { tech += 1; }

        if (atmo <= 3) { tech += 1; }
        else if (atmo >= 10) { tech += 1; }

        if (hydro === 9) { tech += 1; }
        else if (hydro === 10) { tech += 2; }

        if ((pop > 0 || pop2 > 0) && pop <= 5) { tech += 1; }
        else if (pop === 9) { tech += 2; }
        else if (pop >= 10) { tech += 4; }

        if (pop > 0 && gov === 0) { tech += 1; }
        else if (gov === 5) { tech += 1; }
        else if (gov === 13) { tech -= 2; }

        if (tech < 0) { tech = 0; } else { tech = tech + techmod; }
        if (tech > maxTech) { tech = maxTech; }
        // homebrewed rules: double check for max population to cut down on dieback worlds
        if (pop === 0) {
            if (pop2 === 0) {
                tech = 0;
            }
        } else {
            pop2 = Math.max(pop, pop2);
            /*
            var isHospitable = type.indexOf("Hospitable") >= 0;
            var isBelt = type.indexOf("Belt") >= 0;
            // homebrewed rule to shift pop balance to habitable worlds
            if(isHospitable){
                pop += 1;
                if(tech < 9 && tech - 2 < mw.tech){
                    tech += 1;
                }
            }else if(!isHospitable){
                if(port === "Y"  && !isBelt){
                    pop -= 1;
                }
                // homebrewed rule to reduce insystem tech discrepencies
                if(tech < 9 && tech-1 < mw.tech){
                    tech += 1;
                    if(pop > 2 && !isBelt){
                        pop -= 1;
                    }
                }else if(tech > mw.tech){
                    pop -= 1;
                }

                // homebrewed rule to increase tech and reduce pop on harsh worlds
                if(pop > 0 && tech < 9){
                    tech += 1;
                    if(pop >= 1 && !isBelt && tech > 4){
                        pop -= 1;
                    }
                }
                
                
            }
            */
            if (pop > maxPop) { pop = maxPop; }
            if (pop <= 0) {
                pop = 0;
                gov = 0;
                law = 0;
            }
            if (tech > maxTech) { tech = maxTech; }
        }
    }
    var uwp = port + ext(size) + ext(atmo) + ext(hydro) + ext(pop) + ext(gov) + ext(law) + "-" + ext(tech);
    var tradecodes = getNonMWTradeCodes(mw, size, atmo, hydro, pop, gov, law, tech);
    return { worldtype: type, size: size, pop: pop, maxpop: pop2, uwp: uwp, tradecodes: tradecodes };
}
function getMgT2UWP(zone, maxTechLevel) {
    // if zone >= 1 hot, 0 = temperate <=-1 cold
    var uwp = "", bases = [];
    var techDM = 0;
    var size = d6(2) - 2;
    if (size <= 1) { techDM += 2; } else if (size <= 4) { techDM += 1; }
    var atmo = d6(2) - 7 + size;
    if (atmo < 0) { atmo = 0; }
    if (atmo <= 3 || atmo >= 10) { techDM += 1; }
    if (zone >= 1) {
        hzMod = 4;
        //Hot edge of habitable zone
    } else if (zone <= -1) {
        hzMod = -4;
        //Cold edge of habitable zone
    }
    else {
        hzMod = 0;
        //Habitable zone
    }
    var temp;
    if (atmo <= 1) {
        temp = "Swings between roasting and freezing.";
    } else {
        if (atmo <= 3) { atmoMod = -2; }
        else if (atmo <= 5 || atmo === 14) { atmoMod = -1; }
        else if (atmo <= 7) { atmoMod = 0; }
        else if (atmo <= 9) { atmoMod = 1; }
        else if (atmo === 10 || atmo === 13 || atmo === 15) { atmoMod = 2; }
        else { atmoMod = 6; }
        var tempRoll = d6(2) + hzMod + atmoMod;
        if (tempRoll <= 2) {
            temp = "Frozen.";
        } else if (tempRoll <= 4) {
            temp = "Cold.";
        } else if (tempRoll <= 9) {
            temp = "Temperate.";
        } else if (tempRoll <= 11) {
            temp = "Hot.";
        } else {
            temp = "Boiling.";
        }
    }
    var hydro;
    if (size <= 1) { hydro = 0; }
    else {
        var hydroDM = 0;
        var atmoDM = atmo;
        if (atmo <= 1 || atmo >= 10) { atmoDM = -4; }
        if (atmo !== 13) {
            if (temp === "Hot.") { hydroDM -= 2; }
            else if (temp === "Boiling.") { hydroDM -= 4; }
        }
        hydro = d6(2) - 7 + atmoDM + hydroDM;
        if (hydro < 0) { hydro = 0; }
    }
    if (hydro === 0 || hydro === 9) { techDM += 1; }
    else if (hydro === 10) { techDM += 2; }
    // pop
    var pop = d6(2) - 2;
    if (pop <= 5 || techDM === 8) { techDM += 1; }
    else if (pop === 9) { techDM += 2; }
    else if (pop == 10) { techDM += 4; }

    var gov, law, starport, tech;
    var hasHighPort = false;
    if (pop === 0) { gov = 0; law = 0; tech = 0; starport = "X"; }
    else {

        // gov;
        gov = d6(2) - 7 + pop;
        var corsairDM = 0;
        if (gov < 0) { gov = 0; }
        // law            
        law = d6(2) - 7 + gov;
        if (law < 0) { law = 0; }
        if (law === 0) { corsairDM = 2; } else if (law >= 2) { corsairDM = -2; }
        if (gov === 0 || gov === 5) {
            techDM += 1;
        } else if (gov === 7) { techDM += 2; }
        else if (gov === 13 || gov === 14) { techDM -= 2; }

        // starport
        var starportDM = 0;
        if (pop === 8 || pop === 9) {
            starportDM = 1;
        } else if (pop >= 10) {
            starportDM = 2;
        } else if (pop <= 2) {
            starportDM = -2;
        } else if (pop <= 4) {
            starportDM = -1;
        }
        var starportRoll = d6(2) + starportDM;
        if (starportRoll <= 2) {
            starport = "X";
            techDM -= 4;
            if (d6(2) + corsairDM >= 10) {
                bases.push("Corsair");
            }
        } else if (starportRoll <= 4) {
            starport = "E";
            if (d6(2) + corsairDM >= 10) {
                bases.push("Corsair");
            }
        } else if (starportRoll <= 6) {
            starport = "D";
            if (d6(2) >= 8) {
                bases.push("Scout");
            }
            if (d6(2) + corsairDM >= 12) {
                bases.push("Corsair");
            }

        } else if (starportRoll <= 8) {
            starport = "C";
            techDM += 2;
            if (d6(2) >= 10) {
                bases.push("Military");
            }
            if (d6(2) >= 9) {
                bases.push("Scout");
            }
        } else if (starportRoll <= 10) {
            starport = "B";
            techDM += 4;
            if (d6(2) >= 8) {
                bases.push("Military");
            }
            if (d6(2) >= 8) {
                bases.push("Naval");
            }
            if (d6(2) >= 9) {
                bases.push("Scout");
            }
        } else if (starportRoll >= 11) {
            starport = "A";

            techDM += 6;
            if (d6(2) >= 8) {
                bases.push("Military");
            }
            if (d6(2) >= 8) {
                bases.push("Naval");
            }
            if (d6(2) >= 10) {
                bases.push("Scout");
            }
        }
        //tech;
        tech = d6() + techDM;
        if (tech > maxTechLevel) { tech = maxTechLevel; }
        var highportDM = 0;
        if (tech < 9) {
            if (tech < 0) { tech = 0; }
        } else if (tech >= 9 && tech <= 11) {
            highportDM = 1;
        } else {
            highportDM = 2;
        }
        if (pop >= 9) { highportDM += 1; } else if (pop <= 6) { highportDM -= 1; }
        if (starport === "A") { hasHighPort = d6(2) + highportDM >= 6; }
        else if (starport === "B") { hasHighPort = d6(2) + highportDM >= 8; }
        else if (starport === "C") { hasHighPort = d6(2) + highportDM >= 10; }
        else if (starport === "D") { hasHighPort = d6(2) + highportDM >= 12; }
    }
    uwp = starport + ext(size) + ext(atmo) + ext(hydro) + ext(pop) + ext(gov) + ext(law) + "-" + ext(tech);
    return { uwp: uwp, bases: bases, temp: temp, hasHighPort: hasHighPort }
}
function getCepheusEngineUWP(zone, maxTechLevel) {
    // if zone >= 1 hot, 0 = temperate <=-1 cold
    var uwp = "", bases = [];
    var techDM = 0;
    var size = d6(2) - 2;
    if (size <= 1) { techDM += 2; } else if (size <= 4) { techDM += 1; }
    var atmo = d6(2) - 7 + size;
    if (atmo < 0) { atmo = 0; }
    if (atmo <= 3 || atmo >= 10) { techDM += 1; }
    if (zone >= 1) {
        hzMod = 4;
        //Hot edge of habitable zone
    } else if (zone <= -1) {
        hzMod = -4;
        //Cold edge of habitable zone
    }
    else {
        hzMod = 0;
        //Habitable zone
    }
    var temp;
    if (atmo <= 1) {
        temp = "Swings between roasting and freezing.";
    } else {
        if (atmo <= 3) { atmoMod = -2; }
        else if (atmo <= 5 || atmo === 14) { atmoMod = -1; }
        else if (atmo <= 7) { atmoMod = 0; }
        else if (atmo <= 9) { atmoMod = 1; }
        else if (atmo === 10 || atmo === 13 || atmo === 15) { atmoMod = 2; }
        else { atmoMod = 6; }
        var tempRoll = d6(2) + hzMod + atmoMod;
        if (tempRoll <= 2) {
            temp = "Frozen.";
        } else if (tempRoll <= 4) {
            temp = "Cold.";
        } else if (tempRoll <= 9) {
            temp = "Temperate.";
        } else if (tempRoll <= 11) {
            temp = "Hot.";
        } else {
            temp = "Boiling.";
        }
    }
    var hydro;
    if (size <= 1) { hydro = 0; }
    else {
        var hydroDM = 0;
        var atmoDM = atmo;
        if (atmo <= 1 || atmo >= 10) { atmoDM = -4; }
        if (atmo === 14) { atmoDM = -2; }
        if (atmo !== 13) {
            if (temp === "Hot.") { hydroDM -= 2; }
            else if (temp === "Boiling.") { hydroDM -= 4; }
        }
        hydro = d6(2) - 7 + atmoDM + hydroDM;
        if (hydro < 0) { hydro = 0; }
    }
    if (hydro === 0 || hydro === 9) { techDM += 1; }
    else if (hydro === 10) { techDM += 2; }
    // pop
    var pop = d6(2) - 2;
    var popDM = 0;
    if (size <= 2) { popDM -= 1; }
    if (atmo >= 10) { popDM -= 2; }
    else if (atmo === 6) { popDM += 3; }
    else if (atmo === 5 || atmo === 8) { popDM += 1; }
    if (hydro === 0 && atmo < 3) { popDM -= 2; }
    pop += popDM;
    if (pop < 0) { pop = 0; } else if (pop > 10) { pop = 10; }

    if (pop <= 5 || techDM === 8) { techDM += 1; }
    else if (pop === 9) { techDM += 2; }
    else if (pop == 10) { techDM += 4; }

    var gov, law, starport, tech;

    if (pop === 0) { gov = 0; law = 0; tech = 0; starport = "X"; }
    else {
        // gov;
        gov = d6(2) - 7 + pop;
        if (gov < 0) { gov = 0; }
        if (gov > 15) { gov = 15; }
        // law            
        law = d6(2) - 7 + gov;
        if (law < 0) { law = 0; }
        if (law > 10) { law = 10; }
        if (gov === 0 || gov === 5) {
            techDM += 1;
        } else if (gov === 7) { techDM += 2; }
        else if (gov === 13 || gov === 14) { techDM -= 2; }

        // starport
        var starportRoll = d6(2) + pop;
        if (starportRoll <= 2) {
            starport = "X";
            techDM -= 4;
            if (d6(2) === 12) {
                bases.push("Pirate");
            }
        } else if (starportRoll <= 4) {
            starport = "E";
            if (d6(2) === 12) {
                bases.push("Pirate");
            }
        } else if (starportRoll <= 6) {
            starport = "D";
            if (d6(2) >= 7) {
                bases.push("Scout");
            }
            if (d6(2) === 12) {
                bases.push("Pirate");
            }

        } else if (starportRoll <= 8) {
            starport = "C";
            techDM += 2;
            if (d6(2) === 12) {
                bases.push("Pirate");
            }
            if (d6(2) >= 8) {
                bases.push("Scout");
            }
        } else if (starportRoll <= 10) {
            starport = "B";
            techDM += 4;
            if (d6(2) >= 8) {
                bases.push("Naval");
            } else {
                if (d6(2) === 12) {
                    bases.push("Pirate");
                }
            }
            if (d6(2) >= 9) {
                bases.push("Scout");
            }
        } else if (starportRoll >= 11) {
            starport = "A";
            techDM += 6;
            if (d6(2) >= 8) {
                bases.push("Naval");
            }
            if (d6(2) >= 10) {
                bases.push("Scout");
            }
        }
        //tech;
        tech = d6() + techDM;
        if (tech < 0) { tech = 0; }
        if (tech < 4 && (pop >= 6 && (hydro === 0 || hydro === 10))) {
            tech = 4;
        }
        if (tech < 5 && (atmo === 4 || atmo === 7 || atmo === 9)) {
            tech = 5;
        }
        if (tech < 7) {
            if (atmo <= 3 || (atmo >= 10 && atmo <= 12)) { tech = 7; }
            if (hydro === 10 && (atmo === 14 || atmo === 13)) { tech = 7; }
        }
        if (tech > maxTechLevel) { tech = maxTechLevel; }
    }
    uwp = starport + ext(size) + ext(atmo) + ext(hydro) + ext(pop) + ext(gov) + ext(law) + "-" + ext(tech);
    return { uwp: uwp, bases: bases, temp: temp }
}
function getNonMWTradeCodes(mw, size, atmo, hydro, pop, gov, law, tech) {
    var codes = [];
    // planetary
    if (size === 0 && atmo === 0 && hydro === 0) { codes.push("As"); }
    else if (atmo >= 2 && atmo <= 9 && hydro === 0) { codes.push("De"); }
    else if (atmo >= 10 && atmo <= 12 && hydro >= 1) { codes.push("Fl"); }
    else if (size >= 6 && size <= 8 && (atmo === 5 || atmo === 6 || atmo === 8) && hydro >= 5 && hydro <= 7) { codes.push("Ga"); }
    else if (atmo <= 1 && hydro >= 1) { codes.push("Ic"); }
    else if (size >= 10 && atmo >= 3 && (atmo <= 9 || atmo >= 13) && hydro >= 10) { codes.push("Oc"); }
    else if (size <= 9 && atmo >= 3 && (atmo <= 9 || atmo >= 13) && hydro >= 10) { codes.push("Wa"); }
    if (size >= 3 && (atmo === 2 || atmo === 4 || atmo === 7 || (atmo >= 9 && atmo <= 12)) && hydro <= 2) { codes.push("He"); }
    // population
    if (pop === 0 && gov === 0 && law === 0) { codes.push("Ba"); if (tech > 0) { codes.push("Di"); } }
    else if (pop <= 3) { codes.push("Lo"); }
    else if (pop <= 6) { codes.push("Ni"); }
    else if (pop === 8) { codes.push("Ph"); }
    else if (pop >= 9) { codes.push("Hi"); }
    // economic
    if (atmo >= 4 && atmo <= 9 && hydro >= 4 && hydro <= 8) {
        if (pop == 4 || pop === 8) { codes.push("Pa"); }
        else if (pop >= 5 && pop <= 7) { codes.push("Ag"); }
    }
    else if (atmo <= 3 && hydro <= 3 && pop >= 6) {
        codes.push("Na");
    }
    if ((atmo <= 2 || atmo === 4 || atmo === 7 || atmo === 9) && (pop === 7 || pop === 8)) {
        codes.push("Pi");
    } else if ((atmo <= 2 || atmo === 4 || atmo === 7 || (atmo >= 9 && atmo <= 12)) && pop >= 9) {
        codes.push("In");
    }
    if (atmo >= 2 && atmo <= 5 && hydro <= 3) {
        codes.push("Po");
    } else if (atmo === 6 || atmo === 8) {
        if (pop === 5 || pop === 9) { codes.push("Pr"); }
        else if (pop >= 6 && pop <= 8) { codes.push("Ri"); }
    }
    // secondary 
    if (pop >= 2 && pop <= 6 && mw.tradecodes.indexOf("In") >= 0) { codes.push("Mi"); }
    if ((atmo === 2 || atmo === 3 || atmo === 10 || atmo === 11) && hydro >= 1 && hydro <= 5 && pop >= 3 && pop <= 6 && gov === 6 && law >= 6 && law <= 9) {
        codes.push("Pe");
    }
    else if (pop <= 4 && gov === 6 && (law === 0 || law === 4 || law === 5)) {
        codes.push("Re");
    } else if (gov === 6) {
        codes.push("Mr");
    }
    return codes;
}
function createOtherWorld(mw, orbit, hzorbit, maxPop, maxTech, allowNonMWPops, permitDieback, applyHillSphereLimit) {
    var uwp = "??Y000000-0", planet = {};
    var type = "Other World";
    var moons = new Array(26), moonCount = 0, moonRoll = d6();
    if (typeof mw === "undefined") {
        return { worldtype: type, uwp: uwp }; // {worldtype:"Other World", uwp:"??Y000000-0"}
    } else {
        var diff = orbit - hzorbit;
        if (diff <= 1) {
            // Inner and HZ Worlds
            var roll = d6();
            if (roll === 1) {
                type = "Inferno";
            } else if (roll === 2) {
                type = "Inner World";
            } else if (roll === 3) {
                type = "BigWorld";
            } else if (roll === 4) {
                type = "StormWorld";
            } else if (roll === 5) {
                type = "RadWorld";
            } else if (roll === 6) {
                type = "Hospitable";
            }
            planet = createPlanet(mw, type, -1, maxPop, maxTech, allowNonMWPops, permitDieback);
            if (diff === 0) {
                while (moonRoll - 4 === 0) {
                    moons = addSatellite(moons, createRing(), planet.size, applyHillSphereLimit, orbit, hzorbit);
                    moonRoll = d6();
                }
                moonCount = Math.max(moonRoll - 4, 0);
            } else {
                while (moonRoll - 5 === 0) {
                    moons = addSatellite(moons, createRing(), planet.size, applyHillSphereLimit, orbit, hzorbit);
                    moonRoll = d6();
                }
                moonCount = Math.max(moonRoll - 5, 0);
            }
            for (var i = 0; i < moonCount; i++) {
                moons = addSatellite(moons, createInnerSatellite(mw, planet.size, maxPop, maxTech, allowNonMWPops, permitDieback), planet.size, applyHillSphereLimit, orbit, hzorbit)
            }
        } else if (diff > 1) {
            // outer worlds
            var roll = d6();
            if (roll === 1) {
                type = "Worldlet";
            } else if (roll === 2) {
                type = "Iceworld";
            } else if (roll === 3) {
                type = "BigWorld";
            } else if (roll === 4) {
                type = "Iceworld";
            } else if (roll === 5) {
                type = "RadWorld";
            } else if (roll === 6) {
                type = "Iceworld";
            }
            planet = createPlanet(mw, type, -1, maxPop, maxTech);
            while (moonRoll - 3 === 0) {
                moons = addSatellite(moons, createRing(), planet.size, applyHillSphereLimit, orbit, hzorbit);
                moonRoll = d6();
            }
            moonCount = Math.max(moonRoll - 3, 0);
            for (var i = 0; i < moonCount; i++) {
                moons = addSatellite(moons, createOuterSatellite(mw, planet.size, maxPop, maxTech, allowNonMWPops), planet.size, applyHillSphereLimit, orbit, hzorbit)
            }
        }
    }

    return { worldtype: type, uwp: planet.uwp, orbit: planet.orbit, pop: planet.pop, maxpop: planet.maxpop, satellites: moons, tradecodes: planet.tradecodes }
}
function getStar(type, decimal, size, maxOrbits) {
    var star = {}
    var minOrbit = 0;
    if (type == -6) {
        if (d6() == 1) {
            star.type = "O";
            if (size <= -5) { star.size = "Ia"; star.HZOrbit = 15; minOrbit = 8; }
            else if (size <= -4) { star.size = "Ib"; star.HZOrbit = 15; minOrbit = 8; }
            else if (size <= -3) { star.size = "II"; star.HZOrbit = 14; minOrbit = 8; }
            else if (size <= 0) { star.size = "III"; star.HZOrbit = 13; minOrbit = 8; }
            else if (size <= 3) {
                star.size = "V"; star.HZOrbit = 11;
                if (decimal <= 3) {
                    minOrbit = 8; // radius *= 13.43 
                } else if (decimal <= 4) {
                    minOrbit = 8;// radius *= 12.13
                } else if (decimal <= 5) {
                    minOrbit = 8; // radius *= 11.45
                } else if (decimal <= 6) {
                    minOrbit = 8; // radius *= 10.27
                } else if (decimal <= 7) {
                    minOrbit = 7; // radius *= 9.42
                } else if (decimal <= 8) {
                    minOrbit = 7; // radius *= 8.47
                } else if (decimal > 8) {
                    minOrbit = 7; // radius *= 7.72
                }
            }
            else if (size <= 4) { star.size = "IV"; star.HZOrbit = 12; minOrbit = 8; }
            else if (size <= 5) { star.size = "D"; star.HZOrbit = 1; }
            else { star.size = "IV"; star.HZOrbit = 12; minOrbit = 8; }
            if (minOrbit === 8) { star.glimit = 10; star.jlimit = 13; star.mlimit = 16; }
        } else {
            star.type = "B";
            if (size <= -5) { star.size = "Ia"; star.HZOrbit = 13; minOrbit = 8; }
            else if (size <= -4) { star.size = "Ib"; star.HZOrbit = 13; minOrbit = 8; }
            else if (size <= -3) { star.size = "II"; star.HZOrbit = 12; minOrbit = 7; }
            else if (size <= 1) { star.size = "III"; star.HZOrbit = 11; minOrbit = 7; }
            else if (size <= 3) {
                star.size = "V"; star.HZOrbit = 9;
                if (decimal <= 0) {
                    minOrbit = 7; // radius *= 7.16 
                } else if (decimal <= 1) {
                    minOrbit = 7; // radius *= 5.71
                } else if (decimal <= 2) {
                    minOrbit = 6; // radius *= 4.06
                } else if (decimal <= 3) {
                    minOrbit = 6; // radius *= 3.61
                } else if (decimal <= 4) {
                    minOrbit = 6; // radius *= 3.46
                } else if (decimal <= 5) {
                    minOrbit = 6; // radius *= 3.36
                } else if (decimal <= 6) {
                    minOrbit = 6; // radius *= 3.27
                } else if (decimal <= 7) {
                    minOrbit = 6; // radius *= 2.94
                } else if (decimal <= 8) {
                    minOrbit = 6; // radius *= 2.86
                } else if (decimal >= 9) {
                    minOrbit = 5; // radius *= 2.49
                }
            }
            else if (size <= 4) { star.size = "IV"; star.HZOrbit = 10; }
            else if (size <= 5) { star.size = "D"; star.HZOrbit = 0; }
            else { star.size = "IV"; star.HZOrbit = 10; }
            if (minOrbit === 8) { star.glimit = 10; star.jlimit = 13; star.mlimit = 16; }
            else if (minOrbit === 7) { star.glimit = 9; star.jlimit = 12; star.mlimit = 15; }
            else if (minOrbit === 6) { star.glimit = 8; star.jlimit = 11; star.mlimit = 14; }
            else if (minOrbit === 5) { star.glimit = 7; star.jlimit = 10; star.mlimit = 13; }
        }
    }
    else if (type <= -4) {
        star.type = "A";
        if (size <= -5) {
            star.size = "Ia"; star.HZOrbit = 12;
            minOrbit = 5;
            if (decimal < 5) {
                star.glimit = 7; star.jlimit = 10; star.mlimit = 13;
            } else {
                star.glimit = 7; star.jlimit = 9; star.mlimit = 14;
            }
        }
        else if (size <= -4) {
            star.size = "Ib"; star.HZOrbit = 11;
            if (decimal <= 5) { minOrbit = 2; }
            else if (decimal > 5) { minOrbit = 3; }
            star.glimit = 5; star.jlimit = 9; star.mlimit = 12;

        }
        else if (size <= -3) {
            star.size = "II"; star.HZOrbit = 9; minOrbit = 1;
            if (decimal < 5) {
                star.glimit = 4; star.jlimit = 7; star.mlimit = 11;
            } else {
                star.glimit = 3; star.jlimit = 7; star.mlimit = 10;
            }

        }
        else if (size <= -2) {
            star.size = "III"; star.HZOrbit = 7; minOrbit = 1;
            if (decimal < 5) {
                star.glimit = 1; star.jlimit = 6; star.mlimit = 9;
            } else {
                star.glimit = 1; star.jlimit = 5; star.mlimit = 9;
            }
        }
        else if (size <= -1) {
            star.size = "IV"; star.HZOrbit = 7;
            if (decimal < 5) {
                star.glimit = 1; star.jlimit = 5; star.mlimit = 9;
            } else {
                star.glimit = 0; star.jlimit = 4; star.mlimit = 8;
            }

        }
        else if (size <= 4) {
            star.size = "V"; star.HZOrbit = 7;
            if (decimal < 5) {
                star.glimit = 0; star.jlimit = 5; star.mlimit = 8;
            } else {
                star.glimit = -1; star.jlimit = 4; star.mlimit = 7;
            }

        }
        else if (size <= 5) { star.size = "D"; star.HZOrbit = 0; star.glimit = -1; star.jlimit = -1; star.mlimit = -1; }
        else {
            star.size = "V"; star.HZOrbit = 7; if (decimal < 5) {
                star.glimit = 0; star.jlimit = 5; star.mlimit = 8;
            } else {
                star.glimit = -1; star.jlimit = 4; star.mlimit = 7;
            }
        }
    } // refer to page 31, table 10D gravitic drive limit
    else if (type <= -2) {
        star.type = "F";
        if (size <= -5) {
            star.size = "II"; star.HZOrbit = 9;
            if (decimal <= 5) { minOrbit = 1; } else { minOrbit = 2; }
            if (decimal < 5) {
                star.glimit = 3; star.jlimit = 7; star.mlimit = 10;
            } else {
                star.glimit = 4; star.jlimit = 7; star.mlimit = 11;
            }
        }
        else if (size <= -4) {
            star.size = "III"; star.HZOrbit = 6; minOrbit = 1;
            star.glimit = 1; star.jlimit = 5; star.mlimit = 9;
        }
        else if (size <= -3) { star.size = "IV"; star.HZOrbit = 6; star.glimit = 0; star.jlimit = 4; star.mlimit = 8; }
        else if (size <= 3) { star.size = "V"; star.HZOrbit = 5; star.glimit = -1; star.jlimit = 3; star.mlimit = 7; }
        else if (size <= 4) { star.size = "VI"; star.HZOrbit = 3; star.glimit = -1; star.jlimit = 3; star.mlimit = 7; }
        else if (size <= 5) { star.size = "D"; star.HZOrbit = 0; star.glimit = -1; star.jlimit = -1; star.mlimit = -1; }
        else { star.size = "VI"; star.HZOrbit = 3; star.HZOrbit = 3; star.glimit = -1; star.jlimit = 3; star.mlimit = 7; }
    }
    else if (type <= 0) {
        star.type = "G";
        if (size <= -5) {
            star.size = "II"; star.HZOrbit = 9;
            if (decimal <= 5) { minOrbit = 2; } else { minOrbit = 3; }
            if (decimal < 5) { star.glimit = 4; star.jlimit = 8; star.mlimit = 11; } else {
                star.glimit = 5; star.jlimit = 8; star.mlimit = 12;
            }
        }
        else if (size <= -4) {
            star.size = "III"; star.HZOrbit = 7; minOrbit = 1;
            if (decimal < 5) { star.glimit = 1; star.jlimit = 6; star.mlimit = 9; } else {
                star.glimit = 3; star.jlimit = 7; star.mlimit = 10;
            }
        }
        else if (size <= -3) {
            star.size = "IV"; star.HZOrbit = 5;
            star.glimit = 0; star.jlimit = 4; star.mlimit = 8;
        }
        else if (size <= 3) {
            star.size = "V"; star.HZOrbit = 3;
            star.glimit = -1; star.jlimit = 2; star.mlimit = 6;
        }
        else if (size <= 4) {
            star.size = "VI"; star.HZOrbit = 2;
            star.glimit = -1;
            if (decimal < 5) { star.jlimit = 2; star.mlimit = 6; } else {
                star.jlimit = 1; star.mlimit = 5;
            }
        }
        else if (size <= 5) { star.size = "D"; star.HZOrbit = 0; star.glimit = -1; star.jlimit = -1; star.mlimit = -1; }
        else {
            star.size = "VI"; star.HZOrbit = 3;
            if (decimal < 5) { star.jlimit = 2; star.mlimit = 6; } else {
                star.jlimit = 1; star.mlimit = 5;
            }
        }
    }
    else if (type <= 2) {
        star.type = "K";
        if (size <= -5) {
            star.size = "II"; star.HZOrbit = 9;
            if (decimal <= 1) {
                minOrbit = 3;
                star.glimit = 6; star.jlimit = 9; star.mlimit = 12;
            } else if (decimal < 5) {
                minOrbit = 4;
                star.glimit = 6; star.jlimit = 9; star.mlimit = 12;
            } else {
                minOrbit = 5;
                star.glimit = 7; star.jlimit = 10; star.mlimit = 13;
            }
        }
        else if (size <= -4) {
            star.size = "III"; star.HZOrbit = 8;
            if (decimal < 5) {
                minOrbit = 1;
                star.glimit = 3; star.jlimit = 7; star.mlimit = 10;
            } else {
                minOrbit = 2;
                star.glimit = 5; star.jlimit = 9; star.mlimit = 12;
            }

        }
        else if (size <= -3) {
            star.size = "IV"; star.HZOrbit = 5;
            star.glimit = -1; star.jlimit = 5; star.mlimit = 8;
        }
        else if (size <= 3) {
            star.size = "V"; star.HZOrbit = 2;
            star.glimit = -1; star.mlimit = 6;
            if (decimal < 5) {
                star.jlimit = 2;
            } else {
                star.jlimit = 1;
            }
        }
        else if (size <= 4) {
            star.size = "VI"; star.HZOrbit = 1;
            star.glimit = -1; star.jlimit = 0; star.mlimit = 5;
        }
        else if (size <= 5) {
            star.size = "D"; star.HZOrbit = 0;
            star.glimit = -1; star.jlimit = -1; star.mlimit = -1;
        }
        else {
            star.size = "VI"; star.HZOrbit = 1;
            star.glimit = -1; star.jlimit = 0; star.mlimit = 5;
        }
    }
    else if (type <= 5) {
        star.type = "M";
        if (size <= -3) {
            star.size = "II"; star.HZOrbit = 10;
            if (decimal < 5) {
                minOrbit = 6;
                star.glimit = 8; star.jlimit = 11; star.mlimit = 14;
            } else if (decimal < 9) {
                minOrbit = 7;
                star.glimit = 9; star.jlimit = 13; star.mlimit = 16;
            } else {
                minOrbit = 8;
                star.glimit = 10; star.jlimit = 13; star.mlimit = 16;
            }
        }
        else if (size <= -2) {
            star.size = "III"; star.HZOrbit = 9;
            if (decimal < 5) {
                minOrbit = 3;
                star.glimit = 6; star.jlimit = 9; star.mlimit = 12;
            } else if (decimal < 9) {
                minOrbit = 6;
                star.glimit = 8; star.jlimit = 11; star.mlimit = 14;
            } else if (decimal === 9) {
                minOrbit = 7;
                star.glimit = 8; star.jlimit = 12; star.mlimit = 15;
            }
        }
        else if (size <= 3) {
            star.size = "V"; star.HZOrbit = 0;
            star.glimit = -1;
            if (decimal < 5) {
                star.jlimit = 1; star.mlimit = 5;
            } else if (decimal < 9) {
                star.jlimit = 0; star.mlimit = 5;
            } else {
                star.jlimit = -1; star.mlimit = 4;
            }
        }
        else if (size <= 4) {
            star.size = "VI"; star.HZOrbit = 0;
            star.glimit = -1; star.jlimit = -1;
            if (decimal < 5) { star.jlimit = 0; star.mlimit = 4; }
            else if (decimal < 9) { star.mlimit = 2; } else { star.mlimit = 1; }
        }
        else if (size <= 5) {
            star.size = "D"; star.HZOrbit = 0;
            star.glimit = -1; star.jlimit = -1; star.mlimit = -1;
        }
        else {
            star.size = "VI"; star.HZOrbit = 0; star.glimit = -1; star.jlimit = -1;
            if (decimal < 5) { star.jlimit = 0; star.mlimit = 4; }
            else if (decimal < 9) { star.mlimit = 2; }
            else { star.mlimit = 1; }
        }
    }
    else { star.type = "BD"; star.HZOrbit = 0; star.glimit = -1; star.jlimit = -1; star.mlimit = -1; }
    if (star.size !== "D") { star.decimal = decimal; }
    if (maxOrbits > 0) {
        star.satellites = new Array(maxOrbits);
        star.numOrbits = maxOrbits;
    } else {
        star.satellites = [];
        star.numOrbits = 0;
    }
    var decimalOrbits = [
        .2,
        .4,
        .7,
        1,
        1.6,
        2.8,
        5.2,
        10,
        20,
        40,
        77,
        154,
        308,
        615,
        1230,
        2458,
        4916,
        9830,
        19500,
        39500,
        78700
    ];
    for (var i = 0; i < minOrbit; i++) {
        if (minOrbit - 1 === i) {
            star.satellites[i] = { worldtype: "Solar Surface", uwp: (star.size === "D" ? ("D") : star.type + (typeof star.decimal === "undefined" ? "" : star.decimal.toString()) + " " + star.size), decimalOrbit: i.toFixed(1), au: decimalOrbits[i] };
            star.numOrbits -= 1;
        } else {
            star.satellites[i] = { worldtype: "Occupied", uwp: (star.size === "D" ? ("D") : star.type + (typeof star.decimal === "undefined" ? "" : star.decimal.toString()) + " " + star.size), decimalOrbit: i.toFixed(1), au: decimalOrbits[i] };
            star.numOrbits -= 1;
        }
    }
    //star.numOrbits = maxOrbits - minOrbit;
    if (star.numOrbits < 0) { star.numOrbits = 0; }
    return star;
}
function d6(num) {

    if (!num) { num = 1; }
    var sum = 0;
    for (var i = 0; i < num; i++) {
        sum += ((MathRandom() * 6) >>> 0) + 1;
    }

    return sum;
}

function d09() {
    //returns 0-9 even distribution
    var r1 = d6(), r2 = d6(), x;
    while (r1 == 6) { r1 = d6(); }
    x = (r1 - 1) * 2;
    if (r2 >= 4) { x += 1; }
    return x;
}
function d19() {
    //returns 1-9 even distribution
    var r1 = d6(), r2 = d6(), x;
    function eq(t1, t2) {
        return r1 === t1 && r2 === t2;
    }
    if (eq(1, 1) || eq(1, 4) || eq(4, 1) || eq(4, 4)) {
        x = 1;
    } else if (eq(2, 1) || eq(2, 4) || eq(5, 1) || eq(5, 4)) {
        x = 2;
    } else if (eq(3, 1) || eq(3, 4) || eq(6, 1) || eq(6, 4)) {
        x = 3;
    } else if (eq(1, 2) || eq(1, 5) || eq(4, 2) || eq(4, 5)) {
        x = 4;
    } else if (eq(2, 2) || eq(2, 5) || eq(5, 2) || eq(5, 5)) {
        x = 5;
    } else if (eq(3, 2) || eq(3, 5) || eq(6, 2) || eq(6, 5)) {
        x = 6;
    } else if (eq(1, 3) || eq(1, 6) || eq(4, 3) || eq(4, 6)) {
        x = 7;
    } else if (eq(2, 3) || eq(2, 6) || eq(5, 3) || eq(5, 6)) {
        x = 8;
    } else if (eq(3, 3) || eq(3, 6) || eq(6, 3) || eq(6, 6)) {
        x = 9;
    }
    return x;
}
