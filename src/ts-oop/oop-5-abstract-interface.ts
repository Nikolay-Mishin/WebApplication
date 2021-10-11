// Абстрактные классы и интерейсы

// 5.1. Интерфейсы

// Интерфейс - это описание свойств и методов без реализации (что принимают и что возвращают - с указанием типов)

// На этапе проектирования создается некоторый интерфейс, в котором определяем, какие должны быть публичные свойства и методы
// Потом, уже подстраиваясь под этот интерфейс, мы реализуем некоторые классы на основе этого интерфейса

// Из интерфейса нельзя сделать объект
// const client = new Client() - вызовет ошибку
// Также в объявлении свойств/методов нельзя использовать модификаторы доступа, как в классе
// Имплементация (наследование) интерфейса происходит с помощью ключего слова `implements`, после которого указывается имя интерфейса
// Класс может имплеминтировать неограниченного число интерфейсов в отличии от наследования
// Класс, использующий интерфейс, должен содержать все свойства и реализовывать все методы указанного интерфейса
// Все свойства и методы объявленные в интерфейсе могут иметь модификатор доступа только `public` в имплементирующем его классе
// Несколько классов могут иметь один общий интерфейс, но при этом каждый класс будет иметь свою уникальную реализацию указанных в интерфейсе методов
// Один интерфейс может наследовать другой, при этом может быть только 1 интерфейс-родитель, как и при наследовании классов
// Интерфейс не может имплементировать другие интерфейсы, тк данная операция подразумевает необдимость реализации всех методов имплементируемого интерфейса, что возможно только в классе

interface I_Client {

	url: string;

	connect(url: string): void;
	read(url: string): string;
	write(data: string): void;

}

// 5.2. Абстрактные классы

// Абстрактный класс - отличием от интерфейсов является то, что можно создавать обычные методы с реализацией, при этом методы без реализации имеют модификатор `abstract`
// У абстракных свойств/методов, также как и у интерфейсов, нельзя использовать модификаторы доступа при объявлении
// Все абстрактные методы должны быть реализованы в классе-наследнике
// Абстрактные свойства и методы, также могут иметь только модификатор доступа `public` при реализации в дочернем классе

abstract class Client implements I_Client {

	public url: string;
	abstract data: string;

	constructor(url: string) {
		this.url = url;
	}

	// обычный метод с реализацией
	public connect(url: string): void {
		// реализация метода
		console.log(url);
	}

	// абстрактные методы не имеют реализации

	abstract read(url: string): string;
	abstract write(data: string): void;

}

class ClientChild extends Client {

	public data: string;

	constructor(url: string, data: string) {
		super(url);
		this.data = data;
	}

	public connect(url: string): void {
		// реализация метода
		console.log(url);
	}

	public read(url: string): string {
		// реализация метода
		return url;
	}

	public write(data: string): void {
		// реализация метода
		console.log(data);
	}

}

// Пример 1

interface IReader {

	read(url: string): string;

}

interface IWriter {

	write(data: string): void;

}

// наследование интерфейса
interface IFileReader extends IReader {

	read(data: string): string;

}

class FileClient implements IReader, IWriter {

	public read(url: string): string {
		// реализация для файла
		return url;
	}

	public write(data: string): void {
		// реализация для файла
		console.log(data);
	}
}

class HttpClient implements IReader, IWriter {

	public read(url: string): string {
		// реализация для Http
		return url;
	}

	public write(data: string): void {
		// реализация для Http
		console.log(data);
	}
}

// Пример 2

// тк мы не можем явно указать в качестве получаемого типа User (репозиторий предназначен для работы с различными сущностями - не только User: Book, Car и тд), мы объявляем Дженерик (обобщение) - тип <Type>, который будет применяться ко всме сущностям
// В качестве Type указывается тип, который приходит извне и заранее неизвестен явно
interface IRepository<T> {

	// CRUD
	// create: (obj: T) => T; // альтернативный способ обявления метода в интерфейсе
	create(obj: T): T;
	get(): T;
	update(obj: T): T;
	delete(obj: T): T;

}

// в качестве типа Дженерика Repository указываем тип User2
class UserRepo implements IRepository<User> {

	public create(user: User): User {
		//return database.query(INSERT ...); // запрос к БД
		return user;
	}

	public get(): User {
		return new User('Ulbi', 123, 15);
	}

	public update(user: User): User {
		return user;
	}

	public delete(user: User): User {
		return user;
	}

}

class CarRepo implements IRepository<Car> {

	public create(car: Car): Car {
		return car;
	}

	public get(): Car {
		return new Car(new Freshener());
	}

	public update(car: Car): Car {
		return car;
	}

	public delete(car: Car): Car {
		return car;
	}

}
