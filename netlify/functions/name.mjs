import { NameGenerator } from "../../Traveller/js/NameGeneratorModule";
import { getNames } from "../../Traveller/js/namesModule";

export default async (req, context) => {
    try{
        return new Promise(async (resolve,reject) => {
            try{
                const { key } = context.params;
                const urls = req.url.split("/");
                const url = urls[urls.length-1];
                const generator = await NameGeneratorPromise();
                var params = {};
                if(url.indexOf("?") >= 0){
                    var search = url.split("?");
                    params.key = search[0];
                    if(search.length > 1){
                        var kvp = search[1].split("&");
                        for(var i = 0, len = kvp.length; i < len; i++){
                            var pair = kvp[i].split("=");
                            pair[0] = pair[0].replace("$","");
                            params[pair[0]] = pair.length > 1 ? pair[1] : true;
                        }
                    }
                }else{
                    params.key = key;
                }
                if(typeof params.key === "undefined"){params.key = "human";}
                if(typeof params.top === "undefined"){params.top = 100;}else if(params.top < 0){params.top = 1;}else if(params.top > 1280){ params.top = 1280; }
                console.log(params);
                console.log(context.geo);
                var names = [];

                    for(var i = 0, len = params.top; i < len; i++){
                        names.push(addCaps(generator.getRandomName(params.key).trim()));
                    }
                
                var response = new Response(JSON.stringify({"results":names}),{"status":200, "statusText":names[0], headers:{"Content-Type":"application/json; charset=utf-8"}});
                resolve(response);
            }catch(error){
                var response = new Response(JSON.stringify({"error":"invalid request"}),{"status":400,"headers":{"Content-Type":"application/json; charset=utf-8"}});
                reject(response);
            }
        });
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
function addCaps(text) {
    var capitalizedString = "";
    var lastCharacter = null, currCharacter = " ";
    for (var i = 0, len = text.length; i < len; i++) {
        lastCharacter = currCharacter;
        currCharacter = text[i];
        if (lastCharacter === " " || lastCharacter === "-") {
            capitalizedString += currCharacter.toUpperCase();
        } else {
            capitalizedString += currCharacter;
        }
    }
    return capitalizedString;
}
export const config = {
    path: "/api/names/:key"
};