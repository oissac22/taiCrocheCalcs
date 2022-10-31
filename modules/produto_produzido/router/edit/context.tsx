import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { TDataItemsInProduct, TDataProductCreate } from "../../../database";

export type TDataProductAndItemsFromProductProduzide = {
    product?: TDataProductCreate,
    items?: { [key: string]: TDataItemsInProduct }
}

function useData() {

    const refData = useRef<TDataProductAndItemsFromProductProduzide>({
        product: {},
        items: {}
    });

    const sets = useRef<Set<() => void>>(new Set())

    const set = useCallback((value: TDataProductAndItemsFromProductProduzide | null) => {
        if (value) {
            if (value.product)
                refData.current.product = { ...refData.current.product, ...value.product };
            if (value.items)
                refData.current.items = value.items
        }
        refData.current = { ...refData.current };
        sets.current.forEach(callback => callback());
    }, [])

    const get = useCallback((): TDataProductAndItemsFromProductProduzide => {
        return { ...refData.current }
    }, [])

    const initialize = useCallback((callback: () => void) => {
        sets.current.add(callback);
        return () => { sets.current.delete(callback); }
    }, [])

    return {
        set, get, initialize
    }

}

const Context = createContext<ReturnType<typeof useData> | null>(null);

export function ProviderProductProduced({ children }: any) {

    return <Context.Provider value={useData()}>
        {children}
    </Context.Provider>

}

export function useProviderProductProduced(noRenderMy: boolean = false): [TDataProductAndItemsFromProductProduzide, (value: TDataProductAndItemsFromProductProduzide) => void] {
    const data = useContext(Context);
    if (!data)
        throw new Error(`data in useProviderProductProduced not found`);

    const [dataProduct, setDataProduct] = useState<TDataProductAndItemsFromProductProduzide>({
        items: {},
        product: {}
    });

    useEffect(() => {
        if (!noRenderMy)
            return data.initialize(() => setDataProduct(data.get()));
    }, [noRenderMy]);

    return [dataProduct, data.set]

}