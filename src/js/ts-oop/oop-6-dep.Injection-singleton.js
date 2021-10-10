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
        this.userRepo = userRepo;
    }
    filterUserByAge(age) {
        const users = this.userRepo.getUsers(), usersFiltered = users.filter(user => user.age >= age);
        return usersFiltered;
    }
}
const userService = new UserService(new UserMongoDbRepo());
// 6.2. Singleton (Одиночка)
//
//# sourceMappingURL=oop-6-dep.Injection-singleton.js.map