declare class Rectangle2 {
    private _width;
    private _height;
    constructor(w: any, h: any);
    get width(): any;
    set width(value: any);
    get height(): any;
    set height(value: any);
    calcArea(): number;
    calcPerimeter(): number;
}
declare const rect: Rectangle2;
declare const width2: any;
declare class User {
    private _username;
    private _password;
    private _id;
    private _age;
    constructor(username: any, password: any, age: any);
    get username(): any;
    set username(value: any);
    get password(): any;
    set password(value: any);
    get id(): any;
    get age(): any;
    set age(value: any);
    generateRandomId(): number;
}
declare const user: User;
declare class Database {
    private _url;
    private _port;
    private _username;
    private _password;
    private _tables;
    constructor(url: any, port: any, username: any, password: any);
    get url(): any;
    get port(): any;
    get username(): any;
    get password(): any;
    createNewtable(table: any): any;
    clearTables(): never[];
}
declare const db: Database;
