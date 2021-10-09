// ts/app.ts

import lib from "./lib";
import Greeter from "./main";
// import $ from "jquery";

// global.jQuery = global.$ = $;
// console.log($);

console.log("ts/app.ts");
console.log(lib);

document.onload = () => {
	const el = document.body;
	const greeter = new Greeter(el);
	greeter.start();
};
