import { Schema } from 'mongoose';
import ICategory from "../category/type";
import IColumn from "../column/type";

export interface IProgramNewObj {
    title: string;
    code: string;
    programCode: string;
    type: string | Schema.Types.ObjectId;
    cols: string[];
}

export default interface IProgram extends IProgramNewObj {
    _id: string;
}

export interface IProgramPopulated extends IProgram {
    cols: IColumn[];
    type: ICategory;
}
