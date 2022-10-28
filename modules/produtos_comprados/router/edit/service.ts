import { serviceListItems } from "../../hooks";

const STORAGE_NAME = 'list_productos_comprados';


export class DTOInsertItem {
    constructor(
        public _id: string,
        public name: string,
        public peso: number,
        public preco: number,
        public detalhes: string,
    ) {
        if (!_id)
            this._id = this.name.toLowerCase();
    }
}

export class DTOEditItem {
    constructor(
        public name: string,
        public peso: number,
        public preco: number,
        public detalhes: string,
    ) { }
}


export async function serviceInsertItem(data: DTOInsertItem) {
    const list = await serviceListItems();
    list.push({ ...data });
    localStorage.setItem(STORAGE_NAME, JSON.stringify(list))
}

export async function serviceEditItem(id: string, data: DTOEditItem) {
    const list = await serviceListItems();
    const newList = list.forEach(prevData => {
        if (prevData._id === id) {
            prevData = { ...prevData, ...data }
        }
    })
    localStorage.setItem(STORAGE_NAME, JSON.stringify(newList))
}

export async function serviceGetItemDataById(id: string) {
    const list = await serviceListItems();
    return list.find(data => data._id === id)
}