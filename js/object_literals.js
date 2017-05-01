var Sales = "Toyota";

function CarTypes(name) {
    return (name === "Honda")
        ? name
        : "Sorry, we don't sell " + name + ".";
}

var car = {
    myCar: "Saturn",
    getCar: CarTypes("Honda"),
    special: Sales
};

console.log(car.myCar); // Saturn
console.log(car.getCar); // Honda
console.log(car.special); // Toyota

var car = {
    manyCars: {
        a: "Saab",
        "b": "Jeep"
    },
    7: "Mazda"
};

console.log(car.manyCars.b); // Jeep
console.log(car[7]); // Mazda

var unusualPropertyNames = {
    "": "An empty string",
    "!": "Bang!"
}
//console.log(unusualPropertyNames."");   // 语法错误: Unexpected string
console.log(unusualPropertyNames[""]); // An empty string
//console.log(unusualPropertyNames.!);    // 语法错误: Unexpected token !
console.log(unusualPropertyNames["!"]); // Bang!

var foo = {
    a: "alpha",
    2: "two"
};
console.log(foo.a); // alpha
console.log(foo[2]); // two
//console.log(foo.2);  // Error: missing ) after argument list
//console.log(foo[a]); // Error: a is not defined
console.log(foo["a"]); // alpha
console.log(foo["2"]); // two

function handler(){
  return false;
}

var obj = {
    // __proto__
    __proto__: {},
    // Shorthand for ‘handler: handler’
    handler,
    // Methods
    toString() {
        // Super calls
        return "d " + super.toString();
    },
    // Computed (dynamic) property names
    ['prop_' + (() => '42'* 2)()]: 42
};
console.dir(obj);
