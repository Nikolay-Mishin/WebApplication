export default class Greeter {
    private element;
    private span;
    private timerToken;
    constructor(element: HTMLElement);
    start(): void;
    stop(): void;
}
