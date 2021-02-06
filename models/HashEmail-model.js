const mongoose = require('mongoose');

const HashEmailSchema = mongoose.Schema({
	hash: {
		type: String,
	},
	created_at: {
		type: Date,
		default: Date.now(),
	},
	updated_at: {
		type: Date,
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
});

module.exports = mongoose.model('HashEmail', HashEmailSchema);
