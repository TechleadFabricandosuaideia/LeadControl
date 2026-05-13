import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { getDb } from '../db.js';

const router = Router();

router.post('/login', (req, res) => {
  const { emailOrName, password } = req.body;

  if (!emailOrName || !password) {
    return res.status(400).json({ error: 'Email/nome e senha são obrigatórios.' });
  }

  const db = getDb();
  const user = db.prepare(
    'SELECT * FROM users WHERE email = ? OR name = ?'
  ).get(emailOrName, emailOrName);

  if (!user) {
    return res.status(401).json({ error: 'Nome ou email incorreto.' });
  }

  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) {
    return res.status(401).json({ error: 'Credenciais de login inválidas.' });
  }

  res.json({
    success: true,
    user: { id: user.id, name: user.name, email: user.email }
  });
});

router.get('/users', (req, res) => {
  const db = getDb();
  const users = db.prepare('SELECT id, name, email FROM users ORDER BY name').all();
  res.json(users);
});

router.post('/users', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
  }

  const db = getDb();

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    return res.status(409).json({ error: 'Já existe um usuário com este email.' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const result = db.prepare(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)'
  ).run(name, email, hashedPassword);

  res.status(201).json({
    success: true,
    user: { id: result.lastInsertRowid, name, email }
  });
});

router.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Nome e email são obrigatórios.' });
  }

  const db = getDb();

  const existing = db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(email, id);
  if (existing) {
    return res.status(409).json({ error: 'Email já está em uso por outro usuário.' });
  }

  if (password) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    db.prepare(
      'UPDATE users SET name = ?, email = ?, password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).run(name, email, hashedPassword, id);
  } else {
    db.prepare(
      'UPDATE users SET name = ?, email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).run(name, email, id);
  }

  res.json({ success: true, user: { id, name, email } });
});

router.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  const db = getDb();
  db.prepare('DELETE FROM users WHERE id = ?').run(id);
  res.json({ success: true });
});

export default router;
