// Setting a MongoDB Database for storing notes
import mongoose, { Schema } from "mongoose";

const noteSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
},
    { timestamps: true } //createdAt and updatedAt
);

const Note = mongoose.model("Note", noteSchema);

export default Note;