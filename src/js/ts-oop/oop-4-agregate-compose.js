"use strict";
// Помимо наследования есть еще несколько способов взаимодействия между классами: композиция и агрегация
// 4.1. Композиция
// Суть композиции заключается в том, что внутри класса используются объекты другого класса, которые создаются (инициализируются) внутри этого класса и не могут существовать отдельно (вне этого класса), как самостоятельные элементы
// Например, у нас есть класс Автомобиль, внутри которого используется объект двигателя и массив из 4 колес, которые инициализируются в данном классе и не могут функционировать самостоятельно (отдельно/вне класса)
// 4.2. Агрегация
// Отличие агрегации от композиции заключается в том, что при данном подходе в класс передаются объекты других классов передаются извне через параметры конструктора, те в отличии от композиции эти объекты являются самостоятельными сущностями (не зависят от данного класса) и могут использоваться, как отдельно от данного класса, так и в других классах
// Например, у автомобиля есть объект Елочка-освежитель, которая может существовать как в автомобиле, так и в квартире или человек может носить в качестве аксессуара и тд
// двигатель
var Engine = /** @class */ (function () {
    function Engine() {
    }
    Engine.prototype.drive = function () {
        console.log('Двигатель работает');
    };
    return Engine;
}());
// колесо
var Wheel = /** @class */ (function () {
    function Wheel() {
    }
    Wheel.prototype.drive = function () {
        console.log('Колеса едут');
    };
    return Wheel;
}());
// освежитель
var Freshener = /** @class */ (function () {
    function Freshener() {
    }
    return Freshener;
}());
var Car = /** @class */ (function () {
    function Car(freshener) {
        // композиция
        this.engine = new Engine();
        this.wheels = [];
        this.wheels.push(new Wheel());
        this.wheels.push(new Wheel());
        this.wheels.push(new Wheel());
        this.wheels.push(new Wheel());
        // агрегация
        this.freshener = freshener;
        console.log(this.freshener);
    }
    // делегирование - вызов такого же метода у других объектов/классов внутри одного метода
    Car.prototype.drive = function () {
        this.engine.drive();
        this.wheels.forEach(function (wheel) { return wheel.drive(); });
    };
    return Car;
}());
var car = new Car(new Freshener());
car.drive();
// квартира
var Flat = /** @class */ (function () {
    function Flat(freshener) {
        this.freshener = freshener;
        console.log(this.freshener);
    }
    return Flat;
}());
var flat = new Flat(new Freshener());
//# sourceMappingURL=oop-4-agregate-compose.js.map