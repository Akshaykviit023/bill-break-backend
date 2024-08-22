import mongoose, { Schema } from "mongoose";
import { randomUUID } from "crypto";

const organizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    bills: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Bill',
        }
    ],
    organizationId: {
        type: String,
        required: true,

    }
}, { timestamps: true });

export default mongoose.model("Organization", organizationSchema);