const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

const UserModel = require('../models/User-model');
const mailerVerificationAccount = require('../storage/email/EmailVerificationAccount');
const mailerResetPassword = require('../storage/email/EmailResetPassword');

const signUp = async (req, res) => {
	//Creamos el usaurio con el constructor para utilizar la validacion
	let user = new UserModel(req.body);

	const { email } = user;

	try {
		//Revisamos que el usuario no este ya registrado
		let usuario = await UserModel.findOne({ email }).select(
			'+email +verifiedAt'
		);

		const payload = {
			email: user.email,
		};
		//Firma del JWT
		let token = jwt.sign(payload, process.env.JWT_SECRET, {
			expiresIn: '7d',
		});
		//Creamos la data que se enviara en el correo
		let data = {
			token,
			firstName: user.firstName,
			email: user.email,
		};

		if (!usuario) {
			//Enviamos el correo de confirmacion de correo
			//mailerVerificationAccount.enviar_email(data);
			mailerVerificationAccount.enviar_email(data);
			//Aqui podemos añadirle un await pero lo hace mas rapido sin el
			await user.save();
			//user.save();

			return res.status(201).json({
				msg: 'Registro exitoso, revisa tu bandeja de entrada, revisa Spam.',
			});
		}

		if (usuario.verifiedAt === false) {
			//Si no ha verificado la cuenta
			mailerVerificationAccount.enviar_email(data);

			//Hashear el password
			// Salt es el numero de vueltas para la encriptacion
			const salt = await bcryptjs.genSalt(10);
			//Guardamos el nuevo password en la DB
			req.body.password = await bcryptjs.hash(req.body.password, salt);

			const nuevoUsuario = await UserModel.findOneAndUpdate(email, {
				password: req.body.password,
				firstName: req.body.firstName,
			});

			console.log(nuevoUsuario);
			return res.status(202).json({
				msg: 'Revisa tu bandeja de entrada, revisa Spam',
			});
		}

		return res.status(401).json({
			msg: 'Usuario ya existente, por favor inicia sesión.',
		});
	} catch (error) {
		//console.log(error);
		return res.status(500).json({
			msg: error,
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
			const tokenDesifrado = jwt.verify(token, process.env.JWT_SECRET);

			//Extraemos el email del jwt desifrado
			const { email } = tokenDesifrado;

			//Creamos un objeto con los datos que se actualizaran
			let newUser = { verifiedAt: true };

			let user = await UserModel.findOneAndUpdate({ email }, { $set: newUser });
			if (user) return res.redirect('http://localhost:4000/login');
		} catch (error) {
			console.log(error);
			return res.redirect('http://localhost:4000/error400');
		}
	}

	return res.redirect('http://localhost:4000/login');
};

//Iniciar sesion
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

//Envia un email para Recuperar la contraseña
const emailPasswordReset = async (req, res) => {
	const { email } = req.body;
	try {
		const user = await UserModel.findOne({ email }).select(
			'+verifiedAt +password'
		);

		if (!user || user.verifiedAt === false) {
			return res.status(400).json({
				msg: 'Usuario no encontrado',
			});
		}

		mailerResetPassword.emailResetPassword(user);

		res.json({ msg: 'Revisa correo, revisa spam.' });
	} catch (error) {}
};

//Recupera la contraseña
const recoverPassword = async (req, res) => {};

//Cambia la contraseña
const changePassword = async (req, res) => {};

module.exports = {
	signUp,
	confirmationEmail,
	signIn,
	emailPasswordReset,
	recoverPassword,
	changePassword,
};
