const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const cors = require('cors');  // Importando o CORS

const app = express();
app.use(cors());  // Habilita CORS
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

const connection = mysql.createConnection({
  host: '10.111.4.30',  
  user: 'dev1b',         
  password: 'Sen4i2024', 
  database: 'dev1b'     
});

connection.connect((err) => {
  if (err) {
    console.error('Erro MySQL:', err);
    return;
  }
  console.log('MySQL---ON!');
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/crud', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'crud.html'));
});

// login
app.post('/api/login', (req, res) => {
  const { User, Senha } = req.body;
  const query = 'SELECT * FROM gm_users WHERE User = ? AND Senha = ?';

  connection.execute(query, [User, Senha], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro ao consultar os dados' });
    
    if (results.length > 0) {
        res.json({ success: true });
    } else {
      res.status(401).json({ success: false, message: 'Login inválido' });
    }
  });
});

// registros
app.get('/api/registros', (req, res) => {
  connection.execute('SELECT * FROM gm_registros', (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro ao obter os registros' });
    res.json(results);
  });
});

// novo registro
app.post('/api/registros', (req, res) => {
  const { Nome, Perfil } = req.body;
  if (!Nome || !Perfil) return res.status(400).json({ error: 'Todos os campos são obrigatórios' });

  const query = 'INSERT INTO gm_registros (Nome, Perfil) VALUES (?, ?)';
  connection.execute(query, [Nome, Perfil], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro ao adicionar registro' });
    res.json({ success: true, id: results.insertId });
  });
});

// Editar registro
app.put('/api/registros/:id', (req, res) => {
  const { id } = req.params;
  const { Nome, Perfil } = req.body;

  const query = 'UPDATE gm_registros SET Nome = ?, Perfil = ? WHERE ID = ?';
  connection.execute(query, [Nome, Perfil, id], (err) => {
    if (err) return res.status(500).json({ error: 'Erro ao editar registro' });
    res.json({ success: true });
  });
});

// Excluir registro
app.delete('/api/registros/:id', (req, res) => {
  const { id } = req.params;
  
  const query = 'DELETE FROM gm_registros WHERE ID = ?';
  connection.execute(query, [id], (err) => {
    if (err) return res.status(500).json({ error: 'Erro ao excluir registro' });
    res.json({ success: true });
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Porta ${PORT}`);
});
