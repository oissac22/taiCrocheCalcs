import { useCallback, useEffect, useState } from "react";

const STORAGE_NAME = 'list_productos_comprados';

export class DTOList {
    constructor(
        readonly _id: string,
        readonly name: string,
        readonly peso: number,
        readonly preco: number,
        readonly detalhes: string,
    ) { }

    static from(data: any) {
        return new DTOList(data._id, data.name, data.peso, data.preco, data.detalhes)
    }
}

export async function serviceListItems() {
    const result: any[] = JSON.parse(localStorage.getItem(STORAGE_NAME) || `[]`);
    return result.map(data => DTOList.from(data))
}

export function useListProdutos() {

    const [list, setList] = useState<DTOList[]>([]);
    const [load, setLoad] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const refresh = useCallback(() => {
        setLoad(true);
        serviceListItems()
            .then((result) => {
                setList(result)
            }).catch((err) => {
                setError(err)
            }).finally(() => {
                setLoad(false);
            });
    }, [])

    useEffect(() => {
        refresh()
    }, [])

    return {
        list, load, error, refresh
    }

}