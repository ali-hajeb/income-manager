import type IRecord from "./type";
import axios from "axios";
import { IRecordNewObj } from "./type";

export async function insertManyRecords(items: IRecordNewObj[]) {
    try {
        return axios.put('/api/record', {items});
    } catch (error) {
        console.error(error);
    }
}

export async function createRecord(data: IRecordNewObj) {
    try {
        // await db.records.add({...data});
        return axios.post('/api/record', {...data});
    } catch (error) {
        console.error(error);
    }
}

export async function editRecord(items: IRecord[]) {
    try {
        // await db.records.update(_id, {...updatedData});
        return axios.patch('/api/record', { items });
    } catch (error) {
        console.error(error);
    }
}

export async function deleteRecord(id: string) {
    try {
        // await db.records.delete(id);
        return axios.delete('/api/record', { data: {_id: id} });
    } catch (error) {
        console.error(error);
    }
}

export async function getRecord(month: number, year: number) {
    try {
        // return await db.records.where('month').equals(month).and(record => record.year === year).toArray();
        return axios.get('/api/record', { params: {month, year}});
    } catch (error) {
        console.error(error);
    }
}
