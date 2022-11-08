import Head from "next/head";
import { ChangeEvent, RefObject, useCallback, useRef } from "react";
import { MemoryDatabaseBackups } from "../../modules/database/";
import { Template } from "../../modules/template";
import style from './style.module.css'

function InputFile() {

    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        const read = new FileReader();
        read.onload = ({ target }) => {
            if (!target) return;
            const memoryBackup = new MemoryDatabaseBackups();
            memoryBackup.restoreBackupJsonString(target.result + '');
            window.alert('Backup restaurado com sucesso')
            window.location.reload();
        }
        read.onerror = (error) => window.alert(`Erro: ${error}`);
        read.readAsText(e.target.files[0])
    }, [])

    return <input
        className={style.inputFile}
        ref={inputRef}
        type="file"
        accept="application/json"
        onChange={handleChange}
    />
}

export default function Main() {

    const handleBackupClick = useCallback(() => {
        const memoryBackup = new MemoryDatabaseBackups();
        const json = memoryBackup.createBackupJsonString();
        const a = document.createElement('a');
        a.download = `backup ${new Date().toLocaleString().replace(/[^\d]+/g, '')}`;
        a.href = 'data:application/json;charset=UTF-8,' + encodeURI(json);
        a.click();
    }, [])

    return <Template>
        <Head>
            <title>Backup e Restauração</title>
        </Head>
        <div className={style.container}>
            <div className={style.area}>
                <button onClick={handleBackupClick}>Fazer backup</button>
                <div className={style.restoreBackup}>
                    <InputFile />
                    <div>
                        Clique aqui ou arraste seu item pra esta área para restaurar o backup
                    </div>
                </div>
            </div>
        </div>
    </Template>

}