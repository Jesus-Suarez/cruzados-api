const mongoose = require('mongoose');

require('dotenv').config({ path: '.env' });

const conectarDB = async () => {
	try {
		let urlDB;
		//si no existe la variable NODE_ENV lo pasamos a la DB de desarrollo
		process.env.NODE_ENV === 'dev'
			? (urlDB = 'mongodb://localhost:27017/cruzados')
			: (urlDB = process.env.DB_MONGO);

		await mongoose.connect(urlDB, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
			useCreateIndex: true,
		});
		console.log('bd conectada', urlDB);
	} catch (error) {
		console.log(error);
		process.exit(1); //Detenemos la app en caso de un error
	}
};

module.exports = conectarDB;
