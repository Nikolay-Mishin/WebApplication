// ООП построено на 3 основных концепциях: Инкапсуляция, Наследование и Полиморфизм

// 2. Наследование

// https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Operators/super
// https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Classes/static
// https://learn.javascript.ru/es-object
// https://learn.javascript.ru/class

// Наследование - это механизм расширения функционала (свойств/методов) класса-родителя (parent), путем наследования (перенимания/получения) публичных (public) и наследуемых (protected) свойств и методов класса-родителя и добавления новых свойств/методов в классе-потомке (children)
// Данный механизм позволяет очень эффективно переиспользовать код, масштабировать и поддерживать его
// Наследование осуществляется с помощью ключевого слова `extends` после имени класса и указания имени класса-родителя после ключего слова
// У класса может быть только 1 класс-родитель

// constructor - если не объявлен конструктор класса, то он наследуется по умолчанию от класса-родителя
// super - метод, который вызывает конструктор класса-родителя, с целью не затереть его (переопределить)
// super([arguments]); // вызов родительского конструктора.
// super.functionOnParent([arguments]); // вызов родительского метода `functionOnParent`.
// super.propertyOnParent; // обращение к родительскому свойству.
// super должен быть вызван первым!
// методы и свойства дочернего класса, объявленные с теми же именами, что и у класса-родителя, переопределяют (перезаписывают/затирают) их

// базовый класс
class Person {

	private _firstName;
	private _lastName;
	private _age;

	// инициализируем свойства в конструкторе класса
	constructor(firstName, lastName, age) {
		this.firstName = firstName;
		this.lastName = lastName;
		this.age = age;
	}

	// для каждого поля создаем геттеры и сеттеры

	public get firstName() {
		return this._firstName;
	}

	public set firstName(value) {
		this._firstName = value;
	}

	public get lastName() {
		return this._lastName;
	}

	public set lastName(value) {
		this._lastName = value;
	}

	public get age() {
		return this._age;
	}

	public set age(value) {
		if (value <= 0) {
			this._age = 0;
		}
		else {
			this._age = value;
		}
	}

	// метод отдает полное имя
	public get fullName() {
		return `Фамилия - ${this.lastName} Имя - ${this.firstName}`;
	}

	// метод выводит в лог приветствие
	public greeting() {
		console.log(`Привет я человек и меня зовут ${this.firstName}`);
	}

}

const person = new Person('Person', 'TV', 15);
console.log(person);

// класс Работник - наследует класс Person (класс-родитель)
class Employee extends Person {

	private _inn;
	private _passport;
	private _snils;

	// инициализируем свойства в конструкторе класса=
	constructor(firstName, lastName, age, inn, passport, snils) {
		super(firstName, lastName, age); // вызываем конструктор класса-родителя, чтобы его не затереть (переопределить)
		this.inn = inn;
		this.passport = passport;
		this.snils = snils;
	}

	public get inn() {
		return this._inn;
	}

	public set inn(value) {
		this._inn = value;
	}

	public get passport() {
		return this._passport;
	}

	public set passport(value) {
		this._passport = value;
	}

	public get snils() {
		return this._snils;
	}

	public set snils(value) {
		this._snils = value;
	}

	// переопределяем родительский метод приветствия
	public greeting() {
		console.log(`Привет я работник и меня зовут ${this.firstName}`);
	}

}

const employee = new Employee('Employee', 'TV', 15, 15, 15, 15);
console.log(employee);

class Developer extends Employee {

	private _level;
	private _language;

	constructor(firstName, lastName, age, inn, passport, snils, level, language) {
		super(firstName, lastName, age, inn, passport, snils); // вызываем родительский конструктор
		this.level = level;
		this.language = language;
	}

	public get level() {
		return this._level;
	}

	public set level(value) {
		this._level = value;
	}

	public get language() {
		return this._language;
	}

	public set language(value) {
		this._language = value;
	}

	public greeting() {
		console.log(`Привет я разработчик и меня зовут ${this.firstName}`);
	}

}

const UlbiTv = new Developer('Ulbi', 'TV', 15, 15, 15, 15, 'Senior', 'JavaScript');

console.log(UlbiTv);
console.log(UlbiTv.fullName); // используем геттер родительского класс
