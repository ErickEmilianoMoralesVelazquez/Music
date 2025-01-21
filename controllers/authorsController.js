const db = require("../db");

// Obtener todos los autores
const getAllAuthors = (req, res) => {
  const query = `SELECT id, name FROM authors`; // Asegúrate de que esta consulta es válida en tu base de datos
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error al obtener autores: ", err.message);
      return res.status(500).json({ error: "Error al obtener los autores" });
    }
    res.json(results);
  });
};

// Crear un nuevo autor
const createAuthor = (req, res) => {
  const { name, description } = req.body; // Puedes incluir otros campos según tus necesidades

  const query = `INSERT INTO authors (name, description) VALUES (?, ?)`;
  db.query(query, [name, description || null], (err, result) => {
    if (err) {
      console.error("Error al crear autor: ", err.message);
      return res.status(500).json({ error: "Error al crear autor" });
    }
    res.status(201).json({ message: "Autor creado", id: result.insertId });
  });
};

// Obtener un autor por ID
const getAuthorById = (req, res) => {
  const { id } = req.params;

  const query = `SELECT id, name, description FROM authors WHERE id = ?`;
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error al obtener autor: ", err.message);
      return res.status(500).json({ error: "Error al obtener autor" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Autor no encontrado" });
    }
    res.json(results[0]);
  });
};

// Actualizar un autor
const updateAuthor = (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const query = `UPDATE authors SET name = ?, description = ? WHERE id = ?`;
  db.query(query, [name, description, id], (err, result) => {
    if (err) {
      console.error("Error al actualizar autor: ", err.message);
      return res.status(500).json({ error: "Error al actualizar autor" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Autor no encontrado" });
    }
    res.json({ message: "Autor actualizado correctamente" });
  });
};

// Eliminar un autor
const deleteAuthor = (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM authors WHERE id = ?`;
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error al eliminar autor: ", err.message);
      return res.status(500).json({ error: "Error al eliminar autor" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Autor no encontrado" });
    }
    res.json({ message: "Autor eliminado" });
  });
};

// Exportar controladores
module.exports = {
  getAllAuthors,
  createAuthor,
  getAuthorById,
  updateAuthor,
  deleteAuthor
};
