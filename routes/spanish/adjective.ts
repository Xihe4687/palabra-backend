import { Router } from "express";
import connection, {runQuery} from "../../db/connection.ts";
import type { SpanishAdjective } from "../../types/spanish/adjective";
const router = Router();
router.get('/', async (req, res) => {
  try {
    const rows = await runQuery('select * from spanish_adjectives');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error executing error: ', error);
    res.status(500).json(error);
  }
})

router.get('/random', async (req, res) => {
  try {
    const limit = parseInt(String(req.query.limit)) || 10;
    const query = `SELECT TOP ${limit} * FROM spanish_adjectives ORDER BY -LOG((ABS(CHECKSUM(NEWID())) + 1) / 2147483648.0) / LOG(wrongTimes + 100);`;
    const rows = await runQuery(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error executing error: ', error);
    res.status(500).json(error);
  }
})

router.get('/:id', async (req, res) => {
  try {
    const id = +req.params.id;
    const query = `select * from spanish_adjectives where id = ?`;
    const rows = await runQuery(query, [id]);
    if (rows.length) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ error: 'No records found.' });
    }
  } catch (error) {
    console.error('Error executing error: ', error);
    res.status(500).json(error);
  }
})

router.put('/:id', async (req, res) => {
  try {
    const id = +req.params.id;
    const payload = req.body as SpanishAdjective;
    const fields = Object.keys(payload).filter(f => f !== 'id') as (keyof SpanishAdjective)[];
    const values = fields.map(f => payload[f]);
    const setClause = fields.map(f => `${f} = ?`).join(', ');
    const query = `update spanish_adjectives set ${setClause} where id = ?`;
    await runQuery(query, [...values, id]);
    const rows = await runQuery('select * from spanish_adjectives where id = ?', [id]);
    if (rows.length) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ error: 'No records found.' });
    }
  } catch (error) {
    console.error('Error executing error: ', error);
    res.status(500).json(error);
  }
})

router.post('/', async (req, res) => {
  try {
    const payload = req.body as SpanishAdjective;
    const fields = Object.keys(payload).filter(f => f !== 'id') as (keyof SpanishAdjective)[];
    const values = fields.map(f => typeof payload[f] === 'string' ? `N'${payload[f]}'` : payload[f]);
    const insertClause = fields.join(', ')
    const insertValues = values.join(', ')
    const query = `insert into spanish_adjectives (${insertClause}) values (${insertValues})`;
    await runQuery(query);
    const rows = await runQuery('select * from spanish_adjectives where spanish = ?', [payload.spanish]);
    if (rows.length) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ error: 'No records found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
})

export default router;