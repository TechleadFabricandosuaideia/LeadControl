import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import leadsRoutes from './routes/leads.js';
import { getDb } from './db.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

getDb();

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
