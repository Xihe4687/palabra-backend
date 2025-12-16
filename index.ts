import express from 'express';
import cors from 'cors'
import sql from 'msnodesqlv8';
// import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
let connection: MsNodeSqlV8.Connection;
sql.open(process.env.MSSQL_CONNECTION_STRING!, (err, conn) => {
  if (err) {
    console.error('Error connecting to MSSQL:', err);
  } else {
    connection = conn;
    console.log('Connected to MSSQL database');
  }
});

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false
//   }
// })

app.get('/api/spanish_nouns', async (req, res) => {
  connection.query('SELECT * FROM spanish_nouns', (err, rows) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(rows);
    }
  });
})

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

