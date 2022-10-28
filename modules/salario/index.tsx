import { useRouter } from 'next/router'
import { FormEvent, useCallback, useEffect, useRef } from 'react'
import { Template } from '../template'
import { DTOSalary, readSalary, updateSalary } from './services'
import style from './style.module.css'

interface IPropsTextInput {
    caption: string,
    children: any,
}

function TextInput({ children, caption }: IPropsTextInput) {

    return <div className={style.TextInput}>
        <div>
            {caption}
        </div>
        <div>
            {children}
        </div>
    </div>

}

type TDataInfos = {
    salary: number,
    refDaysByMonth: number,
}

function useData() {
    const refSalary = useRef<HTMLInputElement>(null);
    const refDaysByMonth = useRef<HTMLInputElement>(null);

    const refSalaryWeek = useRef<HTMLInputElement>(null);
    const refSalaryByDay = useRef<HTMLInputElement>(null);
    const refSalaryByHours = useRef<HTMLInputElement>(null);

    const get = useCallback(() => {
        return {
            salary: Number(refSalary.current?.value || 0),
            daysByMonth: Number(refDaysByMonth.current?.value || 0),
        }
    }, []);

    const set = useCallback((salary: number, daysByMonth: number) => {
        if (refSalary.current)
            refSalary.current.value = salary + '';
        if (refDaysByMonth.current)
            refDaysByMonth.current.value = daysByMonth + '';
    }, [])

    const handleOnChange = useCallback(() => {
        const data = get();
        if (refSalaryWeek.current)
            refSalaryWeek.current.value = `${data.salary / 4 * 0.933}`;
        if (refSalaryByDay.current)
            refSalaryByDay.current.value = `${data.salary / data.daysByMonth}`;
        if (refSalaryByHours.current)
            refSalaryByHours.current.value = `${data.salary / data.daysByMonth / 8}`;
    }, [])

    useEffect(() => {
        readSalary()
            .then((result) => {
                set(result.salaryByMonth, result.dayFromJobByMonth);
                handleOnChange();
            }).catch((err) => {
                window.alert(`${err}`);
            });
        refSalary.current?.addEventListener('change', handleOnChange);
        refDaysByMonth.current?.addEventListener('change', handleOnChange);
        return () => {
            refSalary.current?.removeEventListener('change', handleOnChange);
            refDaysByMonth.current?.removeEventListener('change', handleOnChange);
        }
    }, [])

    return {
        get,
        set,
        refSalary,
        refDaysByMonth,
        refSalaryWeek,
        refSalaryByDay,
        refSalaryByHours,
    }
}

export function RouterSalario() {

    const router = useRouter();

    const dataInfos = useData();

    const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = dataInfos.get();
        updateSalary(new DTOSalary(data.salary, data.daysByMonth))
            .then((result) => {
                window.alert('salvo com sucesso')
            }).catch((err) => {
                window.alert(`${err}`)
            });
    }, [])

    const handleCancel = useCallback(() => {
        router.push('/')
    }, [router]);

    return <Template>
        <div className={style.container}>
            <p>Configurar salário</p>
            <form className={style.form} onSubmit={handleSubmit}>
                <TextInput caption='salário mensal'>
                    <input ref={dataInfos.refSalary} type="number" />
                </TextInput>
                <TextInput caption='Dias de trabalho mensal'>
                    <input ref={dataInfos.refDaysByMonth} type="number" />
                </TextInput>
                <div className={style.formButtons}>
                    <button>Salvar</button>
                    <button type="button" onClick={handleCancel}>Cancelar</button>
                </div>
            </form>
            <br />
            <br />
            <br />
            <div className={style.form}>
                <TextInput caption='salário Semanal'>
                    <input ref={dataInfos.refSalaryWeek} type="number" />
                </TextInput>

                <TextInput caption='salário Diário'>
                    <input ref={dataInfos.refSalaryByDay} type="number" />
                </TextInput>

                <TextInput caption='salário por hora (8h de carga)'>
                    <input ref={dataInfos.refSalaryByHours} type="number" />
                </TextInput>
            </div>
        </div>
    </Template>

}