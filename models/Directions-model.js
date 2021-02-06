const mongoose = require('mongoose');

const DirecionesSchema = mongoose.Schema({
	pais: {
		type: String,
		required: [true, 'El país es requerido'],
		trim: true,
	},
	estado: {
		type: String,
		required: [true, 'El estado es requerido'],
		trim: true,
	},
	municipio: {
		type: String,
		required: [true, 'El municipio es requerido'],
		trim: true,
	},
	localidad: {
		type: String,
		trim: true,
	},
	created_at: {
		type: Date,
		default: Date.now(),
		select: false,
	},
	updated_at: {
		type: Date,
		select: false,
	},
	deleted_at: {
		type: Date,
		select: false,
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
});

module.exports = mongoose.model('Direcciones', DirecionesSchema);
