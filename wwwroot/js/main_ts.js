"use strict";
// ts/lib.ts
System.register("lib", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function foo() {
        window.console.log("ts/lib.ts");
    }
    exports_1("foo", foo);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("app", ["lib"], function (exports_2, context_2) {
    "use strict";
    var lib;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [
            function (lib_1) {
                lib = lib_1;
            }
        ],
        execute: function () {
            // ts/app.ts
            window.console.log("ts/app.ts");
            window.console.log(lib.foo);
        }
    };
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
//# sourceMappingURL=main_ts.js.map