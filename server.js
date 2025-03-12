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

// Página de login
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Página de CRUD (somente acessada após login)
app.get('/crud', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'crud.html'));
});

// Login
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

// Listar usuários
app.get('/api/users', (req, res) => {
  connection.execute('SELECT * FROM gm_users', (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro ao obter os usuários' });
    res.json(results);
  });
});

// Adicionar novo usuário
app.post('/api/users', (req, res) => {
  const { User, Senha, Perfil } = req.body;
  if (!User || !Senha || !Perfil) return res.status(400).json({ error: 'Todos os campos são obrigatórios' });

  const query = 'INSERT INTO gm_users (User, Senha, Perfil) VALUES (?, ?, ?)';
  connection.execute(query, [User, Senha, Perfil], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro ao adicionar usuário' });
    res.json({ success: true, id: results.insertId });
  });
});

// Editar usuário
app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const { User, Senha, Perfil } = req.body;

  const query = 'UPDATE gm_users SET User = ?, Senha = ?, Perfil = ? WHERE ID = ?';
  connection.execute(query, [User, Senha, Perfil, id], (err) => {
    if (err) return res.status(500).json({ error: 'Erro ao editar usuário' });
    res.json({ success: true });
  });
});

// Excluir usuário
app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  
  const query = 'DELETE FROM gm_users WHERE ID = ?';
  connection.execute(query, [id], (err) => {
    if (err) return res.status(500).json({ error: 'Erro ao excluir usuário' });
    res.json({ success: true });
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
