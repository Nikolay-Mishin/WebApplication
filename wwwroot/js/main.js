"use strict";
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