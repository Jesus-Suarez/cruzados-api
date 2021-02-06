const jwt = require('jsonwebtoken');

const UserModel = require('../models/User-model');

const signUp = async (req, res) => {
	//Creamos el usaurio con el constructor para validar la info tambien
	//Validamos el user
	let user = new UserModel(req.body);
	const { email } = user;

	try {
		//Revisamos que el usuario no este ya registrado
		let usuario = await UserModel.findOne({ email });
		if (usuario) {
			return res.status(400).json({ msg: 'El usuario ya existe' });
		}

		await user.save();
		res.status(201).json({ msg: 'Registro exitoso' });
	} catch (error) {
		console.log(error);
		return res.status(400).json({
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
			const tokenDesifrado = jwt.verify(token, process.env.JWT_SECRET);

			//Extraemos el email del jwt desifrado
			const { email } = tokenDesifrado;

			//Creamos un objeto con los datos que se actualizaran
			let newUser = { verifiedAt: Date() };

			let user = await UserModel.findOneAndUpdate({ email }, { $set: newUser });
			if (user) return res.redirect(202, 'http://localhost:3000/login');
		} catch (error) {
			return res.redirect(400, 'http://localhost:3000/error400');
		}
	}

	return res.redirect(400, 'http://localhost:3000/login');
};

const signIn = async (req, res) => {};

module.exports = {
	signUp,
	confirmationEmail,
	signIn,
};
