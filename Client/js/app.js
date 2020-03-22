import lib from "./lib";
import Greeter from "./main";

// js/app.js

console.log("js/app.js");
console.log(lib);

window.onload = function () {
	var el = document.body;
	var greeter = new Greeter(el);
	greeter.start();
};
