// ts/app.ts
import lib from "./lib";
import Greeter from "./main";
//import $ from "jquery";
//global.jQuery = global.$ = $;
//console.log($);
console.log("ts/app.ts");
console.log(lib);
//const $app = '';
function name() {
    return '';
}
name();
var test = /** @class */ (function () {
    function test() {
    }
    return test;
}());
new test();
document.onload = function () {
    var el = document.body;
    var greeter = new Greeter(el);
    greeter.start();
};
//# sourceMappingURL=app.js.map