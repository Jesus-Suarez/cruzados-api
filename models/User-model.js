const mongoose = require('mongoose');

const bcryptjs = require('bcryptjs');

const UserSchema = mongoose.Schema({
	firstName: {
		type: String,
		trim: true,
		required: [true, 'El nombre es requierido'],
		minLength: [3, 'Minimo tres caracteres'],
	},
	lastName: {
		type: String,
		trim: true,
		minLength: [3, 'Minimo tres caracteres'],
	},
	email: {
		type: String,
		trim: true,
		lowercase: true,
		required: [true, 'El correo es necesario'],
		unique: [true, 'El usuario ya existe'],
	},
	password: {
		type: String,
		trim: true,
		required: [true, 'La contraseña es necesaria'],
		minLength: [6, 'Minimo seis caracteres'],
		select: false,
	},
	img: String,
	lastLogin: {
		type: Date,
		select: false,
	},
	createdAt: {
		type: Date,
		default: Date.now(),
		select: false,
	},
	updatedAt: {
		type: Date,
		select: false,
	},
	deletedAt: {
		type: Date,
		select: false,
	},
	verifiedAt: {
		type: String,
		select: false,
	},
});

//Middleware de mongoose para encriptar la contraseña entes de guardar
UserSchema.pre('save', async function (next) {
	let user = this;

	//Si la contraseña no se ha modificado nos salimos de la Fn
	if (!user.isModified('password')) return next();

	//Hashear el password
	// Salt es el numero de vueltas para la encriptacion
	const salt = await bcryptjs.genSalt(10);

	//Guardamos el nuevo password en la DB
	user.password = await bcryptjs.hash(user.password, salt);
	return next();
});

UserSchema.methods.isCorrrectPassword = async function (password, callback) {};

module.exports = mongoose.model('User', UserSchema);
