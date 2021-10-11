// ts/app.ts
import lib from "./lib";
import Greeter from "./main";
import $ from "jquery";
//global.jQuery = global.$ = $;
console.log($);
console.log("ts/app.ts");
console.log(lib);
document.onload = function () {
    var el = document.body;
    var greeter = new Greeter(el);
    greeter.start();
};
//const $app = '';
function name() {
    return '';
    //return '';
}
name();
var Test = /** @class */ (function () {
    function Test() {
    }
    Test.prototype.test = function () {
        return;
    };
    return Test;
}());
var test = new Test();
console.log(test);
//# sourceMappingURL=app.js.map