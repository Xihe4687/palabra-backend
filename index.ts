import express from 'express';
import cors from 'cors'
import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

app.get('/api/spanish_nouns', async (req, res) => {
  const result = await pool.query('SELECT * FROM spanish_nouns')
  res.json(result.rows);
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

