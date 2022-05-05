function generateRandomAlien(species,rand){
    
    // species.name, species.homeworld.mainworld
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
        var digits = 
        [
            ["1","2","3","4","5","6"],
            ["A","B","C","D","E","F"],
            ["G","H","I","J","K","L"],
            ["M","N","O","P","Q","R"],
            ["S","T","U","V","W","X"],
            ["Y","Z","7","8","9","0"]
        ];
        species.scent = pickRandom(pickRandom(digits))
            + pickRandom(pickRandom(digits))
            + pickRandom(pickRandom(digits));
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
        switch(species.locomotion){
            case "Walker":
                species.breathes = "Atmo " + species.homeworld.mainworld.atmo;
                break;
            case "Amphib":
                species.breathes = "Atmo " + species.homeworld.mainworld.atmo + " + " + (species.homeworld.mainworld.atmo >= 10 && species.homeworld.mainworld.atmo <= 12 ? "Exotic Liquid" : "Water");
                break;
            case "Flyer":
                species.breathes = "Atmo " + species.homeworld.mainworld.atmo;
                break;
            case "Flyphib":
                species.breathes = "Atmo " + species.homeworld.mainworld.atmo + " + " + (species.homeworld.mainworld.atmo >= 10 && species.homeworld.mainworld.atmo <= 12 ? "Exotic Liquid" : "Water");
                break;
            case "Swim":
                species.breathes = "Atmo " + species.homeworld.mainworld.atmo;
                break;
            case "Aquatic":
                species.breathes = "Atmo " + species.homeworld.mainworld.atmo;
                break;
            case "Diver":
                species.breathes = species.homeworld.mainworld.atmo >= 10 && species.homeworld.mainworld.atmo <= 12 ? "Exotic Liquid" : "Water";
                break;
            case "Triphib":
                species.breathes = "Atmo " + species.homeworld.mainworld.atmo;
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
        var roll = d6() - d6();
        if(roll <= -4){
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
        }else if(roll <= -2){
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
        }else if(roll <= 1){
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
        }else if(roll <= 3){
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
        }else{
            species.genderstructure = "Group";
            species.genders = [];
            for(var i = 0; i < 6; i++){
                //var gender = addCaps(generator.getRandomName("word.1or2sylword"), species.genders);
                var gender = "Gender " + i;
                species.genders.push(gender);
            }
            species.gender2 = species.genders[0];
            species.gender3 = pickRandom(species.genders);
            species.gender4 = pickRandom(species.genders);
            species.gender5 = pickRandom(species.genders);
            species.gender6 = pickRandom(species.genders);
            species.gender7 = species.genders[1];
            species.gender8 = pickRandom(species.genders);
            species.gender9 = pickRandom(species.genders);
            species.gender10 = pickRandom(species.genders);
            species.gender11 = pickRandom(species.genders);
            species.gender12 = species.genders[2];
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
        }
        species.genderc1s = ["--"];
        species.genderc2s = ["--"];
        species.genderc3s = ["--"];
        species.genderc4s = ["--"];
        species.genderc5s = ["--"];
        species.genderc6s = ["--"];
        for(var i = 1, len = species.genders.length; i < len; i++){
            species.genderc6s.push("--");
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
        roll = d6() - d6();
        if(roll <= -5){
            species.genderassignment = "assigned by family";
            species.gendershift = "progresses along gender table at each life stage";
        }else if(roll <= -4){
            species.genderassignment = "initially assigned at life stage 2";
            species.gendershift = "progresses along gender table at each life stage";
        }else if(roll <= -3){
            species.genderassignment = "neuter until life stage 2";
            species.gendershift = "fixed";
        }else if(roll <= 2){
            species.genderassignment = "assigned at birth";
            species.gendershift = "fixed";
        }else if(roll <= 3){
            species.genderassignment = "neuter until life stage 2";
            species.gendershift = "fixed";
        }else if(roll <= 4){
            species.genderassignment = "neuter until life stage 2";
            species.gendershift = "transforms at life stage 6";
        }else{
            species.genderassignment = "Assigned by individual";
            species.gendershift = "transforms at life stage 6";
        }
    }
    function setStats(){
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
        var locMod = 0;
        if(species.locomotion === "Flyer"){ locMod = -2;}
        else if(species.locomotion === "Swim" || species.locomotion === "Diver"){
            locMod = +2;
        }
        roll = d6() - d6() + locMod;
        if(roll <= -2){
            species.c2 = "Agi";
        }else if(roll <= 1){
            species.c2 = "Dex";
        }else{
            species.c2 = "Gra";
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
        }else if(roll <= 1){
            species.c3 = "End";
        }else{
            species.c3 = "Vig";
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
        }else if(roll <= 1){
            species.c5 = "Edu";
        }else{
            species.c5 = "Tra";
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
        }else if(roll <= 1){
            species.c6 = "Soc";
        }else{
            species.c6 = "Cha";
        }
    }
    function setCaste(){
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
                case 6: species.castestructure = "Skilled";  species.castes = ["baseline"]; break;
            }
            if(!(species.castestructure === "Skilled")){
                for(var i = 1, len = species.castes.length; i < len; i++){
                    var genderIndex = species.genders.indexOf(species.castes[i]);
                    if(genderIndex >= 0){
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
                case 1: species.casteassignment = "assigned at birth"; break;
                case 2: species.casteassignment = "assigned at life stage 2"; break;
                case 3: species.casteassignment = "assigned by heredity"; break;
                case 4: species.casteassignment = "assigned by community"; break;
                case 5: species.casteassignment = "assigned by family choice"; break;
                case 6: species.casteassignment = "assigned by personal choice"; break;
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
        }
        if(species.genders.length > 1 && species.castes.length > 1){
            roll = d6();
            switch(roll){
                case 1: 
                case 2: species.castegenderrelation = "dependent"; break;
                case 3: 
                case 4: species.castegenderrelation = "casted breeder"; break;
                case 5: 
                case 6: species.castegenderrelation = "independent"; break;
            }
        }else{
            species.castegenderrelation = "independent";
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
    function setSenses(){
        var roll = d6() - d6();
        if(roll <= -3){
            species.vision = "Blind";
        }else{
            species.visionconstant = getSenseConstant()
            var startype = species.homeworld.stars.primary.type;
            var stardecimal = species.homeworld.stars.primary.decimal;
            if(startype === "B"){
                if(typeof stardecimal == "undefined" || stardecimal <= 3){
                    species.visionbands = "DHV";
                }else if(stardecimal <= 8){
                    species.visionbands = "UDH";
                }else{
                    species.visionbands = "SUD";
                }
            }else if(startype === "A" ){
                if(typeof stardecimal == "undefined" || stardecimal <= 1){
                    species.visionbands = "SUD";
                }else if(stardecimal <= 8){
                    species.visionbands = "PSU";
                }else{
                    species.visionbands = "BPS";
                }
            }else if(startype === "F"){
                if(typeof stardecimal == "undefined" || stardecimal <= 6){
                    species.visionbands = "BPS";
                }else{
                    species.visionbands = "GBP";
                }
            }else if(startype === "G"){
                if(typeof stardecimal == "undefined" || stardecimal <= 1){
                    species.visionbands = "GBP";
                }else{
                    species.visionbands = "RGB";
                }
            }else if(startype === "K"){
                if(typeof stardecimal == "undefined" || stardecimal <= 0){
                    species.visionbands = "RGB";
                }else if( stardecimal <= 3){
                    species.visionbands = "CRG";
                }else if(stardecimal <= 6){
                    species.visionbands = "ACR";
                }else{
                    species.visionbands = "NAC";
                }
            }else if(startype === "M"){
                if(typeof stardecimal == "undefined" || stardecimal <= 1){
                    species.visionbands = "INA";
                }else if(stardecimal <= 4){
                    species.visionbands = "FIN";
                }else{
                    species.visionbands = "XFI";
                }
            }else if(startype === "L" || startype === "BD"){
                if(typeof stardecimal == "undefined" || stardecimal <= 8){
                    species.visionbands = "XFI";
                }else{
                    species.visionbands = "ZXF";
                }
            }
            species.vision = "V-"+species.visionconstant+"-"+species.visionbands; 
        }
        roll = d6() - d6();
        if(roll <= -2){
            species.hearing = "Deaf";
        }else{
            species.hearingconstant = getSenseConstant();
            var freq = d6() - d6();
            switch(freq){
                case -5: species.hearingfreq = "1"; break;
                case -4: species.hearingfreq = "2"; break;
                case -3: species.hearingfreq = "3"; break;
                case -2: species.hearingfreq = "4"; break;
                case -1: species.hearingfreq = "5"; break;
                case 0: species.hearingfreq = "6"; break;
                case 1: species.hearingfreq = "7"; break;
                case 2: species.hearingfreq = "8"; break;
                case 3: species.hearingfreq = "9"; break;
                case 4: species.hearingfreq = "A"; break;
                case 5: species.hearingfreq = "B"; break;
            }
            var span = d6() - d6();
            switch(span){
                case -5: species.hearingspan = "0"; break;
                case -4:
                case -3: species.hearingspan = "1"; break;
                case -2:
                case -1: species.hearingspan = "2"; break;
                case 0: species.hearingspan = "3"; break;
                case 1:
                case 2: species.hearingspan = "4"; break;
                case 3:
                case 4: species.hearingspan = "5"; break;
                case 5: species.hearingspan = "6"; break;
            }
            var voice = d6() - d6();
            switch(voice){
                case -5: species.voice = "1"; break;
                case -4: species.voice = "2"; break;
                case -3: species.voice = "3"; break;
                case -2: species.voice = "4"; break;
                case -1: species.voice = "5"; break;
                case 0: species.voice = "6"; break;
                case 1: species.voice = "7"; break;
                case 2: species.voice = "8"; break;
                case 3: species.voice = "9"; break;
                case 4: species.voice = "A"; break;
                case 5: species.voice = "B"; break;
            }
            var range = d6() - d6();
            switch(range){
                case -5: 
                case -4:
                case -3:
                case -2: species.voicerange = "0"; break;
                case -1: species.voicerange = "1"; break;
                case 0: species.voicerange = "2"; break;
                case 1:
                case 2:
                case 3: species.voicerange = "3"; break;
                case 4:
                case 5: species.voicerange = "4"; break;
            }
            species.hearing = "H-"+species.hearingconstant + "-" 
                + species.hearingfreq + species.hearingspan 
                + species.voice + species.voicerange;
        }
        roll = d6() - d6();
        if(roll <= -1){
            species.smell = "Anosmic";
        }else{
            species.smellconstant = getSenseConstant();
            var sharpness = d6() - d6();
            switch(sharpness){
                case -5: 
                case -4:
                case -3:
                case -2: species.smellsharpness = "1"; break;
                case -1: species.smellsharpness = "2"; break;
                case 0: species.smellsharpness = "3"; break;
                case 1: species.smellsharpness = "4"; break;
                case 2:
                case 3: species.smellsharpness = "5"; break;
                case 4:
                case 5: species.smellsharpness = "6"; break;

            }
            species.smell = "S-"+species.smellconstant+"-"+species.smellsharpness; 
        }
        species.touchconstant = getSenseConstant();
        var sensitivity = d6() - d6();
        switch(sensitivity){
            case -5: 
            case -4: species.touchsensitivity = "1"; break;
            case -3:
            case -2: species.touchsensitivity = "2"; break;
            case -1: 
            case 0: 
            case 1: species.touchsensitivity = "3"; break;
            case 2: 
            case 3: species.touchsensitivity = "4"; break;
            case 4: 
            case 5: species.touchsensitivity = "5"; break;
        }
        species.touch = "T-"+species.touchconstant+"-"+species.touchsensitivity;
    
        roll = d6() - d6();
        if(roll <= 0){
            species.aware = "Unaware";
        }else{
            species.awarenessconstant = getSenseConstant();
            var acuity = d6() - d6();
            switch(acuity){
                case -5:
                case -4: species.awarenessacuity = "1"; break;
                case -3:
                case -2: species.awarenessacuity = "2"; break;
                case -1:
                case 0:
                case 1: species.awarenessacuity = "3"; break;
                case 2:
                case 3: species.awarenessacuity = "4"; break;
                case 4:
                case 5: species.awarenessacuity = "5"; break;
            }
            species.aware = "A-"+species.awarenessconstant+"-"+species.awarenessacuity;
        }
    
        roll = d6() - d6();
        if(roll <= 1){
            species.percep = "Oblivious";
        }else{
            species.percepconstant = getSenseConstant();
            var poice = d6() - d6();
            switch(poice){
                case -5:
                case -4: species.poice = "1"; break;
                case -3:
                case -2: species.poice = "2"; break;
                case -1:
                case 0:
                case 1: species.poice = "3"; break;
                case 2:
                case 3: species.poice = "4"; break;
                case 4:
                case 5: species.poice = "5"; break;
            }
            var tone = d6() - d6();
            
            switch(tone){
                case -5:
                case -4: species.poicetone = "1"; break;
                case -3:
                case -2: species.poicetone = "2"; break;
                case -1:
                case 0:
                case 1: species.poicetone = "3"; break;
                case 2:
                case 3: species.poicetone = "4"; break;
                case 4:
                case 5: species.poicetone = "5"; break;
            }
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
        }
    }
    function setLanguageMedium(){
        if(species.hearing !== "Deaf"){             
            var voiceIsInHearingRange = false;
            for(var i = +(species.voicerange) * -1; i <= +(species.voicerange); i++){
                var voiceFreq = +(species.voice) + i;
                if(voiceFreq >= +(species.hearingfreq) - +(species.hearingspan) && voiceFreq <= +(species.hearingfreq) + +(species.hearingspan)){
                    voiceIsInHearingRange = true;
                    break;
                }
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
                species.language = "Verbal Language" + (species.voicedescriptor === "Standard" ? "" : " (" + species.voicedescriptor +")");
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
        roll = d6() - d6() + structureMod; if(roll > 5){ roll = 5;}else if(roll < -5){ roll = -5;}
        switch(roll){
            case -5:
                species.tail = "P";
                species.taildesc = "Proboscis/Extended Snout";
                species.taillimbs = 1;
                species.manipulators += 1;
                break;
            case -4:
                species.tail = "V";
                species.taildesc = "Vestigial Tail";
                species.taillimbs = 1;
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
                species.manipulators += 1;
                break;
            case 5:
                species.tail = "A";
                species.taildesc = "Antennae";
                species.taillimbs = species.symmetry === "Asymmetrical" ? d6() : limbsPerGroup;
                break;
        }
        if(species.manipulators === 0){ species.mouthmanipulator = true; species.manipulators += 1; }else{
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
            switch(roll){
                case -6:
                case -5:
                    species.naturalweapon = "";
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
                    species.naturalweapon = "";
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
            if(species.mouthmanipulator){
                roll = d6() - d6() - featureMod;
                if(roll <= -2){
                    species.manipulatordesc = "Mouth (Gripper)";
                }else if(roll <= 2){
                    species.manipulatordesc = "Mouth (Socket)";
                }else{
                    species.manipulatordesc = "Mouth (Tentacles)";
                }
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
            }
            
        }
        for(var i = 0; i < 2; i++){
            switch(species.frontlimbs[i]){
                case "W": species.frontlimbsdesc += (i === 0 ? species.frontlimbs1 : species.frontlimbs2)  + " wings"; break;
                case "A": species.frontlimbsdesc += (i === 0 ? species.frontlimbs1 : species.frontlimbs2)  + " arms"; break;
                case "L": species.frontlimbsdesc += (i === 0 ? species.frontlimbs1 : species.frontlimbs2)  + " legs with manipulators"; break;
                case "F": species.frontlimbsdesc += (i === 0 ? species.frontlimbs1 : species.frontlimbs2)  + " flippers"; break;
                case "N": break;
            }
            if(i == 0 && species.frontlimbs[1] !== "N"){
                species.frontlimbsdesc += " and ";
            }
        }     
        for(var i = 0; i < 2; i++){
            switch(species.rearlimbs[i]){
                case "W": 
                    species.rearlimbsdesc += (i === 0 ? species.rearlimbs1 : species.rearlimbs2) + " wings"; break;
                case "M": 
                    species.rearlimbsdesc += (i === 0 ? 
                        species.rearlimbs1 + " legs (in "+species.rearlimbgroups1+" groups)" :  
                        species.rearlimbs2 + " legs (in "+species.rearlimbgroups2+" groups)"); 
                    break;
                case "L": species.rearlimbsdesc += (i === 0 ? species.rearlimbs1 : species.rearlimbs2)  + " legs"; break;
                case "F": species.rearlimbsdesc += (i === 0 ? species.rearlimbs1 : species.rearlimbs2)  + " flippers"; break;
                case "N": break;
            }
            if(i == 0 && species.rearlimbs[1] !== "N"){
                species.rearlimbsdesc += " and ";
            }
        }
        species.bodystructure = species.head + "-" + species.torso + "-" + species.frontlimbs + "-" + species.rearlimbs + "-" + species.tail;
    }
    function getSpecialAbility(){
        var roll1 = d6();
        var roll2 = d6(2)-2;
        var abilities = [
            ["Actor","Actor","Dancer","Artist","--","--","--","Music","Artist","Osmance","Osmance"],
            ["Insight","Empath","Hibernate","Hypno","--","--","--","Intuition","Rage","ReGen","Curiosity"],
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
            species.genderabilities = [];
            for(var i = 0, len = species.genders.length; i < len; i++){
                var determinant = d6();
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
                                            ability = "Mem <Vision>";
                                            reroll = false;
                                        }
                                        break;
                                    case 2:
                                        if(species.hearing !== "Deaf"){
                                            ability = "Mem <Hearing>";
                                            reroll = false;
                                        }
                                        break;
                                    case 3:
                                        if(species.smell !== "Anosmic"){
                                            ability = "Mem <Smell>";
                                            reroll = false;
                                        }
                                        break;
                                    case 4: reroll = true; break;
                                    case 5: 
                                        if(species.aware !== "Unaware"){
                                            ability = "Mem <Awareness>";
                                            reroll = false;
                                        }
                                        break;
                                    case 6:
                                        if(species.percep !== "Oblivious"){
                                            ability = "Mem <Percep>";
                                            reroll = false;
                                        }
                                        break;
                                }
                            }
                            
                        }
                        species.genderabilities.push(ability);
                        break;
                    case 2:
                        species.genderabilities.push("Roll on Special Abilities table");
                        break;
                    case 3:
                    case 4:
                        species.genderabilities.push("--");
                        break;
                    case 5:
                        species.genderabilities.push("Roll twice on Special Abilities table"); 
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
                                            ability = "Mem <Vision>";
                                            reroll = false;
                                        }
                                        break;
                                    case 2:
                                        if(species.hearing !== "Deaf"){
                                            ability = "Mem <Hearing>";
                                            reroll = false;
                                        }
                                        break;
                                    case 3:
                                        if(species.smell !== "Anosmic"){
                                            ability = "Mem <Smell>";
                                            reroll = false;
                                        }
                                        break;
                                    case 4: reroll = true; break;
                                    case 5: 
                                        if(species.aware !== "Unaware"){
                                            ability = "Mem <Awareness>";
                                            reroll = false;
                                        }
                                        break;
                                    case 6:
                                        if(species.percep !== "Oblivious"){
                                            ability = "Mem <Percep>";
                                            reroll = false;
                                        }
                                        break;
                                }
                            }
                            
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
                                            ability2 = "Mem <Vision>";
                                            reroll = false;
                                        }
                                        break;
                                    case 2:
                                        if(ability === "Hearing" || (species.hearing !== "Deaf" && ability !== "Deaf")){
                                            ability2 = "Mem <Hearing>";
                                            reroll = false;
                                        }
                                        break;
                                    case 3:
                                        if(ability === "Smell" || (species.smell !== "Anosmic" && ability !== "Anosmic")){
                                            ability2 = "Mem <Smell>";
                                            reroll = false;
                                        }
                                        break;
                                    case 4: reroll = true; break;
                                    case 5: 
                                        if(ability === "Awareness" || (species.aware !== "Unaware" && ability !== "Unaware")){
                                            ability2 = "Mem <Awareness>";
                                            reroll = false;
                                        }
                                        break;
                                    case 6:
                                        if(ability === "Perception" || (species.percep !== "Oblivious" && ability !== "Oblivious")){
                                            ability2 = "Mem <Percep>";
                                            reroll = false;
                                        }
                                        break;
                                }
                            }
                            
                        }
                        if(ability === "--"){
                            species.genderabilities.push(ability2);
                        }else if(ability2 === "--"){
                            species.genderabilities.push(ability);
                        }else if(ability === ability2 && ability === "Touch" || ability === "Vision" || ability === "Hearing" || ability === "Awareness" || ability === "Perception" || ability === "Smell"){
                            species.genderabilities.push(ability+"x2");
                        }else if(
                            (ability === "Vision" && ability2 === "Blind" || ability2 === "Vision" && ability === "Blind") ||
                            (ability === "Hearing" && ability2 === "Deaf" || ability2 === "Hearing" && ability === "Deaf") ||
                            (ability === "Awareness" && ability2 === "Unaware" || ability2 === "Awareness" && ability === "Unaware") ||
                            (ability === "Perception" && ability2 === "Oblivious" || ability2 === "Perception" && ability === "Oblivious") ||
                            (ability === "Smell" && ability2 === "Anosmic" || ability2 === "Smell" && ability === "Anosmic")
                        ){
                            species.genderabilities.push("--");
                        }else{
                            species.genderabilities.push(ability + " and " + ability2);
                        }
                }

            }
        }
        species.casteabilities = ["--"];
        if(species.castes.length > 1){
            var determinant = d6();
            species.casteabilities = [];
            for(var i = 0, len = species.castes.length; i < len; i++){
                var determinant = d6();
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
                                            ability = "Mem <Vision>";
                                            reroll = false;
                                        }
                                        break;
                                    case 2:
                                        if(species.hearing !== "Deaf"){
                                            ability = "Mem <Hearing>";
                                            reroll = false;
                                        }
                                        break;
                                    case 3:
                                        if(species.smell !== "Anosmic"){
                                            ability = "Mem <Smell>";
                                            reroll = false;
                                        }
                                        break;
                                    case 4: reroll = true; break;
                                    case 5: 
                                        if(species.aware !== "Unaware"){
                                            ability = "Mem <Awareness>";
                                            reroll = false;
                                        }
                                        break;
                                    case 6:
                                        if(species.percep !== "Oblivious"){
                                            ability = "Mem <Percep>";
                                            reroll = false;
                                        }
                                        break;
                                }
                            }
                            
                        }
                        species.casteabilities.push(ability);
                        break;
                    case 2:
                        species.casteabilities.push("Roll on Special Abilities table");
                        break;
                    case 3:
                    case 4:
                        species.casteabilities.push("--");
                        break;
                    case 5:
                        species.casteabilities.push("Roll twice on Special Abilities table"); 
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
                                            ability = "Mem <Vision>";
                                            reroll = false;
                                        }
                                        break;
                                    case 2:
                                        if(species.hearing !== "Deaf"){
                                            ability = "Mem <Hearing>";
                                            reroll = false;
                                        }
                                        break;
                                    case 3:
                                        if(species.smell !== "Anosmic"){
                                            ability = "Mem <Smell>";
                                            reroll = false;
                                        }
                                        break;
                                    case 4: reroll = true; break;
                                    case 5: 
                                        if(species.aware !== "Unaware"){
                                            ability = "Mem <Awareness>";
                                            reroll = false;
                                        }
                                        break;
                                    case 6:
                                        if(species.percep !== "Oblivious"){
                                            ability = "Mem <Percep>";
                                            reroll = false;
                                        }
                                        break;
                                }
                            }
                            
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
                                            ability2 = "Mem <Vision>";
                                            reroll = false;
                                        }
                                        break;
                                    case 2:
                                        if(ability === "Hearing" || (species.hearing !== "Deaf" && ability !== "Deaf")){
                                            ability2 = "Mem <Hearing>";
                                            reroll = false;
                                        }
                                        break;
                                    case 3:
                                        if(ability === "Smell" || (species.smell !== "Anosmic" && ability !== "Anosmic")){
                                            ability2 = "Mem <Smell>";
                                            reroll = false;
                                        }
                                        break;
                                    case 4: reroll = true; break;
                                    case 5: 
                                        if(ability === "Awareness" || (species.aware !== "Unaware" && ability !== "Unaware")){
                                            ability2 = "Mem <Awareness>";
                                            reroll = false;
                                        }
                                        break;
                                    case 6:
                                        if(ability === "Perception" || (species.percep !== "Oblivious" && ability !== "Oblivious")){
                                            ability2 = "Mem <Percep>";
                                            reroll = false;
                                        }
                                        break;
                                }
                            }
                            
                        }
                        if(ability === "--"){
                            species.casteabilities.push(ability2);
                        }else if(ability2 === "--"){
                            species.casteabilities.push(ability);
                        }else if(ability === ability2 && ability === "Touch" || ability === "Vision" || ability === "Hearing" || ability === "Awareness" || ability === "Perception" || ability === "Smell"){
                            species.casteabilities.push(ability+"x2");
                        }else if(
                            (ability === "Vision" && ability2 === "Blind" || ability2 === "Vision" && ability === "Blind") ||
                            (ability === "Hearing" && ability2 === "Deaf" || ability2 === "Hearing" && ability === "Deaf") ||
                            (ability === "Awareness" && ability2 === "Unaware" || ability2 === "Awareness" && ability === "Unaware") ||
                            (ability === "Perception" && ability2 === "Oblivious" || ability2 === "Perception" && ability === "Oblivious") ||
                            (ability === "Smell" && ability2 === "Anosmic" || ability2 === "Smell" && ability === "Anosmic")
                        ){
                            species.casteabilities.push("--");
                        }else{
                            species.casteabilities.push(ability + " and " + ability2);
                        }
                }

            }
        }
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
                nD += +(species.c3val[0])/3;
                break;
        }
        if(nD <= 3){
            species.sizeclass = "Small";
        }else if(nD <= 6){
            species.sizeclass = "Standard ";
        }else if(nD <= 12){
            species.sizeclass = "Oversize";
        }else{
            species.sizeClass = "Titan";
        }
        
        switch(strD){
            case 1:
            case 2:
            case 3: species.size = nD * 12;
            case 4: species.size = nD * 48;
            case 5: species.size = nD * 60;
            case 6: species.size = nD * 72;
            case 7: species.size = nD * 84;
            case 8: species.size = nD * 96;
        }
        var bfp = d6(2) + 2;
        var planetSize = species.homeworld.mainworld.size;
        if(planetSize <= 1){ bfp +=1;}
        if(planetSize <= 4){ bfp +=1; }
        if(planetSize <= 6){ bfp +=1;}
        if(planetSize >= 9){ bfp -=1;}
        if(planetSize >= 11){ bfp -=1;}
        if(species.sizeClass === "Oversize"){ bfp -= 1;}
        if(species.locomotion === "Swim" || species.locomotion === "Diver"){ bfp += 10;}
        if(species.locomotion === "Triphib" || species.locomotion === "Flyphib"){ bfp += 20;}
        if(species.locomotion === "Flyer"){
            if(species.bodystructure.indexOf("W") >= 0){
             bfp += 70;
            }else{
                bfp -= 1;
            }
        }
        species.bfp = bfp;
        species.height = getHeight(species.size, species.bfp);
    }
    function getHeight(size, bfp){
        if(bfp > 15){ return ">3 m";}
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
    return species;
}

