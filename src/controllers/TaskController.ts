import type { Request, Response } from 'express';

export class TaskController {
    static createProject = async (req: Request, res: Response) => {
        const { projectId } = req.params;
        console.log(projectId)
        try {

        } catch (error) {
            console.log(error)
        }
    }
}