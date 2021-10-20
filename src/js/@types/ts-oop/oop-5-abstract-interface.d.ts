import { User } from './oop-1-incapsulate';
import { Car } from './oop-4-agregate-compose';
interface IClient {
    url?: string;
    connect?: (url: string) => void;
    read(url: string): string;
    write?(data: string): void;
}
declare abstract class Client implements IClient {
    url: string;
    abstract data: string;
    constructor(url: string);
    connect(url: string): void;
    abstract read(url: string): string;
    abstract write(data: string): void;
}
export declare class ClientChild extends Client {
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
export interface IFileReader extends IReader {
    read(data: string): string;
}
export declare class FileClient implements IReader, IWriter {
    read(url: string): string;
    write(data: string): void;
}
export declare class HttpClient implements IReader, IWriter {
    read(url: string): string;
    write(data: string): void;
}
interface IRepository<T> {
    create(obj: T): T;
    get(): T;
    update(obj: T): T;
    delete(obj: T): T;
}
export declare class UserRepo implements IRepository<User> {
    create(user: User): User;
    get(): User;
    update(user: User): User;
    delete(user: User): User;
}
export declare class CarRepo implements IRepository<Car> {
    create(car: Car): Car;
    get(): Car;
    update(car: Car): Car;
    delete(car: Car): Car;
}
export {};
