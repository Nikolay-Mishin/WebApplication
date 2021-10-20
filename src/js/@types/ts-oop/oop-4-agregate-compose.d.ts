export declare class Freshener {
}
export declare class Car {
    private engine;
    private wheels;
    private freshener;
    constructor(freshener: Freshener);
    drive(): void;
}
declare class Flat {
    private freshener;
    constructor(freshener: Freshener);
}
export declare const flat: Flat;
export {};
