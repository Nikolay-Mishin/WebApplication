"use strict";
// ts/lib.ts
define("lib", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function lib() {
        window.console.log("ts/lib.ts");
    }
    exports.default = lib;
});
// ts/main.ts
define("main", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
    exports.default = Greeter;
});
define("app", ["require", "exports", "lib", "main"], function (require, exports, lib_1, main_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // ts/app.ts
    window.console.log("ts/app.ts");
    window.console.log(lib_1.default);
    window.onload = function () {
        var el = document.body;
        var greeter = new main_1.default(el);
        greeter.start();
    };
});
// index.ts
window.console.log("index.ts");
//# sourceMappingURL=main.js.map