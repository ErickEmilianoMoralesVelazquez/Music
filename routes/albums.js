const express = require("express");
const router = express.Router();
const albumsController = require("../controllers/albumsController");

// Obtener todos los álbumes
router.get("/", albumsController.getAlbums);

// Obtener un álbum por ID
router.get("/:id", albumsController.getAlbumById);


// Crear un nuevo álbum
router.post("/", albumsController.createAlbum);

// Actualizar un álbum por ID
router.put("/:id", albumsController.updateAlbum);

// Eliminar un álbum por ID
router.delete("/:id", albumsController.deleteAlbum);

module.exports = router;
