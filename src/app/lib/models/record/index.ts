import { db } from "@/app/utils/db";
import type IRecord from "./type";

export async function createRecord(data: IRecord) {
    try {
        await db.records.add({...data});
    } catch (error) {
        console.error(error);
    }
}

export async function editRecord({ _id, ...updatedData }: IRecord) {
    try {
        await db.records.update(_id, {...updatedData});
    } catch (error) {
        console.error(error);
    }
}

export async function deleteRecord(id: string) {
    try {
        await db.records.delete(id);
    } catch (error) {
        console.error(error);
    }
}

export async function getRecord(month: number, year: number) {
    try {
        return await db.records.where('month').equals(month).and(record => record.year === year).toArray();
    } catch (error) {
        console.error(error);
    }
}
