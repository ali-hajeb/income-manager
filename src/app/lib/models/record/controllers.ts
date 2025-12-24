import axiosInstance from "@/app/config/axiosInstance";
import type IRecord from "./type";
import { IRecordNewObj } from "./type";

export async function insertManyRecords(items: IRecordNewObj[]) {
    try {
        return axiosInstance.put('/record', {items});
    } catch (error) {
        console.error(error);
    }
}

export async function createRecord(data: IRecordNewObj) {
    try {
        // await db.records.add({...data});
        return axiosInstance.post('/record', {...data});
    } catch (error) {
        console.error(error);
    }
}

export async function editRecord(items: IRecord[]) {
    try {
        // await db.records.update(_id, {...updatedData});
        return axiosInstance.patch('/record', { items });
    } catch (error) {
        console.error(error);
    }
}

export async function deleteRecord(id: string) {
    try {
        // await db.records.delete(id);
        return axiosInstance.delete('/record', { data: {_id: id} });
    } catch (error) {
        console.error(error);
    }
}

export async function getRecord(month: number, year: number) {
    try {
        // return await db.records.where('month').equals(month).and(record => record.year === year).toArray();
        return axiosInstance.get('/record', { params: {month, year}});
    } catch (error) {
        console.error(error);
    }
}
