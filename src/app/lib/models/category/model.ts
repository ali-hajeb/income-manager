import mongoose, { Model, Schema } from "mongoose";
import ICategory from "./type";

const categorySchema = new Schema<ICategory>({
    title: {
        type: String,
    },
});

const Category: Model<ICategory> = (mongoose.models && mongoose.models.Category) || mongoose.model("Category", categorySchema);

export default Category;
