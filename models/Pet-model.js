const mongoose = require('mongoose');

const MascotaSchema = mongoose.Schema({
	nombre: {
		type: String,
		required: [true, 'El nombre es requierido'],
		trim: true,
	},
	raza: {
		type: String,
		required: false,
		trim: true,
	},
	fechaNac: {
		type: Date,
		required: true,
		trim: true,
	},
	altura: {
		type: Number,
		required: false,
	},
	img: {
		type: String,
		required: false,
	},
	sexo: {
		type: String,
		required: [true, 'El sexo es requerido'],
		trim: true,
	},
	phone: {
		type: Number,
		trim: true,
	},
	peso: {
		type: Number,
		trim: true,
	},
	status: {
		type: Boolean,
		default: true,
	},
	created_at: {
		type: Date,
		default: Date.now(),
	},
	updated_at: {
		type: Date,
	},
	deleted_at: {
		type: Date,
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
});

module.exports = mongoose.model('Mascota', MascotaSchema);
