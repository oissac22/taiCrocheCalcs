import { useRouter } from "next/router"
import { useCallback, useEffect, useState } from "react"
import { dbProductCreate, TDataProductCreate } from "../../../database"
import { Template } from "../../../template"
import style from './style.module.css'

interface IPropsItem {
    data: TDataProductCreate
}

function useList() {
    const [list, setList] = useState<TDataProductCreate[]>([]);

    useEffect(() => {
        dbProductCreate.find()
            .then((result) => {
                setList(result || [])
            }).catch((err) => {
                window.alert(`${err}`)
            });
    }, []);

    return list;
}

function Item({ data }: IPropsItem) {

    const [deleted, setDeleted] = useState<boolean>(false);

    const router = useRouter();

    const handleEdit = useCallback(async () => {
        if (data._id)
            router.push(`/product/edit/${encodeURI(data._id)}`)
    }, [data])

    const handleDelete = useCallback(() => {
        if (!window.confirm(`Deseja deletar o registro "${data.name}"`))
            return;
        dbProductCreate.delete(data._id + '')
            .then((result) => {
                setDeleted(true);
            }).catch((err) => {
                window.alert(err.message)
            });
    }, [data]);

    if (deleted)
        return null;

    return <tr>
        <td>{data.name}</td>
        <td>
            <div className={style.buttons}>
                <button onClick={handleEdit} type="button">Editar</button>
                <button onClick={handleDelete} type="button" color="red">Delete</button>
            </div>
        </td>
    </tr>

}

function List() {

    const list = useList();

    return <table>
        <thead>
            <tr>
                <th>Nome do produto</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            {
                list.map(item => <Item data={item} key={item._id} />)
            }
        </tbody>
    </table>
}

function Buttons() {

    const router = useRouter();

    const handleClick = useCallback(async () => {
        const { _id } = await dbProductCreate.insert({ _id: '', hoursWorked: 0, minutesWorked: 0, name: 'Escreva o nome aqui' })
        router.push(`/product/edit/${encodeURI(_id)}`)
    }, [])

    return <div className={style.buttons}>
        <button onClick={handleClick} type="button">Adicionar novo</button>
    </div>
}

export function RouterProductProduzedList() {

    return <Template>
        <div className={style.container}>
            <List />
            <Buttons />
        </div>
    </Template>

}