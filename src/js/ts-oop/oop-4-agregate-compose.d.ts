declare class Engine {
    drive(): void;
}
declare class Wheel {
    drive(): void;
}
declare class Freshener {
}
declare class Car {
    private engine;
    private wheels;
    private freshener;
    constructor(freshener: Freshener);
    drive(): void;
}
declare const car: Car;
declare class Flat {
    private freshener;
    constructor(freshener: Freshener);
}
declare const flat: Flat;
