const db = require("../db");

// Crear una canción
const createSong = (req, res) => {
  const { title, duration, author_id, album_id } = req.body;
  console.log("Datos:", req.body); // Verifica los datos exactos que el servidor recibe

  if (!title || !author_id || !album_id) {
    return res
      .status(400)
      .json({ error: "Faltan campos obligatorios: título, autor o álbum." });
  }

  if (duration && !/^(\d{1,2}):(\d{2})$/.test(duration)) {
    return res
      .status(400)
      .json({ error: "Formato de duración no válido. Usa HH:mm." });
  }

  const query = `INSERT INTO songs (title, duration, author_id, album_id) VALUES (?, ?, ?, ?)`;

  db.query(
    query,
    [title, duration, author_id, album_id || null],
    (err, result) => {
      if (err) {
        console.error("Error al crear canción:", err.message);
        return res
          .status(500)
          .json({ error: "Error al crear canción", details: err.message });
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

// Get Songs
const getSongs = async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
          SELECT 
              s.id AS song_id,
              s.title AS song_title,
              s.duration,
              a.name AS author_name,
              al.title AS album_title,
              al.id AS album_id
          FROM 
              songs s
          JOIN 
              authors a ON s.author_id = a.id
          LEFT JOIN 
              albums al ON s.album_id = al.id
      `);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching songs:", error);
    res.status(500).json({ error: "Failed to fetch songs" });
  }
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
      return res.status(404).json({ message: "No se encontró la canción" });
    }
    res.json(results[0]);
  });
};

// // Actualizar una canción
// const updateSong = (req, res) => {
//   const { id } = req.params;
//   const { tittle, duration } = req.body;

//   const query = `UPDATE songs SET title = ?, duration = ? WHERE id = ?`;
//   db.query(query, [tittle, duration, id], (err, result) => {
//     if (err) {
//       console.error("Error al actualizar canción: ", err.message);
//       return res.status(500).json({ error: "Error al actualizar canción" });
//     }
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: "Canción no encontrada" });
//     }
//     res.json({ message: "Canción actualizada" });
//   });
// };

const updateSong = (req, res) => {
  const { id } = req.params;
  const { song_title, author_id, album_id } = req.body; // Ajustar para coincidir con los nombres de las claves
  
  // Validar que al menos un campo esté presente
  if (!song_title && !author_id && !album_id) {
    return res.status(400).json({ message: "No hay datos para actualizar." });
  }

  console.log("Datos de la canción a actualizar:", req.body);

  let query = "UPDATE songs SET ";
  let params = [];

  // Construir dinámicamente la consulta
  if (song_title) {
    query += "title = ?, ";
    params.push(song_title);
  }
  if (author_id) {
    query += "author_id = ?, ";
    params.push(author_id);
  }
  if (album_id) {
    query += "album_id = ?, ";
    params.push(album_id);
  }

  // Quitar la última coma y espacio, y agregar la condición WHERE
  query = query.slice(0, -2) + " WHERE id = ?";
  params.push(id);

  console.log("Query final:", query);
  console.log("Parámetros:", params);

  // Ejecutar la consulta
  db.query(query, params, (err, results) => {
    if (err) {
      console.error("Error al actualizar la canción:", err);
      return res.status(500).json({ error: "Error interno del servidor." });
    }

    // Verificar si se actualizó algún registro
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "La canción no existe." });
    }

    res.json({ message: "¡Canción actualizada con éxito!" });
  });
};


// Eliminar una canción
const deleteSong = (req, res) => {
  const { id } = req.params;
  console.log("ID de la canción a eliminar:", id);

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
  getSongs,
};
