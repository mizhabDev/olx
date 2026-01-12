import mongoose from "mongoose";

interface IMyProductList extends mongoose.Document {
    createdBy: mongoose.Types.ObjectId;
    products: mongoose.Types.ObjectId[];
}

const myProductListSchema = new mongoose.Schema<IMyProductList>({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        }
    ]
    
})

export default mongoose.model<IMyProductList>("MyProductList", myProductListSchema);