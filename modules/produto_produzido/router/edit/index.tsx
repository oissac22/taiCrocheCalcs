import { useRouter } from "next/router";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { dbItemsInProduct, dbProductCreate, dbPurchasedItems, dbSalary, TDataItemsInProduct, TDataProductCreate, TDataPurchasedItems, TDataSalary } from "../../../database";
import { ID_IN_DATABASE } from "../../../salario";
import { Template } from "../../../template";
import { ProviderProductProduced, TDataProductAndItemsFromProductProduzide, useProviderProductProduced } from "./context"
import style from './style.module.css'

function formatMoeda(value: string | number) {
    value = `${value || 0}`.replace(/\./, ',');
    if (!/,/.test(value)) value += ',00';
    value = (value + '00').replace(/(,..).+$/, '$1');
    return `R$ ${value}`;
}

function totalItemsValue(product: TDataProductAndItemsFromProductProduzide) {
    return Object.values(product.items || {})
        .reduce<number>((result, item) => {
            return result + item.preco / item.peso * item.valueConsumed;
        }, 0);
}

function Title() {
    const [product] = useProviderProductProduced();
    return <h1>Editar produto "{product.product?.name || ""}"</h1>
}

function Name() {
    const [product, setProduct] = useProviderProductProduced();
    return <div>
        <div>Nome do produto:</div>
        <input
            defaultValue={product.product?.name}
            onChange={e => setProduct({ product: { name: e.target.value } })}
        />
    </div>
}

function InitializeById() {
    const router = useRouter();
    const [, setProduct] = useProviderProductProduced(true);
    const id = useMemo(() => (router.query.id + '') || '', [router]);
    useEffect(() => {
        if (id) {
            dbProductCreate.findById(id)
                .then((result) => {
                    if (result)
                        setProduct({ product: result });
                }).catch((err) => {
                    window.alert(err.message)
                });
            dbItemsInProduct.find()
                .then((result) => {
                    if (result)
                        setProduct({
                            items: result
                                .reduce<{ [key: string]: TDataItemsInProduct }>((result, item) => {
                                    if (item.idProductCreated === id)
                                        result[item._id || ''] = item;
                                    return result;
                                }, {})
                        });
                }).catch((err) => {
                    window.alert(err.message)
                });
        }
    }, [id]);
    return null;
}

function Buttons() {
    const router = useRouter();
    const [product] = useProviderProductProduced();
    const id = useMemo(() => (router.query.id + '') || '', [router]);

    const handleSave = useCallback(async () => {
        await dbProductCreate.update(id, product.product || {});
        for (let key in product.items) {
            const item = product.items[key];
            await dbItemsInProduct.update(item._id || '', item);
        }
        window.alert('Salvo com sucesso');
    }, [product]);

    const handleCancel = useCallback(() => {
        router.push('/product/list');
    }, [product]);

    return <div className={style.buttons}>
        <button onClick={handleSave}>Salvar</button>
        <button onClick={handleCancel}>Cancelar</button>
    </div>
}

function salaryTotalByHours(dataSalary: TDataSalary, productCreated: TDataProductCreate) {
    const valByDay = dataSalary.salaryByMonth / dataSalary.dayFromJobByMonth;
    const valByHour = valByDay / 8
    const profit = valByHour * (productCreated.hoursWorked || 0) +
        valByHour * (1 / 60 * (productCreated.minutesWorked || 0));
    return profit;
}

function CargaHoraria() {
    const router = useRouter();
    const [product, setProduct] = useProviderProductProduced();
    const [salaryBase, setSalaryBase] = useState<TDataSalary>({ dayFromJobByMonth: 22, salaryByMonth: 2000, _id: ID_IN_DATABASE });

    useEffect(() => {
        dbSalary.findById(ID_IN_DATABASE)
            .then((result) => {
                if (result)
                    setSalaryBase(result);
            }).catch((err) => {
                window.alert(err.message);
            });
    }, []);

    const valByDay = useMemo(() => salaryBase.salaryByMonth / salaryBase.dayFromJobByMonth, [salaryBase])
    const valByHour = useMemo(() => valByDay / 8, [valByDay]);
    const profit = useMemo(() => {
        return salaryTotalByHours(salaryBase, product.product || {})
    }, [salaryBase, product]);

    return <div className={style.salary}>
        <div>
            <div>Valor mensal:</div>
            <input value={formatMoeda(salaryBase.salaryByMonth)} />
        </div>
        <div>
            <div>Valor por dia:</div>
            <input value={formatMoeda(valByDay)} />
        </div>
        <div>
            <div>Valor por hora:</div>
            <input value={formatMoeda(valByHour)} />
        </div>
        <div>
            <div>Horas trabalhadas:</div>
            <input
                value={product.product?.hoursWorked || 0}
                onChange={e => setProduct({ product: { hoursWorked: Number(e.target.value) || 0 } })}
                type="number"
            />
        </div>
        <div>
            <div>Minutos trabalhados:</div>
            <input
                value={product.product?.minutesWorked || 0}
                onChange={e => setProduct({ product: { minutesWorked: Number(e.target.value) || 0 } })}
                type="number"
            />
        </div>
        <div>
            <div>Lucro:</div>
            <input value={formatMoeda(profit)} />
        </div>
    </div>
}

