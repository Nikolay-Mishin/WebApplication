interface IClient {
    url: string;
    connect(url: string): void;
    read(url: string): string;
    write(data: string): void;
}
declare abstract class Client implements IClient {
    url: string;
    abstract data: string;
    constructor(url: string);
    connect(url: string): void;
    abstract read(url: string): string;
    abstract write(data: string): void;
}
declare class ClientChild extends Client {
    data: string;
    constructor(url: string, data: string);
    connect(url: string): void;
    read(url: string): string;
    write(data: string): void;
}
interface IReader {
    read(url: string): string;
}
interface IWriter {
    write(data: string): void;
}
interface IFileReader extends IReader {
    read(data: string): string;
}
declare class FileClient implements IReader, IWriter {
    read(url: string): string;
    write(data: string): void;
}
declare class HttpClient implements IReader, IWriter {
    read(url: string): string;
    write(data: string): void;
}
interface IRepository<T> {
    create(obj: T): T;
    get(): T;
    update(obj: T): T;
    delete(obj: T): T;
}
declare class UserRepo implements IRepository<User> {
    create(user: User): User;
    get(): User;
    update(user: User): User;
    delete(user: User): User;
}
declare class CarRepo implements IRepository<Car> {
    create(car: Car): Car;
    get(): Car;
    update(car: Car): Car;
    delete(car: Car): Car;
}
