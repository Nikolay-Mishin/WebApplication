// Помимо наследования есть еще несколько способов взаимодействия между классами: композиция и агрегация
// 4.1. Композиция
// Суть композиции заключается в том, что внутри класса используются объекты другого класса, которые создаются (инициализируются) внутри этого класса и не могут существовать отдельно (вне этого класса), как самостоятельные элементы
// Например, у нас есть класс Автомобиль, внутри которого используется объект двигателя и массив из 4 колес, которые инициализируются в данном классе и не могут функционировать самостоятельно (отдельно/вне класса)
// 4.2. Агрегация
// Отличие агрегации от композиции заключается в том, что при данном подходе в класс передаются объекты других классов передаются извне через параметры конструктора, те в отличии от композиции эти объекты являются самостоятельными сущностями (не зависят от данного класса) и могут использоваться, как отдельно от данного класса, так и в других классах
// Например, у автомобиля есть объект Елочка-освежитель, которая может существовать как в автомобиле, так и в квартире или человек может носить в качестве аксессуара и тд
// двигатель
class Engine {
    drive() {
        console.log('Двигатель работает');
    }
}
// колесо
class Wheel {
    drive() {
        console.log('Колеса едут');
    }
}
// освежитель
export class Freshener {
}
export class Car {
    constructor(freshener) {
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
    drive() {
        this.engine.drive();
        this.wheels.forEach(wheel => wheel.drive());
    }
}
const car = new Car(new Freshener());
car.drive();
// квартира
class Flat {
    constructor(freshener) {
        this.freshener = freshener;
        console.log(this.freshener);
    }
}
export const flat = new Flat(new Freshener());
//# sourceMappingURL=oop-4-agregate-compose.js.map