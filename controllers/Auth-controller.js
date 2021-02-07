const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

const UserModel = require('../models/User-model');
const mailer = require('../storage/email/EmailVerificationTemplate');

const signUp = async (req, res) => {
	//Creamos el usaurio con el constructor para validar la info tambien
	//Validamos el user
	let user = new UserModel(req.body);
	const { email } = user;

	try {
		//Revisamos que el usuario no este ya registrado
		let usuario = await UserModel.findOne({ email }).select('+email');
		if (usuario) {
			return res.status(400).json({ msg: 'El usuario ya existe' });
		}

		//Creamos el JWT con el email del user para confirmar correo
		const payload = {
			email: user.email,
		};

		//Firma del JWT
		let token = jwt.sign(payload, process.env.JWT_SECRET_URL, {
			expiresIn: '7d',
		});

		//Creamos la data que se enviara en el correo
		let data = {
			token,
			firstName: user.firstName,
			email: user.email,
		};

		//Enviamos el correo de confirmacion de correo
		//Aqui podemos añadirle un await pero lo hace mas rapido sin el
		mailer.enviar_email(data);
		user.save();

		res.status(201).json({
			msg: 'Registro exitoso, revisa tu bandeja de entrada.',
		});
	} catch (error) {
		//console.log(error);
		return res.status(500).json({
			error,
		});
	}
};

//Fn para confirmar el email del usuario
const confirmationEmail = async (req, res) => {
	//Extraemos el token de la url
	let token = req.params.token;

	//Verificamos que el token exista
	if (token) {
		try {
			//desiframos el token y sacamos el email
			const tokenDesifrado = jwt.verify(token, process.env.JWT_SECRET_URL);

			//Extraemos el email del jwt desifrado
			const { email } = tokenDesifrado;

			//Creamos un objeto con los datos que se actualizaran
			let newUser = { verifiedAt: true };

			let user = await UserModel.findOneAndUpdate({ email }, { $set: newUser });
			if (user) return res.redirect('http://localhost:4000/login');
		} catch (error) {
			return res.redirect('http://localhost:4000/error400');
		}
	}

	return res.redirect('http://localhost:4000/login');
};

const signIn = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await UserModel.findOne({ email }).select(
			'+verifiedAt +password'
		);

		if (!user) {
			return res.status(400).json({
				msg: 'Email o contraseña incorrecta, vuelve a intentarlo.',
			});
		} else if (user.verifiedAt === false) {
			return res.status(400).json({
				msg: 'Upps.. Revisa verifica tu correo.',
			});
		}

		const passwordCorrect = await bcryptjs.compare(password, user.password);
		//console.log(passwordCorrect);
		if (!passwordCorrect) {
			return res.status(400).json({
				msg: 'Email o contraseña incorrecta, vuelve a intentarlo.',
			});
		}

		//Si el email y password es correcto creamos el JWT
		const payload = {
			usuario: {
				id: user.id,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				img: user.img,
			},
		};

		//Firma del JWT
		jwt.sign(
			payload,
			process.env.JWT_SECRET,
			{ expiresIn: '7d' },
			(error, token) => {
				if (error) throw error;

				res.json({ token });
			}
		);
	} catch (error) {
		res.status(500).json({
			msg: 'Upps.. ha ocurrido un error',
		});
	}
};

module.exports = {
	signUp,
	confirmationEmail,
	signIn,
};
