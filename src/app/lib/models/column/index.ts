import { db } from '@/app/utils/db';
import type IColumn from './type';
import type { IColumnNewObj } from './type';

export async function createColumn(data: IColumnNewObj) {
    try {
        await db.columns.add({...data, _id: `${data.code}%${data.percentage}`});
    } catch (error) {
        console.error(error);
    }
}

export async function editColumn({ _id, ...updatedData }: IColumn) {
    try {
        await db.columns.update(_id, {...updatedData});
    } catch (error) {
        console.error(error);
    }
}

export async function deleteColumn(id: string) {
    try {
        await db.columns.delete(id);
    } catch (error) {
        console.error(error);
    }
}

// export async function createColumn(data: IColumnNewObj) {
//     try {
//     } catch (error) {
//         console.error(error);
//     }
// }
