function createCharacter(name, homeworld, rollProvider, choiceFunction){
    // roll provider = function that accepts a given die roll type and returns a numerical value
    // choice function = function that accepts a description of a choice, a list of choices, and returns a chosen number
    var person = { name:name, homeworld:homeworld }
    return person;
}