import { CLASS_SPECIES, ENUM_CHARACTERISTICS } from "./species.js"
export class human extends CLASS_SPECIES{
    static get BaseSenses(){ return ["V-16-RGB", "H-16-9382", "S-10-02", "T-06-02"] }
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
    static get Characteristics(){ return [ 
        {name:ENUM_CHARACTERISTICS.STR, nD:2},
        {name:ENUM_CHARACTERISTICS.DEX, nD:2},
        {name:ENUM_CHARACTERISTICS.END, nD:2},
        {name:ENUM_CHARACTERISTICS.INT, nD:2},
        {name:ENUM_CHARACTERISTICS.EDU, nD:2},
        {name:ENUM_CHARACTERISTICS.SOC, nD:2}
    ]}
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

}