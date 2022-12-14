import Link from "next/link";
import style from './style.module.css'

export function Template({ children }: any) {

    return <div className={style.container}>

        <div className={style.menu}>

            <Link href="/item">
                Items
            </Link>

            <Link href="/salario">
                Salário
            </Link>

            <Link href="/product/list">
                Produtos
            </Link>

            <Link href="/backup">
                Backup
            </Link>

        </div>

        <div className={style.area}>
            {children}
        </div>

    </div>

}