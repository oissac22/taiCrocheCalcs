import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { dbPurchasedItems, TDataPurchasedItems } from "../../../database";

const STORAGE_NAME = 'list_productos_comprados';

export function useListProdutos() {

    const [list, setList] = useState<TDataPurchasedItems[]>([]);
    const [load, setLoad] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const refresh = useCallback(() => {
        setLoad(true);
        setError(null);
        dbPurchasedItems.find()
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