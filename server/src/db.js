import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'leadcontrol.db');

let db;

export function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initSchema();
    seedDefaultUser();
    seedExampleLeads();
  }
  return db;
}

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company TEXT NOT NULL,
      contact TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      status TEXT DEFAULT 'Novo',
      priority TEXT DEFAULT 'Média',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

function seedDefaultUser() {
  const count = db.prepare('SELECT COUNT(*) as count FROM users').get();
  if (count.count === 0) {
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    db.prepare(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)'
    ).run('Admin', 'admin@example.com', hashedPassword);
    console.log('Default user seeded: admin@example.com / admin123');
  }
}

function seedExampleLeads() {
  const count = db.prepare('SELECT COUNT(*) as count FROM leads').get();
  if (count.count === 0) {
    const leads = [
      {
        company: 'Tech Solutions Brasil',
        contact: 'João Silva',
        email: 'joao@techsolutions.com.br',
        phone: '(11) 98765-4321',
        status: 'Novo',
        priority: 'Alta',
        notes: 'Contato indireto, precisa de proposta customizada'
      },
      {
        company: 'Innovate Systems',
        contact: 'Maria Santos',
        email: 'maria@innovate.com',
        phone: '(21) 99876-5432',
        status: 'Contatado',
        priority: 'Média',
        notes: 'Interessada em consultoria, agendado para próxima semana'
      },
      {
        company: 'Digital Transformation Ltd',
        contact: 'Carlos Mendes',
        email: 'carlos@digitaltransf.com',
        phone: '(85) 98765-0987',
        status: 'Negociação',
        priority: 'Alta',
        notes: 'Em fase de negociação, aguardando aprovação do orçamento'
      }
    ];

    const insertStmt = db.prepare(
      'INSERT INTO leads (company, contact, email, phone, status, priority, notes) VALUES (?, ?, ?, ?, ?, ?, ?)'
    );

    leads.forEach(lead => {
      insertStmt.run(lead.company, lead.contact, lead.email, lead.phone, lead.status, lead.priority, lead.notes);
    });

    console.log('Example leads seeded: 3 leads added');
  }
}
