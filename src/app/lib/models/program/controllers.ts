import type IProgram from './type';
import axios from 'axios';

export async function createProgram(data: IProgram) {
    try {
        // await db.programs.add({...data, _id: `${data.code}${(new Date()).toISOString()}`});
        return axios.post('/api/program', { ...data });
    } catch (error) {
        console.error(error);
    }
}


export async function editProgram({ _id, ...updatedData }: IProgram) {
    try {
        // await db.programs.update(_id, {...updatedData});
        return axios.patch('/api/program', { _id, ...updatedData });
    } catch (error) {
        console.error(error);
    }
}

export async function deleteProgram(id: string) {
    try {
        // await db.programs.delete(id);
        return axios.delete('/api/program', { data: {_id: id} });
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
