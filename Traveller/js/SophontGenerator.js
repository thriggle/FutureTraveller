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
        else if(species.locomotion === "Swimmer" || species.locomotion === "Diver"){
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
            species.castec1s = [];
            species.castec2s = [];
            species.castec3s = [];
            species.castec4s = [];
            species.castec5s = [];
            species.castec6s = [];
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
                species.castec1s = [];
                species.castec2s = [];
                species.castec3s = [];
                species.castec4s = [];
                species.castec5s = [];
                species.castec6s = [];
                for(var i = 0, len = species.castes.length; i < len; i++){
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
            switch(poicetone){
                case 1: pd1 = "Very Intelligent"; break;
                case 2: pd1 = "Intelligent"; break;
                case 3: pd1 = "Sapient"; break;
                case 4: pd1 = "Conscious"; break;
                case 5: pd1 = "Rudimentary"; break;
                case 6: pd1 = "Artificial"; break;
            }
            switch(species.poice){
                case 1: pd2 = "Faint"; break;
                case 2: pd2 = "Vague"; break;
                case 3: pd2 = "Common"; break;
                case 4: pd2 = "Firm"; break;
                case 5: pd2 = "Strong"; break;
                case 6: pd2 = "Powerful"; break;
            }
            species.poicetone = pd1;
            species.poicedescriptor= pd2;
            species.percep = "P-"+species.percepconstant+"-"+species.poicetone+species.poice;
        }
    }
    function setLanguageMedium(){
        if(species.hearing !== "Deaf"){ species.language = "Verbal Language";}
        else if(species.percep !== "Oblivious"){ 
            species.language = "Perceptual Language ("+species.poicetone+", "+species.poicedescriptor+")";}
        else if(species.vision === "Blind" && species.aware !== "Unaware"){
            species.language = "Awareness Language";
        }else if(species.vision !== "Blind" && species.percep === "Oblivious" && species.hearing === "Deaf"){
            species.language = "Visual Sign Language";
        }else if(species.vision === "Blind" && species.percep === "Oblivious" && species.hearing === "Deaf"){
            species.language = "Tactile Sign Language";
        }
    }

    return species;
}

