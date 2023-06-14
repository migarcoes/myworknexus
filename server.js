const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs'); 

const app = express();
const port = 8000;

// Habilitar CORS
app.use(cors());

// Configurar el middleware para parsear JSON
app.use(express.json());

// Configurar la ruta para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a la base de datos
const dbPath = path.join(__dirname, 'users.db');
const dbExists = fs.existsSync(dbPath);

if (!dbExists) {
  console.error('El archivo de base de datos no existe');
  process.exit(1);
}

const db = new sqlite3.Database(dbPath);

// Manejar la solicitud POST para iniciar sesión
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Verificar las credenciales del usuario en la base de datos 
  const checkCredentialsQuery = `SELECT * FROM users WHERE username = ? AND password = ?`;
  db.get(checkCredentialsQuery, [username, password], (err, row) => {
    if (err) {
      console.error('Error al verificar las credenciales:', err);
      res.status(500).json({ error: 'Ocurrió un error al verificar las credenciales' });
    } else if (row) {
      console.log('Inicio de sesión exitoso:', row);
      res.status(200).json({ message: 'Inicio de sesión exitoso' });
    } else {
      console.log('Credenciales inválidas');
      res.status(401).json({ error: 'Credenciales inválidas' });
    }
  });
});

// Manejar la solicitud POST para agregar un nuevo usuario
app.post('/signup', (req, res) => {
  const { username, email, password } = req.body;

  // Verificar si el usuario ya existe en la base de datos
  const checkDuplicateQuery = 'SELECT * FROM users WHERE username = ?';
  db.get(checkDuplicateQuery, [username], (err, row) => {
    if (err) {
      console.error('Error al verificar duplicados:', err);
      res.status(500).json({ error: 'Ocurrió un error al verificar duplicados' });
    } else if (row) {
      console.log('Usuario duplicado:', row);
      res.status(400).json({ error: 'Ya existe un usuario con el mismo nombre de usuario' });
    } else {
      // Insertar el usuario en la base de datos
      const insertUserQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
      db.run(insertUserQuery, [username, email, password], function (err) {
        if (err) {
          console.error('Error al insertar usuario:', err);
          res.status(500).json({ error: 'Ocurrió un error al agregar el usuario' });
        } else {
          console.log('Usuario agregado:', this.lastID);
          res.json({ message: 'Usuario agregado exitosamente' });
        }
      });
    }
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
