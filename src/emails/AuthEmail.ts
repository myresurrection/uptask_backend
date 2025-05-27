import { transporter } from "../config/nodemailer"

interface iEmail {
    email: string
    name: string
    token: string
}

export class AuthEmail {
    static sendConfirmationEmail = async ( user : iEmail  ) => {
        const info = await transporter.sendMail({
            from: 'Uptask <admin@uptask.com>',
            to: user.email,
            subject: 'Uptask - Confirmar cuenta',
            text: 'Uptask - Confirma tu cuenta',
            html: `<p>Hola: ${user.name}, has creado tu cuenta en UpTask, ya casi está todo listo. Solo tenés que que confirmar tu cuenta</p>
            <p>Visita el siguiente enlace:</p>
            <a href="">Confirmar cuenta</a>
            <p>E ingresa el código: <b>${user.token}</b></p>
            <p>Este token expira en 10 minutos</p>
            `

        })

        console.log('Mensaje enviado', info.messageId)
    }
}