// ts/main.ts
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Greeter {
        constructor(element) {
            this.element = element;
            this.element.innerHTML += "The time is: ";
            this.span = document.createElement("span");
            this.element.appendChild(this.span);
            this.span.innerText = new Date().toUTCString();
        }
        start() {
            // this.timerToken = setInterval(() => this.span.innerHTML = new Date().toUTCString(), 500);
        }
        stop() {
            clearTimeout(this.timerToken);
        }
    }
    exports.default = Greeter;
});
//# sourceMappingURL=main.js.map