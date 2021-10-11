// ts/main.ts

export default class Greeter {
	private element: HTMLElement;
	private span: HTMLElement;
	private timerToken: NodeJS.Timeout;

	constructor(element: HTMLElement) {
		this.element = element;
		this.element.innerHTML += "The time is: ";
		this.span = document.createElement("span");
		this.element.appendChild(this.span);
		this.span.innerText = new Date().toUTCString();
		this.timerToken = new NodeJS.Timeout();
	}

	public start() {
		this.timerToken = setInterval(() => this.span.innerHTML = new Date().toUTCString(), 500);
	}

	public stop() {
		clearTimeout(this.timerToken);
	}
}
