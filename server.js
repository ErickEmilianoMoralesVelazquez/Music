const express = require("express");
const app = express();
const PORT = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Importar rutas
const songRutes = require("./routes/songs");

// Usar las rutas
app.use("/songs", songRutes);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
