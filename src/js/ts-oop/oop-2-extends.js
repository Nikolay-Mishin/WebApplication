"use strict";
// ООП построено на 3 основных концепциях: Инкапсуляция, Наследование и Полиморфизм
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// 2. Наследование
// https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Operators/super
// https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Classes/static
// https://learn.javascript.ru/es-object
// https://learn.javascript.ru/class
// Наследование - это механизм расширения функционала (свойств/методов) класса-родителя (parent), путем наследования (перенимания/получения) публичных (public) и наследуемых (protected) свойств и методов класса-родителя и добавления новых свойств/методов в классе-потомке (children)
// Данный механизм позволяет очень эффективно переиспользовать код, масштабировать и поддерживать его
// Наследование осуществляется с помощью ключевого слова `extends` после имени класса и указания имени класса-родителя после ключего слова
// У класса может быть только 1 класс-родитель
// constructor - если не объявлен конструктор класса, то он наследуется по умолчанию от класса-родителя
// super - метод, который вызывает конструктор класса-родителя, с целью не затереть его (переопределить)
// super([arguments]); // вызов родительского конструктора.
// super.functionOnParent([arguments]); // вызов родительского метода `functionOnParent`.
// super.propertyOnParent; // обращение к родительскому свойству.
// super должен быть вызван первым!
// методы и свойства дочернего класса, объявленные с теми же именами, что и у класса-родителя, переопределяют (перезаписывают/затирают) их
// базовый класс
var Person = /** @class */ (function () {
    // инициализируем свойства в конструкторе класса
    function Person(firstName, lastName, age) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
    }
    Object.defineProperty(Person.prototype, "firstName", {
        // для каждого поля создаем геттеры и сеттеры
        get: function () {
            return this._firstName;
        },
        set: function (value) {
            this._firstName = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Person.prototype, "lastName", {
        get: function () {
            return this._lastName;
        },
        set: function (value) {
            this._lastName = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Person.prototype, "age", {
        get: function () {
            return this._age;
        },
        set: function (value) {
            if (value <= 0) {
                this._age = 0;
            }
            else {
                this._age = value;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Person.prototype, "fullName", {
        // метод отдает полное имя
        get: function () {
            return "\u0424\u0430\u043C\u0438\u043B\u0438\u044F - " + this.lastName + " \u0418\u043C\u044F - " + this.firstName;
        },
        enumerable: false,
        configurable: true
    });
    // метод выводит в лог приветствие
    Person.prototype.greeting = function () {
        console.log("\u041F\u0440\u0438\u0432\u0435\u0442 \u044F \u0447\u0435\u043B\u043E\u0432\u0435\u043A \u0438 \u043C\u0435\u043D\u044F \u0437\u043E\u0432\u0443\u0442 " + this.firstName);
    };
    return Person;
}());
var person = new Person('Person', 'TV', 15);
console.log(person);
// класс Работник - наследует класс Person (класс-родитель)
var Employee = /** @class */ (function (_super) {
    __extends(Employee, _super);
    // инициализируем свойства в конструкторе класса=
    function Employee(firstName, lastName, age, inn, passport, snils) {
        var _this = _super.call(this, firstName, lastName, age) || this;
        _this.inn = inn;
        _this.passport = passport;
        _this.snils = snils;
        return _this;
    }
    Object.defineProperty(Employee.prototype, "inn", {
        get: function () {
            return this._inn;
        },
        set: function (value) {
            this._inn = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Employee.prototype, "passport", {
        get: function () {
            return this._passport;
        },
        set: function (value) {
            this._passport = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Employee.prototype, "snils", {
        get: function () {
            return this._snils;
        },
        set: function (value) {
            this._snils = value;
        },
        enumerable: false,
        configurable: true
    });
    // переопределяем родительский метод приветствия
    Employee.prototype.greeting = function () {
        console.log("\u041F\u0440\u0438\u0432\u0435\u0442 \u044F \u0440\u0430\u0431\u043E\u0442\u043D\u0438\u043A \u0438 \u043C\u0435\u043D\u044F \u0437\u043E\u0432\u0443\u0442 " + this.firstName);
    };
    return Employee;
}(Person));
var employee = new Employee('Employee', 'TV', 15, 15, 15, 15);
console.log(employee);
var Developer = /** @class */ (function (_super) {
    __extends(Developer, _super);
    function Developer(firstName, lastName, age, inn, passport, snils, level, language) {
        var _this = _super.call(this, firstName, lastName, age, inn, passport, snils) || this;
        _this.level = level;
        _this.language = language;
        return _this;
    }
    Object.defineProperty(Developer.prototype, "level", {
        get: function () {
            return this._level;
        },
        set: function (value) {
            this._level = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Developer.prototype, "language", {
        get: function () {
            return this._language;
        },
        set: function (value) {
            this._language = value;
        },
        enumerable: false,
        configurable: true
    });
    Developer.prototype.greeting = function () {
        console.log("\u041F\u0440\u0438\u0432\u0435\u0442 \u044F \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u0447\u0438\u043A \u0438 \u043C\u0435\u043D\u044F \u0437\u043E\u0432\u0443\u0442 " + this.firstName);
    };
    return Developer;
}(Employee));
var UlbiTv = new Developer('Ulbi', 'TV', 15, 15, 15, 15, 'Senior', 'JavaScript');
console.log(UlbiTv);
console.log(UlbiTv.fullName); // используем геттер родительского класс
//# sourceMappingURL=oop-2-extends.js.map