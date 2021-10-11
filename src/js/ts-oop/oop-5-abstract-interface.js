"use strict";
// Абстрактные классы и интерейсы
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
// 5.2. Абстрактные классы
// Абстрактный класс - отличием от интерфейсов является то, что можно создавать обычные методы с реализацией, при этом методы без реализации имеют модификатор `abstract`
// У абстракных свойств/методов, также как и у интерфейсов, нельзя использовать модификаторы доступа при объявлении
// Все абстрактные методы должны быть реализованы в классе-наследнике
// Абстрактные свойства и методы, также могут иметь только модификатор доступа `public` при реализации в дочернем классе
var Client = /** @class */ (function () {
    function Client(url) {
        this.url = url;
    }
    // обычный метод с реализацией
    Client.prototype.connect = function (url) {
        // реализация метода
        console.log(url);
    };
    return Client;
}());
var ClientChild = /** @class */ (function (_super) {
    __extends(ClientChild, _super);
    function ClientChild(url, data) {
        var _this = _super.call(this, url) || this;
        _this.data = data;
        return _this;
    }
    ClientChild.prototype.connect = function (url) {
        // реализация метода
        console.log(url);
    };
    ClientChild.prototype.read = function (url) {
        // реализация метода
        return url;
    };
    ClientChild.prototype.write = function (data) {
        // реализация метода
        console.log(data);
    };
    return ClientChild;
}(Client));
var FileClient = /** @class */ (function () {
    function FileClient() {
    }
    FileClient.prototype.read = function (url) {
        // реализация для файла
        return url;
    };
    FileClient.prototype.write = function (data) {
        // реализация для файла
        console.log(data);
    };
    return FileClient;
}());
var HttpClient = /** @class */ (function () {
    function HttpClient() {
    }
    HttpClient.prototype.read = function (url) {
        // реализация для Http
        return url;
    };
    HttpClient.prototype.write = function (data) {
        // реализация для Http
        console.log(data);
    };
    return HttpClient;
}());
// в качестве типа Дженерика Repository указываем тип User2
var UserRepo = /** @class */ (function () {
    function UserRepo() {
    }
    UserRepo.prototype.create = function (user) {
        //return database.query(INSERT ...); // запрос к БД
        return user;
    };
    UserRepo.prototype.get = function () {
        return new User('Ulbi', 123, 15);
    };
    UserRepo.prototype.update = function (user) {
        return user;
    };
    UserRepo.prototype.delete = function (user) {
        return user;
    };
    return UserRepo;
}());
var CarRepo = /** @class */ (function () {
    function CarRepo() {
    }
    CarRepo.prototype.create = function (car) {
        return car;
    };
    CarRepo.prototype.get = function () {
        return new Car(new Freshener());
    };
    CarRepo.prototype.update = function (car) {
        return car;
    };
    CarRepo.prototype.delete = function (car) {
        return car;
    };
    return CarRepo;
}());
//# sourceMappingURL=oop-5-abstract-interface.js.map