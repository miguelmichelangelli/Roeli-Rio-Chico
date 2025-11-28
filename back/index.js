import express from 'express'
import nodemailer from 'nodemailer'
import cors from 'cors'
import path from 'path'
import dotenv from 'dotenv'

const app = express()
app.use(cors()) // Para que el front pueda comunicarse con el back
app.use(express.urlencoded({ extended: false })) // Para parsear formularios

app.use(express.static(path.join(process.cwd(), '../front')))

const PORT = process.env.PORT || 3000;

dotenv.config()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER, 
        pass: process.env.GMAIL_PASS
    }
})

app.post('/enviar-aviso', async (req, res) => {
    
    // 1. RECUPERAR LOS DATOS
    // Extraemos 'nombre' y 'cedula' del cuerpo de la petición (req.body)
    // Estos nombres deben coincidir EXACTAMENTE con los name="" del HTML
    const { nombre, cedula } = req.body;

    // console.log para verificar en tu terminal que llegan los datos
    console.log(`Recibido: ${nombre}, CI: ${cedula}`);

    const mailOptions = {
        from: '10miguel19@gmail.com',
        to: 'michelangellimiguel19@gmail.com',
        subject: `Nuevo Pago - ${nombre}`, // Puedes poner el nombre en el asunto
        // 2. INCLUIR LOS DATOS EN EL CORREO
        // Usamos las comillas invertidas (``) para insertar variables
        text: `
            Se ha recibido un nuevo reporte de pago.
            
            DETALLES DEL USUARIO:
            ---------------------
            Nombre: ${nombre}
            Cédula: ${cedula}
            
            Por favor, revisa el sistema para validar.
        `
    }

    try {
        await transporter.sendMail(mailOptions)
        console.log('Correo de aviso enviado')
        
        // se podría redirigir al usuario o mostrar un mensaje más bonito, en lugar de simple HTML
        res.send(`
            <h1>Datos Recibidos</h1>
            <p>Gracias <b>${nombre}</b>, hemos notificado tu pago.</p>
            <a href="/">Volver</a>
        `)
    } catch (error) {
        console.error('Error:', error)
        res.status(500).send('<h1>Error al enviar la información</h1>')
    }
})

app.listen(3000, () => {
    console.log('Servidor listo en http://localhost:3000');
});