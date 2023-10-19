import { NameGenerator } from "../../Traveller/js/NameGenerator";
import { getNames } from "../../Traveller/js/names";

export default async (req, context) => {
    NameGenerator(getNames(), sendResponse, null, Math.random,true);
    function sendResponse(generator){
        const { key } = context.params;
        return new Response(generator.getRandomName(key));
    }
    return new Response("hello world");
}
export const config = {
    path: "/api/names/:key"
};