export function NameGenerator(sourceJson,callback,forbiddenWords,randomizer,fromObject){
    if(typeof fromObject == "undefined"){
        fromObject = false;
    }
    var MathRandom;
    if(randomizer){
        MathRandom = randomizer;
    }else{
        MathRandom = pseudoRandomNumberGenerator((Math.random()*1000000).toString());
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
    var defaultForbiddenWords = ["bitch","anus","ass"];
    if(typeof forbiddenWords === "undefined" || forbiddenWords === null){
        forbiddenWords = defaultForbiddenWords;
    }
    console.log("Attaching properties and methods...")
    this.getRandomName = getRandomName;
    this.setForbiddenWords = setForbiddenWords;
    this.restoreDefaultForbiddenWords = restoreDefaultForbiddenWords;
    this.keys = [];
    this.templates = {};
    this.unpackStringTemplate = unpackStringTemplate;
    var UnpackedStringTemplates = { names: {} };
    if(fromObject){
        templates = getWeightedPatternsFromJSON({}, sourceJson);
        var keys = Object.keys(templates);
        var generator = {templates:templates,keys:keys,getRandomName:getRandomName,setRandom:setRandom, unpackStringTemplate:unpackStringTemplate, setSeed:setSeed};
        callback(generator);
    }else{
        var xhr = new XMLHttpRequest();
        xhr.open("GET", sourceJson);
        xhr.addEventListener("load", function loadStrings(evt) {
            var rawJson = xhr.responseText;
            templates = getWeightedPatternsFromJSON({}, JSON.parse(JSON.minify(rawJson)));
            var keys = Object.keys(templates);
            var generator = {templates:templates,keys:keys,getRandomName:getRandomName,setRandom:setRandom, unpackStringTemplate:unpackStringTemplate, setSeed:setSeed};
            callback(generator);
        });
        xhr.send();
    }
    
    function setSeed(seed){
        MathRandom = pseudoRandomNumberGenerator(seed);
    }
    function setRandom(random){
        MathRandom = random;
    }
    function setForbiddenWords(words){
        forbiddenWords = words;
    }
    function restoreDefaultForbiddenWords(){
        forbiddenWords = defaultForbiddenWords;
    }
    function getRandomSubKey(key, minDepth, maxDepth){
        if(typeof minDepth === "undefined"){ minDepth = 0;}
        if(typeof maxDepth === "undefined"){ maxDepth = 2;}
        if(typeof key === "undefined"){ key = "system"; }
        var templatesSubset = this.templates[key];
        var outKey = key;
        var stop = false;
        while (minDepth < maxDepth && stop === false){
            var templatesSubset = this.templates[key];
            var templateRoll =(templatesSubset.length * MathRandom()) >>> 0 ;
            var template = templatesSubset[templateRoll];
            var phrases = this.unpackStringTemplate(template);
        }
    }
    function getRandomName(key, bannedWords, topLevel) {
        var extraLogs = false;
        if(typeof bannedWords === "undefined"){
            bannedWords = forbiddenWords;
        }
        if(typeof topLevel === "undefined"){
            topLevel = true;
            extraLogs = true;
        }
        var templatesSubset = this.templates[key];
        var templateRoll =(templatesSubset.length * MathRandom()) >>> 0 ;
        var template = templatesSubset[templateRoll];
        var phrases = this.unpackStringTemplate(template); // convert string into array of phrase objects with child segments
        UnpackedStringTemplates.names[key] = phrases;
        var phraseRoll = (phrases.length * MathRandom()) >>> 0
        var phrase = phrases[ phraseRoll ];
        var currentText = "";
        var references = [];
        var checkNot = -1;
        for (var i = 0, len = phrase.length; i < len; i++) { // process each segment of the selected phrase
            var segment = phrase[i];
            var piece = "";
            if (segment.text) {
                piece = segment.text;                
                if(piece.endsWith(">") && references.length > 0){
                var matches = piece.match(/<!\d>/g);
                   if(matches.length > 0){
                        var number = +(matches[matches.length-1].match(/\d/)[0]);
                        checkNot = number;
                        var regex = new RegExp("<!"+number.toString() + ">","g");
                        piece = piece.replace(regex,"");
                   }else{
                       checkNot = -1;
                   }
                }else{
                    checkNot = -1;
                }
                currentText += piece;
            } else if (segment.reference) {
                piece = this.getRandomName(segment.reference,bannedWords,false);
                if(checkNot >= 0){
                    while(piece == references[checkNot]){
                        piece = this.getRandomName(segment.reference,bannedWords,false);
                    }
                }
                currentText += piece;
                references.push(piece);
            } else if (segment.references) {
                var ref = segment.references[(segment.references.length * MathRandom()) >>> 0];
                piece = this.getRandomName(ref,bannedWords,false);;
                if(checkNot >= 0){
                    while(piece == references[checkNot]){
                        piece = this.getRandomName(ref,bannedWords,false);
                    }
                }
                currentText += piece;
                references.push(piece);
            }
        }
        if(currentText.indexOf("<") > 0 && currentText.indexOf("&") > 0 && currentText.indexOf(">") > 0){
            for(var i = 0, len = references.length; i < len; i++){
                var regex = new RegExp("\<\&"+i+">","g");
                currentText = currentText.replace(regex,references[i]);
            }
        }
        if(bannedWords.indexOf(currentText) >= 0){
            currentText = this.getRandomName(key, bannedWords,true);
        }
        return currentText.replace(/\s+/g," ");
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
    function unpackStringTemplate(template) {
        var bracketDepth = 0;
        var phraseArray = [];
        var currentString = "";
        if(template === ""){ return [""];}
        // build outer array
        for (var i = 0, len = template.length; i < len; i++) {
            var character = template[i];
            if (character === "{") {
                bracketDepth += 1;
                currentString += character;
            } else if (character === "}") {
                bracketDepth -= 1;
                currentString += character;
            } else if (character === "|" && bracketDepth === 0) {
                phraseArray.push(currentString);
                currentString = "";
            } else {
                currentString += character;
            }
        }
        if (currentString.length > 0) {
            phraseArray.push(currentString);
        }
        // for each phrase in the array, get the segments
        var isTextSegment = true, isRefSegment = false, isRefArray = false;
        currentString = "", bracketDepth = 0;
        var returnArray = []; // this array holds the phrases
        for (var i = 0, len = phraseArray.length; i < len; i++) {
            var phrase = phraseArray[i];
            var currArr = []; // this array holds the segments for a phrase
            var refArr = []; // this object holds a references segment under construction;
            for (var j = 0, jlen = phrase.length; j < jlen; j++) {
                var character = phrase[j];
                if (character === "{") {
                    if (currentString.length > 0) {
                        if (isTextSegment) {
                            currArr.push({ text: currentString });
                        }
                    }
                    isTextSegment = false;
                    isRefSegment = true;
                    currentString = "";
                } else if (character === "}") {
                    if (isRefSegment) {
                        currArr.push({ reference: currentString });
                        currentString = "";
                        isRefSegment = false;
                        currentString = "";
                    } else if (isRefArray) {
                        refArr.push(currentString);
                        currentString = "";
                        currArr.push({ references: refArr });
                        isRefArray = false;
                        refArr = [];
                    }
                    currentString = "";
                } else if (character === "|") {
                    if (isRefSegment) {
                        isRefArray = true;
                        isRefSegment = false;
                        refArr.push(currentString);
                        currentString = "";
                    } else if (isRefArray) {
                        refArr.push(currentString);
                        currentString = "";
                    }
                } else {
                    if (!isRefSegment && !isRefArray) {
                        isTextSegment = true;
                    }
                    currentString += character;
                }
            }
            if (currentString.length > 0) {
                if (isTextSegment) {
                    currArr.push({ text: currentString });
                    currentString = "";
                }
            }
            returnArray.push(currArr);
        }
        return returnArray;
    }
    function getWeightedPatternsFromJSON(returnObj, obj) {
        for (var key in obj) {
            if (key === "patterns") { continue; }
            var collection = obj[key];
            var collectionIsArray = collection.constructor === Array;
            returnObj[key] = getWeightedPatternsFromJSONSegment(collection);
            if (!collectionIsArray) {
                for (var subkey in collection) {
                    if (subkey === "patterns") { continue; }
                    var subcollection = collection[subkey];
                    returnObj[key + "." + subkey] = getWeightedPatternsFromJSONSegment(subcollection);
                }
            }
        }
        return returnObj;
    }
    function getWeightedPatternsFromJSONSegment(collection) {
        var weightedPatterns = [];
        if (typeof collection.patterns !== "undefined") {

            var patterns = collection.patterns;
            for (var i = 0, len = patterns.length; i < len; i++) {
                var pattern = patterns[i];
                var weight = 1, isString = pattern.constructor === String;
                var patternText = "";
                if (!isString) {
                    if (pattern.weight) {
                        weight = pattern.weight;
                    }
                    if (pattern.format) {
                        patternText = pattern.format
                    }
                } else { // look for shorthand of weight:template in string
                    var indexOfColon = pattern.indexOf(":");
                    if (indexOfColon > 0) {
                        var preColonText = pattern.substring(0, indexOfColon);
                        var number = +(preColonText);
                        if (number >= 0) {
                            weight = number;
                            patternText = pattern.substring(indexOfColon + 1);
                        } else {
                            patternText = pattern;
                        }
                    } else {
                        weight = 1;
                        patternText = pattern;
                    }
                }
                for (var j = 0; j < weight; j++) {
                    weightedPatterns.push(patternText);
                }
            }
        } else if (collection.constructor === Array) {
            for (var i = 0, len = collection.length; i < len; i++) {
                var pattern = collection[i];
                var weight = 1, isString = pattern.constructor === String;
                var patternText = "";
                if (!isString) {
                    if (pattern.weight) {
                        weight = pattern.weight;
                    }
                    if (pattern.format) {
                        patternText = pattern.format
                    }
                } else { // look for shorthand of weight:template in string
                    var indexOfColon = pattern.indexOf(":");
                    if (indexOfColon > 0) {
                        var preColonText = pattern.substring(0, indexOfColon);
                        var number = +(preColonText);
                        if (number >= 0) {
                            weight = number;
                            patternText = pattern.substring(indexOfColon + 1);
                        } else {
                            patternText = pattern;
                        }
                    } else {
                        weight = 1;
                        patternText = pattern;
                    }
                }
                for (var j = 0; j < weight; j++) {
                    weightedPatterns.push(patternText);
                }
            }
        }
        return weightedPatterns;
    }
}