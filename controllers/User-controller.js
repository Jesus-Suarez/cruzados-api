const UserModel = require('../models/User-model');

const getUser = async (req, res) => {};

const updateUser = async (req, res) => {
	const id = req.params.id;
	const { firstName, lastName, password } = req.body;

	try {
		let user = await UserModel.findById(id);

		let newUser = { firstName, lastName, password };

		if (req.file) {
			const { filename } = req.file;
			user.setImgUrl(filename);
			//console.log(req.file);
		}

		newUser = await UserModel.findByIdAndUpdate(id, newUser, {
			new: true,
			runValidators: true,
		});

		res.json({ msg: 'Todo bien' });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.errors });
	}
};

const deleteUser = async (req, res) => {
	try {
	} catch (error) {}
};
module.exports = {
	getUser,
	updateUser,
	deleteUser,
};
