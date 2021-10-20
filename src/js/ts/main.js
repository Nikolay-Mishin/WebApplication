// ts/main.ts
export default class Greeter {
    constructor(element) {
        this.element = element;
        this.element.innerHTML += "The time is: ";
        this.span = document.createElement("span");
        this.element.appendChild(this.span);
        this.span.innerText = new Date().toUTCString();
        //@ts-ignore
        this.timerToken = new NodeJS.Timer();
    }
    start() {
        this.timerToken = setInterval(() => this.span.innerHTML = new Date().toUTCString(), 500);
    }
    stop() {
        clearTimeout(this.timerToken);
    }
}
//# sourceMappingURL=main.js.map