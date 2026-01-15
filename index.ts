import express from 'express';
import cors from 'cors'
// import { Pool } from 'pg';
import nounsRouter from './routes/spanish/noun.ts';
import adjRouter from './routes/spanish/adjective.ts'
import verbRouter from './routes/spanish/verb.ts';
import advRouter from './routes/spanish/adverb.ts';
import prepositionRouter from './routes/spanish/preposition.ts'

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/spanish/nouns', nounsRouter);
app.use('/api/spanish/adjectives', adjRouter);
app.use('/api/spanish/verbs', verbRouter);
app.use('/api/spanish/adverbs', advRouter);
app.use('/api/spanish/prepositions', prepositionRouter);


const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

