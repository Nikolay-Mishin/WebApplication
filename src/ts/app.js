"use strict";
exports.__esModule = true;
var lib_1 = require("./lib");
var main_1 = require("./main");
// ts/app.ts
window.console.log("ts/app2.ts");
window.console.log(lib_1["default"]);
window.onload = function () {
    var el = document.body;
    var greeter = new main_1["default"](el);
    greeter.start();
};
