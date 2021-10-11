interface IUserRepo {
    getUsers(): User[];
}
declare class UserMongoDbRepo implements IUserRepo {
    getUsers(): User[];
}
declare class UserPostgresDbRepo implements IUserRepo {
    getUsers(): User[];
}
declare class UserService {
    private _userRepo;
    constructor(userRepo: IUserRepo);
    get userRepo(): IUserRepo;
    filterUserByAge(age: number): User[];
}
declare const userService: UserService;
declare class Database2 {
    private _url;
    private static instance;
    constructor();
    get url(): number;
}
declare const db1: Database2, db2: Database2;
