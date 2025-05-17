import { DatabaseSync } from 'node:sqlite';

import express from 'express';
import cors from 'cors';
import slugify from 'slugify';

const db = new DatabaseSync('app.db');


db.exec(`
  CREATE TABLE IF NOT EXISTS knowledge (
    topic TEXT PRIMARY KEY,
    content TEXT NOT NULL
  )
`);

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/knowledge', (req, res) => {
  const topic = req.query.topic?.toString();

  if (!topic) {
    const stmt = db.prepare('SELECT topic FROM knowledge');
    const topics = stmt.all() as { topic: string }[];
    return res.json(topics.map((topic) => topic.topic));
  }

  const stmt = db.prepare(
    'SELECT * FROM knowledge WHERE UPPER(topic) = UPPER($topic)'
  );
  const topicData = stmt.get({ $topic: topic });

  if (!topicData) {
    return res.status(404).send('Topic not found');
  }

  res.json(topicData);
});

app.post('/knowledge', (req, res) => {
  const { topic, content } = req.body;

  if (!topic || !content) {
    return res.status(400).send('Missing topic or content');
  }

  const topicIdentifierSlug = slugify.default(topic);

  const stmt = db.prepare(
    'INSERT INTO knowledge (topic, content) VALUES ($topic, $content)'
  );
  try {
    stmt.run({ $topic: topicIdentifierSlug, $content: content });
    res.status(201).send('Knowledge created');
  } catch (error) {
    return res.status(409).send('Topic already exists');
  }
});

app.listen(8080);
