const mysql = require("mysql2");

// configurar la conexión
const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "root",
  database: "music",
});

// Conectar MYSQL
db.connect((err) => {
  if (err) {
    console.log("Error conectando a mySQL", err.message);
    return;
  }
  console.log("Conexion exitosa a MySQL");
});

module.exports = db;
