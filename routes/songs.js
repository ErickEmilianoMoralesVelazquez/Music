const express = require("express");
const router = express.Router();
const songsController = require("../controllers/songsController");

// Crear una nueva canción
router.post("/", songsController.createSong);

// Obtener todas las canciones (con detalles de autores y álbumes)
router.get("/", songsController.getSongs);

// Obtener una canción por ID
router.get("/:id", songsController.getSongById);

// Actualizar una canción por ID
router.put("/:id", songsController.updateSong);

// Eliminar una canción por ID
router.delete("/:id", songsController.deleteSong);

module.exports = router;
