import mongoose, { Schema, Document, mongo } from "mongoose";

// Type para TypScript

export interface iTask extends Document  {
    name: string
    description: string
}

export const TaskSchema : Schema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
})



const Task = mongoose.model<iTask>('Task', TaskSchema)

export default Task