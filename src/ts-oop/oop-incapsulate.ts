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
class Rectangle {

	private _width;
	private _height;

	// спец. метод (блок инструкций), который будет вызван при создании объекта (экземпляра класса)
	// this - ссылка (указатель) на текущий объект (контекст), у которого будет вызван метод
	// инициализируем свойства объекта
	constructor(w, h) {
		this.width = w; // вызывает сеттер `width`
		this.height = h;
	}

	// геттер для получения ширины прямоугольника
	public get width() {
		return this._width;
	}

	// сеттер для установки значения ширины прямоугольника
	public set width(value) {
		if (value <= 0) {
			this._width = 1;
		}
		else {
			this._width = value;
		}
	}

	// геттер для получения высоты прямоугольника
	public get height() {
		return this._height;
	}

	// сеттер для установки значения высоты прямоугольника
	public set height(value) {
		// ширина прямоугольника не может быть отрицательной
		if (value <= 0) {
			this._height = 1;
		}
		else {
			this._height = value;
		}
	}

	// метод, который возвращает площадь прямоугольника
	public calcArea() {
		return this.width * this.height; // результат
	}

	// метод, который возвращает периметр прямоугольника
	public calcPerimeter() {
		return (this.width + this.height) * 2; // результат
	}

}

// опратор new - используется для создания нового объекта
const rect = new Rectangle(5, 10);

rect.calcArea(); // вызов метода
const width = rect.width;
//const width = rect._width; // щшибка - свойтво доступно только внутри класса Rectangle

// класс Пользователь
class User {

	private _username;
	private _password;
	private _id;

	constructor(username, password) {
		this.username = username;
		this.password = password;
		this._id = this.generateRandomId();
	}

	public get username() {
		return this._username;
	}

	public set username(value) {
		this._username = value;
	}

	public get password() {
		return this._password;
	}

	public set password(value) {
		this._password = value;
	}

	public get id() {
		return this._id;
	}

	public generateRandomId() {
		return Math.random();
	}

}

// опратор new - используется для создания нового объекта
const user = new User('Ulbi', 'Timur');
//user.id = 5; // нельзя изменить свойство только для чтения (отсутствует сеттер)
user.username = 5; // изменение имени пользователя с помощью сеттера

// класс Базы данных
class Database {

	private _url;
	private _port;
	private _username;
	private _password;
	private _tables;

	constructor(url, port, username, password) {
		this._url = url;
		this._port = port;
		this._username = username;
		this._password = password;
		this._tables = [];
	}

	// Геттеры для свойств класса

	public get url() {
		return this._url;
	}

	public get port() {
		return this._port;
	}

	public get username() {
		return this._username;
	}

	public get password() {
		return this._password;
	}

	// добавляет новую таблицу в список таблиц
	public createNewtable(table) {
		return this._tables.push(table);
	}

	// очищает список таблиц
	public clearTables() {
		return this._tables = [];
	}

}

const db = new Database(1, 2, 3, 4); // создаем объект (подключение к бд)
// добавляем новые таблицы
db.createNewtable({ name: 'roles' });
db.createNewtable({ name: 'users' });
db.clearTables();
