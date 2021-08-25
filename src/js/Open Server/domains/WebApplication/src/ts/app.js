import lib from "./lib";
import Greeter from "./main";
//global.jQuery = global.$ = $;
//window.console.log($);
// ts/app.ts
window.console.log("ts/app.ts");
window.console.log(lib);
window.onload = () => {
    const el = document.body;
    const greeter = new Greeter(el);
    greeter.start();
};
//# sourceMappingURL=app.js.map