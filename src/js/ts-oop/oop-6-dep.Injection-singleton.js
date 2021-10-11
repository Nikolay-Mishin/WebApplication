"use strict";
// Комбинируя все принципы и подходы, которые мы рассмотрели ранее (наследование, интерфейсы, полиморфизм, инкапсуляция), можно разрабатывать очень гибкие, масштабируемые приложения
// На основе всех этих принципов строятся такие принципы, как S.O.L.I.D., большое количество паттернов проектирования, которые предназначены практически на любой случай жизни
class UserMongoDbRepo {
    getUsers() {
        console.log('Используем подключение к монго и получаем пользователей');
        return [new User('Пользователь из Монго БД', 123, 15)];
    }
}
class UserPostgresDbRepo {
    getUsers() {
        console.log('Используем подключение к Postgres и получаем пользователей');
        return [new User('Пользователь из Postgres БД', 123, 15)];
    }
}
// Клиент
class UserService {
    // инициализируем репозиторий через конструктор - агрегация
    constructor(userRepo) {
        this._userRepo = userRepo;
    }
    get userRepo() {
        return this._userRepo;
    }
    filterUserByAge(age) {
        const users = this.userRepo.getUsers(), usersFiltered = users.filter(user => user.age === age);
        return usersFiltered;
    }
}
const userService = new UserService(new UserMongoDbRepo());
userService.filterUserByAge(15);
// 6.2. Singleton (Одиночка)
// Позволяет создавать 1 единственный экземпляр данного класса
// static - указывает на то, что данное свойство/метод принадлежит классу, а не объекту, и его можно использовать без обращения к объекту, используя обращение через класс
// Class.property | Class.method()
class Database2 {
    constructor() {
        this._url = 0;
        // если поле instance проинициализировано (в нем что-то находится), возвращаем его, иначе инициализируем
        if (Database2.instance) {
            return Database2.instance;
        }
        this._url = Math.random();
        Database2.instance = this;
    }
    get url() {
        return this._url;
    }
}
const db1 = new Database2(), db2 = new Database2();
console.log(db1.url);
console.log(db2.url);
//# sourceMappingURL=oop-6-dep.injection-singleton.js.map