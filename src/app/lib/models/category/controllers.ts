import axios from 'axios';
import { db } from '../../../utils/db';
import type ICategory from './type';
import type { ICategoryNewObj } from './type';

export async function createCategory(data: ICategoryNewObj) {
    try {
        // await db.categories.add({...data, _id: `${(new Date()).toISOString()}-${data.title}`});
        return axios.post('/api/category', { ...data });
    } catch (error) {
        console.error(error);
    }
}

export async function editCategory({ _id, ...updatedData }: ICategory) {
    try {
        // await db.categories.update(_id, {...updatedData});
        return axios.patch('/api/category', { _id, ...updatedData });
    } catch (error) {
        console.error(error);
    }
}

export async function deleteCategory(id: string) {
    try {
        // await db.categories.delete(id);
        return axios.delete('/api/category', { data: {_id: id} });
    } catch (error) {
        console.error(error);
    }
}

// export async function createCategory(data: ICategoryNewObj) {
//     try {
//     } catch (error) {
//         console.error(error);
//     }
// }
