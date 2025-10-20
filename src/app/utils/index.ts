import axios from "axios";
import { DEFAULT_CATEGORIES, DEFAULT_COLUMNS, DEFAULT_PROGRAMS } from "../constants/defaultDatabaseRecords";

export async function loadDefaultData(type: 'column' | 'program' | 'category') {
    try {
        switch (type) {
            case "column":
                return await axios.put('/api/column', { items: DEFAULT_COLUMNS.map(c => {
                    const {_id, ...data} = c;
                    return data;
                }) })
            case "program":
                return await axios.put('/api/program', { items: DEFAULT_PROGRAMS.map(c => {
                    const {_id, cols, type, ...data} = c;
                    return data;
                }) })
            case "category":
                return await axios.put('/api/category', { items: DEFAULT_CATEGORIES.map(c => {
                    const {_id, ...data} = c;
                    return data;
                }) })
 
        }
    } catch (error) {
        console.log(error);
    }
}

