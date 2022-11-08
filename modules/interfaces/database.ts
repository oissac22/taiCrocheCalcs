type TKey = {
    [key: string]: any
}

type T_id = {
    _id: string;
}

export interface IMemoryDatabase<T = any> {
    find(): Promise<T[]>;
    findById(_id: string): Promise<T | null>;
    insertOrUpdate(data: T, id: string): Promise<T_id>;
    insert(data: T): Promise<T_id>;
    update(_id: string, data: T): Promise<T_id>;
    delete(_id: string): Promise<void>;
}

export interface IMemoryDatabaseBackups {
    readonly listDatabase: TKey;
    createBackupJsonString(): string;
    restoreBackupJsonString(jsonString: string): void;
}