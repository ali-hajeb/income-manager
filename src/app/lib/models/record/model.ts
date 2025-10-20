import mongoose, { Model, Schema } from "mongoose";
import IRecord from "./type";

const recordSchema = new Schema<IRecord>({
    program: {
        type: Schema.Types.ObjectId,
        ref: 'Program'
    },
    currentCode: {
        type: String,
    },
    budget: {
        type: Number
    },
    date: {
        type: String,
    },
    month: {
        type: Number,
    },
    year: {
        type: Number,
    },
    netIncome: {
        type: Number,
    },
    prevIncome: {
        type: Number,
    },
    totalDeduction: {
        type: Number,
    },
    totalIncome: {
        type: Number,
    },
    values: [
        {
            column_id: {
                type: Schema.Types.ObjectId,
                ref: 'Column'
            },
            value: String,
        }
    ],
});

const Record: Model<IRecord> = (mongoose.models && mongoose.models.Record) || mongoose.model("Record", recordSchema);

export default Record;
