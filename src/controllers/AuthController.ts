import type { Request, Response } from "express"
import User from "../models/User"
import { checkPassword, hashPassword } from "../utils/auth"
import Token from "../models/Token"
import { generateToken } from "../utils/token"
import { AuthEmail } from "../emails/AuthEmail"
export class AuthController {

    static createAccount = async (req: Request, res: Response) => {
        try {
            const { password, email } = req.body

            // Prevenir duplicados

            const userExists = await User.findOne({ email })
            if (userExists) {
                const error = new Error('El usuario ya está registrado')
                res.status(409).json({ error: error.message })
                return
            }

            // Crea un usuario
            const user = new User(req.body)

            // Hash password
            user.password = await hashPassword(password)

            // Generar el Token

            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            // enviar el email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await Promise.allSettled([user.save(), token.save()])
            res.send('Cuenta creada, revisa tu email para confirmarla')
        } catch (error) {
            // console.log(error)
            res.status(500).json({ error: 'Hubo un error' })
        }

    }

    static confirmAccount = async (req: Request, res: Response) => {

        try {
            const { token } = req.body
            const tokenExists = await Token.findOne({ token })
            if (!tokenExists) {
                const error = new Error('Token no válido')
                res.status(401).json({ error: error.message })
                return
            }

            const user = await User.findById(tokenExists.user)
            user.confirmed = true


            await Promise.allSettled([
                user.save(),
                tokenExists.deleteOne()
            ])
            res.send('Cuenta confirmada correctamente')
        } catch (error) {
            // console.log(error)
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static login = async (req: Request, res: Response) => {

        try {
            const { email, password } = req.body
            const user = await User.findOne({ email })
            if (!user) {
                const error = new Error('Usuario inexistente')
                res.status(404).json({ error: error.message })
                return
            }

            if (!user.confirmed) {
                const token = new Token()
                token.user = user.id
                token.token = generateToken()
                await token.save()

                // enviar el email
                AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                })


                const error = new Error('Cuenta no confirmada. Hemos enviado un email para confirmarla')
                res.status(404).json({ error: error.message })
                return
            }

            // Revisar el password 
            const isPasswordCorrect = await checkPassword(password, user.password);
            if (!isPasswordCorrect) {
                const error = new Error('El password es incorrecto')
                res.status(401).json({ error: error.message })
                return
            }
            res.send('Autenticado...')
        } catch (error) {
            // console.log(error)
            res.status(500).json({ error: 'Hubo un error' })
        }
    }



    static requestConfirmationCode = async (req: Request, res: Response) => {
        try {
            const { email } = req.body

            // Usuario Existe?

            const user = await User.findOne({ email })
            if (!user) {
                const error = new Error('El usuario no está registrado')
                res.status(404).json({ error: error.message })
                return
            }

            if (user.confirmed) {
                const error = new Error('La cuenta ya está confirmada')
                res.status(409).json({ error: error.message })
                return
            }
            // Generar el Token

            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            // enviar el email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await Promise.allSettled([user.save(), token.save()])
            res.send('Se envió un nuevo token a tu email, revisá tu bandeja de entrada')
        } catch (error) {
            // console.log(error)
            res.status(500).json({ error: 'Hubo un error' })
        }

    }



    static forgotPassword = async (req: Request, res: Response) => {
        try {
            const { email } = req.body

            // Usuario Existe?

            const user = await User.findOne({ email })
            if (!user) {
                const error = new Error('El usuario no está registrado')
                res.status(404).json({ error: error.message })
                return
            }

            // Generar el Token

            const token = new Token()
            token.token = generateToken()
            token.user = user.id
            await token.save()

            // enviar el email
            AuthEmail.sendPasswordResetToken({
                email: user.email,
                name: user.name,
                token: token.token
            })


            res.send('Revisá tu email para instrucciones.')
        } catch (error) {
            // console.log(error)
            res.status(500).json({ error: 'Hubo un error' })
        }

    }
}