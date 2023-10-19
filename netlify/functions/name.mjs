import { NameGenerator } from "../../Traveller/js/NameGeneratorModule";
import { getNames } from "../../Traveller/js/namesModule";

export default async (req, context) => {
    try{
        const { key } = context.params;
        NameGeneratorPromise().then(function(generator){
            console.log("Key = " +key);
            console.log("Generator = " +generator);
            const name = generator.getRandomName(key);
            return new Response(name);
        }).catch(function(error){ console.log(error); });    
    }catch(error){
        return new Response(error);
    }
}
function NameGeneratorPromise(){
    return new Promise((resolve,reject)=>{
        NameGenerator(
            getNames(), 
            function(generator){resolve(generator);}, 
            null, 
            Math.random,
            true
        );
    })
}
export const config = {
    path: "/api/names/:key"
};