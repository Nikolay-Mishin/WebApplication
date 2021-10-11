declare class Person {
    private _firstName;
    private _lastName;
    private _age;
    constructor(firstName: any, lastName: any, age: any);
    get firstName(): any;
    set firstName(value: any);
    get lastName(): any;
    set lastName(value: any);
    get age(): any;
    set age(value: any);
    get fullName(): string;
    greeting(): void;
}
declare const person: Person;
declare class Employee extends Person {
    private _inn;
    private _passport;
    private _snils;
    constructor(firstName: any, lastName: any, age: any, inn: any, passport: any, snils: any);
    get inn(): any;
    set inn(value: any);
    get passport(): any;
    set passport(value: any);
    get snils(): any;
    set snils(value: any);
    greeting(): void;
}
declare const employee: Employee;
declare class Developer extends Employee {
    private _level;
    private _language;
    constructor(firstName: any, lastName: any, age: any, inn: any, passport: any, snils: any, level: any, language: any);
    get level(): any;
    set level(value: any);
    get language(): any;
    set language(value: any);
    greeting(): void;
}
declare const UlbiTv: Developer;
