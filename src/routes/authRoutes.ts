import { Router } from 'express'
import { body } from 'express-validator'
import AuthController from '../controllers/AuthController';
import { handleInputErrors } from '../middleware/validation';

const router = Router();

router.post('/create-account',
    body('name')
        .notEmpty().withMessage('El nombre del usuario no puede ir vacío'),

    body('password')
        .isLength({ min: 8 }).withMessage('El password es muy corto. Mínimo 8 caracteres'),
    
    body('password_confirmation').custom((value, {req}) => {
        if(value !== req.body.password) {
            throw new Error('Los password no son iguales')
        }
        return true // Se va al sig middleware
    }),

    body('email')
        .isEmail().withMessage('Email no válido'),
    handleInputErrors,
    AuthController.createAccount


)



export default router