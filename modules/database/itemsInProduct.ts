import { createDatabase } from "./_createDatabase";

export type TDataItemsInProduct = {
    _id?: string,
    name: string,
    peso: number,
    preco: number,
    detalhes: string,
    idProductCreated: string,
    valueConsumed: number,
}

export const dbItemsInProduct = createDatabase<TDataItemsInProduct>('itensInProduct');