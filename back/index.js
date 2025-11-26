import express from 'express'
import nodemailer from 'nodemailer'
import cors from 'cors'
import path from 'path'

const app = express()
app.use(cors()) // Para que el front pueda comunicarse con el back
app.use(express.urlencoded({ extended: false })) // Para parsear formularios

app.use(express.static(path.join(process.cwd(), '../front')))

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '10miguel19@gmail.com', 
        pass: 'zmvi mhpn cmqd ztig'
    }
})

app.post('/enviar-aviso', async (req, res) => {
    const mailOptions = {
        from: '10miguel19@gmail.com',
        to: 'michelangellimiguel19@gmail.com',
        subject: 'Nuevo comprobante de pago recibido',
        text: 'Se ha recibido un nuevo comprobante de pago. Por favor, revisa el sistema para más detalles.'
    }

    try {
        await transporter.sendMail(mailOptions)
        console.log('Correo de aviso enviado')
        res.send('<h1>Correo enviado correctamente</h1>')
    } catch (error) {
        console.error('Error al enviar el correo de aviso:', error)
        res.status(500).send('<h1>Error al enviar el correo</h1>')
    }
})

app.listen(3000, () => {
    console.log('Servidor listo en http://localhost:3000');
});