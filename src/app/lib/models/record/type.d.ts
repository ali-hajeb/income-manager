export interface ICellValue {
    column_id: string;
    column_title: string;
    value: string | number;
}

export interface IRecordNewObj {
    program: string;
    currentCode: string;
    date: string;
    year: number;
    month: number;
    budget: number;
    totalDeduction: number;
    netIncome: number;
    prevIncome: number;
    totalIncome: number;
    values: ICellValue[];
}

export default interface IRecord extends IRecordNewObj {
    _id: string;
}
