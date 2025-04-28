import { Router } from "express";
import { body, param } from 'express-validator'

import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";


const router = Router();

router.post('/',
    body('projectName').notEmpty().withMessage('El nombre del proyecto es Obligatorio'),
    body('clientName').notEmpty().withMessage('El nombre del cliente es Obligatorio'),
    body('description').notEmpty().withMessage('La descripción del proyecto es obligatoria'),
    handleInputErrors,
    ProjectController.createProject)

router.get('/', ProjectController.getAllProjects)


router.get('/:id',
    param('id').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    ProjectController.getProjectById)



router.put('/:id',
    param('id').isMongoId().withMessage('ID no válido'),
    body('projectName').notEmpty().withMessage('El nombre del proyecto es Obligatorio'),
    body('clientName').notEmpty().withMessage('El nombre del cliente es Obligatorio'),
    body('description').notEmpty().withMessage('La descripción del proyecto es obligatoria'),
    handleInputErrors,
    ProjectController.updateProject)




router.delete('/:id',
    param('id').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    ProjectController.deleteProject)



/** Routes for tasks */
router.post('/:projectId/tasks',
    TaskController.createProject
)

export default router