const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Servir archivos estáticos desde el directorio actual
app.use(express.static(path.join(__dirname, '/')));

// Ruta principal que sirve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor web iniciado en http://localhost:${PORT}`);
    console.log(`Para acceder a la aplicación, abre tu navegador y visita: http://localhost:${PORT}`);
});