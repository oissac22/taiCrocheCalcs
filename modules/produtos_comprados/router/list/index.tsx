import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { dbPurchasedItems, TDataPurchasedItems } from "../../../database";
import { Template } from "../../../template";
import { useListProdutos } from "../../hooks/list"
import style from './style.module.css'

function formatMoeda(value: string | number) {
    value = `${value || 0}`.replace(/\./, ',');
    if (!/,/.test(value)) value += ',00';
    value = (value + '00').replace(/(,..).+$/, '$1');
    return `R$ ${value}`;
}

interface IPropsItem {
    data: TDataPurchasedItems,
    refresh: () => void,
}

function Item({ data, refresh }: IPropsItem) {

    const { _id, detalhes, name, peso, preco } = data;

    const router = useRouter();

    const handleDelete = useCallback(() => {
        if (!window.confirm('Deseja realmente deletar ' + name + '?'))
            return;
        dbPurchasedItems.delete(_id)
            .then((result) => {
                refresh()
            }).catch((err) => {
                window.alert(`${err}`);
            });
    }, [refresh])

    const handleEdit = useCallback(() => {
        router.push(`/item/${encodeURI(_id)}`)
    }, [_id])

    return <tr>
        <td>{name}</td>
        <td>{peso}</td>
        <td>{formatMoeda(preco)}</td>
        <td>{detalhes}</td>
        <td>
            <div className={style.listButtons}>
                <button onClick={handleEdit}>Editar</button>
                <button color="red" onClick={handleDelete}>Deletar</button>
            </div>
        </td>
    </tr>

}

export function ListProductsPayment() {

    const list = useListProdutos()

    const router = useRouter()

    const handleNewUser = useCallback(() => {
        router.push(`/item/_`)
    }, [router])

    return <Template>
        <Head>
            <title>Lista de items comprados</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <p>Lista de itens de compra</p>
        <table>
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Peso/unidade</th>
                    <th>Pre??o</th>
                    <th>Detalhes</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {
                    list.list.map(data => {
                        return <Item data={data} refresh={list.refresh} key={data._id} />
                    })
                }
            </tbody>
        </table>
        <br />
        <div>
            <button onClick={handleNewUser}>Adicionar novo</button>
        </div>
    </Template>

}