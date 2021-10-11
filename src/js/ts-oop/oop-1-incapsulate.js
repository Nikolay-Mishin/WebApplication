"use strict";
// ООП построено на 3 основных концепциях: Инкапсуляция, Наследование и Полиморфизм
// 1. Инкапсуляция и сокрытие
// Инкапсуляция - сам класс является своего рода капсулой, которая содержит в себе свойства и методы для работы с этими свойствами, те она позволяет их объединить
// Сокрытие - свойства делаются закрытими с помощью модификаторов доступа (protected или private).
// Доступ к таким свойствам осуществляется с помощью специальных методов (get/set - геттеров/сеттеров).
// У каждого свойства и метода есть модификаторы доступа (public, protected и private)
// Если явно не указан модификатор доступа, то по умолчанию он является `public`, но хорошей практикой является указывать модификаторы доступа явно
// public - свойство/метод доступны вне класса (из любой части приложения)
// protected - доступ к свойствам/методам осществляется внутри самого класса и в классах-потомках (наследниках)
// private - доступ к свойствам/методам имеется только внутри самого класса
// Геттеры позволяют получать значения свойств
// Сеттеры позволяют устанавливать значения свойств
// класс Прямоугольник
var Rectangle2 = /** @class */ (function () {
    // спец. метод (блок инструкций), который будет вызван при создании объекта (экземпляра класса)
    // this - ссылка (указатель) на текущий объект (контекст), у которого будет вызван метод
    // инициализируем свойства объекта
    function Rectangle2(w, h) {
        this.width = w; // вызывает сеттер `width`
        this.height = h;
    }
    Object.defineProperty(Rectangle2.prototype, "width", {
        // геттер для получения ширины прямоугольника
        get: function () {
            return this._width;
        },
        // сеттер для установки значения ширины прямоугольника
        set: function (value) {
            if (value <= 0) {
                this._width = 1;
            }
            else {
                this._width = value;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rectangle2.prototype, "height", {
        // геттер для получения высоты прямоугольника
        get: function () {
            return this._height;
        },
        // сеттер для установки значения высоты прямоугольника
        set: function (value) {
            // ширина прямоугольника не может быть отрицательной
            if (value <= 0) {
                this._height = 1;
            }
            else {
                this._height = value;
            }
        },
        enumerable: false,
        configurable: true
    });
    // метод, который возвращает площадь прямоугольника
    Rectangle2.prototype.calcArea = function () {
        return this.width * this.height; // результат
    };
    // метод, который возвращает периметр прямоугольника
    Rectangle2.prototype.calcPerimeter = function () {
        return (this.width + this.height) * 2; // результат
    };
    return Rectangle2;
}());
// оператор new - используется для создания нового объекта
var rect = new Rectangle2(5, 10);
rect.calcArea(); // вызов метода
var width2 = rect.width;
//const width2 = rect._width; // ошибка - свойтво доступно только внутри класса Rectangle
// класс Пользователь
var User = /** @class */ (function () {
    function User(username, password, age) {
        this.username = username;
        this.password = password;
        this._id = this.generateRandomId();
        this.age = age;
    }
    Object.defineProperty(User.prototype, "username", {
        get: function () {
            return this._username;
        },
        set: function (value) {
            this._username = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(User.prototype, "password", {
        get: function () {
            return this._password;
        },
        set: function (value) {
            this._password = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(User.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(User.prototype, "age", {
        get: function () {
            return this._age;
        },
        set: function (value) {
            this._age = value;
        },
        enumerable: false,
        configurable: true
    });
    User.prototype.generateRandomId = function () {
        return Math.random();
    };
    return User;
}());
// опратор new - используется для создания нового объекта
var user = new User('Ulbi', 'Timur', 15);
//user.id = 5; // нельзя изменить свойство только для чтения (отсутствует сеттер)
user.username = 5; // изменение имени пользователя с помощью сеттера
// класс Базы данных
var Database = /** @class */ (function () {
    function Database(url, port, username, password) {
        this._url = url;
        this._port = port;
        this._username = username;
        this._password = password;
        this._tables = [];
    }
    Object.defineProperty(Database.prototype, "url", {
        // Геттеры для свойств класса
        get: function () {
            return this._url;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Database.prototype, "port", {
        get: function () {
            return this._port;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Database.prototype, "username", {
        get: function () {
            return this._username;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Database.prototype, "password", {
        get: function () {
            return this._password;
        },
        enumerable: false,
        configurable: true
    });
    // добавляет новую таблицу в список таблиц
    Database.prototype.createNewtable = function (table) {
        return this._tables.push(table);
    };
    // очищает список таблиц
    Database.prototype.clearTables = function () {
        return this._tables = [];
    };
    return Database;
}());
var db = new Database(1, 2, 3, 4); // создаем объект (подключение к бд)
// добавляем новые таблицы
db.createNewtable({ name: 'roles' });
db.createNewtable({ name: 'users' });
db.clearTables();
//# sourceMappingURL=oop-1-incapsulate.js.map