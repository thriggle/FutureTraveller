export function getRollerFromSeed(seed){
    if(typeof seed === "undefined"){
        seed = (Math.random()*1000000).toString();
    }
    var MathRandom = pseudoRandomNumberGenerator(seed);
    function random(){
        return MathRandom();
    }
    function d6(num){
        if(typeof num == "undefined"){
            num = 1;
        }
        var sum = 0, rolls = [];
        for(var i = 0; i < num; i++){
            var roll = (MathRandom()*6 >>> 0) + 1;
            sum += roll;
            rolls.push(roll);
        }
        return({result:sum,rolls:rolls});
    }
    function flux(){
        var roll1 = d6(1), roll2 = d6(1); 
        var sum = roll1.result - roll2.result;
        return {result:sum,rolls:roll1.rolls.concat(roll2.rolls)};
    }
    function posFlux(){
        var roll1 = d6(1), roll2 = d6(1);
        if(roll2.result > roll1.result){
            var roll3 = roll1;
            roll1 = roll2;
            roll2 = roll3;
        }
        var sum = roll1.result - roll2.result;
        return {result:sum, rolls:roll1.rolls.concat(roll2.rolls)};
    }
    function negFlux(){
        var roll1 = d6(1), roll2 = d6(1);
        if(roll2.result < roll1.result){
            var roll3 = roll1;
            roll1 = roll2;
            roll2 = roll3;
        }
        var sum = roll1.result = roll2.result;
        return {result:sum, rolls:roll1.rolls.concat(roll2.rolls)};
    }
    return {
        d6:d6,
        flux:flux,
        posFlux:posFlux,
        negFlux:negFlux,
        random
    }
}
function pseudoRandomNumberGenerator(word){
    function xmur3(str) {
        for(var i = 0, h = 1779033703 ^ str.length; i < str.length; i++) {
            h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
            h = h << 13 | h >>> 19;
        } return function() {
            h = Math.imul(h ^ (h >>> 16), 2246822507);
            h = Math.imul(h ^ (h >>> 13), 3266489909);
            return (h ^= h >>> 16) >>> 0;
        }
    }
    function xoshiro128ss(a, b, c, d) {
        return function() {
            var t = b << 9, r = a * 5; r = (r << 7 | r >>> 25) * 9;
            c ^= a; d ^= b;
            b ^= c; a ^= d; c ^= t;
            d = d << 11 | d >>> 21;
            return (r >>> 0) / 4294967296;
        }
    }
    var seed = xmur3(word);
    return xoshiro128ss(seed(), seed(), seed(), seed());
}
