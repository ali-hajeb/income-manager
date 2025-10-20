import mongoose, { Model, Schema } from "mongoose";
import IProgram from "./type";

const programSchema = new Schema<IProgram>({
    code: {
        type: String
    },
    programCode: {
        type: String,
    },
    title: {
        type: String,
    },
    cols: [
        {
            type: Schema.Types.ObjectId,
            ref: "Column"
        }
    ],
    type: {
        type: Schema.Types.ObjectId,
        ref: "Category"
    }
});

const Program: Model<IProgram> = (mongoose.models && mongoose.models.Program) || mongoose.model("Program", programSchema);

export default Program;
