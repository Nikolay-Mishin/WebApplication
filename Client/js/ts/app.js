(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "./lib", "./main"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const lib_1 = tslib_1.__importDefault(require("./lib"));
    const main_1 = tslib_1.__importDefault(require("./main"));
    // ts/app.ts
    window.console.log("ts/app.ts");
    window.console.log(lib_1.default);
    window.onload = () => {
        const el = document.body;
        const greeter = new main_1.default(el);
        greeter.start();
    };
});
//# sourceMappingURL=app.js.map