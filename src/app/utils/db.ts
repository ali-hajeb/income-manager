import Dexie, { EntityTable } from "dexie";
import relationship from "dexie-relationships";
import IColumn from "../lib/models/column/type";
import ICategory from "../lib/models/category/type";
import { DEFAULT_CATEGORIES, DEFAULT_COLUMNS, DEFAULT_PROGRAMS } from "../constants/defaultDatabaseRecords";
import IProgram from "../lib/models/program/type";
import IRecord from "../lib/models/record/type";
// import { exportDB } from "dexie-export-import";
// import { saveAs } from "file-saver";


const db = new Dexie('incomeManager', {addons: [relationship]}) as Dexie & {
    columns: EntityTable<IColumn, '_id'>,
    categories: EntityTable<ICategory, '_id'>,
    programs: EntityTable<IProgram, '_id'>,
    records: EntityTable<IRecord, '_id'>,
}

db.version(1).stores({
    columns: '_id, title, code, percentage, auto',
    categories: '_id, title',
    programs: '_id, title, code, programCode, *cols, type -> categories._id',
    records: '_id, program -> programs._id, currentCode, data, year, month, budget, totalDeduction, netIncome, prevIncome, totalIncome'
});

const loadDefaultData = async (type: 'column' | 'program' | 'category') => {
    try {
        switch (type) {
            case "column":
                await db.columns.bulkAdd(DEFAULT_COLUMNS);
                break;
            case "program":
                await db.programs.bulkAdd(DEFAULT_PROGRAMS);
                break;
            case "category":
                await db.categories.bulkAdd(DEFAULT_CATEGORIES);
                break;
        }
    } catch (error) {
        console.log(error);
    }
}

// const exportDatabase = async () => {
//     const blob = await exportDB(db, {prettyJson: true});
//     saveAs(blob, 'db_export.json');
// }

// export { db, loadDefaultData , exportDatabase };
export { db, loadDefaultData };
