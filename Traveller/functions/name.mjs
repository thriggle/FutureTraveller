import { NameGenerator } from "../js/NameGenerator";
import { getNames } from "../js/names";

export default async (req, context) => {
    NameGenerator(getNames(), sendResponse, null, Math.random,true);
    function sendResponse(generator){
        const { key } = context.params;
        return new Response(generator.getRandomName(key));
    }
}