import { Router } from "express";
import { body, param } from 'express-validator'

import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { projectExists } from "../middleware/project";
import { taskBelongsToProject, taskExists } from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { TeamMemberController } from "../controllers/TeamController";


const router = Router();

// Verificar si el usuario está autenticado 
router.use(authenticate);


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

router.param('projectId', projectExists)

router.post('/:projectId/tasks',

    body('name').notEmpty().withMessage('El nombre de la tarea es Obligatorio'),
    body('description').notEmpty().withMessage('La descripción de la tarea es obligatoria'),
    handleInputErrors,
    TaskController.createTask
)


router.get('/:projectId/tasks',
    handleInputErrors,
    TaskController.getProjectTasks

)

router.param('taskId', taskExists)
router.param('taskId', taskBelongsToProject)


router.get('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    TaskController.getTaskById

)

router.put('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('ID no válido'),
    body('name').notEmpty().withMessage('El nombre de la tarea es Obligatorio'),
    body('description').notEmpty().withMessage('La descripción de la tarea es obligatoria'),
    handleInputErrors,
    TaskController.updateTask

)


router.delete('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    TaskController.deleteTask

)

router.post('/:projectId/tasks/:taskId/status',
    param('taskId').isMongoId().withMessage('ID no válido'),
    body('status').notEmpty().withMessage('El estado es Obligatorio'),
    handleInputErrors,
    TaskController.updateStatus


)

// Ruter for teams // 

router.post('/:projectId/team/find', 
    body('email')
    .isEmail().toLowerCase().withMessage('Email no válido'),
    handleInputErrors,
    TeamMemberController.findMemberByEmail

)

router.get('/:projectId/team',
    TeamMemberController.getProjectTeam
)

router.post('/:projectId/team/',
    body('id')
        .isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    TeamMemberController.addMemberById
)


router.delete('/:projectId/team/',
    body('id')
        .isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    TeamMemberController.removeMemberById
)

export default router