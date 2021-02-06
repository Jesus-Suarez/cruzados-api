const express = require('express');

//Levantamos un nuevo servidor
const conectarDB = require('./config/db');

const app = express();
conectarDB();

// Habilitar middleware express.json ---para recibir las peticiones como json
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Configuracion global de rutas -- Archivo de nuestras rutas donde estan las url de la API
app.use('/api/user', require('./routes/User'));
app.use('/api/auth', require('./routes/Auth'));

let PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`The server is up port: ${PORT}`));
