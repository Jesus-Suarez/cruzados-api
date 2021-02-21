module.exports.transporterConfig = {
	service: 'gmail',
	auth: {
		user: process.env.MAILUSER,
		pass: process.env.MAILPASSWD,
	},
};
