import { Router } from "express";
import connection, {runQuery} from "../../db/connection.ts";
import type { SpanishNoun } from "../../types/spanish/noun.ts";
const router = Router();
router.get('/', (req, res) => {
  connection?.query('SELECT * FROM spanish_nouns', (err, rows?: SpanishNoun[]) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(rows);
    }
  })
})
router.get('/random', (req, res) => {
  const limit = parseInt(String(req.query.limit)) || 10;
  const query = `SELECT TOP ${limit} * FROM spanish_nouns ORDER BY -LOG((ABS(CHECKSUM(NEWID())) + 1) / 2147483648.0) / LOG(wrongTimes + 100);`;
  connection?.query(query, (err, rows) => {
    if (err) {
      console.log(err);
      res.status(500).json(err);
    } else {
      if (rows) {
        res.json(rows);
      }
    }
  })
})
router.get('/:id', (req, res) => {
  const { id } = req.params; // 讀取路由參數
  connection?.query(
    'SELECT * FROM spanish_nouns WHERE id = ?',
    [id], // 用參數化避免 SQL injection
    (err, rows: SpanishNoun[] | undefined) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else if (rows) {
        if (!rows.length) {
          res.status(404).json({ error: 'Not Found' });
        } else {
          res.json(rows[0]);
        }
      }
    }
  );
});
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const payload: SpanishNoun = req.body;

    const fields = Object.keys(payload).filter(f => f !== 'id') as (keyof SpanishNoun)[];
    const values = fields.map(f => payload[f]);
    const setClause = fields.map(f => `${f} = ?`).join(', ');

    // 第一句：更新
    await runQuery(`UPDATE spanish_nouns SET ${setClause} WHERE id = ?`, [...values, id]);

    // 第二句：查詢更新後的結果
    const rows = await runQuery(`SELECT * FROM spanish_nouns WHERE id = ?`, [id]);

    if (rows.length) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: 'No records found.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const payload: SpanishNoun = req.body;
    const fields = Object.keys(payload).filter(f => f !== 'id') as (keyof SpanishNoun)[];
    const values = fields.map(f => typeof payload[f] === 'string' ? `N'${payload[f]}'` : payload[f]);
    const insertClause = fields.join(', ');
    const insertValues = values.join(', ')
    await runQuery(`insert into spanish_nouns (${insertClause}) values (${insertValues});`);
    const rows = await runQuery('select * from spanish_nouns where spanish = ?', [payload.spanish])
    if (rows) {
      if (rows.length) {
        res.status(201).json(rows[0]);
      } else {
        res.status(404).json({ error: 'Record created but no records found.' });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
})

export default router;