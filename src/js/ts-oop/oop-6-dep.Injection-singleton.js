"use strict";
// Комбинируя все принципы и подходы, которые мы рассмотрели ранее (наследование, интерфейсы, полиморфизм, инкапсуляция), можно разрабатывать очень гибкие, масштабируемые приложения
// На основе всех этих принципов строятся такие принципы, как S.O.L.I.D., большое количество паттернов проектирования, которые предназначены практически на любой случай жизни
var UserMongoDbRepo = /** @class */ (function () {
    function UserMongoDbRepo() {
    }
    UserMongoDbRepo.prototype.getUsers = function () {
        console.log('Используем подключение к монго и получаем пользователей');
        return [new User('Пользователь из Монго БД', 123, 15)];
    };
    return UserMongoDbRepo;
}());
var UserPostgresDbRepo = /** @class */ (function () {
    function UserPostgresDbRepo() {
    }
    UserPostgresDbRepo.prototype.getUsers = function () {
        console.log('Используем подключение к Postgres и получаем пользователей');
        return [new User('Пользователь из Postgres БД', 123, 15)];
    };
    return UserPostgresDbRepo;
}());
// Клиент
var UserService = /** @class */ (function () {
    // инициализируем репозиторий через конструктор - агрегация
    function UserService(userRepo) {
        this._userRepo = userRepo;
    }
    Object.defineProperty(UserService.prototype, "userRepo", {
        get: function () {
            return this._userRepo;
        },
        enumerable: false,
        configurable: true
    });
    UserService.prototype.filterUserByAge = function (age) {
        var users = this.userRepo.getUsers(), usersFiltered = users.filter(function (user) { return user.age === age; });
        return usersFiltered;
    };
    return UserService;
}());
var userService = new UserService(new UserMongoDbRepo());
userService.filterUserByAge(15);
// 6.2. Singleton (Одиночка)
// Позволяет создавать 1 единственный экземпляр данного класса
// static - указывает на то, что данное свойство/метод принадлежит классу, а не объекту, и его можно использовать без обращения к объекту, используя обращение через класс
// Class.property | Class.method()
var Database2 = /** @class */ (function () {
    function Database2() {
        this._url = 0;
        // если поле instance проинициализировано (в нем что-то находится), возвращаем его, иначе инициализируем
        if (Database2.instance) {
            return Database2.instance;
        }
        this._url = Math.random();
        Database2.instance = this;
    }
    Object.defineProperty(Database2.prototype, "url", {
        get: function () {
            return this._url;
        },
        enumerable: false,
        configurable: true
    });
    return Database2;
}());
var db1 = new Database2(), db2 = new Database2();
console.log(db1.url);
console.log(db2.url);
//# sourceMappingURL=oop-6-dep.injection-singleton.js.map