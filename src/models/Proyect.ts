import mongoose, { Schema, Document, PopulatedDoc, Types } from "mongoose";
import { iTask } from "./Task";

// Type para TypScript

export interface iProject extends Document  {
    projectName: string
    clientName: string
    description: string
    tasks: PopulatedDoc<iTask & Document>[]
}

// Schema para Mongodb
export const ProjectSchema : Schema = new Schema({
    projectName : {
        type: String,
        required: true,
        trim: true,
    },
    clientName : {
        type: String,
        required: true,
        trim: true,
    },
    description : {
        type: String,
        required: true,
        trim: true,
    },
    tasks: [
        {
            type: Types.ObjectId,
            ref: 'Task'
        }
    ]
}, {timestamps: true})

const Project = mongoose.model<iProject>('Project', ProjectSchema)
export default Project