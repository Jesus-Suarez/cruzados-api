const mongoose = require('mongoose');

const ImagesPetsSchema = mongoose.Schema({
	image: {
		type: String,
		required: true,
		trim: true,
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
});

module.exports = mongoose.model('ImagesPets', ImagesPetsSchema);
