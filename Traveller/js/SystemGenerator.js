var MathRandom = pseudoRandomNumberGenerator((Math.random()*1000000).toString());
function pseudoRandomNumberGenerator(word){
    var seed = xmur3(word);
    var a = seed(), b = seed(), c = seed(), d = seed();
    return xoshiro128ss(a, b, c, d);
}
function xmur3(str) {
    for(var i = 0, h = 1779033703 ^ str.length; i < str.length; i++) {
        h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
        h = h << 13 | h >>> 19;
    } return function() {
        h = Math.imul(h ^ (h >>> 16), 2246822507);
        h = Math.imul(h ^ (h >>> 13), 3266489909);
        return (h ^= h >>> 16) >>> 0;
    }
}
function xoshiro128ss(a, b, c, d) {
    return function() {
        var t = b << 9, r = a * 5; r = (r << 7 | r >>> 25) * 9;
        c ^= a; d ^= b;
        b ^= c; a ^= d; c ^= t;
        d = d << 11 | d >>> 21;
        return (r >>> 0) / 4294967296;
    }
}
function ext(num){
    if(num <= 17){
        return num.toString(36).toUpperCase();
    }else{
        if(num <= 22){
            return (num+1).toString(36).toUpperCase();
        }else{
            return (num+2).toString(36).toUpperCase();
        }
    }
}
function generateSystemDetails(name, gasGiantFrequency, permitDieback, maxTechLevel, diebackPenalty, ruleset, allowNonMWPops){
    
    if(typeof ruleset === "undefined"){ ruleset = "T5";}
    if(typeof diebackPenalty === "undefined"){ diebackPenalty = 2;}
    if(typeof allowNonMWPops === "undefined"){allowNonMWPops = true;}
    
    var planetoidBelts = Math.max(d6()-3,0);
    var gg = d6(2) <= gasGiantFrequency ? Math.max(((d6(2)/2) >> 0) - 2,1) : 0;
    var roll;
    var uwp = "",popdigit = 0,totalpop=0;
    var tradecodes = [];
    var stars = {primary:{},primary_companion:false,close:false,near:false, near_companion:false,close_companion:false,far:false, far_companion:false};
    var primaryType = d6()-d6(),
        primaryDecimal = d09(),
        primarySize = d6()-d6();
    stars.primary = getStar(primaryType,primaryDecimal,primarySize,20);
    stars.primary.worldtype = "primary star";
    //stars.primary.numOrbits = 20;
    //stars.primary.satellites = new Array(20);
    var primarySurface = getInnermostOrbit(stars.primary);
    var secondaryOrbitDeduction = 2;
    if(primarySurface > -1){ 
        secondaryOrbitDeduction += primarySurface;
    }
    if(d6()-d6()>=3){ 
        stars.primary_companion = getStar(primaryType+d6()-1,d09(),primarySize+d6()+2,0);
        var starOrbit = 0;
        //stars.primary_companion.numOrbits = 0;
        if(primarySurface > -1){
            stars.primary_companion.worldtype = "companion star";
            stars.primary.satellites[primarySurface] = stars.primary_companion; //{worldtype:"companion star", details:stars.primary_companion};
            starOrbit = primarySurface;
        }
        let starOrbitDetails = createOrbitDetails(starOrbit);
        stars.primary_companion.decimalOrbit = starOrbitDetails.decimalOrbit;
        stars.primary_companion.au = starOrbitDetails.au;  
    }
    if(d6()-d6()>=3){ 
        var closeOrbit = d6()-1
        stars.close = getStar(primaryType+d6()-1,d09(),primarySize+d6()+2, closeOrbit > secondaryOrbitDeduction+1 ? closeOrbit - secondaryOrbitDeduction : 0);
        stars.close.orbit = closeOrbit;   
         
        if(d6()-d6()>=3){ 
            stars.close_companion = getStar(primaryType+d6()-1,d09(),primarySize+d6()+2, 0);
            let inner = getInnermostOrbit(stars.close);
            if(inner > -1){
                stars.close_companion.worldtype = "close companion star";
                let closeCompanionDetails = createOrbitDetails(inner);
                stars.close_companion.decimalOrbit = closeCompanionDetails.decimalOrbit;
                stars.close_companion.au = closeCompanionDetails.au;  
                stars.close.satellites[inner] = stars.close_companion; //{worldtype:"close companion star",details:stars.close_companion};
            }
            
        }
        stars.close.worldtype = "close star";
        if(typeof stars.primary.satellites[closeOrbit] === "undefined"){
            stars.primary.satellites[closeOrbit] = stars.close;
            let starOrbitDetails = createOrbitDetails(closeOrbit);
            stars.close.decimalOrbit = starOrbitDetails.decimalOrbit;
            stars.close.au = starOrbitDetails.au;  
        }else{
            var amp = 1;
            while(typeof stars.primary.satellites[closeOrbit+amp] !== "undefined"){
                amp++;
            }
            stars.close.orbit = closeOrbit + amp;  
            let starOrbitDetails = createOrbitDetails(closeOrbit + amp);
            stars.close.decimalOrbit = starOrbitDetails.decimalOrbit;
            stars.close.au = starOrbitDetails.au;  
            stars.primary.satellites[stars.close.orbit+amp] = stars.close;
        }
    }
    if(d6()-d6()>=3){ 
        var nearOrbit = 5 + d6();
        stars.near = getStar(primaryType+d6()-1,d09(),primarySize+d6()+2, nearOrbit-secondaryOrbitDeduction);
        stars.near.orbit = nearOrbit;
        //stars.near.numOrbits = stars.near.orbit - 2;
        //stars.near.satellites = new Array(stars.near.numOrbits);
        if(d6()-d6()>=3){ 
            stars.near_companion = getStar(primaryType+d6()-1,d09(),primarySize+d6()+2,0);
            //stars.near_companion.numOrbits = 0;
            let inner = getInnermostOrbit(stars.near);
            if(inner > -1){
                let nearCompanionDetails = createOrbitDetails(inner);
                stars.near_companion.decimalOrbit = nearCompanionDetails.decimalOrbit;
                stars.near_companion.au = nearCompanionDetails.au;  
                stars.near_companion.worldtype = "near companion star";
                stars.near.satellites[inner] = stars.near_companion; //{worldtype:"near companion star", details:stars.near_companion};
            }
        }
        stars.near.worldtype = "near star";
        if(typeof stars.primary.satellites[nearOrbit] === "undefined"){
            stars.primary.satellites[nearOrbit] = stars.near;
            let starOrbitDetails = createOrbitDetails(nearOrbit);
            stars.near.decimalOrbit = starOrbitDetails.decimalOrbit;
            stars.near.au = starOrbitDetails.au;  
        }else{
            var amp = 1;
            while(typeof stars.primary.satellites[nearOrbit+amp] !== "undefined"){
                amp++;
            }
            stars.near.orbit = nearOrbit + amp;  
            let starOrbitDetails = createOrbitDetails(nearOrbit + amp);
            stars.near.decimalOrbit = starOrbitDetails.decimalOrbit;
            stars.near.au = starOrbitDetails.au;
            stars.primary.satellites[stars.near.orbit+amp] = stars.near;
        }
    }
    if(d6()-d6()>=3){ 
        var farOrbit = 11 + d6();
        stars.far = getStar(primaryType+d6()-1,d09(),primarySize+d6()+2, farOrbit-secondaryOrbitDeduction);
        stars.far.orbit = farOrbit;
        //stars.far.numOrbits = stars.far.orbit - 2;
        //stars.far.satellites = new Array(stars.far.numOrbits);
        if(d6()-d6()>=3){ 
            stars.far_companion = getStar(primaryType+d6()-1,d09(),primarySize+d6()+2,0);
            //stars.far_companion.numOrbits = 0;
            let inner = getInnermostOrbit(stars.far);
            if(inner > -1){
                let farCompanionDetails = createOrbitDetails(inner);
                stars.far_companion.decimalOrbit = farCompanionDetails.decimalOrbit;
                stars.far_companion.au = farCompanionDetails.au; 
                stars.far_companion.worldtype = "far companion star";
                stars.far.satellites[inner] = stars.far_companion;
            }
        }
        stars.far.worldtype = "far star";
        if(typeof stars.primary.satellites[farOrbit] === "undefined"){
            let starOrbitDetails = createOrbitDetails(farOrbit);
            stars.far.decimalOrbit = starOrbitDetails.decimalOrbit;
            stars.far.au = starOrbitDetails.au;
            stars.primary.satellites[farOrbit] = stars.far;
        }else{
            var amp = 1;
            while(typeof stars.primary.satellites[farOrbit+amp] !== "undefined"){
                amp++;
            }
            stars.far.orbit = farOrbit + amp; 
            let starOrbitDetails = createOrbitDetails(farOrbit+amp);
            stars.far.decimalOrbit = starOrbitDetails.decimalOrbit;
            stars.far.au = starOrbitDetails.au; 
            stars.primary.satellites[stars.far.orbit+amp] = stars.far;
        }
    }
    
    var bases = [];
    roll = d6(2); // roll for starport
    var starport;
    if(roll <= 4){
        starport = "A";
        if(d6(2)<=6){ 
            if(d6(2)<=4){
                bases.push("Naval Depot");
            }else{ bases.push("Naval");}
        }
        if(d6(2)<=4){ 
            if(d6(2)<=7){
                bases.push("Way Station");
            }else{ bases.push("Scout");}
        }
    }
    else if(roll <= 6){
        starport = "B";
        if(d6(2)<=5){ bases.push("Naval");}
        if(d6(2)<=5){ bases.push("Scout");}
    }
    else if(roll <= 8){
        starport = "C";
        if(d6(2)<=6){bases.push("Scout");}
    }
    else if(roll == 9){
        starport = "D";
        if(d6(2)<=7){bases.push("Scout");}
    }
    else if(roll <= 11){
        starport = "E";
    }
    else if(roll == 12){
        starport = "X";
    }
    // roll for size
    var size = d6(2)-2; 
    if(size === 10){ size = d6()+9; }
    uwp += size.toString(36);
    //roll for atmosphere
    var atmo = d6()-d6()+size;
    if(atmo < 0 || size === 0){ atmo = 0;}
    if(atmo > 15){atmo = 15;}
    uwp += atmo.toString(36);
    //roll for hydro
    var hydroMods = 0;
    if(atmo < 2 || atmo > 9){hydroMods = 4;}
    var hydro = d6()-d6()+atmo+hydroMods;
    if(size < 2 || hydro < 0){hydro = 0;}
    if(hydro > 10){hydro = 10;}
    uwp += hydro.toString(36);
    // roll for pop
    var pop = d6(2)-2, pop2 = d6(2)-2;
    var popdigit = 0;
    if(pop===0){
        //uwp = "X"+uwp.substring(1); 
        //starport = "X"; 
        bases = [];
        popdigit = 0;
    }else{
        popdigit = d19()
    }
    
    if(pop === 10){ pop = d6(2)+3;}
    if(pop2 === 10){ pop2 = d6(2)+3;}
    pop2 = Math.max(pop,pop2);

    uwp += pop.toString(36);
    // roll for gov
    var gov = d6()-d6()+pop;
    if(gov > 15){gov = 15;}
    if(gov < 0){gov = 0;}
    if(pop === 0){gov = 0;}
    uwp += gov.toString(36);
    // roll for law
    var law = d6()-d6()+gov;
    if(law < 0){law = 0;}
    if(law > 18){law = 18;}
    if(pop === 0){ law = 0;}
    if(law <= 17){
        uwp += law.toString(36);
    }else{
        uwp += (law+1).toString(36);
    }
    // roll for TL
    var tech = d6(1);
    if(starport === "A"){tech+=6;}
    else if(starport === "B"){tech+=4;}
    else if(starport === "C"){tech+=2;}
    else if(starport === "X"){tech -= 4;}

    if(pop > 0){
        if(size <= 1 ){tech += 2;}
        else if(size <= 4 ){tech += 1;}

        if(atmo <= 3 ){tech += 1;}
        else if(atmo >= 10 ){tech += 1;}

        if(hydro === 9 ){tech += 1;}
        else if(hydro === 10 ){tech += 2;}
        
        if(pop <= 5 ){ tech += 1; }
        else if(pop === 9){ tech += 2;}
        else if(pop >= 10){ tech += 4;}
    }
    if((tech > 0 && gov === 0) || gov === 5){ tech += 1;}
    else if(gov === 13){ tech -= 2;}

    if(pop === 0){ // reduce tech level on dieback worlds
        //var reduction = diebackPenalty;
        //tech -= reduction;
        //if(reduction > 0){
        //    if(tech <= 8 && starport === "A"){ starport = "B"; uwp = "B"+uwp.substring(1);}
        //    else if(tech <= 7 && starport === "B"){ starport = "C"; uwp = "C"+uwp.substring(1);}
        //    else if(tech <= 3 && starport === "C"){ starport = "D"; uwp = "D"+uwp.substring(1);}
        //    else if(tech === 1 && starport === "D"){ starport = "E"; uwp = "E"+uwp.substring(1);}
        //}
        if(tech > 0){
            // This will be a dieback world. Give them the tech bonuses for planet features.
            if(size <= 1 ){tech += 2;}
            else if(size <= 4 ){tech += 1;}

            if(atmo <= 3 ){tech += 1;}
            else if(atmo >= 10 ){tech += 1;}

            if(hydro === 9 ){tech += 1;}
            else if(hydro === 10 ){tech += 2;}
        }
    } 
    if(tech < 0){tech = 0;}
    if(tech > +(maxTechLevel)){
        tech = +(maxTechLevel);
    }
    if(pop === 0){ 
        if(!permitDieback || pop2 === 0){ 
            tech = 0;
        }
        if(tech===0){ // barren worlds require starport E or X
            if(starport !== "E"){
                starport = "X";
                uwp = "X" + uwp.substring(1);
            }
        }
    }
    if(tech <= 17){
        uwp += "-"+tech.toString(36);
    }else{
        uwp += "-" + ((+(tech)+1).toString(36));
    }
    // roll to see if the world is a satellite
    roll = d6()-d6();
    var MWType, MWPrimary, MWOrbitAroundPrimary;
    if(roll <=-4){ 
        MWType = "Far Satellite";
        roll = d6() - d6();
        if(roll === -5){ MWOrbitAroundPrimary = 14; /*"Oh";*/ }
        else if(roll === -4){ MWOrbitAroundPrimary = 15; /*"Pee";*/ }
        else if(roll === -3){ MWOrbitAroundPrimary = 16; /*"Que";*/ }
        else if(roll === -2){ MWOrbitAroundPrimary = 17; /*"Arr";*/ }
        else if(roll === -1){ MWOrbitAroundPrimary = 18; /*"Ess";*/ }
        else if(roll === 0){ MWOrbitAroundPrimary = 19; /*"Tee";*/ }
        else if(roll === 1){ MWOrbitAroundPrimary = 20; /*"Yu";*/ }
        else if(roll === 2){ MWOrbitAroundPrimary = 21; /*"Vee";*/ }
        else if(roll === 3){ MWOrbitAroundPrimary = 22; /*"Dub";*/ }
        else if(roll === 4){ MWOrbitAroundPrimary = 23; /*"Ex";*/ }
        else if(roll === 5){ MWOrbitAroundPrimary = 24; /*"Wye";*/ }
    }
    else if(roll <= -3){ 
        MWType = "Close Satellite";
        roll = d6() - d6();
        if(roll === -5 && size <= 2 ){ MWOrbitAroundPrimary = 1; /*"Bee";*/ }
        else if(roll <= -4 && size <= 2){ MWOrbitAroundPrimary = 2; /*"Cee";*/ }
        else if(roll <= -3){ MWOrbitAroundPrimary = 3; /*"Dee";*/ }
        else if(roll === -2){ MWOrbitAroundPrimary = 4; /*"Ee";*/ }
        else if(roll === -1){ MWOrbitAroundPrimary = 5; /*"Eff";*/ }
        else if(roll === 0){ MWOrbitAroundPrimary = 6; /*"Gee";*/ }
        else if(roll === 1){ MWOrbitAroundPrimary = 7; /*"Aitch";*/ }
        else if(roll === 2){ MWOrbitAroundPrimary = 8; /*"Eye";*/ }
        else if(roll === 3){ MWOrbitAroundPrimary = 9; /*"Jay";*/ }
        else if(roll === 4){ MWOrbitAroundPrimary = 10; /*"Kay";*/ }
        else if(roll === 5){ MWOrbitAroundPrimary = 11; /*"Ell";*/ }
    }else{ 
        if(size === 0){MWType = "Belt";} else{ MWType = "Planet";} 
        MWPrimary = "Star"; MWOrbitAroundPrimary = MWOrbit; 
    }
    if(MWType.indexOf("Satellite") > 0){
        if(gg >= 1 && d6()-d6() <= 0){
                MWPrimary = "Gas Giant";
        }else{
            MWPrimary = "Planet";
        }
    }    
    roll = d6()-d6(); // roll for mainworld orbit
    
    var MWOrbit = stars.primary.HZOrbit; var climate = "";
    if(stars.primary.type === "M"){roll += 2;}
    else if(stars.primary.type === "O" || stars.primary.type === "B"){ roll -= 2;}
    if(roll<=-6){ 
        MWOrbit -= 2; 
    }
    else if(roll <= -3){ 
        MWOrbit -=1; 
    }
    else if(roll <= 2){ MWOrbit = stars.primary.HZOrbit;  }
    else if(roll <= 5){ 
        MWOrbit += 1; 
    }
    else if(roll >= 6){ 
        MWOrbit += 2;         
    }
    if(size === 0){ // asteroid belt placement is independent of HZ
        roll = d6(2) - 3;
        MWOrbit = stars.primary.HZOrbit + roll;
    }
    if(MWOrbit < 0){ MWOrbit = 0;}
    var validOrbit = false;
    if(typeof stars.primary.satellites[MWOrbit] !== "undefined"){ // check if desired orbit already occupied (by a star)
        while(!validOrbit){ // mainworld will be placed in next available orbit
            MWOrbit += 1;
            validOrbit = typeof stars.primary.satellites[MWOrbit] === "undefined";
            
        }       
    }
    var difference = stars.primary.HZOrbit - MWOrbit;
    if(difference >= 2){
        tradecodes.push("Tr"); climate = "Hot. Tropic.";
    }else if(difference === 1){
        if(size >= 6 && size <= 9 && atmo >= 4 && atmo <= 9 && hydro >= 3 && hydro <= 7){
            tradecodes.push("Tr"); climate = "Tropic.";
        }else{
            tradecodes.push("Ho"); climate = "Hot.";
        }
    }else if(difference === 0){
        climate = "Temperate.";
    }else if(difference === -1){
        if(size >= 6 && size <= 9 && atmo >= 4 && atmo <= 9 && hydro >= 3 && hydro <= 7){
            tradecodes.push("Tu"); climate = "Tundra.";
        }else{
            tradecodes.push("Co"); climate = "Cold.";
        }
    }else if(difference <= -2){
        if(size >= 2 && size <= 9 && hydro > 0){
            tradecodes.push("Fr"); 
            climate = "Frozen.";
        }
    }
    if(MWOrbit <= 1){ tradecodes.push("Tz"); }
    
    // trade codes
    if(size === 0 && atmo === 0 && hydro === 0){ tradecodes.push("As"); }
    if(atmo >= 2 && atmo <= 9 && hydro === 0){ tradecodes.push("De"); }
    if(atmo >= 10 && atmo <= 12 && hydro >= 1){ tradecodes.push("Fl"); }
    if(size >= 6 && size <= 8 && 
        (atmo === 5 || atmo === 6 || atmo === 8) &&
        (hydro >= 5 && hydro <= 7)
    ){ 
        tradecodes.push("Ga"); 
    }
    if(size >= 3 && 
        (atmo === 2 || atmo === 4 || atmo === 7 || atmo === 9 || atmo === 10 || atmo === 11 || atmo === 12) &&
        (hydro <= 2)
    ){
        tradecodes.push("He");
    }
    if( atmo <= 1 && hydro >= 1){ tradecodes.push("Ic"); }
    if(size >= 10 && hydro === 10 && (
        (atmo >= 3 && atmo <=9) || (atmo >= 13)
    )){ tradecodes.push("Oc");}
    if(size <= 9 && hydro === 10 && (
        (atmo >= 3 && atmo <=9) || (atmo >= 13)
    )){ tradecodes.push("Wa");}
    if(atmo === 0){tradecodes.push("Va");}
    if(MWType === "Far Satellite"){ tradecodes.push("Sa"); }
    else if(MWType === "Close Satellite"){ tradecodes.push("Lk"); }
    if(pop === 0){
        
        if(tech > 0){ tradecodes.push("Di");}
        else{tradecodes.push("Ba");}
    }
    else if(pop <= 3){
        tradecodes.push("Lo");
    }else if(pop <= 6){
        tradecodes.push("Ni");
    }else if(pop === 8){
        tradecodes.push("Ph");
    }else if(pop >= 9){
        tradecodes.push("Hi");
    }
    if(atmo >= 4 && atmo <= 9 && hydro >= 4 && hydro <= 8 && (pop === 4 || pop === 8)){ tradecodes.push("Pa"); }
    if(atmo >= 4 && atmo <= 9 && hydro >= 4 && hydro <= 8 && (pop >= 5 && pop <= 7)){ tradecodes.push("Ag"); }
    if(atmo <= 3 && hydro <= 3 && pop >= 6){ tradecodes.push("Na"); }
    if(gov === 6){ // captive gov

        if( (atmo === 2 || atmo === 3 || atmo === 10 || atmo === 11) &&
        hydro <= 5 && pop >=3 && pop <= 6 && law >= 6 && law <= 9 && gov === 6
        ){
            tradecodes.push("Px");
        }else if(pop <= 4 && (law == 0 || law == 4 || law == 5)){
            tradecodes.push("Re");
        }else{
            tradecodes.push("Mr");
        }
       
    }
    if((atmo <=2 || atmo === 4 || atmo ===7 || atmo === 9) && (pop === 7 || pop === 8)){ tradecodes.push("Pi");}
    if((atmo <=2 || atmo === 4 || atmo ===7 || atmo === 9 || atmo === 10 || atmo === 11 || atmo === 12) 
        && (pop >= 9)){ tradecodes.push("In");
    }
    if(atmo >= 2 && atmo <= 5 && hydro <= 3){
        tradecodes.push("Po");
    }
    if(atmo === 6 || atmo === 8){
        if(pop === 5 || pop === 9){ tradecodes.push("Pr"); }
        else if(pop >= 6 && pop <= 8){ tradecodes.push("Ri"); }
    }
    if(pop >= 5 && pop <= 10 && gov === 6 && law <= 3){ tradecodes.push("Cy");}
    

    var importance = 0, importanceDesc = "", dailyships = "0", weeklyships = "0";
    if(starport === "A" || starport === "B"){ importance +=1; }
    else if(starport === "D" || starport === "E" || starport === "X"){ importance -= 1;}
    if(tech >= 16){importance += 1;}
    if(tech >= 10){importance += 1;}
    if(tech <= 8){importance -= 1;}
    if(tradecodes.indexOf("Ag")>=0){ importance += 1;}
    if(tradecodes.indexOf("Hi")>=0){ importance += 1;}
    if(tradecodes.indexOf("In")>=0){ importance += 1;}
    if(tradecodes.indexOf("Ri")>=0){ importance += 1;}
    if(pop <= 6){ importance -=1;}
    if(bases.indexOf("Naval") >= 0 && bases.indexOf("Scout") >= 0){ importance += 1;}
    if(bases.indexOf("Way Station") >= 0 || bases.indexOf("Naval Depot") >= 0){ importance += 1;}
    var isImportant = importance >= 4;
    var isUnimportant = importance <= 0;
    if(importance <= -2){ importanceDesc = "Very Unimportant"; }
    else if(importance <= 0){ importanceDesc = "Unimportant"; dailyships = "1"; weeklyships = importance === 0 ? "2" : "1";}
    else if(importance <= 3){ 
        importanceDesc = "Ordinary"; 
        if(importance === 1){dailyships = "1-2"; weeklyships = "10";}
        else if(importance === 2){dailyships = "2-4"; weeklyships = "20";}
        else if(importance === 3){dailyships = "3-6"; weeklyships = "30";}
    }
    else if(importance <= 4){ importanceDesc = "Important"; dailyships = "15-20"; weeklyships = "100";}
    else if(importance >= 5){ importanceDesc = "Very Important"; dailyships = "100"; weeklyships = "1000";}

    var economics = {resources:0,infrastructure:0,labor:0,efficiency:0};
    economics.resources = d6(2) + (tech >= 8 ? gg+planetoidBelts: 0);
    economics.labor = Math.max(0, pop - 1);
    if(pop === 0){
        economics.infrastructure = 0;
    }else if(pop <= 3){
        economics.infrastructure = Math.max(0,importance);
    }else if(pop <= 6){
        economics.infrastructure = Math.max(0,d6() + importance);
    }else{
        economics.infrastructure = Math.max(0,d6(2) + importance);
    }
    economics.efficiency = d6()-d6();
    economics.extension = ""+ext(economics.resources) + ext(economics.labor) + ext(economics.infrastructure) + (economics.efficiency >= 0 ? "+" : "") + (economics.efficiency == 0 ? 1 : economics.efficiency);
    economics.RU = Math.max(1,economics.resources)*Math.max(1,economics.labor)*Math.max(1,economics.infrastructure)*(economics.efficiency === 0 ? 1 : economics.efficiency);
    var cultural = {};
    if(pop === 0){
        cultural = {heterogeneity:0, acceptance:0, strangeness:0, symbols:0, extension:"0000"}
    }else{
        cultural.heterogeneity = Math.max(1, pop + d6()-d6());
        cultural.acceptance = Math.max(1, importance + pop);
        cultural.strangeness = Math.max(1, d6() - d6() + 5);
        cultural.symbols = Math.max(1, d6() - d6() + tech);
        cultural.extension = ext(cultural.heterogeneity)+ext(cultural.acceptance)+ext(cultural.strangeness)+ext(cultural.symbols);
    }
    tradecodes.sort();
    uwp = starport + ext(size) + ext(atmo) + ext(hydro) + ext(pop) + ext(gov) + ext(law) + "-" + ext(tech);
    var highport = false;
    if(starport === "A" && pop >= 7){ highport = true;}
    else if(starport === "B" && pop >= 8){ highport = true;}
    else if(starport === "C" && pop >= 9){ highport = true;}
    var roughpop = popdigit * Math.pow(10,pop);
    var mainworld = {cultural:cultural, isMainworld:true, roughpop:roughpop, popdigit:popdigit, maxpop:pop2, uwp:uwp, highport:highport, tradecodes:tradecodes, size:size, atmo:atmo, hydro:hydro, pop:pop, gov:gov, law:law, tech:tech,worldtype:MWType, primary:MWPrimary,climate:climate,orbitAroundPrimary:MWOrbitAroundPrimary, isAsteroidBelt:size===0,orbit:MWOrbit,starport:starport};
    stars = placeWorlds(stars, mainworld, gg, planetoidBelts, d6(2), +maxTechLevel, allowNonMWPops)
    var totalpop = getTotalPop(stars.primary);
    return {name:name, economics:economics, pbg:ext(popdigit)+ext(planetoidBelts)+ext(gg), totalpop:totalpop, popdigit:popdigit, allegiance:"Im", uwp:uwp, bases:bases,stars:stars,gg:gg,planetoidBelts:planetoidBelts,  importance:{weeklytraffic:weeklyships, dailytraffic:dailyships, isImportant:isImportant, isUnimportant:isUnimportant, extension:importance,description:importanceDesc}, mainworld:mainworld,tradecodes:tradecodes};
}
function getTotalPop(star){
    var total = 0;
    for(var i = 0, len = star.satellites.length; i < len; i++){
        if(typeof star.satellites[i] !== "undefined"){
            var sat = star.satellites[i];
            if(sat.pop){
                total += sat.pop;
            }
            if(sat.satellites){
                total += getTotalPop(sat);
            }
        }
    }
    return total;
}
function getInnermostOrbit(star){
    for(var i = 0, len = star.satellites.length; i < len; i++){
        if(typeof star.satellites[i] === "undefined"){
            return i;
        }
    }
    return -1;
}
function placeWorlds(stars, mainworld, gg, belts, other, maxTech, allowNonMWPops){

    var availableOrbits = stars.primary.numOrbits;
    var arrStars = [stars.primary];
    var closeIndex = -1;
    if(stars.close){ 
        arrStars.push(stars.close); 
        closeIndex = arrStars.length-1; 
        availableOrbits -= 1; 
        for(var i = 0, len = stars.close.satellites.length; i < len; i++){
            if(typeof stars.close.satellites[i] !== "undefined"){
                availableOrbits += 1;
            }
        }
    }
    var nearIndex = -1;
    if(stars.near){ 
        arrStars.push(stars.near); 
        nearIndex = arrStars.length-1; 
        availableOrbits -= 1; 
        for(var i = 0, len = stars.near.satellites.length; i < len; i++){
            if(typeof stars.near.satellites[i] !== "undefined"){
                availableOrbits += 1;
            }
        }
    }
    var farIndex = -1;
    if(stars.far){
        arrStars.push(stars.far); 
        farIndex = arrStars.length-1; 
        availableOrbits -= 1;
        for(var i = 0, len = stars.far.satellites.length; i < len; i++){
            if(typeof stars.far.satellites[i] !== "undefined"){
                availableOrbits += 1;
            }
        }
    }

    var planetsToPlace = [];
    var SGGCount = 0;
    var isBelt = mainworld.worldtype === "Belt";
    if(mainworld.worldtype === "Planet" || isBelt){
        if(isBelt){
            mainworld.worldtype = "Asteroid Belt";
        }else{
            mainworld.worldtype = "Mainworld";
        }
        planetsToPlace.push(mainworld);
    }else if(mainworld.primary === "Gas Giant"){
        var giant = createGasGiant();
        if(giant.worldtype === "Small Gas Giant"){
            SGGCount += 1;
        }
        //giant.satellites = new Array(26);
        giant.satellites = addSatellite(new Array(26), mainworld);
        giant.orbit = mainworld.orbit;
        planetsToPlace.push(giant);
        gg-=1;
    }else if(mainworld.primary === "Planet"){
        var bw = createBigWorld(mainworld, mainworld.pop - 1, maxTech, allowNonMWPops)
        //bw.satellites = new Array(26);
        bw.satellites = addSatellite(new Array(26), mainworld);
        bw.orbit = mainworld.orbit;
        planetsToPlace.push(bw);
    }else{
        console.log("Unexpected mainworld worldtype or primary! Mainworld not placed.")
        console.log(mainworld);
    }
    for(var i = 0; i < gg; i++){
        var ngiant = createGasGiant();
        if(ngiant.worldtype === "Small Gas Giant"){
            SGGCount += 1;
            if(SGGCount % 2 === 0){
                ngiant.worldtype = "Ice Giant";
            }
        }
        planetsToPlace.push(ngiant);
    }
    for(var i = 0; i < belts; i++){
        planetsToPlace.push(createBelt(mainworld, mainworld.pop - 1));
    }

    for(var i = 0; i < other && availableOrbits > planetsToPlace.length+1; i++){
        planetsToPlace.push(createOtherWorld());
    }
    s = 0;
    var attemptCounterMax = planetsToPlace.length;
    var attemptCounter = 0;
    while(planetsToPlace.length > 0 && availableOrbits >= planetsToPlace.length){
        attemptCounter+=1;
        if(attemptCounter >= attemptCounterMax){
            var numAvailableOrbits = 0;
            for(var i = 0, len = arrStars.length; i < len; i++){
                for(var j = 0, jlen = arrStars[i].satellites.length; j < jlen; j++){
                    if(typeof arrStars[i].satellites[j] === "undefined"){
                        numAvailableOrbits += 1;
                    }
                }
            }
            if(numAvailableOrbits === 0){
                console.log(mainworld);
                console.log("Problem detected for " + mainworld.uwp + ". " +planetsToPlace.length+" worlds left to place. Only "+numAvailableOrbits+" orbits available.");  
                console.log(arrStars);
                planetsToPlace = [];
                break;
            }
        }
        var planet = planetsToPlace[0];
        var star = arrStars[s];
        if(typeof planet.orbit !== "undefined"){ // if planet already has a preferred orbit...
            if(typeof star.satellites[planet.orbit] === "undefined"){
                star.satellites[planet.orbit] = planet;
                var orbitDetails = createOrbitDetails(planet.orbit);
                planet.decimalOrbit = orbitDetails.decimalOrbit;
                planet.au = orbitDetails.au;
                planetsToPlace.splice(0,1);
                availableOrbits -= 1;
            }else{
                var amp = 0, placedSuccessfully = false;
                while(!placedSuccessfully && amp < star.satellites.length){
                    amp++;
                    if(planet.orbit-amp >= 0 && typeof star.satellites[planet.orbit-amp] === "undefined"){
                        star.satellites[planet.orbit-amp] = planet; 
                        var orbitDetails = createOrbitDetails(planet.orbit-amp);
                        planet.decimalOrbit = orbitDetails.decimalOrbit;
                        planet.au = orbitDetails.au;
                        planetsToPlace.splice(0,1);
                        availableOrbits -= 1;
                        placedSuccessfully = true;
                    }else if(star.satellites.length > planet.orbit+amp && typeof star.satellites[planet.orbit+amp] === "undefined"){
                        star.satellites[planet.orbit+amp] = planet;
                        var orbitDetails = createOrbitDetails(planet.orbit+amp);
                        planet.decimalOrbit = orbitDetails.decimalOrbit;
                        planet.au = orbitDetails.au;
                        planetsToPlace.splice(0,1);
                        availableOrbits -= 1;
                        placedSuccessfully = true;
                    }
                }
            }
        }else{
            while(star.satellites.length === 0){ // if the current star has no available orbits, rotate
                s++; 
                if(s >= arrStars.length){s = 0;}
                star = arrStars[s];
            }
            var roll = d6(2);
            var orbit = star.HZOrbit;
            switch(planet.worldtype){
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
                    if(planetsToPlace.length === 1){
                       orbit = 19 - roll;
                    }else{
                        if(roll <= 2){
                            orbit = 10;
                        }else if(roll === 3){
                            orbit = 8;
                        }else if(roll === 4){
                            orbit = 6;
                        }else if(roll === 5){
                            orbit = 4;
                        }else if(roll === 6){
                            orbit = 2;
                        }else if(roll === 7 ){
                            orbit = 0;
                        }else if(roll === 8){
                            orbit = 1;
                        }else if(roll === 9){
                            orbit = 3;
                        }else if(roll === 10){
                            orbit = 5;
                        }else if(roll === 11){
                            orbit = 7;
                        }else if(roll === 12){
                            orbit = 9;
                        }
                    }
            }
            if(orbit < 0){orbit = 0;}
            while(orbit >= star.satellites.length){ // if this is outside the available orbits, try next inside one
                orbit -= 1;
            }
            if(typeof star.satellites[orbit] === "undefined"){
                if(planet.worldtype === "Other World"){
                    planet = createOtherWorld(mainworld, orbit, star.HZOrbit, mainworld.pop-1, maxTech, allowNonMWPops);
                }else if(planet.worldtype.indexOf("Giant") > 0){
                    // add gas giant moons
                    var numExistingMoons = 0;
                    if(typeof planet.satellites === "undefined"){
                        planet.satellites = new Array(26);
                    }else{
                        numExistingMoons = planet.satellites.filter(function(val,i,arr){return typeof val !== "undefined"});
                    }
                    var moons = planet.satellites;
                    var numAdditionalMoons = d6() - 1 - numExistingMoons;
                    if(numAdditionalMoons > 0){
                        var diff = orbit - star.HZOrbit;
                        var moonMaker = diff <= 1 ? createInnerSatellite : createOuterSatellite;
                        for(var m = 0; m < numAdditionalMoons; m++){
                            moons = addSatellite(moons, moonMaker(mainworld, planet.size,mainworld.pop-1));
                        }
                        planet.satellites = moons;
                    }
                   
                }else if(planet.worldtype === "BigWorld"){
                    // add bigworld moons
                    var numExistingMoons = 0;
                    if(typeof planet.satellites === "undefined"){
                        planet.satellites = new Array(26);
                    }else{
                        numExistingMoons = planet.satellites.filter(function(val,i,arr){return typeof val !== "undefined"});
                    }
                    var moons = planet.satellites;
                    var diff = orbit - star.HZOrbit;
                    var numAdditionalMoons = 0;
                    if(diff < -1){
                        numAdditionalMoons = d6() - 5 - numExistingMoons;
                    }else if(diff <= 1){
                        numAdditionalMoons = d6() - 4 - numExistingMoons;
                    }else{
                        numAdditionalMoons = d6() - 3 - numExistingMoons;
                    }
                    if(numAdditionalMoons > 0){
                        var moonMaker = diff <= 1 ? createInnerSatellite : createOuterSatellite;
                        for(var m = 0; m < numAdditionalMoons; m++){
                            moons = addSatellite(moons, moonMaker(mainworld, planet.size,mainworld.pop-1));
                        }
                        planet.satellites = moons;
                    }
                }
                star.satellites[orbit] = planet; //{worldtype:planet.worldtype, uwp:planet.uwp, details:planet};
                var orbitDetails = createOrbitDetails(orbit);
                planet.decimalOrbit = orbitDetails.decimalOrbit;
                planet.au = orbitDetails.au;
                planetsToPlace.splice(0,1);
                availableOrbits -= 1;
            }else{
                var amp = 0, placedSuccessfully = false;
                while(!placedSuccessfully && amp < star.satellites.length){
                    amp++;
                    if(orbit-amp >= 0 && typeof star.satellites[orbit-amp] === "undefined"){
                        if(planet.worldtype === "Other World"){
                            planet = createOtherWorld(mainworld, orbit-amp, star.HZOrbit, mainworld.pop-1, maxTech);
                        }
                        star.satellites[orbit-amp] = planet; //{worldtype:planet.worldtype,uwp:planet.uwp, details:planet};
                        var orbitDetails = createOrbitDetails(orbit-amp);
                        planet.decimalOrbit = orbitDetails.decimalOrbit;
                        planet.au = orbitDetails.au;
                        planetsToPlace.splice(0,1);
                        availableOrbits -= 1;
                        placedSuccessfully = true;
                    }else if(star.satellites.length > orbit+amp && typeof star.satellites[orbit+amp] === "undefined"){
                        if(planet.worldtype === "Other World"){
                            planet = createOtherWorld(mainworld, orbit+amp, star.HZOrbit, mainworld.pop-1, maxTech);
                        }
                        star.satellites[orbit+amp] = planet; //{worldtype:planet.worldtype,uwp:planet.uwp, details:planet};
                        var orbitDetails = createOrbitDetails(orbit+amp);
                        planet.decimalOrbit = orbitDetails.decimalOrbit;
                        planet.au = orbitDetails.au;
                        planetsToPlace.splice(0,1);
                        availableOrbits -= 1;
                        placedSuccessfully = true;
                    }
                }
            }
            
        }
        s++; 
        if(s >= arrStars.length){s = 0;}
    }
    stars.primary = arrStars[0];
    if(stars.close){ stars.close = arrStars[closeIndex]; }
    if(stars.near){ stars.near = arrStars[nearIndex]; }
    if(stars.far){ stars.far = arrStars[farIndex]; }
    return stars;
}
function addSatellite(moons, moon){
    var preferredOrbit = moon.orbitAroundPrimary;
    if(typeof moons[preferredOrbit] === "undefined"){
        moons[preferredOrbit] = moon;
    }else{
        var amp = 0, placedSuccessfully = false;
        while(!placedSuccessfully && amp < moons.length){
            amp++;
            if(preferredOrbit-amp >= 0 && typeof moons[preferredOrbit-amp] === "undefined"){     
                moons[preferredOrbit-amp] = moon;
                placedSuccessfully = true;
            }else if(moons.length > preferredOrbit+amp && typeof moons[preferredOrbit+amp] === "undefined"){ 
                moons[preferredOrbit+amp] = moon;
                placedSuccessfully = true;
            }
        }
    }
    return moons;
}
function createOrbitDetails(orbit){
    var flux = (d6(2)-2);
    var decimalOrbits = [
        [.15,   .16,    .17,    .18,    .19,    .2,     .22,    .24,    .26,    .28,    .30], // 0
        [.3,    .32,    .34,    .36,    .38,    .4,     .43,    .46,    .49,    .52,    .55], // 1
        [.55,   .58,    .61,    .64,    .67,    .7,      .73,    .76,    .79,    .82,    .85], // 2
        [.85,   .88,    .91,    .94,    .97,    1,      1.06,   1.12,   1.18,   1.124,  1.30], // 3
        [1.3,   1.36,   1.42,   1.48,   1.54,   1.6,    1.72,   1.84,   1.96,   2.08,   2.20], // 4
        [2.2,   2.32,   2.44,   2.56,   2.68,   2.8,    3.04,   3.28,   3.52,   3.76,   4], // 5
        [4,     4.2,    4.4,    4.7,    4.9,    5.2,    5.6,    6.1,    6.6,    7.1,    7.6], // 6
        [7.6,   8.1,    8.5,    9.0,    9.5,    10,     11,     12,     13,     14,     15], // 7
        [15,    16,     17,     18,     19,     20,     22,     24,     26,     28,     30], // 8
        [30,    32,     34,     36,     38,     40,     43,     47,     51,     54,     58], // 9
        [58,    62,     65,     69,     73,     77,     84,     92,     100,    107,    115], // 10
        [115,   123,    130,    138,    146,    154,    169,    184,    200,    215,    231], // 11
        [231,    246,    261,    277,    292,    308,   338,    369,    400,    430,    461], // 12
        [461,   492,    522,    553,    584,    615,    676,    738,    799,    861,    922], // 13
        [922,   984,    1045,   1107,   1168,   1230,   1352,   1475,   1598,   1721,   1844], // 14
        [1844,  1966,   2089,   2212,   2335,   2458,   2703,   2949,   3195,   3441,   3687], // 15
        [3687,  3932,   4178,   4424,   4670,   4916,   5407,   5898,   6390,   6881,   7373], // 16
        [7373,  7864,   8355,   8847,   9338,   9830,   10797,  11764,  12731,  13698,  14665], // 17
        [14665, 15632,  16599,  17566,  18533,  19500,  21500,  23500,  25500,  27500,  29500], // 18 = 19500
        [29500, 31500,  33500,  35500,  37500,  39500,  43420,  47340,  51260,  55180,  59100], // 19 = 39500
        [59100, 63020,  66940,  70860,  74780,  78700,  86620,  94540,  102460, 110380, 118300] // 20 = 78700
    ];
    var au = decimalOrbits[orbit][flux];
    flux = flux - 5;
    var decimalOrbit = (orbit + flux/10).toFixed(1);
    return {decimalOrbit:decimalOrbit,au:au}
}
function createBigWorld(mw, maxPop, maxTech, allowNonMWPops){
    if(typeof maxTech === "undefined"){console.error("BigWorld");}
    var planet = createPlanet(mw, "BigWorld",-1,maxPop, maxTech, allowNonMWPops);
    return {worldtype: "BigWorld", uwp:planet.uwp}
}
function createGasGiant(){
    var roll = d6();
    if(roll <= 3){type = "Small Gas Giant";}
    else{type = "Large Gas Giant";}
    uwp = "Size " + ext(20+roll);
    var uwp = "Y"+ext(20+roll)+"X0000-0";
    return {worldtype:type, uwp:uwp}
}
function createBelt(mw, maxPop, maxTech, allowNonMWPops){
    var uwp = "??";
    var planet = createPlanet(mw, "Planetoid",0,maxPop, maxTech, allowNonMWPops);
    return {worldtype:"Planetoid Belt", uwp:planet.uwp, maxpop:uwp.maxpop, pop:planet.pop}
}
function createRing(){
    var uwp = "Y000000-0"; // TODO Rings?
    var distanceRoll = d6();
    var orbit = 0;
    if(distanceRoll <= 2){
        orbit = 0;
    }else if(distanceRoll <= 4){
        orbit = 1;
    }else if(distanceRoll <= 6){
        orbit = 2;
    }
    return {worldtype:"Ring System", uwp:uwp,orbitAroundPrimary:orbit}
}
function createInnerSatellite(mw, maxSize,maxPop, maxTech, allowNonMWPops){
    var worldtype = "";
    var roll = d6();
    while(maxSize < 9 && roll === 3){ roll = d6(); }
    var type = "";
    if(roll === 1){
        type = "Inferno";
    }else if(roll === 2){
        type = "Inner World";
    }else if(roll === 3){
        type = "BigWorld";
    }else if(roll === 4){
        type = "StormWorld";
    }else if(roll === 5){
        type = "RadWorld";
    }else if(roll === 6){
        type = "Hospitable";
    }
    var planet = createPlanet(mw, type, maxSize, maxPop, maxTech, allowNonMWPops);
    var distanceRoll = d6();
    var orbit = "??";
    if(distanceRoll <= 7){
        worldtype = "Close "+type+" Satellite";
        var roll = d6() - d6();
        if(roll === -5 && planet.size <= 2){ orbit =1 ; /*"Bee";*/ }
        else if(roll <= -4 && planet.size <= 2){ orbit =2 ; /*"Cee";*/ }
        else if(roll <= -3){ orbit =3 ; /*"Dee";*/ }
        else if(roll === -2){ orbit =4 ; /*"Ee";*/ }
        else if(roll === -1){ orbit =5 ; /*"Eff";*/ }
        else if(roll === 0){ orbit =6 ; /*"Gee";*/ }
        else if(roll === 1){ orbit =7 ; /*"Aitch";*/ }
        else if(roll === 2){ orbit =8 ; /*"Eye";*/ }
        else if(roll === 3){ orbit =9 ; /*"Jay";*/ }
        else if(roll === 4){ orbit =10 ; /*"Kay";*/ }
        else if(roll === 5){ orbit =11 ; /*"Ell";*/ }
    }else{
        worldtype = "Far "+type+" Satellite";
        var roll = d6() - d6();
        if(roll === -5){ orbit = 14; /*"Oh";*/ }
        else if(roll === -4){ orbit = 15; /*"Pee";*/ }
        else if(roll === -3){ orbit = 16; /*"Que";*/ }
        else if(roll === -2){ orbit = 17; /*"Arr";*/ }
        else if(roll === -1){ orbit =18; /* "Ess";*/ }
        else if(roll === 0){ orbit = 19; /*"Tee";*/ }
        else if(roll === 1){ orbit = 20; /*"Yu";*/ }
        else if(roll === 2){ orbit = 21; /*"Vee";*/ }
        else if(roll === 3){ orbit = 22; /*"Dub";*/ }
        else if(roll === 4){ orbit = 23; /*"Ex";*/ }
        else if(roll === 5){ orbit = 24; /*"Wye";*/ }    
    }
    return{worldtype:worldtype, uwp:planet.uwp, maxpop:planet.maxpop, orbitAroundPrimary:orbit, pop:planet.pop}
}
function createOuterSatellite(mw, maxSize,maxPop, maxTech, allowNonMWPops){
    var worldtype = "";
    var roll = d6();
    while(maxSize < 9 && roll === 3){ roll = d6(); }
    var type = "";
    if(roll === 1){
        type = "Worldlet";
    }else if(roll === 2){
        type = "Iceworld";
    }else if(roll === 3){
        type = "BigWorld";
    }else if(roll === 4){
        type = "StormWorld";
    }else if(roll === 5){
        type = "RadWorld";
    }else if(roll === 6){
        type = "Iceworld";
    }
    var planet = createPlanet(mw, type, maxSize, maxPop, maxTech, allowNonMWPops);
    var distanceRoll = d6(2);
    var orbit = "??";
    if(distanceRoll <= 7){
        worldtype = "Close "+type+" Satellite";
        var roll = d6() - d6();
        if(roll === -5 && planet.size <= 2){ orbit =1 ; /*"Bee";*/ }
        else if(roll <= -4 && planet.size <= 2){ orbit =2 ; /*"Cee";*/ }
        else if(roll <= -3){ orbit =3 ; /*"Dee";*/ }
        else if(roll === -2){ orbit =4 ; /*"Ee";*/ }
        else if(roll === -1){ orbit =5 ; /*"Eff";*/ }
        else if(roll === 0){ orbit =6 ; /*"Gee";*/ }
        else if(roll === 1){ orbit =7 ; /*"Aitch";*/ }
        else if(roll === 2){ orbit =8 ; /*"Eye";*/ }
        else if(roll === 3){ orbit =9 ; /*"Jay";*/ }
        else if(roll === 4){ orbit =10 ; /*"Kay";*/ }
        else if(roll === 5){ orbit =11 ; /*"Ell";*/ }
    }else{
        worldtype = "Far "+type+" Satellite";
        var roll = d6() - d6();
        if(roll === -5){ orbit = 14; /*"Oh";*/ }
        else if(roll === -4){ orbit = 15; /*"Pee";*/ }
        else if(roll === -3){ orbit = 16; /*"Que";*/ }
        else if(roll === -2){ orbit = 17; /*"Arr";*/ }
        else if(roll === -1){ orbit =18; /* "Ess";*/ }
        else if(roll === 0){ orbit = 19; /*"Tee";*/ }
        else if(roll === 1){ orbit = 20; /*"Yu";*/ }
        else if(roll === 2){ orbit = 21; /*"Vee";*/ }
        else if(roll === 3){ orbit = 22; /*"Dub";*/ }
        else if(roll === 4){ orbit = 23; /*"Ex";*/ }
        else if(roll === 5){ orbit = 24; /*"Wye";*/ }    
    }
    return{worldtype:worldtype, uwp:planet.uwp, maxpop:planet.maxpop, orbitAroundPrimary:orbit, pop:planet.pop}
}
function createPlanet(mw, type,maxSize,maxPop,maxTech, allowNonMWPops){
    var size = 0;
    var techmod = 0;
    if(type === "Planetoid"){
        size = 0;
    }else if(type === "RadWorld"){
        size = d6(2);
    }else if(type === "Inferno"){
        size = 6+d6();
    }else if(type === "BigWorld"){
        size = d6(2)+7;
    }else if(type === "Worldlet"){
        size = d6()-3;
    }else if(type === "Stormworld"){
        size = d6(2);
    }else{
        size = d6(2)-2;
    }
    if(size <= 0){
        size = 0;
    }else if(maxSize >= 0 && size > maxSize){
        size = maxSize;
    }
    var atmo = 0;
    if(type === "Planetoid" || size === 0){
        atmo = 0;
    }else{
        atmo = d6() - d6() + size;
        if(type === "Inferno"){
            atmo = 11;
        }else if(type === "Stormworld"){
            atmo += 4;
        }
        if(atmo < 0){ atmo = 0;}
        if(atmo > 15){atmo = 15;}
    }
    var hydro = 0;
    if(type === "Planetoid" || size < 2 || type === "Inferno"){
        hydro = 0;
    }else{
        hydro = d6() - d6() + atmo;
        if(atmo < 2 || atmo > 9){ hydro -=4; }
        if(type === "Inner World" || type === "Stormworld"){
            hydro -= 4;
        }
        if(hydro < 0){ hydro = 0;}
        if(hydro > 10){ hydro = 10;}
    }
    var pop = 0, pop2 = 0;
    if(type === "RadWorld" || type === "Inferno"){
        pop = 0;
        pop2 = 0;
    }else{
        pop = d6(2)-2;
        pop2 = d6(2)-2;
        if(type === "Iceworld" || type === "Stormworld"){
            pop -= 6;
            pop2 -= 6;
            if(pop <= 0){
               pop2 -= 1;
            }
            if(pop2 > 0){ techmod++; }
        }else if(type === "Inner World"){
            pop -= 4;
            pop2 -= 4;
            if(pop <= 0){
                pop2 -= 1;
             }
            if(pop2 > 0){ techmod++; }
        }
    }
    if(pop > maxPop){
        pop = maxPop;
    }
    if(pop < 0){
        pop = 0;
    }
    if(pop2 < 0){
        pop2 = 0;
    }
    if(!allowNonMWPops){ pop = 0;}
    var portRoll = pop - d6(), port = "Y";
    if(portRoll <= 0){
        port = "Y";
    }else if(portRoll <= 2){
        port = "H";
    }else if(portRoll <= 3){
        port = "G";
    }else if(portRoll >= 4){
        port = "F";
    }

    var gov = 0, law = 0;
    if(pop > 0){
        gov = d6() - d6() + pop;
        if(gov < 0){ gov = 0; }
        else if(gov > 15){gov = 15;}
        law = d6() - d6() + gov;
        if(law < 0){ law = 0;}
        else if(law >18){ law = 18;}
    }
    var tech = 0;
    if(type === "RadWorld" || type === "Inferno"){
        tech  = 0;
    }else{
        tech = d6();
        if(port === "F"){
            tech += 1;
        }
        if(size <= 1){tech += 1;}
        else if(size <= 4){ tech += 1;}

        if(atmo <= 3){ tech += 1;}
        else if(atmo >= 10){ tech += 1;}
        
        if(hydro === 9){ tech += 1;}
        else if(hydro === 10){ tech += 2;}
        
        if((pop > 0 || pop2 > 0) && pop <= 5){ tech += 1; }
        else if(pop === 9){ tech += 2;}
        else if(pop >= 10){ tech += 4; }
        
        if(pop > 0 && gov === 0){ tech += 1;}
        else if(gov === 5){ tech += 1;}
        else if(gov === 13){ tech -=2; }
        
        if(tech < 0){ tech = 0;}else{tech = tech + techmod; }
        if(tech > maxTech){ tech = maxTech; }
        // homebrewed rules: double check for max population to cut down on dieback worlds
        if(pop === 0){
            if(pop2 === 0){
                tech = 0;
            }
        }else{
            pop2 = Math.max(pop,pop2);
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
            if(pop > maxPop){ pop = maxPop;}
            if(pop <= 0){
                pop = 0;
                gov = 0;
                law = 0;
            }
            if(tech > maxTech){ tech = maxTech; }
        }
    }
    var uwp = port + ext(size) + ext(atmo) + ext(hydro) + ext(pop) + ext(gov) + ext(law) + "-" + ext(tech);
    return {worldtype:type, size:size, pop:pop, maxpop:pop2, uwp:uwp};
}
function createOtherWorld(mw, orbit, hzorbit, maxPop, maxTech, allowNonMWPops){
    var uwp = "??Y000000-0", planet = {};
    var type = "Other World";
    var moons = new Array(26), moonCount = 0, moonRoll = d6();
    if(typeof mw === "undefined"){
        return {worldtype:type, uwp:uwp};
    }else{
        var diff = orbit - hzorbit;
        if(diff <= 1){
            // Inner and HZ Worlds
            var roll = d6();
            if(roll === 1){
                type = "Inferno";
            }else if(roll === 2){
                type = "Inner World";
            }else if(roll === 3){
                type = "BigWorld";
            }else if(roll === 4){
                type = "StormWorld";
            }else if(roll === 5){
                type = "RadWorld";
            }else if(roll === 6){
                type = "Hospitable";
            }
            planet = createPlanet(mw, type,-1,maxPop, maxTech, allowNonMWPops);
            if(diff === 0){
                while(moonRoll - 4 === 0){
                    moons = addSatellite(moons,createRing());
                    moonRoll = d6();
                }
                moonCount = Math.max(moonRoll-4,0);
            }else{
                while(moonRoll - 5 === 0){
                    moons = addSatellite(moons,createRing());
                    moonRoll = d6();
                }
                moonCount = Math.max(moonRoll-5,0);
            }
            for(var i = 0; i < moonCount; i++){
                moons = addSatellite(moons,createInnerSatellite(mw, planet.size,maxPop, maxTech, allowNonMWPops))
            }
        }else if(diff > 1){
            // outer worlds
            var roll = d6();
            if(roll === 1){
                type = "Worldlet";
            }else if(roll === 2){
                type = "Iceworld";
            }else if(roll === 3){
                type = "BigWorld";
            }else if(roll === 4){
                type = "Iceworld";
            }else if(roll === 5){
                type = "RadWorld";
            }else if(roll === 6){
                type = "Iceworld";
            }
            planet = createPlanet(mw, type,-1,maxPop, maxTech);
            while(moonRoll - 3 === 0){
                moons = addSatellite(moons,createRing());
                moonRoll = d6();
            }
            moonCount = Math.max(moonRoll-3,0);
            for(var i = 0; i < moonCount; i++){
                moons = addSatellite(moons,createOuterSatellite(mw, planet.size, maxPop, maxTech, allowNonMWPops))
            }
        }
    }
    
    return {worldtype:type, uwp:planet.uwp, pop:planet.pop, maxpop:planet.maxpop, satellites:moons}
}
function getStar(type, decimal, size, maxOrbits){
    var star = {};
    var minOrbit = 0;
    if(type == -6){ 
        if(d6() == 1){
            star.type =  "O";
            if(size <= -5){ star.size = "Ia"; star.HZOrbit = 15;}
            else if(size <= -4){ star.size = "Ib"; star.HZOrbit = 15;}
            else if(size <= -3){ star.size = "II"; star.HZorbit = 14; }
            else if(size <= 0){ star.size = "III"; star.HZOrbit = 13;}
            else if(size <= 3){ star.size = "V"; star.HZOrbit = 11;}
            else if(size <= 4){ star.size = "IV"; star.HZOrbit = 12;}
            else if(size <= 5){ star.size = "D"; star.HZOrbit = 1;}
            else{ star.size = "IV"; star.HZOrbit = 12;}
        }else{
            star.type = "B";
            if(size <= -5){ star.size = "Ia"; star.HZOrbit = 13;}
            else if(size <= -4){ star.size = "Ib"; star.HZOrbit = 13;}
            else if(size <= -3){ star.size = "II"; star.HZOrbit = 12; }
            else if(size <= 1){ star.size = "III"; star.HZOrbit = 11; }
            else if(size <= 3){ star.size = "V"; star.HZOrbit = 9;}
            else if(size <= 4){ star.size = "IV"; star.HZOrbit = 10;}
            else if(size <= 5){ star.size = "D";star.HZOrbit = 0;}
            else{ star.size = "IV";star.HZOrbit = 10;}
        }
    }
    else if(type <= -4){ 
            star.type = "A"; 
            if(size <= -5){ 
                star.size = "Ia"; star.HZOrbit = 12;
                if(decimal <= 9){ minOrbit = 5;} 
            }
            else if(size <= -4){ 
                star.size = "Ib"; star.HZOrbit = 11;
                if(decimal === 0){ minOrbit = 2; }
                else if(decimal >= 5){ minOrbit = 3; }
            }
            else if(size <= -3){ star.size = "II";star.HZOrbit = 9; minOrbit = 1; }
            else if(size <= -2){ star.size = "III"; star.HZOrbit = 7; minOrbit = 1; }
            else if(size <= -1){ star.size = "IV"; star.HZOrbit = 7;}
            else if(size <= 4){ star.size = "V";star.HZOrbit = 7;}
            else if(size <= 5){ star.size = "D";star.HZOrbit = 0;}
            else{ star.size = "V";star.HZOrbit = 7;}
    }
    else if(type <= -2){ 
        star.type = "F"; 
        if(size <= -5){ star.size = "II"; star.HZOrbit = 9;
            if(decimal <=5){ minOrbit = 1;}
        }
        else if(size <= -4){ star.size = "III";star.HZOrbit = 6; minOrbit = 1; }
        else if(size <= -3){ star.size = "IV"; star.HZOrbit = 6;}
        else if(size <= 3){ star.size = "V"; star.HZOrbit = 5;}
        else if(size <= 4){ star.size = "VI";star.HZOrbit = 3;}
        else if(size <= 5){ star.size = "D";star.HZOrbit = 0;}
        else{ star.size = "VI";star.HZOrbit = 3;}
    }
    else if(type <= 0){ 
        star.type = "G"; 
        if(size <= -5){ star.size = "II"; star.HZOrbit = 9;
            if(decimal <= 5){ minOrbit = 2;}
        }
        else if(size <= -4){ star.size = "III"; star.HZOrbit = 7; minOrbit = 1;}
        else if(size <= -3){ star.size = "IV"; star.HZOrbit = 5;}
        else if(size <= 3){ star.size = "V"; star.HZOrbit = 3;}
        else if(size <= 4){ star.size = "VI";star.HZOrbit = 2;}
        else if(size <= 5){ star.size = "D";star.HZOrbit = 0;}
        else{ star.size = "VI";star.HZOrbit = 3;}
    }
    else if(type <= 2){ 
        star.type = "K"; 
        if(size <= -5){ star.size = "II"; star.HZOrbit = 9; 
            if(decimal === 0){
                minOrbit = 3;
            }else if(decimal === 5){
                minOrbit = 5;
            }
        }
        else if(size <= -4){ star.size = "III"; star.HZOrbit = 8;
            if(decimal === 0){
                minOrbit = 1;
            }else if(decimal === 5){
                minOrbit = 2;
            }
        }
        else if(size <= -3){ star.size = "IV"; star.HZOrbit = 5;}
        else if(size <= 3){ star.size = "V"; star.HZOrbit = 2;}
        else if(size <= 4){ star.size = "VI";star.HZOrbit = 1;}
        else if(size <= 5){ star.size = "D";star.HZOrbit = 0;}
        else{ star.size = "VI";star.HZOrbit = 1;}
    }
    else if(type <= 5){ 
        star.type = "M"; 
        if(size <= -3){ star.size = "II"; star.HZOrbit = 10;
            if(decimal === 0){
                minOrbit = 6;
            }else if(decimal === 5){
                minOrbit = 7;
            }else if(decimal === 9){
                minOrbit = 8;
            }
        }
        else if(size <= -2){ star.size = "III"; star.HZOrbit = 9;
            if(decimal === 0){
                minOrbit = 3;
            }else if(decimal === 5){
                minOrbit = 6;
            }else if(decimal === 9){
                minOrbit = 7;
            }
         }
        else if(size <= 3){ star.size = "V"; star.HZOrbit = 0;}
        else if(size <= 4){ star.size = "VI";star.HZOrbit = 0;}
        else if(size <= 5){ star.size = "D";star.HZOrbit = 0;}
        else{ star.size = "VI";star.HZOrbit = 0;}
    }
    else{ star.type = "BD"; star.HZOrbit = 0; }
    if(star.size !== "D"){star.decimal = decimal;}
    if(maxOrbits > 0){
        star.satellites = new Array(maxOrbits);
        star.numOrbits = maxOrbits;
    }else{
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
    for(var i = 0; i < minOrbit; i++){
        if(minOrbit - 1 === i){
            star.satellites[i] = {worldtype:"Solar Surface",uwp:(star.size === "D" ? "D" : star.type + (typeof star.decimal === "undefined" ? "" : star.decimal.toString()) + " " + star.size), decimalOrbit:i.toFixed(1), au:decimalOrbits[i]};
            star.numOrbits -= 1;
        }else{
            star.satellites[i] = {worldtype:"Occupied",uwp:(star.size === "D" ? "D" : star.type + (typeof star.decimal === "undefined" ? "" : star.decimal.toString()) + " " + star.size), decimalOrbit:i.toFixed(1), au:decimalOrbits[i]};
            star.numOrbits -= 1;
        }
    }
    //star.numOrbits = maxOrbits - minOrbit;
    if(star.numOrbits < 0){star.numOrbits = 0;}
    return star;
}
function d6(num){
    
    if(!num){ num = 1;}
    var sum = 0;
    for(var i = 0; i < num; i++){
        sum += ((MathRandom()*6) >>> 0) + 1;
    }
    
    return sum;
}

function d09(){
    //returns 0-9 even distribution
    var r1=d6(),r2=d6(),x;
    while(r1==6){r1=d6();}
    x = (r1-1) * 2;
    if(r2 >= 4){x+=1;}
    return x;
}
function d19(){
    //returns 1-9 even distribution
    var r1=d6(),r2=d6(),x;
    function eq(t1,t2){
        return r1===t1 && r2 === t2;
    }
    if(eq(1,1) || eq(1,4) || eq(4,1) || eq(4,4)){
        x = 1;
    }else if(eq(2,1) || eq(2,4) || eq(5,1) || eq(5,4)){
        x = 2;
    }else if(eq(3,1) || eq(3,4) || eq( 6,1) || eq(6,4)){
        x = 3;
    }else if(eq(1,2) || eq(1,5) || eq(4,2) || eq(4,5)){
        x = 4;
    }else if(eq(2,2) || eq(2,5) || eq(5,2) || eq(5,5)){
        x = 5;
    }else if(eq(3,2) || eq(3,5) || eq(6,2) || eq(6,5)){
        x = 6;
    }else if(eq(1,3) || eq(1,6) || eq(4,3) || eq(4,6)){
        x = 7;
    }else if(eq(2,3) || eq(2,6) || eq(5,3) || eq(5,6)){
        x = 8;
    }else if(eq(3,3) || eq(3,6) || eq(6,3) || eq(6,6)){
        x = 9;
    }
    return x;
}

