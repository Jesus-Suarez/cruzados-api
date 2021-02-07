'use strict';

const nodemailer = require('nodemailer');

this.enviar_email = async (dataUser) => {
	try {
		let transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.MAILUSER,
				pass: process.env.MAILPASSWD,
			},
		});

		//Definimos la propiedades de nuestro correo
		let message = {
			from: 'www.cruzados.com',
			//to: 'jesus-s_a@outlook.com',
			to: dataUser.email,
			subject: 'Verificacion de correo',

			html: `
                <!DOCTYPE html>
                <html lang="en">

                <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>

                <body>
                <p><strong>Hola ${dataUser.firstName}</strong> bienvenido a cruzados.com </p>
                <p><strong>Lo mejor....</strong>encuentra ahora mismo paraja para tu mascota</p>
                <p><strong><a href="http://localhost:4000/api/auth/confirmation/${dataUser.token}" class="btn btn-default">Click para Verificar correo</a></strong></p>
                
                </body>
                </html>
            `,
		};

		await transporter.sendMail(message);
		//console.log(info);
	} catch (error) {
		//console.log(error);
		throw (error = 'Upps... Ocurrio un error, vuelve a intentarlo.');
	}
};

module.exports = this;
