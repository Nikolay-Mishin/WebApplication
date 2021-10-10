// Абстрактные классы и интерейсы
// 5.2. Абстрактные классы
// Абстрактный класс - отличием от интерфейсов является то, что можно создавать обычные методы с реализацией, при этом методы без реализации имеют модификатор `abstract`
// У абстракных свойств/методов, также как и у интерфейсов, нельзя использовать модификаторы доступа при объявлении
// Все абстрактные методы должны быть реализованы в классе-наследнике
// Абстрактные свойства и методы, также могут иметь только модификатор доступа `public` при реализации в дочернем классе
class Client {
    constructor(url) {
        this.url = url;
    }
    // обычный метод с реализацией
    connect(url) {
        // реализация метода
        console.log(url);
    }
}
class ClientChild extends Client {
    constructor(url, data) {
        super(url);
        this.data = data;
    }
    connect(url) {
        // реализация метода
        console.log(url);
    }
    read(url) {
        // реализация метода
        return url;
    }
    write(data) {
        // реализация метода
        console.log(data);
    }
}
class FileClient {
    read(url) {
        // реализация для файла
        return url;
    }
    write(data) {
        // реализация для файла
        console.log(data);
    }
}
class HttpClient {
    read(url) {
        // реализация для Http
        return url;
    }
    write(data) {
        // реализация для Http
        console.log(data);
    }
}
// в качестве типа Дженерика Repository указываем тип User2
class UserRepo {
    create(user) {
        //return database.query(INSERT ...); // запрос к БД
        return user;
    }
    get() {
        return new User('Ulbi', 123, 15);
    }
    update(user) {
        return user;
    }
    delete(user) {
        return user;
    }
}
class CarRepo {
    create(car) {
        return car;
    }
    get() {
        return new Car(new Freshener());
    }
    update(car) {
        return car;
    }
    delete(car) {
        return car;
    }
}
//# sourceMappingURL=oop-5-abstract-interface.js.map