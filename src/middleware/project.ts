import type { Request, Response, NextFunction } from 'express';
import Project, { iProject } from '../models/Proyect';


// Permite pasar valores de tipo iProject al objeto Request
declare global {
    namespace Express {
        interface Request {
            project: iProject
        }
    }
}

export async function projectExists(req: Request, res: Response, next: NextFunction) {
    try {
        const { projectId } = req.params;
        const project = await Project.findById(projectId);
        if (!project) {
            const error = new Error('Proyecto no encontrado')
            res.status(404).json({ error: error.message })
            return
        }
        req.project = project
        next()
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error' })
    }

}

