export class CLASS_SPECIES{
    static get LifeStageTerms(){
        return [
            0.5, // 0
            2, // 1
            2, // 2
            2, // 3
            2, // 4
            2, // 5
            2, // 6
            2, // 7
            2 // 8
        ]
    }
    static get GenderTable(){
        return [
            "F", //2
            "M", //3
            "F", //4
            "F", //5
            "M", //6
            "M", //7
            "F", //8
            "F", //9
            "M", //10
            "F", //11
            "M" //12
        ];
    }
    static get CasteTable(){
        return [
            "N/A", //2
            "N/A", //3
            "N/A", //4
            "N/A", //5
            "N/A", //6
            "N/A", //7
            "N/A", //8
            "N/A", //9
            "N/A", //10
            "N/A", //11
            "N/A" //12
        ];
    }
    static get Castes(){ 
        return {
            "N/A":{
                Characteristics:[
                    {nD:0,Mod:0},
                    {nD:0,Mod:0},
                    {nD:0,Mod:0},
                    {nD:0,Mod:0},
                    {nD:0,Mod:0},
                    {nD:0,Mod:0}
                ]
            }
        };
    }
    static get Genders(){ 
        return {
            "F":{
                Characteristics:[
                    {nD:0,Mod:0},
                    {nD:0,Mod:0},
                    {nD:0,Mod:0},
                    {nD:0,Mod:0},
                    {nD:0,Mod:0},
                    {nD:0,Mod:0}
                ]
            },"M":{
                Characteristics:[
                    {nD:0,Mod:0},
                    {nD:0,Mod:0},
                    {nD:0,Mod:0},
                    {nD:0,Mod:0},
                    {nD:0,Mod:0},
                    {nD:0,Mod:0}
                ]
            }
        };
    }
    static getFirstYearOfStage(stage){
        var stageCursor = 0, ageClimber = 0;
        while(stage > stageCursor){
            ageClimber += this.LifeStageTerms[stageCursor] * 4;
            stageCursor += 1;
        }
        return ageClimber;
    }
    static getLifeStageFromAge(age){
        var stageCursor = 0, ageClimber = 0;
        while(age > ageClimber && stageCursor < 10){
            ageClimber += this.LifeStageTerms[stageCursor] * 4;
            stageCursor += 1;
        }
        return ageClimber > age ? stageCursor - 1 : stageCursor;
    }
}

export class ENUM_CHARACTERISTICS{
    static get STR(){ return "Strength"; }
    static get DEX(){ return "Dexterity"; }
    static get AGI(){ return "Agility"; }
    static get GRA(){ return "Grace"; }
    static get END(){ return "Endurance"; }
    static get VIG(){ return "Vigor"; }
    static get STA(){ return "Stamina"; }
    static get INT(){ return "Intellect"; }
    static get EDU(){ return "Education"; }
    static get TRA(){ return "Training"; }
    static get INS(){ return "Instinct"; }
    static get SOC(){ return "Social Standing"; }
    static get CHA(){ return "Charisma"; }
    static get CAS(){ return "Caste"; }
    static get SAN(){ return "Sanity";}
}