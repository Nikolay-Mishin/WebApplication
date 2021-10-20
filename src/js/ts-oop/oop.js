// Классы. Объекты. Свойства. Методы. Конструктор
// Класс - набор (описание) характеристик (свойств) и действий (методов), описывающих определенную сущность (объект)
// Объект - экземпляр класса, характеризующийся конкертными значениями свойств
// Класс может включать столько свойств и методов, сколько потребуется
// Хорошей практикой является делать классы под конкретные задачи
// класс Прямоугольник
export class Rectangle {
    // спец. метод (блок инструкций), который будет вызван при создании объекта (экземпляра класса)
    // this - ссылка (указатель) на текущий объект (контекст), у которого будет вызван метод
    // инициализируем свойства объекта
    constructor(w, h) {
        this.width = w;
        this.height = h;
    }
    // метод, который возвращает площадь прямоугольника
    calcArea() {
        return this.width * this.height; // результат
    }
    // метод, который возвращает периметр прямоугольника
    calcPerimeter() {
        return (this.width + this.height) * 2; // результат
    }
}
// оператор `new` - используется для создания нового объекта
export const rect1 = new Rectangle(5, 10), rect2 = new Rectangle(52, 102), rect3 = new Rectangle(10, 102);
rect1.calcArea(); // вызов метода
//# sourceMappingURL=oop.js.map