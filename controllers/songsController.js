const db = require("../db");

// Crear una canción
const createSong = (req, res) => {
  const { tittle, duration, author_id, album_id } = req.body;

  const query = ` INSERT INTO songs (tittle, duration, author_id, album_id) VALUES (?, ?, ?, ?)`;
  db.query(
    query,
    [tittle, duration, author_id, album_id || null],
    (err, result) => {
      if (err) {
        console.error("Error al crear canción: ", err.message);
        return res.status(500).json({ error: "Error al crear cancion" });
      }
      res.status(201).json({ message: "Canción creada", id: result.insertId });
    }
  );
};

// Obtener todas las canciones
const getAllSongs = (req, res) => {
  const query = `SELECT * FROM songs`;
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error al obtener canciones: ", err.message);
      return res.status(500).json({ error: "Error al obtener los datos" });
    }
    res.json(results);
  });
};

// Obtener una canción por ID
const getSongById = (req, res) => {
  const { id } = req.params;

  const query = `SELECT * FROM songs WHERE id = ?`;
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error al obtener la canción: ", err.message);
      return res.status(500).json({ error: "Error al obtener la canción" });
    }
    if (results.length === 0) {
      return res.status(404).jason({ message: "No se encontró la canción" });
    }
    res.json(results[0]);
  });
};

// Actualizar una canción
const updateSong = (req, res) => {
  const { id } = req.params;
  const { tittle, duration } = req.body;

  const query = `UPDATE songs SET title = ?, duration = ? WHERE id = ?`;
  db.query(query, [tittle, duration, id], (err, result) => {
    if (err) {
      console.error("Error al actualizar canción: ", err.message);
      return res.status(500).json({ error: "Error al actualizar canción" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Canción no encontrada" });
    }
    res.json({ message: "Canción actualizada" });
  });
};

// Eliminar una canción
const deleteSong = (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM songs WHERE id = ?`;
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error al eliminar canción ", err.message);
      return res.status(500).json({ error: "Error al eliminar canción" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Canción no encontrada" });
    }
    res.json({ message: "Canción eliminada" });
  });
};

// Exportar controladores
module.exports = {
  createSong,
  getAllSongs,
  getSongById,
  updateSong,
  deleteSong,
};
