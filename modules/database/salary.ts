import { createDatabase } from "./_createDatabase";

export type TDataSalary = {
    _id?: string,
    salaryByMonth: number,
    dayFromJobByMonth: number,
}

export const dbSalary = createDatabase<TDataSalary>('salary');