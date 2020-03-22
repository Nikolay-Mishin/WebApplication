"use strict";
// ts/lib.ts
define("lib", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function foo() {
        window.console.log("ts/lib.ts");
    }
    exports.foo = foo;
});
define("app", ["require", "exports", "lib"], function (require, exports, lib) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // ts/app.ts
    window.console.log("ts/app.ts");
    window.console.log(lib.foo);
});
// index.ts
window.console.log("index.ts");
// ts/main.ts
var Greeter = /** @class */ (function () {
    function Greeter(element) {
        this.element = element;
        this.element.innerHTML += "The time is: ";
        this.span = document.createElement("span");
        this.element.appendChild(this.span);
        this.span.innerText = new Date().toUTCString();
    }
    Greeter.prototype.start = function () {
        // this.timerToken = setInterval(() => this.span.innerHTML = new Date().toUTCString(), 500);
    };
    Greeter.prototype.stop = function () {
        clearTimeout(this.timerToken);
    };
    return Greeter;
}());
window.onload = function () {
    var el = document.body;
    var greeter = new Greeter(el);
    greeter.start();
};
//# sourceMappingURL=main.js.map