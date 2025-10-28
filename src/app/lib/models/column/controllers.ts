import axios from 'axios';
import type IColumn from './type';
import type { IColumnNewObj } from './type';

export async function createColumn(data: IColumnNewObj) {
    try {
        // await db.columns.add({...data, _id: `${data.code}%${data.percentage}`});
        return axios.post('/api/column', {...data});
    } catch (error) {
        console.error(error);
    }
}

export async function editColumn({ _id, ...updatedData }: IColumn) {
    try {
        // await db.columns.update(_id, {...updatedData});
        return axios.patch('/api/column', { _id, ...updatedData });
    } catch (error) {
        console.error(error);
    }
}

export async function deleteColumn(id: string) {
    try {
        // await db.columns.delete(id);
        return axios.delete('/api/column', { data: {_id: id} });
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
