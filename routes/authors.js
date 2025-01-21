const express = require("express");
const router = express.Router();
const authorsController = require("../controllers/authorsController");

// Obtener todos los autores
router.get("/", authorsController.getAllAuthors);

// Crear un nuevo autor
router.post("/", authorsController.createAuthor);

// Obtener un autor por ID
router.get("/:id", authorsController.getAuthorById);

// Actualizar un autor por ID
router.put("/:id", authorsController.updateAuthor);

// Eliminar un autor por ID
router.delete("/:id", authorsController.deleteAuthor);

module.exports = router;
