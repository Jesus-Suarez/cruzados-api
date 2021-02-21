const express = require('express');

//Levantamos un nuevo servidor
const conectarDB = require('./config/db');

const app = express();
const path = require('path');

conectarDB();

// Habilitar middleware express.json ---para recibir las peticiones como json
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Habilitar la carpeta como publica para mostrar las imgs al entrar en la ruta storage
app.use(express.static(path.resolve(__dirname, '..public')));
//console.log(path.resolve(__dirname, '../storage'));
//app.use('/public', express.static(`${__dirname}/storage/img`));

//Configuracion global de rutas -- Archivo de nuestras rutas donde estan las url de la API
app.use('/api/user', require('./routes/User'));
app.use('/api/auth', require('./routes/Auth'));

let PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`The server is up port: ${PORT}`));