function TotalItemsCust() {
    const [product] = useProviderProductProduced();
    const total = useMemo(() => {
        return totalItemsValue(product);
    }, [product])
    return <div>
        Total: {formatMoeda(total)}
    </div>
}

function ItemTable({ item }: { item: TDataItemsInProduct }) {
    const [, setProduct] = useProviderProductProduced();

    const custTotal = item.preco / item.peso * item.valueConsumed

    return <tr>
        <td>{item.name}</td>
        <td>{item.peso}</td>
        <td>{formatMoeda(item.preco)}</td>
        <td>
            <input
                value={item.valueConsumed || 0}
                onChange={e => {
                    item.valueConsumed = Number(e.target.value) || 0;
                    setProduct({})
                }}
                type="number"
            />
        </td>
        <td>{formatMoeda(custTotal)}</td>
    </tr>
}

function TableItemsInProductTBody() {
    const [product] = useProviderProductProduced();
    const items = useMemo(() => Object.values(product.items || {}), [product])
    const itemsSort = useMemo(() => items.sort((a, b) => a.name < b.name ? -1 : 1), [items])

    return <tbody>
        {
            itemsSort.map(item => <ItemTable item={item} />)
        }
    </tbody>
}

function TableItemsInProduct() {
    return <table>
        <thead>
            <tr>
                <th>Item</th>
                <th>Peso</th>
                <th>Valor</th>
                <th>Peso consumido</th>
                <th>Gasto</th>
            </tr>
        </thead>
        <TableItemsInProductTBody />
    </table>
}

function SelectAddItemInProduct() {

    const [product, setProduct] = useProviderProductProduced();
    const [items, setItems] = useState<TDataPurchasedItems[]>([]);
    const [idInSelect, setIdInSelect] = useState('');
    const router = useRouter();
    const id = useMemo(() => router.query.id || '', [router])

    useEffect(() => {
        dbPurchasedItems.find()
            .then((result) => {
                setItems(result)
            }).catch((err) => {
                window.alert(err.message)
            });
    }, []);

    const handleSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        if (!idInSelect)
            return window.alert('Selecione um item para ser adicionado');
        const itemSelect = items.find(item => item._id === idInSelect)
        if (!itemSelect)
            return window.alert('Item selecionado inválido');
        const { _id: newId } = await dbItemsInProduct.insert({
            ...itemSelect,
            idProductCreated: id + '',
            valueConsumed: 0
        })
        setProduct({
            items: {
                ...(product.items || {}),
                [newId]: {
                    ...itemSelect,
                    idProductCreated: id + '',
                    valueConsumed: 0,
                    _id: newId,
                }
            }
        })
    }, [idInSelect, id])

    return <form className={style.buttons} onSubmit={handleSubmit}>
        <select onChange={e => setIdInSelect(e.target.value)}>
            <option value="">Selecione um item</option>
            {
                items.map(item =>
                    <option value={item._id} key={item._id}>{item.name} - {item.peso} - {formatMoeda(item.preco)}</option>
                )
            }
        </select>
        <button>+ Adiconar</button>
    </form>
}

function TableTotal() {
    const [product] = useProviderProductProduced();
    const [salaryBase, setSalaryBase] = useState<TDataSalary>({ dayFromJobByMonth: 22, salaryByMonth: 2000, _id: ID_IN_DATABASE });

    useEffect(() => {
        dbSalary.findById(ID_IN_DATABASE)
            .then((result) => {
                if (result)
                    setSalaryBase(result);
            }).catch((err) => {
                window.alert(err.message);
            });
    }, []);

    const totalItens = useMemo(() => totalItemsValue(product), [product])
    const totalSalary = useMemo(() => {
        return salaryTotalByHours(salaryBase, product.product || {})
    }, [salaryBase, product]);

    const total = totalItens + totalSalary;

    return <table>
        <thead>
            <tr>
                <th>Total em itens</th>
                <th>Total salário</th>
                <th>Venda (conjunto no pix)</th>
                <th>Venda 5% (Conjunto no cartão ou unidade no pix)</th>
                <th>Venda 10% (Unidade no cartão)</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{formatMoeda(totalItens)}</td>
                <td>{formatMoeda(totalSalary)}</td>
                <td>{formatMoeda(total)}</td>
                <td>{formatMoeda(total * 1.05)}</td>
                <td>{formatMoeda(total * 1.1)}</td>
            </tr>
        </tbody>
    </table>
}

export default function EditProductProduzed() {

    return <Template>
        <ProviderProductProduced>
            <InitializeById />
            <div className={style.container}>
                <Title />
                <Name />
                <CargaHoraria />
                <TableItemsInProduct />
                <SelectAddItemInProduct />
                <TotalItemsCust />
                <TableTotal />
                <Buttons />
            </div>
        </ProviderProductProduced>
    </Template>

}