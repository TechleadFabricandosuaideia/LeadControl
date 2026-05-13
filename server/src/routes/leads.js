import { Router } from 'express';
import { getDb } from '../db.js';

const router = Router();

router.get('/', (req, res) => {
  const db = getDb();
  const leads = db.prepare('SELECT * FROM leads ORDER BY created_at DESC').all();
  res.json({ results: leads });
});

router.post('/', (req, res) => {
  const { company, contact, email, phone, status, priority, notes } = req.body;

  if (!company || !contact) {
    return res.status(400).json({ error: 'Empresa e contato são obrigatórios.' });
  }

  const db = getDb();
  const result = db.prepare(
    'INSERT INTO leads (company, contact, email, phone, status, priority, notes) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(company, contact, email, phone, status || 'Novo', priority || 'Média', notes || '');

  const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(lead);
});

router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const { company, contact, email, phone, status, priority, notes } = req.body;

  const db = getDb();
  const existing = db.prepare('SELECT id FROM leads WHERE id = ?').get(id);

  if (!existing) {
    return res.status(404).json({ error: 'Lead não encontrado.' });
  }

  const updates = [];
  const values = [];

  if (company !== undefined) { updates.push('company = ?'); values.push(company); }
  if (contact !== undefined) { updates.push('contact = ?'); values.push(contact); }
  if (email !== undefined) { updates.push('email = ?'); values.push(email); }
  if (phone !== undefined) { updates.push('phone = ?'); values.push(phone); }
  if (status !== undefined) { updates.push('status = ?'); values.push(status); }
  if (priority !== undefined) { updates.push('priority = ?'); values.push(priority); }
  if (notes !== undefined) { updates.push('notes = ?'); values.push(notes); }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'Nenhum campo para atualizar.' });
  }

  updates.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);

  const query = `UPDATE leads SET ${updates.join(', ')} WHERE id = ?`;
  db.prepare(query).run(...values);

  const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(id);
  res.json(lead);
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const db = getDb();

  const existing = db.prepare('SELECT id FROM leads WHERE id = ?').get(id);
  if (!existing) {
    return res.status(404).json({ error: 'Lead não encontrado.' });
  }

  db.prepare('DELETE FROM leads WHERE id = ?').run(id);
  res.json({ success: true });
});

export default router;
