const express = require("express");
const cors = require('cors');
 
const app = express();
const PORT = 3000;

// Habilitar CORS
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());

// Importar rutas
const songRutes = require("./routes/songs");
const authorsRoutes = require("./routes/authors"); // Importa las rutas de autores
const albumsRoutes = require("./routes/albums"); // Importa las rutas de álbumes

// Usar las rutas
app.use("/songs", songRutes);
app.use("/authors", authorsRoutes); // Usar las rutas de autores
app.use("/albums", albumsRoutes); // Usar las rutas de álbumes


// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
