import { createDatabase } from "./_createDatabase";

export type TDataPurchasedItems = {
    _id: string,
    name: string,
    peso: number,
    preco: number,
    detalhes: string,
}

export const dbPurchasedItems = createDatabase<TDataPurchasedItems>('purchaseItems');