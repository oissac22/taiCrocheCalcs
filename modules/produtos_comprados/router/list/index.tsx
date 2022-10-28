import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { DTOList, useListProdutos } from "../../hooks/list"
import { serviceDeleteItem } from "./service";
import style from './style.module.css'

interface IPropsItem {
    data: DTOList,
    refresh: () => void,
}

function Item({ data, refresh }: IPropsItem) {

    const { _id, detalhes, name, peso, preco } = data;

    const router = useRouter();

    const handleDelete = useCallback(() => {
        if (!window.confirm('Deseja realmente deletar ' + name + '?'))
            return;
        serviceDeleteItem(_id)
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
        <td>{_id}</td>
        <td>{name}</td>
        <td>{peso}</td>
        <td>{preco}</td>
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

    return <div>
        <Head>
            <title>Lista de items comprados</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <p>Lista de itens de compra</p>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Peso/unidade</th>
                    <th>Preço</th>
                    <th>Detalhes</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {
                    list.list.map(data => {
                        return <Item data={data} refresh={list.refresh} />
                    })
                }
            </tbody>
        </table>
        <br />
        <div>
            <button onClick={handleNewUser}>Adicionar novo</button>
        </div>
    </div>

}