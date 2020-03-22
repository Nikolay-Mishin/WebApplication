import lib from "./lib";
import Greeter from "./main";
// ts/app.ts
window.console.log("ts/app.ts");
window.console.log(lib);
window.onload = function () {
    var el = document.body;
    var greeter = new Greeter(el);
    greeter.start();
};
//# sourceMappingURL=app.js.map