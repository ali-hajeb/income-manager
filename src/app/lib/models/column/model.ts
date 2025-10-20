import mongoose, { Model, Schema } from "mongoose";
import IColumn from "./type";

const columnSchema = new Schema<IColumn>({
    auto: {
        type: Boolean,
        default: true,
    },
    percentage: {
        type: Number,
        min: 0,
        max: 100,
    },
    code: {
        type: String
    },
    title: {
        type: String,
    },
});

console.log(mongoose.models);
const Column: Model<IColumn> = (mongoose.models && mongoose.models.Column) || mongoose.model("Column", columnSchema);

export default Column;
