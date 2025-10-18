export interface IColumnNewObj {
    code: string;
    title: string;
    percentage: number;
    auto: boolean;
}

export default interface IColumn extends IColumnNewObj {
    _id: string;
}
