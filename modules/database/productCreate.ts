import { createDatabase } from "./_createDatabase";

export type TDataProductCreate = {
    _id?: string,
    name?: string,
    hoursWorked?: number,
    minutesWorked?: number,
}

export const dbProductCreate = createDatabase<TDataProductCreate>('createdItems');