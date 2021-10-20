export {};
export declare class User {
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
