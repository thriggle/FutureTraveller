import { NameGenerator } from "../../Traveller/js/NameGeneratorModule";
import { getNames } from "../../Traveller/js/namesModule";

export default async (req, context) => {
    const { key } = context.params;
    getNameGenerator().then(function(generator){
        return new Response(generator.getRandomName(key));
    });    
}
function getNameGenerator(){
    return new Promise((resolve)=>{
        NameGenerator(getNames(), function(generator){resolve(generator)}, null, Math.random,true);
    })
}
export const config = {
    path: "/api/names/:key"
};