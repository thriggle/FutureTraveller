function generateRandomAlien(species,rand){
    // species.name, species.homeworld.mainworld
    species.strangeness = 0;
    setEnvironmentNiche();
    setGender();
    setStats();
    setCaste();
    setGeneticProfile();
    setLifeStages();
    setSenses();
    setLanguageMedium();
    setScent();
    setBodyStructure();
    setSpecialAbilities();
    setSizeAndWeight();
    setUniqueTraits();
    setGenderCasteScents();
    function binSearch(arr, target, comparator){
        var l = 0, h = arr.length - 1, m, comparison;
        while(l <= h){
            m = (l + h) >> 1;
            comparison = typeof comparator == "undefined" ? (arr[m] < target ? -1 : (arr[m] > target ? 1 : 0)) : comparator(arr[m], target);
            if(comparison < 0){
                l = m + 1;
                continue;
            }else if(comparison > 0){
                h = m - 1;
                continue;
            }else{
                return m;
            }
        }
        return ~l;
    }
    function setScent(){
        species.scent = getScentDigit()
            + getScentDigit()
            + getScentDigit();
    }
    function getScentDigit(){
        var digits = 
        [
            ["1","2","3","4","5","6"],
            ["A","B","C","D","E","F"],
            ["G","H","I","J","K","L"],
            ["M","N","O","P","Q","R"],
            ["S","T","U","V","W","X"],
            ["Y","Z","7","8","9","0"]
        ];
        return pickRandom(pickRandom(digits));
    }
    function d6(num){

        if(!num){ num = 1;}
        var sum = 0;
        for(var i = 0; i < num; i++){
            sum += ((rand()*6) >>> 0) + 1;
        }
        
        return sum;
    }
    function posFlux(){
        var d1 = d6();
        var d2 = d6();
        return d1 > d2 ? d1 - d2 : d2 - d1;
    }
    function pickRandom(arr){
        return arr[Math.floor(rand() * arr.length)];
    }
    function getSpecialCaste(){
        var roll = d6() - d6();
        switch(roll){
            case -5: return "DeMinimis";
            case -4: return "Useless";
            case -3: return "Advisor Minus";
            case -2: return "Instructor";
            case -1: return "Shaman";
            case 0: return "Expendable";
            case 1: return "Defective";
            case 2: return "Valuable";
            case 3: return "Advisor Plus";
            case 4: return "Sport";
            case 5: return "Vice-Leader";
        }
    }
    function setEnvironmentNiche(){ 
        var tc = species.homeworld.mainworld.tradecodes;
        
        var EnvironmentDM = d6() - d6();
        species.nativeTerrain = "Clear";
        var homeworld = species.homeworld.mainworld;
        if(homeworld.atmo >= 8){ EnvironmentDM -= 2;}
        if(homeworld.size <= 5){ EnvironmentDM -= 1;}
        if(homeworld.hydro >= 6){ EnvironmentDM += 1;}
        if(homeworld.hydro >= 9){ EnvironmentDM += 1;}
        
        if(tc.indexOf("Tz") >= 0 || tc.indexOf("Lk") >= 0){
            if(EnvironmentDM < 0){ species.nativeTerrain = "Baked Lands"; EnvironmentDM = -1; }
            else if(EnvironmentDM > 0){ species.nativeTerrain = "Frozen Lands"; EnvironmentDM = 1; }
            else{ species.nativeTerrain = "Twilight Zone"; }
        }else{
            if(homeworld.hydro === 0){
                EnvironmentDM -= 1;
            }
            if(EnvironmentDM <= -5){
                EnvironmentDM = -5;
                species.nativeTerrain = "Mountain";
            }else if(EnvironmentDM === -4){
                species.nativeTerrain = "Desert";
            }else if(EnvironmentDM === -3){
                species.nativeTerrain = "Exotic";
            }else if(EnvironmentDM === -2){
                species.nativeTerrain = "Rough Wood";
            }else if(EnvironmentDM === -1){
                species.nativeTerrain = "Rough";
            }else if(EnvironmentDM === 0){
                species.nativeTerrain = "Clear";
            }else if(EnvironmentDM === 1){
                species.nativeTerrain = "Forest";
            }else if(EnvironmentDM === 2){
                species.nativeTerrain = "Wetlands";
            }else if(EnvironmentDM === 3){
                species.nativeTerrain = "Wetland Woods";
            }else if(EnvironmentDM === 4){
                species.nativeTerrain = "Ocean";
            }else if(EnvironmentDM >= 5){
                species.nativeTerrain = "Ocean Depths";
                EnvironmentDM = 5;
            }
        }
        species.climate = species.homeworld.mainworld.climate;
        if(tc.indexOf("Co") >= 0 || tc.indexOf("Tu") >= 0 || tc.indexOf("Fr") >= 0){
            species.climate += " Ignores Cold-2 or less.";
        }else if(tc.indexOf("Ho") >= 0 || tc.indexOf("Tr") >= 0){
            species.climate += " Ignores Hot-2 or less.";
        }
        if(species.nativeTerrain === "Frozen Lands"){
            species.climate = "Cold. Ignores Cold-2 or less.";
        }else if(species.nativeTerrain === "Baked Lands"){
            species.climate = "Hot. Ignores Hot-2 or less.";
        }
        species.EnvironmentDM = EnvironmentDM;
        var roll = d6();
        var niche = d6() - d6() + EnvironmentDM;
        switch(EnvironmentDM){
            case -5:
                switch(roll){
                    case 1:
                        species.locomotion = "Walker";
                        break;
                    case 2:
                        species.locomotion = "Walker";
                        break;
                    case 3:
                        species.locomotion = "Walker";
                        break;
                    case 4:
                        species.locomotion = "Walker";
                        break;
                    case 5:
                        species.locomotion = "Walker";
                        break;
                    case 6:
                        species.locomotion = "Flyer";
                        break;
                }
                break;
            case -4:
            switch(roll){
                    case 1:
                        species.locomotion = "Walker";
                        break;
                    case 2:
                        species.locomotion = "Walker";
                        break;
                    case 3:
                        species.locomotion = "Walker";
                        break;
                    case 4:
                        species.locomotion = "Walker";
                        break;
                    case 5:
                        species.locomotion = "Walker";
                        break;
                    case 6:
                        species.locomotion = "Flyer";
                        break;
                }
                break;
            case -3:
            switch(roll){
                    case 1:
                        species.locomotion = "Amphib";
                        break;
                    case 2:
                        species.locomotion = "Walker";
                        break;
                    case 3:
                        species.locomotion = "Walker";
                        break;
                    case 4:
                        species.locomotion = "Walker";
                        break;
                    case 5:
                        species.locomotion = "Flyphib";
                        break;
                    case 6:
                        species.locomotion = "Flyer";
                        break;
                }
                break;
            case -2:
            switch(roll){
                    case 1:
                        species.locomotion = "Amphib";
                        break;
                    case 2:
                        species.locomotion = "Walker";
                        break;
                    case 3:
                        species.locomotion = "Walker";
                        break;
                    case 4:
                        species.locomotion = "Walker";
                        break;
                    case 5:
                        species.locomotion = "Walker";
                        break;
                    case 6:
                        species.locomotion = "Flyer";
                        break;
                }
                break;
            case -1:
            switch(roll){
                    case 1:
                        species.locomotion = "Amphib";
                        break;
                    case 2:
                        species.locomotion = "Walker";
                        break;
                    case 3:
                        species.locomotion = "Walker";
                        break;
                    case 4:
                        species.locomotion = "Walker";
                        break;
                    case 5:
                        species.locomotion = "Walker";
                        break;
                    case 6:
                        species.locomotion = "Flyer";
                        break;
                }
                break;
            case 0:
            switch(roll){
                    case 1:
                        species.locomotion = "Walker";
                        break;
                    case 2:
                        species.locomotion = "Walker";
                        break;
                    case 3:
                        species.locomotion = "Walker";
                        break;
                    case 4:
                        species.locomotion = "Walker";
                        break;
                    case 5:
                        species.locomotion = "Walker";
                        break;
                    case 6:
                        species.locomotion = "Walker";
                        break;
                }
                break;
            case 1:
            switch(roll){
                    case 1:
                        species.locomotion = "Walker";
                        break;
                    case 2:
                        species.locomotion = "Walker";
                        break;
                    case 3:
                        species.locomotion = "Walker";
                        break;
                    case 4:
                        species.locomotion = "Walker";
                        break;
                    case 5:
                        species.locomotion = "Walker";
                        break;
                    case 6:
                        species.locomotion = "Walker";
                        break;
                }
                break;
            case 2:
            switch(roll){
                    case 1:
                        species.locomotion = "Amphib";
                        break;
                    case 2:
                        species.locomotion = "Aquatic";
                        break;
                    case 3:
                        species.locomotion = "Walker";
                        break;
                    case 4:
                        species.locomotion = "Walker";
                        break;
                    case 5:
                        species.locomotion = "Triphib";
                        break;
                    case 6:
                        species.locomotion = "Flyer";
                        break;
                }
                break;
            case 3:
            switch(roll){
                    case 1:
                        species.locomotion = "Amphib";
                        break;
                    case 2:
                        species.locomotion = "Walker";
                        break;
                    case 3:
                        species.locomotion = "Walker";
                        break;
                    case 4:
                        species.locomotion = "Walker";
                        break;
                    case 5:
                        species.locomotion = "Triphib";
                        break;
                    case 6:
                        species.locomotion = "Flyphib";
                        break;
                }
                break;
            case 4:
            switch(roll){
                    case 1:
                        species.locomotion = "Flyphib";
                        break;
                    case 2:
                        species.locomotion = "Swim";
                        break;
                    case 3:
                        species.locomotion = "Swim";
                        break;
                    case 4:
                        species.locomotion = "Swim";
                        break;
                    case 5:
                        species.locomotion = "Aquatic";
                        break;
                    case 6:
                        species.locomotion = "Diver";
                        break;
                }
                break;
            case 5:
            switch(roll){
                    case 1:
                        species.locomotion = "Aquatic";
                        break;
                    case 2:
                        species.locomotion = "Diver";
                        break;
                    case 3:
                        species.locomotion = "Diver";
                        break;
                    case 4:
                        species.locomotion = "Diver";
                        break;
                    case 5:
                        species.locomotion = "Diver";
                        break;
                    case 6:
                        species.locomotion = "Diver";
                        break;
                }
                break;
        }
        var atmolookup ={
            "0":"Vacuum",
            "1":"Trace",
            "2":"Very Thin / Tainted",
            "3":"Very Thin",
            "4":"Thin / Tainted",
            "5":"Thin",
            "6":"Standard",
            "7":"Standard / Tainted",
            "8":"Dense",
            "9":"Dense / Tainted",
            "10":"Exotic",
            "11":"Corrosive",
            "12":"Insidious",
            "13":"Dense, high",
            "14":"Ellipsoid",
            "15":"Thin, low"
        }
        var atmoDesc = atmolookup[species.homeworld.mainworld.atmo.toString()];
        switch(species.locomotion){
            case "Walker":
                species.breathes = "Atmo " + species.homeworld.mainworld.atmo + " (" + atmoDesc + ")";
                break;
            case "Amphib":
                species.breathes = "Atmo " + species.homeworld.mainworld.atmo + " (" + atmoDesc + ") + " + (species.homeworld.mainworld.atmo >= 10 && species.homeworld.mainworld.atmo <= 12 ? "Exotic Liquid" : "Water");
                break;
            case "Flyer":
                species.breathes = "Atmo " + species.homeworld.mainworld.atmo+ " (" + atmoDesc + ")";
                break;
            case "Flyphib":
                species.breathes = "Atmo " + species.homeworld.mainworld.atmo + " (" + atmoDesc + ") + " + (species.homeworld.mainworld.atmo >= 10 && species.homeworld.mainworld.atmo <= 12 ? "Exotic Liquid" : "Water");
                break;
            case "Swim":
                species.breathes = "Atmo " + species.homeworld.mainworld.atmo + " (" + atmoDesc + ")";
                break;
            case "Aquatic":
                species.breathes = "Atmo " + species.homeworld.mainworld.atmo + " (" + atmoDesc + ")";
                break;
            case "Diver":
                species.breathes = species.homeworld.mainworld.atmo >= 10 && species.homeworld.mainworld.atmo <= 12 ? "Exotic Liquid" : "Water";
                break;
            case "Triphib":
                species.breathes = "Atmo " + species.homeworld.mainworld.atmo + " (" + atmoDesc + ")";
                break;
        }
        roll = d6() - d6();
        if(roll <= -5){
            species.class = "Producer";
            if(niche <= -1){
                species.niche = "Collector";
            }else{
                species.niche = "Basker";
            }
        }else if(roll <= -3){
            species.class = "Herbivore"
            if(niche <= -4){
                species.niche = "Grazer";
            }else if(niche <= 0){
                species.niche = "Intermittent";
            }else if (niche <= 5){
                species.niche = "Grazer";
            }else{
                species.niche = "Filter";
            }
        }else if(roll <= 2){
            species.class = "Omnivore";
            if(niche <= -2){
                species.niche = "Hunter";
            }else if(niche <= -1){
                species.niche = "Gatherer";
            }else if(niche === 0){
                species.niche = "Hunter/Gatherer";
            }else if(niche <= 5){
                species.niche = "Gatherer";
            }else{
                species.niche = "Eater";
            }
        }else if(roll <= 4){
            species.class = "Carnivore";
            if(niche <= -1){
                species.niche = "Pouncer";
            }else if(niche <= 3){
                species.niche = "Chaser";
            }else if(niche <= 4){
                species.niche = "Trapper";
            }else if(niche <= 5){
                species.niche = "Siren";
            }else{
                species.niche = "Killer";
            }
        }else{
            species.class = "Scavenger";
            if(niche <= -4){
                species.niche = "Carrion-Eater";
            }else if(niche <= -1){
                species.niche = "Hijacker";
            }else if(niche <= 4){
                species.niche = "Intimidator";
            }else{
                species.niche = "Reducer";
            }
        }
    }
    function setGender(){
        species.genderProbabilities = {};
       
        var roll = d6() - d6();
        if(roll <= -4){
            species.dna = "1NA";
            species.genderstructure = "Solitaire";
            species.genders = ["Solo"];
            species.gender2 = species.genders[0];
            species.gender3 = species.genders[0];
            species.gender4 = species.genders[0];
            species.gender5 = species.genders[0];
            species.gender6 = species.genders[0];
            species.gender7 = species.genders[0];
            species.gender8 = species.genders[0];
            species.gender9 = species.genders[0];
            species.gender10 = species.genders[0];
            species.gender11 = species.genders[0];
            species.gender12 = species.genders[0];
            species.genderProbabilities[species.genders[0]] = 36;           
        }else if(roll <= -2){
            species.dna = "3NA";
            species.genderstructure = "EAB";
            species.genders = ["Egg Donor","Activator","Bearer"];
            species.gender2 = species.genders[0];
            species.gender3 = species.genders[1];
            species.gender4 = pickRandom(species.genders);
            species.gender5 = pickRandom(species.genders);
            species.gender6 = pickRandom(species.genders);
            species.gender7 = pickRandom(species.genders);
            species.gender8 = pickRandom(species.genders);
            species.gender9 = pickRandom(species.genders);
            species.gender10 = pickRandom(species.genders);
            species.gender11 = pickRandom(species.genders);
            species.gender12 = species.genders[2];
            species.genderProbabilities[species.genders[0]] = 1;
            species.genderProbabilities[species.genders[1]] = 2;
            species.genderProbabilities[species.gender4] = species.genderProbabilities[species.gender4] ? species.genderProbabilities[species.gender4] + 3 : 3;
            species.genderProbabilities[species.gender5] = species.genderProbabilities[species.gender5] ? species.genderProbabilities[species.gender5] + 4 : 4;
            species.genderProbabilities[species.gender6] = species.genderProbabilities[species.gender6] ? species.genderProbabilities[species.gender6] + 5 : 5;
            species.genderProbabilities[species.gender7] = species.genderProbabilities[species.gender7] ? species.genderProbabilities[species.gender7] + 6 : 6;
            species.genderProbabilities[species.gender8] = species.genderProbabilities[species.gender8] ? species.genderProbabilities[species.gender8] + 5 : 5;
            species.genderProbabilities[species.gender9] = species.genderProbabilities[species.gender9] ? species.genderProbabilities[species.gender9] + 4 : 4;
            species.genderProbabilities[species.gender10] = species.genderProbabilities[species.gender10] ? species.genderProbabilities[species.gender10] + 3 : 3;
            species.genderProbabilities[species.gender11] = species.genderProbabilities[species.gender11] ? species.genderProbabilities[species.gender11] + 2 : 2;
            species.genderProbabilities[species.gender12] = species.genderProbabilities[species.gender12] ? species.genderProbabilities[species.gender12] + 1 : 1;
        }else if(roll <= 1){
            species.dna = "2NA";
            species.genderstructure = "Dual";
            species.genders = ["Female","Male"];
            species.gender2 = species.genders[0];
            species.gender3 = species.genders[1];
            species.gender4 = pickRandom(species.genders);
            species.gender5 = pickRandom(species.genders);
            species.gender6 = pickRandom(species.genders);
            species.gender7 = pickRandom(species.genders);
            species.gender8 = pickRandom(species.genders);
            species.gender9 = pickRandom(species.genders);
            species.gender10 = pickRandom(species.genders);
            species.gender11 = pickRandom(species.genders);
            species.gender12 = pickRandom(species.genders);

            species.genderProbabilities[species.genders[0]] = 1;
            species.genderProbabilities[species.genders[1]] = 2;
            species.genderProbabilities[species.gender4] = species.genderProbabilities[species.gender4] ? species.genderProbabilities[species.gender4] + 3 : 3;
            species.genderProbabilities[species.gender5] = species.genderProbabilities[species.gender5] ? species.genderProbabilities[species.gender5] + 4 : 4;
            species.genderProbabilities[species.gender6] = species.genderProbabilities[species.gender6] ? species.genderProbabilities[species.gender6] + 5 : 5;
            species.genderProbabilities[species.gender7] = species.genderProbabilities[species.gender7] ? species.genderProbabilities[species.gender7] + 6 : 6;
            species.genderProbabilities[species.gender8] = species.genderProbabilities[species.gender8] ? species.genderProbabilities[species.gender8] + 5 : 5;
            species.genderProbabilities[species.gender9] = species.genderProbabilities[species.gender9] ? species.genderProbabilities[species.gender9] + 4 : 4;
            species.genderProbabilities[species.gender10] = species.genderProbabilities[species.gender10] ? species.genderProbabilities[species.gender10] + 3 : 3;
            species.genderProbabilities[species.gender11] = species.genderProbabilities[species.gender11] ? species.genderProbabilities[species.gender11] + 2 : 2;
            species.genderProbabilities[species.gender12] = species.genderProbabilities[species.gender12] ? species.genderProbabilities[species.gender12] + 1 : 1;
        }else if(roll <= 3){
            species.dna = "2NA";
            species.genderstructure = "FMN";
            species.genders = ["Female","Male","Neuter"];
            species.gender2 = species.genders[0];
            species.gender3 = species.genders[1];
            species.gender4 = pickRandom(species.genders);
            species.gender5 = pickRandom(species.genders);
            species.gender6 = pickRandom(species.genders);
            species.gender7 = pickRandom(species.genders);
            species.gender8 = pickRandom(species.genders);
            species.gender9 = pickRandom(species.genders);
            species.gender10 = pickRandom(species.genders);
            species.gender11 = pickRandom(species.genders);
            species.gender12 = species.genders[2];

            species.genderProbabilities[species.genders[0]] = 1;
            species.genderProbabilities[species.genders[1]] = 2;
            species.genderProbabilities[species.gender4] = species.genderProbabilities[species.gender4] ? species.genderProbabilities[species.gender4] + 3 : 3;
            species.genderProbabilities[species.gender5] = species.genderProbabilities[species.gender5] ? species.genderProbabilities[species.gender5] + 4 : 4;
            species.genderProbabilities[species.gender6] = species.genderProbabilities[species.gender6] ? species.genderProbabilities[species.gender6] + 5 : 5;
            species.genderProbabilities[species.gender7] = species.genderProbabilities[species.gender7] ? species.genderProbabilities[species.gender7] + 6 : 6;
            species.genderProbabilities[species.gender8] = species.genderProbabilities[species.gender8] ? species.genderProbabilities[species.gender8] + 5 : 5;
            species.genderProbabilities[species.gender9] = species.genderProbabilities[species.gender9] ? species.genderProbabilities[species.gender9] + 4 : 4;
            species.genderProbabilities[species.gender10] = species.genderProbabilities[species.gender10] ? species.genderProbabilities[species.gender10] + 3 : 3;
            species.genderProbabilities[species.gender11] = species.genderProbabilities[species.gender11] ? species.genderProbabilities[species.gender11] + 2 : 2;
            species.genderProbabilities[species.gender12] = species.genderProbabilities[species.gender12] ? species.genderProbabilities[species.gender12] + 1 : 1;

        }else{
            species.genderstructure = "Group";
            species.genders = [];
            for(var i = 0; i < 6; i++){
                //var gender = addCaps(generator.getRandomName("word.1or2sylword"), species.genders);
                var gender = "Gender " + (i+1);
                species.genders.push(gender);
            }
            species.gender2 = species.genders[0];
            species.gender3 = species.genders[1];
            species.gender4 = pickRandom(species.genders);
            species.gender5 = pickRandom(species.genders);
            species.gender6 = pickRandom(species.genders);
            species.gender7 = pickRandom(species.genders);
            species.gender8 = pickRandom(species.genders);
            species.gender9 = pickRandom(species.genders);
            species.gender10 = pickRandom(species.genders);
            species.gender11 = pickRandom(species.genders);
            species.gender12 = pickRandom(species.genders);           
            
            species.genderProbabilities[species.genders[0]] = 1;
            species.genderProbabilities[species.genders[1]] = 2;
            species.genderProbabilities[species.gender4] = species.genderProbabilities[species.gender4] ? species.genderProbabilities[species.gender4] + 3 : 3;
            species.genderProbabilities[species.gender5] = species.genderProbabilities[species.gender5] ? species.genderProbabilities[species.gender5] + 4 : 4;
            species.genderProbabilities[species.gender6] = species.genderProbabilities[species.gender6] ? species.genderProbabilities[species.gender6] + 5 : 5;
            species.genderProbabilities[species.gender7] = species.genderProbabilities[species.gender7] ? species.genderProbabilities[species.gender7] + 6 : 6;
            species.genderProbabilities[species.gender8] = species.genderProbabilities[species.gender8] ? species.genderProbabilities[species.gender8] + 5 : 5;
            species.genderProbabilities[species.gender9] = species.genderProbabilities[species.gender9] ? species.genderProbabilities[species.gender9] + 4 : 4;
            species.genderProbabilities[species.gender10] = species.genderProbabilities[species.gender10] ? species.genderProbabilities[species.gender10] + 3 : 3;
            species.genderProbabilities[species.gender11] = species.genderProbabilities[species.gender11] ? species.genderProbabilities[species.gender11] + 2 : 2;
            species.genderProbabilities[species.gender12] = species.genderProbabilities[species.gender12] ? species.genderProbabilities[species.gender12] + 1 : 1;

            var genderHash = {}
            genderHash[species.gender2] = true;
            species.genders = [species.gender2];
            for(var i = 3; i<= 12; i++){
                var g = species["gender"+i];
                if(!genderHash[g]){
                    genderHash[g] = true;
                    species.genders.push(g);
                }
            }

            species.dna = species.genders.length.toString() +"NA";
        }
        species.genderc1s = ["--"];
        species.genderc2s = ["--"];
        species.genderc3s = ["--"];
        species.genderc4s = ["--"];
        species.genderc5s = ["--"];
        species.genderc6s = ["--"];
        species.genderdesc = [ species.genders[0]+" " + " ("+(+(species.genderProbabilities[species.genders[0]]) / 36 * 100).toFixed(2)+ "%)" ];
        for(var i = 1, len = species.genders.length; i < len; i++){
            species.genderc6s.push("--");
            species.genderdesc.push( species.genders[i]+" " + " ("+(+(species.genderProbabilities[species.genders[i]]) / 36 * 100).toFixed(2)+ "%)" )
            roll = d6() - d6();
            switch(roll){
                case -5: species.genderc1s.push("-5"); break;
                case -4: species.genderc1s.push("-4"); break;
                case -3: species.genderc1s.push("-3"); break;
                case -2: species.genderc1s.push("-2"); break;
                case -1:
                case 0: species.genderc1s.push("--"); break;
                case 1: species.genderc1s.push("+1"); break;
                case 2: species.genderc1s.push("+2"); break;
                case 3: species.genderc1s.push("+1D"); break;
                case 4: species.genderc1s.push("+2D"); break;
                case 5: species.genderc1s.push("+3D"); break;
            }
            roll = d6() - d6();
            switch(roll){
                case -5: species.genderc2s.push("-5"); break;
                case -4: species.genderc2s.push("-4"); break;
                case -3: species.genderc2s.push("-3"); break;
                case -2: species.genderc2s.push("-2"); break;
                case -1:
                case 0: 
                case 1: species.genderc2s.push("--"); break;
                case 2: species.genderc2s.push("+2"); break;
                case 3: species.genderc2s.push("+3"); break;
                case 4: species.genderc2s.push("+4"); break;
                case 5: species.genderc2s.push("+5"); break;
            }
            roll = d6() - d6();
            switch(roll){
                case -5: species.genderc3s.push("-5"); break;
                case -4: species.genderc3s.push("-4"); break;
                case -3: species.genderc3s.push("-3"); break;
                case -2: species.genderc3s.push("-2"); break;
                case -1:
                case 0: 
                case 1: species.genderc3s.push("--"); break;
                case 2: species.genderc3s.push("+2"); break;
                case 3: species.genderc3s.push("+3"); break;
                case 4: species.genderc3s.push("+4"); break;
                case 5: species.genderc3s.push("+5"); break;
            }
            roll = d6() - d6();
            switch(roll){
                case -5: species.genderc4s.push("-5"); break;
                case -4: species.genderc4s.push("-4"); break;
                case -3: species.genderc4s.push("-3"); break;
                case -2: species.genderc4s.push("-2"); break;
                case -1:
                case 0: 
                case 1: species.genderc4s.push("--"); break;
                case 2: species.genderc4s.push("+2"); break;
                case 3: species.genderc4s.push("+3"); break;
                case 4: species.genderc4s.push("+4"); break;
                case 5: species.genderc4s.push("+5"); break;
            }
            if(species.c5 === "Ins"){
                roll = d6() - d6();
            }else{
                roll =  1;
            }
            switch(roll){
                case -5: species.genderc5s.push("-5"); break;
                case -4: species.genderc5s.push("-4"); break;
                case -3: species.genderc5s.push("-3"); break;
                case -2: species.genderc5s.push("-2"); break;
                case -1:
                case 0: 
                case 1: species.genderc5s.push("--"); break;
                case 2: species.genderc5s.push("+2"); break;
                case 3: species.genderc5s.push("+3"); break;
                case 4: species.genderc5s.push("+4"); break;
                case 5: species.genderc5s.push("+5"); break;
            }
        }
        if(species.genders.length > 1){
            roll = d6() - d6();
            if(roll <= -5){
                species.genderassignment = "Assigned by family";
                species.gendershift = "progresses along gender table at each life stage";
            }else if(roll <= -4){
                species.genderassignment = "Initially assigned at life stage 2";
                species.gendershift = "progresses along gender table at each life stage";
            }else if(roll <= -3){
                species.genderassignment = "Neuter until life stage 2";
                species.gendershift = "then fixed";
            }else if(roll <= 2){
                species.genderassignment = "Assigned at birth";
                species.gendershift = "fixed";
            }else if(roll <= 3){
                species.genderassignment = "Neuter until life stage 2";
                species.gendershift = "then fixed";
            }else if(roll <= 4){
                species.genderassignment = "Neuter until life stage 2";
                species.gendershift = "transforms again at life stage 6";
            }else{
                species.genderassignment = "Assigned by individual (neuter until chosen)";
                species.gendershift = "transforms randomly at life stage 6";
            }
        }else{
            species.genderassignment = "(N/A)";
            species.gendershift = "fixed";
        }
        
    }
    function setStats(){
        species.statnotes = [];
        species.c1 = "Str";
        var roll = d6() - d6() + species.EnvironmentDM;
        if(roll <= -4){
            species.c1val = "1D";
        }else if(roll <= 1){
            species.c1val = "2D";
        }else if(roll === 1){
            species.c1val = "3D";
        }else if (roll === 2){
            species.c1val = "12+2D";
        }else if (roll === 3){
            species.c1val = "12+3D";
        }else if (roll === 4){
            species.c1val = "12+4D";
        }else if(roll === 5){
            species.c1val = "12+5D";
        }else{
            species.c1val = "12+6D";
        }
        if(roll >= 3){ species.statnotes.push("This sophont possesses incredible [Str] strength."); }
        var locMod = 0;
        if(species.locomotion === "Flyer"){ locMod = -2;}
        else if(species.locomotion === "Swim" || species.locomotion === "Diver"){
            locMod = +2;
        }
        roll = d6() - d6() + locMod;
        if(roll <= -2){
            species.c2 = "Agi";
            species.statnotes.push("This sophont possesses agility [Agi] instead of dexterity [Dex]. Agility measures overall body coordination, benefiting particularly from a flexible skeletal structure. For tasks involving fine manipulation that would ordinarily use dexterity, the sophont uses agility at half value.");
        }else if(roll <= 1){
            species.c2 = "Dex";
        }else{
            species.c2 = "Gra";
            species.statnotes.push("This sophont possesses grace [Gra] instead of dexterity [Dex]. Grace measures body-limb coordination, benefiting particularly from finely-tuned muscle control. It is used for activities in water, for example. For tasks involving fine manipulation that would ordinarily use dexterity, the sophont uses grace at half value.");
        }
        roll = d6() - d6() + species.EnvironmentDM;
        if(roll <= -4){
            species.c2val = "1D";
        }else if(roll <= 1){
            species.c2val = "2D";
        }else{
            species.c2val = "3D";
        }
        roll = d6() - d6() + locMod;
        if(roll <= -2){
            species.c3 = "Sta";
            species.statnotes.push("This sophont possesses stamina [Sta] instead of endurance [End]. Stamina measures long-term task persistance and is in some ways superior to endurance. The sophont's personal day is about 48 hours long, requiring about 16 hours of sleep each day to function optimally. In a continued running situation, check stamina instead of endurance.");
        }else if(roll <= 1){
            species.c3 = "End";
        }else{
            species.c3 = "Vig";
            species.statnotes.push("This sophont possesses vigor [Vig] instead of endurance [End]. Vigor measures short-term fatigue resistances and is in some ways an inferior alternative to endurance. The sophont's personal day is about 12 hours long, and it can function for twice its vigor hours before becoming sleepy, but can function optimally again after only about 4 hours of sleep. Short distant sprints use vigor; for most other feats of endurance, the sophont uses their vigor score at half value.");
        }
        roll = d6() - d6() + species.EnvironmentDM;
        if(species.niche === "Pouncer"){ roll -= 2;}
        else if(species.niche === "Chaser"){ roll += 2;}
        if(roll <= -4){
            species.c3val = "1D";
        }else if(roll <= 1){
            species.c3val = "2D";
        }else{
            species.c3val = "3D";
        }
        species.c4 = "Int";
        roll = d6() - d6();
        if(roll <= -4){
            species.c4val = "1D";
        }else if(roll <= 1){
            species.c4val = "2D";
        }else{
            species.c4val = "3D";
        }
        roll = d6() - d6();
        if(roll <= -2){
            species.c5 = "Ins";
            species.statnotes.push("This sophont possesses instinct [Ins] instead of education [Edu], reacting instinctively when confronted with a task requiring education or training. Instinct is an inborn complex of behaviors comparable to aquired learning. The sophont cannot learn skills through formal training/education, only by experience. Tasks completed using instinct receive a time advantage. The sophont receives a native store of 3 instinctual skills or knowledges each at the same level as its instinct score.");
        }else if(roll <= 1){
            species.c5 = "Edu";
        }else{
            species.c5 = "Tra";
            species.statnotes.push("This sophont possesses training [Tra] instead of education [Edu]. Training is learning based on behavior modification; the sophont is ill-prepared to learn in typical educational environments, but can prosper in specially adapted hands-on training courses and mentor-mentee relationships. Training and education can be substituted for each other at half value.");
        }
        if(species.c5 === "Ins"){
            roll = d6() - d6();
            if(roll <= -3){
                species.c5val = "1D";
            }else if(roll <= 3){
                species.c5val = "2D";
            }else{
                species.c5val = "3D";
            }
        }else{
            species.c5val = "2D";
        }
        roll = d6() - d6();
        if(roll <= -3){
            species.c6 = "Cas";
            species.statnotes.push("This sophont possesses caste [Cas] instead of social standing [Soc]. Caste indicates the sophont's position in group hierarchies based on genetics. Characters with caste are oblivious to their position in social hierarchies outside their own species; they use a social standing of 4 in any situations that call for Soc.");
        }else if(roll <= 1){
            species.c6 = "Soc";
        }else{
            species.c6 = "Cha";
            species.statnotes.push("This sophont possesses charisma [Cha] instead of social standing [Soc]. Species with charisma automatically defer to the leadership of others with higher charisma, but may challenge the superior if their own charisma score is within 2; if successful, the challenger rises in charisma and the loser's is reduced. Charisma typically functions at half value against characters with Soc.");
        }
    }
    function setCaste(){
        species.casteProbabilities = {};
        var hasCastedGender = false;
        species.caste2 = "N/A";
        species.caste3 = "";
        species.caste4 = "";
        species.caste5 = "";
        species.caste6 = "";
        species.caste7 = "";
        species.caste8 = "";
        species.caste9 = "";
        species.caste10 = "";
        species.caste11 = "";
        species.caste12 = "";
        species.castes = ["N/A"];
        species.castec1s = ["--"];
        species.castec2s = ["--"];
        species.castec3s = ["--"];
        species.castec4s = ["--"];
        species.castec5s = ["--"];
        species.castec6s = ["--"];
        if(species.c6 !== "Cas"){
            roll = d6() - d6();
            if(roll <= -4){
                species.c6val = "1D";
            }else{
                species.c6val = "2D";
            }
            species.castestructure = "No";
            species.casteassignment = "";
            species.casteshift = "N/A";
            
            species.castedesc = ["N/A"];
           

        }else{
            // figure out caste here
            species.castes = [];
            var casteHash = {};
            roll = d6();
            switch(roll){
                case 1: species.castestructure = "Body";  
                    species.castes.push("Muscle");
                    casteHash["Muscle"] = true;
                    for(var i = 2; i<= 12; i++){
                        if(i === 7){
                            species.caste7 = "Muscle";
                        }else if(i === 12){
                            species.caste12 = "Brain";
                            species.castes.push("Brain");
                            casteHash["Brain"] = true;
                        }else{
                            var cRoll = d6() - d6();
                            var caste = "";
                            switch(cRoll){
                                case -5: caste = "Healer"; break;
                                case -4: caste = species["gender"+i]; break;
                                case -3: caste = "Antibody"; break;
                                case -2: caste = "Sensor"; break;
                                case -1: caste = "Memory"; break;
                                case 0: caste = "Muscle"; break;
                                case 1: caste = "Muscle"; break;
                                case 2: caste = "Muscle"; break;
                                case 3: caste = "Voice"; break;
                                case 4: caste = getSpecialCaste(); break;
                                case 5: caste = "Claw"; break;
                            }
                            if(!casteHash[caste]){
                                casteHash[caste] = true;
                                species.castes.push(caste);
                            }
                            species["caste"+i] = caste;
                        }
                    }
                break;
                case 2: species.castestructure = "Economic"; 
                    species.castes.push("Laborer");
                    casteHash["Laborer"] = true;
                    for(var i = 2; i<= 12; i++){
                        if(i === 7){
                            species.caste7 = "Laborer"; 
                        }else if(i === 12){
                            species.caste12 = "Director";
                            species.castes.push("Director");
                            casteHash["Director"] = true;
                        }else{
                            var cRoll = d6() - d6();
                            var caste = "";
                            switch(cRoll){
                                case -5: caste = "Innovator"; break;
                                case -4: caste = species["gender"+i]; break;
                                case -3: caste = "Guard"; break;
                                case -2: caste = "Researcher"; break;
                                case -1: caste = "Artisan"; break;
                                case 0: caste = "Laborer"; break;
                                case 1: caste = "Craftsman"; break;
                                case 2: caste = "Clerk"; break;
                                case 3: caste = "Manager"; break;
                                case 4: caste = getSpecialCaste(); break;
                                case 5: caste = "Entrepreneur"; break;
                            }
                            if(!casteHash[caste]){
                                casteHash[caste] = true;
                                species.castes.push(caste);
                            }
                            species["caste"+i] = caste;
                        }
                    }   
                    break;
                case 3: species.castestructure = "Family"; 
                    species.castes.push("Breadwinner");
                    casteHash["Breadwinner"] = true;
                    for(var i = 2; i<= 12; i++){
                        if(i === 7){
                            species.caste7 = "Breadwinner"; 
                        }else if(i === 12){
                            species.caste12 = "Archon";
                            species.castes.push("Archon");
                            casteHash["Archon"] = true;
                        }else{
                            var cRoll = d6() - d6();
                            var caste = "";
                            switch(cRoll){
                                case -5: caste = "Healer"; break;
                                case -4: caste = species["gender"+i]; break;
                                case -3: caste = "Defender"; break;
                                case -2: caste = "Caregiver"; break;
                                case -1: caste = "Caregiver"; break;
                                case 0: caste = "Breadwinner"; break;
                                case 1: caste = "Breadwinner"; break;
                                case 2: caste = "Breadwinner"; break;
                                case 3: caste = "Uncle"; break;
                                case 4: caste = getSpecialCaste(); break;
                                case 5: caste = "Leader"; break;
                            }
                            if(!casteHash[caste]){
                                casteHash[caste] = true;
                                species.castes.push(caste);
                            }
                            species["caste"+i] = caste;
                        }
                    }
                    break;
                case 4: species.castestructure = "Military"; 
                    species.castes.push("Soldier");
                    casteHash["Soldier"] = true;
                    for(var i = 2; i<= 12; i++){
                        if(i === 7){
                            species.caste7 = "Soldier"; 
                        }else if(i === 12){
                            species.caste12 = "General";
                            species.castes.push("General");
                        casteHash["General"] = true;
                        }else{
                            var cRoll = d6() - d6();
                            var caste = "";
                            switch(cRoll){
                                case -5: caste = "Medic"; break;
                                case -4: caste = species["gender"+i]; break;
                                case -3: caste = "Aide"; break;
                                case -2: caste = "Scout"; break;
                                case -1: caste = "Specialist"; break;
                                case 0: caste = "Soldier"; break;
                                case 1: caste = "Technician"; break;
                                case 2: caste = "Warrior"; break;
                                case 3: caste = "Leader"; break;
                                case 4: caste = getSpecialCaste(); break;
                                case 5: caste = "Staff"; break;
                            }
                            if(!casteHash[caste]){
                                casteHash[caste] = true;
                                species.castes.push(caste);
                            }
                            species["caste"+i] = caste;
                        }
                    }
                    break;
                case 5: species.castestructure = "Social"; 
                    species.castes.push("Unit");
                    casteHash["Unit"] = true;
                    for(var i = 2; i<= 12; i++){
                        if(i === 7){
                            species.caste7 = "Unit"; 
                        }else if(i === 12){
                            species.caste12 = "Ruler";
                            species.castes.push("Ruler");
                            casteHash["Ruler"] = true;
                        }else{
                            var cRoll = d6() - d6();
                            var caste = "";
                            switch(cRoll){
                                case -5: caste = "Artist"; break;
                                case -4: caste = species["gender"+i]; break;
                                case -3: caste = "Enforcer"; break;
                                case -2: caste = "Drone"; break;
                                case -1: caste = "Artist"; break;
                                case 0: caste = "Unit"; break;
                                case 1: caste = "Unit"; break;
                                case 2: caste = "Unit"; break;
                                case 3: caste = "Patron"; break;
                                case 4: caste = getSpecialCaste(); break;
                                case 5: caste = "Entertainer"; break;
                            }
                            if(!casteHash[caste]){
                                casteHash[caste] = true;
                                species.castes.push(caste);
                            }
                            species["caste"+i] = caste;
                        }
                    }
                     break;
                case 6: species.castestructure = "Skilled";  species.castes = ["(Skilled)"]; break;
            }
            
            if(!(species.castestructure === "Skilled")){
                for(var i = 1, len = species.castes.length; i < len; i++){
                    var genderIndex = species.genders.indexOf(species.castes[i]);
                    if(genderIndex >= 0){
                        hasCastedGender = true;
                        species.castec1s.push(species.genderc1s[genderIndex]);
                        species.castec2s.push(species.genderc2s[genderIndex]);
                        species.castec3s.push(species.genderc3s[genderIndex]);
                        species.castec4s.push(species.genderc4s[genderIndex]);
                        species.castec5s.push(species.genderc5s[genderIndex]);
                        species.castec6s.push(species.genderc6s[genderIndex]);
                    }else{
                        species.castec6s.push("--");
                        roll = d6() - d6();
                        switch(roll){
                            case -5: species.castec1s.push("-5"); break;
                            case -4: species.castec1s.push("-4"); break;
                            case -3: species.castec1s.push("-3"); break;
                            case -2: species.castec1s.push("-2"); break;
                            case -1:
                            case 0: species.castec1s.push("--"); break;
                            case 1: species.castec1s.push("+1"); break;
                            case 2: species.castec1s.push("+2"); break;
                            case 3: species.castec1s.push("+1D"); break;
                            case 4: species.castec1s.push("+2D"); break;
                            case 5: species.castec1s.push("+3D"); break;
                        }
                        roll = d6() - d6();
                        switch(roll){
                            case -5: species.castec2s.push("-5"); break;
                            case -4: species.castec2s.push("-4"); break;
                            case -3: species.castec2s.push("-3"); break;
                            case -2: species.castec2s.push("-2"); break;
                            case -1:
                            case 0: 
                            case 1: species.castec2s.push("--"); break;
                            case 2: species.castec2s.push("+2"); break;
                            case 3: species.castec2s.push("+3"); break;
                            case 4: species.castec2s.push("+4"); break;
                            case 5: species.castec2s.push("+5"); break;
                        }
                        roll = d6() - d6();
                        switch(roll){
                            case -5: species.castec3s.push("-5"); break;
                            case -4: species.castec3s.push("-4"); break;
                            case -3: species.castec3s.push("-3"); break;
                            case -2: species.castec3s.push("-2"); break;
                            case -1:
                            case 0: 
                            case 1: species.castec3s.push("--"); break;
                            case 2: species.castec3s.push("+2"); break;
                            case 3: species.castec3s.push("+3"); break;
                            case 4: species.castec3s.push("+4"); break;
                            case 5: species.castec3s.push("+5"); break;
                        }
                        roll = d6() - d6();
                        switch(roll){
                            case -5: species.castec4s.push("-5"); break;
                            case -4: species.castec4s.push("-4"); break;
                            case -3: species.castec4s.push("-3"); break;
                            case -2: species.castec4s.push("-2"); break;
                            case -1:
                            case 0: 
                            case 1: species.castec4s.push("--"); break;
                            case 2: species.castec4s.push("+2"); break;
                            case 3: species.castec4s.push("+3"); break;
                            case 4: species.castec4s.push("+4"); break;
                            case 5: species.castec4s.push("+5"); break;
                        }
                        roll = d6() - d6();
                        switch(roll){
                            case -5: species.castec5s.push("-5"); break;
                            case -4: species.castec5s.push("-4"); break;
                            case -3: species.castec5s.push("-3"); break;
                            case -2: species.castec5s.push("-2"); break;
                            case -1:
                            case 0: 
                            case 1: species.castec5s.push("--"); break;
                            case 2: species.castec5s.push("+2"); break;
                            case 3: species.castec5s.push("+3"); break;
                            case 4: species.castec5s.push("+4"); break;
                            case 5: species.castec5s.push("+5"); break;
                        }
                    }
                }
            }
            roll = d6();
            switch(roll){
                case 1: species.casteassignment = "Assigned at birth"; break;
                case 2: species.casteassignment = "Assigned at life stage 2"; break;
                case 3: species.casteassignment = "Assigned by heredity"; break;
                case 4: species.casteassignment = "Assigned by community"; break;
                case 5: species.casteassignment = "Assigned by family choice"; break;
                case 6: species.casteassignment = "Assigned by personal choice"; break;
            }
            roll = d6();
            switch(roll){
                case 1: 
                case 2:  
                case 3: 
                case 4: species.casteshift = "fixed"; break;
                case 5: species.casteshift = "shifts at life stage 6"; break;
                case 6: species.casteshift = "progresses along caste table at every life stage"; break;
            }
            species.c6val = "2D*";
            species.casteProbabilities[species.caste2] = 1;
            species.casteProbabilities[species.caste3] = species.casteProbabilities[species.caste3] ? species.casteProbabilities[species.caste3] + 2 : 2;
            species.casteProbabilities[species.caste4] = species.casteProbabilities[species.caste4] ? species.casteProbabilities[species.caste4] + 3 : 3;
            species.casteProbabilities[species.caste5] = species.casteProbabilities[species.caste5] ? species.casteProbabilities[species.caste5] + 4 : 4;
            species.casteProbabilities[species.caste6] = species.casteProbabilities[species.caste6] ? species.casteProbabilities[species.caste6] + 5 : 5;
            species.casteProbabilities[species.caste7] = species.casteProbabilities[species.caste7] ? species.casteProbabilities[species.caste7] + 6 : 6;
            species.casteProbabilities[species.caste8] = species.casteProbabilities[species.caste8] ? species.casteProbabilities[species.caste8] + 5 : 5;
            species.casteProbabilities[species.caste9] = species.casteProbabilities[species.caste9] ? species.casteProbabilities[species.caste9] + 4 : 4;
            species.casteProbabilities[species.caste10] = species.casteProbabilities[species.caste10] ? species.casteProbabilities[species.caste10] + 3 : 3;
            species.casteProbabilities[species.caste11] = species.casteProbabilities[species.caste11] ? species.casteProbabilities[species.caste11] + 2 : 2;
            species.casteProbabilities[species.caste12] = species.casteProbabilities[species.caste12] ? species.casteProbabilities[species.caste12] + 1 : 1;
            species.castedesc = [];
            for(var i = 0, len = species.castes.length; i < len; i++){
                if(species.castes[i] === "(Skilled)"){
                    species.castedesc = ["N/A"];
                }else{
                    species.castedesc.push( species.castes[i]+" " + " ("+(+(species.casteProbabilities[species.castes[i]]) / 36 * 100).toFixed(2)+ "%)" )
                }
            }
        }
            
        if(species.genders.length > 1 && species.castes.length > 1){
            roll = d6();
            if(hasCastedGender){ if(roll > 3){roll = 3;}else{roll = 2;}}
            switch(roll){
                case 1: 
                case 2: species.castegenderrelation = "Dependent"; break;
                case 3: 
                case 4: species.castegenderrelation = "Casted Breeder"; break;
                case 5: 
                case 6: species.castegenderrelation = "Independent"; break;
            }
        }else{
            species.castegenderrelation = "(N/A)";
        }
    }
    function setLifeStages(){
        species.lifestages = [];
        for(var i = 0; i <= 9; i++){
            var roll = d6() - d6();
            if(i === 0){
                species.lifestages.push(2);
            }else if(roll === -5){
                if(i === 1 || i === 5 || i === 9){
                    species.lifestages.push(4);
                }else{
                    species.lifestages.push(0);
                }
            }else{
                if(roll <= -2){
                    species.lifestages.push(4);
                }else if(roll <= 1){
                    species.lifestages.push(8);
                }else if(roll <= 3){
                    species.lifestages.push(12)
                }else if(roll === 4){
                    species.lifestages.push(16);
                }else{
                    species.lifestages.push(24);
                }
            }
        }
        var sum = 0;
        species.lifestagelower = [];
        species.lifestageupper = [];
        for(var i = 0, len = species.lifestages.length; i < len; i++){
            species.lifestagelower.push(sum);
            sum += species.lifestages[i];
            species.lifestageupper.push(species.lifestages[i] > 0 ? sum-1 : sum);
        }
        species.lifeexpectancy = sum;
    }
    function setGeneticProfile(){
        species.geneticprofile = "S" + species.c2[0] + species.c3[0] + species.c4[0] + species.c5[0] + (species.c6 === "Cas" ? "K" : species.c6[0]);
    }
    function getSenseConstant(){
        var roll = d6() - d6();
        switch(roll){
            case -5: return "06"; break;
            case -4: return "08"; break;
            case -3: return "10"; break;
            case -2: return "12"; break;
            case -1: return "14"; break;
            case 0: return "16"; break;
            case 1: return "18"; break;
            case 2: return "20"; break;
            case 3: return "22"; break;
            case 4: return "24"; break;
            case 5: return "26"; break;
        }
    }
    function getHearingFreq(){
        var roll = d6() - d6();
        var freq = "";
        switch(roll){
            case -5: freq = "1"; break;
            case -4: freq = "2"; break;
            case -3: freq = "3"; break;
            case -2: freq = "4"; break;
            case -1: freq = "5"; break;
            case 0: freq = "6"; break;
            case 1: freq = "7"; break;
            case 2: freq = "8"; break;
            case 3: freq = "9"; break;
            case 4: freq = "A"; break;
            case 5: freq = "B"; break;
        }
        return freq;
    }
    function getHearingSpan(){
        var roll = d6() - d6();
        var hearingspan = "";
        switch(roll){
            case -5: hearingspan = "0"; break;
            case -4:
            case -3: hearingspan = "1"; break;
            case -2:
            case -1: hearingspan = "2"; break;
            case 0: hearingspan = "3"; break;
            case 1:
            case 2: hearingspan = "4"; break;
            case 3:
            case 4: hearingspan = "5"; break;
            case 5: hearingspan = "6"; break;
        }
        return hearingspan
    }
    function getVoiceFreq(){
        var roll = d6() - d6();
        var voice = "";
        switch(roll){
            case -5: voice = "1"; break;
            case -4: voice = "2"; break;
            case -3: voice = "3"; break;
            case -2: voice = "4"; break;
            case -1: voice = "5"; break;
            case 0: voice = "6"; break;
            case 1: voice = "7"; break;
            case 2: voice = "8"; break;
            case 3: voice = "9"; break;
            case 4: voice = "A"; break;
            case 5: voice = "B"; break;
        }
        return voice;
    }
    function getVocalRange(){
        var roll = d6() - d6(), voicerange = "";
        switch(roll){
            case -5: 
            case -4:
            case -3:
            case -2: voicerange = "0"; break;
            case -1: voicerange = "1"; break;
            case 0: voicerange = "2"; break;
            case 1:
            case 2:
            case 3: voicerange = "3"; break;
            case 4:
            case 5: voicerange = "4"; break;
        }
        return voicerange;
    }
    function getVisionBands(){
        var startype = species.homeworld.stars.primary.type;
        var stardecimal = species.homeworld.stars.primary.decimal;
        if(startype === "B"){
            visiondesc = "Sees in ultraviolet.";
            if(typeof stardecimal == "undefined" || stardecimal <= 3){
                visionbands = "DHV";
            }else if(stardecimal <= 8){
                visionbands = "UDH";
            }else{
                visionbands = "SUD";
            }
        }else if(startype === "A" ){
            if(typeof stardecimal == "undefined" || stardecimal <= 1){
                visionbands = "SUD";
                visiondesc = "Sees in ultraviolet.";
            }else if(stardecimal <= 8){
                visionbands = "PSU";
                visiondesc = "Sees in ultraviolet.";
            }else{
                visionbands = "BPS";
                visiondesc = "Sees in UV + visible spectrum.";
            }
        }else if(startype === "F"){
            if(typeof stardecimal == "undefined" || stardecimal <= 6){
                visionbands = "BPS";
                visiondesc = "Sees in UV + visible spectrum.";
            }else{
                visionbands = "GBP";
                visiondesc = "Sees in visible spectrum.";
            }
        }else if(startype === "G"){
            visiondesc = "Sees in visible spectrum.";
            if(typeof stardecimal == "undefined" || stardecimal <= 1){
                visionbands = "GBP";
            }else{
                visionbands = "RGB";
            }
        }else if(startype === "K"){
            if(typeof stardecimal == "undefined" || stardecimal <= 0){
                visionbands = "RGB";
                visiondesc = "Sees in visible spectrum.";
            }else if( stardecimal <= 3){
                visionbands = "CRG";
                visiondesc = "Sees in visible spectrum.";
            }else if(stardecimal <= 6){
                visionbands = "ACR";
                visiondesc = "Sees in infrared + visible spectrum.";
            }else{
                visionbands = "NAC";
                visiondesc = "Sees in infrared.";
            }
        }else if(startype === "M"){
            visiondesc = "Sees in infrared.";
            if(typeof stardecimal == "undefined" || stardecimal <= 1){
                visionbands = "INA";
            }else if(stardecimal <= 4){
                visionbands = "FIN";
            }else{
                visionbands = "XFI";
            }
        }else if(startype === "L" || startype === "BD"){
            visiondesc = "Sees in infrared.";
            if(typeof stardecimal == "undefined" || stardecimal <= 8){
                visionbands = "XFI";
            }else{
                visionbands = "ZXF";
            }
        }
        return {visionbands:visionbands,visiondesc:visiondesc};
    }
    function getSmellSharpness(){
        var roll = d6() - d6(), sharpness = "";
        switch(roll){
            case -5: 
            case -4:
            case -3:
            case -2: sharpness = "1"; break;
            case -1: sharpness = "2"; break;
            case 0: sharpness = "3"; break;
            case 1: sharpness = "4"; break;
            case 2:
            case 3: sharpness = "5"; break;
            case 4:
            case 5: sharpness = "6"; break;

        }
        return sharpness;
    }
    function getTouchSensitivity(){
        var roll = d6() - d6(), sensitivity = "";
        switch(roll){
            case -5: 
            case -4: sensitivity = "1"; break;
            case -3:
            case -2: sensitivity = "2"; break;
            case -1: 
            case 0: 
            case 1: sensitivity = "3"; break;
            case 2: 
            case 3: sensitivity = "4"; break;
            case 4: 
            case 5: sensitivity = "5"; break;
        }
        return sensitivity;
    }
    function getAwarenessAcuity(){
        var roll = d6() - d6(), acuity = "";
        switch(roll){
            case -5:
            case -4: acuity = "1"; break;
            case -3:
            case -2: acuity = "2"; break;
            case -1:
            case 0:
            case 1: acuity = "3"; break;
            case 2:
            case 3: acuity = "4"; break;
            case 4:
            case 5: acuity = "5"; break;
        }
        return acuity;
    }
    function getPerceptionPoice(){
        var roll = d6() - d6(), poice;
        switch(roll){
            case -5:
            case -4: poice = "1"; break;
            case -3:
            case -2: poice = "2"; break;
            case -1:
            case 0:
            case 1: poice = "3"; break;
            case 2:
            case 3: poice = "4"; break;
            case 4:
            case 5: poice = "5"; break;
        }
        return poice;
    }
    function getPerceptionPoiceTone(){
        var poicetone = "", roll = d6() - d6();
        switch(roll){
            case -5:
            case -4: poicetone = "1"; break;
            case -3:
            case -2: poicetone = "2"; break;
            case -1:
            case 0:
            case 1: poicetone = "3"; break;
            case 2:
            case 3: poicetone = "4"; break;
            case 4:
            case 5: poicetone = "5"; break;
        }
        return poicetone;
    }
    function setSenses(){
        species.visiondesc = "Cannot see.";
        var roll = d6() - d6();
        if(roll <= -3){
            species.vision = "Blind";
        }else{
            species.visionconstant = getSenseConstant()
            var visionBandDetails = getVisionBands();
            species.visionbands = visionBandDetails.visionbands;
            species.visiondesc = visionBandDetails.visiondesc;
            species.vision = "V-"+species.visionconstant+"-"+species.visionbands; 
            var vc = parseInt(species.visionconstant,10);
            if(vc > 16){
                species.visiondesc = "Sharper than human eyesight. " + species.visiondesc;
            }else if(vc === 16){
                species.visiondesc = "Similar eyesight compared to humans. " + species.visiondesc;
            }else{
                species.visiondesc = "Poorer than human eyesight. " + species.visiondesc;
            }
        }
        species.hearingdesc = "Cannot hear.";
        species.hearingrangedesc = "";
        roll = d6() - d6();
        if(roll <= -2){
            species.hearing = "Deaf";
        }else{
            species.hearingconstant = getSenseConstant();
            species.hearingfreq = getHearingFreq();
            species.hearingspan = getHearingSpan();
            var infrasound = false;
            var ultrasound = false;
            var audible = false;
            var upperFreq = parseInt(species.hearingfreq,16) + parseInt(species.hearingspan,16);
            var lowerFreq = parseInt(species.hearingfreq,16) - parseInt(species.hearingspan,16);
            if(lowerFreq <= 0){ lowerFreq = 1;}
            if( lowerFreq <= 5){
                infrasound = true; 
                if(upperFreq >= 6){
                    audible = true;
                }
            }
            if(upperFreq >= 13){
                ultrasound = true;
                if(lowerFreq <= 12){
                    audible = true;
                }
            }
            if(upperFreq >= 6 && upperFreq <=12){
                audible = true;
            }
            if(lowerFreq >= 6 && lowerFreq <=12){
                audible = true;
            }
            if(infrasound && ultrasound){
                species.hearingrangedesc = "Hears both infrasonics and ultrasonics";
            }else if(infrasound && audible){
                species.hearingrangedesc = "Hears infrasonics and human-audible";
            }else if(ultrasound && audible){
                species.hearingrangedesc = "Hears ultrasonics and human-audible";
            }else if(infrasound){
                species.hearingrangedesc = "Hears infrasonics";
            }else if(ultrasound){
                species.hearingrangedesc = "Hears ultrasonics";
            }else if(audible){
                species.hearingrangedesc = "Hears within human-audible range";
            }
            species.hearingrangedesc += " (" +(Math.pow(2,lowerFreq))+ (lowerFreq === upperFreq ? "":"-"+(Math.pow(2,upperFreq)))+" Hz)."
            var hc = parseInt(species.hearingconstant,10);
            if(hc > 16){
                species.hearingdesc = "More sensitive than human hearing. "
            }else if(hc === 16){
                species.hearingdesc = "Similar sensitivity compared to humans. "
            }else{
                species.hearingdesc = "Less sensitive than human hearing. "
            }
            species.voice = getVoiceFreq();

            species.voicerange = getVocalRange();

            var infrasound = false;
            var ultrasound = false;
            var audible = false;
            var upperFreq = parseInt(species.voice,16) + parseInt(species.voicerange,16);
            var lowerFreq = parseInt(species.voice,16) - parseInt(species.voicerange,16);
            if(lowerFreq <= 0){ lowerFreq = 1;}
            if( lowerFreq <= 5){
                infrasound = true; 
                if(upperFreq >= 6){
                    audible = true;
                }
            }
            if(upperFreq >= 13){
                ultrasound = true;
                if(lowerFreq <= 12){
                    audible = true;
                }
            }
            if(upperFreq >= 6 && upperFreq <=12){
                audible = true;
            }
            if(lowerFreq >= 6 && lowerFreq <=12){
                audible = true;
            }
            if(infrasound && ultrasound){
                species.voicedesc = "Vocalizes both infrasound and ultrasound";
            }else if(infrasound && audible){
                species.voicedesc = "Vocalizes infrasound and human-audible";
            }else if(ultrasound && audible){
                species.voicedesc = "Vocalizes ultrasound and human-audible";
            }else if(infrasound){
                species.voicedesc = "Vocalizes infrasound";
            }else if(ultrasound){
                species.voicedesc = "Vocalizes ultrasound";
            }else if(audible){
                species.voicedesc = "Vocalizes within human-audible range";
            }
            species.voicedesc += " (" +(Math.pow(2,lowerFreq))+ (lowerFreq === upperFreq ? "":"-"+(Math.pow(2,upperFreq)))+" Hz)."
            
            species.hearing = "H-"+species.hearingconstant + "-" 
                + species.hearingfreq + species.hearingspan 
                + species.voice + species.voicerange;
        }
        roll = d6() - d6();
        if(roll <= -1){
            species.smell = "Anosmic";
            species.smelldesc = "Cannot smell.";
        }else{
            species.smellconstant = getSenseConstant();
            species.smellsharpness = getSmellSharpness();
            species.smell = "S-"+species.smellconstant+"-"+species.smellsharpness; 
            var sc = parseInt(species.smellconstant,10);
            var ss = parseInt(species.smellsharpness,16);
            if(sc > 10){
                if(ss >= 2){
                    species.smelldesc = "More sensitive than human sense of smell.";
                }else{
                    species.smelldesc = "More sensitive but less discerning than human sense of smell.";
                }
            }else if(sc === 10){
                
                if(ss > 2){
                    species.smelldesc = "More sensitive than human sense of smell.";
                }else if(ss === 2){
                    species.smelldesc = "Similar sense of smell compared humans.";
                }else{
                    species.smelldesc = "Similar but less discerning sense of smell compared to humans.";
                }
            }else if(sc < 10){
                if(ss >= 3){
                    species.smelldesc = "Less sensitive but more discerning than human sense of smell.";
                }else{
                    species.smelldesc = "Less sensitive than human sense of smell.";
                }
            }
        }
        if(ss === 6){
            species.smelldesc += " Can distinguish individuals by scent.";
        }else if(ss === 5){
            species.smelldesc += " Can identify species, gender, and caste by scent.";
        }else if(ss === 4){
            species.smelldesc += " Can identify species and gender by scent.";
        }else if(ss === 3){
            species.smelldesc += " Can identify species by scent.";
        }

        species.touchconstant = getSenseConstant();
        species.touchsensitivity = getTouchSensitivity();
        species.touch = "T-"+species.touchconstant+"-"+species.touchsensitivity;
        var tc = parseInt(species.touchconstant,10);
        var ts = parseInt(species.touchsensitivity,16);
        if(tc > 6){
            if(ts >= 2){
                species.touchdesc = "More sensitive than human sense of touch.";
            }else{
                species.touchdesc = "More sensitive but less discerning than human sense of touch.";
            }
        }else if(tc === 6){
            if(ts > 2){
                species.touchdesc = "More sensitive than human sense of touch.";
            }else if(ts === 2){
                species.touchdesc = "Similar sense of touch compared humans.";
            }else{
                species.touchdesc = "Similar but less discerning sense of touch compared to humans.";
            }
        }else{
            if(ts >= 3){
                species.touchdesc = "Less sensitive but more discerning than human sense of touch.";
            }else{
                species.touchdesc = "Less sensitive than human sense of touch.";
            }
        }

        roll = d6() - d6();
        if(roll <= 0){
            species.aware = "Unaware";
            species.awaredesc = "Cannot perceive electricity/magnetic fields.";
        }else{
            species.awarenessconstant = getSenseConstant();
            species.awarenessacuity = getAwarenessAcuity();
            species.aware = "A-"+species.awarenessconstant+"-"+species.awarenessacuity;
            species.awaredesc = "Sensitive to electricity and magnetic fields.";
        }
    
        roll = d6() - d6();
        if(roll <= 1){
            species.percep = "Oblivious";
            species.percepdesc = "Cannot perceive life force.";
        }else{
            species.percepconstant = getSenseConstant();
            species.poice = getPerceptionPoice();
            species.poicetone = getPerceptionPoiceTone();
            
            var pd1 = "", pd2 = "";
            switch(species.poicetone){
                case "1": pd1 = "Very Intelligent"; break;
                case "2": pd1 = "Intelligent"; break;
                case "3": pd1 = "Sapient"; break;
                case "4": pd1 = "Conscious"; break;
                case "5": pd1 = "Rudimentary"; break;
                case "6": pd1 = "Artificial"; break;
            }
            switch(species.poice){
                case "1": pd2 = "Faint"; break;
                case "2": pd2 = "Vague"; break;
                case "3": pd2 = "Common"; break;
                case "4": pd2 = "Firm"; break;
                case "5": pd2 = "Strong"; break;
                case "6": pd2 = "Powerful"; break;
            }
            species.poicetonedescriptor = pd1;
            species.poicedescriptor= pd2;
            species.percep = "P-"+species.percepconstant+"-"+species.poicetone+species.poice;
            species.percepdesc = "Sensitive to projected life force as if it were sound.";
        }
    }
    function setLanguageMedium(){
        species.lowerLanguageFreq = -1;
        species.upperLanguageFreq = -1;
        if(species.hearing !== "Deaf"){             
            var voiceIsInHearingRange = false;
            var voicerange = parseInt(species.voicerange, 16),
                voice = parseInt(species.voice, 16),
                hearingspan = parseInt(species.hearingspan,16),
                hearingfreq = parseInt(species.hearingfreq,16);
            for(var i = voicerange * -1; i <= voicerange; i++){
                var voiceFreq = voice + i;
                if(voiceFreq >= hearingfreq - hearingspan && voiceFreq <= hearingfreq + hearingspan){
                    voiceIsInHearingRange = true;
                    if(species.lowerLanguageFreq === -1){
                        species.lowerLanguageFreq = voiceFreq;
                    }
                    species.upperLanguageFreq = voiceFreq;
                }
            }
            var languageFreq = "";
            if(species.lowerLanguageFreq <= 5 && species.upperLanguageFreq <= 5){
                languageFreq = "Infrasonic";
            }else if(species.lowerLanguageFreq <= 5 && species.upperLanguageFreq <= 12){   
                languageFreq = "Infrasonic to Human-Audible";
            }else if(species.lowerLanguageFreq <= 5 && species.upperLanguageFreq > 12){
                languageFreq = "Infrasonic, Human-Audible, and Ultrasonic";
            }else if(species.lowerLanguageFreq > 5 && species.upperLanguageFreq <= 12){
                languageFreq = "Human-Audible";
            }else if(species.lowerLanguageFreq > 5 && species.upperLanguageFreq > 12){
                languageFreq = "Human-Audible and Ultrasonic";
            }else if(species.lowerLanguageFreq > 12){
                languageFreq = "Ultrasonic";
            }
            if(voiceIsInHearingRange){
                var roll = d6() - d6();
                switch(roll){
                    case -5: 
                    case -4: species.voicedescriptor = "Whistles"; break;
                    case -3: species.voicedescriptor = "Vowels"; break;
                    case -2: species.voicedescriptor = "Musical"; break;
                    case -1:
                    case 0:
                    case 1: species.voicedescriptor = "Standard"; break;
                    case 2: species.voicedescriptor = "Gutteral"; break;
                    case 3: species.voicedescriptor = "Consonontal"; break;
                    case 4: species.voicedescriptor = "Clicks, Pops"; break;
                    case 5: species.voicedescriptor = "Mimic"; break;
                }
                species.language = "Verbal Language (" + languageFreq + (species.voicedescriptor === "Standard" ? "" :  " " + species.voicedescriptor) + ")";
            }else{
                species.language = "Multi-Modal Language (species cannot vocalize at a frequency it can hear)";
            }
        }else if(species.percep !== "Oblivious"){ 
            species.language = "Perceptual Language ("+species.poicetonedescriptor+", "+species.poicedescriptor+" Poice)";}
        else if(species.vision === "Blind" && species.aware !== "Unaware"){
            species.language = "Awareness Language";
        }else if(species.vision !== "Blind" && species.percep === "Oblivious" && species.hearing === "Deaf"){
            species.language = "Visual Sign Language";
        }else if(species.vision === "Blind" && species.percep === "Oblivious" && species.hearing === "Deaf"){
            species.language = "Tactile Sign Language";
        }
    }
    function setBodyStructure(){
        species.bodystructure = "A-B-CD-EF-G";
        species.head = "A"; species.torso = "B"; species.frontlimbs = "CD"; species.rearlimbs = "EF"; species.tail = "G";
        species.frontlimbs1 = 0;
        species.frontlimbs2 = 0;
        species.frontlimbsdesc = "";
        species.rearlimbs1 = 0;
        species.rearlimbs2 = 0;
        species.rearlimbgroups1 = 0;
        species.rearlimbgroups2 = 0;
        species.rearlimbsdesc = "";
        species.taillimbs = 0;
        species.taildesc = "";
        species.manipulators = 0;
        species.mouthmanipulator = false;
        species.stance = "Vertical";
        species.allmanipulators = "None";
        var limbsPerGroup = 0;
        // determine symmetry
        var roll = d6() - d6();
        if(species.locomotion === "Flyer"){ roll += 2;} 
        if(species.locomotion === "Swim" || species.locomotion === "Diver"){ roll -= 2;}
        if(roll > 5){ roll = 5;}else if(roll < -5){ roll = -5;}
        switch(roll){
            case -5:
            case -4:
            case -3: species.symmetry = "Asymmetrical"; break
            case -2:
            case -1:
            case 0:
            case 1: species.symmetry = "Bilateral"; limbsPerGroup = 2; break;
            case 2:
            case 3: species.symmetry = "Trilateral"; limbsPerGroup = 3; break;
            case 4:
            case 5: limbsPerGroup = d6(); species.symmetry = "Radial ("+limbsPerGroup+")";   break;
        }
        var structureMod = 0; 
        if(species.c2 === "Gra"){ structureMod -=2;}
        else if(species.c2 === "Agi"){structureMod += 2;}
        if(species.locomotion === "Swim" || species.locomotion === "Diver"){ structureMod += 2;}
        // head and torso
        roll = d6() - d6() + structureMod; if(roll > 5){ roll = 5;}else if(roll < -5){ roll = -5;}
        switch(roll){
            case -5: 
                species.head = "H"; species.torso="TBS"; 
                species.headdesc = "Head without a brain"; 
                species.torsodesc = "Torso with brain and senses";
            break;
            case -4: 
                species.head = "H"; species.torso="TB+S"; 
                species.headdesc = "Head without a brain"; 
                species.torsodesc = "Torso with brain; Senses are in limbs";
                break;
            case -3: 
                species.head = "HS"; species.torso="TB"; 
                species.headdesc = "Head with senses"; 
                species.torsodesc = "Torso with brain";
                break;
            case -2: 
                species.head = "HB"; species.torso="TS"; 
                species.headdesc = "Head with brain"; 
                species.torsodesc = "Torso with senses";
                break;
            case -1: 
            case 0:
            case 1: species.head = "HBS"; species.torso="T"; 
                species.headdesc = "Head with brain and senses";
                species.torsodesc = "Torso";
            break;
            case 2: 
                species.head = "HB"; species.torso="T+S"; 
                species.headdesc = "Head with brain"; 
                species.torsodesc = "Torso; Senses are in limbs";
                break;
            case 3: 
                species.head = "N"; species.torso = "TBS"; 
                species.headdesc = "No head"; 
                species.torsodesc = "Torso with brain and senses";
                break;
            case 4: 
                species.head = "N"; species.torso = "TB+S"; 
                species.headdesc = "No head"; 
                species.torsodesc = "Torso with brain; Senses are in limbs";
                break;
            case 5: 
                species.head = "N"; species.torso = "TBS"; 
                species.headdesc = "No head"; 
                species.torsodesc = "Torso with brain and senses";
                break;
        }     
        // front and rear limbs   
        if(species.locomotion === "Flyer"){
            // flyer front limbs
            roll = d6() - d6() + structureMod; if(roll > 5){ roll = 5;}else if(roll < -5){ roll = -5;}
            switch(roll){
                case -5: 
                case -4:
                    species.frontlimbs = "WW"; 
                    if(species.symmetry === "Asymmetrical"){
                        species.frontlimbs1 = d6();
                        species.frontlimbs2 = d6();
                    }else{
                        species.frontlimbs1 = limbsPerGroup;
                        species.frontlimbs2 = limbsPerGroup;
                    }
                    break;
                case -3:
                        species.frontlimbs = "WA"; 
                        if(species.symmetry === "Asymmetrical"){
                            species.frontlimbs1 = d6();
                            species.frontlimbs2 = d6();
                        }else{
                            species.frontlimbs1 = limbsPerGroup;
                            species.frontlimbs2 = limbsPerGroup;
                        }
                        species.manipulators += species.frontlimbs2;
                    break;
                case -2:
                    species.frontlimbs = "WN"; 
                    if(species.symmetry === "Asymmetrical"){
                        species.frontlimbs1 = d6();
                    }else{
                        species.frontlimbs1 = limbsPerGroup;
                    }
                    species.frontlimbs2 = 0;
                    break;
                case -1:
                case 0:
                case 1:
                    species.frontlimbs = "WL"; 
                    if(species.symmetry === "Asymmetrical"){
                        species.frontlimbs1 = d6();
                        species.frontlimbs2 = d6();
                    }else{
                        species.frontlimbs1 = limbsPerGroup;
                        species.frontlimbs2 = limbsPerGroup;
                    }
                    species.manipulators += species.frontlimbs2;
                    break;
                case 2:
                    species.frontlimbs = "WN"; 
                    if(species.symmetry === "Asymmetrical"){
                        species.frontlimbs1 = d6();
                    }else{
                        species.frontlimbs1 = limbsPerGroup;
                    }
                    species.frontlimbs2 = 0;
                    break;
                case 3:
                case 4:
                    species.frontlimbs = "AN"; 
                    if(species.symmetry === "Asymmetrical"){
                        species.frontlimbs1 = d6();
                    }else{
                        species.frontlimbs1 = limbsPerGroup;
                    }
                    species.frontlimbs2 = 0;
                    species.manipulators += species.frontlimbs1;
                    break;
                case 5: 
                    species.frontlimbs = "AA"; 
                    if(species.symmetry === "Asymmetrical"){
                        species.frontlimbs1 = d6();
                        species.frontlimbs2 = d6();
                    }else{
                        species.frontlimbs1 = limbsPerGroup;
                        species.frontlimbs2 = limbsPerGroup;
                    }
                    species.manipulators += species.frontlimbs2 + species.frontlimbs1;
                    break;
            }
            // flyer rear limbs
            roll = d6() - d6() + structureMod; if(roll > 5){ roll = 5;}else if(roll < -5){ roll = -5;}
            switch(roll){
                case -5: 
                    species.rearlimbs = "WW"; 
                    if(species.symmetry === "Asymmetrical"){
                        species.rearlimbs1 = d6();
                        species.rearlimbs2 = d6();
                    }else{
                        species.rearlimbs1 = limbsPerGroup;
                        species.rearlimbs2 = limbsPerGroup;
                    }
                    species.stance = "Horizontal";
                    break;
                case -4:
                    species.rearlimbs = "WM"; 
                    species.rearlimbgroups2 = posFlux()+2;
                    if(species.symmetry === "Asymmetrical"){
                        species.rearlimbs1 = d6();
                        species.rearlimbs2 = 0;
                        for(var i = 0; i < species.rearlimbgroups2; i++){
                            species.rearlimbs2 += d6();
                        }
                    }else{
                        species.rearlimbs1 = limbsPerGroup;
                        species.rearlimbs2 = species.rearlimbgroups2 * limbsPerGroup;
                    }
                    break;
                case -3:
                    species.rearlimbs = "WL";
                    if(species.symmetry === "Asymmetrical"){
                        species.rearlimbs1 = d6();
                        species.rearlimbs2 = d6();
                    }else{
                        species.rearlimbs1 = limbsPerGroup;
                        species.rearlimbs2 = limbsPerGroup;
                    }
                    break;
                case -2:     
                case -1:
                    species.rearlimbs = "WN";
                    if(species.symmetry === "Asymmetrical"){
                        species.rearlimbs1 = d6();
                    }else{
                        species.rearlimbs1 = limbsPerGroup;
                    }
                    species.stance = "Horizontal";
                    break;
                case 0:
                case 1:
                case 2: 
                    species.rearlimbs = "LN";
                    if(species.symmetry === "Asymmetrical"){
                        species.rearlimbs1 = d6();
                    }else{
                        species.rearlimbs1 = limbsPerGroup;
                    }
                    break;
                case 3:
                    species.rearlimbs = "LM";
                    species.rearlimbgroups2 = posFlux()+2;
                    if(species.symmetry === "Asymmetrical"){
                        species.rearlimbs1 = d6();
                        species.rearlimbs2 = 0;
                        for(var i = 0; i < species.rearlimbgroups2; i++){
                            species.rearlimbs2 += d6();
                        }
                    }else{
                        species.rearlimbs1 = limbsPerGroup;
                        species.rearlimbs2 = species.rearlimbgroups2 * limbsPerGroup;
                    }
                    break;
                case 4:
                    species.rearlimbs = "MM";
                    species.rearlimbgroups1 = posFlux()+2;
                    species.rearlimbgroups2 = posFlux()+2;
                    if(species.symmetry === "Asymmetrical"){
                        species.rearlimbs1 = 0;
                        for(var i = 0; i < species.rearlimbgroups1; i++){
                            species.rearlimbs1 += d6();
                        }
                        species.rearlimbs2 = 0;
                        for(var i = 0; i < species.rearlimbgroups2; i++){
                            species.rearlimbs2 += d6();
                        }
                    }else{
                        species.rearlimbs1 = species.rearlimbgroups1 * limbsPerGroup;
                        species.rearlimbs2 = species.rearlimbgroups2 * limbsPerGroup;
                    }
                    break;
                case 5:
                    species.rearlimbs = "NN";
                    species.stance = "Horizontal";

            }
        }else if(species.locomotion === "Walker"){
            // walker front limbs
            roll = d6() - d6() + structureMod; if(roll > 5){ roll = 5;}else if(roll < -5){ roll = -5;}
            switch(roll){
                case -5:
                case -4:
                    species.frontlimbs = "AA";
                    if(species.symmetry === "Asymmetrical"){
                        species.frontlimbs1 = d6();
                        species.frontlimbs2 = d6();
                    }else{
                        species.frontlimbs1 = limbsPerGroup;
                        species.frontlimbs2 = limbsPerGroup;
                    }
                    species.manipulators += species.frontlimbs1 + species.frontlimbs2;
                    break;
                case -3:
                case -2:
                    species.frontlimbs = "AN";
                    if(species.symmetry === "Asymmetrical"){
                        species.frontlimbs1 = d6();
                    }else{
                        species.frontlimbs1 = limbsPerGroup;
                    }
                    species.manipulators += species.frontlimbs1;
                    break;
                case -1:
                case 0:
                case 1:
                    species.frontlimbs = "LL";
                    if(species.symmetry === "Asymmetrical"){
                        species.frontlimbs1 = d6();
                        species.frontlimbs2 = d6();
                    }else{
                        species.frontlimbs1 = limbsPerGroup;
                        species.frontlimbs2 = limbsPerGroup;
                    }
                    species.manipulators += species.frontlimbs1 + species.frontlimbs2;
                    break;
                case 2:
                    species.frontlimbs = "LN";
                    if(species.symmetry === "Asymmetrical"){
                        species.frontlimbs1 = d6();
                    }else{
                        species.frontlimbs1 = limbsPerGroup;
                    }
                    species.manipulators += species.frontlimbs1;
                    break;
                case 3:
                case 4:
                    species.frontlimbs = "AL";
                    if(species.symmetry === "Asymmetrical"){
                        species.frontlimbs1 = d6();
                        species.frontlimbs2 = d6();
                    }else{
                        species.frontlimbs1 = limbsPerGroup;
                        species.frontlimbs2 = limbsPerGroup;
                    }
                    species.manipulators += species.frontlimbs1 + species.frontlimbs2;
                    break;
                case 5:
                    species.frontlimbs = "AN";
                    if(species.symmetry === "Asymmetrical"){
                        species.frontlimbs1 = d6();
                    }else{
                        species.frontlimbs1 = limbsPerGroup;
                    }
                    species.manipulators += species.frontlimbs1;
                    break;
            }
            // walker rear limbs
            roll = d6() - d6() + structureMod; if(roll > 5){ roll = 5;}else if(roll < -5){ roll = -5;}
            switch(roll){
                case -5:
                case -4:
                    species.rearlimbs = "LL";
                    if(species.symmetry === "Asymmetrical"){
                        species.rearlimbs1 = d6();
                        species.rearlimbs2 = d6();
                    }else{
                        species.rearlimbs1 = limbsPerGroup;
                        species.rearlimbs2 = limbsPerGroup;
                    }
                    break;
                case -3:
                case -2:
                case -1:
                case 0:
                case 1: 
                case 2: 
                    species.rearlimbs = "LN";
                    if(species.symmetry === "Asymmetrical"){
                        species.rearlimbs1 = d6();
                    }else{
                        species.rearlimbs1 = limbsPerGroup;
                    }
                    break;
                case 3:
                    species.rearlimbs = "LM";
                    species.rearlimbgroups2 = posFlux()+2;
                    if(species.symmetry === "Asymmetrical"){
                        species.rearlimbs1 = d6();
                        species.rearlimbs2 = 0;
                        for(var i = 0; i < species.rearlimbgroups2; i++){
                            species.rearlimbs2 += d6();
                        }
                    }else{
                        species.rearlimbs1 = limbsPerGroup;
                        species.rearlimbs2 = species.rearlimbgroups2 * limbsPerGroup;
                    }
                    break;
                case 4:
                    species.rearlimbs = "MM";
                    species.rearlimbgroups1 = posFlux()+2;
                    species.rearlimbgroups2 = posFlux()+2;
                    if(species.symmetry === "Asymmetrical"){
                        species.rearlimbs1 = 0;
                        for(var i = 0; i < species.rearlimbgroups1; i++){
                            species.rearlimbs1 += d6();
                        }
                        species.rearlimbs2 = 0;
                        for(var i = 0; i < species.rearlimbgroups2; i++){
                            species.rearlimbs2 += d6();
                        }
                    }else{
                        species.rearlimbs1 = species.rearlimbgroups1 * limbsPerGroup;
                        species.rearlimbs2 = species.rearlimbgroups2 * limbsPerGroup;
                    }
                    break;
                case 5:
                    species.rearlimbs = "NN";
                    species.stance = "Horizontal";
                    break;
            }
        }
        else if(species.locomotion === "Aquatic" || species.locomotion === "Amphib"){
            // aquatic front limbs
            roll = d6() - d6() + structureMod; if(roll > 5){ roll = 5;}else if(roll < -5){ roll = -5;}
            switch(roll){
                case -5:
                case -4:
                    species.frontlimbs = "AA";
                    if(species.symmetry === "Asymmetrical"){
                        species.frontlimbs1 = d6();
                        species.frontlimbs2 = d6();
                    }else{
                        species.frontlimbs1 = limbsPerGroup;
                        species.frontlimbs2 = limbsPerGroup;
                    }
                    species.manipulators += species.frontlimbs1 + species.frontlimbs2;
                    break;
                case -3:
                    species.frontlimbs = "AF";
                    if(species.symmetry === "Asymmetrical"){
                        species.frontlimbs1 = d6();
                        species.frontlimbs2 = d6();
                    }else{
                        species.frontlimbs1 = limbsPerGroup;
                        species.frontlimbs2 = limbsPerGroup;
                    }
                    species.manipulators += species.frontlimbs1;
                    break;
                case -2:
                    species.frontlimbs = "AN";
                    if(species.symmetry === "Asymmetrical"){
                        species.frontlimbs1 = d6();
                    }else{
                        species.frontlimbs1 = limbsPerGroup;
                    }
                    species.manipulators += species.frontlimbs1;
                    break;
                case -1:
                case 0:
                case 1: 
                    species.frontlimbs = "AL";
                    if(species.symmetry === "Asymmetrical"){
                        species.frontlimbs1 = d6();
                        species.frontlimbs2 = d6();
                    }else{
                        species.frontlimbs1 = limbsPerGroup;
                        species.frontlimbs2 = limbsPerGroup;
                    }
                    species.manipulators += species.frontlimbs1 + species.frontlimbs2;
                    break;
                case 2:
                    species.frontlimbs = "AW";
                    if(species.symmetry === "Asymmetrical"){
                        species.frontlimbs1 = d6();
                        species.frontlimbs2 = d6();
                    }else{
                        species.frontlimbs1 = limbsPerGroup;
                        species.frontlimbs2 = limbsPerGroup;
                    }
                    species.manipulators += species.frontlimbs1;
                    break;
                case 3:
                case 4:
                    species.frontlimbs = "AF";
                    if(species.symmetry === "Asymmetrical"){
                        species.frontlimbs1 = d6();
                        species.frontlimbs2 = d6();
                    }else{
                        species.frontlimbs1 = limbsPerGroup;
                        species.frontlimbs2 = limbsPerGroup;
                    }
                    species.manipulators += species.frontlimbs1;
                    break;
                case 5: 
                    species.frontlimbs = "AN";
                    if(species.symmetry === "Asymmetrical"){
                        species.frontlimbs1 = d6();
                    }else{
                        species.frontlimbs1 = limbsPerGroup;
                    }
                    species.manipulators += species.frontlimbs1;
                    break;
            }
            // aquatic rear limbs
            roll = d6() - d6() + structureMod; if(roll > 5){ roll = 5;}else if(roll < -5){ roll = -5;}
            switch(roll){
                case -5:
                    species.rearlimbs = "FF";
                    if(species.symmetry === "Asymmetrical"){
                        species.rearlimbs1 = d6();
                        species.rearlimbs2 = d6();
                    }else{
                        species.rearlimbs1 = limbsPerGroup;
                        species.rearlimbs2 = limbsPerGroup;
                    }
                    break;
                case -4:
                    species.rearlimbs = "LF";
                    if(species.symmetry === "Asymmetrical"){
                        species.rearlimbs1 = d6();
                        species.rearlimbs2 = d6();
                    }else{
                        species.rearlimbs1 = limbsPerGroup;
                        species.rearlimbs2 = limbsPerGroup;
                    }
                    break;
                case -3:
                    species.rearlimbs = "LL";
                    if(species.symmetry === "Asymmetrical"){
                        species.rearlimbs1 = d6();
                        species.rearlimbs2 = d6();
                    }else{
                        species.rearlimbs1 = limbsPerGroup;
                        species.rearlimbs2 = limbsPerGroup;
                    }
                    break;
                case -2:
                    species.rearlimbs = "LN";
                    if(species.symmetry === "Asymmetrical"){
                        species.rearlimbs1 = d6();
                    }else{
                        species.rearlimbs1 = limbsPerGroup;
                    }
                    break;
                case -1:
                case 0:
                    species.rearlimbs = "FN";
                    if(species.symmetry === "Asymmetrical"){
                        species.rearlimbs1 = d6();
                    }else{
                        species.rearlimbs1 = limbsPerGroup;
                    }
                    break;
                case 1:
                    species.rearlimbs = "LN";
                    if(species.symmetry === "Asymmetrical"){
                        species.rearlimbs1 = d6();
                    }else{
                        species.rearlimbs1 = limbsPerGroup;
                    }
                    break;
                case 2:
                    species.rearlimbs = "WL";
                    if(species.symmetry === "Asymmetrical"){
                        species.rearlimbs1 = d6();
                        species.rearlimbs2 = d6();
                    }else{
                        species.rearlimbs1 = limbsPerGroup;
                        species.rearlimbs2 = limbsPerGroup;
                    }
                    break;
                case 3:
                    species.rearlimbs = "WF";
                    if(species.symmetry === "Asymmetrical"){
                        species.rearlimbs1 = d6();
                        species.rearlimbs2 = d6();
                    }else{
                        species.rearlimbs1 = limbsPerGroup;
                        species.rearlimbs2 = limbsPerGroup;
                    }
                    break;
                case 4:
                    species.rearlimbs = "FM";
                    species.rearlimbgroups2 = posFlux()+2;
                    if(species.symmetry === "Asymmetrical"){
                        species.rearlimbs1 = d6();
                        species.rearlimbs2 = 0;
                        for(var i = 0; i < species.rearlimbgroups2; i++){
                            species.rearlimbs2 += d6();
                        }
                    }else{
                        species.rearlimbs1 = limbsPerGroup;
                        species.rearlimbs2 = limbsPerGroup * species.rearlimbgroups2;
                    }
                    break;
                case 5:
                    species.rearlimbs = "MM";
                    species.rearlimbgroups1 = posFlux()+2;
                    species.rearlimbgroups2 = posFlux()+2;
                    if(species.symmetry === "Asymmetrical"){
                        species.rearlimbs1 = 0;
                        species.rearlimbs2 = 0;
                        for(var i = 0; i < species.rearlimbgroups1; i++){
                            species.rearlimbs1 += d6();
                        }
                        for(var i = 0; i < species.rearlimbgroups2; i++){
                            species.rearlimbs2 += d6();
                        }
                    }else{
                        species.rearlimbs1 = limbsPerGroup * species.rearlimbgroups1;
                        species.rearlimbs2 = limbsPerGroup * species.rearlimbgroups2;
                    }
                    break;
            }
        }else if(species.locomotion === "Diver" || species.locomotion === "Swim"){
            // diver front limbs
            roll = d6() - d6() + structureMod; if(roll > 5){ roll = 5;}else if(roll < -5){ roll = -5;}
            switch(roll){
                case -5: 
                case -4:
                    species.frontlimbs = "AA";
                    if(species.symmetry === "Asymmetrical"){
                        species.frontlimbs1 = d6();
                        species.frontlimbs2 = d6();
                    }else{
                        species.frontlimbs1 = limbsPerGroup;
                        species.frontlimbs2 = limbsPerGroup;
                    }
                    species.manipulators += species.frontlimbs1 + species.frontlimbs2;
                    break;
                case -3:
                case -2:
                    species.frontlimbs = "AF";
                    if(species.symmetry === "Asymmetrical"){
                        species.frontlimbs1 = d6();
                        species.frontlimbs2 = d6();
                    }else{
                        species.frontlimbs1 = limbsPerGroup;
                        species.frontlimbs2 = limbsPerGroup;
                    }
                    species.manipulators += species.frontlimbs1;
                    break;
                case -1:
                case 0:
                case 1: 
                    species.frontlimbs = "AL";
                    if(species.symmetry === "Asymmetrical"){
                        species.frontlimbs1 = d6();
                        species.frontlimbs2 = d6();
                    }else{
                        species.frontlimbs1 = limbsPerGroup;
                        species.frontlimbs2 = limbsPerGroup;
                    }
                    species.manipulators += species.frontlimbs1 + species.frontlimbs2;
                    break;
                case 2:
                    species.frontlimbs = "FF";
                    if(species.symmetry === "Asymmetrical"){
                        species.frontlimbs1 = d6();
                        species.frontlimbs2 = d6();
                    }else{
                        species.frontlimbs1 = limbsPerGroup;
                        species.frontlimbs2 = limbsPerGroup;
                    }
                    break;
                case 3:
                case 4:
                    species.frontlimbs = "AF";
                    if(species.symmetry === "Asymmetrical"){
                        species.frontlimbs1 = d6();
                        species.frontlimbs2 = d6();
                    }else{
                        species.frontlimbs1 = limbsPerGroup;
                        species.frontlimbs2 = limbsPerGroup;
                    }
                    species.manipulators += species.frontlimbs1;
                    break;
                case 5:
                    species.frontlimbs = "AN";
                    if(species.symmetry === "Asymmetrical"){
                        species.frontlimbs1 = d6();
                    }else{
                        species.frontlimbs1 = limbsPerGroup;
                    }
                    species.manipulators += species.frontlimbs1;
                    break;

            }
            // diver rear limbs
            roll = d6() - d6() + structureMod; if(roll > 5){ roll = 5;}else if(roll < -5){ roll = -5;}
            switch(roll){
                case -5:
                    species.rearlimbs = "FF";
                    if(species.symmetry === "Asymmetrical"){
                        species.rearlimbs1 = d6();
                        species.rearlimbs2 = d6();
                    }else{
                        species.rearlimbs1 = limbsPerGroup;
                        species.rearlimbs2 = limbsPerGroup;
                    }
                    break;
                case -4:
                    species.rearlimbs = "LF";
                    if(species.symmetry === "Asymmetrical"){
                        species.rearlimbs1 = d6();
                        species.rearlimbs2 = d6();
                    }else{
                        species.rearlimbs1 = limbsPerGroup;
                        species.rearlimbs2 = limbsPerGroup;
                    }
                    break;
                case -3:
                    species.rearlimbs = "LL";
                    if(species.symmetry === "Asymmetrical"){
                        species.rearlimbs1 = d6();
                        species.rearlimbs2 = d6();
                    }else{
                        species.rearlimbs1 = limbsPerGroup;
                        species.rearlimbs2 = limbsPerGroup;
                    }
                    break;
                case -2:
                    species.rearlimbs = "LN";
                    if(species.symmetry === "Asymmetrical"){
                        species.rearlimbs1 = d6();
                    }else{
                        species.rearlimbs1 = limbsPerGroup;
                    }
                    break;
                case -1:
                case 0:
                    species.rearlimbs = "FN";
                    if(species.symmetry === "Asymmetrical"){
                        species.rearlimbs1 = d6();
                    }else{
                        species.rearlimbs1 = limbsPerGroup;
                    }
                    break;
                case 1:
                    species.rearlimbs = "LN";
                    if(species.symmetry === "Asymmetrical"){
                        species.rearlimbs1 = d6();
                    }else{
                        species.rearlimbs1 = limbsPerGroup;
                    }
                    break;
                case 2:
                case 3: 
                    species.rearlimbs = "FF";
                    if(species.symmetry === "Asymmetrical"){
                        species.rearlimbs1 = d6();
                        species.rearlimbs2 = d6();
                    }else{
                        species.rearlimbs1 = limbsPerGroup;
                        species.rearlimbs2 = limbsPerGroup;
                    }
                    break;
                    case 4:
                        species.rearlimbs = "FM";
                        species.rearlimbgroups2 = posFlux()+2;
                        if(species.symmetry === "Asymmetrical"){
                            species.rearlimbs1 = d6();
                            species.rearlimbs2 = 0;
                            for(var i = 0; i < species.rearlimbgroups2; i++){
                                species.rearlimbs2 += d6();
                            }
                        }else{
                            species.rearlimbs1 = limbsPerGroup;
                            species.rearlimbs2 = limbsPerGroup * species.rearlimbgroups2;
                        }
                        break;
                    case 5:
                        species.rearlimbs = "MM";
                        species.rearlimbgroups1 = posFlux()+2;
                        species.rearlimbgroups2 = posFlux()+2;
                        if(species.symmetry === "Asymmetrical"){
                            species.rearlimbs1 = 0;
                            species.rearlimbs2 = 0;
                            for(var i = 0; i < species.rearlimbgroups1; i++){
                                species.rearlimbs1 += d6();
                            }
                            for(var i = 0; i < species.rearlimbgroups2; i++){
                                species.rearlimbs2 += d6();
                            }
                        }else{
                            species.rearlimbs1 = limbsPerGroup * species.rearlimbgroups1;
                            species.rearlimbs2 = limbsPerGroup * species.rearlimbgroups2;
                        }
                        break;

            }
        }else if(species.locomotion === "Triphib" || species.locomotion === "Flyphib"){
            // flyphib front limbs
            roll = d6() - d6() + structureMod; if(roll > 5){ roll = 5;}else if(roll < -5){ roll = -5;}
            switch(roll){
                case -5:
                    species.frontlimbs = "FF";
                    if(species.symmetry === "Asymmetrical"){
                        species.frontlimbs1 = d6();
                        species.frontlimbs2 = d6();
                    }else{
                        species.frontlimbs1 = limbsPerGroup;
                        species.frontlimbs2 = limbsPerGroup;
                    }
                    break;
                case -4:
                    species.frontlimbs = "WW"; 
                    if(species.symmetry === "Asymmetrical"){
                        species.frontlimbs1 = d6();
                        species.frontlimbs2 = d6();
                    }else{
                        species.frontlimbs1 = limbsPerGroup;
                        species.frontlimbs2 = limbsPerGroup;
                    }
                    break;
                case -3:
                case -2:
                        species.frontlimbs = "WA"; 
                        if(species.symmetry === "Asymmetrical"){
                            species.frontlimbs1 = d6();
                            species.frontlimbs2 = d6();
                        }else{
                            species.frontlimbs1 = limbsPerGroup;
                            species.frontlimbs2 = limbsPerGroup;
                        }
                        species.manipulators += species.frontlimbs2;
                    break;
                case -1:
                case 0:
                case 1:
                    species.frontlimbs = "WL"; 
                    if(species.symmetry === "Asymmetrical"){
                        species.frontlimbs1 = d6();
                        species.frontlimbs2 = d6();
                    }else{
                        species.frontlimbs1 = limbsPerGroup;
                        species.frontlimbs2 = limbsPerGroup;
                    }
                    species.manipulators += species.frontlimbs2;
                    break;
                case 2: 
                    species.frontlimbs = "WN"; 
                    if(species.symmetry === "Asymmetrical"){
                        species.frontlimbs1 = d6();
                    }else{
                        species.frontlimbs1 = limbsPerGroup;
                    }
                    species.frontlimbs2 = 0;
                    break;
                case 3:
                case 4: 
                    species.frontlimbs = "FN";
                    if(species.symmetry === "Asymmetrical"){
                        species.frontlimbs1 = d6();
                    }else{
                        species.frontlimbs1 = limbsPerGroup;
                    }
                    break;
                case 5: 
                    species.frontlimbs = "FF";
                    if(species.symmetry === "Asymmetrical"){
                        species.frontlimbs1 = d6();
                        species.frontlimbs2 = d6();
                    }else{
                        species.frontlimbs1 = limbsPerGroup;
                        species.frontlimbs2 = limbsPerGroup;
                    }
                    break;
            }

            // flyphib rear limbs
            roll = d6() - d6() + structureMod; if(roll > 5){ roll = 5;}else if(roll < -5){ roll = -5;}
            switch(roll){
                case -5:
                    species.rearlimbs = "FF";
                    if(species.symmetry === "Asymmetrical"){
                        species.rearlimbs1 = d6();
                        species.rearlimbs2 = d6();
                    }else{
                        species.rearlimbs1 = limbsPerGroup;
                        species.rearlimbs2 = limbsPerGroup;
                    }
                    break;
                case -4:
                    species.rearlimbs = "FM";
                    species.rearlimbgroups2 = posFlux()+2;
                    if(species.symmetry === "Asymmetrical"){
                        species.rearlimbs1 = d6();
                        species.rearlimbs2 = 0;
                        for(var i = 0; i < species.rearlimbgroups2; i++){
                            species.rearlimbs2 += d6();
                        }
                    }else{
                        species.rearlimbs1 = limbsPerGroup;
                        species.rearlimbs2 = limbsPerGroup * species.rearlimbgroups2;
                    }
                    break;
                case -3:
                    species.rearlimbs = "FL";
                    if(species.symmetry === "Asymmetrical"){
                        species.rearlimbs1 = d6();
                        species.rearlimbs2 = d6();
                    }else{
                        species.rearlimbs1 = limbsPerGroup;
                        species.rearlimbs2 = limbsPerGroup;
                    }
                    break;
                case -2:
                    species.rearlimbs = "FN";
                    if(species.symmetry === "Asymmetrical"){
                        species.rearlimbs1 = d6();
                    }else{
                        species.rearlimbs1 = limbsPerGroup;
                    }
                    break;
                case -1:
                    species.rearlimbs = "FF";
                    if(species.symmetry === "Asymmetrical"){
                        species.rearlimbs1 = d6();
                        species.rearlimbs2 = d6();
                    }else{
                        species.rearlimbs1 = limbsPerGroup;
                        species.rearlimbs2 = limbsPerGroup;
                    }
                    break;
                case 0:
                case 1:
                case 2:
                case 3:
                    species.rearlimbs = "FN";
                    if(species.symmetry === "Asymmetrical"){
                        species.rearlimbs1 = d6();
                    }else{
                        species.rearlimbs1 = limbsPerGroup;
                    }
                    break;
                case 4:
                    species.rearlimbs = "FM";
                    species.rearlimbgroups2 = posFlux()+2;
                    if(species.symmetry === "Asymmetrical"){
                        species.rearlimbs1 = d6();
                        species.rearlimbs2 = 0;
                        for(var i = 0; i < species.rearlimbgroups2; i++){
                            species.rearlimbs2 += d6();
                        }
                    }else{
                        species.rearlimbs1 = limbsPerGroup;
                        species.rearlimbs2 = limbsPerGroup * species.rearlimbgroups2;
                    }
                    break;
                case 5:
                    species.rearlimbs = "NN";
                    species.stance = "Horizontal";
                    break;
            }
        }
        
        // tail
        species.nonstandardmanipulators = 0;
        roll = d6() - d6() + structureMod; if(roll > 5){ roll = 5;}else if(roll < -5){ roll = -5;}
        switch(roll){
            case -5:
                species.tail = "P";
                species.taildesc = "Proboscis/Extended Snout";
                species.taillimbs = 1;
                species.nonstandardmanipulators += 1;
                break;
            case -4:
                species.tail = "V";
                species.taildesc = "Vestigial Tail";
                species.taillimbs = 0;
                break;
            case -3:
            case -2: 
                species.tail = "T";
                species.taildesc = "Tail";
                species.taillimbs = 1;
                break;
            case -1:
            case 0:
            case 1:
            case 2:
            case 3: 
                species.tail = "N";
                species.taildesc = "No Tail";
                species.taillimbs = 0;
                break;
            case 4:
                species.tail = "M";
                species.taildesc = "Prehensile Tail";
                species.taillimbs = 1;
                species.nonstandardmanipulators += 1;
                break;
            case 5:
                species.tail = "A";
                species.taildesc = "Antennae";
                species.taillimbs = species.symmetry === "Asymmetrical" ? d6() : limbsPerGroup;
                break;
        }
        var featureMod = 0;
        if(species.locomotion === "Swim"){
            featureMod += 1;
        }else if(species.locomotion === "Flyer"){
            featureMod -= 1;
        }
        roll = d6() - d6() + featureMod;
        switch(roll){
            case -6:
            case -5:
            case -4:
                species.skeleton = "Fluid Interior Sacs";
                break;
            case -3:
            case -2:
                species.skeleton = "Cartilage Interior";
                break;
            case -1:
            case 0:
            case 1:
                species.skeleton = "Bony Interior";
                break;
            case 2:
            case 3:
                species.skeleton = "Exoskeleton";
                break;
            case 4:
            case 5:
            case 6:
                species.skeleton = "Segmented Shell";
                break;
        }
        roll = d6() - d6() + featureMod;
        switch(roll){
            case -6:
            case -5:
                species.fluids = "Foam";
                break;
            case -4:
                species.fluids = "Lymph";
                break;
            case -3:
                species.fluids = "Hemolymph";
                break;
            case -2:
                species.fluids = "Ichor";
                break;
            case -1:
            case 0:
            case 1:
                species.fluids = "Blood";
                break;
            case 2:
                species.fluids = "Gore";
                break;
            case 3:
                species.fluids = "Slime";
                break;
            case 4:
                species.fluids = "Scum";
                break;
            case 5:
            case 6:
                species.fluids = "Humours";
                break;
        }
        roll = d6() - d6() + featureMod;
        switch(roll){
            case -6:
            case -5:
                species.skin = "Feathery Pelt";
                break;
            case -4:
                species.skin = "Furry Pelt";
                break;
            case -3:
                species.skin = "Hairy Pelt";
                break;
            case -2:
                species.skin = "Leather";
                break;
            case -1:
            case 0:
            case 1:
                species.skin = "Skin";
                break;
            case 2:
                species.skin = "Fine Scales";
                break;
            case 3:
                species.skin = "Scales";
                break;
            case 4:
                species.skin = "Spines";
                break;
            case 5:
            case 6:
                species.skin = "Plates";
                break; 
        }
        roll = d6() - d6() + featureMod;
        if(species.bodystructure.indexOf("L") < 0){
            while(roll === 3){ // re-roll hooves if no legs
                roll = d6() - d6() + featureMod;
            }
        }
        switch(roll){
            case -6:
            case -5:
                species.naturalweapon = "None";
                break;
            case -4:
                species.naturalweapon = "Tusks";
                break;
            case -3:
                species.naturalweapon = "Fangs";
                break;
            case -2:
                species.naturalweapon = "Teeth";
                break;
            case -1:
            case 0:
            case 1:
                species.naturalweapon = "None";
                break;
            case 2:
                species.naturalweapon = "Claws";
                break;
            case 3:
                species.naturalweapon = "Hooves";
                break;
            case 4:
                species.naturalweapon = "Spikes";
                break;
            case 5:
            case 6:
                species.naturalweapon = "Sting";
                break;
        }
        if(species.manipulators + species.nonstandardmanipulators === 0){ species.mouthmanipulator = true; species.manipulators += 1; }
        if(species.mouthmanipulator){
            roll = d6() - d6() - featureMod;
            if(roll <= -2){
                species.manipulatordesc = "Mouth (Gripper)";
            }else if(roll <= 2){
                species.manipulatordesc = "Mouth (Socket)";
            }else{
                species.manipulatordesc = "Mouth (Grasper)";
            }
            species.allmanipulators = species.manipulatordesc;
        }else{
            roll = d6() - d6() + featureMod;
            switch(roll){
                case -6:
                case -5:
                case -4:
                    species.manipulatordesc = "Tentacles";
                    break;
                case -3:
                case -2:
                    species.manipulatordesc = "Grippers";
                    break;
                case -1:
                case 0:
                    species.manipulatordesc = "Hands";
                    break;
                case 1:
                case 2:
                    species.manipulatordesc = "Paws";
                    break;
                case 3:
                case 4:
                    species.manipulatordesc = "Graspers";
                    break;
                case 5:
                case 6:
                    species.manipulatordesc = "Sockets";
                    break;
            }
            species.allmanipulators = species.manipulators + " " + species.manipulatordesc;
            if(species.tail === "P"){
                // add proboscis descriptor to manipulator desc
                roll = d6() - d6();
                var proboscis = "";
                switch(roll){
                    case -5: proboscis = "Hand"; break;
                    case -4: proboscis = "Grasper"; break;
                    case -3: proboscis = "Gripper"; break;
                    case -2: proboscis = "Tentacle"; break;
                    case -1:
                    case 0:
                    case 1: proboscis = "Socket"; break;
                    case 2: proboscis = "Gripper"; break;
                    case 3: proboscis = "Tentacle"; break;
                    case 4: proboscis = "Grasper"; break;
                    case 5: proboscis = "Tentacle"; break;
                }
                species.allmanipulators += ", "+species.nonstandardmanipulators + " Proboscis (" + proboscis +")";
            }else if(species.tail === "M"){
                // add tail descriptor to manipulator desc
                roll = d6() - d6();
                var tail = "";
                switch(roll){
                    case -5: tail = "Hand"; break;
                    case -4: tail = "Grasper"; break;
                    case -3: tail = "Gripper"; break;
                    case -2: tail = "Socket"; break;
                    case -1:
                    case 0:
                    case 1: tail = "Tentacle"; break;
                    case 2: tail = "Socket"; break;
                    case 3: tail = "Gripper"; break;
                    case 4: tail = "Grasper"; break;
                    case 5: tail = "Hand"; break;
                }
                species.allmanipulators += ", "+species.nonstandardmanipulators + " Tail (" + tail +")";
            }
        }
            
        if(species.frontlimbs[0] === species.frontlimbs[1]){
            var lc = (species.frontlimbs1 + species.frontlimbs2).toString();
            switch(species.frontlimbs[0]){
                case "W": species.frontlimbsdesc += lc  + " wing"+(lc > 1? "s":""); break;
                case "A": species.frontlimbsdesc += lc  + " arm"+(lc > 1? "s":""); break;
                case "L":  species.frontlimbsdesc += lc + " leg"+(lc > 1? "s":"")+" with manipulators"; break;
                case "F": species.frontlimbsdesc += lc  + " flipper"+(lc > 1? "s":""); break;
                case "N": break;
            }
        }else{
            for(var i = 0; i < 2; i++){
                var lc = (i === 0 ? species.frontlimbs1 : species.frontlimbs2);
                switch(species.frontlimbs[i]){
                    case "W": species.frontlimbsdesc += lc  + " wing"+(lc > 1? "s":""); break;
                    case "A": species.frontlimbsdesc += lc  + " arm"+(lc > 1? "s":""); break;
                    case "L":  species.frontlimbsdesc += lc + " leg"+(lc > 1? "s":"")+" with manipulators"; break;
                    case "F": species.frontlimbsdesc += lc  + " flipper"+(lc > 1? "s":""); break;
                    case "N": break;
                }
                if(i == 0 && species.frontlimbs[1] !== "N"){
                    species.frontlimbsdesc += " and ";
                }
            }     
        }
        if(species.rearlimbs[0] === species.rearlimbs[1]){
            var lc = (species.rearlimbs1 + species.rearlimbs2).toString();
            switch(species.rearlimbs[0]){
                case "W": 
                    species.rearlimbsdesc += lc + " wing"+(lc > 1? "s":""); break;
                case "M": 
                    species.rearlimbsdesc += (species.rearlimbs1+species.rearlimbs2) + " leg"+(lc > 1? "s":"")+" ( in " + (species.rearlimbgroups1 + species.rearlimbgroups2) + " groups)";
                        //species.rearlimbs1 + " leg"+(lc > 1? "s":"")+" (in "+species.rearlimbgroups1+" groups) and "+ 
                        //species.rearlimbs2 + " leg"+(lc > 1? "s":"")+" (in "+species.rearlimbgroups2+" groups)"; 
                    break;
                case "L": species.rearlimbsdesc += lc  + " leg"+(lc > 1? "s":""); break;
                case "F": species.rearlimbsdesc += lc  + " flipper"+(lc > 1? "s":""); break;
                case "N": break;
            }
        }else{
            for(var i = 0; i < 2; i++){
                var lc = (i === 0 ? species.rearlimbs1 : species.rearlimbs2);
                switch(species.rearlimbs[i]){
                    case "W": 
                    species.rearlimbsdesc += lc + " wing"+(lc > 1? "s":""); break;
                    case "M": 
                    species.rearlimbsdesc += (i === 0 ? 
                        species.rearlimbs1 + " leg"+(lc > 1? "s":"")+" (in "+species.rearlimbgroups1+" groups)" :  
                        species.rearlimbs2 + " leg"+(lc > 1? "s":"")+" (in "+species.rearlimbgroups2+" groups)"); 
                        break;
                        case "L": species.rearlimbsdesc += lc  + " leg"+(lc > 1? "s":""); break;
                        case "F": species.rearlimbsdesc += lc  + " flipper"+(lc > 1? "s":""); break;
                        case "N": break;
                }
                if(i == 0 && species.rearlimbs[1] !== "N"){
                    species.rearlimbsdesc += " and ";
                }
            }
        }
        species.bodystructure = species.head + "-" + species.torso + "-" + species.frontlimbs + "-" + species.rearlimbs + "-" + species.tail;
    }
    function getSpecialAbility(){
        var roll1 = d6();
        var roll2 = d6(2)-2;
        var abilities = [
            ["Actor","Actor","Dancer","Artist","--","--","--","Music","Artist","Osmance","Osmance"],
            ["Insight","Empath","Hibernate","Hypno","--","--","--","Intuition","Rage","Morph","Curiosity"],
            ["Math","Math","Memorize","SoundMimic","--","--","--","Mem","Mem","Mem","Mem"],
            ["Touch","Touch","Vision","Vision","Hearing","--","--","--","Awareness","Perception","Smell","Smell"],
            ["--","Stench","Blind","Deaf","--","--","--","Unaware","Oblivious","Anosmic","Anosmic"],
            ["Table C2","Biologics","Mechanics","Mechanics","--","--","--","Craftsman","Craftsman","Electronics","Table C2"]
        ];
        var ability = abilities[roll1-1][roll2];
        if(ability === "Table C2"){
            roll1 = d6()-1;
            roll2 = d6()-1;
            roll3 = d6();
            while(roll3 > 2){ roll3 = d6();}
            roll3-=1;
            var tablec2 = [
                [
                    ["Biologics","Actor"],
                    ["Craftsman","Artist"],
                    ["Electronics","Author"],
                    ["Fluidics","Chef"],
                    ["Gravitics","Dancer"],
                    ["Magnetics","Musician"]
    
                ],
                [
                    ["Mechanic","Fighter"],
                    ["Photonics","Forward Obs"],
                    ["Polymers","Heavy Wpns"],
                    ["Programmer","Navigator"],
                    ["Craftsman","Recon"],
                    ["Athlete","Sapper"]
                ],
                [
                    ["Archeology","Medic"],
                    ["Biology","Counsellor"],
                    ["Chemistry","Advocate"],
                    ["History","Leader"],
                    ["Linguistics","Liaison"],
                    ["Philosphy","Diplomat"]
                ],
                [
                    ["Pysics","Broker"],
                    ["Planetology","Trader"],
                    ["Psychohistory","Teacher"],
                    ["Psionicology","Survey"],
                    ["Psychology","Survival"],
                    ["Sophontology","Designer"]
                ],
                [
                    ["Automotive","Driver"],
                    ["Aquanautic","Seafarer"],
                    ["Aeronautic","Flyer"],
                    ["Animals","Rider"],
                    ["Animals","Teamster"],
                    ["Animals","Trainer"]
                ],
                [
                    ["Biologics","Mechanic"],
                    ["Craftsman","Photonics"],
                    ["Electronics","Polymers"],
                    ["Fluidics","Programmer"],
                    ["Gravitics","Crafstman"],
                    ["Magnetics","Athlete"]
                ]
            ];
            ability = tablec2[roll1][roll2][roll3];
        }
        return ability;
    }
    function setSpecialAbilities(){
        species.genderabilities = ["--"];        
        if(species.genders.length > 1){
            var determinant = d6();
            species.genderabilities = [];
            for(var i = 0, len = species.genders.length; i < len; i++){
                
                switch(determinant){
                    case  1:
                        var ability = getSpecialAbility();
                        while (
                            (ability === "Music" && species.hearing === "Deaf" && species.percep === "Oblivious") ||
                            (ability === "Osmance" && species.smell === "Anosmic") ||
                            (ability === "SoundMimic" && species.hearing === "Deaf") ||
                            (ability === "Mem" && species.vision === "Blind" && species.hearing === "Deaf" && species.smell === "Anosmic" && species.aware === "Unaware" && species.percep === "Oblivious")
                        ){
                            ability = getSpecialAbility();                           
                        }
                        if(ability === "Mem"){
                            var reroll = true;
                            while(reroll){
                                var senseRoll = d6();
                                switch(senseRoll){
                                    case 1: 
                                        if(species.vision !== "Blind"){
                                            ability = "MemVision";
                                            reroll = false;
                                        }
                                        break;
                                    case 2:
                                        if(species.hearing !== "Deaf"){
                                            ability = "MemSound";
                                            reroll = false;
                                        }
                                        break;
                                    case 3:
                                        if(species.smell !== "Anosmic"){
                                            ability = "MemScent";
                                            reroll = false;
                                        }
                                        break;
                                    case 4: reroll = true; break;
                                    case 5: 
                                        if(species.aware !== "Unaware"){
                                            ability = "MemAware";
                                            reroll = false;
                                        }
                                        break;
                                    case 6:
                                        if(species.percep !== "Oblivious"){
                                            ability = "MemPercept";
                                            reroll = false;
                                        }
                                        break;
                                }
                            }
                            
                        }
                        // no effect if disability for a sense species does not have
                        if((ability === "Deaf" && species.hearing === "Deaf") || 
                        (ability === "Oblivious" && species.percep === "Oblivious") ||
                        (ability === "Anosmic" && species.smell === "Anosmic") ||
                        (ability === "Blind" && species.vision === "Blind") ||
                        (ability === "Unaware" && species.aware === "Unaware")){
                            ability = "--";
                        }
                        species.genderabilities.push(getNewSenseString(ability));
                        break;
                    case 2:
                        species.genderabilities.push("Roll");
                        break;
                    case 3:
                    case 4:
                        species.genderabilities.push("--");
                        break;
                    case 5:
                        species.genderabilities.push("Roll twice"); 
                        break;
                    case 6:
                        var ability = getSpecialAbility();
                        while (
                            (ability === "Music" && species.hearing === "Deaf" && species.percep === "Oblivious") ||
                            (ability === "Osmance" && species.smell === "Anosmic") ||
                            (ability === "SoundMimic" && species.hearing === "Deaf") ||
                            (ability === "Mem" && species.vision === "Blind" && species.hearing === "Deaf" && species.smell === "Anosmic" && species.aware === "Unaware" && species.percep === "Oblivious")
                        ){
                            ability = getSpecialAbility();    
                            
                        }
                        if(ability === "Mem"){
                            var reroll = true;
                            while(reroll){
                                var senseRoll = d6();
                                switch(senseRoll){
                                    case 1: 
                                        if(species.vision !== "Blind"){
                                            ability = "MemVision";
                                            reroll = false;
                                        }
                                        break;
                                    case 2:
                                        if(species.hearing !== "Deaf"){
                                            ability = "MemSound";
                                            reroll = false;
                                        }
                                        break;
                                    case 3:
                                        if(species.smell !== "Anosmic"){
                                            ability = "MemScent";
                                            reroll = false;
                                        }
                                        break;
                                    case 4: reroll = true; break;
                                    case 5: 
                                        if(species.aware !== "Unaware"){
                                            ability = "MemAware";
                                            reroll = false;
                                        }
                                        break;
                                    case 6:
                                        if(species.percep !== "Oblivious"){
                                            ability = "MemPercept";
                                            reroll = false;
                                        }
                                        break;
                                }
                            }
                            
                        }
                         // no effect if disability for a sense species does not have
                        if((ability === "Deaf" && species.hearing === "Deaf") || 
                            (ability === "Oblivious" && species.percep === "Oblivious") ||
                            (ability === "Anosmic" && species.smell === "Anosmic") ||
                            (ability === "Blind" && species.vision === "Blind") ||
                            (ability === "Unaware" && species.aware === "Unaware")){
                                ability = "--";
                        }
                        var ability2 = getSpecialAbility();
                        while (
                            (ability2 === "Music" && (species.hearing === "Deaf" && ability !== "Hearing") && (species.percep === "Oblivious" && ability !== "Perception") ) ||
                            (ability2 === "Osmance" && (species.smell === "Anosmic" && ability !== "Smell")) ||
                            (ability2 === "SoundMimic" && (species.hearing === "Deaf" && ability !== "Hearing")) ||
                            (ability2 === "Mem" && species.vision === "Blind" && species.hearing === "Deaf" && species.smell === "Anosmic" && species.aware === "Unaware" && species.percep === "Oblivious" && ability !== "Vision" && ability !== "Hearing" && ability !== "Awareness" && ability !== "Perception")
                        ){
                            ability2 = getSpecialAbility();
                        }
                        // no effect if disability for a sense species does not have
                        if((ability2 === "Deaf" && species.hearing === "Deaf" ) || 
                        (ability2 === "Oblivious" && species.percep === "Oblivious") ||
                        (ability2 === "Anosmic" && species.smell === "Anosmic") ||
                        (ability2 === "Blind" && species.vision === "Blind") ||
                        (ability2 === "Unaware" && species.aware === "Unaware")){
                            ability2 = "--";
                        }
                        if(ability2 === "Mem"){
                            var reroll = true;
                            while(reroll){
                                var senseRoll = d6();
                                switch(senseRoll){
                                    case 1: 
                                        if(ability === "Vision" || (species.vision !== "Blind" && ability !== "Blind")){
                                            ability2 = "MemVision";
                                            reroll = false;
                                        }
                                        break;
                                    case 2:
                                        if(ability === "Hearing" || (species.hearing !== "Deaf" && ability !== "Deaf")){
                                            ability2 = "MemSound";
                                            reroll = false;
                                        }
                                        break;
                                    case 3:
                                        if(ability === "Smell" || (species.smell !== "Anosmic" && ability !== "Anosmic")){
                                            ability2 = "MemScent";
                                            reroll = false;
                                        }
                                        break;
                                    case 4: reroll = true; break;
                                    case 5: 
                                        if(ability === "Awareness" || (species.aware !== "Unaware" && ability !== "Unaware")){
                                            ability2 = "MemAware";
                                            reroll = false;
                                        }
                                        break;
                                    case 6:
                                        if(ability === "Perception" || (species.percep !== "Oblivious" && ability !== "Oblivious")){
                                            ability2 = "MemPercept";
                                            reroll = false;
                                        }
                                        break;
                                }
                                if(
                                    (species.vision === "Blind" || ability === "Blind") &&
                                    (species.hearing === "Deaf" || ability === "Deaf") &&
                                    (species.smell === "Anosmic" || ability === "Anosmic") &&
                                    (species.aware === "Unaware" || ability === "Unaware") &&
                                    (species.percep === "Oblivious" || ability === "Oblivious")
                                ){
                                    ability2 = "MemTouch";
                                    reroll = false;
                                }
                            }
                            if(ability === ability2){ ability2 = "--"; }
                        }
                        if(ability === "--" && ability2 === "--"){
                            species.genderabilities.push("--");
                        }else if(ability === "--"){
                            species.genderabilities.push(getNewSenseString(ability2));
                        }else if(ability2 === "--"){
                            species.genderabilities.push(getNewSenseString(ability));
                        }else if(ability === ability2 && ability === "Touch" || ability === "Vision" || ability === "Hearing" || ability === "Awareness" || ability === "Perception" || ability === "Smell"){
                            ability = getDoubleEnhancedSenseString(ability);
                            species.genderabilities.push(ability);
                        }else if(
                            (ability === "Vision" && ability2 === "Blind" || ability2 === "Vision" && ability === "Blind") ||
                            (ability === "Hearing" && ability2 === "Deaf" || ability2 === "Hearing" && ability === "Deaf") ||
                            (ability === "Awareness" && ability2 === "Unaware" || ability2 === "Awareness" && ability === "Unaware") ||
                            (ability === "Perception" && ability2 === "Oblivious" || ability2 === "Perception" && ability === "Oblivious") ||
                            (ability === "Smell" && ability2 === "Anosmic" || ability2 === "Smell" && ability === "Anosmic")
                        ){
                            species.genderabilities.push("--");
                        }else{
                            var temp = "";
                            for(var inc = 0, arr = [ability,ability2]; inc < 2; inc++){
                                var ab = arr[inc];
                                temp += getNewSenseString(ab);
                                if(inc === 0){
                                    temp += (" and ");
                                }
                            }
                            species.genderabilities.push(temp);
                        }
                }

            }
        }
        species.casteabilities = ["--"];
        if(species.castes.length > 1){
            var determinant = d6();
            species.casteabilities = [];
            for(var i = 0, len = species.castes.length; i < len; i++){
                var genderIndex = species.genders.indexOf(species.castes[i]);
                if(genderIndex >= 0){
                    species.casteabilities.push(species.genderabilities[genderIndex]);
                }else{
                    
                    switch(determinant){
                        case  1:
                            var ability = getSpecialAbility();
                            while (
                                (ability === "Music" && species.hearing === "Deaf" && species.percep === "Oblivious") ||
                                (ability === "Osmance" && species.smell === "Anosmic") ||
                                (ability === "SoundMimic" && species.hearing === "Deaf") ||
                                (ability === "Mem" && species.vision === "Blind" && species.hearing === "Deaf" && species.smell === "Anosmic" && species.aware === "Unaware" && species.percep === "Oblivious")
                            ){
                                ability = getSpecialAbility();
                            }
                            if(ability === "Mem"){
                                var reroll = true;
                                while(reroll){
                                    var senseRoll = d6();
                                    switch(senseRoll){
                                        case 1: 
                                            if(species.vision !== "Blind"){
                                                ability = "MemVision";
                                                reroll = false;
                                            }
                                            break;
                                        case 2:
                                            if(species.hearing !== "Deaf"){
                                                ability = "MemSound";
                                                reroll = false;
                                            }
                                            break;
                                        case 3:
                                            if(species.smell !== "Anosmic"){
                                                ability = "MemScent";
                                                reroll = false;
                                            }
                                            break;
                                        case 4: reroll = true; break;
                                        case 5: 
                                            if(species.aware !== "Unaware"){
                                                ability = "MemAware";
                                                reroll = false;
                                            }
                                            break;
                                        case 6:
                                            if(species.percep !== "Oblivious"){
                                                ability = "MemPercept";
                                                reroll = false;
                                            }
                                            break;
                                    }
                                }
                                
                            }
                            // no effect if disability for a sense species does not have
                            if((ability === "Deaf" && species.hearing === "Deaf") || 
                            (ability === "Oblivious" && species.percep === "Oblivious") ||
                            (ability === "Anosmic" && species.smell === "Anosmic") ||
                            (ability === "Blind" && species.vision === "Blind") ||
                            (ability === "Unaware" && species.aware === "Unaware")){
                                ability = "--";
                            }
                            species.casteabilities.push(getNewSenseString(ability));
                            
                            break;
                        case 2:
                            species.casteabilities.push("Roll");
                            break;
                        case 3:
                        case 4:
                            species.casteabilities.push("--");
                            break;
                        case 5:
                            species.casteabilities.push("Roll twice"); 
                            break;
                        case 6:
                            var ability = getSpecialAbility();
                            while (
                                (ability === "Music" && species.hearing === "Deaf" && species.percep === "Oblivious") ||
                                (ability === "Osmance" && species.smell === "Anosmic") ||
                                (ability === "SoundMimic" && species.hearing === "Deaf") ||
                                (ability === "Mem" && species.vision === "Blind" && species.hearing === "Deaf" && species.smell === "Anosmic" && species.aware === "Unaware" && species.percep === "Oblivious")
                            ){
                                ability = getSpecialAbility();
                            }
                            if(ability === "Mem"){
                                var reroll = true;
                                while(reroll){
                                    var senseRoll = d6();
                                    switch(senseRoll){
                                        case 1: 
                                            if(species.vision !== "Blind"){
                                                ability = "MemVision";
                                                reroll = false;
                                            }
                                            break;
                                        case 2:
                                            if(species.hearing !== "Deaf"){
                                                ability = "MemSound";
                                                reroll = false;
                                            }
                                            break;
                                        case 3:
                                            if(species.smell !== "Anosmic"){
                                                ability = "MemScent";
                                                reroll = false;
                                            }
                                            break;
                                        case 4: reroll = true; break;
                                        case 5: 
                                            if(species.aware !== "Unaware"){
                                                ability = "MemAware";
                                                reroll = false;
                                            }
                                            break;
                                        case 6:
                                            if(species.percep !== "Oblivious"){
                                                ability = "MemPercept";
                                                reroll = false;
                                            }
                                            break;
                                    }
                                }
                                
                            }
                            // no effect if disability for a sense species does not have
                            if((ability === "Deaf" && species.hearing === "Deaf") || 
                            (ability === "Oblivious" && species.percep === "Oblivious") ||
                            (ability === "Anosmic" && species.smell === "Anosmic") ||
                            (ability === "Blind" && species.vision === "Blind") ||
                            (ability === "Unaware" && species.aware === "Unaware")){
                                ability = "--";
                            }
                            var ability2 = getSpecialAbility();
                            while (
                                (ability2 === "Music" && (species.hearing === "Deaf" && ability !== "Hearing") && (species.percep === "Oblivious" && ability !== "Perception") ) ||
                                (ability2 === "Osmance" && (species.smell === "Anosmic" && ability !== "Smell")) ||
                                (ability2 === "SoundMimic" && (species.hearing === "Deaf" && ability !== "Hearing")) ||
                                (ability2 === "Mem" && species.vision === "Blind" && species.hearing === "Deaf" && species.smell === "Anosmic" && species.aware === "Unaware" && species.percep === "Oblivious" && ability !== "Vision" && ability !== "Hearing" && ability !== "Awareness" && ability !== "Perception")
                            ){
                                ability2 = getSpecialAbility();
                            }
                            
                            if(ability2 === "Mem"){
                                var reroll = true;
                                while(reroll){
                                    var senseRoll = d6();
                                    switch(senseRoll){
                                        case 1: 
                                            if(ability === "Vision" || (species.vision !== "Blind" && ability !== "Blind")){
                                                ability2 = "MemVision";
                                                reroll = false;
                                            }
                                            break;
                                        case 2:
                                            if(ability === "Hearing" || (species.hearing !== "Deaf" && ability !== "Deaf")){
                                                ability2 = "MemSound";
                                                reroll = false;
                                            }
                                            break;
                                        case 3:
                                            if(ability === "Smell" || (species.smell !== "Anosmic" && ability !== "Anosmic")){
                                                ability2 = "MemScent";
                                                reroll = false;
                                            }
                                            break;
                                        case 4: reroll = true; break;
                                        case 5: 
                                            if(ability === "Awareness" || (species.aware !== "Unaware" && ability !== "Unaware")){
                                                ability2 = "MemAware";
                                                reroll = false;
                                            }
                                            break;
                                        case 6:
                                            if(ability === "Perception" || (species.percep !== "Oblivious" && ability !== "Oblivious")){
                                                ability2 = "MemPercept";
                                                reroll = false;
                                            }
                                            break;
                                    }
                                    if(
                                        (species.vision === "Blind" || ability === "Blind") &&
                                        (species.hearing === "Deaf" || ability === "Deaf") &&
                                        (species.smell === "Anosmic" || ability === "Anosmic") &&
                                        (species.aware === "Unaware" || ability === "Unaware") &&
                                        (species.percep === "Oblivious" || ability === "Oblivious")
                                    ){
                                        ability2 = "MemTouch";
                                        reroll = false;
                                    }
                                }
                                if(ability == ability2){ ability2 = "--"; }
                            }
  
                            // no effect if disability for a sense species does not have
                            if((ability2 === "Deaf" && species.hearing === "Deaf" ) || 
                            (ability2 === "Oblivious" && species.percep === "Oblivious") ||
                            (ability2 === "Anosmic" && species.smell === "Anosmic") ||
                            (ability2 === "Blind" && species.vision === "Blind") ||
                            (ability2 === "Unaware" && species.aware === "Unaware")){
                                ability2 = "--";
                            }
                            if(ability === "--" && ability2 === "--"){
                                species.casteabilities.push(ability2);
                            }else if(ability === "--"){
                                
                                species.casteabilities.push(getNewSenseString(ability2));
                            }else if(ability2 === "--"){
                                species.casteabilities.push(getNewSenseString(ability));
                            }else if(ability === ability2 && ability === "Touch" || ability === "Vision" || ability === "Hearing" || ability === "Awareness" || ability === "Perception" || ability === "Smell"){
                                species.casteabilities.push(getDoubleEnhancedSenseString(ability));
                            }else if(
                                (ability === "Vision" && ability2 === "Blind" || ability2 === "Vision" && ability === "Blind") ||
                                (ability === "Hearing" && ability2 === "Deaf" || ability2 === "Hearing" && ability === "Deaf") ||
                                (ability === "Awareness" && ability2 === "Unaware" || ability2 === "Awareness" && ability === "Unaware") ||
                                (ability === "Perception" && ability2 === "Oblivious" || ability2 === "Perception" && ability === "Oblivious") ||
                                (ability === "Smell" && ability2 === "Anosmic" || ability2 === "Smell" && ability === "Anosmic")
                            ){
                                species.casteabilities.push("--");
                            }else{
                                var temp = "";
                                for(var inc = 0, arr = [ability,ability2]; inc < 2; inc++){
                                    temp += getNewSenseString(arr[inc]);
                                    if(inc === 0){
                                        temp += (" and ");
                                    }
                                }
                                species.casteabilities.push(temp);
                            }
                    }
                }
            }
        }else if(species.castestructure === "Skilled"){
            species.casteabilities = ["Roll for Skill"];
        }
    }
    function getDoubleEnhancedSenseString(ab){
        if(ab === "Touch" || ab === "Vision" || ab === "Hearing" || ab === "Awareness" || ab === "Perception" || ab === "Smell"){
            switch(ab){
                case "Touch": 
                var constant = parseInt(species.touchconstant,10)+4;
                ab = "T-"+(constant < 10 ? "0"+constant : constant)+"-"+species.touchsensitivity; 
                break;
            case "Vision": 
                if(species.vision === "Blind"){
                    var k = parseInt(getSenseConstant(),10)+2;
                    ab = "V-"+(k < 10 ? "0" + k : k)+"-"+getVisionBands().visionbands; 
                }else{
                    var constant = parseInt(species.visionconstant,10)+4;
                    ab = "V-"+(constant < 10 ? "0"+constant : constant)+"-"+species.visionbands; 
                }
                break;
            case "Hearing": 
                if(species.hearing === "Deaf"){
                    var k = parseInt(getSenseConstant(),10)+2;
                    ab = "H-"+(k < 10 ? "0" + k : k)+"-"+getHearingFreq()+getHearingSpan()+getVoiceFreq()+getVocalRange(); 
                }else{
                    var constant = parseInt(species.hearingconstant,10)+4;
                    ab = "H-"+(constant < 10 ? "0"+constant : constant)+"-"+species.hearingfreq+species.hearingspan+species.voice+species.voicerange;
                }
                break;
            case "Awareness": 
                if(species.aware === "Unaware"){
                    var k = parseInt(getSenseConstant(),10)+2;
                    ab = "A-"+(k < 10 ? "0" + k : k)+"-"+getAwarenessAcuity(); 
                }else{
                    var constant = parseInt(species.awarenessconstant,10)+4;
                    ab = "A-"+(constant < 10 ? "0"+constant : constant)+"-"+species.awarenessacuity;
                }
                break;
            case "Perception": 
                if(species.percep === "Oblivious"){
                    var k = parseInt(getSenseConstant(),10)+2;
                    ab = "P-"+(k < 10 ? "0" + k : k)+"-"+getPerceptionPoice()+getPerceptionPoiceTone(); 
                }else{
                    var constant = parseInt(species.percepconstant,10)+4;
                    ab = "P-"+(constant < 10 ? "0"+constant : constant)+"-"+species.perceptionvoice+species.perceptionvoicetone;
                }
                break;
            case "Smell": 
                if(species.smell === "Anosmic"){
                    var k = parseInt(getSenseConstant(),10)+2;
                    ab = "S-"+(k < 10 ? "0" + k : k)+"-"+getSmellSharpness(); 
                }else{
                    var constant = parseInt(species.smellconstant,10)+4;
                    ab = "S-"+(constant < 10 ? "0"+constant : constant)+"-"+species.smellsharpness;
                }
                break;
            }
        }
        return ab;
    }
    function getNewSenseString(ab){
        if(ab === "Touch" || ab === "Vision" || ab === "Hearing" || ab === "Awareness" || ab === "Perception" || ab === "Smell"){
            switch(ab){
                case "Touch": 
                var constant = parseInt(species.touchconstant,10)+2;
                ab = "T-"+(constant < 10 ? "0"+constant : constant)+"-"+species.touchsensitivity; 
                break;
            case "Vision": 
                if(species.vision === "Blind"){
                    var k = parseInt(getSenseConstant(),10);
                    ab = "V-"+(k < 10 ? "0" + k : k)+"-"+getVisionBands().visionbands; 
                }else{
                    var constant = parseInt(species.visionconstant,10)+2;
                    ab = "V-"+(constant < 10 ? "0"+constant : constant)+"-"+species.visionbands; 
                }
                break;
            case "Hearing": 
                if(species.hearing === "Deaf"){
                    var k = parseInt(getSenseConstant(),10);
                    ab = "H-"+(k < 10 ? "0" + k : k)+"-"+getHearingFreq()+getHearingSpan()+getVoiceFreq()+getVocalRange(); 
                }else{
                    var constant = parseInt(species.hearingconstant,10)+2;
                    ab = "H-"+(constant < 10 ? "0"+constant : constant)+"-"+species.hearingfreq+species.hearingspan+species.voice+species.voicerange;
                }
                break;
            case "Awareness": 
                if(species.aware === "Unaware"){
                    var k = parseInt(getSenseConstant(),10);
                    ab = "A-"+(k < 10 ? "0" + k : k)+"-"+getAwarenessAcuity(); 
                }else{
                    var constant = parseInt(species.awarenessconstant,10)+2;
                    ab = "A-"+(constant < 10 ? "0"+constant : constant)+"-"+species.awarenessacuity;
                }
                break;
            case "Perception": 
                if(species.percep === "Oblivious"){
                    var k = parseInt(getSenseConstant(),10);
                    ab = "P-"+(k < 10 ? "0" + k : k)+"-"+getPerceptionPoice()+getPerceptionPoiceTone(); 
                }else{
                    var constant = parseInt(species.percepconstant,10)+2;
                    ab = "P-"+(constant < 10 ? "0"+constant : constant)+"-"+species.perceptionvoice+species.perceptionvoicetone;
                }
                break;
            case "Smell": 
                if(species.smell === "Anosmic"){
                    var k = parseInt(getSenseConstant(),10);
                    ab = "S-"+(k < 10 ? "0" + k : k)+"-"+getSmellSharpness(); 
                }else{
                    var constant = parseInt(species.smellconstant,10)+2;
                    ab = "S-"+(constant < 10 ? "0"+constant : constant)+"-"+species.smellsharpness;
                }
                break;
            }
        }
        return ab;
    }
    function setSizeAndWeight(){
        var nD = 0, strD = 0;
        // c1
        if(species.c1val === "1D"){ strD = nD += 1;}
        else if(species.c1val === "2D"){ strD = nD += 2;}
        else if(species.c1val === "3D"){ strD = nD += 3;}
        else if(species.c1val === "12+2D"){ strD = nD += 4;}
        else if(species.c1val === "12+3D"){ strD = nD += 5;}
        else if(species.c1val === "12+4D"){ strD = nD += 6;}
        else if(species.c1val === "12+5D"){ strD = nD += 7;}
        else if(species.c1val === "12+6D"){ strD = nD += 8;}
        // c2 
        switch(species.c2){
            case "Dex":
                nD += +(species.c2val[0]);
                break;
            case "Gra":
            case "Agi":
                nD += +(species.c2val[0])/2;
                break;
        }
        // c3
        switch(species.c3){
            case "End":
                nD += +(species.c3val[0]);
                break;
            case "Sta": 
                nD += +(species.c3val[0])*2;
                break;
            case "Vig": 
                nD += +(species.c3val[0])/2;
                break;
        }
        if(nD <= 4){
            species.sizeclass = "Small";
        }else if(nD <= 7){
            species.sizeclass = "Standard ";
        }else if(nD <= 12){
            species.sizeclass = "Oversize";
        }else{
            species.sizeclass = "Titan";
        }
        switch(strD){
            case 1:
            case 2:
            case 3: species.size = nD * 12; break;
            case 4: species.size = nD * 48; break;
            case 5: species.size = nD * 60; break;
            case 6: species.size = nD * 72; break;
            case 7: species.size = nD * 84; break;
            case 8: species.size = nD * 96; break;
        }
        var bfp = 8 + d6() - d6();
        var planetSize = species.homeworld.mainworld.size;
        if(planetSize <= 1){ bfp +=1;}
        if(planetSize <= 4){ bfp +=1; }
        if(planetSize <= 6){ bfp +=1;}
        if(species.sizeclass === "Oversize"){ bfp -= 1;}
        if(species.locomotion === "Amphib"){ bfp += Math.floor(posFlux()/2);}
        if(species.locomotion === "Swim" || species.locomotion === "Diver"){ bfp += posFlux();}
        if(species.locomotion === "Triphib" || species.locomotion === "Flyphib" || (species.locomotion === "Flyer" && species.bodystructure.indexOf("W") >= 0)){ 
            bfp += Math.max(1,Math.floor(d6()/2))+1;
        }else{
            if(planetSize >= 9){ bfp -=1;}
            if(planetSize >= 11){ bfp -=1;}
        }
        if(species.locomotion === "Flyer" && species.bodystructure.indexOf("W") < 0){
            bfp -= 1;
        }
        bfp = Math.max(1,bfp);
        if(bfp <= 2){ species.bfpdesc = "Globular";}
        else if(bfp <= 5){ species.bfpdesc = "Compact"; }
        else if(bfp <= 7){ species.bfpdesc = "Thick"; }
        else if(bfp <= 9){ species.bfpdesc = "Typical"; }
        else if(bfp <= 11){ species.bfpdesc = "Slender"; }
        else if(bfp <= 20){ species.bfpdesc = "Elongated"; }
        else{ species.bfpdesc = "Extremely Thin"; }
        species.bfp = bfp;
        species.height = getHeight(species.size, species.bfp);
    }
    function getHeight(size, bfp){
        if(bfp > 15){ return ">3 m";}else if(bfp < 1){ bfp = 1;}
        var sizes = [36, 48, 60, 72, 84, 96, 108, 120, 132, 144, 156, 180,
        240, 300, 360, 420, 480, 540, 600, 660, 720, 780, 840, 900, 960,1020, 1080, 1140, 1200, 1800];
        var heightsByBFP = [
            [0.3, 0.4, 0.4, 0.4, 0.4, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.6,
             0.6, 0.7, 0.7, 0.7, 0.8, 0.8, 0.8, 0.9, 0.9, 0.9, 0.9, 1.0, 1.0, 1.0, 1.0, 1.0, 1.1, 1.2],
            [0.5, 0.6, 0.6, 0.7, 0.7, 0.7, 0.8, 0.8, 0.8, 0.8, 0.9, 0.9,
             1.0, 1.1, 1.1, 1.2, 1.2, 1.3, 1.3, 1.4, 1.4, 1.5, 1.5, 1.6, 1.6, 1.6, 1.6, 1.7, 1.7, 1.9],
            [0.7, 0.8, 0.8, 0.9, 0.9, 1.0, 1.0, 1.0, 1.1, 1.1, 1.1, 1.2,
             1.3, 1.4, 1.5, 1.6, 1.6, 1.7, 1.8, 1.8, 1.9, 1.9, 2.0, 2.0, 2.1, 2.1, 2.1, 2.2, 2.2, 2.5],
            [0.8, 0.9, 1.0, 1.0, 1.1, 1.2, 1.2, 1.2, 1.3, 1.3, 1.4, 1.4,
             1.6, 1.7, 1.8, 1.9, 2.0, 2.1, 2.1, 2.2, 2.3, 2.3, 2.4, 2.4, 2.5, 2.5, 2.6, 2.6, 2.7, 3.1],
            [1.0, 1.1, 1.1, 1.2, 1.3, 1.3, 1.4, 1.4, 1.5, 1.5, 1.6, 1.7,
             1.8, 2.0, 2.1, 2.2, 2.3, 2.4, 2.5, 2.5, 2.6, 2.7, 2.8, 2.8, 2.9, 2.9, 3.0, 3.1, 3.1, 3.6],
            [1.1, 1.2, 1.3, 1.3, 1.4, 1.4, 1.5, 1.6, 1.7, 1.7, 1.8, 1.9,
             2.1, 2.2, 2.3, 2.5, 2.6, 2.7, 2.8, 2.9, 3.0, 3.0, 3.1, 3.2, 3.3, 3.3, 3.4, 3.4, 3.5, 4.0],
            [1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.7, 1.8, 1.9, 1.9, 2.0, 2.1,
             2.3, 2.4, 2.6, 2.7, 2.9, 3.0, 3.1, 3.2, 3.3, 3.4, 3.5, 3.5, 3.6, 3.7, 3.8, 3.8, 3.9, 4.5],
            [1.3, 1.5, 1.6, 1.7, 1.7, 1.8, 1.9, 2.0, 2.0, 2.1, 2.2, 2.3,
             2.5, 2.7, 2.8, 3.0, 3.1, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.9, 4.0, 4.1, 4.2, 4.3, 4.9],
            [1.4, 1.6, 1.7, 1.8, 1.9, 2.0, 2.1, 2.1, 2.2, 2.3, 2.3, 2.4,
             2.7, 2.9, 3.1, 3.2, 3.4, 3.5, 3.6, 3.8, 3.9, 4.0, 4.1, 4.2, 4.3, 4.4, 4.4, 4.5, 4.6, 5.3],
            [1.5, 1.8, 1.8, 1.9, 2.0, 2.1, 2.2, 2.3, 2.4, 2.4, 25, 2.6,
             2.9, 3.1, 3.3, 3.5, 3.6, 3.8, 3.9, 4.0, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.8, 4.9, 5.6],
            [1.6, 1.8, 1.9, 2.1, 2.2, 2.3, 2.4, 2.4, 2.5, 2.6, 2.7, 2.8,
             3.1, 3.3, 3.5, 3.7, 3.9, 4.0, 4.2, 4.3, 4.4, 4.6, 4.7, 4.8, 4.9, 5.0, 5.1, 5.2, 5.3, 6.0],
            [1.7, 1.9, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.7, 2.8, 3.0,
             3.3, 3.5, 3.7, 3.9, 4.1, 4.3, 4.4, 4.6, 4.7, 4.8, 4.9, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 6.4],
            [1.8, 2.0, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 3.0, 3.1,
             3.4, 3.7, 3.9, 4.1, 4.3, 4.5, 4.7, 4.8, 5.0, 5.1, 5.2, 5.3, 5.5, 5.6, 5.7, 5.8, 5.9, 6.7],
            [1.9, 2.1, 2.3, 2.4, 2.5, 2.7, 2.8, 2.9, 3.0, 3.0, 3.1, 3.3,
             3.6, 3.9, 4.1, 4.4, 4.5, 4.7, 4.9, 5.1, 5.2, 5.3, 5.5, 5.6, 5.7, 5.8, 6.0, 6.1, 6.2, 7.1],
            [2.0, 2.2, 2.4, 2.5, 2.7, 2.8, 2.9, 3.0, 3.1, 3.2, 3.3, 3.4,
             3.8, 4.1, 4.3, 4.6, 4.8, 5.0, 5.1, 5.3, 5.5, 5.6, 5.7, 5.9, 6.0, 6.1, 6.2, 6.4, 6.5, 7.4]
        ];
        var indexOfSize = binSearch(sizes, size);
        if(indexOfSize < 0){
            indexOfSize = ~indexOfSize;
        }
        return heightsByBFP[bfp-1][indexOfSize] + "m"
        
    }
    function setUniqueTraits(){
        if(typeof species.uniqueTraitsCount === "undefined"){
            species.uniqueTraitsCount = Math.max(d6() - d6() - posFlux() - posFlux() - 1, 0);
        }
        if(species.uniqueTraitsCount > 0){
            species.uniqueTraits = [];
            var uniqueTraitHash = {};
           while(species.uniqueTraits.length < species.uniqueTraitsCount){
                var trait = getUniqueTrait();
                if(!uniqueTraitHash[trait.key]){
                    species.uniqueTraits.push(trait);
                    uniqueTraitHash[trait.key] = true;
                }
            }
            species.uniqueTraitDesc = "<ul>"+species.uniqueTraits.reduce(function(prev,trait){
                return prev += "<li><strong>"+trait.name + "</strong>: " + trait.description + "</li>";
            },"")+"</ul>";
        }else{
            species.uniqueTraitDesc = "(N/A)";
        }
        
    }
    function getUniqueTrait(){
        var traits = [
            //{key:"Hibernation", name:"Hibernation", description:"The sophont passes some period of time in a state of total suspended animation. The sophont culture often makes provision for the care and protection of the individual during the hibernation period."},
            [
                [
                    {key:"Symbiont", name:"Symbiont (Dominated Carrier)", description:"It actually consists of two distinct lifeforms, the primary body (the carrier) and the controlling primary mind (the rider), although only the rider is sapient. When attached, the rider sophont is entirely concealed within the carrier."},
                    {key:"Symbiont", name:"Symbiont (Dominated Carrier)", description:"It actually consists of two distinct lifeforms, the primary body (the carrier) and the controlling primary mind (the rider), although the carrier is also sapient. When attached, the rider sophont is entirely concealed within the carrier."},
                    {key:"Symbiont", name:"Symbiont (Dominated Carrier)", description:"It actually consists of two distinct lifeforms, the primary body (the carrier) and the controlling primary mind (the rider), although only the rider is sapient. The rider sophont attaches externally to the carrier."},
                    {key:"Symbiont", name:"Symbiont (Dominated Carrier)", description:"It actually consists of two distinct lifeforms, the primary body (the carrier) and the controlling primary mind (the rider), although the carrier is also sapient. The rider sophont attaches externally to the carrier."}
                ],
                [
                    {key:"Symbiont", name:"Symbiont (Assisted Carrier)", description:"It actually consists of two sophonts, the primary body (the carrier) and an accompanying rider, both with comparable intelligence. When attached, the rider sophont is entirely concealed within the carrier sophont."},
                    {key:"Symbiont", name:"Symbiont (Assisted Carrier)", description:"It actually consists of two sophonts, the primary body (the carrier) and an accompanying rider, both with comparable intelligence. The rider sophont attaches externally to the carrier sophont."}],
                    {key:"Symbiont", name:"Symbiont (Attendees)", description:"It is attended by multiple non-sapient symbionts."},
                    {key:"Symbiont", name:"Willing Host", description:"The sophont's body is inhabited by other lifeforms which are either parasitic or provide it with no discernable advantage."}
            ],
            [
                {key:"Molt", name:"Superficial Molt", description:"The sophont sheds its outer covering in an abrupt process at the end of a Life Stage. When Molt is complete (usually a matter of a day or two) the subject emerges with a fresh outer covering with changed markings and color."},
                [
                    {key:"Molt", name:"Incremental Physical Molt", description:"The sophont sheds its outer covering in an abrupt process at the end of a lifes stage. When Molt is complete (usually a matter of a day or two) the subject emerges with a fresh outer covering and an increase in its "+species.c1+"."},
                    {key:"Molt", name:"Incremental Physical Molt", description:"The sophont sheds its outer covering in an abrupt process at the end of a lifes stage. When Molt is complete (usually a matter of a day or two) the subject emerges with a fresh outer covering and an increase in its "+species.c2+"."},
                    {key:"Molt", name:"Incremental Physical Molt", description:"The sophont sheds its outer covering in an abrupt process at the end of a lifes stage. When Molt is complete (usually a matter of a day or two) the subject emerges with a fresh outer covering and an increase in its "+species.c3+"."},
                    {key:"Molt", name:"Incremental Physical Molt", description:"The sophont sheds its outer covering in an abrupt process at the end of a lifes stage. When Molt is complete (usually a matter of a day or two) the subject emerges with a fresh outer covering and an increase in its "+species.c1+" and "+ species.c2 +"."},
                    {key:"Molt", name:"Incremental Physical Molt", description:"The sophont sheds its outer covering in an abrupt process at the end of a lifes stage. When Molt is complete (usually a matter of a day or two) the subject emerges with a fresh outer covering and an increase in its "+species.c1+" and "+ species.c3 +"."},
                    {key:"Molt", name:"Incremental Physical Molt", description:"The sophont sheds its outer covering in an abrupt process at the end of a lifes stage. When Molt is complete (usually a matter of a day or two) the subject emerges with a fresh outer covering and an increase in its "+species.c2+" and "+ species.c3 +"."}
                ],
                [
                    {key:"Molt", name:"Incremental Molt", description:"The sophont sheds its outer covering in an abrupt process at the end of a lifes stage. When Molt is complete (usually a matter of a day or two) the subject emerges with a fresh outer covering and an increase in its "+species.c4+"."},
                    {key:"Molt", name:"Incremental Molt", description:"The sophont sheds its outer covering in an abrupt process at the end of a lifes stage. When Molt is complete (usually a matter of a day or two) the subject emerges with a fresh outer covering and an increase in its "+species.c1+" and "+ species.c4 +"."},
                    {key:"Molt", name:"Incremental Molt", description:"The sophont sheds its outer covering in an abrupt process at the end of a lifes stage. When Molt is complete (usually a matter of a day or two) the subject emerges with a fresh outer covering and an increase in its "+species.c2+" and "+ species.c4 +"."},
                    {key:"Molt", name:"Incremental Molt", description:"The sophont sheds its outer covering in an abrupt process at the end of a lifes stage. When Molt is complete (usually a matter of a day or two) the subject emerges with a fresh outer covering and an increase in its "+species.c3+" and "+ species.c4 +"."}
                ],
                {key:"Molt", name:"Random Molt", description:"The sophont sheds its outer covering in an abrupt process at the end of a lifes stage. When Molt is complete (usually a matter of a day or two) the subject emerges with a fresh outer covering and a chance for increased or decreased physical and mental attributes."},
                {key:"Molt", name:"Random Physical Molt", description:"The sophont sheds its outer covering in an abrupt process at the end of a lifes stage. When Molt is complete (usually a matter of a day or two) the subject emerges with a fresh outer covering and a chance for increased or decreased physical attributes."}
            ],
            [
                {key:"Metamorph", name:"Simple Metamorphosis", description:"The sophont undergoes a metamorphosis at life stage " +(posFlux()+3)+ ". It has dramatically different first and ultimate forms."},
                {key:"Metamorph", name:"Complex Metamorphosis", description:"The sophont undergoes several stages of metamorphosis, ultimately embodying " + (posFlux()+3) + " completely different forms."},
                {key:"Metamorph", name:"Sessile Senescence", description:"At the start of life stage " + Math.min(posFlux()+6,9) + ", the sophont changes into a sessile (immobile) form."}
            ],
            [
                {key:"Senescence", name:"Early Senescence", description:"The sophont begins both physical and mental aging at life stage 2."},
                {key:"Senescence", name:"Delayed Senescence", description:"The sophont does not experience physical or mental aging until life stage 9."}
            ],
            [
                {key:"Symbiont", name:"Colonial Lifeform", description:"The sophont is composed of many separately born zooids that combine to create a functional lifeform. The functionally and morphologically specialized zooids cannot survive independently."},
                {key:"Symbiont", name:"Loose Colonial Lifeform", description:"The sophont is composed of several separately born zooids that combine to create a functional lifeform. Though functionally and morphologically specialized, the zooids can survive independently."},
                {key:"Symbiont", name:"Loose Detachable Colonial Lifeform", description:"The sophont is composed of several separately born zooids that combine to create a functional lifeform. Some of the zooids are capable of detaching, surviving independently to perform functional tasks, and later reattaching to the primary body."}
            ],
            [
                {key:"Metabolic", name:"Phototrophic", description:"The sophont is able to derive some energy from photosynthesis."},
                {key:"Non-Respiratory", name:"Fermentrophic", description:"The sophont is able survive periods deprived of its native atmosphere in a low energy state, supported by anaerobic metabolic processes."},
                {key:"Metabolic", name:"Radiotrophic", description:"The sophont is able to supplement its metabolic processes using environmental radiation."},
                {key:"Metabolic", name:"Lithotrophic", description:"The sophont ingests inorganic stone and minerals."},
                {key:"Metabolic", name:"Food Stores", description:"The sophont produces a concentrated high-energy treacle which it stores internally. The product can be disgorged to feed itself or others when food is otherwise scarce."},
            ],
            [
                {key:"Lethal Reproduction", name:"Lethal Reproduction", description:"When producing offspring, the parent sophont does not survive."},
                {key:"Parasitic Reproduction", name:"Parasitic Reproduction", description:"The sophont spends its first life stage parasitizing an unrelated host."},
                {key:"Parasitic Reproduction", name:"Brood Parasite", description:"The sophont evolved to rely upon other native species to raise its young as their own."}
            ],
            [
                {key:"Multihead", name:"Multiple brains", description:"The sophont has multiple distinct central nervous systems capable of independent thought."},
                {key:"Multihead", name:"Multiple "+(species.head.indexOf("H")>=0?"heads":"brains"), description:"The sophont has multiple "+(species.head.indexOf("H")>=0?"heads. " : "distinct central nervous systems capable of independent thought.")}
            ],
            [
                {key:"Regenerative", name:"Defensive Regeneration", description:"The sophont can detach parts of its body when threatened; the parts eventually regrow."},
                {key:"Regenerative", name:"Regeneration", description:"The sophont can regrow parts of its body that are severed or destroyed."},
                {key:"Regenerative", name:"Perfect Regeneration", description:"The sophont can regrow any severed limbs or organs. Under proper conditions, a complete body can even regrow from a severed piece of the sophont."}
            ],
            [
                {key:"Chemical Defense", name:"Corrosive Spray", description:"As a biochemical defense, the sophont can spray a corrosive substance when threatened."},
                {key:"Chemical Defense", name:"Flame Emitter", description:"As a biochemical defense, the sophont can emit a flame when threatened."},
                {key:"Chemical Defense", name:"Obscuring Cloud", description:"As a biochemical defense, the sophont can emit a concealing cloud of smoke or ink when threatened."},
                {key:"Chemical Defense", name:"Tranquilizing Toxin", description:"As a biochemical defense, the sophont can exude a non-lethal tranquilizer when threatened."},
                {key:"Chemical Defense", name:"Toxicity", description:"As a biochemical defense, the sophont exudes a harmful poison or allergen."},
                {key:"Inflate", name:"Inflates", description:"The sophont can inflate to many times its size as a defensive reaction."},
                {key:"Color", name:"Color Changing", description:"The sophont is able to change its color to match its surroundings."},
                {key:"Color", name:"Translucent", description:"In its natural environment, under certain conditions, the sophont's body covering and organs are translucent and may appear almost invisible."},
                {key:"Color", name:"Batesian Mimicry",description:"To deter predators, the sophont has evolved to resemble a more dangerous organism from its homeworld."}
            ],
            [
                // normal things from terra 
                {key:"Bioluminescent", name:"Bioluminescent", description:"The sophont emits bioluminescent signals." + (species.vision === "Blind" ? " Although incapable of recognizing the signals itself, they may have originally served to attract prey or confuse predators." : "")},
                {key:"Web", name:"Web Spinner", description:"The sophont is able to produce a natural silken thread from its body."},
                {key:(species.hearing==="Deaf"?"Symbiont":"Echolocation"), description:(species.hearing==="Deaf"?"The sophont relies upon a symbiont to sense vibrations in its surroundings.":"The sophont can visually map its surrounding using sonic vibrations.")}
            ],
            {key:"Non-Respiratory", name:"Non-Respiratory", description:"The sophont does not require fresh air to function."},
            [
                {key:"Life Stage", name:"Feral Life Stage", description:"For the duration of life stage "+Math.min(posFlux()+posFlux()+1,8)+", the sophont is not fully sapient."},
                {key:"Life Stage", name:"Feral End of Life", description:"Starting at life stage "+Math.min(posFlux()+6,9)+", the sophont descends into a non-sapient feral state."}
            ],
            [
                {key:"Ecology", name:"Ecological Lynchpin", description:"The sophont occupies a key position in its homeworld's ecology. Many other life forms depend on it to survive."},
                {key:"Ecology", name:"Evolutionary Co-dependency", description:"The sophont has a physiological dependency on another lifeform from its homeworld."},
                {key:"Ecology", name:"Evolutionary Psychological Dependency", description:"The sophont has a psychological dependency on another lifeform from its homeworld."},

            ]
        ];
        var rand = pickRandom(traits);
        while(rand.length && rand.length > 0){ rand = pickRandom(rand);}
        return rand;
    }
    function setGenderCasteScents(){
        species.genderscents = [];
        species.castescents = [];
        for(var i = 0, len = species.genders.length; i < len; i++){
            species.genderscents.push(getScentDigit()+"--");
        }
        for(var i = 0, len = species.castes.length; i < len; i++){
            var genderIndex = species.genders.indexOf(species.castes[i]);
            var castescent = getScentDigit();
            if(genderIndex >= 0){
                species.castescents.push(species.genderscents[genderIndex].replace("-",castescent));
            }else if(i===0 && species.castes.length === 1){
                species.castescents.push("--");
            }else{
                species.castescents.push("-"+castescent+"-");
            }
    }
    }
    return species;
}
function getCasteSkill(){
    var d6 = function d6(num){
        if(!num){ num = 1;}
        var sum = 0;
        for(var i = 0; i < num; i++){
            sum += ((Math.random()*6) >>> 0) + 1;
        }           
        return sum;
    }
    var ability = "--"
    roll1 = d6()-1;
    roll2 = d6()-1;
    roll3 = d6();
    while(roll3 > 2){ roll3 = d6();}
    roll3-=1;
    var tablec2 = [
        [
            ["Biologics","Actor"],
            ["Craftsman","Artist"],
            ["Electronics","Author"],
            ["Fluidics","Chef"],
            ["Gravitics","Dancer"],
            ["Magnetics","Musician"]

        ],
        [
            ["Mechanic","Fighter"],
            ["Photonics","Forward Obs"],
            ["Polymers","Heavy Wpns"],
            ["Programmer","Navigator"],
            ["Craftsman","Recon"],
            ["Athlete","Sapper"]
        ],
        [
            ["Archeology","Medic"],
            ["Biology","Counsellor"],
            ["Chemistry","Advocate"],
            ["History","Leader"],
            ["Linguistics","Liaison"],
            ["Philosophy","Diplomat"]
        ],
        [
            ["Pysics","Broker"],
            ["Planetology","Trader"],
            ["Psychohistory","Teacher"],
            ["Psionicology","Survey"],
            ["Psychology","Survival"],
            ["Sophontology","Designer"]
        ],
        [
            ["Automotive","Driver"],
            ["Aquanautic","Seafarer"],
            ["Aeronautic","Flyer"],
            ["Animals","Rider"],
            ["Animals","Teamster"],
            ["Animals","Trainer"]
        ],
        [
            ["Biologics","Mechanic"],
            ["Craftsman","Photonics"],
            ["Electronics","Polymers"],
            ["Fluidics","Programmer"],
            ["Gravitics","Crafstman"],
            ["Magnetics","Athlete"]
        ]
    ];
    ability = tablec2[roll1][roll2][roll3];
    return ability;
}
function getRandomSpecialAbility(){
    var d6 = function d6(num){
        if(!num){ num = 1;}
        var sum = 0;
        for(var i = 0; i < num; i++){
            sum += ((Math.random()*6) >>> 0) + 1;
        }           
        return sum;
    }
    var roll1 = d6();
    var roll2 = d6(2)-2;
    var abilities = [
        ["Actor","Actor","Dancer","Artist","--","--","--","Music","Artist","Osmance","Osmance"],
        ["Insight","Empath","Hibernate","Hypno","--","--","--","Intuition","Rage","ReGen","Curiosity"],
        ["Math","Math","Memorize","SoundMimic","--","--","--","Mem","Mem","Mem","Morph"],
        ["Touch","Touch","Vision","Vision","Hearing","--","--","--","Awareness","Perception","Smell","Smell"],
        ["--","Stench","Blind","Deaf","--","--","--","Unaware","Oblivious","Anosmic","Anosmic"],
        ["Table C2","Biologics","Mechanics","Mechanics","--","--","--","Craftsman","Craftsman","Electronics","Table C2"]
    ];
    var ability = abilities[roll1-1][roll2];
    if(ability === "Table C2"){
        roll1 = d6()-1;
        roll2 = d6()-1;
        roll3 = d6();
        while(roll3 > 2){ roll3 = d6();}
        roll3-=1;
        var tablec2 = [
            [
                ["Biologics","Actor"],
                ["Craftsman","Artist"],
                ["Electronics","Author"],
                ["Fluidics","Chef"],
                ["Gravitics","Dancer"],
                ["Magnetics","Musician"]

            ],
            [
                ["Mechanic","Fighter"],
                ["Photonics","Forward Obs"],
                ["Polymers","Heavy Wpns"],
                ["Programmer","Navigator"],
                ["Craftsman","Recon"],
                ["Athlete","Sapper"]
            ],
            [
                ["Archeology","Medic"],
                ["Biology","Counsellor"],
                ["Chemistry","Advocate"],
                ["History","Leader"],
                ["Linguistics","Liaison"],
                ["Philosophy","Diplomat"]
            ],
            [
                ["Pysics","Broker"],
                ["Planetology","Trader"],
                ["Psychohistory","Teacher"],
                ["Psionicology","Survey"],
                ["Psychology","Survival"],
                ["Sophontology","Designer"]
            ],
            [
                ["Automotive","Driver"],
                ["Aquanautic","Seafarer"],
                ["Aeronautic","Flyer"],
                ["Animals","Rider"],
                ["Animals","Teamster"],
                ["Animals","Trainer"]
            ],
            [
                ["Biologics","Mechanic"],
                ["Craftsman","Photonics"],
                ["Electronics","Polymers"],
                ["Fluidics","Programmer"],
                ["Gravitics","Crafstman"],
                ["Magnetics","Athlete"]
            ]
        ];
        ability = tablec2[roll1][roll2][roll3];
        
    }
    if(ability === "Mem"){
        var roll = d6();
        while(d6 === 4){ roll = d6();}
        switch(roll){
            case 1: ability = "MemVision"; break;
            case 2: ability = "MemAudio"; break;
            case 3: ability = "MemScent"; break;
            case 5: ability = "MemAware"; break;
            case 6: ability = "MemPercept"; break;
        }
            
    }
    if(ability === "--"){ ability = "(No Special Ability)";}
    return ability;
}

