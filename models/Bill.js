import mongoose, { Schema } from "mongoose";

const billSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    items: [
        {
            item: {
                type: String,
            },
            amount: {
                type: Number,
            }
        }
    ],
    taxes: {
        type: Number,
    },
    total: {
        type: Number,
        required: true,
    },
    paidBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    splitAmong: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            amount: {
                type: Number,
                required: true,
            }
        }
    ],
    organization: {
        type: Schema.Types.ObjectId,
        ref: 'Organization',
        required: true,
    },
    date: {
        type: Date,
        default: Date.now(),
    }
}, { timestamps: true });

export default mongoose.model("Bill", billSchema);