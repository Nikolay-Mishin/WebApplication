import { User } from './oop-1-incapsulate';
interface IUserRepo {
    getUsers(): User[];
}
export declare class UserPostgresDbRepo implements IUserRepo {
    getUsers(): User[];
}
export {};
