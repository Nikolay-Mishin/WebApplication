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
class Rectangle2 {
    // спец. метод (блок инструкций), который будет вызван при создании объекта (экземпляра класса)
    // this - ссылка (указатель) на текущий объект (контекст), у которого будет вызван метод
    // инициализируем свойства объекта
    constructor(w, h) {
        this.width = w; // вызывает сеттер `width`
        this.height = h;
    }
    // геттер для получения ширины прямоугольника
    get width() {
        return this._width;
    }
    // сеттер для установки значения ширины прямоугольника
    set width(value) {
        if (value <= 0) {
            this._width = 1;
        }
        else {
            this._width = value;
        }
    }
    // геттер для получения высоты прямоугольника
    get height() {
        return this._height;
    }
    // сеттер для установки значения высоты прямоугольника
    set height(value) {
        // ширина прямоугольника не может быть отрицательной
        if (value <= 0) {
            this._height = 1;
        }
        else {
            this._height = value;
        }
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
// оператор new - используется для создания нового объекта
const rect = new Rectangle2(5, 10);
rect.calcArea(); // вызов метода
const width2 = rect.width;
//const width2 = rect._width; // ошибка - свойтво доступно только внутри класса Rectangle
console.log(width2);
// класс Пользователь
export class User {
    constructor(username, password, age) {
        this.username = username;
        this.password = password;
        this._id = this.generateRandomId();
        this.age = age;
    }
    get username() {
        return this._username;
    }
    set username(value) {
        this._username = value;
    }
    get password() {
        return this._password;
    }
    set password(value) {
        this._password = value;
    }
    get id() {
        return this._id;
    }
    get age() {
        return this._age;
    }
    set age(value) {
        this._age = value;
    }
    generateRandomId() {
        return Math.random();
    }
}
// опратор new - используется для создания нового объекта
const user = new User('Ulbi', 'Timur', 15);
//user.id = 5; // нельзя изменить свойство только для чтения (отсутствует сеттер)
user.username = 5; // изменение имени пользователя с помощью сеттера
// класс Базы данных
class Database {
    constructor(url, port, username, password) {
        this._url = url;
        this._port = port;
        this._username = username;
        this._password = password;
        this._tables = [];
    }
    // Геттеры для свойств класса
    get url() {
        return this._url;
    }
    get port() {
        return this._port;
    }
    get username() {
        return this._username;
    }
    get password() {
        return this._password;
    }
    // добавляет новую таблицу в список таблиц
    createNewtable(table) {
        return this._tables.push(table);
    }
    // очищает список таблиц
    clearTables() {
        return this._tables = [];
    }
}
const db = new Database(1, 2, 3, 4); // создаем объект (подключение к бд)
// добавляем новые таблицы
db.createNewtable({ name: 'roles' });
db.createNewtable({ name: 'users' });
db.clearTables();
//# sourceMappingURL=oop-1-incapsulate.js.map