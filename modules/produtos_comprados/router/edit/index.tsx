import { useRouter } from 'next/router';
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Template } from '../../../template';
import { DTOEditItem, DTOInsertItem, serviceEditItem, serviceGetItemDataById, serviceInsertItem } from './service';
import style from './style.module.css'



function useInputsData() {

    const refName = useRef<HTMLInputElement>(null);
    const refPeso = useRef<HTMLInputElement>(null);
    const refPreco = useRef<HTMLInputElement>(null);
    const refDetalhes = useRef<HTMLInputElement>(null);

    const get = useCallback(() => {
        return {
            name: refName.current?.value || '',
            peso: Number(refPeso.current?.value || 0),
            preco: Number(refPreco.current?.value || 0),
            detalhes: refDetalhes.current?.value || '',
        }
    }, [refName, refPeso, refPreco, refDetalhes]);

    const set = useCallback((data: DTOEditItem) => {
        if (refName.current)
            refName.current.value = data.name;
        if (refPeso.current)
            refPeso.current.value = data.peso + '';
        if (refPreco.current)
            refPreco.current.value = data.preco + '';
        if (refDetalhes.current)
            refDetalhes.current.value = data.detalhes;
    }, [refName, refPeso, refPreco, refDetalhes])

    return {
        get,
        set,
        refName,
        refPeso,
        refPreco,
        refDetalhes,
    }

}

export function RouterEditProductsPayment() {

    const inputsData = useInputsData();

    const router = useRouter()

    const id = useMemo(() => router.query.id || '_', [router]);

    const insertItem = useCallback(() => {
        const data = inputsData.get();
        const object = new DTOInsertItem(
            '',
            data.name,
            data.peso,
            data.preco,
            data.detalhes
        );
        serviceInsertItem(object)
            .then((result) => {
                window.alert('salvo com sucesso');
                router.push('/item')
            }).catch((err) => {
                window.alert(`${err}`)
            });
    }, [inputsData])

    const editItem = useCallback(() => {
        const data = inputsData.get();
        const object = new DTOEditItem(
            data.name,
            data.peso,
            data.preco,
            data.detalhes
        );
        serviceEditItem(id as string, object)
            .then((result) => {
                window.alert('salvo com sucesso');
                router.push('/item')
            }).catch((err) => {
                window.alert(`${err}`)
            });
    }, [inputsData])

    const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (id === '_') {
            insertItem()
        } else {
            editItem()
        }
    }, [inputsData]);

    const handleCancel = useCallback(() => {
        router.push('/item');
    }, [])

    useEffect(() => {
        if (id !== '_') {
            serviceGetItemDataById(id as string)
                .then((result) => {
                    if (!result) return;
                    inputsData.set(result)
                }).catch((err) => {
                    window.alert(`${err}`)
                });
        }
    }, [id, inputsData])

    return <Template>
        <p>
            {id !== '_' ? 'Editar registro' : 'Inserir registro'}
        </p>
        <form className={style.form} onSubmit={handleSubmit}>
            <div>
                <input placeholder="NOME" ref={inputsData.refName} />
                <input placeholder="PESO" ref={inputsData.refPeso} />
                <input placeholder="PREÇO" ref={inputsData.refPreco} />
                <input placeholder="DETALHES" ref={inputsData.refDetalhes} />
                <div className={style.formButtons}>
                    <button>Salvar</button>
                    <button type="button" onClick={handleCancel}>Cancelar</button>
                </div>
            </div>
        </form>
    </Template>

}