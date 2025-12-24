import { DEFAULT_CATEGORIES, DEFAULT_COLUMNS, DEFAULT_PROGRAMS } from "../constants/defaultDatabaseRecords";
import axiosInstance from "../config/axiosInstance";

export async function loadDefaultData(type: 'column' | 'program' | 'category') {
    try {
        switch (type) {
            case "column":
                return await axiosInstance.put('/column', { items: DEFAULT_COLUMNS.map(c => {
                    const {_id, ...data} = c;
                    return data;
                }) })
            case "program":
                return await axiosInstance.put('/program', { items: DEFAULT_PROGRAMS.map(c => {
                    const {_id, cols, type, ...data} = c;
                    return data;
                }) })
            case "category":
                return await axiosInstance.put('/category', { items: DEFAULT_CATEGORIES.map(c => {
                    const {_id, ...data} = c;
                    return data;
                }) })
 
        }
    } catch (error) {
        console.log(error);
    }
}

