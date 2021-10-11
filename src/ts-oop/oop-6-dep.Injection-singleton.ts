// Комбинируя все принципы и подходы, которые мы рассмотрели ранее (наследование, интерфейсы, полиморфизм, инкапсуляция), можно разрабатывать очень гибкие, масштабируемые приложения
// На основе всех этих принципов строятся такие принципы, как S.O.L.I.D., большое количество паттернов проектирования, которые предназначены практически на любой случай жизни

// Рассмотрим такие наиболее расспространенные паттерны, как Dependency Injection (Внедрение зависимостей) и Singleton (Одиночка)

// 6.1. Dependency Injection (Внедрение зависимостей)

// Суть данного паттерна заключается в разделении приложения на части (некоторые слои), которые потом внедряются друг в друга последовательно слой за слоем

// Например самое простое приложение может состоять из следующих слоев:

// Слой 1. Работа с базой данных - отвечает за логику работы с БД: получить какие-то данные, записать, обновить, удалить
// Данный слой имеет 2 реализации: MongoRepository и MySqlRepository (работа с MongoDb и MySqlDb)

// Слой 2. Бизнес-логика - сервисный слой (клиентская часть): например, работа с репозиторием
// Мы работаем либо с одной БД, либо с другой (MongoRepository | MySqlRepository)
// Стоит задача, какой из репозиториев использовать (в идеале, сервисный слой вообще не должен знать, какой из репозиториев он используем - для него это не важно)
// У него есть некоторый интерфейс, к которому он обращается, получет какие-то данный из репозиторного слоя и все (ему не важно знать с какой из БД именно он работает: Mongo, MySql, Postgres и тд)
// Мы работаем с некоторым интерфейсом Repository, а реализацию (имплементацию Mongo или MySql) этого репозиторию мы определяю где-то снаружи, например на уровне конфигурации
// Таким образом, чтобы поменять одну имплементацию на другую, нам не надо менять сервисный слой - достаточно подправить конфигурацию

// Работа с БД

interface I_UserRepo {

	getUsers(): User[];
	//create(user: User): User;
	//get(): User;
	//update(user: User): User;
	//delete(user: User): User;

}

class UserMongoDbRepo implements I_UserRepo {

	public getUsers(): User[] {
		console.log('Используем подключение к монго и получаем пользователей');
		return [new User('Пользователь из Монго БД', 123, 15)];
	}

}

class UserPostgresDbRepo implements I_UserRepo {

	public getUsers(): User[] {
		console.log('Используем подключение к Postgres и получаем пользователей');
		return [new User('Пользователь из Postgres БД', 123, 15)];
	}

}

// Клиент

class UserService {

	private _userRepo: I_UserRepo; // в качестве типа указывается не конкретный класс/имплементация, а сам интерфейс (общий тип)

	// инициализируем репозиторий через конструктор - агрегация
	constructor(userRepo: I_UserRepo) {
		this._userRepo = userRepo;
	}

	public get userRepo(): I_UserRepo {
		return this._userRepo;
	}

	public filterUserByAge(age: number): User[] {
		const users = this.userRepo.getUsers(),
			usersFiltered = users.filter(user => user.age === age);
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

	private _url: number = 0;
	private static instance: Database2; // хранит экземпляр класса

	constructor() {
		// если поле instance проинициализировано (в нем что-то находится), возвращаем его, иначе инициализируем
		if (Database2.instance) {
			return Database2.instance;
		}
		this._url = Math.random();
		Database2.instance = this;
	}

	public get url(): number {
		return this._url;
	}

}

const db1 = new Database2(),
	db2 = new Database2();

console.log(db1.url);
console.log(db2.url);
