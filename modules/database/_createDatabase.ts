import { v4 } from 'uuid';

const START_NAME_STORAGE = 'db_af48re792w';

type TBasicData = {
    _id?: string
}

class EventMemory {

    public events = new Set<() => void>();

    add(callback: () => void) {
        this.events.add(callback);
        return () => { this.events.delete(callback); }
    }

    exec() {
        this.events.forEach(callback => callback())
    }

}

class MemoryDatabase<T extends TBasicData> {

    private dataMemory: { [key: string]: T } = {};
    private initialized: boolean = false;

    private onChange = new EventMemory();
    private onInsert = new EventMemory();
    private onUpdate = new EventMemory();
    private onDelete = new EventMemory();

    constructor(
        private dbName: string
    ) { }

    private initialize() {
        if (this.initialized) return;
        this.readFromStorage();
        this.initialized = true;
    }

    private storageName() {
        return `${START_NAME_STORAGE}_${this.dbName}`;
    }

    private writeInStorage() {
        window.localStorage.setItem(this.storageName(), JSON.stringify(this.dataMemory));
    }

    private readFromStorage() {
        const strJson = window.localStorage.getItem(this.storageName());
        this.dataMemory = JSON.parse(strJson || '{}');
    }

    async find() {
        this.initialize();
        return Object.values(this.dataMemory);
    }

    async findById(_id: string): Promise<T | null> {
        this.initialize();
        return this.dataMemory[_id] || null;
    }

    async insertOrUpdate(data: T, id: string) {
        this.initialize();
        const _id = id;
        this.onChange.exec();
        if (this.dataMemory[_id])
            this.onUpdate.exec();
        else
            this.onInsert.exec();
        this.dataMemory[_id] = { ...data, _id }
        this.writeInStorage();
        return { _id }
    }

    async insert(data: T) {
        return this.insertOrUpdate(data, v4())
    }

    async update(_id: string, data: T) {
        this.initialize();
        if (this.dataMemory[_id]) {
            this.dataMemory[_id] = { ...this.dataMemory[_id], ...data };
            this.writeInStorage();
            this.onChange.exec();
            this.onUpdate.exec();
        }
        return { _id }
    }

    async delete(_id: string) {
        this.initialize();
        if (this.dataMemory[_id]) {
            delete this.dataMemory[_id];
            this.writeInStorage();
            this.onChange.exec();
            this.onDelete.exec();
        }
    }

    addEventChange(callback: () => void) { return this.onChange.add(callback); }
    addEventInsert(callback: () => void) { return this.onInsert.add(callback); }
    addEventUpdate(callback: () => void) { return this.onUpdate.add(callback); }
    addEventDelete(callback: () => void) { return this.onDelete.add(callback); }

}

export function createDatabase<T extends TBasicData>(databaseName: string) {
    return new MemoryDatabase<T>(databaseName)
}