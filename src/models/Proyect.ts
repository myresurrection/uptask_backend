import mongoose, { Schema, Document } from "mongoose";

// Type para TypScript

export type ProjectType = Document & {
    projectName: string
    clientName: string
    description: string
}

// Schema para Mongodb😄
const ProjectSchema : Schema = new Schema({
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
    }
})

const Project = mongoose.model<ProjectType>('Project', ProjectSchema)
export default Project