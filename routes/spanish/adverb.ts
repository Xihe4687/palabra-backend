import { Router } from "express";
import connection, {runQuery} from "../../db/connection.ts";
import type { SpanishAdverb } from "../../types/spanish/adverb.ts";
const router = Router();
router.get('/', async (req, res) => {
  try {
    const rows = await runQuery('select * from spanish_adverbs');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error executing error: ', error);
    res.status(500).json(error);
  }
})

router.get('/random', async (req, res) => {
  try {
    const limit = parseInt(String(req.query.limit)) || 10;
    const query = `SELECT TOP ${limit} * FROM spanish_adverbs ORDER BY -LOG((ABS(CHECKSUM(NEWID())) + 1) / 2147483648.0) / (TRY_CAST(wrongTimes AS float) + 1);`;
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
    const query = `select * from spanish_adverbs where id = ?`;
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
    const payload = req.body as SpanishAdverb;
    const fields = Object.keys(payload).filter(f => f !== 'id') as (keyof SpanishAdverb)[];
    const values = fields.map(f => payload[f]);
    const setClause = fields.map(f => `${f} = ?`).join(', ');
    const query = `update spanish_adverbs set ${setClause} where id = ?`;
    await runQuery(query, [...values, id]);
    const rows = await runQuery('select * from spanish_adverbs where id = ?', [id]);
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
    const payload = req.body as SpanishAdverb;
    const fields = Object.keys(payload).filter(f => f !== 'id') as (keyof SpanishAdverb)[];
    const values = fields.map(f => typeof payload[f] === 'string' ? `'${payload[f]}'` : payload[f]);
    const insertClause = fields.join(', ')
    const insertValues = values.join(', ')
    const query = `insert into spanish_adverbs (${insertClause}) values (${insertValues})`;
    await runQuery(query);
    const rows = await runQuery('select * from spanish_adverbs where spanish = ?', [payload.spanish]);
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