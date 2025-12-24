import axiosInstance from '@/app/config/axiosInstance';
import type IProgram from './type';

export async function createProgram(data: IProgram) {
    try {
        // await db.programs.add({...data, _id: `${data.code}${(new Date()).toISOString()}`});
        return axiosInstance.post('/program', { ...data });
    } catch (error) {
        console.error(error);
    }
}


export async function editProgram({ _id, ...updatedData }: IProgram) {
    try {
        // await db.programs.update(_id, {...updatedData});
        return axiosInstance.patch('/program', { _id, ...updatedData });
    } catch (error) {
        console.error(error);
    }
}

export async function deleteProgram(id: string) {
    try {
        // await db.programs.delete(id);
        return axiosInstance.delete('/program', { data: {_id: id} });
    } catch (error) {
        console.error(error);
    }
}

// export async function createProgram(data: IProgramNewObj) {
//     try {
//     } catch (error) {
//         console.error(error);
//     }
// }
