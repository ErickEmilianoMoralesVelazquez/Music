const db = require("../db");

// Obtener todos los álbumes
// const getAlbums = (req, res) => {
//   const query = `SELECT id, title FROM albums`; // Ajusta la consulta según tu estructura de base de datos
//   db.query(query, (err, results) => {
//     if (err) {
//       console.error("Error al obtener álbumes: ", err.message);
//       return res.status(500).json({ error: "Error al obtener los álbumes" });
//     }
//     res.json(results);
//   });
// };

const getAlbums = (req, res) => {
  const query = `
    SELECT 
      albums.id AS album_id, 
      albums.title AS album_title, 
      albums.img_url, 
      authors.name AS author_name
    FROM albums
    LEFT JOIN authors ON albums.author_id = authors.id
  `; // Incluimos la columna image_url
  // log con los datos
  // console.log('query', query);

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    // Devolver los álbumes con la URL de la imagen
    res.json(results);
  });
};



// Obtener un álbum por ID
const getAlbumById = (req, res) => {
  const { id } = req.params;

  const query = `SELECT * FROM albums WHERE id = ?`;
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error al obtener el álbum: ", err.message);
      return res.status(500).json({ error: "Error al obtener el álbum" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "No se encontró el álbum" });
    }
    res.json(results[0]);
  });
};

// Crear un nuevo álbum
const createAlbum = (req, res) => {
  const { title } = req.body;

  const query = `INSERT INTO albums (title) VALUES (?)`;
  db.query(query, [title], (err, result) => {
    if (err) {
      console.error("Error al crear el álbum: ", err.message);
      return res.status(500).json({ error: "Error al crear el álbum" });
    }
    res.status(201).json({ message: "Álbum creado", id: result.insertId });
  });
};

// Actualizar un álbum por ID
const updateAlbum = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const query = `UPDATE albums SET title = ? WHERE id = ?`;
  db.query(query, [title, id], (err, result) => {
    if (err) {
      console.error("Error al actualizar el álbum: ", err.message);
      return res.status(500).json({ error: "Error al actualizar el álbum" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Álbum no encontrado" });
    }
    res.json({ message: "Álbum actualizado" });
  });
};

// Eliminar un álbum por ID
const deleteAlbum = (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM albums WHERE id = ?`;
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error al eliminar el álbum: ", err.message);
      return res.status(500).json({ error: "Error al eliminar el álbum" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Álbum no encontrado" });
    }
    res.json({ message: "Álbum eliminado" });
  });
};

module.exports = {
  getAlbums,
  getAlbumById,
  createAlbum,
  updateAlbum,
  deleteAlbum,
};
