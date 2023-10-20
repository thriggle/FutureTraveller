import { NameGenerator } from "../../Traveller/js/NameGeneratorModule";
import { getNames } from "../../Traveller/js/namesModule";

export default async (req, context) => {
    try{
        return new Promise(async (resolve,reject) => {
            const { key } = context.params;
            const generator = await NameGeneratorPromise();
            console.log("Key = " +key);
            const name = generator.getRandomName(key);
            console.log(name);
            var response = new Response(name,{"status":200, "statusText":name, headers:{"Content-Type":"text/html; charset=utf-8"}});
            resolve(response);
        })
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