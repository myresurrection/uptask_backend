import mongoose, { Schema, Document, PopulatedDoc, Types } from "mongoose";
import Task, { iTask } from "./Task";
import { iUser } from "./User";
import Note from "./Note";

// Type para TypScript

export interface iProject extends Document {
    projectName: string
    clientName: string
    description: string
    tasks: PopulatedDoc<iTask & Document>[]
    manager: PopulatedDoc<iUser & Document>
    team: PopulatedDoc<iUser & Document>[]
}

// Schema para Mongodb
export const ProjectSchema: Schema = new Schema({
    projectName: {
        type: String,
        required: true,
        trim: true,
    },
    clientName: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    tasks: [
        {
            type: Types.ObjectId,
            ref: 'Task'
        }
    ],
    manager: {
        type: Types.ObjectId,
        ref: 'User'
    },
    team: [
        {
            type: Types.ObjectId,
            ref: 'User'
        }
    ],

}, { timestamps: true })


// Middleware

ProjectSchema.pre('deleteOne', { document: true, query: false }, async function () {

    const projectId = this._id
    if (!projectId) return

    const tasks = await Task.find({ project: projectId })
    for (const task of tasks) {
        await Note.deleteMany({ task: task.id })
    }

    await Task.deleteMany({ project: projectId })


})

const Project = mongoose.model<iProject>('Project', ProjectSchema)
export default Project