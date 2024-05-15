import generateName from "sillyname";
import * as sh from "superheroes";

var sillyName = generateName();
console.log(`My name is ${sillyName}.`);

var mySh = sh.randomSuperhero();
console.log(`My name is ${mySh}.`);