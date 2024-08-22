
import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    organization: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Organization',
        }
    ]
}, { timestamps: true })

export default mongoose.model("User", userSchema);