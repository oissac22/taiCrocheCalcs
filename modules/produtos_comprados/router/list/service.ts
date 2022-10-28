import { serviceListItems } from "../../hooks";

const STORAGE_NAME = 'list_productos_comprados';

export async function serviceDeleteItem(id: string) {
    const list = await serviceListItems();
    const newList = list.filter(data => data._id !== id);
    localStorage.setItem(STORAGE_NAME, JSON.stringify(newList))
}