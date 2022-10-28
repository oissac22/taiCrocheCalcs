const NAME_STORAGE = 'salary_information'

export class DTOSalary {

    constructor(
        public salaryByMonth: number,
        public dayFromJobByMonth: number,
    ) { }

    static from(result: any) {
        return new DTOSalary(
            result?.salaryByMonth || 2000,
            result?.dayFromJobByMonth || 22,
        )
    }

}

export async function updateSalary(data: DTOSalary) {
    localStorage.setItem(
        NAME_STORAGE,
        JSON.stringify(data)
    )
}

export async function readSalary() {
    const data = JSON.parse(
        localStorage.getItem(NAME_STORAGE) || '{}'
    )
    return DTOSalary.from(data);
}